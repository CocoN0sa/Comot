const databaseName = "comot_venue_database";
const databaseVersion = 1;
const storeName = "submissions";
const legacyStorageKey = "comot_venue_submissions";
const updateStorageKey = "comot_venue_submissions_updated";

let databasePromise;

function openDatabase() {
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(databaseName, databaseVersion);

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return databasePromise;
}

function readFromDatabase(database) {
  return new Promise((resolve, reject) => {
    const request = database
      .transaction(storeName, "readonly")
      .objectStore(storeName)
      .getAll();

    request.onsuccess = () => {
      const submissions = request.result || [];
      submissions.sort((left, right) =>
        right.submittedAt.localeCompare(left.submittedAt),
      );
      resolve(submissions);
    };
    request.onerror = () => reject(request.error);
  });
}

function saveToDatabase(database, submissions) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.clear();
    submissions.forEach((submission) => store.put(submission));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function announceUpdate() {
  window.localStorage.setItem(updateStorageKey, String(Date.now()));
}

export async function readVenueSubmissions() {
  const database = await openDatabase();
  const submissions = await readFromDatabase(database);
  if (submissions.length) return submissions;

  const legacyData = window.localStorage.getItem(legacyStorageKey);
  if (!legacyData) return submissions;

  try {
    const legacySubmissions = JSON.parse(legacyData);
    if (!Array.isArray(legacySubmissions) || !legacySubmissions.length) {
      return submissions;
    }
    await saveToDatabase(database, legacySubmissions);
    window.localStorage.removeItem(legacyStorageKey);
    return legacySubmissions;
  } catch {
    return submissions;
  }
}

export async function writeVenueSubmissions(submissions) {
  const database = await openDatabase();
  await saveToDatabase(database, submissions);
  announceUpdate();
}

export function createVenueRecord(venue, status = "pending") {
  const photos = (venue.photos || []).map((photo) => {
    if (typeof photo === "string") return { name: photo };

    const blob = photo instanceof Blob ? photo : photo.blob;
    return {
      name: photo.name,
      type: photo.type,
      size: photo.size,
      ...(blob ? { blob } : {}),
    };
  });

  return {
    ...venue,
    id:
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    submittedAt: new Date().toISOString(),
    status,
    photos,
  };
}

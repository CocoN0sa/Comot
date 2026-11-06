const databaseName = "comot_experience_database";
const databaseVersion = 1;
const storeName = "submissions";
const updateStorageKey = "comot_experience_submissions_updated";

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

export async function readExperienceSubmissions() {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database
      .transaction(storeName, "readonly")
      .objectStore(storeName)
      .getAll();
    request.onsuccess = () => {
      const submissions = request.result || [];
      submissions.sort((left, right) =>
        (right.submittedAt || "").localeCompare(left.submittedAt || ""),
      );
      resolve(submissions);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function writeExperienceSubmissions(submissions) {
  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.clear();
    submissions.forEach((submission) => store.put(submission));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  window.localStorage.setItem(updateStorageKey, String(Date.now()));
}

export function createExperienceRecord(experience, status = "pending") {
  const photos = (experience.photos || []).map((photo) => {
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
    ...experience,
    id:
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    submittedAt: new Date().toISOString(),
    status,
    photos,
  };
}

export { updateStorageKey as experienceSubmissionsUpdateKey };

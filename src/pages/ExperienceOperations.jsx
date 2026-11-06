import React, { useEffect, useMemo, useState } from "react";
import {
  createExperienceRecord,
  experienceSubmissionsUpdateKey,
  readExperienceSubmissions,
  writeExperienceSubmissions,
} from "../utils/experienceSubmissions";
import "./ExperienceOperations.css";

const filters = ["all", "pending", "approved", "declined", "deleted"];
const categories = [
  "Outdoor / Nature",
  "Food and Drinks",
  "Games and Activities",
  "Arts and Culture",
  "Fitness and Wellness",
  "Music and Entertainment",
  "Social Hangout",
  "Other",
];

const blankEvent = {
  experienceName: "",
  description: "",
  category: "",
  date: "",
  startTime: "",
  venueName: "",
  venueAddress: "",
  neighbourhood: "",
  commitmentFee: "0",
  groupSize: "",
  genderComposition: "Mixed",
  hostName: "Comot",
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? "—"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function ExperienceStatus({ status }) {
  return (
    <span className={`experience-admin-status is-${status}`}>
      {status}
    </span>
  );
}

function ReviewCoverPhoto({ blob }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob);
    setSrc(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  return src ? (
    <img
      className="experience-admin-review-image"
      src={src}
      alt="Experience cover"
    />
  ) : null;
}

export default function ExperienceOperations() {
  const [experiences, setExperiences] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const refresh = async (event) => {
      if (
        event &&
        event.key !== experienceSubmissionsUpdateKey &&
        event.key !== null
      ) {
        return;
      }
      try {
        const submissions = await readExperienceSubmissions();
        if (isMounted) {
          setExperiences(submissions);
          setStorageError("");
        }
      } catch {
        if (isMounted) {
          setStorageError("Experience submissions could not be loaded.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    refresh();
    window.addEventListener("storage", refresh);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        filters.map((status) => [
          status,
          status === "all"
            ? experiences.length
            : experiences.filter((item) => item.status === status).length,
        ]),
      ),
    [experiences],
  );

  const visibleExperiences = useMemo(() => {
    const query = search.trim().toLowerCase();
    return experiences.filter((item) => {
      const matchesStatus = filter === "all" || item.status === filter;
      const matchesSearch =
        !query ||
        [
          item.experienceName,
          item.category,
          item.venueName,
          item.neighbourhood,
          item.hostName,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [experiences, filter, search]);

  const saveExperiences = async (next) => {
    try {
      await writeExperienceSubmissions(next);
      setExperiences(next);
      setStorageError("");
      return true;
    } catch {
      setStorageError("Changes could not be saved in this browser.");
      return false;
    }
  };

  const updateStatus = async (id, status) => {
    await saveExperiences(
      experiences.map((item) =>
        item.id === id
          ? { ...item, status, reviewedAt: new Date().toISOString() }
          : item,
      ),
    );
    setSelectedExperience(null);
  };

  const addEvent = async (event) => {
    const { coverPhoto, ...details } = event;
    const next = [
      createExperienceRecord(
        { ...details, photos: coverPhoto ? [coverPhoto] : [] },
        "approved",
      ),
      ...experiences,
    ];
    if (await saveExperiences(next)) {
      setShowAddEvent(false);
      setFilter("approved");
      setSearch("");
    }
  };

  return (
    <section className="experience-operations" aria-labelledby="experience-operations-title">
      <header className="experience-operations-header">
        <div>
          <p>EXPERIENCE OPERATIONS</p>
          <h2 id="experience-operations-title">Experience submissions</h2>
          <span>Review host submissions or publish an event directly.</span>
        </div>
        <button
          type="button"
          className="experience-operations-add"
          onClick={() => setShowAddEvent(true)}
        >
          + Add Event
        </button>
      </header>

      <div className="experience-operations-summary" aria-label="Experience totals">
        {filters.map((status) => (
          <div key={status}>
            <strong>{counts[status]}</strong>
            <span>{status === "all" ? "Total events" : status}</span>
          </div>
        ))}
      </div>

      <div className="experience-operations-panel">
        <div className="experience-operations-toolbar">
          <div className="experience-operations-filters" role="tablist" aria-label="Filter experiences">
            {filters.map((status) => (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={filter === status}
                onClick={() => setFilter(status)}
              >
                {status === "all" ? "All events" : status}
                <span>{counts[status]}</span>
              </button>
            ))}
          </div>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search experiences"
            aria-label="Search experiences"
          />
        </div>

        {storageError && <p className="experience-operations-error" role="alert">{storageError}</p>}
        <div className="experience-operations-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Experience</th>
                <th>Category / area</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleExperiences.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.experienceName || "Untitled experience"}</strong>
                    <span>Host: {item.hostName || "Not provided"}</span>
                  </td>
                  <td>
                    <strong>{item.category || "Not specified"}</strong>
                    <span>{item.neighbourhood || "Area not specified"}</span>
                  </td>
                  <td>{formatDate(item.submittedAt)}</td>
                  <td><ExperienceStatus status={item.status} /></td>
                  <td>
                    <div className="experience-operations-actions">
                      <button type="button" onClick={() => setSelectedExperience(item)}>
                        Review
                      </button>
                      {item.status === "pending" && (
                        <>
                          <button
                            type="button"
                            className="is-approve"
                            onClick={() => updateStatus(item.id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="is-decline"
                            onClick={() => updateStatus(item.id, "declined")}
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {item.status === "approved" && (
                        <button
                          type="button"
                          className="is-decline"
                          onClick={() => updateStatus(item.id, "deleted")}
                        >
                          Remove
                        </button>
                      )}
                      {item.status === "deleted" && (
                        <button
                          type="button"
                          className="is-approve"
                          onClick={() => updateStatus(item.id, "approved")}
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && visibleExperiences.length === 0 && (
                <tr>
                  <td className="experience-operations-empty" colSpan="5">
                    <strong>
                      {experiences.length
                        ? "No matching experiences"
                        : "No experience submissions yet"}
                    </strong>
                    <span>
                      {experiences.length
                        ? "Try another search or status filter."
                        : "New host submissions will appear here for review."}
                    </span>
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td className="experience-operations-empty" colSpan="5">
                    Loading experience submissions…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedExperience && (
        <ExperienceReviewDialog
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
          onStatusChange={(status) =>
            updateStatus(selectedExperience.id, status)
          }
        />
      )}
      {showAddEvent && (
        <AddEventDialog
          onClose={() => setShowAddEvent(false)}
          onAdd={addEvent}
        />
      )}
    </section>
  );
}

function ExperienceReviewDialog({ experience, onClose, onStatusChange }) {
  const details = [
    ["Description", experience.description],
    ["Category", experience.category],
    ["Group size", experience.groupSize],
    ["Gender composition", experience.genderComposition],
    ["Date and time", [experience.date, experience.startTime].filter(Boolean).join(" · ")],
    ["Duration", experience.duration],
    ["Venue", experience.venueName],
    ["Address", experience.venueAddress],
    ["Area", experience.neighbourhood],
    ["Maps link", experience.mapsLink],
    ["Commitment fee", experience.commitmentFee ? `₦${experience.commitmentFee}` : "Free"],
    ["Fee includes", experience.feeIncludes],
    ["Dress code", experience.dressCode],
    ["What to bring", experience.whatToBring],
    ["Age range", [experience.minimumAge, experience.maximumAge].filter(Boolean).join(" to ")],
    ["Host", experience.hostName],
    ["Host bio", experience.hostBio],
    ["Instagram", experience.instagramHandle ? `@${experience.instagramHandle}` : ""],
    ["WhatsApp", experience.hostPhone],
  ];

  return (
    <div className="experience-admin-overlay" onMouseDown={onClose}>
      <section
        className="experience-admin-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="experience-review-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p>SUBMISSION REVIEW</p>
            <h2 id="experience-review-title">
              {experience.experienceName || "Untitled experience"}
            </h2>
            <span>Submitted {formatDate(experience.submittedAt)}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close review">×</button>
        </header>
        {experience.photos?.[0]?.blob && (
          <ReviewCoverPhoto blob={experience.photos[0].blob} />
        )}
        <div className="experience-admin-details">
          {details.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              {label === "Maps link" && value ? (
                <a href={value} target="_blank" rel="noreferrer">{value}</a>
              ) : (
                <strong>{value || "Not provided"}</strong>
              )}
            </div>
          ))}
        </div>
        <footer>
          <ExperienceStatus status={experience.status} />
          {experience.status === "pending" && (
            <div>
              <button type="button" className="is-decline" onClick={() => onStatusChange("declined")}>
                Decline
              </button>
              <button type="button" className="is-approve" onClick={() => onStatusChange("approved")}>
                Approve experience
              </button>
            </div>
          )}
        </footer>
      </section>
    </div>
  );
}

function AddEventDialog({ onClose, onAdd }) {
  const [event, setEvent] = useState(blankEvent);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [error, setError] = useState("");
  const update = (field, value) =>
    setEvent((current) => ({ ...current, [field]: value }));
  const submit = (submissionEvent) => {
    submissionEvent.preventDefault();
    if (coverPhoto && coverPhoto.size > 5 * 1024 * 1024) {
      setError("The cover photo must be 5MB or smaller.");
      return;
    }
    onAdd({ ...event, coverPhoto });
  };

  return (
    <div className="experience-admin-overlay" onMouseDown={onClose}>
      <section
        className="experience-admin-dialog experience-admin-add-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-event-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p>ADMIN ENTRY</p>
            <h2 id="add-event-title">Add Event</h2>
            <span>This event will be published as approved immediately.</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form">×</button>
        </header>
        <form onSubmit={submit}>
          <label>
            Experience name
            <input required value={event.experienceName} onChange={(e) => update("experienceName", e.target.value)} />
          </label>
          <label>
            Description
            <textarea required maxLength={300} value={event.description} onChange={(e) => update("description", e.target.value)} />
          </label>
          <div className="experience-admin-form-grid">
            <label>
              Category
              <select required value={event.category} onChange={(e) => update("category", e.target.value)}>
                <option value="">Select category</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              Date
              <input required type="date" value={event.date} onChange={(e) => update("date", e.target.value)} />
            </label>
            <label>
              Start time
              <input required type="time" value={event.startTime} onChange={(e) => update("startTime", e.target.value)} />
            </label>
            <label>
              Commitment fee (₦)
              <input required type="number" min="0" value={event.commitmentFee} onChange={(e) => update("commitmentFee", e.target.value)} />
            </label>
            <label>
              Venue name
              <input required value={event.venueName} onChange={(e) => update("venueName", e.target.value)} />
            </label>
            <label>
              Neighbourhood
              <input required value={event.neighbourhood} onChange={(e) => update("neighbourhood", e.target.value)} />
            </label>
          </div>
          <label>
            Venue address
            <input required value={event.venueAddress} onChange={(e) => update("venueAddress", e.target.value)} />
          </label>
          <label>
            Google Maps link
            <input type="url" value={event.mapsLink || ""} onChange={(e) => update("mapsLink", e.target.value)} />
          </label>
          <label>
            Cover photo (optional, max 5MB)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setCoverPhoto(e.target.files?.[0] || null)}
            />
          </label>
          {error && <p className="experience-admin-form-error" role="alert">{error}</p>}
          <footer>
            <button type="button" onClick={onClose}>Cancel</button>
            <button className="is-approve" type="submit">Add approved event</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

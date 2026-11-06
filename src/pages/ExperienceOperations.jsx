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

const neighbourhoods = [
  "Wuse 2",
  "Maitama",
  "Garki",
  "Jabi",
  "Utako",
  "Gwarinpa",
  "Central Area",
  "Asokoro",
  "Wuse",
  "Kubwa",
  "Other — specify",
];

const durations = [
  "1 hour",
  "2 hours",
  "3 hours",
  "4 hours",
  "Half day (5–6 hours)",
  "Full day",
  "Other",
];

const blankEvent = {
  experienceName: "",
  description: "",
  category: "",
  groupSizeType: "limited",
  groupSize: "",
  genderComposition: "Mixed",
  date: "",
  startTime: "",
  duration: "",
  customDuration: "",
  venueName: "",
  venueAddress: "",
  mapsLink: "",
  neighbourhood: "",
  customNeighbourhood: "",
  commitmentFee: "0",
  feeIncludes: "",
  dressCode: "",
  whatToBring: "",
  minimumAge: "21",
  maximumAge: "35",
  hostName: "",
  hostBio: "",
  instagramHandle: "",
  hostPhone: "",
  guidelinesAgreement: false,
  cancellationAgreement: false,
};

function getEarliestDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function imageMeetsMinimumSize(file) {
  return new Promise((resolve) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image.width >= 800 && image.height >= 600);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };
    image.src = objectUrl;
  });
}

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
    const next = [
      createExperienceRecord({ ...event }, "approved"),
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
    [
      "Commitment fee",
      Number(experience.commitmentFee) > 0
        ? `₦${Number(experience.commitmentFee).toLocaleString()}`
        : "Free",
    ],
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
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [error, setError] = useState("");
  const update = (field, value) =>
    setEvent((current) => ({ ...current, [field]: value }));
  const submit = async (submissionEvent) => {
    submissionEvent.preventDefault();
    setError("");

    if (Number(event.minimumAge) > Number(event.maximumAge)) {
      setError("The minimum age must not be greater than the maximum age.");
      return;
    }
    if (!coverPhoto) {
      setError("Please upload a cover photo.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(coverPhoto.type)) {
      setError("The cover photo must be a JPG, PNG, or WEBP image.");
      return;
    }
    if (coverPhoto.size > 5 * 1024 * 1024) {
      setError("The cover photo must be 5MB or smaller.");
      return;
    }
    if (!(await imageMeetsMinimumSize(coverPhoto))) {
      setError("The cover photo must be at least 800 × 600px.");
      return;
    }
    if (additionalPhotos.length > 4) {
      setError("Please choose no more than 4 additional photos.");
      return;
    }
    if (
      additionalPhotos.some(
        (photo) =>
          !["image/jpeg", "image/png", "image/webp"].includes(photo.type),
      )
    ) {
      setError("Additional photos must be JPG, PNG, or WEBP images.");
      return;
    }

    onAdd({
      ...event,
      duration:
        event.duration === "Other" ? event.customDuration : event.duration,
      groupSize:
        event.groupSizeType === "unlimited"
          ? "Unlimited spots"
          : event.groupSize,
      neighbourhood:
        event.neighbourhood === "Other — specify"
          ? event.customNeighbourhood
          : event.neighbourhood,
      photos: [coverPhoto, ...additionalPhotos],
    });
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
          <section className="experience-admin-add-section">
            <h3>The Basics</h3>
            <div className="experience-admin-form-grid">
              <label>
                What are you calling this experience?
                <input
                  required
                  value={event.experienceName}
                  placeholder="e.g. The Random Saturday Experience"
                  onChange={(e) => update("experienceName", e.target.value)}
                />
              </label>
              <label>
                What type of experience is this?
                <select
                  required
                  value={event.category}
                  onChange={(e) => update("category", e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="experience-admin-form-full">
                Describe the experience
                <textarea
                  required
                  maxLength={300}
                  value={event.description}
                  placeholder="What will people be doing? What’s the vibe? What should they expect?"
                  onChange={(e) => update("description", e.target.value)}
                />
                <small>Keep it honest and exciting. Up to 300 characters.</small>
              </label>
            </div>
          </section>

          <section className="experience-admin-add-section">
            <h3>Group Details</h3>
            <div className="experience-admin-form-grid">
              <fieldset className="experience-admin-form-options experience-admin-form-full">
                <legend>How many people can attend?</legend>
                <div className="experience-admin-radio-row">
                  <label>
                    <input
                      type="radio"
                      name="adminGroupSizeType"
                      checked={event.groupSizeType === "limited"}
                      onChange={() => update("groupSizeType", "limited")}
                    />
                    Set a limit
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="adminGroupSizeType"
                      checked={event.groupSizeType === "unlimited"}
                      onChange={() => update("groupSizeType", "unlimited")}
                    />
                    Open to all
                  </label>
                </div>
                {event.groupSizeType === "limited" ? (
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={event.groupSize}
                    placeholder="Maximum number of attendees"
                    onChange={(e) => update("groupSize", e.target.value)}
                  />
                ) : (
                  <small>Listed as “Unlimited spots”.</small>
                )}
              </fieldset>
              <fieldset className="experience-admin-form-options experience-admin-form-full">
                <legend>Who is this experience open to?</legend>
                <div className="experience-admin-radio-row">
                  {["Mixed", "Ladies Only", "Men Only"].map((option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name="adminGenderComposition"
                        checked={event.genderComposition === option}
                        onChange={() => update("genderComposition", option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          <section className="experience-admin-add-section">
            <h3>Date and Time</h3>
            <div className="experience-admin-form-grid">
              <label>
                When is the experience?
                <input
                  required
                  type="date"
                  min={getEarliestDate()}
                  value={event.date}
                  onChange={(e) => update("date", e.target.value)}
                />
                <small>Choose a date at least 7 days from today.</small>
              </label>
              <label>
                What time does it start?
                <input
                  required
                  type="time"
                  value={event.startTime}
                  onChange={(e) => update("startTime", e.target.value)}
                />
              </label>
              <label>
                How long will it last?
                <select
                  required
                  value={event.duration}
                  onChange={(e) => update("duration", e.target.value)}
                >
                  <option value="">Select a duration</option>
                  {durations.map((duration) => (
                    <option key={duration}>{duration}</option>
                  ))}
                </select>
              </label>
              {event.duration === "Other" && (
                <label>
                  Enter the estimated duration
                  <input
                    required
                    value={event.customDuration}
                    placeholder="e.g. 90 minutes"
                    onChange={(e) => update("customDuration", e.target.value)}
                  />
                </label>
              )}
            </div>
          </section>

          <section className="experience-admin-add-section">
            <h3>Location</h3>
            <div className="experience-admin-form-grid">
              <label>
                What is the venue called?
                <input
                  required
                  value={event.venueName}
                  placeholder="e.g. Millennium Park, Jabi Lake Mall rooftop"
                  onChange={(e) => update("venueName", e.target.value)}
                />
              </label>
              <label>
                Full address
                <input
                  required
                  value={event.venueAddress}
                  placeholder="Street, neighbourhood, city"
                  onChange={(e) => update("venueAddress", e.target.value)}
                />
              </label>
              <label className="experience-admin-form-full">
                Paste the Google Maps link to the venue
                <input
                  required
                  type="url"
                  value={event.mapsLink}
                  placeholder="https://maps.google.com/..."
                  onChange={(e) => update("mapsLink", e.target.value)}
                />
                <small>Use the venue’s shareable Google Maps link.</small>
              </label>
              <label>
                Which area is this in?
                <select
                  required
                  value={event.neighbourhood}
                  onChange={(e) => update("neighbourhood", e.target.value)}
                >
                  <option value="">Select an area</option>
                  {neighbourhoods.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </label>
              {event.neighbourhood === "Other — specify" && (
                <label>
                  Enter the neighbourhood
                  <input
                    required
                    value={event.customNeighbourhood}
                    placeholder="Neighbourhood"
                    onChange={(e) =>
                      update("customNeighbourhood", e.target.value)
                    }
                  />
                </label>
              )}
            </div>
          </section>

          <section className="experience-admin-add-section">
            <h3>Pricing</h3>
            <div className="experience-admin-form-grid">
              <label>
                What is the commitment fee per person? (₦)
                <input
                  required
                  type="number"
                  min="0"
                  step="any"
                  value={event.commitmentFee}
                  placeholder="e.g. 5000"
                  onChange={(e) => update("commitmentFee", e.target.value)}
                />
                <small>
                  Comot charges a 15% platform service fee on paid ticket sales.
                </small>
              </label>
              <label>
                What is included in the fee?
                <input
                  required
                  value={event.feeIncludes}
                  placeholder="e.g. Entry, one welcome drink, access to all activities"
                  onChange={(e) => update("feeIncludes", e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="experience-admin-add-section">
            <h3>Experience Details</h3>
            <div className="experience-admin-form-grid">
              <label>
                Is there a dress code?
                <input
                  value={event.dressCode}
                  placeholder="e.g. All White, Smart Casual, No dress code"
                  onChange={(e) => update("dressCode", e.target.value)}
                />
                <small>Leave blank if there is no dress code.</small>
              </label>
              <label>
                Is there anything attendees should bring?
                <textarea
                  value={event.whatToBring}
                  placeholder="e.g. Comfortable shoes, a mat, a dish to share"
                  onChange={(e) => update("whatToBring", e.target.value)}
                />
              </label>
              <div className="experience-admin-form-age experience-admin-form-full">
                <span>What age range is this experience suitable for?</span>
                <div className="experience-admin-form-grid">
                  <label>
                    From
                    <input
                      required
                      type="number"
                      min="18"
                      max="60"
                      value={event.minimumAge}
                      onChange={(e) => update("minimumAge", e.target.value)}
                    />
                  </label>
                  <label>
                    To
                    <input
                      required
                      type="number"
                      min="18"
                      max="60"
                      value={event.maximumAge}
                      onChange={(e) => update("maximumAge", e.target.value)}
                    />
                  </label>
                </div>
                <small>Leave at the default if open to all adults.</small>
              </div>
            </div>
          </section>

          <section className="experience-admin-add-section">
            <h3>Host Details</h3>
            <div className="experience-admin-form-grid">
              <label>
                Your name or organisation name
                <input
                  required
                  value={event.hostName}
                  placeholder="How should attendees know you?"
                  onChange={(e) => update("hostName", e.target.value)}
                />
              </label>
              <label>
                Tell attendees a little about yourself
                <textarea
                  required
                  maxLength={150}
                  value={event.hostBio}
                  placeholder="Who are you and why are you hosting this experience?"
                  onChange={(e) => update("hostBio", e.target.value)}
                />
                <small>Up to 150 characters.</small>
              </label>
              <label>
                Your Instagram handle (optional)
                <div className="experience-admin-prefix-input">
                  <span aria-hidden="true">@</span>
                  <input
                    value={event.instagramHandle}
                    placeholder="yourhandle"
                    onChange={(e) => update("instagramHandle", e.target.value)}
                  />
                </div>
              </label>
              <label>
                WhatsApp number for coordination
                <input
                  required
                  type="tel"
                  autoComplete="tel"
                  value={event.hostPhone}
                  onChange={(e) => update("hostPhone", e.target.value)}
                />
                <small>Only used by the Comot team; not shown to attendees.</small>
              </label>
            </div>
          </section>

          <section className="experience-admin-add-section">
            <h3>Photos</h3>
            <div className="experience-admin-form-grid">
              <label className="experience-admin-form-full">
                Upload a cover photo for your experience
                <input
                  required
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setCoverPhoto(e.target.files?.[0] || null)}
                />
                <small>
                  Main image for the experience card. Minimum 800 × 600px,
                  maximum 5MB. JPG, PNG, or WEBP.
                </small>
              </label>
              <label className="experience-admin-form-full">
                Add more photos (optional)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) =>
                    setAdditionalPhotos(Array.from(e.target.files || []))
                  }
                />
                <small>Up to 4 additional JPG, PNG, or WEBP photos.</small>
              </label>
            </div>
          </section>

          <section className="experience-admin-add-section">
            <h3>Terms</h3>
            <label className="experience-admin-checkbox">
              <input
                required
                type="checkbox"
                checked={event.guidelinesAgreement}
                onChange={(e) =>
                  update("guidelinesAgreement", e.target.checked)
                }
              />
              I confirm that this experience takes place at a public venue and
              complies with Comot’s community guidelines.
            </label>
            <label className="experience-admin-checkbox">
              <input
                required
                type="checkbox"
                checked={event.cancellationAgreement}
                onChange={(e) =>
                  update("cancellationAgreement", e.target.checked)
                }
              />
              I understand that if I cancel an experience after payments,
              attendees will be fully refunded and my hosting privileges may be
              reviewed.
            </label>
          </section>

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

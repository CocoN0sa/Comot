import React, { useEffect, useMemo, useState } from "react";
import Logo from "../assets/images/comot logo.png";
import {
  createVenueRecord,
  readVenueSubmissions,
  writeVenueSubmissions,
} from "../utils/venueSubmissions";

const venueTypes = [
  "Restaurant",
  "Bar",
  "Park",
  "Hotel",
  "Cafe",
  "Event Centre",
  "Fast Food",
  "Lounge",
  "Others",
];

const priceRanges = [
  "Budget < 10k Naira",
  "Mid 10k–50k Naira",
  "Premium > 50k Naira",
];

const vibeOptions = [
  "Quiet",
  "Lively",
  "Outdoor",
  "Rooftop",
  "Live Music",
  "Casual",
  "Upscale",
  "Hidden Gem",
];

const occasionOptions = [
  "Date",
  "Solo",
  "Group",
  "Girls Night",
  "Family",
  "Birthday",
  "Business",
];

const statusFilters = ["all", "pending", "approved", "declined", "deleted"];

const blankVenue = {
  venueName: "",
  venueType: "",
  neighbourhood: "",
  fullAddress: "",
  googleMapsLink: "",
  phoneNumber: "",
  email: "",
  website: "",
  priceRange: "",
  vibeTags: [],
  occasionTags: [],
  openingHours: { opensAt: "", closesAt: "" },
  parkingAvailable: "",
  reservationRequired: "",
  photos: [],
  venueDescription: "",
  hostComotExperience: "",
};

export default function AdminDashboard({ onNavigate }) {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const refreshSubmissions = async (event) => {
      if (
        !event ||
        event.key === "comot_venue_submissions_updated" ||
        event.key === null
      ) {
        const savedSubmissions = await readVenueSubmissions();
        if (isMounted) setSubmissions(savedSubmissions);
      }
    };
    refreshSubmissions();
    window.addEventListener("storage", refreshSubmissions);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", refreshSubmissions);
    };
  }, []);

  const counts = useMemo(
    () => ({
      all: submissions.length,
      pending: submissions.filter((item) => item.status === "pending").length,
      approved: submissions.filter((item) => item.status === "approved").length,
      declined: submissions.filter((item) => item.status === "declined").length,
      deleted: submissions.filter((item) => item.status === "deleted").length,
    }),
    [submissions],
  );

  const visibleSubmissions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return submissions.filter((item) => {
      const matchesFilter = filter === "all" || item.status === filter;
      const matchesSearch =
        !normalizedSearch ||
        [item.venueName, item.venueType, item.neighbourhood, item.email]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, submissions]);

  const selectedVenue = submissions.find((item) => item.id === selectedId);

  const saveSubmissions = async (nextSubmissions) => {
    try {
      await writeVenueSubmissions(nextSubmissions);
      setSubmissions(nextSubmissions);
      setStorageError("");
      return true;
    } catch {
      setStorageError("Changes could not be saved in this browser.");
      return false;
    }
  };

  const updateStatus = (id, status) => {
    saveSubmissions(
      submissions.map((item) =>
        item.id === id
          ? { ...item, status, reviewedAt: new Date().toISOString() }
          : item,
      ),
    );
  };

  const updatePhotos = (id, files) => {
    const uploadedPhotos = createVenueRecord({ photos: files }).photos;
    const nextSubmissions = submissions.map((item) => {
      if (item.id !== id) return item;
      const existingPreviews = (item.photos || []).filter(
        (photo) => photo.blob,
      );
      return { ...item, photos: [...existingPreviews, ...uploadedPhotos] };
    });
    return saveSubmissions(nextSubmissions);
  };

  const addVenue = async (venue) => {
    const nextSubmissions = [
      createVenueRecord(venue, "approved"),
      ...submissions,
    ];
    if (await saveSubmissions(nextSubmissions)) {
      setShowAddVenue(false);
      setFilter("approved");
      setSearch("");
    }
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <div style={brandStyle}>
            <img src={Logo} alt="COMOT" className="brand-logo" />
            <span style={brandDivider} />
            <span style={brandLabel}>ADMIN</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.("home")}
            style={quietButton}
          >
            Back to COMOT
          </button>
        </div>
      </header>

      <main style={mainStyle}>
        <div style={titleRowStyle}>
          <div>
            <p style={eyebrowStyle}>VENUE OPERATIONS</p>
            <h1 style={titleStyle}>Venue submissions</h1>
            <p style={subtitleStyle}>
              Review listings, update their status, or add a venue directly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddVenue(true)}
            style={primaryButton}
          >
            <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>
              +
            </span>
            Add venue
          </button>
        </div>

        <div style={summaryStyle} aria-label="Submission totals">
          {statusFilters.map((status) => (
            <div key={status} style={summaryItemStyle}>
              <span style={summaryNumberStyle}>{counts[status]}</span>
              <span style={summaryLabelStyle}>
                {status === "all" ? "Total venues" : status}
              </span>
            </div>
          ))}
        </div>

        <section style={workspaceStyle} aria-label="Venue submission list">
          <div style={toolbarStyle}>
            <div style={tabsStyle} role="tablist" aria-label="Filter venues">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  role="tab"
                  aria-selected={filter === status}
                  onClick={() => setFilter(status)}
                  style={filter === status ? activeTabStyle : tabStyle}
                >
                  {status === "all" ? "All venues" : titleCase(status)}
                  <span style={tabCountStyle}>{counts[status]}</span>
                </button>
              ))}
            </div>
            <label style={searchLabelStyle}>
              <span aria-hidden="true" style={{ color: "#79828c" }}>
                ⌕
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search venues"
                aria-label="Search venues"
                style={searchInputStyle}
              />
            </label>
          </div>

          {storageError && <p style={errorBannerStyle}>{storageError}</p>}

          <div style={tableScrollStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headingCellStyle}>Venue</th>
                  <th style={headingCellStyle}>Type / area</th>
                  <th style={headingCellStyle}>Submitted</th>
                  <th style={headingCellStyle}>Status</th>
                  <th style={{ ...headingCellStyle, textAlign: "right" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleSubmissions.map((venue) => (
                  <tr key={venue.id}>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(venue.id)}
                        style={venueNameButton}
                      >
                        {venue.venueName || "Untitled venue"}
                      </button>
                      <span style={secondaryCellStyle}>
                        {venue.email || "No email provided"}
                      </span>
                    </td>
                    <td style={bodyCellStyle}>
                      <span>{venue.venueType || "Not specified"}</span>
                      <span style={secondaryCellStyle}>
                        {venue.neighbourhood || "Area not specified"}
                      </span>
                    </td>
                    <td style={bodyCellStyle}>
                      {formatDate(venue.submittedAt)}
                    </td>
                    <td style={bodyCellStyle}>
                      <StatusBadge status={venue.status} />
                    </td>
                    <td style={{ ...bodyCellStyle, textAlign: "right" }}>
                      <div style={actionsStyle}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(venue.id)}
                          style={reviewButton}
                        >
                          Review
                        </button>
                        {venue.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateStatus(venue.id, "approved")}
                              style={approveButton}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => updateStatus(venue.id, "declined")}
                              style={declineButton}
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {venue.status === "approved" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(venue.id, "deleted")}
                            style={deleteButton}
                            aria-label={`Delete ${venue.venueName}`}
                          >
                            Delete
                          </button>
                        )}
                        {venue.status === "deleted" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(venue.id, "approved")}
                            style={restoreButton}
                            aria-label={`Restore ${venue.venueName}`}
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {visibleSubmissions.length === 0 && (
                  <tr>
                    <td colSpan="5" style={emptyCellStyle}>
                      <strong style={{ display: "block", color: "#263b5b" }}>
                        {filter === "deleted"
                          ? "No deleted venues"
                          : submissions.length === 0
                            ? "No venue submissions yet"
                            : "No matching venues"}
                      </strong>
                      <span>
                        {filter === "deleted"
                          ? "Deleted venues will remain available here until restored."
                          : submissions.length === 0
                            ? "New vendor submissions will appear here for review."
                            : "Try another search or status filter."}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {selectedVenue && (
        <ReviewDialog
          venue={selectedVenue}
          onClose={() => setSelectedId(null)}
          onStatusChange={(status) => updateStatus(selectedVenue.id, status)}
          onPhotosChange={(files) => updatePhotos(selectedVenue.id, files)}
        />
      )}
      {showAddVenue && (
        <AddVenueDialog
          onClose={() => setShowAddVenue(false)}
          onAdd={addVenue}
        />
      )}
    </div>
  );
}

function ReviewDialog({ venue, onClose, onStatusChange, onPhotosChange }) {
  const details = [
    ["Venue name", venue.venueName],
    ["Venue type", venue.venueType],
    ["Neighbourhood / area", venue.neighbourhood],
    ["Full address", venue.fullAddress],
    ["Google Maps location", venue.googleMapsLink, "link"],
    ["Phone number", venue.phoneNumber],
    ["Email address", venue.email],
    ["Website", venue.website, "link"],
    ["Price range", venue.priceRange],
    ["Vibe tags", listValue(venue.vibeTags)],
    ["Occasion tags", listValue(venue.occasionTags)],
    [
      "Opening hours",
      [venue.openingHours?.opensAt, venue.openingHours?.closesAt]
        .filter(Boolean)
        .join(" to "),
    ],
    ["Parking available", titleCase(venue.parkingAvailable)],
    ["Reservation required", titleCase(venue.reservationRequired)],
    ["Host a COMOT experience", titleCase(venue.hostComotExperience)],
    ["Photos", venue.photos, "photos"],
    ["Venue description", venue.venueDescription, "wide"],
  ];

  return (
    <div style={overlayStyle} onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        style={dialogStyle}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header style={dialogHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>SUBMISSION REVIEW</p>
            <h2 id="review-title" style={dialogTitleStyle}>
              {venue.venueName || "Untitled venue"}
            </h2>
            <p style={dialogMetaStyle}>
              Submitted {formatDate(venue.submittedAt)} · {venue.id}
            </p>
          </div>
          <div style={dialogHeadingActions}>
            <StatusBadge status={venue.status} />
            <button
              type="button"
              onClick={onClose}
              style={closeButton}
              aria-label="Close review"
            >
              ×
            </button>
          </div>
        </header>

        <div style={detailGridStyle}>
          {details.map(([label, value, kind]) => (
            <div
              key={label}
              style={{
                ...detailItemStyle,
                gridColumn:
                  kind === "wide" || kind === "photos" ? "1 / -1" : undefined,
              }}
            >
              <span style={detailLabelStyle}>{label}</span>
              {kind === "link" && value ? (
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  style={detailLinkStyle}
                >
                  {value}
                </a>
              ) : kind === "photos" && Array.isArray(value) ? (
                <PhotoGallery photos={value} onPhotosChange={onPhotosChange} />
              ) : (
                <span style={detailValueStyle}>{value || "Not provided"}</span>
              )}
            </div>
          ))}
        </div>

        <footer style={dialogFooterStyle}>
          <button type="button" onClick={onClose} style={quietButton}>
            Close
          </button>
          {venue.status === "pending" && (
            <div style={actionsStyle}>
              <button
                type="button"
                onClick={() => onStatusChange("declined")}
                style={declineButton}
              >
                Decline submission
              </button>
              <button
                type="button"
                onClick={() => onStatusChange("approved")}
                style={approveButton}
              >
                Approve venue
              </button>
            </div>
          )}
        </footer>
      </section>
    </div>
  );
}

function AddVenueDialog({ onClose, onAdd }) {
  const [venue, setVenue] = useState(blankVenue);
  const [tagSelections, setTagSelections] = useState({
    vibeTags: [],
    occasionTags: [],
  });

  const updateField = (field, value) => {
    setVenue((current) => ({ ...current, [field]: value }));
  };

  const updateHours = (field, value) => {
    setVenue((current) => ({
      ...current,
      openingHours: { ...current.openingHours, [field]: value },
    }));
  };

  const toggleTag = (field, value) => {
    setTagSelections((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((tag) => tag !== value)
        : [...current[field], value],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd({ ...venue, ...tagSelections });
  };

  return (
    <div style={overlayStyle} onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-venue-title"
        style={{ ...dialogStyle, maxWidth: 860 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header style={dialogHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>ADMIN ENTRY</p>
            <h2 id="add-venue-title" style={dialogTitleStyle}>
              Add a venue
            </h2>
            <p style={dialogMetaStyle}>
              New entries are added as approved venues.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={closeButton}
            aria-label="Close form"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} style={manualFormStyle}>
          <FormSection title="Venue details">
            <div style={manualGridStyle}>
              <Field label="Venue name">
                <input
                  required
                  value={venue.venueName}
                  onChange={(event) =>
                    updateField("venueName", event.target.value)
                  }
                  style={formInputStyle}
                />
              </Field>
              <Field label="Venue type">
                <select
                  required
                  value={venue.venueType}
                  onChange={(event) =>
                    updateField("venueType", event.target.value)
                  }
                  style={formInputStyle}
                >
                  <option value="">Select type</option>
                  {venueTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>
              <Field label="Neighbourhood / area">
                <input
                  required
                  value={venue.neighbourhood}
                  onChange={(event) =>
                    updateField("neighbourhood", event.target.value)
                  }
                  style={formInputStyle}
                />
              </Field>
              <Field label="Full address">
                <input
                  required
                  value={venue.fullAddress}
                  onChange={(event) =>
                    updateField("fullAddress", event.target.value)
                  }
                  style={formInputStyle}
                />
              </Field>
              <Field label="Google Maps location link">
                <input
                  type="url"
                  value={venue.googleMapsLink}
                  onChange={(event) =>
                    updateField("googleMapsLink", event.target.value)
                  }
                  style={formInputStyle}
                />
              </Field>
              <Field label="Price range">
                <select
                  value={venue.priceRange}
                  onChange={(event) =>
                    updateField("priceRange", event.target.value)
                  }
                  style={formInputStyle}
                >
                  <option value="">Select price range</option>
                  {priceRanges.map((range) => (
                    <option key={range}>{range}</option>
                  ))}
                </select>
              </Field>
            </div>
          </FormSection>

          <FormSection title="Contact information">
            <div style={manualGridStyle}>
              <Field label="Phone number">
                <input
                  type="tel"
                  value={venue.phoneNumber}
                  onChange={(event) =>
                    updateField("phoneNumber", event.target.value)
                  }
                  style={formInputStyle}
                />
              </Field>
              <Field label="Email address">
                <input
                  type="email"
                  value={venue.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  style={formInputStyle}
                />
              </Field>
              <Field label="Website">
                <input
                  type="url"
                  value={venue.website}
                  onChange={(event) =>
                    updateField("website", event.target.value)
                  }
                  style={formInputStyle}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Experience & operations">
            <TagPicker
              label="Vibe tags"
              options={vibeOptions}
              selected={tagSelections.vibeTags}
              onToggle={(value) => toggleTag("vibeTags", value)}
            />
            <TagPicker
              label="Occasion tags"
              options={occasionOptions}
              selected={tagSelections.occasionTags}
              onToggle={(value) => toggleTag("occasionTags", value)}
            />
            <div style={manualGridStyle}>
              <Field label="Opens at">
                <input
                  type="time"
                  value={venue.openingHours.opensAt}
                  onChange={(event) =>
                    updateHours("opensAt", event.target.value)
                  }
                  style={formInputStyle}
                />
              </Field>
              <Field label="Closes at">
                <input
                  type="time"
                  value={venue.openingHours.closesAt}
                  onChange={(event) =>
                    updateHours("closesAt", event.target.value)
                  }
                  style={formInputStyle}
                />
              </Field>
              <Field label="Parking available">
                <YesNoSelect
                  value={venue.parkingAvailable}
                  onChange={(value) => updateField("parkingAvailable", value)}
                />
              </Field>
              <Field label="Reservation required">
                <YesNoSelect
                  value={venue.reservationRequired}
                  onChange={(value) =>
                    updateField("reservationRequired", value)
                  }
                />
              </Field>
              <Field label="Host a COMOT experience">
                <YesNoSelect
                  value={venue.hostComotExperience}
                  onChange={(value) =>
                    updateField("hostComotExperience", value)
                  }
                />
              </Field>
              <Field label="Photos">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    updateField("photos", Array.from(event.target.files || []))
                  }
                  style={formInputStyle}
                />
              </Field>
              <Field label="Venue description" wide>
                <textarea
                  rows="3"
                  value={venue.venueDescription}
                  onChange={(event) =>
                    updateField("venueDescription", event.target.value)
                  }
                  style={{ ...formInputStyle, resize: "vertical" }}
                />
              </Field>
            </div>
          </FormSection>

          <footer style={dialogFooterStyle}>
            <button type="button" onClick={onClose} style={quietButton}>
              Cancel
            </button>
            <button type="submit" style={primaryButton}>
              Add approved venue
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function PhotoGallery({ photos, onPhotosChange }) {
  const [previews, setPreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const nextPreviews = photoList(photos).map((photo) => ({
      ...photo,
      previewUrl:
        photo.blob instanceof Blob ? URL.createObjectURL(photo.blob) : "",
    }));
    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((photo) => {
        if (photo.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, [photos]);

  return (
    <div style={photoGalleryStyle}>
      <div style={photoListStyle}>
        {previews.length ? (
          previews.map((photo, index) => (
            <div key={`${photo.name}-${index}`} style={photoTileStyle}>
              {photo.previewUrl ? (
                <a
                  href={photo.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`Open ${photo.name}`}
                >
                  <img
                    src={photo.previewUrl}
                    alt={photo.name}
                    style={photoPreviewStyle}
                  />
                </a>
              ) : (
                <div style={photoUnavailableStyle}>Preview unavailable</div>
              )}
              <span style={photoNameStyle}>{photo.name}</span>
            </div>
          ))
        ) : (
          <span style={detailValueStyle}>No photos provided</span>
        )}
      </div>
      {previews.some((photo) => !photo.previewUrl) && (
        <div style={photoAttachStyle}>
          <label style={photoAttachLabelStyle}>
            Replace missing photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) =>
                setSelectedFiles(Array.from(event.target.files || []))
              }
              style={{ display: "block", marginTop: 8, fontSize: 12 }}
            />
          </label>
          <button
            type="button"
            disabled={!selectedFiles.length}
            onClick={async () => {
              if (await onPhotosChange(selectedFiles)) setSelectedFiles([]);
            }}
            style={{
              ...approveButton,
              opacity: selectedFiles.length ? 1 : 0.55,
            }}
          >
            Save replacement photos
          </button>
        </div>
      )}
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <section style={formSectionStyle}>
      <h3 style={formSectionTitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <label
      style={{ ...formFieldStyle, gridColumn: wide ? "1 / -1" : undefined }}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}

function TagPicker({ label, options, selected, onToggle }) {
  return (
    <fieldset style={tagFieldsetStyle}>
      <legend style={formLabelStyle}>{label}</legend>
      <div style={tagPickerStyle}>
        {options.map((option) => (
          <label key={option} style={tagOptionStyle}>
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function YesNoSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={formInputStyle}
    >
      <option value="">Choose</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  );
}

function StatusBadge({ status = "pending" }) {
  const colors = {
    pending: { color: "#8a5a14", background: "#fff4d6" },
    approved: { color: "#276749", background: "#e6f4eb" },
    declined: { color: "#a13a36", background: "#fce9e7" },
    deleted: { color: "#5f6670", background: "#eceef0" },
  };
  return (
    <span style={{ ...badgeStyle, ...(colors[status] || colors.pending) }}>
      {titleCase(status)}
    </span>
  );
}

function titleCase(value = "") {
  return value
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "Not provided";
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? "—"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function listValue(value) {
  return Array.isArray(value) && value.length ? value.join(", ") : "";
}

function photoList(value) {
  return Array.isArray(value)
    ? value.map((photo) =>
        typeof photo === "string" ? { name: photo } : photo,
      )
    : [];
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f5f4ef",
  color: "#202a33",
};

const headerStyle = {
  background: "#fff",
  borderBottom: "1px solid #e5e2da",
};

const headerInnerStyle = {
  maxWidth: "none",
  minHeight: 64,
  padding: "0",
  margin: "0 auto",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
};

const brandStyle = { display: "flex", alignItems: "center", gap: 14 };
const brandDivider = { height: 24, borderLeft: "1px solid #d8d5ce" };
const brandLabel = {
  color: "#66717b",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
};

const mainStyle = {
  width: "min(1320px, 100%)",
  margin: "0 auto",
  padding: "32px 24px 56px",
  boxSizing: "border-box",
};

const titleRowStyle = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: 20,
  flexWrap: "wrap",
};

const eyebrowStyle = {
  margin: 0,
  color: "#a85f49",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.14em",
};

const titleStyle = {
  margin: "8px 0 5px",
  color: "#263b5b",
  fontSize: 28,
  lineHeight: 1.15,
};
const subtitleStyle = {
  margin: 0,
  color: "#68737d",
  fontSize: 13,
  lineHeight: 1.5,
};

const primaryButton = {
  minHeight: 40,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "0 16px",
  border: 0,
  borderRadius: 6,
  background: "#263b5b",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const quietButton = {
  minHeight: 36,
  padding: "0 12px",
  border: "1px solid #d9d6cf",
  borderRadius: 6,
  background: "#fff",
  color: "#263b5b",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const summaryStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0 28px",
  marginTop: 28,
  padding: "15px 0",
  borderTop: "1px solid #dedbd3",
  borderBottom: "1px solid #dedbd3",
};

const summaryItemStyle = { display: "flex", alignItems: "baseline", gap: 8 };
const summaryNumberStyle = { color: "#263b5b", fontSize: 19, fontWeight: 800 };
const summaryLabelStyle = {
  color: "#68737d",
  fontSize: 12,
  textTransform: "capitalize",
};
const workspaceStyle = {
  marginTop: 22,
  background: "#fff",
  border: "1px solid #e5e2da",
  borderRadius: 8,
  overflow: "hidden",
};

const toolbarStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  padding: "12px 16px",
  borderBottom: "1px solid #ebe8e1",
};

const tabsStyle = { display: "flex", flexWrap: "wrap", gap: 4 };
const tabStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "8px 10px",
  border: 0,
  borderRadius: 5,
  background: "transparent",
  color: "#68737d",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};
const activeTabStyle = {
  ...tabStyle,
  background: "#eef1f4",
  color: "#263b5b",
  fontWeight: 800,
};
const tabCountStyle = { color: "#89929a", fontSize: 11 };
const searchLabelStyle = {
  width: "min(260px, 100%)",
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "0 10px",
  border: "1px solid #dedbd3",
  borderRadius: 5,
  background: "#fff",
};
const searchInputStyle = {
  width: "100%",
  minWidth: 0,
  height: 34,
  padding: 0,
  border: 0,
  outline: 0,
  background: "transparent",
  color: "#263b5b",
  fontSize: 13,
};
const tableScrollStyle = { overflowX: "auto" };
const tableStyle = {
  width: "100%",
  minWidth: 850,
  borderCollapse: "collapse",
  textAlign: "left",
  fontSize: 12,
};
const headingCellStyle = {
  padding: "11px 16px",
  background: "#faf9f6",
  color: "#68737d",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  borderBottom: "1px solid #ebe8e1",
};
const bodyCellStyle = {
  padding: "13px 16px",
  color: "#263b5b",
  verticalAlign: "middle",
  borderBottom: "1px solid #f0eee9",
};
const secondaryCellStyle = {
  display: "block",
  marginTop: 4,
  color: "#7a838b",
  fontSize: 11,
};
const venueNameButton = {
  padding: 0,
  border: 0,
  background: "none",
  color: "#263b5b",
  fontSize: 13,
  fontWeight: 800,
  textAlign: "left",
  cursor: "pointer",
};
const actionsStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 6,
  whiteSpace: "nowrap",
};
const reviewButton = {
  padding: "6px 8px",
  border: 0,
  background: "transparent",
  color: "#263b5b",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
};
const approveButton = {
  ...reviewButton,
  border: "1px solid #b7d8c2",
  borderRadius: 5,
  background: "#edf7f0",
  color: "#276749",
};
const declineButton = {
  ...reviewButton,
  border: "1px solid #efc5c0",
  borderRadius: 5,
  background: "#fff3f1",
  color: "#a13a36",
};
const deleteButton = {
  ...reviewButton,
  border: "1px solid #efc5c0",
  borderRadius: 5,
  background: "#fff3f1",
  color: "#a13a36",
};
const restoreButton = {
  ...reviewButton,
  border: "1px solid #d6dbe0",
  borderRadius: 5,
  background: "#f3f5f6",
  color: "#44515d",
};
const emptyCellStyle = {
  padding: "48px 16px",
  color: "#78828b",
  textAlign: "center",
  lineHeight: 1.8,
};
const errorBannerStyle = {
  margin: 0,
  padding: "10px 16px",
  background: "#fff3f1",
  color: "#a13a36",
  fontSize: 12,
};
const badgeStyle = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: 4,
  fontSize: 10,
  fontWeight: 800,
  textTransform: "capitalize",
  whiteSpace: "nowrap",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 20000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  background: "rgba(22, 31, 42, 0.48)",
};
const dialogStyle = {
  width: "min(760px, 100%)",
  maxHeight: "min(90vh, 900px)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderRadius: 8,
  background: "#fff",
  boxShadow: "0 24px 70px rgba(17,24,39,0.24)",
};
const dialogHeaderStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  padding: "20px 24px 16px",
  borderBottom: "1px solid #ebe8e1",
};
const dialogTitleStyle = {
  margin: "6px 0 4px",
  color: "#263b5b",
  fontSize: 20,
  lineHeight: 1.2,
};
const dialogMetaStyle = {
  margin: 0,
  color: "#78828b",
  fontSize: 11,
  overflowWrap: "anywhere",
};
const dialogHeadingActions = { display: "flex", alignItems: "center", gap: 12 };
const closeButton = {
  width: 32,
  height: 32,
  flex: "0 0 auto",
  border: 0,
  borderRadius: 5,
  background: "#f2f1ed",
  color: "#4b5563",
  fontSize: 22,
  lineHeight: 1,
  cursor: "pointer",
};
const detailGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "0 20px",
  padding: "8px 24px 20px",
  overflowY: "auto",
};
const detailItemStyle = {
  minWidth: 0,
  display: "grid",
  alignContent: "start",
  gap: 5,
  padding: "12px 0",
  borderBottom: "1px solid #f0eee9",
};
const detailLabelStyle = {
  color: "#7b858d",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
const detailValueStyle = {
  color: "#263b5b",
  fontSize: 13,
  lineHeight: 1.55,
  overflowWrap: "anywhere",
  whiteSpace: "pre-wrap",
};
const detailLinkStyle = { ...detailValueStyle, color: "#a85f49" };
const photoListStyle = { display: "flex", flexWrap: "wrap", gap: 6 };
const photoGalleryStyle = { display: "grid", gap: 12 };
const photoTileStyle = {
  width: 136,
  display: "grid",
  alignContent: "start",
  gap: 5,
};
const photoPreviewStyle = {
  display: "block",
  width: 136,
  height: 92,
  objectFit: "cover",
  borderRadius: 5,
  background: "#f1f0ec",
};
const photoUnavailableStyle = {
  width: 136,
  height: 92,
  display: "grid",
  placeItems: "center",
  borderRadius: 5,
  background: "#f1f0ec",
  color: "#7a838b",
  fontSize: 10,
};
const photoNameStyle = {
  color: "#44515d",
  fontSize: 11,
  overflowWrap: "anywhere",
};
const photoAttachStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 12,
  padding: 12,
  border: "1px solid #e5e2da",
  borderRadius: 5,
  background: "#faf9f6",
};
const photoAttachLabelStyle = {
  color: "#52606b",
  fontSize: 11,
  fontWeight: 700,
};
const dialogFooterStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 24px",
  borderTop: "1px solid #ebe8e1",
  background: "#fff",
};

const manualFormStyle = { overflowY: "auto", padding: "0 24px 8px" };
const formSectionStyle = {
  padding: "18px 0",
  borderBottom: "1px solid #ebe8e1",
};
const formSectionTitleStyle = {
  margin: "0 0 13px",
  color: "#263b5b",
  fontSize: 13,
};
const manualGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 12,
};
const formFieldStyle = {
  minWidth: 0,
  display: "grid",
  alignContent: "start",
  gap: 5,
  color: "#52606b",
  fontSize: 11,
  fontWeight: 700,
};
const formLabelStyle = {
  marginBottom: 6,
  color: "#52606b",
  fontSize: 11,
  fontWeight: 700,
};
const formInputStyle = {
  width: "100%",
  minWidth: 0,
  minHeight: 38,
  boxSizing: "border-box",
  padding: "8px 10px",
  border: "1px solid #d9d6cf",
  borderRadius: 5,
  background: "#fff",
  color: "#263b5b",
  fontSize: 16,
  fontWeight: 400,
};
const tagFieldsetStyle = { margin: "0 0 14px", padding: 0, border: 0 };
const tagPickerStyle = { display: "flex", flexWrap: "wrap", gap: 6 };
const tagOptionStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "6px 8px",
  border: "1px solid #e3e0d9",
  borderRadius: 4,
  color: "#44515d",
  fontSize: 11,
};

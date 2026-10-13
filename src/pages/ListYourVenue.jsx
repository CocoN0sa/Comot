import React, { useEffect, useState } from "react";
import Logo from "../assets/images/comot logo.png";
import BottomNav from "../components/BottomNav";
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

const vibeTags = [
  "Quiet",
  "Lively",
  "Outdoor",
  "Rooftop",
  "Live Music",
  "Casual",
  "Upscale",
  "Hidden Gem",
];

const occasionTags = [
  "Date",
  "Solo",
  "Group",
  "Girls Night",
  "Family",
  "Birthday",
  "Business",
];

const initialFormData = {
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

export default function ListYourVenue({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
    };
  }, []);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateNestedField = (field, nestedField, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [nestedField]: value,
      },
    }));
    setErrors((prev) => ({ ...prev, [`${field}.${nestedField}`]: "" }));
  };

  const toggleTag = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files || []);
    setFormData((prev) => ({
      ...prev,
      photos: uploadedFiles,
    }));
    setErrors((prev) => ({ ...prev, photos: "" }));
  };

  const validateStepOne = () => {
    const nextErrors = {};

    if (!formData.venueName.trim())
      nextErrors.venueName = "Venue name is required.";
    if (!formData.venueType)
      nextErrors.venueType = "Please select a venue type.";
    if (!formData.neighbourhood.trim())
      nextErrors.neighbourhood = "Neighbourhood is required.";
    if (!formData.fullAddress.trim())
      nextErrors.fullAddress = "Full address is required.";
    if (!formData.googleMapsLink.trim()) {
      nextErrors.googleMapsLink = "Google Maps link is required.";
    } else {
      try {
        const mapsUrl = new URL(formData.googleMapsLink.trim());
        const isGoogleMapsHost =
          mapsUrl.hostname === "maps.app.goo.gl" ||
          mapsUrl.hostname === "goo.gl" ||
          mapsUrl.hostname === "google.com" ||
          mapsUrl.hostname.endsWith(".google.com");

        if (mapsUrl.protocol !== "https:" || !isGoogleMapsHost) {
          nextErrors.googleMapsLink = "Enter a valid Google Maps link.";
        }
      } catch {
        nextErrors.googleMapsLink = "Enter a valid Google Maps link.";
      }
    }
    if (!formData.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\s+/g, ""))) {
      nextErrors.phoneNumber = "Enter a valid phone number.";
    }
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email))
        nextErrors.email = "Enter a valid email.";
    }
    if (formData.website && !/^https?:\/\//i.test(formData.website)) {
      nextErrors.website = "Website must start with http:// or https://";
    }

    return nextErrors;
  };

  const validateStepTwo = () => {
    const nextErrors = {};

    if (!formData.priceRange)
      nextErrors.priceRange = "Please pick a price range.";
    if (formData.vibeTags.length === 0)
      nextErrors.vibeTags = "Select at least one vibe tag.";
    if (!formData.openingHours.opensAt || !formData.openingHours.closesAt) {
      nextErrors["openingHours.opensAt"] = "Opening hours are required.";
    } else if (
      formData.openingHours.opensAt >= formData.openingHours.closesAt
    ) {
      nextErrors["openingHours.opensAt"] =
        "Closing time must be after opening time.";
    }
    if (formData.parkingAvailable === "") {
      nextErrors.parkingAvailable = "Choose whether parking is available.";
    }
    if (formData.reservationRequired === "") {
      nextErrors.reservationRequired =
        "Choose whether reservation is required.";
    }

    return nextErrors;
  };

  const validateStepThree = () => {
    const nextErrors = {};

    if (!formData.photos || formData.photos.length < 3) {
      nextErrors.photos = "Upload at least 3 photos.";
    }
    if (!formData.venueDescription.trim()) {
      nextErrors.venueDescription = "Venue description is required.";
    } else if (formData.venueDescription.trim().length < 30) {
      nextErrors.venueDescription =
        "Description should be at least 30 characters long.";
    }
    if (formData.hostComotExperience === "") {
      nextErrors.hostComotExperience = "Please choose Yes or No.";
    }

    return nextErrors;
  };

  const handleNext = () => {
    const validation = step === 1 ? validateStepOne() : validateStepTwo();

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateStepThree();

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    try {
      const submission = createVenueRecord(formData);
      const currentSubmissions = await readVenueSubmissions();
      await writeVenueSubmissions([submission, ...currentSubmissions]);
      setIsSubmitted(true);
    } catch {
      setErrors({
        submission: "Submission could not be saved. Please try again.",
      });
    }
  };

  const renderStepOne = () => (
    <>
      <div style={fieldGroup}>
        <label style={labelStyle}>Venue Name</label>
        <input
          type="text"
          placeholder="Enter venue name"
          value={formData.venueName}
          onChange={(e) => updateField("venueName", e.target.value)}
          style={{
            ...inputStyle,
            borderColor: errors.venueName ? "#ef4444" : "#eadfce",
          }}
        />
        {errors.venueName && <span style={errorText}>{errors.venueName}</span>}
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Venue Type</label>
        <select
          value={formData.venueType}
          onChange={(e) => updateField("venueType", e.target.value)}
          style={{
            ...inputStyle,
            borderColor: errors.venueType ? "#ef4444" : "#eadfce",
          }}
        >
          <option value="">Select venue type</option>
          {venueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.venueType && <span style={errorText}>{errors.venueType}</span>}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
        }}
      >
        <div style={fieldGroup}>
          <label style={labelStyle}>Neighbourhood / Area</label>
          <input
            type="text"
            placeholder="Wuse"
            value={formData.neighbourhood}
            onChange={(e) => updateField("neighbourhood", e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.neighbourhood ? "#ef4444" : "#eadfce",
            }}
          />
          {errors.neighbourhood && (
            <span style={errorText}>{errors.neighbourhood}</span>
          )}
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            placeholder="08031234567"
            value={formData.phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.phoneNumber ? "#ef4444" : "#eadfce",
            }}
          />
          {errors.phoneNumber && (
            <span style={errorText}>{errors.phoneNumber}</span>
          )}
        </div>
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Full Address</label>
        <textarea
          rows="1"
          placeholder="Enter exact address"
          value={formData.fullAddress}
          onChange={(e) => updateField("fullAddress", e.target.value)}
          style={{
            ...inputStyle,
            resize: "none",
            borderColor: errors.fullAddress ? "#ef4444" : "#eadfce",
          }}
        />
        {errors.fullAddress && (
          <span style={errorText}>{errors.fullAddress}</span>
        )}
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Google Maps Location Link</label>
        <input
          type="url"
          placeholder="https://maps.app.goo.gl/..."
          value={formData.googleMapsLink}
          onChange={(e) => updateField("googleMapsLink", e.target.value)}
          style={{
            ...inputStyle,
            borderColor: errors.googleMapsLink ? "#ef4444" : "#eadfce",
          }}
        />
        {errors.googleMapsLink && (
          <span style={errorText}>{errors.googleMapsLink}</span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
        }}
      >
        <div style={fieldGroup}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            placeholder="hello@venue.com"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.email ? "#ef4444" : "#eadfce",
            }}
          />
          {errors.email && <span style={errorText}>{errors.email}</span>}
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Website (optional)</label>
          <input
            type="url"
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => updateField("website", e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.website ? "#ef4444" : "#eadfce",
            }}
          />
          {errors.website && <span style={errorText}>{errors.website}</span>}
        </div>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "8px",
          alignItems: "start",
        }}
      >
        <div style={fieldGroup}>
          <label style={labelStyle}>Price Range</label>
          <div style={{ display: "grid", gap: "6px" }}>
            {priceRanges.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateField("priceRange", option)}
                style={{
                  ...optionButton,
                  background:
                    formData.priceRange === option ? "#263b5b" : "#f8f4ef",
                  color: formData.priceRange === option ? "#ffffff" : "#263b5b",
                  borderColor:
                    formData.priceRange === option ? "#263b5b" : "#eadfce",
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {errors.priceRange && (
            <span style={errorText}>{errors.priceRange}</span>
          )}
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Vibe Tags</label>
          <div style={chipGroup}>
            {vibeTags.map((tag) => {
              const selected = formData.vibeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag("vibeTags", tag)}
                  style={{
                    ...chip,
                    background: selected ? "#c1735c" : "#f3efe9",
                    color: selected ? "#ffffff" : "#263b5b",
                    borderColor: selected ? "#c1735c" : "#eadfce",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          {errors.vibeTags && <span style={errorText}>{errors.vibeTags}</span>}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "8px",
          alignItems: "start",
        }}
      >
        <div style={fieldGroup}>
          <label style={labelStyle}>Occasion Tags</label>
          <div style={chipGroup}>
            {occasionTags.map((tag) => {
              const selected = formData.occasionTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag("occasionTags", tag)}
                  style={{
                    ...chip,
                    background: selected ? "#263b5b" : "#f3efe9",
                    color: selected ? "#ffffff" : "#263b5b",
                    borderColor: selected ? "#263b5b" : "#eadfce",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "6px",
            minWidth: 0,
          }}
        >
          <div style={fieldGroup}>
            <label style={labelStyle}>Opening Hours</label>
            <input
              type="time"
              value={formData.openingHours.opensAt}
              onChange={(e) =>
                updateNestedField("openingHours", "opensAt", e.target.value)
              }
              style={{
                ...inputStyle,
                minWidth: 0,
                minHeight: "32px",
                padding: "4px",
                fontSize: "16px",
                borderColor: errors["openingHours.opensAt"]
                  ? "#ef4444"
                  : "#eadfce",
              }}
            />
            <span style={{ ...helperText, marginTop: "2px" }}>Opens</span>
          </div>

          <div style={fieldGroup}>
            <label style={{ ...labelStyle, opacity: 0 }}>Close</label>
            <input
              type="time"
              value={formData.openingHours.closesAt}
              onChange={(e) =>
                updateNestedField("openingHours", "closesAt", e.target.value)
              }
              style={{
                ...inputStyle,
                minWidth: 0,
                minHeight: "32px",
                padding: "4px",
                fontSize: "16px",
                borderColor: errors["openingHours.opensAt"]
                  ? "#ef4444"
                  : "#eadfce",
              }}
            />
            <span style={{ ...helperText, marginTop: "2px" }}>Closes</span>
          </div>
        </div>
      </div>
      {errors["openingHours.opensAt"] && (
        <span style={errorText}>{errors["openingHours.opensAt"]}</span>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        <div style={fieldGroup}>
          <label style={labelStyle}>Parking Available</label>
          <div style={booleanRow}>
            {[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField("parkingAvailable", option.value)}
                style={{
                  ...booleanButton,
                  background:
                    formData.parkingAvailable === option.value
                      ? "#263b5b"
                      : "#f3efe9",
                  color:
                    formData.parkingAvailable === option.value
                      ? "#ffffff"
                      : "#263b5b",
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.parkingAvailable && (
            <span style={errorText}>{errors.parkingAvailable}</span>
          )}
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Reservation Required</label>
          <div style={booleanRow}>
            {[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField("reservationRequired", option.value)}
                style={{
                  ...booleanButton,
                  background:
                    formData.reservationRequired === option.value
                      ? "#c1735c"
                      : "#f3efe9",
                  color:
                    formData.reservationRequired === option.value
                      ? "#ffffff"
                      : "#263b5b",
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.reservationRequired && (
            <span style={errorText}>{errors.reservationRequired}</span>
          )}
        </div>
      </div>
    </>
  );

  const renderStepThree = () => (
    <>
      <div style={fieldGroup}>
        <label style={labelStyle}>Photo Uploads</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          style={{
            ...inputStyle,
            padding: "12px",
            background: "#faf9f7",
            borderColor: errors.photos ? "#ef4444" : "#eadfce",
          }}
        />
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#6b7280" }}>
          Minimum 3 images required.
        </div>
        {formData.photos.length > 0 && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {formData.photos.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                style={{
                  background: "#f3efe9",
                  color: "#263b5b",
                  borderRadius: "9999px",
                  padding: "6px 10px",
                  fontSize: "11px",
                  border: "1px solid #eadfce",
                }}
              >
                {file.name}
              </div>
            ))}
          </div>
        )}
        {errors.photos && <span style={errorText}>{errors.photos}</span>}
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Venue Description</label>
        <textarea
          rows="5"
          placeholder="Tell people what makes your venue special"
          value={formData.venueDescription}
          onChange={(e) => updateField("venueDescription", e.target.value)}
          style={{
            ...inputStyle,
            resize: "vertical",
            borderColor: errors.venueDescription ? "#ef4444" : "#eadfce",
          }}
        />
        {errors.venueDescription && (
          <span style={errorText}>{errors.venueDescription}</span>
        )}
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Host a Comot Experience?</label>
        <div style={booleanRow}>
          {[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField("hostComotExperience", option.value)}
              style={{
                ...booleanButton,
                background:
                  formData.hostComotExperience === option.value
                    ? "#c1735c"
                    : "#f3efe9",
                color:
                  formData.hostComotExperience === option.value
                    ? "#ffffff"
                    : "#263b5b",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.hostComotExperience && (
          <span style={errorText}>{errors.hostComotExperience}</span>
        )}
      </div>
    </>
  );

  if (isSubmitted) {
    return (
      <div style={{ ...pageWrap, justifyContent: "space-between" }}>
        <header style={headerStyle}>
          <img
            src={Logo}
            alt="COMOT logo"
            style={{ height: "32px", width: "auto", maxWidth: "130px" }}
          />
        </header>

        <div style={successCardStyle}>
          <div style={{ textAlign: "center", padding: "8px 4px" }}>
            <div style={successIconStyle}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2e7d32"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ margin: 0, fontSize: "22px", color: "#263b5b" }}>
              Venue Submitted
            </h2>
            <p
              style={{
                margin: "8px 0 16px",
                fontSize: "14px",
                color: "#5f6b7a",
                lineHeight: 1.6,
              }}
            >
              Your venue details are now in review and will be visible to users
              once approved.
            </p>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate("home")}
              style={primaryButton}
            >
              Back to Home
            </button>
          </div>
        </div>
        <BottomNav
          active="venueSubmitted"
          onChange={onNavigate}
          visibleItems={["explore", "profile"]}
        />
      </div>
    );
  }

  return (
    <div style={pageWrap}>
      <header style={headerStyle}>
        <img
          src={Logo}
          alt="COMOT logo"
          style={{ height: "32px", width: "auto", maxWidth: "130px" }}
        />
        <button
          type="button"
          onClick={() => onNavigate && onNavigate("home")}
          aria-label="Back to home"
          style={iconButton}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#263b5b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </header>

      <div style={step === 2 ? stepTwoCardStyle : cardStyle}>
        <p style={eyebrow}>For venue owners</p>
        <h1 style={title}>List your venue</h1>
        <p style={subtitle}>
          Register your spot and reach people looking for their next go-to
          place.
        </p>

        {errors.submission && (
          <p
            role="alert"
            style={{
              margin: "0 0 10px",
              padding: "8px 10px",
              borderRadius: "6px",
              background: "#fff3f1",
              color: "#b42318",
              fontSize: "12px",
            }}
          >
            {errors.submission}
          </p>
        )}

        <div style={stepTracker}>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                flex: 1,
                height: "6px",
                borderRadius: "9999px",
                background: step >= item ? "#c1735c" : "#eadfce",
              }}
            />
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            flex: step === 2 ? "0 0 auto" : 1,
            minHeight: 0,
            marginTop: "12px",
          }}
        >
          <div
            style={{
              display: "grid",
              alignContent: "start",
              gap: step === 2 ? "6px" : "8px",
            }}
          >
            {step === 1 && renderStepOne()}
            {step === 2 && renderStepTwo()}
            {step === 3 && renderStepThree()}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              marginTop: "10px",
              paddingTop: "8px",
            }}
          >
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                style={secondaryButton}
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{ ...primaryButton, marginLeft: "auto" }}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                style={{ ...primaryButton, marginLeft: "auto" }}
              >
                Submit venue
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const pageWrap = {
  height: "100dvh",
  background: "#f7f2e8",
  padding: "8px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflow: "hidden",
};

const headerStyle = {
  width: "100%",
  maxWidth: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  flex: "1",
  minHeight: 0,
  background: "#ffffff",
  borderRadius: "18px",
  padding: "10px 12px",
  boxShadow: "0 10px 30px rgba(38,59,91,0.08)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const stepTwoCardStyle = {
  ...cardStyle,
  flex: "0 0 auto",
  alignSelf: "center",
};

const successCardStyle = {
  ...cardStyle,
  flex: "0 0 auto",
  padding: "14px 16px",
  marginTop: "auto",
  marginBottom: "auto",
};

const successIconStyle = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background: "#e8f5e9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 12px",
};

const eyebrow = {
  margin: 0,
  color: "#c1735c",
  fontSize: "10px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  fontWeight: 700,
};

const title = {
  margin: "4px 0",
  fontSize: "22px",
  lineHeight: 1.1,
  fontWeight: 800,
  color: "#263b5b",
};

const subtitle = {
  margin: "0 0 8px",
  fontSize: "12px",
  color: "#6b7280",
  lineHeight: 1.5,
};

const stepTracker = {
  display: "flex",
  gap: "8px",
};

const fieldGroup = {
  display: "grid",
  gap: "3px",
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: 600,
  color: "#263b5b",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #eadfce",
  borderRadius: "12px",
  background: "#faf9f7",
  padding: "5px 8px",
  fontSize: "16px",
  minHeight: "36px",
  color: "#263b5b",
  outline: "none",
  fontFamily: "inherit",
};

const optionButton = {
  width: "100%",
  borderRadius: "12px",
  border: "1px solid #eadfce",
  padding: "8px 10px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  textAlign: "left",
};

const chipGroup = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
};

const chip = {
  borderRadius: "9999px",
  border: "1px solid #eadfce",
  padding: "6px 9px",
  fontSize: "11px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const helperText = {
  fontSize: "11px",
  color: "#6b7280",
};

const booleanRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
};

const booleanButton = {
  border: "1px solid #eadfce",
  borderRadius: "10px",
  background: "#f3efe9",
  color: "#263b5b",
  padding: "7px 10px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
};

const primaryButton = {
  background: "#263b5b",
  color: "#ffffff",
  border: "none",
  borderRadius: "9999px",
  padding: "9px 14px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton = {
  background: "#f3efe9",
  color: "#263b5b",
  border: "1px solid #eadfce",
  borderRadius: "9999px",
  padding: "12px 18px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

const iconButton = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const errorText = {
  color: "#ef4444",
  fontSize: "11px",
  marginTop: "2px",
};

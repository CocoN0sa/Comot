import React, { useState } from "react";
import Logo from "../assets/images/comot logo.png";

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
  googleMapsPin: "",
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
    if (!formData.googleMapsPin.trim()) {
      nextErrors.googleMapsPin = "Google Maps pin is required.";
    } else {
      const latLngPattern = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
      if (!latLngPattern.test(formData.googleMapsPin.trim())) {
        nextErrors.googleMapsPin = "Use format: latitude, longitude";
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateStepThree();

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsSubmitted(true);
    console.log("Venue submission successful", formData);
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
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
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
          rows="3"
          placeholder="Enter exact address"
          value={formData.fullAddress}
          onChange={(e) => updateField("fullAddress", e.target.value)}
          style={{
            ...inputStyle,
            resize: "vertical",
            borderColor: errors.fullAddress ? "#ef4444" : "#eadfce",
          }}
        />
        {errors.fullAddress && (
          <span style={errorText}>{errors.fullAddress}</span>
        )}
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Google Maps Pin (lat, lng)</label>
        <input
          type="text"
          placeholder="9.0765, 7.3986"
          value={formData.googleMapsPin}
          onChange={(e) => updateField("googleMapsPin", e.target.value)}
          style={{
            ...inputStyle,
            borderColor: errors.googleMapsPin ? "#ef4444" : "#eadfce",
          }}
        />
        {errors.googleMapsPin && (
          <span style={errorText}>{errors.googleMapsPin}</span>
        )}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
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
      <div style={fieldGroup}>
        <label style={labelStyle}>Price Range</label>
        <div style={{ display: "grid", gap: "8px" }}>
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
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
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
              borderColor: errors["openingHours.opensAt"]
                ? "#ef4444"
                : "#eadfce",
            }}
          />
          <span style={{ ...helperText, marginTop: "8px" }}>Opens</span>
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
              borderColor: errors["openingHours.opensAt"]
                ? "#ef4444"
                : "#eadfce",
            }}
          />
          <span style={{ ...helperText, marginTop: "8px" }}>Closes</span>
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
      <div style={pageWrap}>
        <header style={headerStyle}>
          <img
            src={Logo}
            alt="COMOT logo"
            style={{ height: "32px", width: "auto", maxWidth: "130px" }}
          />
        </header>

        <div style={cardStyle}>
          <div style={{ textAlign: "center", padding: "24px 12px" }}>
            <div style={{ fontSize: "42px", marginBottom: "12px" }}>✅</div>
            <h2 style={{ margin: 0, fontSize: "28px", color: "#263b5b" }}>
              Venue Submitted
            </h2>
            <p
              style={{
                margin: "12px 0 24px",
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

      <div style={cardStyle}>
        <p style={eyebrow}>For venue owners</p>
        <h1 style={title}>List your venue</h1>
        <p style={subtitle}>
          Register your spot and reach people looking for their next go-to
          place.
        </p>

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
          style={{ display: "grid", gap: "14px", marginTop: "18px" }}
        >
          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              marginTop: "8px",
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
  minHeight: "100vh",
  background: "#f7f2e8",
  padding: "18px 16px 32px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const headerStyle = {
  width: "100%",
  maxWidth: "420px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "18px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  background: "#ffffff",
  borderRadius: "24px",
  padding: "18px 16px 20px",
  boxShadow: "0 10px 30px rgba(38,59,91,0.08)",
  boxSizing: "border-box",
};

const eyebrow = {
  margin: 0,
  color: "#c1735c",
  fontSize: "11px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  fontWeight: 700,
};

const title = {
  margin: "12px 0 8px",
  fontSize: "30px",
  lineHeight: 1.1,
  fontWeight: 800,
  color: "#263b5b",
};

const subtitle = {
  margin: "0 0 18px",
  fontSize: "13px",
  color: "#6b7280",
  lineHeight: 1.5,
};

const stepTracker = {
  display: "flex",
  gap: "8px",
};

const fieldGroup = {
  display: "grid",
  gap: "6px",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#263b5b",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #eadfce",
  borderRadius: "12px",
  background: "#faf9f7",
  padding: "10px 12px",
  fontSize: "14px",
  color: "#263b5b",
  outline: "none",
  fontFamily: "inherit",
};

const optionButton = {
  width: "100%",
  borderRadius: "12px",
  border: "1px solid #eadfce",
  padding: "12px 14px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  textAlign: "left",
};

const chipGroup = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const chip = {
  borderRadius: "9999px",
  border: "1px solid #eadfce",
  padding: "8px 12px",
  fontSize: "12px",
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
  padding: "10px 12px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
};

const primaryButton = {
  background: "#263b5b",
  color: "#ffffff",
  border: "none",
  borderRadius: "9999px",
  padding: "12px 18px",
  fontSize: "14px",
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

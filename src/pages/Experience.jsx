import React, { useEffect, useId, useRef, useState } from "react";
import TopNav from "../components/TopNav";
import {
  createExperienceRecord,
  experienceSubmissionsUpdateKey,
  readExperienceSubmissions,
  writeExperienceSubmissions,
} from "../utils/experienceSubmissions";
import { experienceHostSteps } from "../utils/experienceRoutes";
import "./Experience.css";

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

function FormField({ label, hint, children, className = "" }) {
  const controlId = useId();
  const childElements = React.Children.toArray(children);
  const hasDirectControl = childElements.some(
    (child) =>
      React.isValidElement(child) &&
      ["input", "select", "textarea"].includes(child.type),
  );
  const accessibleChildren = React.Children.map(children, (child) => {
    if (
      hasDirectControl &&
      React.isValidElement(child) &&
      ["input", "select", "textarea"].includes(child.type) &&
      !child.props.id
    ) {
      return React.cloneElement(child, { id: controlId });
    }
    return child;
  });

  return (
    <div className={`experience-field ${className}`}>
      {label &&
        (hasDirectControl ? (
          <label className="experience-label" htmlFor={controlId}>
            {label}
          </label>
        ) : (
          <div className="experience-label">{label}</div>
        ))}
      {accessibleChildren}
      {hint && <p className="experience-hint">{hint}</p>}
    </div>
  );
}

function ExperienceCard({ experience }) {
  const [photoSources, setPhotoSources] = useState([]);

  useEffect(() => {
    const sources = (experience.photos || []).map((photo) => ({
      name: photo.name || "",
      src: photo.blob ? URL.createObjectURL(photo.blob) : "",
    }));
    setPhotoSources(sources);
    return () =>
      sources.forEach(({ src }) => {
        if (src) URL.revokeObjectURL(src);
      });
  }, [experience.photos]);

  const experienceDate = experience.date
    ? new Date(`${experience.date}T00:00:00Z`).toLocaleDateString(undefined, {
        dateStyle: "medium",
        timeZone: "UTC",
      })
    : "";
  const duration =
    experience.duration === "Other"
      ? experience.customDuration
      : experience.duration;
  const neighbourhood =
    experience.neighbourhood === "Other — specify"
      ? experience.customNeighbourhood
      : experience.neighbourhood;
  const groupSize =
    experience.groupSizeType === "unlimited" ||
    experience.groupSize === "Unlimited spots"
      ? "Unlimited spots"
      : experience.groupSize
        ? `${experience.groupSize} spots`
        : "Limited spots";
  const ageRange =
    experience.minimumAge || experience.maximumAge
      ? `${experience.minimumAge || "18"}–${experience.maximumAge || "60"}`
      : "";
  const instagramHandle = experience.instagramHandle
    ? `@${experience.instagramHandle.replace(/^@/, "")}`
    : "";
  const coverImage = photoSources[0]?.src;

  return (
    <article className="experience-event-card">
      <div className="experience-event-media">
        {coverImage ? (
          <img src={coverImage} alt={experience.experienceName || "Experience"} />
        ) : (
          <div className="experience-event-placeholder" aria-hidden="true">
            <span>COMOT</span>
          </div>
        )}
        {experience.category && (
          <span className="experience-event-category">{experience.category}</span>
        )}
      </div>
      <div className="experience-event-body">
        <div className="experience-event-title-row">
          <h3>{experience.experienceName || "Untitled experience"}</h3>
          {experience.genderComposition && (
            <span className="experience-event-audience">
              {experience.genderComposition}
            </span>
          )}
        </div>
        <p className="experience-event-description">
          {experience.description || "A curated outing with the Comot community."}
        </p>
        <p className="experience-event-meta">
          {experienceDate}
          {experience.startTime ? ` · ${experience.startTime}` : ""}
          {experience.duration ? ` · ${experience.duration}` : ""}
        </p>
        <p className="experience-event-location">
          {[experience.venueName, neighbourhood]
            .filter(Boolean)
            .join(" · ") || "Location to be announced"}
        </p>
        <div className="experience-event-footer">
          <span>{groupSize}</span>
          <strong>
            {Number(experience.commitmentFee) > 0
              ? `₦${Number(experience.commitmentFee).toLocaleString()}`
              : "Free"}
          </strong>
        </div>
        <details className="experience-event-details">
          <summary>View full experience details</summary>
          <div className="experience-event-details-content">
            <dl>
              <div>
                <dt>About this experience</dt>
                <dd>{experience.description || "Not provided"}</dd>
              </div>
              <div>
                <dt>Who can attend</dt>
                <dd>{experience.genderComposition || "Mixed"}</dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>
                  {[experienceDate, experience.startTime, duration]
                    .filter(Boolean)
                    .join(" · ") || "Date and time to be announced"}
                </dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>{experience.venueName || "Not provided"}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{experience.venueAddress || "Not provided"}</dd>
              </div>
              <div>
                <dt>Area</dt>
                <dd>{neighbourhood || "Not provided"}</dd>
              </div>
              {experience.mapsLink && (
                <div>
                  <dt>Map</dt>
                  <dd>
                    <a href={experience.mapsLink} target="_blank" rel="noreferrer">
                      Open venue in Google Maps
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt>Spots</dt>
                <dd>{groupSize}</dd>
              </div>
              <div>
                <dt>Commitment fee</dt>
                <dd>
                  {Number(experience.commitmentFee) > 0
                    ? `₦${Number(experience.commitmentFee).toLocaleString()}`
                    : "Free"}
                </dd>
              </div>
              <div>
                <dt>Included in the fee</dt>
                <dd>{experience.feeIncludes || "Not provided"}</dd>
              </div>
              {experience.dressCode && (
                <div>
                  <dt>Dress code</dt>
                  <dd>{experience.dressCode}</dd>
                </div>
              )}
              {experience.whatToBring && (
                <div>
                  <dt>What to bring</dt>
                  <dd>{experience.whatToBring}</dd>
                </div>
              )}
              {ageRange && (
                <div>
                  <dt>Suitable ages</dt>
                  <dd>{ageRange}</dd>
                </div>
              )}
              <div>
                <dt>Hosted by</dt>
                <dd>{experience.hostName || "Comot"}</dd>
              </div>
              {experience.hostBio && (
                <div>
                  <dt>About the host</dt>
                  <dd>{experience.hostBio}</dd>
                </div>
              )}
              {instagramHandle && (
                <div>
                  <dt>Instagram</dt>
                  <dd>{instagramHandle}</dd>
                </div>
              )}
            </dl>
            {photoSources.length > 1 && (
              <div className="experience-event-gallery" aria-label="More experience photos">
                {photoSources.slice(1).map(({ name, src }, index) =>
                  src ? (
                    <img
                      key={`${name}-${index}`}
                      src={src}
                      alt={name || `Additional experience photo ${index + 1}`}
                      loading="lazy"
                    />
                  ) : null,
                )}
              </div>
            )}
          </div>
        </details>
      </div>
    </article>
  );
}

function CommunityGuidelines() {
  return (
    <details className="experience-guidelines">
      <summary>Read the Comot Community Guidelines</summary>
      <div className="experience-guidelines-content">
        <p>
          Comot exists to help Nigerians discover their cities and connect with
          new people in safe, enjoyable, and memorable ways. These guidelines
          exist to protect everyone on the platform, including hosts, attendees,
          and the Comot community as a whole. By using Comot you agree to these
          guidelines.
        </p>
        <h3>For Everyone</h3>
        <ul>
          <li>
            <strong>Be respectful.</strong> Treat every person you meet through
            Comot with basic human dignity. Harassment, discrimination, bullying,
            or threatening behaviour of any kind — online or at an experience —
            will result in immediate removal from the platform.
          </li>
          <li>
            <strong>Be honest.</strong> Your profile, your experience listings,
            and your interactions should be truthful. Misrepresenting yourself,
            your venue, or your experience is grounds for account suspension.
          </li>
          <li>
            <strong>Keep it public.</strong> All Comot experiences must take
            place at public, accessible venues. No private residences, no
            locations that cannot be independently verified on Google Maps.
          </li>
          <li>
            <strong>Respect boundaries.</strong> Consent matters. If someone is
            not interested in conversation, contact, or interaction, respect
            that immediately and without question.
          </li>
          <li>
            <strong>No soliciting.</strong> Comot is not a sales platform. Do
            not use experiences or the in-app chat to sell products, services,
            or opportunities to other users.
          </li>
        </ul>
        <h3>For Hosts</h3>
        <ul>
          <li>
            <strong>Host what you can deliver.</strong> Only list experiences
            you are genuinely prepared and equipped to run. Cancelling on
            confirmed attendees damages the community’s trust.
          </li>
          <li>
            <strong>Cancellation responsibility.</strong> If you must cancel,
            do so at least 48 hours before the experience. All attendees must be
            fully refunded. Repeated cancellations will result in hosting
            privileges being suspended.
          </li>
          <li>
            <strong>Accurate listings.</strong> Your experience description,
            photos, venue, price, and date must be accurate. Do not misrepresent
            what attendees should expect.
          </li>
          <li>
            <strong>Venue verification.</strong> The venue you list must be a
            real, publicly accessible location. Comot reserves the right to
            verify any venue before approving a listing.
          </li>
          <li>
            <strong>Safety first.</strong> As a host, you are responsible for
            creating a safe environment at your experience. If a situation
            arises that makes attendees feel unsafe, address it immediately or
            contact the Comot team.
          </li>
          <li>
            <strong>No discrimination.</strong> You may specify gender
            composition for your experience, such as Mixed, Ladies Only, or Men
            Only. Beyond that, you may not discriminate on the basis of tribe,
            religion, body type, skin tone, or any other characteristic in who
            you allow to attend.
          </li>
        </ul>
        <h3>For Attendees</h3>
        <ul>
          <li>
            <strong>Show up or give notice.</strong> If you register and pay for
            an experience, be there. If you cannot attend, notify the host and
            the Comot team as early as possible. Repeated no-shows without
            notice will affect your ability to register for future experiences.
          </li>
          <li>
            <strong>Arrive ready to connect.</strong> Comot experiences are
            social by design. Come with an open mind and a genuine willingness
            to meet new people.
          </li>
          <li>
            <strong>Respect the host.</strong> The host has put time and effort
            into creating the experience. Follow any reasonable instructions
            they give and treat their chosen venue with respect.
          </li>
          <li>
            <strong>Keep things appropriate.</strong> Do not share photos or
            videos of other attendees without their consent. The in-app group
            chat is for coordinating around the experience, not for unsolicited
            personal outreach after the event.
          </li>
        </ul>
        <h3>Content and Reviews</h3>
        <ul>
          <li>
            <strong>Honest reviews only.</strong> Your review of a venue or
            experience should reflect your genuine experience. Fake reviews —
            positive or negative — are a violation of these guidelines.
          </li>
          <li>
            <strong>No hate speech.</strong> Content submitted to Comot —
            reviews, photos, descriptions — must not contain hate speech,
            explicit content, or material that targets any individual or group.
          </li>
        </ul>
        <h3>Enforcement</h3>
        <p>Comot reserves the right to:</p>
        <ul>
          <li>Remove any content that violates these guidelines</li>
          <li>Suspend or permanently ban any account that violates these guidelines</li>
          <li>Withhold or reverse payments in cases of fraud or misrepresentation</li>
          <li>Refuse or revoke hosting privileges at any time</li>
        </ul>
        <p>
          Violations can be reported through the app or by contacting us
          directly. We review all reports and take action where warranted.
        </p>
        <h3>Questions?</h3>
        <p>
          If you’re unsure whether something is allowed, ask us before you do
          it. We’d rather answer a question than deal with a problem. Contact:{" "}
          <a href="mailto:hello@comot.ng">hello@comot.ng</a>
        </p>
      </div>
    </details>
  );
}

export default function Experience({ onNavigate, step = null }) {
  const [submitted, setSubmitted] = useState(false);
  const [approvedExperiences, setApprovedExperiences] = useState([]);
  const [eventsError, setEventsError] = useState("");
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(true);
  const [groupSizeType, setGroupSizeType] = useState("limited");
  const [duration, setDuration] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const stepRefs = useRef([]);

  useEffect(() => {
    if (step !== null) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    let isMounted = true;
    const refreshExperiences = async (event) => {
      if (
        event &&
        event.key !== experienceSubmissionsUpdateKey &&
        event.key !== null
      ) {
        return;
      }
      try {
        const experiences = await readExperienceSubmissions();
        if (isMounted) {
          setApprovedExperiences(
            experiences.filter((item) => item.status === "approved"),
          );
          setEventsError("");
        }
      } catch {
        if (isMounted) {
          setEventsError("Approved experiences could not be loaded.");
        }
      } finally {
        if (isMounted) setIsLoadingExperiences(false);
      }
    };
    refreshExperiences();
    window.addEventListener("storage", refreshExperiences);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", refreshExperiences);
    };
  }, []);

  const advanceStep = () => {
    const activeFieldset = stepRefs.current[step];
    if (!activeFieldset?.checkValidity()) {
      activeFieldset?.reportValidity();
      return;
    }
    onNavigate?.(experienceHostSteps[step + 1].page);
    setPhotoError("");
  };

  const navigateToStep = (nextStep) => {
    onNavigate?.(experienceHostSteps[nextStep].page);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPhotoError("");
    setSubmitError("");

    for (let index = 0; index < stepRefs.current.length; index += 1) {
      const fieldset = stepRefs.current[index];
      if (fieldset && !fieldset.checkValidity()) {
        navigateToStep(index);
        fieldset.reportValidity();
        return;
      }
    }

    if (!coverPhoto) {
      setPhotoError("Please upload a cover photo.");
      navigateToStep(7);
      return;
    }

    if (additionalPhotos.length > 4) {
      setPhotoError("Please choose no more than 4 additional photos.");
      navigateToStep(7);
      return;
    }

    if (coverPhoto) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(coverPhoto.type)) {
        setPhotoError("The cover photo must be a JPG, PNG, or WEBP image.");
        navigateToStep(7);
        return;
      }
      if (coverPhoto.size > 5 * 1024 * 1024) {
        setPhotoError("The cover photo must be 5MB or smaller.");
        navigateToStep(7);
        return;
      }
      if (!(await imageMeetsMinimumSize(coverPhoto))) {
        setPhotoError("The cover photo must be at least 800 × 600px.");
        navigateToStep(7);
        return;
      }
    }
    if (
      additionalPhotos.some(
        (photo) =>
          !["image/jpeg", "image/png", "image/webp"].includes(photo.type),
      )
    ) {
      setPhotoError("Additional photos must be JPG, PNG, or WEBP images.");
      navigateToStep(7);
      return;
    }

    const values = Object.fromEntries(
      [...formData.entries()].filter(
        ([name]) => !["coverPhoto", "additionalPhotos"].includes(name),
      ),
    );
    const record = createExperienceRecord(
      {
        ...values,
        groupSizeType,
        groupSize:
          groupSizeType === "unlimited" ? "Unlimited spots" : values.groupSize,
        photos: [coverPhoto, ...additionalPhotos].filter(Boolean),
      },
      "pending",
    );
    try {
      const existing = await readExperienceSubmissions();
      await writeExperienceSubmissions([record, ...existing]);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(
        "Your experience could not be submitted. Please try again.",
      );
    }
  };

  if (submitted) {
    return (
      <div className="simple-page experience-page">
        <div className="simple-page-inner">
          <TopNav active="experience" onNavigate={onNavigate} />
          <main className="experience-success">
            <div className="experience-success-icon" aria-hidden="true">
              ✓
            </div>
            <p className="experience-eyebrow">Submission received</p>
            <h1>You’re submitted!</h1>
            <p>
              We’ll review your experience within 48 hours and be in touch at{" "}
              <a href="mailto:admin@comot.ng">admin@comot.ng</a>. In the
              meantime, you can view your pending submission under My
              Experiences in your profile.
            </p>
            <button
              type="button"
              className="experience-primary-button"
              onClick={() => onNavigate?.("explore")}
            >
              Back to Explore
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`simple-page experience-page${step !== null ? " experience-page--form" : ""}`}
    >
      <div className="simple-page-inner">
        <TopNav active="experience" onNavigate={onNavigate} />
        <main>
          {step === null ? (
            <>
              <section className="experience-hero" aria-labelledby="experience-title">
                <h1 id="experience-title">Curated Outings</h1>
                <p>
                  Discover plans worth showing up for, come as you are, or
                  create an experience of your own.
                </p>
              </section>

              <section
                className="experience-approved-section"
                aria-labelledby="approved-experiences-title"
              >
                <div className="experience-approved-heading">
                  <div>
                    <p className="experience-eyebrow">Explore the community</p>
                    <h2 id="approved-experiences-title">
                      Upcoming experiences
                    </h2>
                  </div>
                  <span>
                    {isLoadingExperiences
                      ? "Loading…"
                      : `${approvedExperiences.length} ${approvedExperiences.length === 1 ? "experience" : "experiences"}`}
                  </span>
                </div>
                {eventsError ? (
                  <p className="experience-events-message" role="alert">
                    {eventsError}
                  </p>
                ) : isLoadingExperiences ? (
                  <p className="experience-events-message" role="status">
                    Loading approved experiences…
                  </p>
                ) : approvedExperiences.length ? (
                  <div className="experience-event-grid">
                    {approvedExperiences.map((experience) => (
                      <ExperienceCard
                        key={experience.id}
                        experience={experience}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="experience-events-message">
                    New experiences are on the way. Check back soon.
                  </p>
                )}
              </section>

              <section className="experience-host-card" aria-label="Host an experience">
                <div>
                  <p className="experience-eyebrow">Have a great idea?</p>
                  <h2>HOST AN EXPERIENCE</h2>
                  <p>Got a spot and a plan? Create an Experience.</p>
                </div>
                <button
                  className="experience-primary-button"
                  type="button"
                  onClick={() => onNavigate?.("experience-host-basics")}
                >
                  Host an experience
                  <span aria-hidden="true">→</span>
                </button>
              </section>
            </>
          ) : (
            <section
              className="experience-form-section"
              aria-labelledby="submission-title"
            >
              <header className="experience-form-header">
                <p className="experience-eyebrow">Your idea starts here</p>
                <h2 id="submission-title">Host an Experience</h2>
                <p>
                  Fill in the details below and our team will review your
                  submission within 48 hours. Once approved, your experience goes
                  live on the app.
                </p>
              </header>

            <form
              className="experience-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div
                className="experience-step-indicator"
                role="status"
                aria-live="polite"
              >
                <span>Step {step + 1} of 9</span>
                <div
                  className="experience-step-progress"
                  role="progressbar"
                  aria-label="Form progress"
                  aria-valuemin={1}
                  aria-valuemax={9}
                  aria-valuenow={step + 1}
                >
                  <span style={{ width: `${((step + 1) / 9) * 100}%` }} />
                </div>
              </div>
              <fieldset
                className="experience-form-group"
                aria-labelledby="basics-heading"
                hidden={step !== 0}
                ref={(element) => { stepRefs.current[0] = element; }}
              >
                <h3 id="basics-heading">01 <span>The Basics</span></h3>
                <div className="experience-form-grid">
                  <FormField label="What are you calling this experience?">
                    <input
                      name="experienceName"
                      type="text"
                      placeholder="e.g. The Random Saturday Experience"
                      required
                    />
                  </FormField>
                  <FormField
                    label="Describe the experience"
                    hint="Keep it honest and exciting. This is what potential attendees will read."
                    className="experience-field-full"
                  >
                    <textarea
                      name="description"
                      placeholder="What will people be doing? What’s the vibe? What should they expect?"
                      maxLength={300}
                      rows={4}
                      required
                    />
                    <span className="experience-character-count">
                      Up to 300 characters
                    </span>
                  </FormField>
                  <FormField label="What type of experience is this?">
                    <select name="category" defaultValue="" required>
                      <option value="" disabled>Select a category</option>
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </FormField>
                </div>
              </fieldset>

              <fieldset
                className="experience-form-group"
                aria-labelledby="group-heading"
                hidden={step !== 1}
                ref={(element) => { stepRefs.current[1] = element; }}
              >
                <h3 id="group-heading">02 <span>Group Details</span></h3>
                <div className="experience-form-grid">
                  <fieldset className="experience-field experience-field-full">
                    <legend className="experience-label">
                      How many people can attend?
                    </legend>
                    <div className="experience-choice-row">
                      <label className={`experience-choice ${groupSizeType === "limited" ? "is-selected" : ""}`}>
                        <input
                          type="radio"
                          name="groupSizeType"
                          value="limited"
                          checked={groupSizeType === "limited"}
                          required
                          onChange={() => setGroupSizeType("limited")}
                        />
                        <span>Set a limit</span>
                      </label>
                      <label className={`experience-choice ${groupSizeType === "unlimited" ? "is-selected" : ""}`}>
                        <input
                          type="radio"
                          name="groupSizeType"
                          value="unlimited"
                          checked={groupSizeType === "unlimited"}
                          onChange={() => setGroupSizeType("unlimited")}
                        />
                        <span>Open to all</span>
                      </label>
                    </div>
                    {groupSizeType === "limited" ? (
                      <input
                        name="groupSize"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Maximum number of attendees"
                        required
                      />
                    ) : (
                      <p className="experience-inline-note">
                        Your experience will be listed as “Unlimited spots”.
                      </p>
                    )}
                    <p className="experience-hint">
                      Not sure how many people can fit? Choose Open to All and
                      we’ll help you manage attendance.
                    </p>
                  </fieldset>
                  <fieldset className="experience-field experience-field-full">
                    <legend className="experience-label">
                      Who is this experience open to?
                    </legend>
                    <div className="experience-choice-row">
                      {["Mixed", "Ladies Only", "Men Only"].map((option) => (
                        <label className="experience-choice" key={option}>
                          <input
                            type="radio"
                            name="genderComposition"
                            value={option}
                            required={option === "Mixed"}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    <p className="experience-hint">
                      This appears as a badge on your experience card.
                    </p>
                  </fieldset>
                </div>
              </fieldset>

              <fieldset
                className="experience-form-group"
                aria-labelledby="date-heading"
                hidden={step !== 2}
                ref={(element) => { stepRefs.current[2] = element; }}
              >
                <h3 id="date-heading">03 <span>Date and Time</span></h3>
                <div className="experience-form-grid">
                  <FormField
                    label="When is the experience?"
                    hint="Choose a date at least 7 days from today. We need time to review and promote."
                  >
                    <input
                      name="date"
                      type="date"
                      min={getEarliestDate()}
                      required
                    />
                  </FormField>
                  <FormField label="What time does it start?">
                    <input name="startTime" type="time" required />
                  </FormField>
                  <FormField label="How long will it last?">
                    <select
                      name="duration"
                      value={duration}
                      onChange={(event) => setDuration(event.target.value)}
                      required
                    >
                      <option value="" disabled>Select a duration</option>
                      {durations.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </FormField>
                  {duration === "Other" && (
                    <FormField label="Enter the estimated duration">
                      <input
                        name="customDuration"
                        type="text"
                        placeholder="e.g. 90 minutes"
                        required
                      />
                    </FormField>
                  )}
                </div>
              </fieldset>

              <fieldset
                className="experience-form-group"
                aria-labelledby="location-heading"
                hidden={step !== 3}
                ref={(element) => { stepRefs.current[3] = element; }}
              >
                <h3 id="location-heading">04 <span>Location</span></h3>
                <div className="experience-form-grid">
                  <FormField label="What is the venue called?">
                    <input
                      name="venueName"
                      type="text"
                      placeholder="e.g. Millennium Park, Jabi Lake Mall rooftop"
                      required
                    />
                  </FormField>
                  <FormField label="Full address">
                    <input
                      name="venueAddress"
                      type="text"
                      placeholder="Street, neighbourhood, city"
                      required
                    />
                  </FormField>
                  <FormField
                    label="Paste the Google Maps link to the venue"
                    hint="Open Google Maps, find the venue, tap Share, copy the link and paste here."
                    className="experience-field-full"
                  >
                    <input
                      name="mapsLink"
                      type="url"
                      placeholder="https://maps.google.com/..."
                      required
                    />
                  </FormField>
                  <FormField label="Which area is this in?">
                    <select
                      name="neighbourhood"
                      value={neighbourhood}
                      onChange={(event) => setNeighbourhood(event.target.value)}
                      required
                    >
                      <option value="" disabled>Select an area</option>
                      {neighbourhoods.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </FormField>
                  {neighbourhood === "Other — specify" && (
                    <FormField label="Enter the neighbourhood">
                      <input
                        name="customNeighbourhood"
                        type="text"
                        placeholder="Neighbourhood"
                        required
                      />
                    </FormField>
                  )}
                </div>
              </fieldset>

              <fieldset
                className="experience-form-group"
                aria-labelledby="pricing-heading"
                hidden={step !== 4}
                ref={(element) => { stepRefs.current[4] = element; }}
              >
                <h3 id="pricing-heading">05 <span>Pricing</span></h3>
                <div className="experience-form-grid">
                  <FormField
                    label="What is the commitment fee per person?"
                    hint="This is the amount each attendee will pay to join your experience. Comot charges a 15% platform service fee on paid ticket sales."
                  >
                    <div className="experience-currency-input">
                      <span aria-hidden="true">₦</span>
                      <input
                        name="commitmentFee"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="e.g. 5000"
                        aria-label="Commitment fee in naira"
                        required
                      />
                    </div>
                  </FormField>
                  <FormField
                    label="What is included in the fee?"
                    hint="Be specific. Attendees decide whether to register based on this."
                  >
                    <input
                      name="feeIncludes"
                      type="text"
                      placeholder="e.g. Entry, one welcome drink, access to all activities"
                      required
                    />
                  </FormField>
                </div>
              </fieldset>

              <fieldset
                className="experience-form-group"
                aria-labelledby="details-heading"
                hidden={step !== 5}
                ref={(element) => { stepRefs.current[5] = element; }}
              >
                <h3 id="details-heading">06 <span>Experience Details</span></h3>
                <div className="experience-form-grid">
                  <FormField
                    label="Is there a dress code?"
                    hint="Leave blank if there is no dress code."
                  >
                    <input
                      name="dressCode"
                      type="text"
                      placeholder="e.g. Nostalgic, All White, Smart Casual, No dress code"
                    />
                  </FormField>
                  <FormField label="Is there anything attendees should bring?">
                    <textarea
                      name="whatToBring"
                      placeholder="e.g. Comfortable shoes, a mat, a dish to share"
                      rows={3}
                    />
                  </FormField>
                  <fieldset className="experience-field experience-field-full">
                    <legend className="experience-label">
                      What age range is this experience suitable for?
                    </legend>
                    <div className="experience-age-range">
                      <label>
                        <span>From</span>
                        <input
                          name="minimumAge"
                          type="number"
                          min="18"
                          max="60"
                          defaultValue="21"
                          aria-label="Minimum suitable age"
                        />
                      </label>
                      <span aria-hidden="true">to</span>
                      <label>
                        <span>To</span>
                        <input
                          name="maximumAge"
                          type="number"
                          min="18"
                          max="60"
                          defaultValue="35"
                          aria-label="Maximum suitable age"
                        />
                      </label>
                    </div>
                    <p className="experience-hint">
                      Leave at default if open to all adults.
                    </p>
                  </fieldset>
                </div>
              </fieldset>

              <fieldset
                className="experience-form-group"
                aria-labelledby="host-heading"
                hidden={step !== 6}
                ref={(element) => { stepRefs.current[6] = element; }}
              >
                <h3 id="host-heading">07 <span>Host Details</span></h3>
                <div className="experience-form-grid">
                  <FormField label="Your name or organisation name">
                    <input
                      name="hostName"
                      type="text"
                      placeholder="How should attendees know you?"
                      required
                    />
                  </FormField>
                  <FormField label="Tell attendees a little about yourself">
                    <textarea
                      name="hostBio"
                      placeholder="Who are you and why are you hosting this experience?"
                      maxLength={150}
                      rows={3}
                      required
                    />
                    <span className="experience-character-count">
                      Up to 150 characters
                    </span>
                  </FormField>
                  <FormField label="Your Instagram handle (optional)">
                    <div className="experience-prefix-input">
                      <span aria-hidden="true">@</span>
                      <input
                        name="instagramHandle"
                        type="text"
                        placeholder="yourhandle"
                        aria-label="Instagram handle"
                      />
                    </div>
                  </FormField>
                  <FormField
                    label="WhatsApp number for coordination"
                    hint="This is only used by the Comot team to reach you about your experience. It is not shown to attendees."
                  >
                    <input
                      name="hostPhone"
                      type="tel"
                      autoComplete="tel"
                      required
                    />
                  </FormField>
                </div>
              </fieldset>

              <fieldset
                className="experience-form-group"
                aria-labelledby="photos-heading"
                hidden={step !== 7}
                ref={(element) => { stepRefs.current[7] = element; }}
              >
                <h3 id="photos-heading">08 <span>Photos</span></h3>
                <div className="experience-form-grid">
                  <FormField
                    label="Upload a cover photo for your experience"
                    hint="This is the main image on your experience card. Use a clear, well-lit photo that captures the vibe. Minimum 800 × 600px, maximum 5MB. JPG, PNG, or WEBP."
                    className="experience-field-full"
                  >
                    <input
                      name="coverPhoto"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => {
                        setCoverPhoto(event.target.files?.[0] || null);
                        setPhotoError("");
                      }}
                      required
                    />
                  </FormField>
                  <FormField
                    label="Add more photos (optional)"
                    hint="Add up to 4 additional photos."
                    className="experience-field-full"
                  >
                    <input
                      name="additionalPhotos"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={(event) => {
                        setAdditionalPhotos(Array.from(event.target.files || []));
                        setPhotoError("");
                      }}
                    />
                  </FormField>
                  {photoError && (
                    <p className="experience-error experience-field-full" role="alert">
                      {photoError}
                    </p>
                  )}
                </div>
              </fieldset>

              <fieldset
                className="experience-form-group"
                aria-labelledby="terms-heading"
                hidden={step !== 8}
                ref={(element) => { stepRefs.current[8] = element; }}
              >
                <h3 id="terms-heading">09 <span>Terms</span></h3>
                <CommunityGuidelines />
                <label className="experience-checkbox">
                  <input
                    name="guidelinesAgreement"
                    type="checkbox"
                    required
                  />
                  <span>
                    I confirm that this experience takes place at a public venue
                    and complies with Comot’s community guidelines.
                  </span>
                </label>
                <label className="experience-checkbox">
                  <input
                    name="cancellationAgreement"
                    type="checkbox"
                    required
                  />
                  <span>
                    I understand that if I cancel an experience after payments,
                    attendees will be fully refunded and my hosting privileges
                    may be reviewed.
                  </span>
                </label>
              </fieldset>

              <div className="experience-step-actions">
                {step > 0 && (
                  <button
                    type="button"
                    className="experience-secondary-button"
                    onClick={() => navigateToStep(step - 1)}
                  >
                    Back
                  </button>
                )}
                {step < 8 ? (
                  <button
                    type="button"
                    className="experience-primary-button"
                    onClick={advanceStep}
                  >
                    Continue
                    <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <div className="experience-submit">
                    <button type="submit" className="experience-primary-button">
                      Submit for Review
                      <span aria-hidden="true">→</span>
                    </button>
                    <p>
                      Our team reviews all submissions within 48 hours. You will
                      be notified by email and in-app when your experience is
                      approved or if we need more information.
                    </p>
                  </div>
                )}
              </div>
            </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import { readExperienceSubmissions } from "../utils/experienceSubmissions";
import "./ExperienceDetail.css";

export default function ExperienceDetail({ onNavigate }) {
  const [experience, setExperience] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadExperience = async () => {
      const experienceId = decodeURIComponent(
        window.location.pathname.replace(/^\/experience\//, ""),
      );
      const submissions = await readExperienceSubmissions();
      const match = submissions.find((item) => item.id === experienceId);
      if (!isMounted) return;
      setExperience(match || null);
      setIsLoading(false);
    };

    loadExperience();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!experience) return undefined;
    const urls = (experience.photos || [])
      .filter((photo) => photo?.blob instanceof Blob)
      .map((photo) => URL.createObjectURL(photo.blob));
    setImages(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [experience]);

  useEffect(() => {
    if (selectedImageIndex === null) return undefined;
    const handleKeys = (event) => {
      if (event.key === "Escape") setSelectedImageIndex(null);
      if (event.key === "ArrowRight") {
        setSelectedImageIndex((current) =>
          current === null ? null : (current + 1) % images.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setSelectedImageIndex((current) =>
          current === null
            ? null
            : (current - 1 + images.length) % images.length,
        );
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [selectedImageIndex, images.length]);

  if (isLoading) {
    return (
      <div className="experience-detail-page">
        <TopNav active="experience" onNavigate={onNavigate} />
        <main className="experience-detail-status">Loading experience…</main>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="experience-detail-page">
        <TopNav active="experience" onNavigate={onNavigate} />
        <main className="experience-detail-status">
          <h1>Experience not found</h1>
          <button type="button" onClick={() => onNavigate("experience")}>Back to Experience</button>
        </main>
      </div>
    );
  }

  const experienceDate = experience.date
    ? new Date(`${experience.date}T00:00:00Z`).toLocaleDateString(undefined, {
        dateStyle: "long",
        timeZone: "UTC",
      })
    : "Date to be announced";
  const neighbourhood = experience.neighbourhood === "Other — specify"
    ? experience.customNeighbourhood
    : experience.neighbourhood;
  const duration = experience.duration === "Other"
    ? experience.customDuration
    : experience.duration;
  const ageRange = experience.minimumAge || experience.maximumAge
    ? `${experience.minimumAge || "18"}–${experience.maximumAge || "60"}`
    : "Not specified";
  const groupSize = experience.groupSizeType === "unlimited" ||
    experience.groupSize === "Unlimited spots"
    ? "Unlimited spots"
    : experience.groupSize
      ? `${experience.groupSize} spots`
      : "Limited spots";
  const commitmentFee = Number(experience.commitmentFee) > 0
    ? `₦${Number(experience.commitmentFee).toLocaleString()}`
    : "Free";
  const instagramHandle = experience.instagramHandle
    ? `@${experience.instagramHandle.replace(/^@/, "")}`
    : "";
  const fullDescription = experience.description?.trim()
    || "A curated outing with the Comot community.";

  const goToImage = (step) => {
    setSelectedImageIndex((current) =>
      (current + step + images.length) % images.length,
    );
  };

  return (
    <div className="experience-detail-page">
      <TopNav active="experience" onNavigate={onNavigate} />
      <main className="experience-detail-main">
        <button
          type="button"
          className="experience-detail-back"
          onClick={() => onNavigate("experience")}
        >
          ← Back to Experience
        </button>

        <section
          className={`experience-detail-gallery gallery-count-${Math.min(images.length, 5)}`}
          aria-label={`Photos of ${experience.experienceName}`}
        >
          {images.length ? (
            images.map((src, index) => (
              <button
                type="button"
                key={src}
                className="experience-detail-image-button"
                onClick={() => setSelectedImageIndex(index)}
                aria-label={`View ${experience.experienceName || "experience"} photo ${index + 1} full screen`}
              >
                <img
                  src={src}
                  alt={`${experience.experienceName || "Experience"} photo ${index + 1} of ${images.length}`}
                />
              </button>
            ))
          ) : (
            <div className="experience-detail-placeholder">Photo preview unavailable</div>
          )}
        </section>

        <section className="experience-detail-content">
          <p className="experience-detail-category">{experience.category || "Experience"}</p>
          <h1>{experience.experienceName || "Untitled experience"}</h1>
          <p className="experience-detail-location">
            {[experience.venueName, neighbourhood].filter(Boolean).join(" · ") || "Location to be announced"}
          </p>
          <p className="experience-detail-date">{experienceDate}{experience.startTime ? ` · ${experience.startTime}` : ""}</p>

          <div className="experience-detail-description">
            <h2>About this experience</h2>
            <p>{fullDescription}</p>

            <dl className="experience-detail-facts">
              <div>
                <dt>Who can attend</dt>
                <dd>{experience.genderComposition || "Mixed"}</dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>{[experienceDate, experience.startTime, duration].filter(Boolean).join(" · ")}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{duration || "To be announced"}</dd>
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
                <dd>{commitmentFee}</dd>
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
              <div>
                <dt>Suitable ages</dt>
                <dd>{ageRange}</dd>
              </div>
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
          </div>
        </section>
      </main>

      {selectedImageIndex !== null && (
        <div
          className="experience-detail-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${experience.experienceName || "Experience"} photo viewer`}
          onClick={() => setSelectedImageIndex(null)}
        >
          <button type="button" className="experience-detail-lightbox-close" onClick={() => setSelectedImageIndex(null)} aria-label="Close photo viewer">×</button>
          {images.length > 1 && (
            <button type="button" className="experience-detail-lightbox-arrow is-prev" onClick={(event) => { event.stopPropagation(); goToImage(-1); }} aria-label="Previous photo">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8" /></svg>
            </button>
          )}
          <img src={images[selectedImageIndex]} alt={`${experience.experienceName || "Experience"}, photo ${selectedImageIndex + 1} of ${images.length}`} onClick={(event) => event.stopPropagation()} />
          {images.length > 1 && (
            <button type="button" className="experience-detail-lightbox-arrow is-next" onClick={(event) => { event.stopPropagation(); goToImage(1); }} aria-label="Next photo">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8" /></svg>
            </button>
          )}
          <div className="experience-detail-lightbox-count">{selectedImageIndex + 1} / {images.length}</div>
        </div>
      )}
    </div>
  );
}

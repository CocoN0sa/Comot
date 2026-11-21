import React, { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import { readVenueSubmissions } from "../utils/venueSubmissions";
import "./VenueDetail.css";

export default function VenueDetail({ onNavigate }) {
  const [venue, setVenue] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadVenue = async () => {
      const venueId = decodeURIComponent(window.location.pathname.replace(/^\/venue\//, ""));
      const submissions = await readVenueSubmissions();
      const match = submissions.find((item) => item.id === venueId);
      if (!isMounted) return;
      setVenue(match || null);
      setIsLoading(false);
    };

    loadVenue();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedImageIndex === null) return undefined;
    const closeOnEscape = (event) => {
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
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedImageIndex, images.length]);

  useEffect(() => {
    if (!venue) return undefined;
    const urls = (venue.photos || [])
      .filter((photo) => photo?.blob instanceof Blob)
      .map((photo) => URL.createObjectURL(photo.blob));
    setImages(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [venue]);

  if (isLoading) {
    return (
      <div className="venue-detail-page">
        <TopNav active="explore" onNavigate={onNavigate} />
        <main className="venue-detail-status">Loading venue…</main>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="venue-detail-page">
        <TopNav active="explore" onNavigate={onNavigate} />
        <main className="venue-detail-status">
          <h1>Venue not found</h1>
          <button type="button" onClick={() => onNavigate("explore")}>Back to Explore</button>
        </main>
      </div>
    );
  }

  const fullDescription = venue.venueDescription?.trim()
    || venue.shortDescription?.trim()
    || "More details about this venue are coming soon.";

  const goToImage = (step) => {
    setSelectedImageIndex((current) =>
      (current + step + images.length) % images.length,
    );
  };

  return (
    <div className="venue-detail-page">
      <TopNav active="explore" onNavigate={onNavigate} />
      <main className="venue-detail-main">
        <button
          type="button"
          className="venue-detail-back"
          onClick={() => onNavigate("explore")}
        >
          ← Back to Explore
        </button>

        <section
          className={`venue-detail-gallery gallery-count-${Math.min(images.length, 5)}`}
          aria-label={`Photos of ${venue.venueName}`}
        >
          {images.length ? (
            images.map((src, index) => (
              <button
                type="button"
                key={src}
                className="venue-detail-image-button"
                onClick={() => setSelectedImageIndex(index)}
                aria-label={`View ${venue.venueName || "venue"} photo ${index + 1} full screen`}
              >
                <img
                  src={src}
                  alt={`${venue.venueName || "Venue"} photo ${index + 1} of ${images.length}`}
                />
              </button>
            ))
          ) : (
            <div className="venue-detail-placeholder">Photo preview unavailable</div>
          )}
        </section>

        <section className="venue-detail-content">
          <div className="venue-detail-heading">
            <div>
              <p className="venue-detail-type">{venue.venueType || "Venue"}</p>
              <h1>{venue.venueName || "Untitled venue"}</h1>
              <p className="venue-detail-location">
                {venue.neighbourhood || venue.fullAddress || "Abuja"}
              </p>
            </div>
          </div>
          <div className="venue-detail-description">
            <h2>About this venue</h2>
            <p>{fullDescription}</p>
          </div>
        </section>
      </main>

      {selectedImageIndex !== null && (
        <div
          className="venue-detail-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${venue.venueName || "Venue"} photo viewer`}
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            type="button"
            className="venue-detail-lightbox-close"
            onClick={() => setSelectedImageIndex(null)}
            aria-label="Close photo viewer"
          >×</button>
          {images.length > 1 && (
            <button
              type="button"
              className="venue-detail-lightbox-arrow is-prev"
              onClick={(event) => {
                event.stopPropagation();
                goToImage(-1);
              }}
              aria-label="Previous photo"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 4l-8 8 8 8" />
              </svg>
            </button>
          )}
          <img
            src={images[selectedImageIndex]}
            alt={`${venue.venueName || "Venue"}, photo ${selectedImageIndex + 1} of ${images.length}`}
            onClick={(event) => event.stopPropagation()}
          />
          {images.length > 1 && (
            <button
              type="button"
              className="venue-detail-lightbox-arrow is-next"
              onClick={(event) => {
                event.stopPropagation();
                goToImage(1);
              }}
              aria-label="Next photo"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 4l8 8-8 8" />
              </svg>
            </button>
          )}
          <div className="venue-detail-lightbox-count">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}

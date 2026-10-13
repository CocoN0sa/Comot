import React, { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import { readVenueSubmissions } from "../utils/venueSubmissions";

const vibeFilters = [
  "Quiet",
  "Lively",
  "Outdoor",
  "Rooftop",
  "Live Music",
  "Casual",
  "Upscale",
  "Hidden Gem",
];

const budgetFilters = ["Budget", "Mid", "Premium"];
const updateStorageKey = "comot_venue_submissions_updated";
const savedStorageKey = "comot_saved_venue_ids";

export default function Explore({ onNavigate }) {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All venues");
  const [selectedVibe, setSelectedVibe] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [savedIds, setSavedIds] = useState(readSavedIds);
  const [expandedGallery, setExpandedGallery] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadApprovedVenues = async () => {
      try {
        const allVenues = await readVenueSubmissions();
        if (isMounted) {
          setVenues(allVenues.filter((venue) => venue.status === "approved"));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const handleStorage = (event) => {
      if (event.key === updateStorageKey || event.key === null) {
        loadApprovedVenues();
      }
      if (event.key === savedStorageKey) setSavedIds(readSavedIds());
    };

    loadApprovedVenues();
    window.addEventListener("storage", handleStorage);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!expandedGallery) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setExpandedGallery(null);
      if (event.key === "ArrowRight") {
        setExpandedGallery((current) => ({
          ...current,
          index: (current.index + 1) % current.images.length,
        }));
      }
      if (event.key === "ArrowLeft") {
        setExpandedGallery((current) => ({
          ...current,
          index:
            (current.index - 1 + current.images.length) % current.images.length,
        }));
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [expandedGallery]);

  const venueTypes = [
    "All venues",
    ...new Set(venues.map((venue) => venue.venueType).filter(Boolean)),
  ];
  const normalizedSearch = search.trim().toLowerCase();
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      !normalizedSearch ||
      [venue.venueName, venue.neighbourhood, venue.fullAddress, venue.venueType]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));
    const matchesType =
      selectedType === "All venues" || venue.venueType === selectedType;
    const matchesVibe =
      !selectedVibe || (venue.vibeTags || []).includes(selectedVibe);
    const matchesBudget =
      !selectedBudget || budgetTier(venue.priceRange) === selectedBudget;
    return matchesSearch && matchesType && matchesVibe && matchesBudget;
  });

  const toggleSaved = (venueId) => {
    setSavedIds((current) => {
      const next = current.includes(venueId)
        ? current.filter((id) => id !== venueId)
        : [...current, venueId];
      try {
        window.localStorage.setItem(savedStorageKey, JSON.stringify(next));
      } catch {
        // The current view still updates if browser storage is unavailable.
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedType("All venues");
    setSelectedVibe("");
    setSelectedBudget("");
  };

  return (
    <div className="explore-page">
      <header className="explore-header">
        <div className="explore-header-inner">
          <TopNav active="explore" onNavigate={onNavigate} />
          <h1>Explore Abuja</h1>
          <div className="explore-intro-row">
            <p className="explore-intro">
              Find a place for the kind of day you have in mind.
            </p>
            <span className="explore-location">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                <circle cx="12" cy="10" r="2.3" />
              </svg>
              Abuja, Nigeria
            </span>
          </div>
        </div>
      </header>

      <div className="explore-search-band">
        <div className="explore-search-wrap">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.2 4.2" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search venues, areas, or experiences"
            aria-label="Search venues, areas, or experiences"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <main className="explore-content">
        <section className="explore-filters" aria-label="Venue filters">
          <div className="explore-filter-line">
            <span className="explore-filter-title">Category</span>
            <div
              className="explore-chip-scroll"
              role="group"
              aria-label="Filter by venue type"
            >
              {venueTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  className={
                    selectedType === type
                      ? "explore-chip is-selected"
                      : "explore-chip"
                  }
                  aria-pressed={selectedType === type}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="explore-filter-line">
            <span className="explore-filter-title">Vibe</span>
            <div
              className="explore-chip-scroll"
              role="group"
              aria-label="Filter by vibe"
            >
              <button
                type="button"
                className={
                  !selectedVibe ? "explore-chip is-selected" : "explore-chip"
                }
                aria-pressed={!selectedVibe}
                onClick={() => setSelectedVibe("")}
              >
                Any vibe
              </button>
              {vibeFilters.map((vibe) => (
                <button
                  type="button"
                  key={vibe}
                  className={
                    selectedVibe === vibe
                      ? "explore-chip is-selected"
                      : "explore-chip"
                  }
                  aria-pressed={selectedVibe === vibe}
                  onClick={() =>
                    setSelectedVibe(selectedVibe === vibe ? "" : vibe)
                  }
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>

          <div className="explore-filter-line explore-budget-line">
            <span className="explore-filter-title">Budget</span>
            <div
              className="explore-chip-scroll"
              role="group"
              aria-label="Filter by budget"
            >
              <button
                type="button"
                className={
                  !selectedBudget ? "explore-chip is-selected" : "explore-chip"
                }
                aria-pressed={!selectedBudget}
                onClick={() => setSelectedBudget("")}
              >
                Any price
              </button>
              {budgetFilters.map((budget) => (
                <button
                  type="button"
                  key={budget}
                  className={
                    selectedBudget === budget
                      ? "explore-chip is-selected"
                      : "explore-chip"
                  }
                  aria-pressed={selectedBudget === budget}
                  onClick={() =>
                    setSelectedBudget(selectedBudget === budget ? "" : budget)
                  }
                >
                  {budget}
                </button>
              ))}
            </div>
            {(search ||
              selectedVibe ||
              selectedBudget ||
              selectedType !== "All venues") && (
              <button
                type="button"
                className="explore-clear"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        <div className="explore-results-heading">
          <div>
            <h2>{selectedVibe ? `${selectedVibe} spots` : "Places to go"}</h2>
            <p>
              {isLoading
                ? "Loading approved venues…"
                : `${filteredVenues.length} ${filteredVenues.length === 1 ? "place" : "places"} to explore`}
            </p>
          </div>
          {savedIds.length > 0 && (
            <span className="saved-count">
              {savedIds.length} saved for later
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="explore-empty" role="status">
            Finding approved venues…
          </div>
        ) : filteredVenues.length ? (
          <div className="venue-grid">
            {filteredVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                isSaved={savedIds.includes(venue.id)}
                onToggleSaved={() => toggleSaved(venue.id)}
                onExpand={(images, index) =>
                  setExpandedGallery({ title: venue.venueName, images, index })
                }
              />
            ))}
          </div>
        ) : (
          <div className="explore-empty">
            <span className="explore-empty-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.2 4.2" />
              </svg>
            </span>
            <h3>
              {venues.length
                ? "No places match those filters"
                : "New places are on the way"}
            </h3>
            <p>
              {venues.length
                ? "Try another search or clear a filter to see more approved venues."
                : "Approved venues will appear here as they join COMOT."}
            </p>
            {(search ||
              selectedVibe ||
              selectedBudget ||
              selectedType !== "All venues") && (
              <button
                type="button"
                className="explore-empty-action"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>

      {expandedGallery && (
        <ImageViewer
          title={expandedGallery.title}
          images={expandedGallery.images}
          index={expandedGallery.index}
          onIndexChange={(index) =>
            setExpandedGallery((current) => ({ ...current, index }))
          }
          onClose={() => setExpandedGallery(null)}
        />
      )}
    </div>
  );
}

function VenueCard({ venue, isSaved, onToggleSaved, onExpand }) {
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const urls = (venue.photos || [])
      .filter((photo) => photo?.blob instanceof Blob)
      .map((photo) => URL.createObjectURL(photo.blob));
    setImages(urls);
    setImageIndex(0);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [venue.photos]);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % images.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [images]);

  return (
    <article className="venue-card">
      <div className="venue-card-media">
        {images.length ? (
          <>
            <button
              type="button"
              className="venue-photo-trigger"
              onClick={() => onExpand(images, imageIndex)}
              aria-label={`Expand photos for ${venue.venueName}`}
            >
              <img
                key={images[imageIndex]}
                src={images[imageIndex]}
                alt={`${venue.venueName} photo ${imageIndex + 1} of ${images.length}`}
                className="venue-card-image"
              />
              <span className="venue-expand-hint">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" />
                </svg>
                View photos
              </span>
            </button>
            {images.length > 1 && (
              <div
                className="venue-photo-dots"
                aria-label={`${images.length} photos`}
              >
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    aria-label={`Show photo ${index + 1}`}
                    aria-pressed={imageIndex === index}
                    className={
                      imageIndex === index
                        ? "venue-photo-dot is-active"
                        : "venue-photo-dot"
                    }
                    onClick={() => setImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="venue-photo-placeholder">
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <rect x="6" y="8" width="36" height="32" rx="3" />
              <circle cx="17" cy="19" r="3" />
              <path d="m8 35 11-10 7 6 6-5 8 8" />
            </svg>
            <span>Photo preview unavailable</span>
          </div>
        )}
        <span className="venue-type-badge">{venue.venueType || "Venue"}</span>
      </div>

      <div className="venue-card-body">
        <div className="venue-card-heading">
          <div>
            <h3>{venue.venueName || "Untitled venue"}</h3>
            <p className="venue-location">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                <circle cx="12" cy="10" r="2.3" />
              </svg>
              {venue.neighbourhood || venue.fullAddress || "Abuja"}
            </p>
          </div>
          <span
            className={`venue-budget venue-budget-${budgetTier(venue.priceRange).toLowerCase()}`}
          >
            {budgetTier(venue.priceRange)}
          </span>
        </div>

        {(venue.vibeTags || []).length > 0 && (
          <div className="venue-vibe-list" aria-label="Venue vibes">
            {venue.vibeTags.map((vibe) => (
              <span key={vibe} className="venue-vibe-tag">
                {vibe}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          className={isSaved ? "visit-later is-saved" : "visit-later"}
          aria-pressed={isSaved}
          onClick={onToggleSaved}
        >
          {isSaved ? (
            <>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12 4 4L19 6" />
              </svg>
              Saved to your list
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21V4.8Z" />
              </svg>
              Visit Later
            </>
          )}
        </button>
      </div>
    </article>
  );
}

function ImageViewer({ title, images, index, onIndexChange, onClose }) {
  if (!images.length) return null;
  const goTo = (step) =>
    onIndexChange((index + step + images.length) % images.length);

  return (
    <div className="image-viewer" role="presentation" onClick={onClose}>
      <button
        type="button"
        className="image-viewer-close"
        onClick={onClose}
        aria-label="Close photo preview"
      >
        ×
      </button>
      {images.length > 1 && (
        <button
          type="button"
          className="image-viewer-arrow is-previous"
          onClick={(event) => {
            event.stopPropagation();
            goTo(-1);
          }}
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}
      <img
        src={images[index]}
        alt={`${title}, photo ${index + 1} of ${images.length}`}
        onClick={(event) => event.stopPropagation()}
      />
      <div
        className="image-viewer-caption"
        onClick={(event) => event.stopPropagation()}
      >
        <strong>{title}</strong>
        <span>
          {index + 1} / {images.length}
        </span>
      </div>
      {images.length > 1 && (
        <button
          type="button"
          className="image-viewer-arrow is-next"
          onClick={(event) => {
            event.stopPropagation();
            goTo(1);
          }}
          aria-label="Next photo"
        >
          ›
        </button>
      )}
    </div>
  );
}

function budgetTier(priceRange = "") {
  const normalized = priceRange.toLowerCase();
  if (normalized.includes("premium")) return "Premium";
  if (normalized.includes("mid")) return "Mid";
  if (normalized.includes("budget")) return "Budget";
  return "Budget";
}

function readSavedIds() {
  try {
    const saved = JSON.parse(
      window.localStorage.getItem(savedStorageKey) || "[]",
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

import React, { useEffect, useRef, useState } from "react";
import TopNav from "../components/TopNav";
import { readVenueSubmissions } from "../utils/venueSubmissions";
import {
  availableLocations,
  signupLocationStorageKey,
} from "../utils/locations";

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

function readSelectedLocation() {
  try {
    const location = window.localStorage.getItem(signupLocationStorageKey);
    return availableLocations.includes(location) ? location : "Abuja";
  } catch {
    return "Abuja";
  }
}

export default function Explore({ onNavigate }) {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All venues");
  const [selectedVibe, setSelectedVibe] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [openFilter, setOpenFilter] = useState("");
  const [savedIds, setSavedIds] = useState(readSavedIds);
  const [expandedGallery, setExpandedGallery] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(readSelectedLocation);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const locationSelectorRef = useRef(null);
  const filterMenuRef = useRef(null);
  const sharedVenueId = new URLSearchParams(window.location.search).get(
    "venue",
  );

  useEffect(() => {
    const closeLocationMenu = (event) => {
      if (!locationSelectorRef.current?.contains(event.target)) {
        setIsLocationMenuOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsLocationMenuOpen(false);
    };
    document.addEventListener("mousedown", closeLocationMenu);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeLocationMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    const closeFilterMenu = (event) => {
      if (!filterMenuRef.current?.contains(event.target)) {
        setOpenFilter("");
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpenFilter("");
    };
    document.addEventListener("mousedown", closeFilterMenu);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeFilterMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    const syncSelectedLocation = (event) => {
      if (event.key === signupLocationStorageKey || event.key === null) {
        setSelectedLocation(readSelectedLocation());
      }
    };
    window.addEventListener("storage", syncSelectedLocation);
    return () => window.removeEventListener("storage", syncSelectedLocation);
  }, []);

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
    if (isLoading || selectedLocation !== "Abuja" || !sharedVenueId) return;
    const targetCard = document.getElementById(`venue-${sharedVenueId}`);
    if (!targetCard) return;
    targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
    targetCard.focus({ preventScroll: true });
  }, [isLoading, selectedLocation, sharedVenueId, venues]);

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
        <TopNav active="explore" onNavigate={onNavigate} />
        <div className="explore-header-inner">
          <h1>Explore {selectedLocation}</h1>
          <div className="explore-intro-row">
            <p className="explore-intro">
              Find a place for the kind of day you have in mind.
            </p>
            <div className="explore-location-selector" ref={locationSelectorRef}>
              <button
                type="button"
                className="explore-location"
                aria-haspopup="listbox"
                aria-expanded={isLocationMenuOpen}
                onClick={() => setIsLocationMenuOpen((open) => !open)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                  <circle cx="12" cy="10" r="2.3" />
                </svg>
                {selectedLocation}, Nigeria
                <svg
                  className="explore-location-chevron"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </button>
              {isLocationMenuOpen && (
                <div
                  className="explore-location-menu"
                  role="listbox"
                  aria-label="Choose a location"
                >
                  {availableLocations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      role="option"
                      aria-selected={selectedLocation === location}
                      className={
                        selectedLocation === location
                          ? "explore-location-option is-selected"
                          : "explore-location-option"
                      }
                      onClick={() => {
                        setSelectedLocation(location);
                        setIsLocationMenuOpen(false);
                      }}
                    >
                      {location}
                      {location !== "Abuja" && (
                        <span className="location-coming-soon">Coming Soon</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {selectedLocation !== "Abuja" ? (
        <main className="explore-coming-soon" aria-live="polite">
          <div className="explore-coming-soon-card">
            <span className="explore-coming-soon-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 22s8-7.2 8-13a8 8 0 1 0-16 0c0 5.8 8 13 8 13Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </span>
            <p className="explore-coming-soon-eyebrow">COMOT is on the way</p>
            <h2>{selectedLocation} is coming soon</h2>
            <p>
              We’re not exploring {selectedLocation} just yet. Choose Abuja to
              discover places available now.
            </p>
            <button
              type="button"
              className="explore-coming-soon-action"
              onClick={() => setSelectedLocation("Abuja")}
            >
              Explore Abuja
            </button>
          </div>
        </main>
      ) : (
        <>
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
          <div className="explore-filter-buttons" ref={filterMenuRef}>
            <ExploreFilter
              label="Category"
              value={selectedType === "All venues" ? "" : selectedType}
              options={venueTypes
                .filter((type) => type !== "All venues")
                .map((type) => ({ label: type, value: type }))}
              isOpen={openFilter === "category"}
              onToggle={() =>
                setOpenFilter((current) =>
                  current === "category" ? "" : "category",
                )
              }
              onSelect={(value) => {
                setSelectedType((current) => (current === value ? "All venues" : value));
                setOpenFilter("");
              }}
            />
            <ExploreFilter
              label="Vibe"
              value={selectedVibe}
              options={vibeFilters.map((vibe) => ({
                label: vibe,
                value: vibe,
              }))}
              isOpen={openFilter === "vibe"}
              onToggle={() =>
                setOpenFilter((current) => (current === "vibe" ? "" : "vibe"))
              }
              onSelect={(value) => {
                setSelectedVibe((current) => (current === value ? "" : value));
                setOpenFilter("");
              }}
            />
            <ExploreFilter
              label="Budget"
              value={selectedBudget}
              options={budgetFilters.map((budget) => ({
                label: budget,
                value: budget,
              }))}
              isOpen={openFilter === "budget"}
              onToggle={() =>
                setOpenFilter((current) =>
                  current === "budget" ? "" : "budget",
                )
              }
              onSelect={(value) => {
                setSelectedBudget((current) => (current === value ? "" : value));
                setOpenFilter("");
              }}
            />
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
                isShared={venue.id === sharedVenueId}
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
        </>
      )}

      {selectedLocation === "Abuja" && expandedGallery && (
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

function ExploreFilter({ label, value, options, isOpen, onToggle, onSelect }) {
  return (
    <div className="explore-filter">
      <button
        type="button"
        className={value ? "explore-filter-button is-active" : "explore-filter-button"}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span>{value || label}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>
      {isOpen && (
        <div className="explore-filter-menu" role="menu" aria-label={label}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={value === option.value}
              className={
                value === option.value
                  ? "explore-filter-option is-selected"
                  : "explore-filter-option"
              }
              onClick={() => onSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VenueCard({ venue, isSaved, isShared, onToggleSaved, onExpand }) {
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [shareMessage, setShareMessage] = useState("");
  const mapsUrl = getGoogleMapsUrl(venue.googleMapsLink);
  const description =
    venue.shortDescription?.trim() || venue.venueDescription?.trim();

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

  const shareVenue = async () => {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("venue", venue.id);
    shareUrl.hash = "";
    const shareData = {
      title: venue.venueName || "COMOT venue",
      text:
        description ||
        `Explore ${venue.venueName || "this venue"} in ${venue.neighbourhood || "Abuja"}.`,
      url: shareUrl.href,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        setShareMessage("Venue shared.");
      } catch (error) {
        if (error?.name !== "AbortError") {
          setShareMessage("Couldn't share this venue. Please try again.");
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(
        `${shareData.text} ${shareData.url}`,
      );
      setShareMessage("Venue link copied.");
    } catch {
      setShareMessage("Sharing isn't available in this browser.");
    }
  };

  return (
    <article
      id={`venue-${venue.id}`}
      className={isShared ? "venue-card is-shared" : "venue-card"}
      tabIndex={isShared ? -1 : undefined}
    >
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
              <svg
                className="venue-location-pin"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="7.5" r="5" />
                <path d="M12 12.5V22" />
              </svg>
              {venue.neighbourhood || venue.fullAddress || "Abuja"}
            </p>
            {description && (
              <p className="venue-short-description">{description}</p>
            )}
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

        <div className="venue-card-footer">
          {mapsUrl && (
            <a
              className="venue-map-link"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                <circle cx="12" cy="10" r="2.3" />
              </svg>
              Open in Google Maps
            </a>
          )}
          <div className="venue-card-actions">
            <button
              type="button"
              className={
                isSaved
                  ? "venue-card-icon-button is-saved"
                  : "venue-card-icon-button"
              }
              aria-label={
                isSaved
                  ? `Remove ${venue.venueName} from saved venues`
                  : `Save ${venue.venueName} for later`
              }
              aria-pressed={isSaved}
              title={isSaved ? "Saved" : "Save venue"}
              onClick={onToggleSaved}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21V4.8Z" />
              </svg>
            </button>
            <button
              type="button"
              className="venue-card-icon-button"
              aria-label={`Share ${venue.venueName}`}
              title="Share venue"
              onClick={shareVenue}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.7 10.6 6.6-4.2M8.7 13.4l6.6 4.2" />
              </svg>
            </button>
          </div>
        </div>
        <span className="venue-share-feedback" role="status" aria-live="polite">
          {shareMessage}
        </span>
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

function getGoogleMapsUrl(value = "") {
  try {
    const url = new URL(value);
    const isGoogleMapsHost =
      url.hostname === "maps.app.goo.gl" ||
      url.hostname === "goo.gl" ||
      url.hostname === "google.com" ||
      url.hostname.endsWith(".google.com");
    return url.protocol === "https:" && isGoogleMapsHost ? url.href : "";
  } catch {
    return "";
  }
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

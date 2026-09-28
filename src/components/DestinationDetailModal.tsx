import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CloudSun,
  Compass,
  Heart,
  MapPin,
  Navigation,
  Star,
  Ticket,
  Utensils,
  X,
} from 'lucide-react';
import { Destination, Language, MapMarkerItem } from '../types/travel';
import { formatINR } from '../utils/scenicArt';

interface DestinationDetailModalProps {
  destination: Destination | null;
  lang: Language;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onPlanTripHere: (destId: string) => void;
  onFindHotelsHere: (destId: string) => void;
  onBookTicketsHere: (destId: string) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  lang,
  onClose,
  isSaved,
  onToggleSave,
  onPlanTripHere,
  onFindHotelsHere,
  onBookTicketsHere,
}) => {
  if (!destination) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [markerFilter, setMarkerFilter] = useState<
    'All' | 'Attraction' | 'Hotel' | 'Restaurant' | 'Nearby Place'
  >('All');
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerItem | null>(
    destination.mapMarkers[0] || null
  );

  const images =
    destination.galleryImages && destination.galleryImages.length > 0
      ? destination.galleryImages
      : [destination.heroImage];

  const visibleMarkers = destination.mapMarkers.filter(
    (m) => markerFilter === 'All' || m.category === markerFilter
  );

  const getMarkerColor = (cat: MapMarkerItem['category']) => {
    switch (cat) {
      case 'Attraction':
        return 'bg-[#C84B31] text-white border-white';
      case 'Hotel':
        return 'bg-[#0F5257] text-white border-white';
      case 'Restaurant':
        return 'bg-[#B45309] text-white border-white';
      case 'Nearby Place':
        return 'bg-[#1D6B43] text-white border-white';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs overflow-y-auto p-3 sm:p-6 flex items-start justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF9F6] text-[#141413] w-full max-w-5xl rounded-2xl border border-[#141413]/15 shadow-2xl overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Hero Image Gallery Header */}
        <div className="relative h-64 sm:h-80 bg-[#141413]">
          <img
            src={images[activeImageIdx] || destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(destination.id)}
              className="px-3 py-2 rounded-lg bg-black/55 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#C84B31] transition-colors cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 ${isSaved ? 'fill-[#F4A261] text-[#F4A261]' : 'text-white'}`}
              />
              <span>{isSaved ? 'Saved' : 'Save Place'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-lg bg-black/55 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Gallery Thumbnails Switcher */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-12 h-8 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-[#F4A261] scale-105' : 'border-white/50 opacity-75'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Destination Title Info */}
          <div className="absolute bottom-4 left-6 right-40 text-white">
            <p className="text-xs uppercase tracking-widest text-[#F4A261] font-semibold mb-1">
              {destination.state} ({destination.stateTe}) · {destination.categories.join(' · ')}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">
              {destination.name}{' '}
              <span className="text-xl sm:text-2xl font-normal text-white/85">
                ({destination.nameTe})
              </span>
            </h2>
            <div className="flex items-center gap-4 mt-1.5 text-xs text-white/90">
              <span className="flex items-center gap-1 font-mono">
                <Star className="w-3.5 h-3.5 fill-[#F4A261] text-[#F4A261]" />
                {destination.rating} ({destination.reviewCount} reviews)
              </span>
              <span>Best Time: {destination.bestTimeToVisit}</span>
              <span>Recommended: {destination.recommendedDays} Days</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 space-y-8">
          {/* Description + Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#141413]/10">
            <div className="max-w-2xl space-y-2">
              <p className="text-sm sm:text-base text-[#141413] leading-relaxed">
                {lang === 'en' ? destination.description : destination.descriptionTe}
              </p>
              {lang === 'te' && (
                <p className="text-xs text-[#5C5852]">{destination.description}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPlanTripHere(destination.id);
                }}
                className="px-4 py-2.5 rounded-lg bg-[#C84B31] hover:bg-[#B43E24] text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Generate Itinerary
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onFindHotelsHere(destination.id);
                }}
                className="px-4 py-2.5 rounded-lg bg-[#0F5257] hover:bg-[#0A3A3E] text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Find Hotels
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookTicketsHere(destination.id);
                }}
                className="px-4 py-2.5 rounded-lg bg-[#F3F1EC] hover:bg-[#E7E3DA] text-[#141413] text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Book Tickets & Guide
              </button>
            </div>
          </div>

          {/* Key Cost & Weather Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#141413]/10">
              <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block">
                Entry Ticket Avg
              </span>
              <span className="font-mono text-lg font-semibold text-[#141413]">
                {formatINR(destination.costs.avgEntryTicket)}
              </span>
              <span className="text-[11px] text-[#5C5852] block">per attraction</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#141413]/10">
              <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block">
                Local Transport
              </span>
              <span className="font-mono text-lg font-semibold text-[#141413]">
                {formatINR(destination.costs.localTransportPerDay)}
              </span>
              <span className="text-[11px] text-[#5C5852] block">approx / day</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#141413]/10">
              <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block">
                Food Estimate
              </span>
              <span className="font-mono text-lg font-semibold text-[#141413]">
                {formatINR(destination.costs.foodPerDay)}
              </span>
              <span className="text-[11px] text-[#5C5852] block">per person / day</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#141413]/10">
              <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block">
                Hotel Estimate
              </span>
              <span className="font-mono text-lg font-semibold text-[#0F5257]">
                {formatINR(destination.costs.hotelPerNight)}
              </span>
              <span className="text-[11px] text-[#5C5852] block">standard / night</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#141413]/10">
              <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block">
                Recommended Stay
              </span>
              <span className="font-mono text-lg font-semibold text-[#141413]">
                {destination.recommendedDays} Days
              </span>
              <span className="text-[11px] text-[#5C5852] block">
                Best: {destination.bestTimeToVisit}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#141413]/10">
              <span className="text-[11px] uppercase tracking-wider text-[#5C5852] flex items-center gap-1">
                <CloudSun className="w-3.5 h-3.5 text-[#C84B31]" /> Weather
              </span>
              <span className="font-mono text-sm font-semibold text-[#141413] block mt-0.5">
                {destination.weather.tempRange}
              </span>
              <span className="text-[11px] text-[#5C5852] block">
                {destination.weather.condition} ({destination.weather.humidity})
              </span>
            </div>
          </div>

          {/* Famous Attractions Table / Cards with Opening Times & Ticket Prices */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-3 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#C84B31]" />
              <span>Famous Attractions, Timings & Entry Ticket Prices</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destination.famousAttractions.map((att) => (
                <div
                  key={att.id}
                  className="bg-white p-4 rounded-xl border border-[#141413]/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-base text-[#141413]">
                        {att.name}
                        {att.nameTe && (
                          <span className="text-xs font-normal text-[#5C5852] ml-1.5">
                            ({att.nameTe})
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0F5257] shrink-0">
                        {att.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C5852] mt-1">{att.description}</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#141413]/8 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[#5C5852] block flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Timings
                      </span>
                      <span className="font-medium text-[#141413]">{att.openingHours}</span>
                    </div>
                    <div>
                      <span className="text-[#5C5852] block">Adult / Child</span>
                      <span className="font-mono font-semibold text-[#141413]">
                        {att.adultTicketPrice === 0
                          ? 'Free'
                          : `${formatINR(att.adultTicketPrice)} / ${formatINR(att.childTicketPrice)}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#5C5852] block">Duration</span>
                      <span className="font-medium text-[#141413]">{att.timeRequired}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Things To Do & Nearby Tourist Places */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-[#141413]/10">
              <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#C84B31]" />
                <span>Top Things to Do in {destination.name}</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-[#141413]">
                {destination.thingsToDo.map((activity, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#F3F1EC] text-[#C84B31] font-mono text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#141413]/10">
              <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#0F5257]" />
                <span>Nearby Tourist Places & Excursions</span>
              </h3>
              <div className="space-y-3">
                {destination.nearbyPlaces.map((np, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/8"
                  >
                    <div>
                      <p className="font-semibold text-sm text-[#141413]">{np.name}</p>
                      <p className="text-xs text-[#5C5852]">{np.highlight}</p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#0F5257] bg-white px-2.5 py-1 rounded border border-[#141413]/10 shrink-0">
                      {np.distanceKm} km
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-[#141413]/8 text-xs text-[#5C5852]">
                <strong>Seasonal Note:</strong> {destination.weather.seasonNote}
              </div>
            </div>
          </div>

          {/* INTERACTIVE MAP SECTION */}
          <div className="bg-white p-5 rounded-xl border border-[#141413]/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#C84B31]" />
                  <span>Interactive Destination Map — {destination.mapCenterLabel}</span>
                </h3>
                <p className="text-xs text-[#5C5852]">
                  GPS Coordinates: {destination.latLng.lat.toFixed(4)}° N,{' '}
                  {destination.latLng.lng.toFixed(4)}° E · Click any pin to inspect details.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(['All', 'Attraction', 'Hotel', 'Restaurant', 'Nearby Place'] as const).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMarkerFilter(cat)}
                      className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                        markerFilter === cat
                          ? 'bg-[#141413] text-white'
                          : 'bg-[#F3F1EC] text-[#5C5852] hover:text-[#141413]'
                      }`}
                    >
                      {cat === 'All' ? 'All Pins' : `${cat}s`}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Interactive SVG/Canvas Map Viewport */}
              <div className="lg:col-span-2 relative h-72 sm:h-80 rounded-xl bg-[#E8ECE7] border border-[#141413]/15 overflow-hidden">
                {/* Stylized Topographic Grid & Roads */}
                <svg
                  viewBox="0 0 800 400"
                  className="w-full h-full object-cover opacity-75"
                  preserveAspectRatio="none"
                >
                  <rect width="800" height="400" fill="#E6EBE4" />
                  <path
                    d="M0,220 Q240,180 420,250 T800,190 L800,400 L0,400 Z"
                    fill="#D8E2D5"
                  />
                  {/* River / Waterway curve */}
                  <path
                    d="M0,310 Q280,260 510,160 T800,90"
                    stroke="#A3C9D9"
                    strokeWidth="26"
                    fill="none"
                  />
                  {/* Arterial Highways */}
                  <path
                    d="M80,0 L420,200 L740,390"
                    stroke="#F4A261"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                    fill="none"
                  />
                  <path
                    d="M0,130 L420,200 L800,140"
                    stroke="#FFFFFF"
                    strokeWidth="5"
                    fill="none"
                  />
                  <circle cx="400" cy="200" r="95" stroke="#0F5257" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                </svg>

                {/* Destination Center Hub Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#141413]/10 text-xs font-medium shadow-xs">
                  {destination.name} Center ({destination.latLng.lat.toFixed(2)}°N,{' '}
                  {destination.latLng.lng.toFixed(2)}°E)
                </div>

                {/* Interactive Markers */}
                {visibleMarkers.map((marker) => {
                  const isSelected = selectedMarker?.id === marker.id;
                  return (
                    <button
                      key={marker.id}
                      type="button"
                      onClick={() => setSelectedMarker(marker)}
                      style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full border-2 shadow-md text-xs font-semibold flex items-center gap-1 transition-transform cursor-pointer ${getMarkerColor(
                        marker.category
                      )} ${isSelected ? 'scale-115 ring-4 ring-[#C84B31]/30 z-20' : 'hover:scale-105 z-10'}`}
                    >
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[120px]">{marker.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Pin Inspector Sidebar */}
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#141413]/10 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5C5852]">
                    Map Pin Inspector
                  </span>
                  {selectedMarker ? (
                    <div className="mt-2 p-3.5 bg-white rounded-xl border border-[#141413]/10">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C84B31]">
                        {selectedMarker.category}
                      </span>
                      <h4 className="font-semibold text-base text-[#141413] mt-0.5">
                        {selectedMarker.name}
                      </h4>
                      <p className="text-xs text-[#5C5852] mt-1">{selectedMarker.detail}</p>
                      <p className="font-mono text-xs font-semibold text-[#0F5257] mt-2">
                        {selectedMarker.priceOrInfo}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#5C5852] mt-2">
                      Select a marker on the map to inspect details.
                    </p>
                  )}

                  <div className="mt-4 space-y-1.5 max-h-40 overflow-y-auto">
                    {destination.mapMarkers.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMarker(m)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                          selectedMarker?.id === m.id
                            ? 'bg-[#141413] text-white font-semibold'
                            : 'bg-white hover:bg-[#F3F1EC] text-[#141413]'
                        }`}
                      >
                        <span className="truncate">{m.name}</span>
                        <span className="font-mono opacity-80 ml-2 shrink-0">
                          {m.priceOrInfo}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-[#5C5852] mt-3 pt-2 border-t border-[#141413]/10">
                  Interactive map preview with curated tourist attractions, hotels, restaurants, and nearby excursions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

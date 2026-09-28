import React, { useMemo, useState } from 'react';
import {
  Bus,
  Car,
  Check,
  Coffee,
  Heart,
  Info,
  MapPin,
  Plane,
  Star,
  Train,
  Wifi,
  X,
} from 'lucide-react';
import {
  Destination,
  Hotel,
  Language,
  TransportOption,
} from '../types/travel';
import { UI_TEXT, formatINR } from '../utils/scenicArt';

interface HotelsAndTransportSectionProps {
  lang: Language;
  destinations: Destination[];
  hotels: Hotel[];
  transports: TransportOption[];
  activeDestinationId: string;
  onChangeDestinationId: (id: string) => void;
  selectedHotel: Hotel | null;
  onSelectHotel: (hotel: Hotel) => void;
  savedHotelIds: string[];
  onToggleSaveHotel: (id: string) => void;
  selectedTransport: TransportOption | null;
  onSelectTransport: (transport: TransportOption) => void;
  onProceedToTicketsAndGuides: () => void;
}

const HOTEL_TYPES = [
  'All',
  'Heritage',
  'Luxury Resort',
  'Standard Hotel',
  'Budget Stay',
  'Boutique Homestay',
] as const;

const AMENITY_FILTERS = ['Free WiFi', 'Swimming Pool', 'Breakfast Included', 'Airport Shuttle'];

const TRANSPORT_TABS: TransportOption['mode'][] = [
  'Flights',
  'Trains',
  'Buses',
  'Rental Cars',
  'Local Taxis',
];

export const HotelsAndTransportSection: React.FC<HotelsAndTransportSectionProps> = ({
  lang,
  destinations,
  hotels,
  transports,
  activeDestinationId,
  onChangeDestinationId,
  selectedHotel,
  onSelectHotel,
  savedHotelIds,
  onToggleSaveHotel,
  selectedTransport,
  onSelectTransport,
  onProceedToTicketsAndGuides,
}) => {
  const t = UI_TEXT[lang];

  // Hotel Filter State
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [hotelTypeFilter, setHotelTypeFilter] = useState<string>('All');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [inspectHotel, setInspectHotel] = useState<Hotel | null>(null);
  const [bookingFeedback, setBookingFeedback] = useState<string>('');

  // Transport Filter State
  const [activeTransportTab, setActiveTransportTab] =
    useState<TransportOption['mode']>('Flights');

  const toggleAmenity = (am: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(am) ? prev.filter((x) => x !== am) : [...prev, am]
    );
  };

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      const matchCity = cityFilter === 'all' || h.destinationId === cityFilter;
      const matchPrice = h.estimatedPricePerNight <= maxPrice;
      const matchRating = h.rating >= minRating;
      const matchType = hotelTypeFilter === 'All' || h.hotelType === hotelTypeFilter;
      const matchAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((am) => h.amenities.includes(am));
      return matchCity && matchPrice && matchRating && matchType && matchAmenities;
    });
  }, [hotels, cityFilter, maxPrice, minRating, hotelTypeFilter, selectedAmenities]);

  const filteredTransports = useMemo(() => {
    return transports.filter((tr) => tr.mode === activeTransportTab);
  }, [transports, activeTransportTab]);

  const handleBookHotel = (hotel: Hotel) => {
    onSelectHotel(hotel);
    if (hotel.destinationId) {
      onChangeDestinationId(hotel.destinationId);
    }
    setBookingFeedback(
      `Demo Selection Added: "${hotel.name}" (${formatINR(
        hotel.estimatedPricePerNight
      )}/night estimated price) has been added to your Trip Cost Calculator & Booking Summary.`
    );
  };

  const handleBookTransport = (tr: TransportOption) => {
    onSelectTransport(tr);
    setBookingFeedback(
      `Demo Transit Added: "${tr.operatorName} (${tr.fromCity} → ${tr.toCity})" at ${formatINR(
        tr.approximateFare
      )} approximate fare added to your Trip Summary.`
    );
  };

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 space-y-14">
      {/* Transparent Demo Mode Notice Banner */}
      <div className="bg-[#0F5257]/8 border border-[#0F5257]/25 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <Info className="w-5 h-5 text-[#0F5257] shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm text-[#141413]">
            <strong>Transparent Pricing Notice:</strong> {t.estimatedPriceNotice}. Selecting a hotel or transport option adds it directly to your live Trip Cost Calculator & Booking Summary.
          </p>
        </div>
        <button
          type="button"
          onClick={onProceedToTicketsAndGuides}
          className="px-4 py-2 rounded-lg bg-[#0F5257] hover:bg-[#0A3A3E] text-white text-xs font-semibold shrink-0 cursor-pointer"
        >
          Next: Tickets & Local Guides →
        </button>
      </div>

      {bookingFeedback && (
        <div className="bg-[#1D6B43]/10 border border-[#1D6B43]/30 text-[#1D6B43] px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between">
          <span>{bookingFeedback}</span>
          <button
            type="button"
            onClick={() => setBookingFeedback('')}
            className="text-xs underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* PART 1: HOTEL SEARCH & FILTERS */}
      <div>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C84B31] mb-1">
            ESTIMATED TARIFFS IN INDIAN RUPEES (₹)
          </p>
          <h2 className="font-display text-3xl font-semibold text-[#141413]">
            {t.hotelsHeading}
          </h2>
        </div>

        {/* 4-Filter Control Bar: Destination, Price Range, Rating, Hotel Type, Amenities */}
        <div className="bg-white p-5 rounded-2xl border border-[#141413]/12 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                Destination City
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-sm font-medium"
              >
                <option value="all">All Indian Cities ({hotels.length} Stays)</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                Max Price Range: <span className="font-mono text-[#0F5257]">{formatINR(maxPrice)}/night</span>
              </label>
              <input
                type="range"
                min={1800}
                max={6000}
                step={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#C84B31] mt-2 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                Minimum Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-sm font-medium"
              >
                <option value={3.5}>3.5 ★ & above</option>
                <option value={4.0}>4.0 ★ & above</option>
                <option value={4.5}>4.5 ★ & above</option>
                <option value={4.8}>4.8 ★ Top Rated</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                Hotel Type
              </label>
              <select
                value={hotelTypeFilter}
                onChange={(e) => setHotelTypeFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-sm font-medium"
              >
                {HOTEL_TYPES.map((ht) => (
                  <option key={ht} value={ht}>
                    {ht === 'All' ? 'All Property Types' : ht}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amenities Filter Row */}
          <div className="pt-3 border-t border-[#141413]/8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5C5852] mr-1">
                Amenities:
              </span>
              {AMENITY_FILTERS.map((am) => {
                const active = selectedAmenities.includes(am);
                return (
                  <button
                    key={am}
                    type="button"
                    onClick={() => toggleAmenity(am)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0F5257] text-white border-[#0F5257]'
                        : 'bg-[#FAF9F6] text-[#141413] border-[#141413]/15 hover:bg-[#F3F1EC]'
                    }`}
                  >
                    {am}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setCityFilter('all');
                setMaxPrice(6000);
                setMinRating(3.5);
                setHotelTypeFilter('All');
                setSelectedAmenities([]);
              }}
              className="text-xs font-semibold text-[#C84B31] hover:underline"
            >
              Reset Hotel Filters
            </button>
          </div>
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#141413]/10 p-10 text-center">
            <p className="text-sm text-[#5C5852]">
              No hotels match the selected price or amenity filters. Try increasing the max price slider.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => {
              const isSelected = selectedHotel?.id === hotel.id;
              const isSaved = savedHotelIds.includes(hotel.id);

              return (
                <article
                  key={hotel.id}
                  className={`bg-white rounded-xl border transition-all overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0F5257] ring-2 ring-[#0F5257]/25 shadow-md'
                      : 'border-[#141413]/12 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-[#141413]">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                      <button
                        type="button"
                        onClick={() => onToggleSaveHotel(hotel.id)}
                        aria-label={`Save ${hotel.name}`}
                        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-[#C84B31] cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isSaved ? 'fill-[#F4A261] text-[#F4A261]' : 'text-white'
                          }`}
                        />
                      </button>

                      <span className="absolute top-3 left-3 bg-black/65 text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                        {hotel.hotelType}
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <p className="text-[11px] text-white/80 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#F4A261]" />
                            {hotel.location}
                          </p>
                          <h3 className="font-display text-lg font-semibold leading-snug">
                            {hotel.name}
                          </h3>
                        </div>
                        <span className="bg-black/60 px-2 py-0.5 rounded text-xs font-mono flex items-center gap-1 shrink-0">
                          <Star className="w-3 h-3 fill-[#F4A261] text-[#F4A261]" />
                          {hotel.rating}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block">
                            Room Type
                          </span>
                          <span className="text-xs font-semibold text-[#141413]">
                            {hotel.roomType}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xl font-bold text-[#0F5257]">
                            {formatINR(hotel.estimatedPricePerNight)}
                          </span>
                          <span className="text-[11px] text-[#5C5852] block">
                            Estimated price / night
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-[#5C5852] space-y-1 pt-2 border-t border-[#141413]/8">
                        <p>
                          <strong className="text-[#141413]">Distance:</strong>{' '}
                          {hotel.nearestAttraction}
                        </p>
                        <p className="flex items-center gap-1.5 text-[#1D6B43] font-medium">
                          <Coffee className="w-3.5 h-3.5" />
                          {hotel.breakfastIncluded
                            ? 'Complimentary Indian & Continental Breakfast'
                            : 'Room Only (Breakfast available at ₹350)'}
                        </p>
                        <p className="text-[11px] text-[#5C5852]">
                          {hotel.amenities.join(' · ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setInspectHotel(hotel)}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-[#F3F1EC] hover:bg-[#E7E3DA] text-[#141413] text-xs font-semibold cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBookHotel(hotel)}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#1D6B43] text-white'
                          : 'bg-[#C84B31] hover:bg-[#B43E24] text-white'
                      }`}
                    >
                      {isSelected ? '✓ Selected for Trip' : 'Book Now (Demo)'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* PART 2: TRAVEL TRANSPORT (Flights, Trains, Buses, Rental Cars, Local Taxis) */}
      <div className="pt-6 border-t border-[#141413]/12">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0F5257] mb-1">
              INTERCITY & LOCAL TRANSIT OPTIONS
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#141413]">
              {t.transportHeading}
            </h2>
          </div>

          {/* 5 Transport Mode Tabs */}
          <div className="flex flex-wrap gap-2">
            {TRANSPORT_TABS.map((tab) => {
              const active = activeTransportTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTransportTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#141413] text-white'
                      : 'bg-white border border-[#141413]/15 text-[#141413] hover:bg-[#F3F1EC]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transport Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTransports.map((tr) => {
            const isSelected = selectedTransport?.id === tr.id;
            return (
              <div
                key={tr.id}
                className={`bg-white p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-[#0F5257] ring-2 ring-[#0F5257]/25'
                    : 'border-[#141413]/12'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#F3F1EC] text-[#0F5257]">
                      {tr.mode} · {tr.serviceCode}
                    </span>
                    <h4 className="font-semibold text-base text-[#141413]">
                      {tr.operatorName}
                    </h4>
                  </div>

                  <p className="text-sm font-semibold text-[#141413]">
                    {tr.fromCity} → {tr.toCity}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5C5852]">
                    <span>
                      <strong>Dep:</strong> {tr.departureTime}
                    </span>
                    <span>
                      <strong>Arr:</strong> {tr.arrivalTime}
                    </span>
                    <span>
                      <strong>Duration:</strong> {tr.duration}
                    </span>
                  </div>

                  <p className="text-xs text-[#5C5852]">
                    {tr.classOrVehicle} · {tr.features.join(' · ')}
                  </p>
                </div>

                <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#141413]/8">
                  <div>
                    <span className="font-mono text-xl font-bold text-[#141413] block">
                      {formatINR(tr.approximateFare)}
                    </span>
                    <span className="text-[11px] text-[#5C5852] block">
                      Approximate fare
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookTransport(tr)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D6B43] text-white'
                        : 'bg-[#0F5257] hover:bg-[#0A3A3E] text-white'
                    }`}
                  >
                    {isSelected ? '✓ Selected Transit' : 'Book (Demo)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hotel Details Modal */}
      {inspectHotel && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs p-4 flex items-center justify-center"
          onClick={() => setInspectHotel(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full overflow-hidden border border-[#141413]/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 bg-[#141413]">
              <img
                src={inspectHotel.image}
                alt={inspectHotel.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setInspectHotel(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/60 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C84B31]">
                    {inspectHotel.hotelType} · {inspectHotel.destinationName}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-[#141413]">
                    {inspectHotel.name}
                  </h3>
                  <p className="text-xs text-[#5C5852]">{inspectHotel.location}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xl font-bold text-[#0F5257]">
                    {formatINR(inspectHotel.estimatedPricePerNight)}
                  </span>
                  <span className="text-[11px] text-[#5C5852] block">
                    Estimated price / night
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#141413] leading-relaxed">
                {inspectHotel.description}
              </p>

              <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#141413]/10 text-xs space-y-1.5">
                <p>
                  <strong>Room Category:</strong> {inspectHotel.roomType}
                </p>
                <p>
                  <strong>Nearest Landmark:</strong> {inspectHotel.nearestAttraction}
                </p>
                <p>
                  <strong>Breakfast:</strong>{' '}
                  {inspectHotel.breakfastIncluded ? 'Included in estimated tariff' : 'Optional'}
                </p>
                <p>
                  <strong>Amenities:</strong> {inspectHotel.amenities.join(', ')}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectHotel(null)}
                  className="px-4 py-2 rounded-lg bg-[#F3F1EC] text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleBookHotel(inspectHotel);
                    setInspectHotel(null);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#C84B31] text-white text-xs font-semibold"
                >
                  Select Hotel for Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

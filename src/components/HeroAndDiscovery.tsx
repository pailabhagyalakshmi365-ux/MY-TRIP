import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Calendar,
  Compass,
  Heart,
  MapPin,
  Search,
  Star,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  BudgetTier,
  Destination,
  DestinationCategory,
  Hotel,
  Language,
  LocalGuide,
  TicketBookingOption,
} from '../types/travel';
import { GENERATED_ASSETS, UI_TEXT, formatINR } from '../utils/scenicArt';

const ALL_CATEGORIES: DestinationCategory[] = [
  'Historical Places',
  'Temples',
  'Beaches',
  'Hill Stations',
  'Wildlife',
  'Adventure',
  'Nature',
  'Spiritual Places',
];

const CATEGORY_TE: Record<DestinationCategory, string> = {
  'Historical Places': 'చారిత్రక ప్రదేశాలు',
  Temples: 'దేవాలయాలు',
  Beaches: 'బీచ్‌లు',
  'Hill Stations': 'హిల్ స్టేషన్లు',
  Wildlife: 'వన్యప్రాణులు',
  Adventure: 'సాహస యాత్రలు',
  Nature: 'ప్రకృతి',
  'Spiritual Places': 'ఆధ్యాత్మిక ప్రదేశాలు',
};

interface HeroAndDiscoveryProps {
  lang: Language;
  destinations: Destination[];
  hotels: Hotel[];
  guides: LocalGuide[];
  tickets: TicketBookingOption[];
  selectedDestinationId: string;
  onSelectDestinationForDetails: (dest: Destination) => void;
  onStartPlanForDestination: (destId: string, date?: string, travelers?: number, budget?: BudgetTier) => void;
  savedDestinationIds: string[];
  onToggleSaveDestination: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const HeroAndDiscovery: React.FC<HeroAndDiscoveryProps> = ({
  lang,
  destinations,
  hotels,
  guides,
  tickets,
  selectedDestinationId,
  onSelectDestinationForDetails,
  onStartPlanForDestination,
  savedDestinationIds,
  onToggleSaveDestination,
  onNavigateTab,
}) => {
  const t = UI_TEXT[lang];

  // Hero Search Bar State
  const [heroDestId, setHeroDestId] = useState<string>(selectedDestinationId || 'hyderabad');
  const [heroDate, setHeroDate] = useState<string>('2026-10-15');
  const [heroTravelers, setHeroTravelers] = useState<number>(2);
  const [heroBudget, setHeroBudget] = useState<BudgetTier>('Standard');

  // Category & Global Search State
  const [activeCategory, setActiveCategory] = useState<DestinationCategory | 'All'>('All');
  const [globalQuery, setGlobalQuery] = useState<string>('');

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const matchesCategory = activeCategory === 'All' || d.categories.includes(activeCategory);
      if (!globalQuery.trim()) return matchesCategory;
      const q = globalQuery.toLowerCase();
      const inName = d.name.toLowerCase().includes(q) || d.nameTe.includes(q);
      const inState = d.state.toLowerCase().includes(q);
      const inTagline = d.tagline.toLowerCase().includes(q);
      const inAttractions = d.famousAttractions.some((a) => a.name.toLowerCase().includes(q));
      const inActivities = d.thingsToDo.some((act) => act.toLowerCase().includes(q));
      return matchesCategory && (inName || inState || inTagline || inAttractions || inActivities);
    });
  }, [destinations, activeCategory, globalQuery]);

  // Global cross-entity search results when user types in Global Search
  const globalMatches = useMemo(() => {
    const q = globalQuery.trim().toLowerCase();
    if (q.length < 2) return null;

    const matchedCities = destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.nameTe.includes(q)
    );
    const matchedAttractions = tickets.filter(
      (tk) =>
        tk.attractionName.toLowerCase().includes(q) ||
        tk.destinationName.toLowerCase().includes(q) ||
        tk.category.toLowerCase().includes(q)
    );
    const matchedHotels = hotels.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.hotelType.toLowerCase().includes(q)
    );
    const matchedGuides = guides.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.city.toLowerCase().includes(q) ||
        g.specialization.some((s) => s.toLowerCase().includes(q)) ||
        g.languages.some((l) => l.toLowerCase().includes(q))
    );

    return {
      matchedCities,
      matchedAttractions,
      matchedHotels,
      matchedGuides,
      total:
        matchedCities.length +
        matchedAttractions.length +
        matchedHotels.length +
        matchedGuides.length,
    };
  }, [globalQuery, destinations, tickets, hotels, guides]);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartPlanForDestination(heroDestId, heroDate, heroTravelers, heroBudget);
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative min-h-[540px] lg:min-h-[600px] flex items-center bg-[#0F1E26] text-[#FAF9F6] overflow-hidden">
        <img
          src={GENERATED_ASSETS.heroIndia}
          alt="Explore India"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(15, 30, 38, 0.55) 0%, rgba(15, 30, 38, 0.35) 45%, rgba(15, 30, 38, 0.88) 100%)',
          }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-14 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm uppercase tracking-[0.14em] text-[#F4A261] font-semibold mb-3">
              {lang === 'en'
                ? 'ALL-IN-ONE INDIA TRAVEL & ITINERARY PLATFORM'
                : 'భారతదేశ పర్యాటక & ప్రయాణ ప్రణాళిక వేదిక'}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-white mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mb-8">
              {t.heroSubtitle}
            </p>
          </div>

          {/* 5-Field Hero Search Dock */}
          <form
            onSubmit={handleHeroSearchSubmit}
            className="bg-[#FAF9F6] text-[#141413] p-3 sm:p-4 rounded-xl shadow-2xl border border-[#141413]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
          >
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#C84B31]" />
                {t.searchDestination}
              </label>
              <select
                value={heroDestId}
                onChange={(e) => setHeroDestId(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-[#F3F1EC] border border-[#141413]/15 text-sm font-medium focus:outline-none focus:border-[#C84B31]"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {lang === 'en' ? `${d.name}, ${d.state}` : `${d.nameTe} (${d.name})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#C84B31]" />
                {t.searchDate}
              </label>
              <input
                type="date"
                value={heroDate}
                onChange={(e) => setHeroDate(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-[#F3F1EC] border border-[#141413]/15 text-sm font-medium focus:outline-none focus:border-[#C84B31]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                <Users className="w-3.5 h-3.5 inline mr-1 text-[#C84B31]" />
                {t.searchTravelers}
              </label>
              <select
                value={heroTravelers}
                onChange={(e) => setHeroTravelers(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-lg bg-[#F3F1EC] border border-[#141413]/15 text-sm font-medium focus:outline-none focus:border-[#C84B31]"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Traveler' : 'Travelers'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                <Wallet className="w-3.5 h-3.5 inline mr-1 text-[#C84B31]" />
                {t.searchBudget}
              </label>
              <select
                value={heroBudget}
                onChange={(e) => setHeroBudget(e.target.value as BudgetTier)}
                className="w-full h-11 px-3 rounded-lg bg-[#F3F1EC] border border-[#141413]/15 text-sm font-medium focus:outline-none focus:border-[#C84B31]"
              >
                <option value="Budget">Budget (₹1,500–₹3,000/day)</option>
                <option value="Standard">Standard (₹3,000–₹6,000/day)</option>
                <option value="Premium">Premium (₹6,000–₹12,000/day)</option>
                <option value="Luxury">Luxury (₹12,000+/day)</option>
              </select>
            </div>

            <button
              type="submit"
              className="h-11 px-5 rounded-lg bg-[#C84B31] hover:bg-[#B43E24] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{t.searchButton}</span>
            </button>
          </form>
        </div>
      </section>

      {/* GLOBAL SEARCH & CATEGORY BAR */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-10 pb-6">
        {/* Global Multi-Entity Search Input */}
        <div className="relative mb-8">
          <div className="flex items-center bg-white border border-[#141413]/15 rounded-xl px-4 h-13 shadow-xs focus-within:border-[#C84B31]">
            <Search className="w-5 h-5 text-[#5C5852] mr-3 shrink-0" />
            <input
              type="text"
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              placeholder={t.globalSearchPlaceholder}
              className="w-full text-sm sm:text-base text-[#141413] placeholder-[#5C5852]/70 focus:outline-none bg-transparent"
            />
            {globalQuery && (
              <button
                type="button"
                onClick={() => setGlobalQuery('')}
                className="p-1.5 text-[#5C5852] hover:text-[#141413]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Global Search Results Drawer */}
          {globalMatches && (
            <div className="mt-2 bg-white border border-[#141413]/15 rounded-xl shadow-xl p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-2">
                  Cities & Destinations ({globalMatches.matchedCities.length})
                </h4>
                {globalMatches.matchedCities.length === 0 ? (
                  <p className="text-xs text-[#5C5852]">No matching cities</p>
                ) : (
                  <ul className="space-y-1.5">
                    {globalMatches.matchedCities.slice(0, 5).map((d) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          onClick={() => onSelectDestinationForDetails(d)}
                          className="text-left text-sm font-medium text-[#141413] hover:text-[#C84B31] flex items-center justify-between w-full"
                        >
                          <span>
                            {d.name} <span className="text-xs text-[#5C5852]">({d.state})</span>
                          </span>
                          <span className="font-mono text-xs text-[#0F5257]">
                            {formatINR(d.costs.hotelPerNight)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-2">
                  Attractions & Activities ({globalMatches.matchedAttractions.length})
                </h4>
                {globalMatches.matchedAttractions.length === 0 ? (
                  <p className="text-xs text-[#5C5852]">No matching attractions</p>
                ) : (
                  <ul className="space-y-1.5">
                    {globalMatches.matchedAttractions.slice(0, 4).map((tk) => (
                      <li key={tk.id}>
                        <button
                          type="button"
                          onClick={() => onNavigateTab('tickets-guides')}
                          className="text-left text-xs font-medium text-[#141413] hover:text-[#C84B31] block w-full"
                        >
                          {tk.attractionName} ·{' '}
                          <span className="font-mono text-[#0F5257]">{formatINR(tk.adultPrice)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-2">
                  Hotels ({globalMatches.matchedHotels.length})
                </h4>
                {globalMatches.matchedHotels.length === 0 ? (
                  <p className="text-xs text-[#5C5852]">No matching hotels</p>
                ) : (
                  <ul className="space-y-1.5">
                    {globalMatches.matchedHotels.slice(0, 4).map((h) => (
                      <li key={h.id}>
                        <button
                          type="button"
                          onClick={() => onNavigateTab('stay-transit')}
                          className="text-left text-xs font-medium text-[#141413] hover:text-[#C84B31] block w-full"
                        >
                          {h.name} ({h.destinationName}) ·{' '}
                          <span className="font-mono text-[#0F5257]">
                            {formatINR(h.estimatedPricePerNight)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-2">
                  Local Guides ({globalMatches.matchedGuides.length})
                </h4>
                {globalMatches.matchedGuides.length === 0 ? (
                  <p className="text-xs text-[#5C5852]">No matching guides</p>
                ) : (
                  <ul className="space-y-1.5">
                    {globalMatches.matchedGuides.slice(0, 4).map((g) => (
                      <li key={g.id}>
                        <button
                          type="button"
                          onClick={() => onNavigateTab('tickets-guides')}
                          className="text-left text-xs font-medium text-[#141413] hover:text-[#C84B31] block w-full"
                        >
                          {g.name} ({g.city}) ·{' '}
                          <span className="font-mono text-[#0F5257]">
                            {formatINR(g.perHourPrice)}/hr
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 8 Categories Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5C5852] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#C84B31]" />
              <span>{t.categoriesLabel}</span>
            </h2>
            <span className="text-xs text-[#5C5852]">
              Showing {filteredDestinations.length} of {destinations.length} Indian destinations
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#141413]/10">
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === 'All'
                  ? 'bg-[#141413] text-[#FAF9F6]'
                  : 'bg-[#F3F1EC] text-[#141413]/80 hover:bg-[#E7E3DA]'
              }`}
            >
              {lang === 'en' ? 'All Destinations (22)' : 'అన్ని ప్రదేశాలు (22)'}
            </button>
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#C84B31] text-white'
                      : 'bg-[#F3F1EC] text-[#141413]/80 hover:bg-[#E7E3DA]'
                  }`}
                >
                  {lang === 'en' ? cat : `${CATEGORY_TE[cat]} (${cat})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* POPULAR DESTINATIONS GRID */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#141413]">
              {t.popularDestinations}
            </h2>
            <p className="text-sm text-[#5C5852] mt-1">
              Click any destination card to inspect opening hours, entry tickets, local transport & food estimates, weather, and interactive map.
            </p>
          </div>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#141413]/10 p-12 text-center">
            <p className="text-base font-medium text-[#141413] mb-2">
              No destinations matched your current filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setGlobalQuery('');
              }}
              className="px-4 py-2 bg-[#C84B31] text-white text-xs font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => {
              const isSaved = savedDestinationIds.includes(dest.id);
              const dailyAvgEstimate =
                dest.costs.hotelPerNight +
                dest.costs.foodPerDay +
                dest.costs.localTransportPerDay +
                dest.costs.avgEntryTicket;

              return (
                <article
                  key={dest.id}
                  className="group bg-white rounded-xl border border-[#141413]/10 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* 16:10 Image Container */}
                  <div className="relative aspect-[16/10] bg-[#141413] overflow-hidden">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                    {/* Top Right Save Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveDestination(dest.id);
                      }}
                      aria-label={`Save ${dest.name}`}
                      className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-black/45 backdrop-blur-xs text-white flex items-center justify-center hover:bg-[#C84B31] transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${isSaved ? 'fill-[#F4A261] text-[#F4A261]' : 'text-white'}`}
                      />
                    </button>

                    {/* Bottom overlay title + rating */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2 text-white">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-white/80 font-medium">
                          {lang === 'en' ? dest.state : `${dest.stateTe} · ${dest.state}`}
                        </p>
                        <h3 className="font-display text-xl font-semibold leading-tight">
                          {lang === 'en' ? dest.name : `${dest.nameTe} (${dest.name})`}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 bg-black/55 px-2.5 py-1 rounded-md text-xs font-mono shrink-0">
                        <Star className="w-3.5 h-3.5 fill-[#F4A261] text-[#F4A261]" />
                        <span>{dest.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body (Strictly 4 clean data points + Action Row) */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-medium text-[#0F5257] mb-1.5">
                        {dest.categories.join(' · ')}
                      </p>
                      <p className="text-sm text-[#5C5852] line-clamp-2 mb-4">
                        {lang === 'en' ? dest.tagline : dest.taglineTe}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#141413]/8 text-xs">
                        <div>
                          <span className="text-[#5C5852] block">{t.bestTime}</span>
                          <span className="font-semibold text-[#141413]">
                            {dest.bestTimeToVisit}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#5C5852] block">Est. Daily Cost</span>
                          <span className="font-mono font-semibold text-[#141413]">
                            {formatINR(dailyAvgEstimate)}/day
                          </span>
                        </div>
                        <div>
                          <span className="text-[#5C5852] block">{t.hotelEstimate}</span>
                          <span className="font-mono font-semibold text-[#0F5257]">
                            {formatINR(dest.costs.hotelPerNight)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#5C5852] block">{t.recDays}</span>
                          <span className="font-mono font-semibold text-[#141413]">
                            {dest.recommendedDays} {t.days}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#141413]/8 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onSelectDestinationForDetails(dest)}
                        className="flex-1 py-2.5 px-3 rounded-lg bg-[#F3F1EC] hover:bg-[#E7E3DA] text-[#141413] font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {t.viewDetails}
                      </button>
                      <button
                        type="button"
                        onClick={() => onStartPlanForDestination(dest.id)}
                        className="flex-1 py-2.5 px-3 rounded-lg bg-[#C84B31] hover:bg-[#B43E24] text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {t.planTripHere}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

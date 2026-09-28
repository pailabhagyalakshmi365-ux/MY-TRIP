import React, { useEffect, useState } from 'react';
import {
  BookmarkCheck,
  Calendar,
  CheckCircle2,
  Compass,
  MapPin,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { generateDayByDayItinerary } from '../data/servicesData';
import {
  BudgetTier,
  Destination,
  ItineraryDayPlan,
  Language,
  SavedItinerary,
  TransportMode,
  TravelType,
  TripPlanFormInput,
} from '../types/travel';
import { UI_TEXT, formatINR } from '../utils/scenicArt';

const INTEREST_OPTIONS = [
  'History',
  'Nature',
  'Adventure',
  'Temples',
  'Beaches',
  'Shopping',
  'Wildlife',
];

const STARTING_CITIES = [
  'Hyderabad',
  'Visakhapatnam',
  'Bengaluru',
  'Chennai',
  'Mumbai',
  'Delhi',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Vijayawada',
];

interface TripPlannerSectionProps {
  lang: Language;
  destinations: Destination[];
  activeDestinationId: string;
  initialDate?: string;
  initialAdults?: number;
  initialBudget?: BudgetTier;
  onSyncTripParameters: (params: {
    destinationId: string;
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
    budget: BudgetTier;
  }) => void;
  onSaveItinerary: (itinerary: SavedItinerary) => void;
  onProceedToStayAndTransit: () => void;
}

export const TripPlannerSection: React.FC<TripPlannerSectionProps> = ({
  lang,
  destinations,
  activeDestinationId,
  initialDate,
  initialAdults,
  initialBudget,
  onSyncTripParameters,
  onSaveItinerary,
  onProceedToStayAndTransit,
}) => {
  const t = UI_TEXT[lang];

  const [form, setForm] = useState<TripPlanFormInput>({
    startingCity: 'Hyderabad',
    destinationId: activeDestinationId || 'hyderabad',
    startDate: initialDate || '2026-10-15',
    endDate: '2026-10-18',
    adults: initialAdults || 2,
    children: 0,
    travelType: 'Family',
    budget: initialBudget || 'Standard',
    transportMode: 'Flight',
    hotelPreference: '3-Star / 4-Star Comfort & Heritage Stay',
    foodPreference: 'Authentic Regional Indian & Vegetarian Options',
    interests: ['History', 'Temples', 'Nature'],
  });

  useEffect(() => {
    if (activeDestinationId) {
      const dest = destinations.find((d) => d.id === activeDestinationId);
      const recDays = dest?.recommendedDays || 3;
      const sDate = new Date(initialDate || form.startDate || '2026-10-15');
      const eDate = new Date(sDate);
      eDate.setDate(sDate.getDate() + Math.max(1, recDays - 1));
      const endIso = eDate.toISOString().split('T')[0];

      setForm((prev) => ({
        ...prev,
        destinationId: activeDestinationId,
        startDate: initialDate || prev.startDate,
        endDate: endIso,
        adults: initialAdults ?? prev.adults,
        budget: initialBudget ?? prev.budget,
      }));
    }
  }, [activeDestinationId, initialDate, initialAdults, initialBudget, destinations]);

  const currentDestination =
    destinations.find((d) => d.id === form.destinationId) || destinations[0];

  const [generatedDays, setGeneratedDays] = useState<ItineraryDayPlan[]>(() =>
    generateDayByDayItinerary(form, currentDestination)
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  // Re-generate default itinerary when destination changes
  useEffect(() => {
    const dest = destinations.find((d) => d.id === form.destinationId) || destinations[0];
    setGeneratedDays(generateDayByDayItinerary(form, dest));
  }, [form.destinationId]);

  const toggleInterest = (interest: string) => {
    setForm((prev) => {
      const exists = prev.interests.includes(interest);
      const next = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: next.length > 0 ? next : ['History'] };
    });
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSavedBanner(false);

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setErrorMessage('End date must be on or after the start date.');
      return;
    }
    if (form.adults < 1) {
      setErrorMessage('At least 1 adult traveler is required.');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const days = generateDayByDayItinerary(form, currentDestination);
      setGeneratedDays(days);
      onSyncTripParameters({
        destinationId: form.destinationId,
        startDate: form.startDate,
        endDate: form.endDate,
        adults: form.adults,
        children: form.children,
        budget: form.budget,
      });
      setIsGenerating(false);
    }, 220);
  };

  const totalItineraryCost = generatedDays.reduce((acc, d) => acc + d.estimatedDayCost, 0);

  const handleSaveCurrentItinerary = () => {
    const payload: SavedItinerary = {
      id: `ITIN-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleDateString('en-IN'),
      input: form,
      destinationName: currentDestination.name,
      days: generatedDays,
      totalEstimatedCost: totalItineraryCost,
    };
    onSaveItinerary(payload);
    setSavedBanner(true);
  };

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C84B31] mb-1">
          PERSONALIZED INDIA ROUTE ARCHITECT
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">
          {t.tripPlannerHeading}
        </h2>
        <p className="text-sm sm:text-base text-[#5C5852] mt-1 max-w-3xl">
          Customize your starting city, travel dates, group size, budget tier, transport mode, and interests to generate a complete day-by-day India itinerary with daily rupee cost estimates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: 12-Parameter Trip Planning Form */}
        <form
          onSubmit={handleGenerate}
          className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#141413]/12 shadow-xs space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1.5">
                Starting City
              </label>
              <select
                value={form.startingCity}
                onChange={(e) => setForm({ ...form, startingCity: e.target.value })}
                className="w-full h-11 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-sm font-medium"
              >
                {STARTING_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1.5">
                Destination
              </label>
              <select
                value={form.destinationId}
                onChange={(e) => setForm({ ...form, destinationId: e.target.value })}
                className="w-full h-11 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-sm font-medium"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full h-11 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full h-11 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-sm font-medium"
              />
            </div>
          </div>

          {/* Adults & Children */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1.5">
                Number of Adults
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.adults}
                onChange={(e) => setForm({ ...form, adults: Math.max(1, Number(e.target.value)) })}
                className="w-full h-11 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-sm font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1.5">
                Number of Children
              </label>
              <input
                type="number"
                min={0}
                max={15}
                value={form.children}
                onChange={(e) =>
                  setForm({ ...form, children: Math.max(0, Number(e.target.value)) })
                }
                className="w-full h-11 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-sm font-mono font-semibold"
              />
            </div>
          </div>

          {/* Travel Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1.5">
              Travel Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Solo', 'Couple', 'Family', 'Friends'] as TravelType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, travelType: type })}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    form.travelType === type
                      ? 'bg-[#141413] text-white border-[#141413]'
                      : 'bg-[#FAF9F6] text-[#141413] border-[#141413]/15 hover:bg-[#F3F1EC]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Transport */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1.5">
                Budget Tier
              </label>
              <select
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value as BudgetTier })}
                className="w-full h-11 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-sm font-medium"
              >
                <option value="Budget">Budget</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1.5">
                Preferred Transport
              </label>
              <select
                value={form.transportMode}
                onChange={(e) =>
                  setForm({ ...form, transportMode: e.target.value as TransportMode })
                }
                className="w-full h-11 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-sm font-medium"
              >
                <option value="Flight">Flight</option>
                <option value="Train">Train (Vande Bharat / Express)</option>
                <option value="Bus">AC Sleeper / Volvo Bus</option>
                <option value="Car">Private Chauffeur / Self-Drive Car</option>
              </select>
            </div>
          </div>

          {/* Hotel & Food Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1.5">
                Hotel Preference
              </label>
              <select
                value={form.hotelPreference}
                onChange={(e) => setForm({ ...form, hotelPreference: e.target.value })}
                className="w-full h-11 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-medium"
              >
                <option value="Heritage Haveli / Boutique Stay">
                  Heritage Haveli / Boutique Stay
                </option>
                <option value="3-Star / 4-Star Comfort & Heritage Stay">
                  3-Star / 4-Star Family Comfort
                </option>
                <option value="5-Star Luxury Resort & Spa">5-Star Luxury Resort & Spa</option>
                <option value="Clean Budget Homestay / Guest House">
                  Clean Budget Homestay
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-1.5">
                Food Preference
              </label>
              <select
                value={form.foodPreference}
                onChange={(e) => setForm({ ...form, foodPreference: e.target.value })}
                className="w-full h-11 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-medium"
              >
                <option value="Authentic Regional Indian & Vegetarian Options">
                  Regional Indian (Veg & Non-Veg)
                </option>
                <option value="Pure Vegetarian & Sattvic South/North Indian">
                  Pure Vegetarian / Sattvic
                </option>
                <option value="Local Street Food & Royal Fine Dining">
                  Street Food & Royal Fine Dining
                </option>
                <option value="Jain & Kid-Friendly Mild Meals">
                  Jain & Kid-Friendly Meals
                </option>
              </select>
            </div>
          </div>

          {/* Interests Checkboxes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-2">
              Select Your Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const active = form.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0F5257] text-white border-[#0F5257]'
                        : 'bg-[#FAF9F6] text-[#5C5852] border-[#141413]/15 hover:text-[#141413]'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-[#B91C1C]/10 border border-[#B91C1C]/30 text-xs text-[#B91C1C] font-medium">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full h-12 rounded-xl bg-[#C84B31] hover:bg-[#B43E24] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isGenerating ? 'Building Day-by-Day Plan...' : t.generateItinerary}
            </span>
          </button>
        </form>

        {/* RIGHT COLUMN: Day-by-Day Generated Itinerary Timeline */}
        <div className="lg:col-span-7 space-y-5">
          {/* Summary Header Card */}
          <div className="bg-[#0F1E26] text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#F4A261] font-semibold">
                <span>
                  {form.startingCity} → {currentDestination.name}
                </span>
                <span>·</span>
                <span>{generatedDays.length} Days</span>
                <span>·</span>
                <span>{form.travelType}</span>
              </div>
              <h3 className="font-display text-2xl font-semibold mt-1">
                {currentDestination.name} ({currentDestination.nameTe}) Itinerary
              </h3>
              <p className="text-xs text-white/80 mt-1">
                {form.adults} Adults
                {form.children > 0 ? `, ${form.children} Children` : ''} · {form.budget} Tier ·{' '}
                {form.transportMode}
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-xs text-white/75 block">Estimated Itinerary Total</span>
              <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#F4A261]">
                {formatINR(totalItineraryCost)}
              </span>
              <div className="mt-2 flex items-center gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={handleSaveCurrentItinerary}
                  className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>{savedBanner ? 'Saved to My Trips' : 'Save Itinerary'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSyncTripParameters({
                      destinationId: form.destinationId,
                      startDate: form.startDate,
                      endDate: form.endDate,
                      adults: form.adults,
                      children: form.children,
                      budget: form.budget,
                    });
                    onProceedToStayAndTransit();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#C84B31] hover:bg-[#B43E24] text-white text-xs font-semibold cursor-pointer"
                >
                  Select Hotel & Transit →
                </button>
              </div>
            </div>
          </div>

          {savedBanner && (
            <div className="p-3.5 rounded-xl bg-[#1D6B43]/10 border border-[#1D6B43]/30 text-[#1D6B43] text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Itinerary saved! You can view or reload it anytime in "My Trips → Saved Itineraries".
              </span>
            </div>
          )}

          {/* Day Cards */}
          <div className="space-y-4">
            {generatedDays.map((day) => (
              <div
                key={day.dayNumber}
                className="bg-white rounded-2xl border border-[#141413]/12 p-5 sm:p-6 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#141413]/10">
                  <div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C84B31]">
                      DAY {day.dayNumber} · {day.dateLabel}
                    </span>
                    <h4 className="font-display text-lg sm:text-xl font-semibold text-[#141413]">
                      {day.title}
                    </h4>
                  </div>
                  <div className="bg-[#FAF9F6] px-3.5 py-2 rounded-lg border border-[#141413]/10 shrink-0">
                    <span className="text-[11px] text-[#5C5852] block">Estimated Day Cost</span>
                    <span className="font-mono text-base font-semibold text-[#0F5257]">
                      {formatINR(day.estimatedDayCost)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#141413]/6">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C84B31] block mb-0.5">
                      {day.dayNumber === 1 ? 'Arrival & Morning' : 'Morning Attraction'}
                    </span>
                    <p className="text-[#141413]">{day.arrivalOrMorning}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#141413]/6">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0F5257] block mb-0.5">
                      {day.dayNumber === 1 ? 'Hotel Check-in' : 'Guided Exploration'}
                    </span>
                    <p className="text-[#141413]">{day.hotelOrMidMorning}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#141413]/6">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B45309] block mb-0.5">
                      Lunch
                    </span>
                    <p className="text-[#141413]">{day.lunch}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#141413]/6">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C84B31] block mb-0.5">
                      {day.dayNumber === 1 ? 'Nearby Sightseeing' : 'Afternoon Attraction'}
                    </span>
                    <p className="text-[#141413]">{day.afternoonAttraction}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#141413]/6">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0F5257] block mb-0.5">
                      Evening Activity
                    </span>
                    <p className="text-[#141413]">{day.eveningActivity}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#141413]/6">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6B43] block mb-0.5">
                      Dinner & Hotel Stay
                    </span>
                    <p className="text-[#141413]">{day.dinnerAndStay}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

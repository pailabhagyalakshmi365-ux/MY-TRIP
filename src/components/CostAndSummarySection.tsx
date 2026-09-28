import React, { useMemo, useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  BudgetTier,
  DemoBooking,
  Destination,
  Hotel,
  Language,
  SelectedGuideBooking,
  SelectedTicketItem,
  TransportOption,
  UserProfile,
} from '../types/travel';
import { UI_TEXT, formatINR } from '../utils/scenicArt';

interface CostAndSummarySectionProps {
  lang: Language;
  destinations: Destination[];
  activeDestinationId: string;
  onChangeDestinationId: (id: string) => void;
  startDate: string;
  endDate: string;
  onChangeDates: (start: string, end: string) => void;
  adults: number;
  childrenCount: number;
  onChangeTravelers: (adults: number, children: number) => void;
  budgetTier: BudgetTier;
  onChangeBudgetTier: (tier: BudgetTier) => void;
  selectedHotel: Hotel | null;
  onClearHotel: () => void;
  selectedTransport: TransportOption | null;
  onClearTransport: () => void;
  selectedTickets: SelectedTicketItem[];
  onRemoveTicket: (id: string) => void;
  selectedGuide: SelectedGuideBooking | null;
  onClearGuide: () => void;
  currentUser: UserProfile | null;
  onConfirmDemoBooking: (booking: DemoBooking) => void;
  onOpenMyTrips: () => void;
}

export const CostAndSummarySection: React.FC<CostAndSummarySectionProps> = ({
  lang,
  destinations,
  activeDestinationId,
  onChangeDestinationId,
  startDate,
  endDate,
  onChangeDates,
  adults,
  childrenCount,
  onChangeTravelers,
  budgetTier,
  onChangeBudgetTier,
  selectedHotel,
  onClearHotel,
  selectedTransport,
  onClearTransport,
  selectedTickets,
  onRemoveTicket,
  selectedGuide,
  onClearGuide,
  currentUser,
  onConfirmDemoBooking,
  onOpenMyTrips,
}) => {
  const t = UI_TEXT[lang];

  const destination =
    destinations.find((d) => d.id === activeDestinationId) || destinations[0];

  const [otherExpensesInput, setOtherExpensesInput] = useState<number>(1500);
  const [travelerName, setTravelerName] = useState<string>(
    currentUser?.name || 'Ananya Sharma'
  );
  const [travelerEmail, setTravelerEmail] = useState<string>(
    currentUser?.email || 'ananya.traveler@example.in'
  );
  const [travelerPhone, setTravelerPhone] = useState<string>(
    currentUser?.phone || '+91 98480 22334'
  );

  const [confirmedBooking, setConfirmedBooking] = useState<DemoBooking | null>(null);
  const [formError, setFormError] = useState<string>('');

  const daysCount = useMemo(() => {
    const s = new Date(startDate || '2026-10-15');
    const e = new Date(endDate || '2026-10-18');
    const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(30, diff));
  }, [startDate, endDate]);

  const hotelNights = Math.max(1, daysCount - 1);
  const totalPeople = Math.max(1, adults + childrenCount);

  const budgetMultiplier =
    budgetTier === 'Budget'
      ? 0.72
      : budgetTier === 'Standard'
      ? 1.0
      : budgetTier === 'Premium'
      ? 1.5
      : 2.2;

  // 7-Line Ledger Calculation
  const breakdown = useMemo(() => {
    const roomsNeeded = Math.max(1, Math.ceil((adults + childrenCount * 0.5) / 2));

    // 1. Transportation (Round-trip intercity estimate)
    const baseTransportPerPerson = selectedTransport
      ? selectedTransport.approximateFare * 2
      : 2400 * budgetMultiplier;
    const transportation = Math.round(
      baseTransportPerPerson * (adults + childrenCount * 0.7)
    );

    // 2. Hotel
    const nightlyRate = selectedHotel
      ? selectedHotel.estimatedPricePerNight
      : Math.round(destination.costs.hotelPerNight * budgetMultiplier);
    const hotel = Math.round(nightlyRate * hotelNights * roomsNeeded);

    // 3. Food
    const food = Math.round(
      destination.costs.foodPerDay *
        budgetMultiplier *
        daysCount *
        (adults + childrenCount * 0.6)
    );

    // 4. Attraction tickets
    const attractionTickets =
      selectedTickets.length > 0
        ? selectedTickets.reduce((sum, item) => sum + item.totalPrice, 0)
        : Math.round(
            destination.costs.avgEntryTicket *
              daysCount *
              (adults + childrenCount * 0.5)
          );

    // 5. Guide
    const guide = selectedGuide ? selectedGuide.totalCost : 0;

    // 6. Local transportation
    const localTransportation = Math.round(
      destination.costs.localTransportPerDay * budgetMultiplier * daysCount
    );

    // 7. Other expenses (souvenirs, tips, snacks)
    const otherExpenses = Math.round(otherExpensesInput * budgetMultiplier);

    const totalCost =
      transportation +
      hotel +
      food +
      attractionTickets +
      guide +
      localTransportation +
      otherExpenses;

    const costPerPerson = Math.round(totalCost / totalPeople);
    const dailyAverage = Math.round(totalCost / daysCount);

    return {
      transportation,
      hotel,
      food,
      attractionTickets,
      guide,
      localTransportation,
      otherExpenses,
      totalCost,
      costPerPerson,
      dailyAverage,
      roomsNeeded,
      nightlyRate,
    };
  }, [
    adults,
    childrenCount,
    selectedTransport,
    selectedHotel,
    selectedTickets,
    selectedGuide,
    destination,
    budgetMultiplier,
    hotelNights,
    daysCount,
    otherExpensesInput,
    totalPeople,
  ]);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!travelerName.trim() || !travelerEmail.trim() || !travelerPhone.trim()) {
      setFormError('Please provide traveler name, email, and phone number to confirm demo booking.');
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 89999);
    const newBooking: DemoBooking = {
      bookingId: `ITP-2026-${randomNum}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Confirmed (Demo)',
      destinationId: destination.id,
      destinationName: destination.name,
      startDate,
      endDate,
      daysCount,
      adults,
      children: childrenCount,
      budgetTier,
      selectedHotel,
      hotelNights,
      selectedTransport,
      selectedTickets,
      selectedGuide,
      costBreakdown: {
        transportation: breakdown.transportation,
        hotel: breakdown.hotel,
        food: breakdown.food,
        attractionTickets: breakdown.attractionTickets,
        guide: breakdown.guide,
        localTransportation: breakdown.localTransportation,
        otherExpenses: breakdown.otherExpenses,
        totalCost: breakdown.totalCost,
        costPerPerson: breakdown.costPerPerson,
        dailyAverage: breakdown.dailyAverage,
      },
      travelerName: travelerName.trim(),
      travelerEmail: travelerEmail.trim(),
      travelerPhone: travelerPhone.trim(),
    };

    onConfirmDemoBooking(newBooking);
    setConfirmedBooking(newBooking);
  };

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C84B31] mb-1">
          LIVE RUPEE (₹) FINANCIAL LEDGER & DEMO CHECKOUT
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">
          {t.costCalculatorHeading} & {t.bookingSummaryHeading}
        </h2>
        <p className="text-sm text-[#5C5852] mt-1">
          Switch budget tiers or adjust trip parameters below to immediately recalculate your estimated total trip cost, cost per person, and daily average.
        </p>
      </div>

      {/* Confirmation Success Banner when Demo Booking is Completed */}
      {confirmedBooking && (
        <div className="mb-8 bg-[#1D6B43] text-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-md text-xs font-mono font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-[#A7F3D0]" />
                <span>{t.demoBookingSuccess}</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold">
                Demo booking successful! Booking ID:{' '}
                <span className="font-mono underline decoration-[#A7F3D0]">
                  {confirmedBooking.bookingId}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-2xl">
                Your demo itinerary & reservation summary for{' '}
                <strong>{confirmedBooking.destinationName}</strong> ({confirmedBooking.startDate} to{' '}
                {confirmedBooking.endDate}) totaling{' '}
                <strong className="font-mono">
                  {formatINR(confirmedBooking.costBreakdown.totalCost)}
                </strong>{' '}
                has been saved to your account. No real payment was charged.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenMyTrips}
                className="px-5 py-3 rounded-xl bg-white text-[#141413] font-semibold text-xs sm:text-sm hover:bg-[#F3F1EC] cursor-pointer"
              >
                View in "My Trips" →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Interactive Cost Calculator & Live Budget Switcher */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#141413]/12 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#141413]/10 pb-4">
            <h3 className="font-display text-xl font-semibold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#C84B31]" />
              <span>Trip Cost Calculator</span>
            </h3>
            <span className="text-xs font-mono text-[#0F5257] font-semibold">
              Currency: INR (₹)
            </span>
          </div>

          {/* Instant Recalculation Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-2">
                Change Budget Tier (Instant Recalculation)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Budget', 'Standard', 'Premium', 'Luxury'] as BudgetTier[]).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => onChangeBudgetTier(tier)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      budgetTier === tier
                        ? 'bg-[#C84B31] text-white border-[#C84B31]'
                        : 'bg-[#FAF9F6] text-[#141413] border-[#141413]/15 hover:bg-[#F3F1EC]'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                  Destination
                </label>
                <select
                  value={destination.id}
                  onChange={(e) => onChangeDestinationId(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-medium"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onChangeDates(e.target.value, endDate)}
                  className="w-full h-10 px-2.5 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onChangeDates(startDate, e.target.value)}
                  className="w-full h-10 px-2.5 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                  Adults
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={adults}
                  onChange={(e) =>
                    onChangeTravelers(Math.max(1, Number(e.target.value)), childrenCount)
                  }
                  className="w-full h-10 px-2.5 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                  Children
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={childrenCount}
                  onChange={(e) =>
                    onChangeTravelers(adults, Math.max(0, Number(e.target.value)))
                  }
                  className="w-full h-10 px-2.5 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5C5852] mb-1">
                  Other Expenses (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={250}
                  value={otherExpensesInput}
                  onChange={(e) =>
                    setOtherExpensesInput(Math.max(0, Number(e.target.value)))
                  }
                  className="w-full h-10 px-2.5 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-mono font-semibold"
                />
              </div>
            </div>
          </div>

          {/* 7-Item Mathematical Ledger Breakdown */}
          <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#141413]/10 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#5C5852]">
                1. Transportation{' '}
                <span className="text-xs">
                  ({selectedTransport ? selectedTransport.operatorName : `${budgetTier} round-trip est.`})
                </span>
              </span>
              <span className="font-mono font-semibold text-[#141413]">
                {formatINR(breakdown.transportation)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C5852]">
                + 2. Hotel Stay{' '}
                <span className="text-xs">
                  ({hotelNights} nights × {breakdown.roomsNeeded} room(s))
                </span>
              </span>
              <span className="font-mono font-semibold text-[#141413]">
                {formatINR(breakdown.hotel)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C5852]">
                + 3. Food & Dining{' '}
                <span className="text-xs">({daysCount} days · regional meals)</span>
              </span>
              <span className="font-mono font-semibold text-[#141413]">
                {formatINR(breakdown.food)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C5852]">
                + 4. Attraction Tickets{' '}
                <span className="text-xs">
                  ({selectedTickets.length > 0 ? `${selectedTickets.length} booked` : 'avg entry est.'})
                </span>
              </span>
              <span className="font-mono font-semibold text-[#141413]">
                {formatINR(breakdown.attractionTickets)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C5852]">
                + 5. Local Guide Fee{' '}
                <span className="text-xs">
                  ({selectedGuide ? selectedGuide.guide.name : 'No guide selected'})
                </span>
              </span>
              <span className="font-mono font-semibold text-[#141413]">
                {formatINR(breakdown.guide)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C5852]">
                + 6. Local Transportation{' '}
                <span className="text-xs">({daysCount} days local cab/auto)</span>
              </span>
              <span className="font-mono font-semibold text-[#141413]">
                {formatINR(breakdown.localTransportation)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C5852]">
                + 7. Other Expenses{' '}
                <span className="text-xs">(Shopping, tips & incidentals)</span>
              </span>
              <span className="font-mono font-semibold text-[#141413]">
                {formatINR(breakdown.otherExpenses)}
              </span>
            </div>

            {/* Total & Per-Person / Daily Outputs */}
            <div className="pt-3 border-t-2 border-[#141413]/15 flex items-baseline justify-between">
              <span className="font-display text-lg font-semibold text-[#141413]">
                = Total Estimated Trip Cost
              </span>
              <span className="font-mono text-2xl font-bold text-[#C84B31]">
                {formatINR(breakdown.totalCost)}
              </span>
            </div>
          </div>

          {/* 3 Output Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0F1E26] text-white p-3.5 rounded-xl">
              <span className="text-[11px] text-white/75 block">Total Estimated Cost</span>
              <span className="font-mono text-lg sm:text-xl font-bold text-[#F4A261]">
                {formatINR(breakdown.totalCost)}
              </span>
            </div>
            <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#141413]/12">
              <span className="text-[11px] text-[#5C5852] block">Cost Per Person</span>
              <span className="font-mono text-lg sm:text-xl font-bold text-[#141413]">
                {formatINR(breakdown.costPerPerson)}
              </span>
            </div>
            <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#141413]/12">
              <span className="text-[11px] text-[#5C5852] block">Daily Average Cost</span>
              <span className="font-mono text-lg sm:text-xl font-bold text-[#0F5257]">
                {formatINR(breakdown.dailyAverage)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING SUMMARY & CONFIRMATION */}
        <form
          onSubmit={handleConfirmBooking}
          className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#141413]/12 shadow-xs space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#141413]/10 pb-4">
            <h3 className="font-display text-xl font-semibold flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#0F5257]" />
              <span>{t.bookingSummaryHeading}</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F3F1EC] text-[#141413]">
              Demo Checkout
            </span>
          </div>

          {/* Summary Items */}
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#141413]/8 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block">
                  Destination & Travel Dates
                </span>
                <p className="font-semibold text-[#141413]">
                  {destination.name} ({destination.state}) · {startDate} to {endDate} ({daysCount}{' '}
                  Days)
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-[#C84B31]">
                {budgetTier} Tier
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#141413]/8 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block">
                  Travelers
                </span>
                <p className="font-semibold text-[#141413]">
                  {adults} Adult(s), {childrenCount} Child(ren) ({totalPeople} Total)
                </p>
              </div>
            </div>

            {/* Selected Hotel */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#141413]/8 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block">
                  Selected Hotel ({hotelNights} Nights)
                </span>
                {selectedHotel ? (
                  <p className="font-semibold text-[#141413]">
                    {selectedHotel.name} · {formatINR(selectedHotel.estimatedPricePerNight)}/night
                  </p>
                ) : (
                  <p className="text-[#5C5852]">
                    Standard {destination.name} Hotel Estimate ({formatINR(breakdown.nightlyRate)}
                    /night)
                  </p>
                )}
              </div>
              {selectedHotel && (
                <button
                  type="button"
                  onClick={onClearHotel}
                  className="text-xs text-[#B91C1C] hover:underline shrink-0"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Selected Transport */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#141413]/8 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block">
                  Selected Transport
                </span>
                {selectedTransport ? (
                  <p className="font-semibold text-[#141413]">
                    {selectedTransport.mode}: {selectedTransport.operatorName} (
                    {selectedTransport.fromCity} → {selectedTransport.toCity}) ·{' '}
                    {formatINR(selectedTransport.approximateFare)}
                  </p>
                ) : (
                  <p className="text-[#5C5852]">
                    Estimated Round-Trip Transit Included ({formatINR(breakdown.transportation)})
                  </p>
                )}
              </div>
              {selectedTransport && (
                <button
                  type="button"
                  onClick={onClearTransport}
                  className="text-xs text-[#B91C1C] hover:underline shrink-0"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Selected Tickets */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#141413]/8">
              <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block mb-1">
                Selected Attraction Tickets ({selectedTickets.length})
              </span>
              {selectedTickets.length === 0 ? (
                <p className="text-[#5C5852]">
                  Default monument entry estimate included ({formatINR(breakdown.attractionTickets)})
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {selectedTickets.map((item) => (
                    <li
                      key={item.ticket.id}
                      className="flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded border border-[#141413]/8"
                    >
                      <span>
                        <strong>{item.ticket.attractionName}</strong> ({item.date}) · {item.adults}A
                        {item.children > 0 ? `, ${item.children}C` : ''}
                      </span>
                      <span className="flex items-center gap-2 font-mono font-semibold">
                        {formatINR(item.totalPrice)}
                        <button
                          type="button"
                          onClick={() => onRemoveTicket(item.ticket.id)}
                          className="text-[#B91C1C]"
                        >
                          ×
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Selected Guide */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#141413]/8 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#5C5852] block">
                  Local Guide
                </span>
                {selectedGuide ? (
                  <p className="font-semibold text-[#141413]">
                    {selectedGuide.guide.name} ({selectedGuide.guide.city}) · {selectedGuide.count}{' '}
                    {selectedGuide.bookingUnit} · {formatINR(selectedGuide.totalCost)}
                  </p>
                ) : (
                  <p className="text-[#5C5852]">No local guide hired (Optional)</p>
                )}
              </div>
              {selectedGuide && (
                <button
                  type="button"
                  onClick={onClearGuide}
                  className="text-xs text-[#B91C1C] hover:underline shrink-0"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Primary Traveler Details for Demo Confirmation */}
          <div className="pt-3 border-t border-[#141413]/10 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
              Lead Traveler Details (For Demo Booking Voucher)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                className="h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-medium"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={travelerEmail}
                onChange={(e) => setTravelerEmail(e.target.value)}
                className="h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-medium"
              />
              <input
                type="tel"
                placeholder="Phone (+91)"
                value={travelerPhone}
                onChange={(e) => setTravelerPhone(e.target.value)}
                className="h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-medium"
              />
            </div>
          </div>

          {formError && (
            <p className="text-xs text-[#B91C1C] font-medium">{formError}</p>
          )}

          {/* Final Total & Confirm Booking Button */}
          <div className="pt-4 border-t border-[#141413]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#5C5852] block">Estimated Total Cost</span>
              <span className="font-mono text-2xl font-bold text-[#0F5257]">
                {formatINR(breakdown.totalCost)}
              </span>
            </div>

            <button
              type="submit"
              className="h-12 px-7 rounded-xl bg-[#C84B31] hover:bg-[#B43E24] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              {t.confirmBookingBtn}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

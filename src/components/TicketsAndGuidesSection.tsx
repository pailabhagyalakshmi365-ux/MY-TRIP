import React, { useMemo, useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Info,
  Languages,
  MapPin,
  Star,
  Ticket,
  UserCheck,
} from 'lucide-react';
import {
  Destination,
  Language,
  LocalGuide,
  SelectedGuideBooking,
  SelectedTicketItem,
  TicketBookingOption,
} from '../types/travel';
import { UI_TEXT, formatINR } from '../utils/scenicArt';

const TICKET_CATEGORIES: ('All' | TicketBookingOption['category'])[] = [
  'All',
  'Tourist Attractions',
  'Museums',
  'Monuments',
  'Parks',
  'Adventure Activities',
  'Events',
];

interface TicketsAndGuidesSectionProps {
  lang: Language;
  destinations: Destination[];
  tickets: TicketBookingOption[];
  guides: LocalGuide[];
  selectedTickets: SelectedTicketItem[];
  onAddOrUpdateTicket: (item: SelectedTicketItem) => void;
  onRemoveTicket: (ticketId: string) => void;
  selectedGuide: SelectedGuideBooking | null;
  onSelectGuide: (guideBooking: SelectedGuideBooking | null) => void;
  onProceedToCalculator: () => void;
}

export const TicketsAndGuidesSection: React.FC<TicketsAndGuidesSectionProps> = ({
  lang,
  destinations,
  tickets,
  guides,
  selectedTickets,
  onAddOrUpdateTicket,
  onRemoveTicket,
  selectedGuide,
  onSelectGuide,
  onProceedToCalculator,
}) => {
  const t = UI_TEXT[lang];

  // Ticket Filter State
  const [ticketCat, setTicketCat] = useState<'All' | TicketBookingOption['category']>('All');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Local per-card ticket configurator state
  const [ticketFormState, setTicketFormState] = useState<
    Record<string, { date: string; adults: number; children: number }>
  >({});

  // Guide booking configurator state
  const [guideUnitState, setGuideUnitState] = useState<
    Record<string, { unit: 'hours' | 'days'; count: number; date: string }>
  >({});

  const [demoNotice, setDemoNotice] = useState<string>('');

  const getTicketConfig = (id: string) => {
    return (
      ticketFormState[id] || {
        date: '2026-10-16',
        adults: 2,
        children: 0,
      }
    );
  };

  const updateTicketConfig = (
    id: string,
    patch: Partial<{ date: string; adults: number; children: number }>
  ) => {
    const current = getTicketConfig(id);
    setTicketFormState((prev) => ({
      ...prev,
      [id]: { ...current, ...patch },
    }));
  };

  const getGuideConfig = (id: string) => {
    return (
      guideUnitState[id] || {
        unit: 'hours',
        count: 4,
        date: '2026-10-16',
      }
    );
  };

  const updateGuideConfig = (
    id: string,
    patch: Partial<{ unit: 'hours' | 'days'; count: number; date: string }>
  ) => {
    const current = getGuideConfig(id);
    setGuideUnitState((prev) => ({
      ...prev,
      [id]: { ...current, ...patch },
    }));
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((tk) => {
      const matchCat = ticketCat === 'All' || tk.category === ticketCat;
      const matchCity = cityFilter === 'all' || tk.destinationId === cityFilter;
      return matchCat && matchCity;
    });
  }, [tickets, ticketCat, cityFilter]);

  const filteredGuides = useMemo(() => {
    return guides.filter((g) => cityFilter === 'all' || g.destinationId === cityFilter);
  }, [guides, cityFilter]);

  const handleBookTicket = (tk: TicketBookingOption) => {
    const cfg = getTicketConfig(tk.id);
    const total = cfg.adults * tk.adultPrice + cfg.children * tk.childPrice;
    onAddOrUpdateTicket({
      ticket: tk,
      date: cfg.date,
      adults: cfg.adults,
      children: cfg.children,
      totalPrice: total,
    });
    setDemoNotice(
      `Demo Ticket Reserved: "${tk.attractionName}" for ${cfg.adults} Adult(s), ${cfg.children} Child(ren) on ${cfg.date} — Total ${formatINR(
        total
      )} added to your Trip Cost Calculator.`
    );
  };

  const handleHireGuide = (guide: LocalGuide) => {
    const cfg = getGuideConfig(guide.id);
    const total =
      cfg.unit === 'hours' ? cfg.count * guide.perHourPrice : cfg.count * guide.perDayPrice;
    onSelectGuide({
      guide,
      bookingUnit: cfg.unit,
      count: cfg.count,
      date: cfg.date,
      totalCost: total,
    });
    setDemoNotice(
      `Demo Guide Assigned: ${guide.name} (${guide.city}) for ${cfg.count} ${cfg.unit} on ${cfg.date} — Estimated fee ${formatINR(
        total
      )} added to your Trip Cost Calculator.`
    );
  };

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 space-y-14">
      {/* Top Demo Banner & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#141413]/12 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <Info className="w-5 h-5 text-[#C84B31] shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm text-[#141413]">
            <strong>Demo Ticket & Guide Reservation Flow:</strong> All attraction tickets and local guide profiles use structured demo data. Booking items adds them to your Trip Cost Calculator & Booking Summary without charging real money.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs sm:text-sm font-medium"
          >
            <option value="all">Filter by City: All Cities</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onProceedToCalculator}
            className="h-10 px-4 rounded-lg bg-[#C84B31] hover:bg-[#B43E24] text-white text-xs font-semibold cursor-pointer"
          >
            Review Cost & Summary →
          </button>
        </div>
      </div>

      {demoNotice && (
        <div className="bg-[#1D6B43]/10 border border-[#1D6B43]/30 text-[#1D6B43] px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {demoNotice}
          </span>
          <button
            type="button"
            onClick={() => setDemoNotice('')}
            className="text-xs underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* PART 1: TICKET BOOKING SECTION */}
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C84B31] mb-1">
              MONUMENTS, MUSEUMS, PARKS & ADVENTURES
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#141413]">
              {t.ticketsHeading}
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TICKET_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setTicketCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  ticketCat === cat
                    ? 'bg-[#141413] text-white'
                    : 'bg-white border border-[#141413]/15 text-[#141413] hover:bg-[#F3F1EC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((tk) => {
            const cfg = getTicketConfig(tk.id);
            const totalPrice = cfg.adults * tk.adultPrice + cfg.children * tk.childPrice;
            const isBooked = selectedTickets.some((item) => item.ticket.id === tk.id);

            return (
              <article
                key={tk.id}
                className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  isBooked
                    ? 'border-[#1D6B43] ring-2 ring-[#1D6B43]/20'
                    : 'border-[#141413]/12 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0F5257] bg-[#0F5257]/10 px-2.5 py-0.5 rounded">
                      {tk.category}
                    </span>
                    <span className="text-xs font-medium text-[#5C5852]">
                      {tk.destinationName}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-[#141413] leading-snug">
                    {tk.attractionName}
                  </h3>
                  <p className="text-xs text-[#5C5852] mt-1">{tk.highlights}</p>

                  <div className="mt-3 pt-3 border-t border-[#141413]/8 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#5C5852] block">Adult Ticket Price</span>
                      <span className="font-mono font-bold text-sm text-[#141413]">
                        {formatINR(tk.adultPrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#5C5852] block">Child Ticket Price</span>
                      <span className="font-mono font-bold text-sm text-[#141413]">
                        {tk.childPrice === 0 ? 'Free' : formatINR(tk.childPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Date & Ticket Quantity Selector */}
                  <div className="mt-3 pt-3 border-t border-[#141413]/8 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase text-[#5C5852] mb-1">
                        Visit Date
                      </label>
                      <input
                        type="date"
                        value={cfg.date}
                        onChange={(e) => updateTicketConfig(tk.id, { date: e.target.value })}
                        className="w-full h-8 px-1.5 rounded bg-[#FAF9F6] border border-[#141413]/15 text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#5C5852] mb-1">
                        Adults
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={cfg.adults}
                        onChange={(e) =>
                          updateTicketConfig(tk.id, {
                            adults: Math.max(1, Number(e.target.value)),
                          })
                        }
                        className="w-full h-8 px-2 rounded bg-[#FAF9F6] border border-[#141413]/15 font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#5C5852] mb-1">
                        Children
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={cfg.children}
                        onChange={(e) =>
                          updateTicketConfig(tk.id, {
                            children: Math.max(0, Number(e.target.value)),
                          })
                        }
                        className="w-full h-8 px-2 rounded bg-[#FAF9F6] border border-[#141413]/15 font-mono font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#141413]/10 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-[#5C5852] block">Total Ticket Price</span>
                    <span className="font-mono text-lg font-bold text-[#0F5257]">
                      {formatINR(totalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isBooked && (
                      <button
                        type="button"
                        onClick={() => onRemoveTicket(tk.id)}
                        className="px-2.5 py-2 rounded-lg bg-[#F3F1EC] text-[#B91C1C] text-xs font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleBookTicket(tk)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isBooked
                          ? 'bg-[#1D6B43] text-white'
                          : 'bg-[#C84B31] hover:bg-[#B43E24] text-white'
                      }`}
                    >
                      {isBooked ? '✓ Update Ticket' : 'Book Ticket (Demo)'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* PART 2: HIRE A LOCAL GUIDE SECTION */}
      <div className="pt-8 border-t border-[#141413]/12">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0F5257] mb-1">
              DEMO GUIDE PROFILES · VERIFIED REGIONAL STORYTELLERS
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#141413]">
              {t.guidesHeading}
            </h2>
            <p className="text-sm text-[#5C5852] mt-1">
              Hire multilingual local guides by the hour or full day. All guide profiles below are marked as demo data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => {
            const cfg = getGuideConfig(guide.id);
            const totalFee =
              cfg.unit === 'hours'
                ? cfg.count * guide.perHourPrice
                : cfg.count * guide.perDayPrice;
            const isSelected = selectedGuide?.guide.id === guide.id;

            return (
              <article
                key={guide.id}
                className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-[#0F5257] ring-2 ring-[#0F5257]/25 shadow-md'
                    : 'border-[#141413]/12 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <img
                      src={guide.avatarUrl}
                      alt={guide.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#141413]/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C84B31]">
                          {guide.city} · Demo Data
                        </span>
                        <span className="font-mono text-xs font-semibold flex items-center gap-1 text-[#141413]">
                          <Star className="w-3.5 h-3.5 fill-[#F4A261] text-[#F4A261]" />
                          {guide.rating}/5
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-semibold text-[#141413] truncate">
                        {guide.name}
                      </h3>

                      <p className="text-xs text-[#5C5852] mt-0.5">
                        Experience: <strong className="text-[#141413]">{guide.experienceYears} years</strong> ·{' '}
                        <span className="text-[#1D6B43] font-medium">{guide.availability}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#5C5852] mt-3 leading-relaxed">{guide.bio}</p>

                  <div className="mt-3 pt-3 border-t border-[#141413]/8 space-y-1.5 text-xs">
                    <p>
                      <strong className="text-[#141413]">Languages:</strong>{' '}
                      {guide.languages.join(', ')}
                    </p>
                    <p>
                      <strong className="text-[#141413]">Specialization:</strong>{' '}
                      {guide.specialization.join(' · ')}
                    </p>
                  </div>

                  {/* Per-hour & Per-day Pricing */}
                  <div className="mt-3 pt-3 border-t border-[#141413]/8 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#FAF9F6] p-2.5 rounded-lg border border-[#141413]/8">
                      <span className="text-[#5C5852] block">Per-Hour Rate</span>
                      <span className="font-mono text-sm font-bold text-[#141413]">
                        {formatINR(guide.perHourPrice)}/hour
                      </span>
                    </div>
                    <div className="bg-[#FAF9F6] p-2.5 rounded-lg border border-[#141413]/8">
                      <span className="text-[#5C5852] block">Per-Day Rate</span>
                      <span className="font-mono text-sm font-bold text-[#0F5257]">
                        {formatINR(guide.perDayPrice)}/day
                      </span>
                    </div>
                  </div>

                  {/* Guide Duration Selector */}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase text-[#5C5852] mb-1">
                        Mode
                      </label>
                      <select
                        value={cfg.unit}
                        onChange={(e) =>
                          updateGuideConfig(guide.id, {
                            unit: e.target.value as 'hours' | 'days',
                            count: e.target.value === 'hours' ? 4 : 1,
                          })
                        }
                        className="w-full h-8 px-1.5 rounded bg-[#FAF9F6] border border-[#141413]/15 text-xs"
                      >
                        <option value="hours">Hourly</option>
                        <option value="days">Full Days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#5C5852] mb-1">
                        {cfg.unit === 'hours' ? 'Hours' : 'Days'}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={cfg.count}
                        onChange={(e) =>
                          updateGuideConfig(guide.id, {
                            count: Math.max(1, Number(e.target.value)),
                          })
                        }
                        className="w-full h-8 px-2 rounded bg-[#FAF9F6] border border-[#141413]/15 font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#5C5852] mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={cfg.date}
                        onChange={(e) => updateGuideConfig(guide.id, { date: e.target.value })}
                        className="w-full h-8 px-1.5 rounded bg-[#FAF9F6] border border-[#141413]/15 text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#141413]/10 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-[#5C5852] block">Guide Fee Estimate</span>
                    <span className="font-mono text-lg font-bold text-[#0F5257]">
                      {formatINR(totalFee)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleHireGuide(guide)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D6B43] text-white'
                        : 'bg-[#0F5257] hover:bg-[#0A3A3E] text-white'
                    }`}
                  >
                    {isSelected ? '✓ Guide Assigned' : 'Book Guide (Demo)'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

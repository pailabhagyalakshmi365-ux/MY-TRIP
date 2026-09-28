/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { CostAndSummarySection } from './components/CostAndSummarySection';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { HeroAndDiscovery } from './components/HeroAndDiscovery';
import { HotelsAndTransportSection } from './components/HotelsAndTransportSection';
import { Navbar } from './components/Navbar';
import { TicketsAndGuidesSection } from './components/TicketsAndGuidesSection';
import { TripPlannerSection } from './components/TripPlannerSection';
import { AdminDashboardSection, UserCenterModal } from './components/UserAndAdminModals';
import { INITIAL_DESTINATIONS } from './data/destinationsData';
import {
  INITIAL_GUIDES,
  INITIAL_HOTELS,
  INITIAL_TICKETS,
  INITIAL_TRANSPORTS,
} from './data/servicesData';
import { TravelApiService } from './services/api';
import {
  BudgetTier,
  DemoBooking,
  Destination,
  Hotel,
  Language,
  LocalGuide,
  SavedItinerary,
  SelectedGuideBooking,
  SelectedTicketItem,
  TicketBookingOption,
  TransportOption,
  UserProfile,
} from './types/travel';
import { formatINR } from './utils/scenicArt';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('discover');

  // Master Data State
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [hotels, setHotels] = useState<Hotel[]>(INITIAL_HOTELS);
  const [tickets, setTickets] = useState<TicketBookingOption[]>(INITIAL_TICKETS);
  const [transports, setTransports] = useState<TransportOption[]>(INITIAL_TRANSPORTS);
  const [guides, setGuides] = useState<LocalGuide[]>(INITIAL_GUIDES);

  // User & Persistence State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    TravelApiService.getCurrentUser()
  );
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => TravelApiService.getAllUsers());
  const [savedDestinationIds, setSavedDestinationIds] = useState<string[]>(() =>
    TravelApiService.getSavedDestinationIds()
  );
  const [savedHotelIds, setSavedHotelIds] = useState<string[]>(() =>
    TravelApiService.getSavedHotelIds()
  );
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>(() =>
    TravelApiService.getSavedItineraries()
  );
  const [bookings, setBookings] = useState<DemoBooking[]>(() => TravelApiService.getBookings());

  // Active Trip Session State (Shared across Planner, Hotels, Transport, Tickets, Guides, Cost Calculator, Summary)
  const [activeDestinationId, setActiveDestinationId] = useState<string>('hyderabad');
  const [startDate, setStartDate] = useState<string>('2026-10-15');
  const [endDate, setEndDate] = useState<string>('2026-10-18');
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('Standard');

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(INITIAL_HOTELS[0]);
  const [selectedTransport, setSelectedTransport] = useState<TransportOption | null>(
    INITIAL_TRANSPORTS[0]
  );
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicketItem[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<SelectedGuideBooking | null>({
    guide: INITIAL_GUIDES[0],
    bookingUnit: 'hours',
    count: 4,
    date: '2026-10-16',
    totalCost: 3200,
  });

  // Modals State
  const [inspectDestination, setInspectDestination] = useState<Destination | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);

  useEffect(() => {
    TravelApiService.loadInitialPlatformData().then((data) => {
      if (data.destinations?.length) setDestinations(data.destinations);
      if (data.hotels?.length) setHotels(data.hotels);
      if (data.tickets?.length) setTickets(data.tickets);
      if (data.transports?.length) setTransports(data.transports);
      if (data.guides?.length) setGuides(data.guides);
    });
  }, []);

  const handleToggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  const handleToggleSaveDestination = (id: string) => {
    const updated = TravelApiService.toggleSavedDestination(id);
    setSavedDestinationIds(updated);
  };

  const handleToggleSaveHotel = (id: string) => {
    const updated = TravelApiService.toggleSavedHotel(id);
    setSavedHotelIds(updated);
  };

  const handleStartPlanForDestination = (
    destId: string,
    date?: string,
    travelers?: number,
    budget?: BudgetTier
  ) => {
    setActiveDestinationId(destId);
    if (date) {
      setStartDate(date);
      const dest = destinations.find((d) => d.id === destId);
      const rec = dest?.recommendedDays || 3;
      const dObj = new Date(date);
      dObj.setDate(dObj.getDate() + Math.max(1, rec - 1));
      setEndDate(dObj.toISOString().split('T')[0]);
    }
    if (travelers) setAdults(travelers);
    if (budget) setBudgetTier(budget);

    // Automatically match default hotel & guide for that destination if available
    const cityHotel = hotels.find((h) => h.destinationId === destId);
    if (cityHotel) setSelectedHotel(cityHotel);
    const cityGuide = guides.find((g) => g.destinationId === destId);
    if (cityGuide) {
      setSelectedGuide({
        guide: cityGuide,
        bookingUnit: 'hours',
        count: 4,
        date: date || startDate,
        totalCost: cityGuide.perHourPrice * 4,
      });
    }

    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddOrUpdateTicket = (item: SelectedTicketItem) => {
    setSelectedTickets((prev) => {
      const exists = prev.some((x) => x.ticket.id === item.ticket.id);
      if (exists) {
        return prev.map((x) => (x.ticket.id === item.ticket.id ? item : x));
      }
      return [...prev, item];
    });
  };

  const handleRemoveTicket = (ticketId: string) => {
    setSelectedTickets((prev) => prev.filter((x) => x.ticket.id !== ticketId));
  };

  const handleConfirmDemoBooking = async (booking: DemoBooking) => {
    await TravelApiService.createDemoBooking(booking);
    setBookings(TravelApiService.getBookings());
  };

  const cartItemsCount =
    (selectedHotel ? 1 : 0) +
    (selectedTransport ? 1 : 0) +
    selectedTickets.length +
    (selectedGuide ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#141413]">
      <Navbar
        lang={lang}
        onToggleLang={handleToggleLanguage}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartItemsCount}
        currentUser={currentUser}
        onOpenUserModal={() => setIsUserModalOpen(true)}
      />

      {/* Quick Progress Strip showing Active Trip Configuration */}
      <div className="bg-[#F3F1EC] border-b border-[#141413]/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#5C5852]">
            <span>
              <strong className="text-[#141413]">Active Trip:</strong>{' '}
              {destinations.find((d) => d.id === activeDestinationId)?.name || 'Hyderabad'} (
              {startDate} → {endDate})
            </span>
            <span>
              <strong className="text-[#141413]">Hotel:</strong>{' '}
              {selectedHotel ? selectedHotel.name : 'Standard Est.'}
            </span>
            <span>
              <strong className="text-[#141413]">Guide:</strong>{' '}
              {selectedGuide
                ? `${selectedGuide.guide.name} (${formatINR(selectedGuide.totalCost)})`
                : 'None'}
            </span>
            <span>
              <strong className="text-[#141413]">Tickets:</strong> {selectedTickets.length} selected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className="font-semibold text-[#C84B31] hover:underline cursor-pointer"
            >
              Open Cost Calculator & Summary →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'discover' && (
          <HeroAndDiscovery
            lang={lang}
            destinations={destinations}
            hotels={hotels}
            guides={guides}
            tickets={tickets}
            selectedDestinationId={activeDestinationId}
            onSelectDestinationForDetails={(dest) => setInspectDestination(dest)}
            onStartPlanForDestination={handleStartPlanForDestination}
            savedDestinationIds={savedDestinationIds}
            onToggleSaveDestination={handleToggleSaveDestination}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'planner' && (
          <TripPlannerSection
            lang={lang}
            destinations={destinations}
            activeDestinationId={activeDestinationId}
            initialDate={startDate}
            initialAdults={adults}
            initialBudget={budgetTier}
            onSyncTripParameters={(params) => {
              setActiveDestinationId(params.destinationId);
              setStartDate(params.startDate);
              setEndDate(params.endDate);
              setAdults(params.adults);
              setChildrenCount(params.children);
              setBudgetTier(params.budget);
            }}
            onSaveItinerary={(itin) => {
              const updated = TravelApiService.saveItinerary(itin);
              setSavedItineraries(updated);
            }}
            onProceedToStayAndTransit={() => {
              setActiveTab('stay-transit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'stay-transit' && (
          <HotelsAndTransportSection
            lang={lang}
            destinations={destinations}
            hotels={hotels}
            transports={transports}
            activeDestinationId={activeDestinationId}
            onChangeDestinationId={setActiveDestinationId}
            selectedHotel={selectedHotel}
            onSelectHotel={setSelectedHotel}
            savedHotelIds={savedHotelIds}
            onToggleSaveHotel={handleToggleSaveHotel}
            selectedTransport={selectedTransport}
            onSelectTransport={setSelectedTransport}
            onProceedToTicketsAndGuides={() => {
              setActiveTab('tickets-guides');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'tickets-guides' && (
          <TicketsAndGuidesSection
            lang={lang}
            destinations={destinations}
            tickets={tickets}
            guides={guides}
            selectedTickets={selectedTickets}
            onAddOrUpdateTicket={handleAddOrUpdateTicket}
            onRemoveTicket={handleRemoveTicket}
            selectedGuide={selectedGuide}
            onSelectGuide={setSelectedGuide}
            onProceedToCalculator={() => {
              setActiveTab('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'calculator' && (
          <CostAndSummarySection
            lang={lang}
            destinations={destinations}
            activeDestinationId={activeDestinationId}
            onChangeDestinationId={setActiveDestinationId}
            startDate={startDate}
            endDate={endDate}
            onChangeDates={(s, e) => {
              setStartDate(s);
              setEndDate(e);
            }}
            adults={adults}
            childrenCount={childrenCount}
            onChangeTravelers={(a, c) => {
              setAdults(a);
              setChildrenCount(c);
            }}
            budgetTier={budgetTier}
            onChangeBudgetTier={setBudgetTier}
            selectedHotel={selectedHotel}
            onClearHotel={() => setSelectedHotel(null)}
            selectedTransport={selectedTransport}
            onClearTransport={() => setSelectedTransport(null)}
            selectedTickets={selectedTickets}
            onRemoveTicket={handleRemoveTicket}
            selectedGuide={selectedGuide}
            onClearGuide={() => setSelectedGuide(null)}
            currentUser={currentUser}
            onConfirmDemoBooking={handleConfirmDemoBooking}
            onOpenMyTrips={() => setIsUserModalOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboardSection
            destinations={destinations}
            onUpdateDestinations={(list) => {
              setDestinations(list);
              TravelApiService.saveDestinations(list);
            }}
            hotels={hotels}
            onUpdateHotels={(list) => {
              setHotels(list);
              TravelApiService.saveHotels(list);
            }}
            tickets={tickets}
            onUpdateTickets={(list) => {
              setTickets(list);
              TravelApiService.saveTickets(list);
            }}
            guides={guides}
            onUpdateGuides={(list) => {
              setGuides(list);
              TravelApiService.saveGuides(list);
            }}
            transports={transports}
            onUpdateTransports={(list) => {
              setTransports(list);
              TravelApiService.saveTransports(list);
            }}
            users={allUsers}
            bookings={bookings}
            onUpdateBookings={(list) => {
              setBookings(list);
              TravelApiService.updateBookings(list);
            }}
          />
        )}
      </main>

      {/* Destination Details & Interactive Map Modal */}
      <DestinationDetailModal
        destination={inspectDestination}
        lang={lang}
        onClose={() => setInspectDestination(null)}
        isSaved={
          inspectDestination ? savedDestinationIds.includes(inspectDestination.id) : false
        }
        onToggleSave={handleToggleSaveDestination}
        onPlanTripHere={(destId) => handleStartPlanForDestination(destId)}
        onFindHotelsHere={(destId) => {
          setActiveDestinationId(destId);
          setActiveTab('stay-transit');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBookTicketsHere={(destId) => {
          setActiveDestinationId(destId);
          setActiveTab('tickets-guides');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* User Profile, Saved Items & My Trips Modal */}
      <UserCenterModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        onLoginOrRegister={(user) => {
          setCurrentUser(user);
          TravelApiService.setCurrentUser(user);
          if (!allUsers.some((u) => u.email === user.email)) {
            const nextUsers = [...allUsers, user];
            setAllUsers(nextUsers);
            TravelApiService.saveAllUsers(nextUsers);
          }
        }}
        onLogout={() => {
          setCurrentUser(null);
          TravelApiService.setCurrentUser(null);
        }}
        savedDestinations={destinations.filter((d) => savedDestinationIds.includes(d.id))}
        onToggleSaveDestination={handleToggleSaveDestination}
        onSelectDestinationDetails={(dest) => setInspectDestination(dest)}
        savedHotels={hotels.filter((h) => savedHotelIds.includes(h.id))}
        onToggleSaveHotel={handleToggleSaveHotel}
        savedItineraries={savedItineraries}
        onDeleteItinerary={(id) => {
          const updated = TravelApiService.deleteItinerary(id);
          setSavedItineraries(updated);
        }}
        bookings={bookings}
        onOpenAdminDashboard={() => {
          setActiveTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <footer className="bg-[#0F1E26] text-[#FAF9F6] mt-16 border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs sm:text-sm">
          <div className="space-y-3">
            <h3 className="font-display text-xl font-semibold text-white">
              India Trip Planner
            </h3>
            <p className="text-white/75 text-xs leading-relaxed">
              All-in-one India travel platform to explore 22+ destinations, build custom day-by-day itineraries, compare estimated hotel and transport tariffs, book attraction tickets, and hire local guides in Indian Rupees (₹).
            </p>
            <p className="text-[11px] text-[#F4A261]">
              Demo Mode Active: Prices labeled as estimated prices. No real payments are charged.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F4A261] mb-3">
              Popular South & Deccan
            </h4>
            <ul className="space-y-1.5 text-xs text-white/80">
              {['hyderabad', 'visakhapatnam', 'tirupati', 'srisailam', 'kerala', 'bengaluru', 'chennai', 'mysuru', 'ooty', 'hampi'].map(
                (id) => {
                  const d = destinations.find((x) => x.id === id);
                  if (!d) return null;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => setInspectDestination(d)}
                        className="hover:text-[#F4A261] cursor-pointer"
                      >
                        {d.name} ({d.nameTe})
                      </button>
                    </li>
                  );
                }
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F4A261] mb-3">
              North, West & Himalayas
            </h4>
            <ul className="space-y-1.5 text-xs text-white/80">
              {['goa', 'mumbai', 'delhi', 'jaipur', 'agra', 'varanasi', 'kashmir', 'udaipur', 'rishikesh', 'ranthambore', 'darjeeling', 'amritsar'].map(
                (id) => {
                  const d = destinations.find((x) => x.id === id);
                  if (!d) return null;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => setInspectDestination(d)}
                        className="hover:text-[#F4A261] cursor-pointer"
                      >
                        {d.name} ({d.nameTe})
                      </button>
                    </li>
                  );
                }
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F4A261] mb-2">
              Platform Modules
            </h4>
            <div className="flex flex-col gap-2 text-xs text-white/85">
              <button
                type="button"
                onClick={() => setActiveTab('planner')}
                className="text-left hover:text-[#F4A261]"
              >
                → Custom Day-by-Day Trip Planner
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stay-transit')}
                className="text-left hover:text-[#F4A261]"
              >
                → Hotels & Intercity Transport
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tickets-guides')}
                className="text-left hover:text-[#F4A261]"
              >
                → Monument Tickets & Local Guides
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('calculator')}
                className="text-left hover:text-[#F4A261]"
              >
                → Trip Cost Calculator & Summary
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold w-fit cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#F4A261]" />
                <span>Open Admin Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

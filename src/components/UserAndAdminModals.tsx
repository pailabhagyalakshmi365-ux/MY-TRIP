import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  CheckCircle2,
  Heart,
  LogOut,
  Plus,
  ShieldCheck,
  Trash2,
  User,
  X,
} from 'lucide-react';
import {
  DemoBooking,
  Destination,
  Hotel,
  LocalGuide,
  SavedItinerary,
  TicketBookingOption,
  TransportOption,
  UserProfile,
} from '../types/travel';
import { createDestinationSceneSvg, createGuideAvatarSvg, formatINR } from '../utils/scenicArt';

interface UserCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  onLoginOrRegister: (user: UserProfile) => void;
  onLogout: () => void;
  savedDestinations: Destination[];
  onToggleSaveDestination: (id: string) => void;
  onSelectDestinationDetails: (dest: Destination) => void;
  savedHotels: Hotel[];
  onToggleSaveHotel: (id: string) => void;
  savedItineraries: SavedItinerary[];
  onDeleteItinerary: (id: string) => void;
  bookings: DemoBooking[];
  onOpenAdminDashboard: () => void;
}

export const UserCenterModal: React.FC<UserCenterModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onLoginOrRegister,
  onLogout,
  savedDestinations,
  onToggleSaveDestination,
  onSelectDestinationDetails,
  savedHotels,
  onToggleSaveHotel,
  savedItineraries,
  onDeleteItinerary,
  bookings,
  onOpenAdminDashboard,
}) => {
  if (!isOpen) return null;

  const [activeSubTab, setActiveSubTab] = useState<
    'bookings' | 'history' | 'itineraries' | 'saved-dest' | 'saved-hotels' | 'profile'
  >('bookings');

  // Auth form state when logged out or signing up
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('+91 98480 12345');
  const [cityInput, setCityInput] = useState('Hyderabad');

  const activeBookings = bookings.filter((b) => b.status === 'Confirmed (Demo)');
  const historyBookings = bookings.filter((b) => b.status !== 'Confirmed (Demo)');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      const existing = allUsers.find(
        (u) => u.email.toLowerCase() === emailInput.trim().toLowerCase()
      );
      if (existing) {
        onLoginOrRegister(existing);
      } else {
        const fallbackUser: UserProfile = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          name: emailInput.split('@')[0] || 'Traveler',
          email: emailInput || 'traveler@indiatripplanner.in',
          phone: phoneInput,
          homeCity: cityInput,
          preferredLanguage: 'en',
          role: 'traveler',
          joinedDate: new Date().toISOString().split('T')[0],
        };
        onLoginOrRegister(fallbackUser);
      }
    } else {
      const newUser: UserProfile = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: nameInput.trim() || 'Indian Explorer',
        email: emailInput.trim() || 'explorer@indiatripplanner.in',
        phone: phoneInput.trim(),
        homeCity: cityInput.trim(),
        preferredLanguage: 'en',
        role: 'traveler',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      onLoginOrRegister(newUser);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs overflow-y-auto p-3 sm:p-6 flex items-start justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF9F6] text-[#141413] w-full max-w-4xl rounded-2xl border border-[#141413]/15 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="bg-[#0F1E26] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#F4A261] font-semibold">
              TRAVELER ACCOUNT & MY TRIPS HUB
            </span>
            <h2 className="font-display text-2xl font-semibold">
              {currentUser ? `Namaste, ${currentUser.name}` : 'Sign In or Create Account'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdminDashboard();
              }}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#F4A261]" />
              <span>Admin Dashboard</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="bg-white border-b border-[#141413]/10 px-6 flex items-center gap-4 overflow-x-auto">
          {[
            { id: 'bookings', label: `My Bookings (${activeBookings.length})` },
            { id: 'history', label: `Trip History (${historyBookings.length})` },
            { id: 'itineraries', label: `Saved Itineraries (${savedItineraries.length})` },
            { id: 'saved-dest', label: `Saved Destinations (${savedDestinations.length})` },
            { id: 'saved-hotels', label: `Saved Hotels (${savedHotels.length})` },
            { id: 'profile', label: currentUser ? 'User Profile' : 'Login / Sign Up' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`py-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer ${
                activeSubTab === tab.id
                  ? 'border-[#C84B31] text-[#C84B31]'
                  : 'border-transparent text-[#5C5852] hover:text-[#141413]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* 1. MY BOOKINGS */}
          {activeSubTab === 'bookings' && (
            <div className="space-y-4">
              {activeBookings.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-[#141413]/10 text-center">
                  <p className="text-sm text-[#5C5852]">
                    No active demo bookings yet. Use the Cost Calculator & Booking Summary tab to confirm a demo booking!
                  </p>
                </div>
              ) : (
                activeBookings.map((bk) => (
                  <div
                    key={bk.bookingId}
                    className="bg-white p-5 rounded-xl border border-[#141413]/12 shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#141413]/8">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#1D6B43] bg-[#1D6B43]/10 px-2.5 py-1 rounded">
                          {bk.status} · ID: {bk.bookingId}
                        </span>
                        <h3 className="font-display text-xl font-semibold text-[#141413] mt-1.5">
                          {bk.destinationName} Trip ({bk.startDate} to {bk.endDate})
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[#5C5852] block">Total Estimated Cost</span>
                        <span className="font-mono text-xl font-bold text-[#0F5257]">
                          {formatINR(bk.costBreakdown.totalCost)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5C5852]">
                      <div>
                        <strong className="text-[#141413] block">Travelers & Tier:</strong>
                        {bk.adults} Adults, {bk.children} Children · {bk.budgetTier}
                      </div>
                      <div>
                        <strong className="text-[#141413] block">Hotel & Transit:</strong>
                        {bk.selectedHotel ? bk.selectedHotel.name : 'Standard Estimate'} ·{' '}
                        {bk.selectedTransport ? bk.selectedTransport.operatorName : 'Round-Trip Est.'}
                      </div>
                      <div>
                        <strong className="text-[#141413] block">Guide & Tickets:</strong>
                        {bk.selectedGuide ? bk.selectedGuide.guide.name : 'No Guide'} ·{' '}
                        {bk.selectedTickets.length} Attraction Ticket(s)
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. TRIP HISTORY */}
          {activeSubTab === 'history' && (
            <div className="space-y-4">
              {historyBookings.map((bk) => (
                <div
                  key={bk.bookingId}
                  className="bg-white p-5 rounded-xl border border-[#141413]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#5C5852]">
                      {bk.status} · Booking ID: {bk.bookingId}
                    </span>
                    <h4 className="font-display text-lg font-semibold text-[#141413]">
                      {bk.destinationName} ({bk.startDate} – {bk.endDate})
                    </h4>
                    <p className="text-xs text-[#5C5852]">
                      {bk.adults} Adults, {bk.children} Children · Hotel:{' '}
                      {bk.selectedHotel?.name || 'Standard Stay'}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="font-mono text-lg font-bold text-[#141413]">
                      {formatINR(bk.costBreakdown.totalCost)}
                    </span>
                    <span className="text-xs text-[#5C5852] block">
                      {formatINR(bk.costBreakdown.costPerPerson)} / person
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. SAVED ITINERARIES */}
          {activeSubTab === 'itineraries' && (
            <div className="space-y-4">
              {savedItineraries.length === 0 ? (
                <p className="text-sm text-[#5C5852] bg-white p-6 rounded-xl border border-[#141413]/10">
                  No saved itineraries yet. Generate an itinerary in the Trip Planner tab and click "Save Itinerary".
                </p>
              ) : (
                savedItineraries.map((itin) => (
                  <div
                    key={itin.id}
                    className="bg-white p-5 rounded-xl border border-[#141413]/12 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs text-[#C84B31] font-semibold">
                          {itin.id} · Created {itin.createdAt}
                        </span>
                        <h4 className="font-display text-lg font-semibold">
                          {itin.input.startingCity} → {itin.destinationName} ({itin.days.length}{' '}
                          Days)
                        </h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-bold text-[#0F5257]">
                          {formatINR(itin.totalEstimatedCost)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteItinerary(itin.id)}
                          className="text-xs text-[#B91C1C] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. SAVED DESTINATIONS */}
          {activeSubTab === 'saved-dest' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedDestinations.map((d) => (
                <div
                  key={d.id}
                  className="bg-white p-4 rounded-xl border border-[#141413]/12 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-display text-lg font-semibold">{d.name}</h4>
                    <p className="text-xs text-[#5C5852]">
                      {d.state} · Best: {d.bestTimeToVisit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectDestinationDetails(d);
                      }}
                      className="px-3 py-1.5 rounded bg-[#F3F1EC] text-xs font-semibold"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleSaveDestination(d.id)}
                      className="px-2.5 py-1.5 rounded bg-[#B91C1C]/10 text-[#B91C1C] text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. SAVED HOTELS */}
          {activeSubTab === 'saved-hotels' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedHotels.map((h) => (
                <div
                  key={h.id}
                  className="bg-white p-4 rounded-xl border border-[#141413]/12 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-semibold text-sm">{h.name}</h4>
                    <p className="text-xs text-[#5C5852]">
                      {h.location} · {formatINR(h.estimatedPricePerNight)}/night
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleSaveHotel(h.id)}
                    className="px-2.5 py-1.5 rounded bg-[#B91C1C]/10 text-[#B91C1C] text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 6. USER PROFILE / SIGN UP / LOGIN */}
          {activeSubTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUser ? (
                <div className="bg-white p-5 rounded-xl border border-[#141413]/12 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1D6B43]">
                    Active Signed-In Profile
                  </span>
                  <h3 className="font-display text-2xl font-semibold">{currentUser.name}</h3>
                  <div className="text-xs space-y-1.5 text-[#5C5852]">
                    <p>
                      <strong className="text-[#141413]">Email:</strong> {currentUser.email}
                    </p>
                    <p>
                      <strong className="text-[#141413]">Phone:</strong> {currentUser.phone}
                    </p>
                    <p>
                      <strong className="text-[#141413]">Home City:</strong> {currentUser.homeCity}
                    </p>
                    <p>
                      <strong className="text-[#141413]">Role:</strong> {currentUser.role}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="mt-3 px-4 py-2 rounded-lg bg-[#B91C1C] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white p-5 rounded-xl border border-[#141413]/12 flex items-center justify-center text-sm text-[#5C5852]">
                  Currently browsing as Guest. Sign in or register on the right.
                </div>
              )}

              <form
                onSubmit={handleAuthSubmit}
                className="bg-white p-5 rounded-xl border border-[#141413]/12 space-y-3"
              >
                <div className="flex items-center gap-3 border-b border-[#141413]/10 pb-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`text-xs font-semibold uppercase ${
                      authMode === 'login' ? 'text-[#C84B31] underline' : 'text-[#5C5852]'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`text-xs font-semibold uppercase ${
                      authMode === 'signup' ? 'text-[#C84B31] underline' : 'text-[#5C5852]'
                    }`}
                  >
                    Sign Up New Account
                  </button>
                </div>

                {authMode === 'signup' && (
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
                  />
                )}
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
                />
                {authMode === 'signup' && (
                  <>
                    <input
                      type="tel"
                      placeholder="Mobile Number (+91)"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Home City (e.g. Hyderabad, Vizag)"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
                    />
                  </>
                )}

                <button
                  type="submit"
                  className="w-full h-10 rounded-lg bg-[#C84B31] text-white text-xs font-semibold cursor-pointer"
                >
                  {authMode === 'login' ? 'Login to Account' : 'Create Traveler Account'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   ADMIN DASHBOARD SECTION
   Allows Admin to manage: Destinations, Hotels, Tourist attractions & Ticket prices,
   Guides, Transport options, Users, and Bookings.
   ============================================================================ */
interface AdminDashboardSectionProps {
  destinations: Destination[];
  onUpdateDestinations: (list: Destination[]) => void;
  hotels: Hotel[];
  onUpdateHotels: (list: Hotel[]) => void;
  tickets: TicketBookingOption[];
  onUpdateTickets: (list: TicketBookingOption[]) => void;
  guides: LocalGuide[];
  onUpdateGuides: (list: LocalGuide[]) => void;
  transports: TransportOption[];
  onUpdateTransports: (list: TransportOption[]) => void;
  users: UserProfile[];
  bookings: DemoBooking[];
  onUpdateBookings: (list: DemoBooking[]) => void;
}

export const AdminDashboardSection: React.FC<AdminDashboardSectionProps> = ({
  destinations,
  onUpdateDestinations,
  hotels,
  onUpdateHotels,
  tickets,
  onUpdateTickets,
  guides,
  onUpdateGuides,
  transports,
  onUpdateTransports,
  users,
  bookings,
  onUpdateBookings,
}) => {
  const [adminTab, setAdminTab] = useState<
    'destinations' | 'hotels' | 'tickets' | 'guides' | 'transport' | 'users' | 'bookings'
  >('destinations');

  // Quick Add Forms State
  const [newDestName, setNewDestName] = useState('');
  const [newDestState, setNewDestState] = useState('Telangana');
  const [newDestHotelCost, setNewDestHotelCost] = useState(2500);

  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelCity, setNewHotelCity] = useState('Hyderabad');
  const [newHotelPrice, setNewHotelPrice] = useState(3200);

  const [newTicketName, setNewTicketName] = useState('');
  const [newTicketCity, setNewTicketCity] = useState('Hyderabad');
  const [newTicketAdultPrice, setNewTicketAdultPrice] = useState(150);

  const [newGuideName, setNewGuideName] = useState('');
  const [newGuideCity, setNewGuideCity] = useState('Hyderabad');
  const [newGuideHourly, setNewGuideHourly] = useState(750);

  const handleAddDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestName.trim()) return;
    const id = newDestName.toLowerCase().replace(/\s+/g, '-');
    const created: Destination = {
      id,
      name: newDestName.trim(),
      nameTe: newDestName.trim(),
      state: newDestState,
      stateTe: newDestState,
      tagline: `Scenic heritage and cultural destination in ${newDestState}`,
      taglineTe: `${newDestState} లోని ప్రసిద్ధ పర్యాటక ప్రదేశం`,
      categories: ['Historical Places', 'Nature'],
      rating: 4.7,
      reviewCount: 120,
      heroImage: createDestinationSceneSvg(newDestName.trim(), newDestState, 'palace'),
      galleryImages: [createDestinationSceneSvg(newDestName.trim(), newDestState, 'palace')],
      description: `Explore the landmarks, temples, and natural beauty of ${newDestName.trim()} in ${newDestState}.`,
      descriptionTe: `${newDestName.trim()} పర్యాటక విశేషాలు.`,
      bestTimeToVisit: 'October to March',
      recommendedDays: 3,
      weather: {
        tempRange: '19°C – 30°C',
        condition: 'Pleasant',
        humidity: '50%',
        seasonNote: 'Great for sightseeing year-round.',
      },
      costs: {
        avgEntryTicket: 100,
        localTransportPerDay: 500,
        foodPerDay: 700,
        hotelPerNight: Number(newDestHotelCost) || 2500,
      },
      famousAttractions: [
        {
          id: `${id}-main`,
          name: `${newDestName.trim()} Central Heritage Monument`,
          type: 'Monument',
          openingHours: '09:00 AM – 05:30 PM',
          adultTicketPrice: 100,
          childTicketPrice: 50,
          description: 'Iconic regional landmark and cultural museum.',
          timeRequired: '2 Hours',
          coordinates: { x: 50, y: 50 },
        },
      ],
      thingsToDo: ['Guided heritage walk', 'Sample authentic regional cuisine'],
      nearbyPlaces: [{ name: 'Scenic Viewpoint', distanceKm: 18, highlight: 'Sunset panorama' }],
      mapCenterLabel: `${newDestName.trim()} Core`,
      latLng: { lat: 17.5, lng: 78.5 },
      mapMarkers: [
        {
          id: `${id}-m1`,
          name: `${newDestName.trim()} Fort`,
          category: 'Attraction',
          detail: '09:00 AM – 05:30 PM',
          priceOrInfo: '₹100 Entry',
          x: 50,
          y: 50,
        },
      ],
    };
    onUpdateDestinations([created, ...destinations]);
    setNewDestName('');
  };

  const handleAddHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName.trim()) return;
    const created: Hotel = {
      id: `ht-custom-${Date.now().toString().slice(-4)}`,
      destinationId: newHotelCity.toLowerCase(),
      destinationName: newHotelCity,
      name: newHotelName.trim(),
      location: `Central ${newHotelCity}`,
      rating: 4.6,
      reviewCount: 95,
      hotelType: 'Standard Hotel',
      roomType: 'Executive Deluxe Room',
      estimatedPricePerNight: Number(newHotelPrice) || 3000,
      amenities: ['Free WiFi', 'Breakfast Included'],
      breakfastIncluded: true,
      distanceFromCenterKm: 1.5,
      nearestAttraction: `${newHotelCity} City Center (1.5 km)`,
      image: createDestinationSceneSvg(newHotelName.trim(), newHotelCity, 'city'),
      description: 'Newly added comfortable hotel with complimentary Indian breakfast.',
    };
    onUpdateHotels([created, ...hotels]);
    setNewHotelName('');
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketName.trim()) return;
    const created: TicketBookingOption = {
      id: `tk-custom-${Date.now().toString().slice(-4)}`,
      destinationId: newTicketCity.toLowerCase(),
      destinationName: newTicketCity,
      attractionName: newTicketName.trim(),
      category: 'Tourist Attractions',
      openingHours: '09:00 AM – 06:00 PM',
      adultPrice: Number(newTicketAdultPrice) || 150,
      childPrice: Math.round((Number(newTicketAdultPrice) || 150) * 0.5),
      duration: '2.5 Hours',
      highlights: 'Priority demo entry ticket.',
    };
    onUpdateTickets([created, ...tickets]);
    setNewTicketName('');
  };

  const handleAddGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideName.trim()) return;
    const created: LocalGuide = {
      id: `gd-custom-${Date.now().toString().slice(-4)}`,
      name: newGuideName.trim(),
      city: newGuideCity,
      destinationId: newGuideCity.toLowerCase(),
      languages: ['Telugu', 'Hindi', 'English'],
      experienceYears: 5,
      rating: 4.8,
      reviewsCount: 42,
      perHourPrice: Number(newGuideHourly) || 750,
      perDayPrice: (Number(newGuideHourly) || 750) * 5,
      specialization: ['Heritage Walks', 'Local Cuisine'],
      availability: 'Available Today',
      bio: 'Verified regional guide added via Admin Dashboard (Demo data).',
      verifiedDemo: true,
      avatarUrl: createGuideAvatarSvg(newGuideName.trim(), newGuideCity, '#0F5257'),
    };
    onUpdateGuides([created, ...guides]);
    setNewGuideName('');
  };

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="bg-[#0F1E26] text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#F4A261]">
            PLATFORM OPERATIONS CONSOLE
          </span>
          <h2 className="font-display text-3xl font-semibold mt-0.5">
            Admin Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Manage Destinations, Hotels, Tourist Attractions & Ticket Prices, Local Guides, Transport Options, Users, and Demo Bookings.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center bg-white/10 p-3 rounded-xl text-xs">
          <div>
            <span className="font-mono text-lg font-bold text-[#F4A261] block">
              {destinations.length}
            </span>
            <span>Places</span>
          </div>
          <div>
            <span className="font-mono text-lg font-bold text-[#F4A261] block">
              {hotels.length}
            </span>
            <span>Hotels</span>
          </div>
          <div>
            <span className="font-mono text-lg font-bold text-[#F4A261] block">
              {guides.length}
            </span>
            <span>Guides</span>
          </div>
          <div>
            <span className="font-mono text-lg font-bold text-[#F4A261] block">
              {bookings.length}
            </span>
            <span>Bookings</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-[#141413]/10 pb-3">
        {[
          { id: 'destinations', label: `Destinations (${destinations.length})` },
          { id: 'hotels', label: `Hotels (${hotels.length})` },
          { id: 'tickets', label: `Attractions & Ticket Prices (${tickets.length})` },
          { id: 'guides', label: `Local Guides (${guides.length})` },
          { id: 'transport', label: `Transport Options (${transports.length})` },
          { id: 'users', label: `Users (${users.length})` },
          { id: 'bookings', label: `Bookings (${bookings.length})` },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setAdminTab(t.id as typeof adminTab)}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer ${
              adminTab === t.id
                ? 'bg-[#C84B31] text-white'
                : 'bg-white border border-[#141413]/15 text-[#141413] hover:bg-[#F3F1EC]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. MANAGE DESTINATIONS */}
      {adminTab === 'destinations' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddDestination}
            className="bg-white p-5 rounded-xl border border-[#141413]/12 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
          >
            <div>
              <label className="block text-xs font-semibold mb-1">New Destination Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Warangal"
                value={newDestName}
                onChange={(e) => setNewDestName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">State</label>
              <input
                type="text"
                value={newDestState}
                onChange={(e) => setNewDestState(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Est. Hotel / Night (₹)</label>
              <input
                type="number"
                value={newDestHotelCost}
                onChange={(e) => setNewDestHotelCost(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-[#0F5257] text-white text-xs font-semibold cursor-pointer"
            >
              + Add Destination
            </button>
          </form>

          <div className="bg-white rounded-xl border border-[#141413]/12 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F3F1EC] text-[#5C5852] uppercase text-[11px]">
                <tr>
                  <th className="p-3.5">Destination</th>
                  <th className="p-3.5">State</th>
                  <th className="p-3.5">Hotel Est. (₹)</th>
                  <th className="p-3.5">Food/Day (₹)</th>
                  <th className="p-3.5">Rec. Days</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141413]/8">
                {destinations.map((d) => (
                  <tr key={d.id}>
                    <td className="p-3.5 font-semibold">{d.name}</td>
                    <td className="p-3.5 text-[#5C5852]">{d.state}</td>
                    <td className="p-3.5 font-mono">{formatINR(d.costs.hotelPerNight)}</td>
                    <td className="p-3.5 font-mono">{formatINR(d.costs.foodPerDay)}</td>
                    <td className="p-3.5 font-mono">{d.recommendedDays} Days</td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateDestinations(destinations.filter((x) => x.id !== d.id))
                        }
                        className="text-xs text-[#B91C1C] hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. MANAGE HOTELS */}
      {adminTab === 'hotels' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddHotel}
            className="bg-white p-5 rounded-xl border border-[#141413]/12 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
          >
            <div>
              <label className="block text-xs font-semibold mb-1">Hotel Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Grand Kakatiya Stay"
                value={newHotelName}
                onChange={(e) => setNewHotelName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">City</label>
              <input
                type="text"
                value={newHotelCity}
                onChange={(e) => setNewHotelCity(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Estimated Price/Night (₹)</label>
              <input
                type="number"
                value={newHotelPrice}
                onChange={(e) => setNewHotelPrice(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-[#0F5257] text-white text-xs font-semibold cursor-pointer"
            >
              + Add Hotel
            </button>
          </form>

          <div className="bg-white rounded-xl border border-[#141413]/12 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F3F1EC] text-[#5C5852] uppercase text-[11px]">
                <tr>
                  <th className="p-3.5">Hotel Name</th>
                  <th className="p-3.5">City</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Est. Price/Night</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141413]/8">
                {hotels.map((h) => (
                  <tr key={h.id}>
                    <td className="p-3.5 font-semibold">{h.name}</td>
                    <td className="p-3.5">{h.destinationName}</td>
                    <td className="p-3.5 text-[#5C5852]">{h.hotelType}</td>
                    <td className="p-3.5 font-mono font-semibold text-[#0F5257]">
                      {formatINR(h.estimatedPricePerNight)}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onUpdateHotels(hotels.filter((x) => x.id !== h.id))}
                        className="text-xs text-[#B91C1C] hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MANAGE TICKETS & ATTRACTIONS */}
      {adminTab === 'tickets' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddTicket}
            className="bg-white p-5 rounded-xl border border-[#141413]/12 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
          >
            <div>
              <label className="block text-xs font-semibold mb-1">Attraction / Ticket Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Chowmahalla Palace Entry"
                value={newTicketName}
                onChange={(e) => setNewTicketName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">City</label>
              <input
                type="text"
                value={newTicketCity}
                onChange={(e) => setNewTicketCity(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Adult Ticket Price (₹)</label>
              <input
                type="number"
                value={newTicketAdultPrice}
                onChange={(e) => setNewTicketAdultPrice(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-[#0F5257] text-white text-xs font-semibold cursor-pointer"
            >
              + Add Attraction Ticket
            </button>
          </form>

          <div className="bg-white rounded-xl border border-[#141413]/12 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F3F1EC] text-[#5C5852] uppercase text-[11px]">
                <tr>
                  <th className="p-3.5">Attraction</th>
                  <th className="p-3.5">City</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Adult Price (₹)</th>
                  <th className="p-3.5">Child Price (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141413]/8">
                {tickets.map((tk) => (
                  <tr key={tk.id}>
                    <td className="p-3.5 font-semibold">{tk.attractionName}</td>
                    <td className="p-3.5">{tk.destinationName}</td>
                    <td className="p-3.5 text-[#5C5852]">{tk.category}</td>
                    <td className="p-3.5 font-mono font-semibold">{formatINR(tk.adultPrice)}</td>
                    <td className="p-3.5 font-mono">{formatINR(tk.childPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MANAGE LOCAL GUIDES */}
      {adminTab === 'guides' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddGuide}
            className="bg-white p-5 rounded-xl border border-[#141413]/12 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
          >
            <div>
              <label className="block text-xs font-semibold mb-1">Guide Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Suresh Babu"
                value={newGuideName}
                onChange={(e) => setNewGuideName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">City</label>
              <input
                type="text"
                value={newGuideCity}
                onChange={(e) => setNewGuideCity(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Hourly Rate (₹)</label>
              <input
                type="number"
                value={newGuideHourly}
                onChange={(e) => setNewGuideHourly(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#FAF9F6] border border-[#141413]/15 text-xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-[#0F5257] text-white text-xs font-semibold cursor-pointer"
            >
              + Add Local Guide
            </button>
          </form>

          <div className="bg-white rounded-xl border border-[#141413]/12 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F3F1EC] text-[#5C5852] uppercase text-[11px]">
                <tr>
                  <th className="p-3.5">Guide Name</th>
                  <th className="p-3.5">City</th>
                  <th className="p-3.5">Languages</th>
                  <th className="p-3.5">Hourly / Daily (₹)</th>
                  <th className="p-3.5">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141413]/8">
                {guides.map((g) => (
                  <tr key={g.id}>
                    <td className="p-3.5 font-semibold">{g.name}</td>
                    <td className="p-3.5">{g.city}</td>
                    <td className="p-3.5 text-[#5C5852]">{g.languages.join(', ')}</td>
                    <td className="p-3.5 font-mono">
                      {formatINR(g.perHourPrice)}/hr · {formatINR(g.perDayPrice)}/day
                    </td>
                    <td className="p-3.5 font-mono">{g.rating}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. MANAGE TRANSPORT OPTIONS */}
      {adminTab === 'transport' && (
        <div className="bg-white rounded-xl border border-[#141413]/12 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F3F1EC] text-[#5C5852] uppercase text-[11px]">
              <tr>
                <th className="p-3.5">Mode</th>
                <th className="p-3.5">Operator / Service</th>
                <th className="p-3.5">Route</th>
                <th className="p-3.5">Timing</th>
                <th className="p-3.5">Approx. Fare (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141413]/8">
              {transports.map((tr) => (
                <tr key={tr.id}>
                  <td className="p-3.5 font-semibold">{tr.mode}</td>
                  <td className="p-3.5">
                    {tr.operatorName} ({tr.serviceCode})
                  </td>
                  <td className="p-3.5">
                    {tr.fromCity} → {tr.toCity}
                  </td>
                  <td className="p-3.5 text-[#5C5852]">
                    {tr.departureTime} – {tr.arrivalTime}
                  </td>
                  <td className="p-3.5 font-mono font-semibold text-[#0F5257]">
                    {formatINR(tr.approximateFare)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. MANAGE USERS */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-xl border border-[#141413]/12 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F3F1EC] text-[#5C5852] uppercase text-[11px]">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Home City</th>
                <th className="p-3.5">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141413]/8">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="p-3.5 font-semibold">{u.name}</td>
                  <td className="p-3.5">{u.email}</td>
                  <td className="p-3.5 font-mono">{u.phone}</td>
                  <td className="p-3.5">{u.homeCity}</td>
                  <td className="p-3.5 uppercase text-xs font-mono font-semibold text-[#0F5257]">
                    {u.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 7. MANAGE BOOKINGS */}
      {adminTab === 'bookings' && (
        <div className="bg-white rounded-xl border border-[#141413]/12 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F3F1EC] text-[#5C5852] uppercase text-[11px]">
              <tr>
                <th className="p-3.5">Booking ID</th>
                <th className="p-3.5">Traveler</th>
                <th className="p-3.5">Destination & Dates</th>
                <th className="p-3.5">Total Cost (₹)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Toggle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141413]/8">
              {bookings.map((bk) => (
                <tr key={bk.bookingId}>
                  <td className="p-3.5 font-mono font-bold text-[#0F5257]">{bk.bookingId}</td>
                  <td className="p-3.5">
                    {bk.travelerName}
                    <span className="block text-[11px] text-[#5C5852]">{bk.travelerPhone}</span>
                  </td>
                  <td className="p-3.5">
                    <strong>{bk.destinationName}</strong> ({bk.startDate} to {bk.endDate})
                  </td>
                  <td className="p-3.5 font-mono font-bold">
                    {formatINR(bk.costBreakdown.totalCost)}
                  </td>
                  <td className="p-3.5 font-semibold">{bk.status}</td>
                  <td className="p-3.5 text-right">
                    <select
                      value={bk.status}
                      onChange={(e) => {
                        const updated = bookings.map((item) =>
                          item.bookingId === bk.bookingId
                            ? { ...item, status: e.target.value as DemoBooking['status'] }
                            : item
                        );
                        onUpdateBookings(updated);
                      }}
                      className="h-8 px-2 rounded bg-[#FAF9F6] border border-[#141413]/15 text-xs"
                    >
                      <option value="Confirmed (Demo)">Confirmed (Demo)</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

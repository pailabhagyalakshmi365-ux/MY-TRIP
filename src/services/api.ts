import { INITIAL_DESTINATIONS } from '../data/destinationsData';
import {
  INITIAL_GUIDES,
  INITIAL_HOTELS,
  INITIAL_TICKETS,
  INITIAL_TRANSPORTS,
} from '../data/servicesData';
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

/**
 * Cleanly separated API Integration Layer.
 * Connects to backend Express REST endpoints (/api/*) and synchronizes with structured local state.
 * Real external hotel, flight, IRCTC rail, or ASI monument APIs can be plugged in here later.
 */
const STORAGE_KEYS = {
  destinations: 'itp_destinations_v1',
  hotels: 'itp_hotels_v1',
  tickets: 'itp_tickets_v1',
  transports: 'itp_transports_v1',
  guides: 'itp_guides_v1',
  bookings: 'itp_bookings_v1',
  itineraries: 'itp_itineraries_v1',
  savedDestIds: 'itp_saved_dest_ids_v1',
  savedHotelIds: 'itp_saved_hotel_ids_v1',
  user: 'itp_current_user_v1',
  allUsers: 'itp_all_users_v1',
};

const DEFAULT_DEMO_BOOKINGS: DemoBooking[] = [
  {
    bookingId: 'ITP-2026-48102',
    createdAt: '2026-08-14',
    status: 'Completed',
    destinationId: 'tirupati',
    destinationName: 'Tirupati',
    startDate: '2026-08-20',
    endDate: '2026-08-22',
    daysCount: 3,
    adults: 2,
    children: 1,
    budgetTier: 'Standard',
    selectedHotel: INITIAL_HOTELS[3],
    hotelNights: 2,
    selectedTransport: INITIAL_TRANSPORTS[7],
    selectedTickets: [
      {
        ticket: INITIAL_TICKETS[5],
        date: '2026-08-21',
        adults: 2,
        children: 1,
        totalPrice: 650,
      },
    ],
    selectedGuide: {
      guide: INITIAL_GUIDES[2],
      bookingUnit: 'days',
      count: 1,
      date: '2026-08-21',
      totalCost: 3800,
    },
    costBreakdown: {
      transportation: 4200,
      hotel: 4800,
      food: 3900,
      attractionTickets: 650,
      guide: 3800,
      localTransportation: 1350,
      otherExpenses: 1000,
      totalCost: 19700,
      costPerPerson: 6567,
      dailyAverage: 6567,
    },
    travelerName: 'Ananya Sharma',
    travelerEmail: 'ananya.traveler@example.in',
    travelerPhone: '+91 98480 22334',
  },
];

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Ananya Sharma',
    email: 'ananya.traveler@example.in',
    phone: '+91 98480 22334',
    homeCity: 'Hyderabad',
    preferredLanguage: 'en',
    role: 'traveler',
    joinedDate: '2026-01-15',
  },
  {
    id: 'usr-admin',
    name: 'Kiran Kumar Reddy (Admin)',
    email: 'admin@indiatripplanner.in',
    phone: '+91 90001 11223',
    homeCity: 'Visakhapatnam',
    preferredLanguage: 'te',
    role: 'admin',
    joinedDate: '2025-11-01',
  },
];

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore storage quota errors
  }
}

export const TravelApiService = {
  async loadInitialPlatformData() {
    // Attempt backend API sync first, fallback cleanly to structured local state
    try {
      const res = await fetch('/api/platform-data');
      if (res.ok) {
        const payload = await res.json();
        if (payload?.destinations?.length) {
          return {
            destinations: readLocal<Destination[]>(STORAGE_KEYS.destinations, payload.destinations),
            hotels: readLocal<Hotel[]>(STORAGE_KEYS.hotels, payload.hotels),
            tickets: readLocal<TicketBookingOption[]>(STORAGE_KEYS.tickets, payload.tickets),
            transports: readLocal<TransportOption[]>(STORAGE_KEYS.transports, payload.transports),
            guides: readLocal<LocalGuide[]>(STORAGE_KEYS.guides, payload.guides),
          };
        }
      }
    } catch {
      // Offline or serverless preview mode fallback
    }

    return {
      destinations: readLocal<Destination[]>(STORAGE_KEYS.destinations, INITIAL_DESTINATIONS),
      hotels: readLocal<Hotel[]>(STORAGE_KEYS.hotels, INITIAL_HOTELS),
      tickets: readLocal<TicketBookingOption[]>(STORAGE_KEYS.tickets, INITIAL_TICKETS),
      transports: readLocal<TransportOption[]>(STORAGE_KEYS.transports, INITIAL_TRANSPORTS),
      guides: readLocal<LocalGuide[]>(STORAGE_KEYS.guides, INITIAL_GUIDES),
    };
  },

  saveDestinations(list: Destination[]) {
    writeLocal(STORAGE_KEYS.destinations, list);
  },

  saveHotels(list: Hotel[]) {
    writeLocal(STORAGE_KEYS.hotels, list);
  },

  saveTickets(list: TicketBookingOption[]) {
    writeLocal(STORAGE_KEYS.tickets, list);
  },

  saveTransports(list: TransportOption[]) {
    writeLocal(STORAGE_KEYS.transports, list);
  },

  saveGuides(list: LocalGuide[]) {
    writeLocal(STORAGE_KEYS.guides, list);
  },

  getBookings(): DemoBooking[] {
    return readLocal<DemoBooking[]>(STORAGE_KEYS.bookings, DEFAULT_DEMO_BOOKINGS);
  },

  async createDemoBooking(booking: DemoBooking): Promise<DemoBooking> {
    const existing = TravelApiService.getBookings();
    const updated = [booking, ...existing];
    writeLocal(STORAGE_KEYS.bookings, updated);
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
    } catch {
      // Local persistence already succeeded
    }
    return booking;
  },

  updateBookings(list: DemoBooking[]) {
    writeLocal(STORAGE_KEYS.bookings, list);
  },

  getSavedItineraries(): SavedItinerary[] {
    return readLocal<SavedItinerary[]>(STORAGE_KEYS.itineraries, []);
  },

  saveItinerary(itinerary: SavedItinerary): SavedItinerary[] {
    const existing = TravelApiService.getSavedItineraries();
    const updated = [itinerary, ...existing];
    writeLocal(STORAGE_KEYS.itineraries, updated);
    return updated;
  },

  deleteItinerary(id: string): SavedItinerary[] {
    const updated = TravelApiService.getSavedItineraries().filter((item) => item.id !== id);
    writeLocal(STORAGE_KEYS.itineraries, updated);
    return updated;
  },

  getSavedDestinationIds(): string[] {
    return readLocal<string[]>(STORAGE_KEYS.savedDestIds, ['hyderabad', 'tirupati', 'kerala']);
  },

  toggleSavedDestination(id: string): string[] {
    const current = TravelApiService.getSavedDestinationIds();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    writeLocal(STORAGE_KEYS.savedDestIds, next);
    return next;
  },

  getSavedHotelIds(): string[] {
    return readLocal<string[]>(STORAGE_KEYS.savedHotelIds, ['ht-hyd-1', 'ht-ker-1']);
  },

  toggleSavedHotel(id: string): string[] {
    const current = TravelApiService.getSavedHotelIds();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    writeLocal(STORAGE_KEYS.savedHotelIds, next);
    return next;
  },

  getCurrentUser(): UserProfile | null {
    return readLocal<UserProfile | null>(STORAGE_KEYS.user, DEFAULT_USERS[0]);
  },

  setCurrentUser(user: UserProfile | null) {
    writeLocal(STORAGE_KEYS.user, user);
  },

  getAllUsers(): UserProfile[] {
    return readLocal<UserProfile[]>(STORAGE_KEYS.allUsers, DEFAULT_USERS);
  },

  saveAllUsers(users: UserProfile[]) {
    writeLocal(STORAGE_KEYS.allUsers, users);
  },
};

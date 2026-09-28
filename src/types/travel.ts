export type Language = 'en' | 'te';

export type DestinationCategory =
  | 'Historical Places'
  | 'Temples'
  | 'Beaches'
  | 'Hill Stations'
  | 'Wildlife'
  | 'Adventure'
  | 'Nature'
  | 'Spiritual Places';

export type BudgetTier = 'Budget' | 'Standard' | 'Premium' | 'Luxury';
export type TravelType = 'Solo' | 'Couple' | 'Family' | 'Friends';
export type TransportMode = 'Flight' | 'Train' | 'Bus' | 'Car' | 'Local Taxi';

export interface FamousAttraction {
  id: string;
  name: string;
  nameTe?: string;
  type: 'Tourist Attraction' | 'Museum' | 'Monument' | 'Park' | 'Adventure Activity' | 'Event';
  openingHours: string;
  adultTicketPrice: number;
  childTicketPrice: number;
  description: string;
  timeRequired: string;
  coordinates: { x: number; y: number }; // Relative map coordinates (0-100)
}

export interface MapMarkerItem {
  id: string;
  name: string;
  category: 'Attraction' | 'Hotel' | 'Restaurant' | 'Nearby Place';
  detail: string;
  priceOrInfo: string;
  x: number; // 10 - 90
  y: number; // 10 - 90
}

export interface Destination {
  id: string;
  name: string;
  nameTe: string;
  state: string;
  stateTe: string;
  tagline: string;
  taglineTe: string;
  categories: DestinationCategory[];
  rating: number;
  reviewCount: number;
  heroImage: string;
  galleryImages: string[];
  description: string;
  descriptionTe: string;
  bestTimeToVisit: string;
  recommendedDays: number;
  weather: {
    tempRange: string;
    condition: string;
    humidity: string;
    seasonNote: string;
  };
  costs: {
    avgEntryTicket: number;
    localTransportPerDay: number;
    foodPerDay: number;
    hotelPerNight: number;
  };
  famousAttractions: FamousAttraction[];
  thingsToDo: string[];
  nearbyPlaces: {
    name: string;
    distanceKm: number;
    highlight: string;
  }[];
  mapCenterLabel: string;
  latLng: { lat: number; lng: number };
  mapMarkers: MapMarkerItem[];
}

export interface Hotel {
  id: string;
  destinationId: string;
  destinationName: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  hotelType: 'Heritage' | 'Luxury Resort' | 'Standard Hotel' | 'Budget Stay' | 'Boutique Homestay';
  roomType: string;
  estimatedPricePerNight: number;
  amenities: string[];
  breakfastIncluded: boolean;
  distanceFromCenterKm: number;
  nearestAttraction: string;
  image: string;
  description: string;
}

export interface TicketBookingOption {
  id: string;
  destinationId: string;
  destinationName: string;
  attractionName: string;
  category: 'Tourist Attractions' | 'Museums' | 'Monuments' | 'Parks' | 'Adventure Activities' | 'Events';
  openingHours: string;
  adultPrice: number;
  childPrice: number;
  duration: string;
  highlights: string;
}

export interface SelectedTicketItem {
  ticket: TicketBookingOption;
  date: string;
  adults: number;
  children: number;
  totalPrice: number;
}

export interface TransportOption {
  id: string;
  mode: 'Flights' | 'Trains' | 'Buses' | 'Rental Cars' | 'Local Taxis';
  operatorName: string;
  serviceCode: string;
  fromCity: string;
  toCity: string;
  destinationId: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  approximateFare: number;
  classOrVehicle: string;
  features: string[];
}

export interface LocalGuide {
  id: string;
  name: string;
  city: string;
  destinationId: string;
  languages: string[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  perHourPrice: number;
  perDayPrice: number;
  specialization: string[];
  availability: 'Available Today' | 'Available Next Week' | 'Limited Slots';
  bio: string;
  verifiedDemo: boolean;
  avatarUrl: string;
}

export interface SelectedGuideBooking {
  guide: LocalGuide;
  bookingUnit: 'hours' | 'days';
  count: number;
  date: string;
  totalCost: number;
}

export interface TripPlanFormInput {
  startingCity: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  travelType: TravelType;
  budget: BudgetTier;
  transportMode: TransportMode;
  hotelPreference: string;
  foodPreference: string;
  interests: string[];
}

export interface ItineraryDayPlan {
  dayNumber: number;
  dateLabel: string;
  title: string;
  arrivalOrMorning: string;
  hotelOrMidMorning: string;
  lunch: string;
  afternoonAttraction: string;
  eveningActivity: string;
  dinnerAndStay: string;
  estimatedDayCost: number;
}

export interface SavedItinerary {
  id: string;
  createdAt: string;
  input: TripPlanFormInput;
  destinationName: string;
  days: ItineraryDayPlan[];
  totalEstimatedCost: number;
}

export interface DemoBooking {
  bookingId: string;
  createdAt: string;
  status: 'Confirmed (Demo)' | 'Completed' | 'Cancelled';
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  adults: number;
  children: number;
  budgetTier: BudgetTier;
  selectedHotel: Hotel | null;
  hotelNights: number;
  selectedTransport: TransportOption | null;
  selectedTickets: SelectedTicketItem[];
  selectedGuide: SelectedGuideBooking | null;
  costBreakdown: {
    transportation: number;
    hotel: number;
    food: number;
    attractionTickets: number;
    guide: number;
    localTransportation: number;
    otherExpenses: number;
    totalCost: number;
    costPerPerson: number;
    dailyAverage: number;
  };
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  homeCity: string;
  preferredLanguage: Language;
  role: 'traveler' | 'admin';
  joinedDate: string;
}

import heroIndiaImg from '../assets/images/hero_india_travel_1790604553196.jpg';
import destHyderabadImg from '../assets/images/dest_hyderabad_heritage_1790604569694.jpg';
import destKeralaImg from '../assets/images/dest_kerala_backwaters_1790604584207.jpg';
import destJaipurAgraImg from '../assets/images/dest_jaipur_agra_royal_1790604597039.jpg';
import destKashmirImg from '../assets/images/dest_himalaya_kashmir_hills_1790604611901.jpg';
import { Language } from '../types/travel';

export const GENERATED_ASSETS = {
  heroIndia: heroIndiaImg,
  hyderabad: destHyderabadImg,
  kerala: destKeralaImg,
  jaipurAgra: destJaipurAgraImg,
  kashmirHills: destKashmirImg,
};

export function formatINR(amount: number): string {
  const rounded = Math.round(amount || 0);
  return '₹' + rounded.toLocaleString('en-IN');
}

/**
 * Generates a rich, multi-layered editorial travel SVG data URI for landmarks, hotels, and guides
 * so every visual slot is crisp, thematic, and resilient.
 */
export function createDestinationSceneSvg(
  title: string,
  subtitle: string,
  theme: 'temple' | 'palace' | 'beach' | 'hills' | 'fort' | 'ghat' | 'wildlife' | 'city'
): string {
  const palettes: Record<
    typeof theme,
    { skyTop: string; skyBot: string; sun: string; fg1: string; fg2: string; accent: string }
  > = {
    temple: {
      skyTop: '#2C1810',
      skyBot: '#D97736',
      sun: '#FBBF24',
      fg1: '#5C2D16',
      fg2: '#3B1B0C',
      accent: '#F59E0B',
    },
    palace: {
      skyTop: '#3A1D28',
      skyBot: '#E07A5F',
      sun: '#FDE68A',
      fg1: '#813429',
      fg2: '#4A1C17',
      accent: '#F4A261',
    },
    beach: {
      skyTop: '#0F4C5C',
      skyBot: '#E36414',
      sun: '#FBBF24',
      fg1: '#0A3641',
      fg2: '#051923',
      accent: '#38BDF8',
    },
    hills: {
      skyTop: '#1B4332',
      skyBot: '#74C69D',
      sun: '#FEF08A',
      fg1: '#2D6A4F',
      fg2: '#081C15',
      accent: '#A7F3D0',
    },
    fort: {
      skyTop: '#2B2D42',
      skyBot: '#D97706',
      sun: '#FDE047',
      fg1: '#5C3A21',
      fg2: '#2A1A10',
      accent: '#F59E0B',
    },
    ghat: {
      skyTop: '#1E1B4B',
      skyBot: '#EA580C',
      sun: '#FDBA74',
      fg1: '#431407',
      fg2: '#1C1917',
      accent: '#FB923C',
    },
    wildlife: {
      skyTop: '#143601',
      skyBot: '#73A942',
      sun: '#FDE047',
      fg1: '#245501',
      fg2: '#112A00',
      accent: '#AAD576',
    },
    city: {
      skyTop: '#0F172A',
      skyBot: '#475569',
      sun: '#FACC15',
      fg1: '#1E293B',
      fg2: '#090D16',
      accent: '#38BDF8',
    },
  };

  const p = palettes[theme];

  let silhouette = '';
  if (theme === 'temple') {
    silhouette = `
      <polygon points="360,110 440,110 475,360 325,360" fill="${p.fg1}" />
      <rect x="352" y="140" width="96" height="10" fill="${p.accent}" opacity="0.5" />
      <rect x="342" y="185" width="116" height="10" fill="${p.accent}" opacity="0.5" />
      <rect x="334" y="230" width="132" height="10" fill="${p.accent}" opacity="0.5" />
      <circle cx="400" cy="98" r="14" fill="${p.sun}" />
      <polygon points="180,200 230,200 250,360 160,360" fill="${p.fg2}" />
      <polygon points="550,190 600,190 620,360 530,360" fill="${p.fg2}" />
    `;
  } else if (theme === 'palace' || theme === 'fort') {
    silhouette = `
      <rect x="230" y="190" width="340" height="170" fill="${p.fg1}" />
      <circle cx="400" cy="175" r="55" fill="${p.fg1}" />
      <circle cx="285" cy="190" r="32" fill="${p.fg2}" />
      <circle cx="515" cy="190" r="32" fill="${p.fg2}" />
      <rect x="195" y="130" width="18" height="230" fill="${p.fg2}" />
      <rect x="587" y="130" width="18" height="230" fill="${p.fg2}" />
      <circle cx="400" cy="110" r="6" fill="${p.sun}" />
    `;
  } else if (theme === 'beach') {
    silhouette = `
      <path d="M0,330 Q220,300 450,335 T800,320 L800,450 L0,450 Z" fill="${p.fg1}" />
      <path d="M0,375 Q300,350 550,385 T800,370 L800,450 L0,450 Z" fill="${p.fg2}" />
      <path d="M140,360 Q165,230 210,165" stroke="${p.fg2}" stroke-width="10" fill="none" />
      <circle cx="210" cy="165" r="38" fill="${p.fg2}" opacity="0.85" />
    `;
  } else if (theme === 'hills' || theme === 'wildlife') {
    silhouette = `
      <polygon points="0,350 180,170 370,350" fill="${p.fg1}" opacity="0.85" />
      <polygon points="220,360 440,130 670,360" fill="${p.fg1}" />
      <polygon points="480,360 660,180 800,360" fill="${p.fg2}" />
      <polygon points="400,175 440,130 480,175 455,165 425,180" fill="#FFFFFF" opacity="0.7" />
    `;
  } else {
    silhouette = `
      <rect x="140" y="210" width="80" height="150" fill="${p.fg1}" />
      <rect x="240" y="160" width="110" height="200" fill="${p.fg2}" />
      <polygon points="295,115 350,160 240,160" fill="${p.fg1}" />
      <rect x="370" y="185" width="140" height="175" fill="${p.fg1}" />
      <circle cx="440" cy="185" r="42" fill="${p.fg2}" />
      <rect x="530" y="220" width="95" height="140" fill="${p.fg2}" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${p.skyTop}" />
        <stop offset="75%" stop-color="${p.skyBot}" />
        <stop offset="100%" stop-color="${p.fg2}" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#sky)" />
    <circle cx="620" cy="135" r="58" fill="${p.sun}" opacity="0.82" />
    <circle cx="620" cy="135" r="85" fill="${p.sun}" opacity="0.18" />
    ${silhouette}
    <rect x="0" y="355" width="800" height="145" fill="${p.fg2}" />
    <line x1="0" y1="355" x2="800" y2="355" stroke="${p.accent}" stroke-width="1.5" opacity="0.45" />
    <text x="44" y="425" fill="#FAF9F6" font-family="Georgia, serif" font-size="30" font-weight="bold">${title}</text>
    <text x="44" y="458" fill="${p.accent}" font-family="sans-serif" font-size="16" letter-spacing="1">${subtitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createGuideAvatarSvg(name: string, city: string, bgHex: string): string {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" rx="24" fill="${bgHex}" />
    <circle cx="100" cy="76" r="34" fill="#FAF9F6" opacity="0.22" />
    <path d="M42,178 C42,132 158,132 158,178" fill="#FAF9F6" opacity="0.22" />
    <text x="100" y="106" text-anchor="middle" fill="#FAF9F6" font-family="Georgia, serif" font-size="42" font-weight="bold">${initials}</text>
    <text x="100" y="178" text-anchor="middle" fill="#FAF9F6" font-family="sans-serif" font-size="13" opacity="0.85">${city}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const UI_TEXT: Record<Language, Record<string, string>> = {
  en: {
    brandName: 'India Trip Planner',
    heroTitle: 'Explore India. Plan Your Perfect Trip.',
    heroSubtitle:
      'Discover 20+ iconic Indian destinations, build custom day-by-day itineraries, compare estimated stays & transit, book monument tickets, and hire verified local guides — all in Indian Rupees (₹).',
    navDiscover: 'Destinations',
    navPlanner: 'Trip Planner',
    navStayTransit: 'Hotels & Transit',
    navTicketsGuides: 'Tickets & Guides',
    navCalculator: 'Cost & Summary',
    navMyTrips: 'My Trips',
    navAdmin: 'Admin',
    searchDestination: 'Destination',
    searchDate: 'Travel Date',
    searchTravelers: 'Travelers',
    searchBudget: 'Budget Tier',
    searchButton: 'Explore & Plan',
    globalSearchPlaceholder: 'Search cities, tourist places, hotels, guides, attractions, or activities...',
    popularDestinations: 'Popular Destinations Across India',
    categoriesLabel: 'Filter by Experience',
    bestTime: 'Best Time',
    recDays: 'Recommended',
    days: 'Days',
    entryCost: 'Avg Entry Ticket',
    hotelEstimate: 'Estimated Hotel / Night',
    viewDetails: 'View Details',
    planTripHere: 'Plan Trip',
    tripPlannerHeading: 'Custom Day-by-Day Trip Planner',
    generateItinerary: 'Generate Complete Itinerary',
    hotelsHeading: 'Curated Hotels & Stays',
    estimatedPriceNotice: 'Estimated price · Demo booking mode (No real payment charged)',
    ticketsHeading: 'Monument, Museum & Attraction Tickets',
    transportHeading: 'Intercity & Local Travel Transport',
    guidesHeading: 'Hire a Local Guide',
    costCalculatorHeading: 'Interactive Trip Cost Calculator',
    bookingSummaryHeading: 'Trip Booking Summary',
    confirmBookingBtn: 'Confirm Booking',
    demoBookingSuccess: 'Demo booking successful',
  },
  te: {
    brandName: 'ఇండియా ట్రిప్ ప్లానర్',
    heroTitle: 'భారతదేశాన్ని అన్వేషించండి. మీ పరిపూర్ణ యాత్రను ప్లాన్ చేసుకోండి.',
    heroSubtitle:
      'భారతదేశంలోని 20+ ప్రసిద్ధ పర్యాటక ప్రదేశాలను కనుగొనండి, రోజువారీ ప్రయాణ ప్రణాళికను రూపొందించండి, హోటళ్లు, టిక్కెట్లు, స్థానిక గైడ్‌లను బుక్ చేయండి మరియు మొత్తం ఖర్చును రూపాయలలో (₹) లెక్కించండి.',
    navDiscover: 'గమ్యస్థానాలు',
    navPlanner: 'ట్రిప్ ప్లానర్',
    navStayTransit: 'హోటళ్లు & రవాణా',
    navTicketsGuides: 'టిక్కెట్లు & గైడ్‌లు',
    navCalculator: 'ఖర్చు & సారాంశం',
    navMyTrips: 'నా యాత్రలు',
    navAdmin: 'అడ్మిన్',
    searchDestination: 'గమ్యస్థానం',
    searchDate: 'ప్రయాణ తేదీ',
    searchTravelers: 'ప్రయాణికులు',
    searchBudget: 'బడ్జెట్ రకం',
    searchButton: 'వెతకండి & ప్లాన్ చేయండి',
    globalSearchPlaceholder: 'నగరాలు, పర్యాటక ప్రదేశాలు, హోటళ్లు, గైడ్‌లు లేదా కార్యకలాపాలను వెతకండి...',
    popularDestinations: 'భారతదేశంలోని ప్రసిద్ధ పర్యాటక ప్రదేశాలు',
    categoriesLabel: 'వర్గాల వారీగా చూడండి',
    bestTime: 'ఉత్తమ సమయం',
    recDays: 'సిఫార్సు చేసిన రోజులు',
    days: 'రోజులు',
    entryCost: 'సగటు ప్రవేశ టిక్కెట్',
    hotelEstimate: 'అంచనా హోటల్ / రాత్రికి',
    viewDetails: 'వివరాలు చూడండి',
    planTripHere: 'యాత్ర ప్లాన్ చేయండి',
    tripPlannerHeading: 'రోజువారీ ట్రిప్ ప్లానర్',
    generateItinerary: 'ప్రయాణ ప్రణాళికను రూపొందించండి',
    hotelsHeading: 'హోటళ్లు & వసతి శోధన',
    estimatedPriceNotice: 'అంచనా ధర · డెమో బుకింగ్ మోడ్ మాత్రమే',
    ticketsHeading: 'పర్యాటక ప్రదేశాలు & మ్యూజియం టిక్కెట్లు',
    transportHeading: 'విమానాలు, రైళ్లు, బస్సులు & కార్ల రవాణా',
    guidesHeading: 'స్థానిక గైడ్‌ను నియమించుకోండి',
    costCalculatorHeading: 'మొత్తం యాత్ర ఖర్చు లెక్కింపు',
    bookingSummaryHeading: 'బుకింగ్ సారాంశం',
    confirmBookingBtn: 'బుకింగ్ నిర్ధారించండి',
    demoBookingSuccess: 'డెమో బుకింగ్ విజయవంతమైంది (Demo booking successful)',
  },
};

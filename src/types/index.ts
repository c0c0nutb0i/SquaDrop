export type TabType = 'swipe' | 'hub' | 'huddle' | 'split';

export type MemberStatus = 'Confirmed' | 'On the way' | 'Running Late' | 'Deciding';

export interface SquadMember {
  id: string;
  name: string;
  role?: string;
  avatar: string;
  initials: string;
  status: MemberStatus;
  statusNote: string;
  isHost?: boolean;
  inHuddle: boolean;
  huddleRole?: string;
  huddleState?: 'speaking' | 'listening' | 'driving';
  owesOrGets: number; // positive = gets back, negative = owes
  paidUpfront?: number;
  isSettled?: boolean;
}

export interface VenueCard {
  id: string;
  name: string;
  shortName: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
  area: string;
  openUntil: string;
  description: string;
  tags: string[];
  image: string;
  swipedRightBy: string[]; // member names
  priceForTwo: number;
  votesCount: number;
  matched?: boolean;
  cuisineCategory: string;
}

export interface ItineraryStop {
  id: string;
  stepNumber: number;
  time: string;
  duration: string;
  venueName: string;
  address: string;
  reservationTag: string;
  reservationNotes: string;
  walkingMinutes: number;
  isLocked: boolean;
  tableNumber?: string;
  mapQuery: string;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  splitType: 'all' | 'subset' | 'custom';
  assignedMemberIds: string[];
  isUserIncluded: boolean;
  customBreakdownText?: string;
}

export interface ScannedReceipt {
  id: string;
  venueName: string;
  category: 'Primary' | 'Activity' | 'Food' | 'Drinks';
  amount: number;
  ocrConfidence: string;
  verified: boolean;
  time: string;
}

export interface VenueDetailData {
  venue: VenueCard;
  totalBill: number;
  taxAndService: number;
  taxLabel: string;
  items: BillItem[];
  receipts: ScannedReceipt[];
  itinerary: ItineraryStop[];
  areaContext: {
    neighborhood: string;
    subtext: string;
    trafficStatus: string;
    coordinates: string;
    weather: string;
    walkability: string;
    transitInfo: string;
    walkingNote: string;
  };
  squadBalances: {
    hostPaidUpfront: number;
    hostGetsBack: number;
    userOwes: number;
    ananyaOwes: number;
    rohanOwes: number;
    priyaPaid: number;
  };
}

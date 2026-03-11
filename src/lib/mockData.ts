export interface Flight {
  id: string;
  airline: string;
  flightNo: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  originalPrice: number;
  seatsAvailable: number;
  totalSeats: number;
  aircraft: string;
  stops: number;
  score: number; // AI recommendation score
}

export interface Booking {
  id: string;
  flight: Flight;
  passenger: string;
  seat: string;
  date: string;
  status: "confirmed" | "cancelled" | "pending";
  pnr: string;
}

export const airports = [
  { code: "JFK", city: "New York", country: "USA" },
  { code: "LAX", city: "Los Angeles", country: "USA" },
  { code: "LHR", city: "London", country: "UK" },
  { code: "DXB", city: "Dubai", country: "UAE" },
  { code: "SIN", city: "Singapore", country: "Singapore" },
  { code: "HND", city: "Tokyo", country: "Japan" },
  { code: "CDG", city: "Paris", country: "France" },
  { code: "SYD", city: "Sydney", country: "Australia" },
];

export const mockFlights: Flight[] = [
  {
    id: "FL001",
    airline: "SkyWave Airlines",
    flightNo: "SW-1247",
    from: "New York",
    fromCode: "JFK",
    to: "London",
    toCode: "LHR",
    departTime: "08:30",
    arriveTime: "20:45",
    duration: "7h 15m",
    price: 489,
    originalPrice: 650,
    seatsAvailable: 42,
    totalSeats: 180,
    aircraft: "Boeing 787",
    stops: 0,
    score: 95,
  },
  {
    id: "FL002",
    airline: "AeroNova",
    flightNo: "AN-0892",
    from: "New York",
    fromCode: "JFK",
    to: "London",
    toCode: "LHR",
    departTime: "14:00",
    arriveTime: "02:30",
    duration: "7h 30m",
    price: 425,
    originalPrice: 525,
    seatsAvailable: 78,
    totalSeats: 220,
    aircraft: "Airbus A350",
    stops: 0,
    score: 88,
  },
  {
    id: "FL003",
    airline: "Horizon Air",
    flightNo: "HA-3310",
    from: "New York",
    fromCode: "JFK",
    to: "London",
    toCode: "LHR",
    departTime: "22:15",
    arriveTime: "10:50",
    duration: "7h 35m",
    price: 372,
    originalPrice: 480,
    seatsAvailable: 15,
    totalSeats: 160,
    aircraft: "Boeing 777",
    stops: 0,
    score: 82,
  },
  {
    id: "FL004",
    airline: "SkyWave Airlines",
    flightNo: "SW-2105",
    from: "New York",
    fromCode: "JFK",
    to: "London",
    toCode: "LHR",
    departTime: "11:45",
    arriveTime: "01:20",
    duration: "8h 35m",
    price: 315,
    originalPrice: 415,
    seatsAvailable: 95,
    totalSeats: 200,
    aircraft: "Airbus A330",
    stops: 1,
    score: 74,
  },
  {
    id: "FL005",
    airline: "AeroNova",
    flightNo: "AN-5567",
    from: "New York",
    fromCode: "JFK",
    to: "London",
    toCode: "LHR",
    departTime: "06:00",
    arriveTime: "19:10",
    duration: "8h 10m",
    price: 540,
    originalPrice: 540,
    seatsAvailable: 8,
    totalSeats: 180,
    aircraft: "Boeing 787",
    stops: 0,
    score: 70,
  },
];

export const seatMap = {
  rows: 30,
  seatsPerRow: ["A", "B", "C", "D", "E", "F"],
  bookedSeats: [
    "1A", "1B", "1C", "2D", "2E", "3A", "3F", "4B", "4C", "5A", "5D",
    "6E", "6F", "7A", "7B", "8C", "8D", "9E", "10A", "10B", "10F",
    "11C", "12A", "12D", "13B", "14E", "14F", "15A", "15C",
  ],
  premiumRows: [1, 2, 3, 4, 5],
  exitRows: [12, 13],
};

export const mockBookings: Booking[] = [
  {
    id: "BK001",
    flight: mockFlights[0],
    passenger: "John Doe",
    seat: "14A",
    date: "2026-04-15",
    status: "confirmed",
    pnr: "XK7M2P",
  },
];

export const adminStats = {
  totalBookings: 1247,
  totalRevenue: 589420,
  occupancyRate: 78.5,
  popularRoutes: [
    { route: "JFK → LHR", bookings: 342, revenue: 167580 },
    { route: "LAX → HND", bookings: 278, revenue: 195460 },
    { route: "SIN → SYD", bookings: 215, revenue: 98900 },
    { route: "CDG → DXB", bookings: 198, revenue: 89100 },
    { route: "LHR → JFK", bookings: 214, revenue: 104860 },
  ],
  monthlyBookings: [
    { month: "Jan", bookings: 89, revenue: 42300 },
    { month: "Feb", bookings: 102, revenue: 48960 },
    { month: "Mar", bookings: 134, revenue: 63280 },
    { month: "Apr", bookings: 156, revenue: 74880 },
    { month: "May", bookings: 178, revenue: 85440 },
    { month: "Jun", bookings: 198, revenue: 95040 },
    { month: "Jul", bookings: 210, revenue: 100800 },
    { month: "Aug", bookings: 180, revenue: 86400 },
  ],
  recentBookings: [
    { pnr: "XK7M2P", passenger: "John Doe", route: "JFK → LHR", amount: 489, status: "confirmed" as const },
    { pnr: "BN3K9L", passenger: "Sarah Kim", route: "LAX → HND", amount: 712, status: "confirmed" as const },
    { pnr: "QW8R5T", passenger: "Mike Chen", route: "SIN → SYD", amount: 385, status: "pending" as const },
    { pnr: "YP2M7H", passenger: "Emma Wilson", route: "CDG → DXB", amount: 456, status: "confirmed" as const },
    { pnr: "ZL6N4V", passenger: "Alex Brown", route: "LHR → JFK", amount: 510, status: "cancelled" as const },
  ],
};

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
  score: number;
}

export interface Passenger {
  name: string;
  email: string;
  seat: string;
}

export interface Booking {
  id: string;
  flight: Flight;
  passenger: string;
  passengers: Passenger[];
  seat: string;
  date: string;
  status: "confirmed" | "cancelled" | "pending";
  pnr: string;
  totalPassengers: number;
}

export const airports = [
  { code: "MAA", city: "Chennai", country: "India" },
  { code: "CJB", city: "Coimbatore", country: "India" },
  { code: "BOM", city: "Mumbai", country: "India" },
  { code: "DEL", city: "Delhi", country: "India" },
  { code: "BLR", city: "Bengaluru", country: "India" },
  { code: "HYD", city: "Hyderabad", country: "India" },
  { code: "CCU", city: "Kolkata", country: "India" },
  { code: "GOI", city: "Goa", country: "India" },
  { code: "JFK", city: "New York", country: "USA" },
  { code: "LAX", city: "Los Angeles", country: "USA" },
  { code: "LHR", city: "London", country: "UK" },
  { code: "DXB", city: "Dubai", country: "UAE" },
  { code: "SIN", city: "Singapore", country: "Singapore" },
];

export const mockFlights: Flight[] = [
  {
    id: "FL001",
    airline: "IndiGo",
    flightNo: "6E-2041",
    from: "Chennai",
    fromCode: "MAA",
    to: "Coimbatore",
    toCode: "CJB",
    departTime: "06:15",
    arriveTime: "07:30",
    duration: "1h 15m",
    price: 2450,
    originalPrice: 3200,
    seatsAvailable: 42,
    totalSeats: 180,
    aircraft: "Airbus A320",
    stops: 0,
    score: 95,
  },
  {
    id: "FL002",
    airline: "Air India",
    flightNo: "AI-0543",
    from: "Chennai",
    fromCode: "MAA",
    to: "Coimbatore",
    toCode: "CJB",
    departTime: "10:30",
    arriveTime: "11:50",
    duration: "1h 20m",
    price: 2890,
    originalPrice: 3500,
    seatsAvailable: 78,
    totalSeats: 220,
    aircraft: "Boeing 737",
    stops: 0,
    score: 88,
  },
  {
    id: "FL003",
    airline: "SpiceJet",
    flightNo: "SG-1122",
    from: "Mumbai",
    fromCode: "BOM",
    to: "Delhi",
    toCode: "DEL",
    departTime: "08:00",
    arriveTime: "10:10",
    duration: "2h 10m",
    price: 3750,
    originalPrice: 4800,
    seatsAvailable: 15,
    totalSeats: 160,
    aircraft: "Boeing 737 MAX",
    stops: 0,
    score: 82,
  },
  {
    id: "FL004",
    airline: "Vistara",
    flightNo: "UK-0815",
    from: "Mumbai",
    fromCode: "BOM",
    to: "Delhi",
    toCode: "DEL",
    departTime: "14:45",
    arriveTime: "17:00",
    duration: "2h 15m",
    price: 4200,
    originalPrice: 5100,
    seatsAvailable: 95,
    totalSeats: 200,
    aircraft: "Airbus A320neo",
    stops: 0,
    score: 90,
  },
  {
    id: "FL005",
    airline: "IndiGo",
    flightNo: "6E-5567",
    from: "Delhi",
    fromCode: "DEL",
    to: "Bengaluru",
    toCode: "BLR",
    departTime: "06:00",
    arriveTime: "08:45",
    duration: "2h 45m",
    price: 3980,
    originalPrice: 4500,
    seatsAvailable: 8,
    totalSeats: 180,
    aircraft: "Airbus A321",
    stops: 0,
    score: 70,
  },
  {
    id: "FL006",
    airline: "Air India",
    flightNo: "AI-0872",
    from: "Bengaluru",
    fromCode: "BLR",
    to: "Hyderabad",
    toCode: "HYD",
    departTime: "09:30",
    arriveTime: "10:45",
    duration: "1h 15m",
    price: 2100,
    originalPrice: 2800,
    seatsAvailable: 55,
    totalSeats: 180,
    aircraft: "Airbus A320",
    stops: 0,
    score: 92,
  },
  {
    id: "FL007",
    airline: "SpiceJet",
    flightNo: "SG-3345",
    from: "Kolkata",
    fromCode: "CCU",
    to: "Goa",
    toCode: "GOI",
    departTime: "12:00",
    arriveTime: "15:10",
    duration: "3h 10m",
    price: 4550,
    originalPrice: 5200,
    seatsAvailable: 30,
    totalSeats: 180,
    aircraft: "Boeing 737",
    stops: 1,
    score: 74,
  },
  {
    id: "FL008",
    airline: "Vistara",
    flightNo: "UK-1190",
    from: "Chennai",
    fromCode: "MAA",
    to: "Delhi",
    toCode: "DEL",
    departTime: "16:00",
    arriveTime: "18:45",
    duration: "2h 45m",
    price: 5200,
    originalPrice: 6800,
    seatsAvailable: 22,
    totalSeats: 200,
    aircraft: "Boeing 787",
    stops: 0,
    score: 85,
  },
  {
    id: "FL009",
    airline: "IndiGo",
    flightNo: "6E-7788",
    from: "Mumbai",
    fromCode: "BOM",
    to: "Goa",
    toCode: "GOI",
    departTime: "07:15",
    arriveTime: "08:25",
    duration: "1h 10m",
    price: 1950,
    originalPrice: 2400,
    seatsAvailable: 65,
    totalSeats: 180,
    aircraft: "Airbus A320",
    stops: 0,
    score: 96,
  },
  {
    id: "FL010",
    airline: "Air India",
    flightNo: "AI-0310",
    from: "Delhi",
    fromCode: "DEL",
    to: "Mumbai",
    toCode: "BOM",
    departTime: "20:30",
    arriveTime: "22:45",
    duration: "2h 15m",
    price: 3600,
    originalPrice: 4200,
    seatsAvailable: 40,
    totalSeats: 220,
    aircraft: "Airbus A330",
    stops: 0,
    score: 87,
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
    passenger: "Rahul Sharma",
    passengers: [{ name: "Rahul Sharma", email: "rahul@email.com", seat: "14A" }],
    seat: "14A",
    date: "2026-04-15",
    status: "confirmed",
    pnr: "XK7M2P",
    totalPassengers: 1,
  },
];

export const adminStats = {
  totalBookings: 1247,
  totalRevenue: 4895420,
  occupancyRate: 78.5,
  popularRoutes: [
    { route: "MAA → CJB", bookings: 342, revenue: 837900 },
    { route: "BOM → DEL", bookings: 278, revenue: 1042200 },
    { route: "DEL → BLR", bookings: 215, revenue: 855700 },
    { route: "BLR → HYD", bookings: 198, revenue: 415800 },
    { route: "BOM → GOI", bookings: 214, revenue: 417300 },
  ],
  monthlyBookings: [
    { month: "Jan", bookings: 89, revenue: 352300 },
    { month: "Feb", bookings: 102, revenue: 408960 },
    { month: "Mar", bookings: 134, revenue: 533280 },
    { month: "Apr", bookings: 156, revenue: 624880 },
    { month: "May", bookings: 178, revenue: 715440 },
    { month: "Jun", bookings: 198, revenue: 795040 },
    { month: "Jul", bookings: 210, revenue: 840800 },
    { month: "Aug", bookings: 180, revenue: 726400 },
  ],
  recentBookings: [
    { pnr: "XK7M2P", passenger: "Rahul Sharma", route: "MAA → CJB", amount: 2450, status: "confirmed" as const },
    { pnr: "BN3K9L", passenger: "Priya Nair", route: "BOM → DEL", amount: 3750, status: "confirmed" as const },
    { pnr: "QW8R5T", passenger: "Amit Patel", route: "DEL → BLR", amount: 3980, status: "pending" as const },
    { pnr: "YP2M7H", passenger: "Sneha Iyer", route: "BLR → HYD", amount: 2100, status: "confirmed" as const },
    { pnr: "ZL6N4V", passenger: "Vikram Singh", route: "BOM → GOI", amount: 1950, status: "cancelled" as const },
  ],
};

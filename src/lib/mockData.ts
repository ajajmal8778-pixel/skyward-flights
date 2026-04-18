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

// Route definitions: [fromCode, toCode, basePrice, baseDurationMin, stops]
const routeDefs: Array<[string, string, number, number, number]> = [
  ["MAA", "CJB", 2400, 75, 0],
  ["CJB", "MAA", 2350, 80, 0],
  ["MAA", "BLR", 2800, 70, 0],
  ["BLR", "MAA", 2750, 70, 0],
  ["MAA", "DEL", 5200, 165, 0],
  ["DEL", "MAA", 5100, 170, 0],
  ["MAA", "BOM", 4200, 130, 0],
  ["BOM", "MAA", 4150, 130, 0],
  ["MAA", "HYD", 2900, 80, 0],
  ["HYD", "MAA", 2850, 80, 0],
  ["BOM", "DEL", 3800, 130, 0],
  ["DEL", "BOM", 3750, 135, 0],
  ["BOM", "GOI", 1950, 70, 0],
  ["GOI", "BOM", 1900, 70, 0],
  ["BOM", "BLR", 3100, 95, 0],
  ["BLR", "BOM", 3050, 95, 0],
  ["DEL", "BLR", 4000, 165, 0],
  ["BLR", "DEL", 3950, 170, 0],
  ["DEL", "HYD", 3500, 140, 0],
  ["HYD", "DEL", 3450, 140, 0],
  ["DEL", "CCU", 4100, 130, 0],
  ["CCU", "DEL", 4050, 135, 0],
  ["BLR", "HYD", 2100, 75, 0],
  ["HYD", "BLR", 2050, 75, 0],
  ["BLR", "GOI", 2400, 75, 0],
  ["GOI", "BLR", 2350, 75, 0],
  ["CCU", "GOI", 4500, 190, 1],
  ["GOI", "CCU", 4450, 195, 1],
  ["CCU", "BOM", 4200, 155, 0],
  ["BOM", "CCU", 4150, 155, 0],
  ["MAA", "DXB", 18500, 260, 0],
  ["DXB", "MAA", 18000, 270, 0],
  ["BOM", "DXB", 16500, 200, 0],
  ["DXB", "BOM", 16000, 205, 0],
  ["DEL", "DXB", 17800, 220, 0],
  ["DXB", "DEL", 17500, 220, 0],
  ["DEL", "LHR", 42000, 540, 0],
  ["LHR", "DEL", 41000, 545, 0],
  ["BOM", "SIN", 28000, 340, 0],
  ["SIN", "BOM", 27500, 345, 0],
  ["DEL", "JFK", 65000, 900, 1],
  ["JFK", "DEL", 64000, 905, 1],
  ["BOM", "LHR", 45000, 555, 0],
  ["LHR", "BOM", 44000, 560, 0],
];

const airlinesPool = [
  { name: "IndiGo", prefix: "6E", aircraft: ["Airbus A320", "Airbus A321", "ATR 72"] },
  { name: "Air India", prefix: "AI", aircraft: ["Boeing 787", "Airbus A320", "Airbus A350"] },
  { name: "Vistara", prefix: "UK", aircraft: ["Airbus A320neo", "Boeing 787-9"] },
  { name: "SpiceJet", prefix: "SG", aircraft: ["Boeing 737 MAX", "Boeing 737"] },
  { name: "Akasa Air", prefix: "QP", aircraft: ["Boeing 737 MAX 8"] },
  { name: "Emirates", prefix: "EK", aircraft: ["Boeing 777", "Airbus A380"] },
  { name: "Singapore Airlines", prefix: "SQ", aircraft: ["Boeing 787", "Airbus A350"] },
  { name: "British Airways", prefix: "BA", aircraft: ["Boeing 777", "Airbus A350"] },
];

const departSlots = ["05:30", "06:15", "07:45", "09:00", "10:30", "12:15", "14:00", "15:45", "17:30", "19:00", "20:30", "22:15"];

const cityByCode = Object.fromEntries(airports.map((a) => [a.code, a.city]));

const addMinutes = (time: string, min: number): string => {
  const [h, m] = time.split(":").map(Number);
  const total = (h * 60 + m + min) % (24 * 60);
  const hh = Math.floor(total / 60).toString().padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

const formatDuration = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

// Seeded pseudo-random for deterministic flights
const seededRand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateFlights = (): Flight[] => {
  const flights: Flight[] = [];
  let seed = 1;
  routeDefs.forEach(([fromCode, toCode, basePrice, baseDur, stops], routeIdx) => {
    // Decide how many flights for this route (1-3)
    const isInternational = basePrice > 10000;
    const count = isInternational ? 1 + Math.floor(seededRand(seed++) * 2) : 2 + Math.floor(seededRand(seed++) * 2);
    for (let i = 0; i < count; i++) {
      const airline = airlinesPool[Math.floor(seededRand(seed++) * (isInternational ? airlinesPool.length : 5))];
      const aircraft = airline.aircraft[Math.floor(seededRand(seed++) * airline.aircraft.length)];
      const slotIdx = (routeIdx * 3 + i * 4) % departSlots.length;
      const depart = departSlots[slotIdx];
      const durVariance = Math.floor(seededRand(seed++) * 30) - 10;
      const dur = baseDur + durVariance;
      const priceVariance = Math.floor(seededRand(seed++) * basePrice * 0.3) - basePrice * 0.1;
      const price = Math.round((basePrice + priceVariance) / 50) * 50;
      const seatsAvailable = 5 + Math.floor(seededRand(seed++) * 95);
      const totalSeats = aircraft.includes("A380") ? 500 : aircraft.includes("777") || aircraft.includes("787") ? 280 : aircraft.includes("ATR") ? 70 : 180;
      const score = Math.round(60 + seededRand(seed++) * 40);
      const flightNoNum = Math.floor(seededRand(seed++) * 9000) + 1000;
      flights.push({
        id: `FL${(flights.length + 1).toString().padStart(3, "0")}`,
        airline: airline.name,
        flightNo: `${airline.prefix}-${flightNoNum}`,
        from: cityByCode[fromCode] || fromCode,
        fromCode,
        to: cityByCode[toCode] || toCode,
        toCode,
        departTime: depart,
        arriveTime: addMinutes(depart, dur),
        duration: formatDuration(dur),
        price: Math.max(price, Math.round(basePrice * 0.7)),
        originalPrice: Math.round(price * 1.25),
        seatsAvailable,
        totalSeats,
        aircraft,
        stops,
        score,
      });
    }
  });
  return flights;
};

export const mockFlights: Flight[] = generateFlights();

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

import { mockFlights, type Flight } from "./mockData";
import { bucketOf, type SearchEntry, type BookingHistoryEntry, type TimeBucket } from "./historyStore";

export interface Recommendation {
  flight: Flight;
  score: number;
  reasons: string[];
}

const tally = <T extends string>(arr: T[]): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const a of arr) out[a] = (out[a] || 0) + 1;
  return out;
};

const topKey = (counts: Record<string, number>): string | null => {
  let best: string | null = null;
  let max = 0;
  for (const [k, v] of Object.entries(counts)) {
    if (v > max) { max = v; best = k; }
  }
  return best;
};

export function getRecommendations(
  searches: SearchEntry[],
  bookings: BookingHistoryEntry[],
  limit = 6
): Recommendation[] {
  const airlineCounts = tally(bookings.map((b) => b.airline));
  const routeCounts = tally([
    ...bookings.map((b) => `${b.fromCode}-${b.toCode}`),
    ...searches.map((s) => `${s.from}-${s.to}`),
  ]);
  const fromCounts = tally([
    ...bookings.map((b) => b.fromCode),
    ...searches.map((s) => s.from),
  ]);
  const timeCounts = tally(bookings.map((b) => bucketOf(b.departTime))) as Record<TimeBucket, number>;

  const preferredAirline = topKey(airlineCounts);
  const preferredFrom = topKey(fromCounts);
  const preferredTime = topKey(timeCounts) as TimeBucket | null;

  // Min price per route (for "cheapest" reason)
  const minPriceByRoute: Record<string, number> = {};
  for (const f of mockFlights) {
    const k = `${f.fromCode}-${f.toCode}`;
    if (minPriceByRoute[k] === undefined || f.price < minPriceByRoute[k]) {
      minPriceByRoute[k] = f.price;
    }
  }

  const recs: Recommendation[] = mockFlights.map((f) => {
    const reasons: string[] = [];
    let score = f.score * 0.5; // base AI score

    const routeKey = `${f.fromCode}-${f.toCode}`;
    if (routeCounts[routeKey]) {
      score += 25 * Math.min(routeCounts[routeKey], 3);
      reasons.push("Matches a route you searched");
    } else if (preferredFrom && f.fromCode === preferredFrom) {
      score += 8;
      reasons.push(`Departs from ${preferredFrom}`);
    }

    if (preferredAirline && f.airline === preferredAirline) {
      score += 18;
      reasons.push(`You prefer ${preferredAirline}`);
    }

    if (preferredTime && bucketOf(f.departTime) === preferredTime) {
      score += 10;
      reasons.push(`Matches your ${preferredTime} travel`);
    }

    if (minPriceByRoute[routeKey] === f.price && routeCounts[routeKey]) {
      score += 22;
      reasons.push("Cheapest on this route");
    }

    // Discount boost
    const discount = (f.originalPrice - f.price) / f.originalPrice;
    if (discount > 0.15) {
      score += discount * 30;
      reasons.push(`${Math.round(discount * 100)}% AI price drop`);
    }

    return { flight: f, score, reasons };
  });

  // No history fallback: cheapest popular flights
  if (bookings.length === 0 && searches.length === 0) {
    const popularFroms = ["MAA", "BOM", "DEL", "BLR"];
    return mockFlights
      .filter((f) => popularFroms.includes(f.fromCode))
      .sort((a, b) => a.price - b.price)
      .slice(0, limit)
      .map((f) => ({
        flight: f,
        score: f.score,
        reasons: ["Popular cheap deal"],
      }));
  }

  return recs
    .filter((r) => r.reasons.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

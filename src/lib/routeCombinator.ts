import { mockFlights, type Flight } from "./mockData";

export interface ComboRoute {
  legs: Flight[];
  totalPrice: number;
  directPrice: number | null;
  savings: number;
  hubs: string[];
  totalDurationMin: number;
}

const parseTimeToMin = (t: string): number => {
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ampm = m[3]?.toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + min;
};

const parseDurationMin = (d: string): number => {
  const h = parseInt(d.match(/(\d+)h/)?.[1] || "0");
  const m = parseInt(d.match(/(\d+)m/)?.[1] || "0");
  return h * 60 + m;
};

/**
 * Find connecting itineraries from `from` to `to` with up to 1 layover.
 * Returns combos cheaper than the cheapest direct flight on that route.
 */
export function findCheaperCombos(from: string, to: string, max = 3): ComboRoute[] {
  if (!from || !to || from === to) return [];

  const directs = mockFlights.filter((f) => f.fromCode === from && f.toCode === to);
  const directPrice = directs.length ? Math.min(...directs.map((f) => f.price)) : null;

  const firstLegs = mockFlights.filter((f) => f.fromCode === from && f.toCode !== to);
  const combos: ComboRoute[] = [];

  for (const a of firstLegs) {
    const seconds = mockFlights.filter(
      (f) => f.fromCode === a.toCode && f.toCode === to && f.id !== a.id
    );
    for (const b of seconds) {
      // ensure realistic layover (>= 60 min, <= 8h, same-day approximation)
      const arr = parseTimeToMin(a.arriveTime);
      const dep = parseTimeToMin(b.departTime);
      const layover = dep - arr;
      if (layover < 60 || layover > 480) continue;

      const totalPrice = a.price + b.price;
      if (directPrice !== null && totalPrice >= directPrice) continue;

      combos.push({
        legs: [a, b],
        totalPrice,
        directPrice,
        savings: directPrice ? directPrice - totalPrice : 0,
        hubs: [a.toCode],
        totalDurationMin: parseDurationMin(a.duration) + layover + parseDurationMin(b.duration),
      });
    }
  }

  return combos
    .sort((x, y) => x.totalPrice - y.totalPrice)
    .slice(0, max);
}

/** Pick a few interesting routes worth combining for the dashboard. */
export function getInterestingCombos(
  preferredRoutes: Array<{ from: string; to: string }>,
  limit = 3
): ComboRoute[] {
  const out: ComboRoute[] = [];
  const tried = new Set<string>();

  // user-preferred first
  for (const r of preferredRoutes) {
    const key = `${r.from}-${r.to}`;
    if (tried.has(key)) continue;
    tried.add(key);
    out.push(...findCheaperCombos(r.from, r.to, 2));
    if (out.length >= limit) break;
  }

  // fallback popular international combos
  if (out.length < limit) {
    const fallbacks: Array<[string, string]> = [
      ["MAA", "LHR"], ["DEL", "JFK"], ["BOM", "LHR"], ["MAA", "JFK"],
    ];
    for (const [f, t] of fallbacks) {
      const key = `${f}-${t}`;
      if (tried.has(key)) continue;
      tried.add(key);
      out.push(...findCheaperCombos(f, t, 1));
      if (out.length >= limit) break;
    }
  }

  return out
    .sort((a, b) => b.savings - a.savings)
    .slice(0, limit);
}

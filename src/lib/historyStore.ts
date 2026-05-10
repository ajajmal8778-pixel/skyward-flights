import { create } from "zustand";
import type { Flight } from "./mockData";

export interface SearchEntry {
  from: string;
  to: string;
  date?: string;
  at: number;
}
export interface BookingHistoryEntry {
  flightId: string;
  airline: string;
  fromCode: string;
  toCode: string;
  departTime: string;
  price: number;
  at: number;
}

const SEARCH_KEY = "skywave_search_history_v1";
const BOOK_KEY = "skywave_booking_history_v1";

const load = <T,>(k: string): T[] => {
  try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch { return []; }
};
const save = (k: string, v: unknown) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ }
};

interface HistoryState {
  searches: SearchEntry[];
  bookingsHistory: BookingHistoryEntry[];
  logSearch: (s: Omit<SearchEntry, "at">) => void;
  logBooking: (f: Flight) => void;
  clear: () => void;
}

export const useHistory = create<HistoryState>((set, get) => ({
  searches: load<SearchEntry>(SEARCH_KEY),
  bookingsHistory: load<BookingHistoryEntry>(BOOK_KEY),
  logSearch: (s) => {
    const item: SearchEntry = { ...s, at: Date.now() };
    const searches = [item, ...get().searches].slice(0, 50);
    save(SEARCH_KEY, searches);
    set({ searches });
  },
  logBooking: (f) => {
    const item: BookingHistoryEntry = {
      flightId: f.id,
      airline: f.airline,
      fromCode: f.fromCode,
      toCode: f.toCode,
      departTime: f.departTime,
      price: f.price,
      at: Date.now(),
    };
    const bookingsHistory = [item, ...get().bookingsHistory].slice(0, 50);
    save(BOOK_KEY, bookingsHistory);
    set({ bookingsHistory });
  },
  clear: () => {
    save(SEARCH_KEY, []);
    save(BOOK_KEY, []);
    set({ searches: [], bookingsHistory: [] });
  },
}));

// Time-of-day bucket helper
export type TimeBucket = "morning" | "afternoon" | "evening" | "night";
export const bucketOf = (time: string): TimeBucket => {
  const m = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return "morning";
  let h = parseInt(m[1], 10);
  const ampm = m[3]?.toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  if (h < 6) return "night";
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 21) return "evening";
  return "night";
};

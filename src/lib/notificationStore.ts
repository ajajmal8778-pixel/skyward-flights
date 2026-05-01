import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  bookingId: string;
  recipientEmail?: string;
  flightNo: string;
  route: string;
  departureISO: string;
  offsetMin: number;
  createdAt: number;
  read: boolean;
}

const STORAGE_KEY = "skywave_notifications_v1";

function load(): AppNotification[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(items: AppNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 100)));
  } catch {
    /* ignore */
  }
}

interface NotificationState {
  items: AppNotification[];
  add: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => AppNotification;
  markAllRead: () => void;
  clear: () => void;
}

export const useNotifications = create<NotificationState>((set, get) => ({
  items: load(),
  add: (n) => {
    const item: AppNotification = {
      ...n,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
      read: false,
    };
    const items = [item, ...get().items].slice(0, 100);
    save(items);
    set({ items });
    return item;
  },
  markAllRead: () => {
    const items = get().items.map((i) => ({ ...i, read: true }));
    save(items);
    set({ items });
  },
  clear: () => {
    save([]);
    set({ items: [] });
  },
}));

export function buildMailto(n: Pick<AppNotification, "recipientEmail" | "title" | "body">) {
  const to = n.recipientEmail || "";
  const subject = encodeURIComponent(n.title);
  const body = encodeURIComponent(n.body + "\n\n— SkyWave Airlines");
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

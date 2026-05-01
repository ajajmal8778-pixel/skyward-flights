import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useNotifications } from "@/lib/notificationStore";
import type { Booking } from "@/lib/mockData";

// Reminder offsets in minutes before departure
const REMINDER_OFFSETS = [120, 60, 15];
const STORAGE_KEY = "skywave_reminders_fired";

// Parse "2026-04-15" + "12:00 AM" / "07:30" into a Date
function parseDeparture(date: string, time: string): Date | null {
  if (!date || !time) return null;
  const t = time.trim();
  // Handle "07:30 AM" / "12:00 AM" / "13:45"
  const ampmMatch = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  let hours = 0;
  let minutes = 0;
  if (ampmMatch) {
    hours = parseInt(ampmMatch[1], 10);
    minutes = parseInt(ampmMatch[2], 10);
    const isPM = ampmMatch[3].toUpperCase() === "PM";
    if (hours === 12) hours = isPM ? 12 : 0;
    else if (isPM) hours += 12;
  } else {
    const m = t.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    hours = parseInt(m[1], 10);
    minutes = parseInt(m[2], 10);
  }
  const d = new Date(`${date}T00:00:00`);
  if (isNaN(d.getTime())) return null;
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function loadFired(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveFired(fired: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fired));
  } catch {
    /* ignore */
  }
}

function notify(title: string, body: string) {
  toast(title, { description: body, duration: 10000 });
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      try {
        new Notification(title, { body, icon: "/placeholder.svg" });
      } catch {
        /* ignore */
      }
    }
  }
}

function buildMessage(b: Booking, offsetMin: number, departure: Date) {
  const timeStr = departure.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const route = `${b.flight.fromCode} → ${b.flight.toCode}`;
  if (offsetMin >= 60) {
    const hrs = Math.round(offsetMin / 60);
    return {
      title: `✈️ Flight Reminder — ${hrs} hour${hrs > 1 ? "s" : ""} to go`,
      body: `Your flight ${b.flight.flightNo} (${route}) is at ${timeStr}. Please ensure you do not miss it.`,
    };
  }
  return {
    title: `🚨 Boarding Soon — ${offsetMin} min`,
    body: `Your flight ${b.flight.flightNo} (${route}) departs at ${timeStr}. Head to the gate now!`,
  };
}

export function useFlightReminders() {
  const bookings = useStore((s) => s.bookings);
  const user = useStore((s) => s.user);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Ask permission once (non-blocking)
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    const check = () => {
      if (!user) return;
      const now = Date.now();
      const fired = loadFired();
      let changed = false;

      const userBookings = bookings.filter(
        (b) =>
          b.status === "confirmed" &&
          (b.passenger === user.name || b.passengers?.some((p) => p.name === user.name))
      );

      const addNotif = useNotifications.getState().add;

      for (const b of userBookings) {
        const dep = parseDeparture(b.date, b.flight.departTime);
        if (!dep) continue;
        const msUntil = dep.getTime() - now;
        if (msUntil <= 0) continue;

        for (const off of REMINDER_OFFSETS) {
          const key = `${b.id}:${off}`;
          if (fired[key]) continue;
          const triggerAt = dep.getTime() - off * 60 * 1000;
          if (now >= triggerAt && msUntil > 0) {
            const { title, body } = buildMessage(b, off, dep);
            notify(title, body);
            addNotif({
              title,
              body,
              bookingId: b.id,
              recipientEmail: user.email,
              flightNo: b.flight.flightNo,
              route: `${b.flight.fromCode} → ${b.flight.toCode}`,
              departureISO: dep.toISOString(),
              offsetMin: off,
            });
            fired[key] = true;
            changed = true;
          }
        }
      }

      if (changed) saveFired(fired);
    };

    // Run immediately, then poll every 30s
    check();
    intervalRef.current = window.setInterval(check, 30_000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [bookings, user]);
}

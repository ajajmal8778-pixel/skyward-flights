import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useStore } from "./store";
import { useNotifications } from "./notificationStore";

const KINDS = ["delay", "gate", "price"] as const;
type Kind = (typeof KINDS)[number];

const messages: Record<Kind, (route: string, flightNo: string) => { title: string; body: string }> = {
  delay: (route, fn) => ({
    title: `⏱️ Flight Delayed — ${fn}`,
    body: `Your flight ${fn} (${route}) is delayed by 25 minutes due to operational reasons. New boarding time will be updated shortly.`,
  }),
  gate: (route, fn) => ({
    title: `🚪 Gate Change — ${fn}`,
    body: `Gate change for ${fn} (${route}). Please proceed to the new gate displayed on the airport screens.`,
  }),
  price: (route, fn) => ({
    title: `💸 Price Drop on ${route}`,
    body: `Fares on ${route} dropped. Similar flights to ${fn} are now up to 18% cheaper. Great time to rebook for friends!`,
  }),
};

const STORAGE_LAST = "skywave_live_alerts_last";

/** Simulates Socket.IO/WebSocket live alerts client-side. */
export function useLiveAlertsSimulator() {
  const bookings = useStore((s) => s.bookings);
  const user = useStore((s) => s.user);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const tick = () => {
      const userBookings = bookings.filter(
        (b) =>
          b.status === "confirmed" &&
          (b.passenger === user.name || b.passengers?.some((p) => p.name === user.name))
      );
      if (userBookings.length === 0) return;

      // Throttle: at most one alert every 45s
      const last = parseInt(localStorage.getItem(STORAGE_LAST) || "0");
      if (Date.now() - last < 45_000) return;

      // 35% chance per tick
      if (Math.random() > 0.35) return;

      const b = userBookings[Math.floor(Math.random() * userBookings.length)];
      const kind = KINDS[Math.floor(Math.random() * KINDS.length)];
      const route = `${b.flight.fromCode} → ${b.flight.toCode}`;
      const { title, body } = messages[kind](route, b.flight.flightNo);

      toast(title, { description: body, duration: 9000 });
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try { new Notification(title, { body }); } catch { /* ignore */ }
      }

      useNotifications.getState().add({
        title,
        body,
        bookingId: b.id,
        recipientEmail: user.email,
        flightNo: b.flight.flightNo,
        route,
        departureISO: new Date().toISOString(),
        offsetMin: 0,
        kind,
      });

      localStorage.setItem(STORAGE_LAST, Date.now().toString());
    };

    // First tick after 20s, then every 30s
    const startTimer = window.setTimeout(tick, 20_000);
    intervalRef.current = window.setInterval(tick, 30_000);

    return () => {
      clearTimeout(startTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [bookings, user]);
}

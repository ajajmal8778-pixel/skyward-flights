import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Plane, Calendar, Clock, User, Armchair } from "lucide-react";
import type { Booking } from "@/lib/mockData";

interface BoardingPassProps {
  booking: Booking;
}

const BoardingPass = ({ booking }: BoardingPassProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto"
    >
      <div className="rounded-2xl overflow-hidden shadow-elevated">
        {/* Header */}
        <div className="gradient-sky px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-accent-foreground" />
            <span className="font-display font-bold text-accent-foreground">SkyWave Airlines</span>
          </div>
          <span className="text-sm text-accent-foreground/80">BOARDING PASS</span>
        </div>

        {/* Body */}
        <div className="bg-card p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-4xl font-display font-bold text-foreground">{booking.flight.fromCode}</div>
              <div className="text-sm text-muted-foreground">{booking.flight.from}</div>
            </div>
            <div className="flex flex-col items-center px-4">
              <Plane className="w-5 h-5 text-sky rotate-90 mb-1" />
              <div className="text-xs text-muted-foreground">{booking.flight.duration}</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-display font-bold text-foreground">{booking.flight.toCode}</div>
              <div className="text-sm text-muted-foreground">{booking.flight.to}</div>
            </div>
          </div>

          <div className="border-t border-dashed border-border pt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Passenger</div>
                <div className="font-semibold text-foreground">{booking.passenger}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="font-semibold text-foreground">{booking.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Flight</div>
                <div className="font-semibold text-foreground">{booking.flight.flightNo}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Armchair className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Seat</div>
                <div className="font-semibold text-foreground">{booking.seat}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-dashed border-border pt-4">
            <div>
              <div className="text-xs text-muted-foreground">PNR</div>
              <div className="text-xl font-display font-bold tracking-widest text-foreground">{booking.pnr}</div>
            </div>
            <QRCodeSVG
              value={JSON.stringify({
                pnr: booking.pnr,
                flight: booking.flight.flightNo,
                seat: booking.seat,
                date: booking.date,
              })}
              size={80}
              level="M"
            />
          </div>
        </div>

        {/* Status */}
        <div className={`px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider ${
          booking.status === "confirmed"
            ? "bg-emerald-50 text-emerald-700"
            : booking.status === "cancelled"
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700"
        }`}>
          {booking.status}
        </div>
      </div>
    </motion.div>
  );
};

export default BoardingPass;

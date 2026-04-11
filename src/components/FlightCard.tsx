import { motion } from "framer-motion";
import { Clock, Zap, Armchair, ArrowRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Flight } from "@/lib/mockData";

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
  index: number;
}

const FlightCard = ({ flight, onSelect, index }: FlightCardProps) => {
  const discount = Math.round(((flight.originalPrice - flight.price) / flight.originalPrice) * 100);
  const seatPercent = Math.round((flight.seatsAvailable / flight.totalSeats) * 100);
  const isLowSeat = flight.seatsAvailable < 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-xl border border-border p-5 hover:shadow-elevated transition-shadow group"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Airline & Score */}
        <div className="flex items-center gap-3 min-w-[160px]">
          <div className="w-10 h-10 rounded-lg gradient-sky flex items-center justify-center text-accent-foreground font-display font-bold text-sm">
            {flight.airline.charAt(0)}{flight.airline.split(" ")[1]?.charAt(0) || ""}
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground">{flight.airline}</div>
            <div className="text-xs text-muted-foreground">{flight.flightNo} · {flight.aircraft}</div>
          </div>
        </div>

        {/* Route & Time */}
        <div className="flex items-center gap-4 flex-1">
          <div className="text-center">
            <div className="text-xl font-display font-bold text-foreground">{flight.departTime}</div>
            <div className="text-xs text-muted-foreground">{flight.fromCode}</div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {flight.duration}
            </div>
            <div className="w-full h-px bg-border relative my-1">
              <div className="absolute right-0 -top-1 w-2 h-2 border-t border-r border-sky rotate-45" />
            </div>
            <div className="text-xs text-muted-foreground">
              {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-display font-bold text-foreground">{flight.arriveTime}</div>
            <div className="text-xs text-muted-foreground">{flight.toCode}</div>
          </div>
        </div>

        {/* Seats */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <Armchair className={`w-4 h-4 ${isLowSeat ? "text-destructive" : "text-muted-foreground"}`} />
          <div>
            <div className={`text-sm font-medium ${isLowSeat ? "text-destructive" : "text-foreground"}`}>
              {flight.seatsAvailable} seats
            </div>
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${isLowSeat ? "bg-destructive" : "bg-sky"}`}
                style={{ width: `${seatPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Price & AI Score */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2">
              {discount > 0 && (
                <span className="text-xs line-through text-muted-foreground">₹{flight.originalPrice.toLocaleString("en-IN")}</span>
              )}
              <span className="text-2xl font-display font-bold text-foreground">₹{flight.price.toLocaleString("en-IN")}</span>
            </div>
            {discount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingDown className="w-3 h-3" /> {discount}% AI Price
              </span>
            )}
          </div>

          {/* AI Score */}
          <div className="w-10 h-10 rounded-full border-2 border-sky flex items-center justify-center">
            <span className="text-xs font-bold text-sky">{flight.score}</span>
          </div>

          <Button
            onClick={() => onSelect(flight)}
            className="gradient-sky text-accent-foreground border-0"
            size="sm"
          >
            Select <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;

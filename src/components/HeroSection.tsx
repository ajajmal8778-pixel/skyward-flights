import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, ArrowRight, CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { airports } from "@/lib/mockData";
import heroImg from "@/assets/hero-plane.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("JFK");
  const [to, setTo] = useState("LHR");
  const [date, setDate] = useState("2026-04-15");
  const [passengers, setPassengers] = useState(1);

  const handleSearch = () => {
    navigate(`/flights?from=${from}&to=${to}&date=${date}&pax=${passengers}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Airplane above clouds" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-gold/20 text-gold mb-6">
              <Plane className="w-4 h-4" />
              AI-Powered Fare Predictions
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-primary-foreground leading-tight mb-4">
              Fly Smarter,{" "}
              <span className="text-sky">Book Better</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl mb-10">
              Intelligent flight search with AI-driven pricing, real-time seat availability, and instant digital boarding passes.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-card rounded-2xl p-6 shadow-elevated"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">From</label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-medium text-foreground border-0 focus:ring-2 focus:ring-sky outline-none"
                >
                  {airports.map((a) => (
                    <option key={a.code} value={a.code}>{a.code} — {a.city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">To</label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-medium text-foreground border-0 focus:ring-2 focus:ring-sky outline-none"
                >
                  {airports.map((a) => (
                    <option key={a.code} value={a.code}>{a.code} — {a.city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-medium text-foreground border-0 focus:ring-2 focus:ring-sky outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Passengers
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(+e.target.value)}
                  className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-medium text-foreground border-0 focus:ring-2 focus:ring-sky outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "Passenger" : "Passengers"}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full gradient-sky text-accent-foreground border-0 h-[42px] font-semibold"
                >
                  Search <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-8 mt-10"
          >
            {[
              { label: "Flights Daily", value: "2,400+" },
              { label: "Happy Travelers", value: "1.2M+" },
              { label: "Destinations", value: "180+" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-display font-bold text-primary-foreground">{s.value}</div>
                <div className="text-sm text-primary-foreground/50">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

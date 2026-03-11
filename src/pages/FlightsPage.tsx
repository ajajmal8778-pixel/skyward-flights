import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import FlightCard from "@/components/FlightCard";
import { mockFlights } from "@/lib/mockData";
import type { Flight } from "@/lib/mockData";

const FlightsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<"score" | "price" | "duration">("score");

  const from = searchParams.get("from") || "JFK";
  const to = searchParams.get("to") || "LHR";

  const sorted = [...mockFlights].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "duration") return a.duration.localeCompare(b.duration);
    return b.score - a.score;
  });

  const handleSelect = (flight: Flight) => {
    navigate(`/book/${flight.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {from} → {to}
              </h1>
              <p className="text-sm text-muted-foreground">{sorted.length} flights found · Ranked by AI</p>
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              {(["score", "price", "duration"] as const).map((s) => (
                <Button
                  key={s}
                  variant={sortBy === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(s)}
                  className={sortBy === s ? "gradient-sky text-accent-foreground border-0" : ""}
                >
                  {s === "score" && <Sparkles className="w-3 h-3 mr-1" />}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-3">
          {sorted.map((flight, i) => (
            <FlightCard key={flight.id} flight={flight} onSelect={handleSelect} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightsPage;

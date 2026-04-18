import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, Sparkles, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import FlightCard from "@/components/FlightCard";
import { mockFlights } from "@/lib/mockData";
import type { Flight } from "@/lib/mockData";

type SortOption = "bestDeal" | "priceLow" | "priceHigh" | "fastest" | "mostSeats" | "earliest";
type AvailabilityFilter = "all" | "high" | "medium" | "low";

const sortLabels: Record<SortOption, string> = {
  bestDeal: "Best Deal",
  priceLow: "Price Low → High",
  priceHigh: "Price High → Low",
  fastest: "Fastest",
  mostSeats: "Most Seats",
  earliest: "Earliest",
};

const parseDuration = (d: string): number => {
  const h = parseInt(d.match(/(\d+)h/)?.[1] || "0");
  const m = parseInt(d.match(/(\d+)m/)?.[1] || "0");
  return h * 60 + m;
};

const FlightsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>("bestDeal");
  const [showFilters, setShowFilters] = useState(true);

  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [directOnly, setDirectOnly] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [cabinBag, setCabinBag] = useState(false);
  const [checkedBag, setCheckedBag] = useState(false);

  const from = searchParams.get("from") || "MAA";
  const to = searchParams.get("to") || "CJB";
  const pax = searchParams.get("pax") || "1";

  const filtered = useMemo(() => {
    return mockFlights.filter((f) => {
      if (f.fromCode !== from) return false;
      if (f.toCode !== to) return false;
      if (f.price < priceRange[0] || f.price > priceRange[1]) return false;
      if (directOnly && f.stops > 0) return false;
      if (availability === "high" && f.seatsAvailable < 50) return false;
      if (availability === "medium" && (f.seatsAvailable < 20 || f.seatsAvailable >= 50)) return false;
      if (availability === "low" && f.seatsAvailable >= 20) return false;
      return true;
    });
  }, [from, to, priceRange, directOnly, availability]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "priceLow": return a.price - b.price;
        case "priceHigh": return b.price - a.price;
        case "fastest": return parseDuration(a.duration) - parseDuration(b.duration);
        case "mostSeats": return b.seatsAvailable - a.seatsAvailable;
        case "earliest": return a.departTime.localeCompare(b.departTime);
        case "bestDeal":
        default:
          return b.score - a.score;
      }
    });
  }, [filtered, sortBy]);

  const handleSelect = (flight: Flight) => {
    navigate(`/book/${flight.id}?pax=${pax}`);
  };

  const resetFilters = () => {
    setPriceRange([0, 50000]);
    setDirectOnly(false);
    setAvailability("all");
    setCabinBag(false);
    setCheckedBag(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {from} → {to}
              </h1>
              <p className="text-sm text-muted-foreground">{sorted.length} flights found · Ranked by AI</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-72 shrink-0"
            >
              <div className="bg-card rounded-xl border border-border p-5 sticky top-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-foreground">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-muted-foreground">
                    <X className="w-3 h-3 mr-1" /> Reset
                  </Button>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Price Range: ₹{priceRange[0].toLocaleString("en-IN")} — ₹{priceRange[1].toLocaleString("en-IN")}
                  </label>
                  <Slider
                    min={0}
                    max={50000}
                    step={500}
                    value={priceRange}
                    onValueChange={(v) => setPriceRange(v as [number, number])}
                  />
                </div>

                {/* Stops */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Stops</label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="directOnly"
                      checked={directOnly}
                      onCheckedChange={(v) => setDirectOnly(!!v)}
                    />
                    <label htmlFor="directOnly" className="text-sm text-muted-foreground cursor-pointer">
                      Direct flights only
                    </label>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Seat Availability</label>
                  <div className="flex flex-wrap gap-2">
                    {(["all", "high", "medium", "low"] as const).map((a) => (
                      <Button
                        key={a}
                        variant={availability === a ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAvailability(a)}
                        className={availability === a ? "gradient-sky text-accent-foreground border-0" : ""}
                      >
                        {a.charAt(0).toUpperCase() + a.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Baggage */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Baggage</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="cabinBag" checked={cabinBag} onCheckedChange={(v) => setCabinBag(!!v)} />
                      <label htmlFor="cabinBag" className="text-sm text-muted-foreground cursor-pointer">Cabin bag included</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="checkedBag" checked={checkedBag} onCheckedChange={(v) => setCheckedBag(!!v)} />
                      <label htmlFor="checkedBag" className="text-sm text-muted-foreground cursor-pointer">Checked bag included</label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              {(Object.keys(sortLabels) as SortOption[]).map((s) => (
                <Button
                  key={s}
                  variant={sortBy === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(s)}
                  className={sortBy === s ? "gradient-sky text-accent-foreground border-0" : ""}
                >
                  {s === "bestDeal" && <Sparkles className="w-3 h-3 mr-1" />}
                  {sortLabels[s]}
                </Button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {sorted.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No flights match your filters.</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                sorted.map((flight, i) => (
                  <FlightCard key={flight.id} flight={flight} onSelect={handleSelect} index={i} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightsPage;

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingDown, Plane, Clock, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useHistory } from "@/lib/historyStore";
import { getRecommendations } from "@/lib/recommendations";
import { getInterestingCombos } from "@/lib/routeCombinator";

const RecommendedFlights = () => {
  const navigate = useNavigate();
  const { searches, bookingsHistory } = useHistory();

  const recs = useMemo(
    () => getRecommendations(searches, bookingsHistory, 6),
    [searches, bookingsHistory]
  );

  const combos = useMemo(() => {
    const preferred = [
      ...bookingsHistory.map((b) => ({ from: b.fromCode, to: b.toCode })),
      ...searches.map((s) => ({ from: s.from, to: s.to })),
    ];
    return getInterestingCombos(preferred, 3);
  }, [searches, bookingsHistory]);

  const hasHistory = searches.length > 0 || bookingsHistory.length > 0;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-sky flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Recommended Flights For You</h2>
              <p className="text-sm text-muted-foreground">
                {hasHistory
                  ? "Personalized using your search & booking history"
                  : "Popular cheap deals — book once and we'll personalize this"}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="picks">
          <TabsList>
            <TabsTrigger value="picks">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Personalized picks
            </TabsTrigger>
            <TabsTrigger value="combos">
              <Route className="w-3.5 h-3.5 mr-1.5" /> Cheaper combo routes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="picks" className="mt-4">
            {recs.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No suggestions yet. Search for a flight to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recs.map((r, i) => {
                  const f = r.flight;
                  return (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-xl border border-border p-4 hover:shadow-elevated transition-shadow flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg gradient-sky flex items-center justify-center text-accent-foreground font-display font-bold text-xs">
                            {f.airline.charAt(0)}
                          </div>
                          <div className="text-xs">
                            <div className="font-semibold text-foreground">{f.airline}</div>
                            <div className="text-muted-foreground">{f.flightNo}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-sky border border-sky/40 rounded-full px-2 py-0.5">
                          AI {Math.round(r.score)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-lg font-display font-bold text-foreground">{f.fromCode}</div>
                          <div className="text-[10px] text-muted-foreground">{f.departTime}</div>
                        </div>
                        <Plane className="w-4 h-4 text-sky" />
                        <div className="text-right">
                          <div className="text-lg font-display font-bold text-foreground">{f.toCode}</div>
                          <div className="text-[10px] text-muted-foreground">{f.arriveTime}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {r.reasons.slice(0, 2).map((reason) => (
                          <span
                            key={reason}
                            className="text-[10px] bg-sky/10 text-sky rounded-full px-2 py-0.5 font-medium"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <div className="text-xl font-display font-bold text-foreground">
                            ₹{f.price.toLocaleString("en-IN")}
                          </div>
                          {f.originalPrice > f.price && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                              <TrendingDown className="w-3 h-3" />
                              {Math.round(((f.originalPrice - f.price) / f.originalPrice) * 100)}% off
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/flights?from=${f.fromCode}&to=${f.toCode}&pax=1`)}
                          className="gradient-sky text-accent-foreground border-0"
                        >
                          View <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="combos" className="mt-4">
            {combos.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No cheaper multi-stop alternatives found right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {combos.map((c, i) => (
                  <motion.div
                    key={c.legs.map((l) => l.id).join("-")}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-xl border border-border p-4 hover:shadow-elevated transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 rounded-full px-2 py-0.5 inline-flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        Save ₹{c.savings.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.floor(c.totalDurationMin / 60)}h {c.totalDurationMin % 60}m
                      </span>
                    </div>
                    <div className="flex items-center gap-2 my-3 text-foreground">
                      <span className="text-lg font-display font-bold">{c.legs[0].fromCode}</span>
                      <ArrowRight className="w-3 h-3 text-sky" />
                      {c.hubs.map((h) => (
                        <span key={h} className="text-sm font-display font-bold text-sky">{h}</span>
                      ))}
                      <ArrowRight className="w-3 h-3 text-sky" />
                      <span className="text-lg font-display font-bold">{c.legs[c.legs.length - 1].toCode}</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1 mb-3">
                      {c.legs.map((l) => (
                        <div key={l.id} className="flex justify-between">
                          <span>{l.airline} {l.flightNo}</span>
                          <span>{l.departTime} → {l.arriveTime}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <div>
                        <div className="text-xl font-display font-bold text-foreground">
                          ₹{c.totalPrice.toLocaleString("en-IN")}
                        </div>
                        {c.directPrice && (
                          <div className="text-[10px] text-muted-foreground line-through">
                            Direct ₹{c.directPrice.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/flights?from=${c.legs[0].fromCode}&to=${c.hubs[0]}&pax=1`)}
                      >
                        Book leg 1 <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default RecommendedFlights;

import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plane, CreditCard, User, Mail, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import SeatSelection from "@/components/SeatSelection";
import BoardingPass from "@/components/BoardingPass";
import { mockFlights } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import type { Booking, Passenger } from "@/lib/mockData";

const BookingPage = () => {
  const { flightId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, addBooking, bookSeat } = useStore();

  const paxCount = Math.min(Math.max(parseInt(searchParams.get("pax") || "1"), 1), 6);

  const [passengers, setPassengers] = useState<Passenger[]>(
    Array.from({ length: paxCount }, (_, i) => ({
      name: i === 0 ? (user?.name || "") : "",
      email: i === 0 ? (user?.email || "") : "",
      seat: "",
    }))
  );
  const [activePassenger, setActivePassenger] = useState(0);
  const [booking, setBooking] = useState<Booking | null>(null);

  const flight = mockFlights.find((f) => f.id === flightId);

  if (!flight) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Flight not found</p>
      </div>
    );
  }

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    setPassengers((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const addPassenger = () => {
    if (passengers.length >= 6) return;
    setPassengers((prev) => [...prev, { name: "", email: "", seat: "" }]);
    setActivePassenger(passengers.length);
  };

  const removePassenger = (index: number) => {
    if (passengers.length <= 1) return;
    setPassengers((prev) => prev.filter((_, i) => i !== index));
    setActivePassenger(Math.max(0, activePassenger >= index ? activePassenger - 1 : activePassenger));
  };

  const handleSeatSelect = (seat: string) => {
    updatePassenger(activePassenger, "seat", seat);
  };

  const selectedSeats = passengers.map((p) => p.seat).filter(Boolean);

  const handleConfirm = () => {
    const allFilled = passengers.every((p) => p.name.trim() && p.email.trim() && p.seat);
    if (!allFilled) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newBooking: Booking = {
      id: `BK-${Date.now()}`,
      flight,
      passenger: passengers[0].name.trim(),
      passengers: passengers.map((p) => ({ ...p, name: p.name.trim(), email: p.email.trim() })),
      seat: passengers.map((p) => p.seat).join(", "),
      date: "2026-04-15",
      status: "confirmed",
      pnr,
      totalPassengers: passengers.length,
    };
    passengers.forEach((p) => bookSeat(p.seat));
    addBooking(newBooking);
    setBooking(newBooking);
  };

  if (booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
            >
              <Plane className="w-8 h-8 text-emerald-600" />
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-foreground">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              {booking.totalPassengers > 1
                ? `${booking.totalPassengers} passengers booked successfully`
                : "Your digital boarding pass is ready"}
            </p>
          </div>
          <BoardingPass booking={booking} />
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate("/bookings")}>View My Bookings</Button>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = flight.price * passengers.length;
  const canConfirm = passengers.every((p) => p.name.trim() && p.email.trim() && p.seat);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flight Summary & Passenger Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h3 className="font-display font-bold text-lg text-foreground mb-4">Flight Summary</h3>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-2xl font-display font-bold text-foreground">{flight.fromCode}</div>
                  <div className="text-xs text-muted-foreground">{flight.departTime}</div>
                </div>
                <Plane className="w-5 h-5 text-sky" />
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-foreground">{flight.toCode}</div>
                  <div className="text-xs text-muted-foreground">{flight.arriveTime}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Airline</span>
                  <span className="font-medium text-foreground">{flight.airline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flight</span>
                  <span className="font-medium text-foreground">{flight.flightNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-foreground">{flight.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aircraft</span>
                  <span className="font-medium text-foreground">{flight.aircraft}</span>
                </div>
              </div>

              {/* Passengers */}
              <div className="border-t border-border mt-4 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-foreground">
                    Passengers ({passengers.length})
                  </h4>
                  {passengers.length < 6 && (
                    <Button variant="ghost" size="sm" onClick={addPassenger} className="text-xs h-7">
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  )}
                </div>

                {/* Passenger Tabs */}
                <div className="flex gap-1 flex-wrap">
                  {passengers.map((p, i) => (
                    <Button
                      key={i}
                      variant={activePassenger === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivePassenger(i)}
                      className={`text-xs h-7 ${activePassenger === i ? "gradient-sky text-accent-foreground border-0" : ""}`}
                    >
                      {p.name.trim() || `Passenger ${i + 1}`}
                      {p.seat && ` (${p.seat})`}
                    </Button>
                  ))}
                </div>

                {/* Active Passenger Form */}
                <div className="bg-muted/50 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Passenger {activePassenger + 1}
                    </span>
                    {passengers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePassenger(activePassenger)}
                        className="text-xs h-6 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={passengers[activePassenger].name}
                        onChange={(e) => updatePassenger(activePassenger, "name", e.target.value)}
                        placeholder="Enter full name"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={passengers[activePassenger].email}
                        onChange={(e) => updatePassenger(activePassenger, "email", e.target.value)}
                        placeholder="Enter email"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-1">
                  <span>₹{flight.price.toLocaleString("en-IN")} × {passengers.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-3xl font-display font-bold text-foreground">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <Button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="w-full mt-4 gradient-sky text-accent-foreground border-0"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Confirm — ₹{totalPrice.toLocaleString("en-IN")}
              </Button>
            </div>
          </div>

          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <div className="mb-3 text-sm text-muted-foreground">
              Selecting seat for: <span className="font-semibold text-foreground">{passengers[activePassenger].name || `Passenger ${activePassenger + 1}`}</span>
            </div>
            <SeatSelection
              onSeatSelect={handleSeatSelect}
              selectedSeat={passengers[activePassenger].seat || null}
              additionalBookedSeats={selectedSeats.filter((s) => s !== passengers[activePassenger].seat)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

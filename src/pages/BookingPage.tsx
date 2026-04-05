import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plane, CreditCard, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import SeatSelection from "@/components/SeatSelection";
import BoardingPass from "@/components/BoardingPass";
import { mockFlights } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import type { Booking } from "@/lib/mockData";

const BookingPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { user, addBooking, bookSeat } = useStore();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [passengerName, setPassengerName] = useState(user?.name || "");
  const [passengerEmail, setPassengerEmail] = useState(user?.email || "");

  const flight = mockFlights.find((f) => f.id === flightId);

  if (!flight) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Flight not found</p>
      </div>
    );
  }

  const handleConfirm = () => {
    if (!selectedSeat || !passengerName.trim() || !passengerEmail.trim()) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newBooking: Booking = {
      id: `BK-${Date.now()}`,
      flight,
      passenger: passengerName.trim(),
      seat: selectedSeat,
      date: "2026-04-15",
      status: "confirmed",
      pnr,
    };
    addBooking(newBooking);
    bookSeat(selectedSeat);
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
            <p className="text-muted-foreground">Your digital boarding pass is ready</p>
          </div>
          <BoardingPass booking={booking} />
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate("/bookings")}>View My Bookings</Button>
          </div>
        </div>
      </div>
    );
  }

  const canConfirm = selectedSeat && passengerName.trim() && passengerEmail.trim();

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
                {selectedSeat && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seat</span>
                    <span className="font-bold text-sky">{selectedSeat}</span>
                  </div>
                )}
              </div>

              {/* Passenger Details */}
              <div className="border-t border-border mt-4 pt-4 space-y-3">
                <h4 className="font-display font-bold text-sm text-foreground">Passenger Details</h4>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-3xl font-display font-bold text-foreground">${flight.price}</span>
                </div>
              </div>
              <Button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="w-full mt-4 gradient-sky text-accent-foreground border-0"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Confirm — ${flight.price}
              </Button>
            </div>
          </div>

          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <SeatSelection onSeatSelect={setSelectedSeat} selectedSeat={selectedSeat} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

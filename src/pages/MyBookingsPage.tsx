import Navbar from "@/components/Navbar";
import BoardingPass from "@/components/BoardingPass";
import { useStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

const MyBookingsPage = () => {
  const { user, bookings } = useStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your bookings.</p>
          <Button onClick={() => navigate("/login")} className="gradient-sky text-accent-foreground border-0">Sign In</Button>
        </div>
      </div>
    );
  }

  const userBookings = bookings.filter((b) => b.passenger === user.name);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-display font-bold text-foreground mb-8">My Bookings</h1>
        {userBookings.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No bookings yet</p>
            <Button onClick={() => navigate("/")} className="gradient-sky text-accent-foreground border-0">
              Search Flights
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {userBookings.map((b) => (
              <BoardingPass key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;

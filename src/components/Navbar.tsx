import { Link, useNavigate } from "react-router-dom";
import { Plane, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-sky flex items-center justify-center">
            <Plane className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">SkyWave</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome, {user.name}
              </span>
              {user.role === "admin" && (
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => navigate("/bookings")}>
                My Bookings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button size="sm" className="gradient-sky text-accent-foreground border-0" onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

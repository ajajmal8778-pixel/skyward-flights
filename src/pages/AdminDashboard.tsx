import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3, Users, DollarSign, TrendingUp, Plane, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useStore } from "@/lib/store";
import { adminStats } from "@/lib/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

const StatCard = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-xl border border-border p-5"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-lg gradient-sky flex items-center justify-center">
        <Icon className="w-5 h-5 text-accent-foreground" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <div className="text-3xl font-display font-bold text-foreground">{value}</div>
    {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
  </motion.div>
);

const AdminDashboard = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p className="text-muted-foreground mb-4">Admin access required.</p>
          <Button onClick={() => navigate("/login")} className="gradient-sky text-accent-foreground border-0">
            Sign In as Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Home
        </Button>
        <h1 className="text-2xl font-display font-bold text-foreground mb-8">Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BarChart3} label="Total Bookings" value={adminStats.totalBookings.toLocaleString()} />
          <StatCard icon={DollarSign} label="Revenue" value={`₹${(adminStats.totalRevenue / 100000).toFixed(1)}L`} sub="All time" />
          <StatCard icon={Users} label="Occupancy Rate" value={`${adminStats.occupancyRate}%`} />
          <StatCard icon={TrendingUp} label="Popular Route" value="MAA → CJB" sub="342 bookings" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Bookings Chart */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-bold text-foreground mb-4">Monthly Bookings</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={adminStats.monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="bookings" fill="hsl(200 90% 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Trend */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-bold text-foreground mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={adminStats.monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(40 95% 55%)" strokeWidth={2} dot={{ fill: "hsl(40 95% 55%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-bold text-foreground mb-4">Popular Routes</h3>
            <div className="space-y-3">
              {adminStats.popularRoutes.map((r, i) => (
                <div key={r.route} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full gradient-sky text-accent-foreground text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-foreground">{r.route}</div>
                      <div className="text-xs text-muted-foreground">{r.bookings} bookings</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">₹{(r.revenue / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-bold text-foreground mb-4">Recent Bookings</h3>
            <div className="space-y-3">
              {adminStats.recentBookings.map((b) => (
                <div key={b.pnr} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Plane className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{b.passenger}</div>
                      <div className="text-xs text-muted-foreground">{b.route} · {b.pnr}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">₹{b.amount.toLocaleString("en-IN")}</div>
                    <span className={`text-xs font-medium ${
                      b.status === "confirmed" ? "text-emerald-600" : b.status === "cancelled" ? "text-destructive" : "text-amber-600"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

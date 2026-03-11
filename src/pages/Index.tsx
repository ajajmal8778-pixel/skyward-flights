import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Plane, Brain, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Pricing",
    desc: "Dynamic fare prediction using machine learning adjusts prices based on demand and availability.",
  },
  {
    icon: Zap,
    title: "Real-Time Availability",
    desc: "Seats update instantly across the system ensuring reliable, conflict-free bookings.",
  },
  {
    icon: Plane,
    title: "Digital Boarding Pass",
    desc: "Get your QR-coded boarding pass instantly after booking — no printing needed.",
  },
  {
    icon: Shield,
    title: "Secure Booking",
    desc: "JWT-authenticated sessions with role-based access keep your data safe.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Why Choose <span className="text-sky">SkyWave</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Intelligent technology meets seamless travel experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-elevated transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl gradient-sky flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 SkyWave Airlines. Intelligent flight booking platform.
        </div>
      </footer>
    </div>
  );
};

export default Index;

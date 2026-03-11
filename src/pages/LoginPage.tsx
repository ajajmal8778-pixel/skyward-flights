import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    login(email, password);
    toast.success("Welcome back!");
    navigate(email === "admin@skywave.com" ? "/admin" : "/");
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-elevated p-8 w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-lg gradient-sky flex items-center justify-center">
            <Plane className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">SkyWave</span>
        </div>

        <h1 className="text-2xl font-display font-bold text-foreground text-center mb-2">Welcome Back</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Sign in to manage your flights</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" />
            </div>
          </div>
          <Button type="submit" className="w-full gradient-sky text-accent-foreground border-0">
            Sign In <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Don't have an account? <Link to="/register" className="text-sky font-medium hover:underline">Register</Link>
        </p>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Admin? Use <span className="font-mono text-foreground">admin@skywave.com</span>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

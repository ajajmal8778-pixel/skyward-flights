import { create } from 'zustand';
import type { Flight, Booking } from './mockData';
import { mockBookings } from './mockData';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'passenger' | 'admin';
}

interface AppState {
  user: User | null;
  bookings: Booking[];
  bookedSeats: string[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  addBooking: (booking: Booking) => void;
  bookSeat: (seat: string) => void;
  cancelBooking: (bookingId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  bookings: mockBookings,
  bookedSeats: [],
  login: (email, _password) => {
    const isAdmin = email === 'admin@skywave.com';
    set({
      user: {
        id: isAdmin ? 'admin-1' : 'user-1',
        name: isAdmin ? 'Admin User' : 'John Doe',
        email,
        role: isAdmin ? 'admin' : 'passenger',
      },
    });
    return true;
  },
  register: (name, email, _password) => {
    set({
      user: { id: 'user-' + Date.now(), name, email, role: 'passenger' },
    });
    return true;
  },
  logout: () => set({ user: null }),
  addBooking: (booking) => set((s) => ({ bookings: [...s.bookings, booking] })),
  bookSeat: (seat) => set((s) => ({ bookedSeats: [...s.bookedSeats, seat] })),
  cancelBooking: (bookingId) =>
    set((s) => ({
      bookings: s.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as const } : b
      ),
    })),
}));

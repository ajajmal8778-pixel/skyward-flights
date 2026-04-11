import { useState } from "react";
import { motion } from "framer-motion";
import { seatMap } from "@/lib/mockData";
import { useStore } from "@/lib/store";

interface SeatMapProps {
  onSeatSelect: (seat: string) => void;
  selectedSeat: string | null;
  additionalBookedSeats?: string[];
}

const SeatSelection = ({ onSeatSelect, selectedSeat, additionalBookedSeats = [] }: SeatMapProps) => {
  const { bookedSeats } = useStore();
  const allBooked = [...seatMap.bookedSeats, ...bookedSeats, ...additionalBookedSeats];

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-display font-bold text-lg text-foreground mb-4">Select Your Seat</h3>
      
      {/* Legend */}
      <div className="flex gap-4 mb-6 text-xs">
        {[
          { color: "bg-muted", label: "Available" },
          { color: "bg-sky", label: "Selected" },
          { color: "bg-foreground/20", label: "Booked" },
          { color: "bg-gold", label: "Premium" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-4 h-4 rounded ${item.color}`} />
            <span className="text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Seat Grid */}
      <div className="max-h-[400px] overflow-y-auto pr-2">
        <div className="flex flex-col gap-1 items-center">
          {/* Column labels */}
          <div className="flex gap-1 mb-2">
            <div className="w-8" />
            {seatMap.seatsPerRow.map((col, i) => (
              <div key={col} className={`w-8 text-center text-xs font-medium text-muted-foreground ${i === 2 ? "mr-4" : ""}`}>
                {col}
              </div>
            ))}
          </div>

          {Array.from({ length: 20 }, (_, row) => {
            const rowNum = row + 1;
            const isPremium = seatMap.premiumRows.includes(rowNum);
            const isExit = seatMap.exitRows.includes(rowNum);

            return (
              <div key={rowNum} className="flex gap-1 items-center">
                <div className="w-8 text-center text-xs text-muted-foreground font-medium">{rowNum}</div>
                {seatMap.seatsPerRow.map((col, i) => {
                  const seatId = `${rowNum}${col}`;
                  const isBooked = allBooked.includes(seatId);
                  const isSelected = selectedSeat === seatId;

                  let bg = "bg-muted hover:bg-sky/30 cursor-pointer";
                  if (isBooked) bg = "bg-foreground/20 cursor-not-allowed";
                  else if (isSelected) bg = "bg-sky";
                  else if (isPremium) bg = "bg-gold/30 hover:bg-gold/50 cursor-pointer";

                  return (
                    <motion.button
                      key={seatId}
                      whileHover={!isBooked ? { scale: 1.15 } : {}}
                      whileTap={!isBooked ? { scale: 0.95 } : {}}
                      onClick={() => !isBooked && onSeatSelect(seatId)}
                      className={`w-8 h-8 rounded text-[10px] font-medium transition-colors ${bg} ${i === 2 ? "mr-4" : ""} ${isSelected ? "text-accent-foreground" : "text-foreground/60"}`}
                      disabled={isBooked}
                    >
                      {isBooked ? "×" : ""}
                    </motion.button>
                  );
                })}
                {isExit && <span className="text-[10px] text-muted-foreground ml-2">EXIT</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;

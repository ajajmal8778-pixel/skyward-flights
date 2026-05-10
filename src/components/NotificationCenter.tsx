import { useMemo, useState } from "react";
import { Bell, Mail, Trash2, Plane, Clock, DoorOpen, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, buildMailto, type NotificationKind } from "@/lib/notificationStore";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

type Filter = "all" | NotificationKind;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "reminder", label: "Reminders" },
  { id: "delay", label: "Delays" },
  { id: "gate", label: "Gates" },
  { id: "price", label: "Prices" },
];

const kindIcon = (k?: NotificationKind) => {
  switch (k) {
    case "delay": return Clock;
    case "gate": return DoorOpen;
    case "price": return TrendingDown;
    default: return Plane;
  }
};

const kindColor = (k?: NotificationKind) => {
  switch (k) {
    case "delay": return "bg-amber-500/15 text-amber-600";
    case "gate": return "bg-purple-500/15 text-purple-600";
    case "price": return "bg-emerald-500/15 text-emerald-600";
    default: return "gradient-sky text-accent-foreground";
  }
};

const NotificationCenter = () => {
  const { items, markAllRead, clear } = useNotifications();
  const [filter, setFilter] = useState<Filter>("all");
  const unread = items.filter((i) => !i.read).length;

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => (i.kind || "reminder") === filter);
  }, [items, filter]);

  return (
    <Popover onOpenChange={(o) => o && unread > 0 && markAllRead()}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1 animate-pulse">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 className="font-display font-semibold text-sm">Live Alerts</h3>
            <p className="text-xs text-muted-foreground">
              Reminders, delays, gate changes & price drops
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clear} className="h-7 text-xs" aria-label="Clear all">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        <div className="px-3 py-2 border-b flex gap-1 flex-wrap">
          {filters.map((f) => (
            <Button
              key={f.id}
              variant={filter === f.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f.id)}
              className={cn("h-6 px-2 text-[11px]", filter === f.id && "gradient-sky text-accent-foreground border-0")}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <ScrollArea className="max-h-[400px]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Plane className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No alerts here yet. We'll notify you of delays, gate changes & price drops in real time.
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((n) => {
                const Icon = kindIcon(n.kind);
                return (
                  <li key={n.id} className="p-3 hover:bg-muted/40 transition-colors">
                    <div className="flex items-start gap-2">
                      <div className={cn("mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0", kindColor(n.kind))}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-snug">{n.body}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                          </span>
                          {n.recipientEmail && (
                            <a
                              href={buildMailto(n)}
                              className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                            >
                              <Mail className="w-3 h-3" />
                              Email me
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;

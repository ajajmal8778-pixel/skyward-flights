import { Bell, Mail, Check, Trash2, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, buildMailto } from "@/lib/notificationStore";
import { formatDistanceToNow } from "date-fns";

const NotificationCenter = () => {
  const { items, markAllRead, clear } = useNotifications();
  const unread = items.filter((i) => !i.read).length;

  return (
    <Popover onOpenChange={(o) => o && unread > 0 && markAllRead()}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 className="font-display font-semibold text-sm">Flight Reminders</h3>
            <p className="text-xs text-muted-foreground">
              Alerts at 2h, 1h & 15min before departure
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="h-7 text-xs"
              aria-label="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-[400px]">
          {items.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Plane className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No reminders yet. We'll alert you 2 hours, 1 hour and 15 minutes before each flight.
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((n) => (
                <li key={n.id} className="p-3 hover:bg-muted/40 transition-colors">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 w-7 h-7 rounded-full gradient-sky flex items-center justify-center flex-shrink-0">
                      <Plane className="w-3.5 h-3.5 text-accent-foreground" />
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
                            Email {n.recipientEmail}
                          </a>
                        )}
                        {n.read && <Check className="w-3 h-3 text-muted-foreground ml-auto" />}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  X, 
  Bell, 
  Calendar,
  Trash2,
  Check,
  AlertTriangle,
  TrendingUp,
  Users,
  Package,
  Coins,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface GameNotification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  category: 'finance' | 'hr' | 'production' | 'event' | 'achievement';
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: GameNotification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

const categoryIcons = {
  finance: Coins,
  hr: Users,
  production: Package,
  event: AlertTriangle,
  achievement: TrendingUp,
};

const typeColors = {
  success: "text-success bg-success/20 border-success/30",
  warning: "text-warning bg-warning/20 border-warning/30",
  info: "text-primary bg-primary/20 border-primary/30",
  error: "text-destructive bg-destructive/20 border-destructive/30",
};

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onDismiss,
  onClearAll,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || !n.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Panel */}
      <div className="fixed right-2 bottom-14 z-50 w-96 max-w-[calc(100vw-1rem)] animate-slide-in-right">
        <div className="glass-effect rounded-xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "flex-1 py-2 text-sm font-medium transition-colors",
                filter === 'all' ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"
              )}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                "flex-1 py-2 text-sm font-medium transition-colors",
                filter === 'unread' ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"
              )}
            >
              Non lues ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-96">
            {filteredNotifications.length > 0 ? (
              <div className="p-2 space-y-2">
                {filteredNotifications.map(notification => {
                  const CategoryIcon = categoryIcons[notification.category];
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        typeColors[notification.type],
                        !notification.read && "ring-1 ring-primary/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-black/20">
                          <CategoryIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-medium text-sm truncate">{notification.title}</p>
                            <span className="text-[10px] opacity-60 flex-shrink-0">
                              J{notification.timestamp}
                            </span>
                          </div>
                          <p className="text-xs opacity-80 line-clamp-2">{notification.message}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/10">
                        {!notification.read && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="flex items-center gap-1 px-2 py-1 text-[10px] rounded hover:bg-black/20 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Marquer lu
                          </button>
                        )}
                        <button
                          onClick={() => onDismiss(notification.id)}
                          className="flex items-center gap-1 px-2 py-1 text-[10px] rounded hover:bg-black/20 transition-colors ml-auto"
                        >
                          <X className="w-3 h-3" />
                          Fermer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Bell className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">Aucune notification</p>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/10 flex justify-between">
              <button
                onClick={() => notifications.filter(n => !n.read).forEach(n => onMarkAsRead(n.id))}
                className="text-xs text-primary hover:underline"
              >
                Tout marquer comme lu
              </button>
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 text-xs text-destructive hover:underline"
              >
                <Trash2 className="w-3 h-3" />
                Tout effacer
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

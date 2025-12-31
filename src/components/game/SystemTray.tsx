import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Wifi, 
  Volume2, 
  Battery, 
  Moon, 
  Sun,
  BellRing,
  Settings,
  ChevronUp,
  Bluetooth,
  Plane,
  Focus,
  Cast,
  Accessibility,
} from "lucide-react";

interface SystemTrayProps {
  notifications: number;
  onOpenNotifications: () => void;
}

export function SystemTray({ notifications, onOpenNotifications }: SystemTrayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickSettings, setQuickSettings] = useState({
    wifi: true,
    bluetooth: false,
    airplane: false,
    focus: false,
    nightLight: false,
    cast: false,
  });

  const toggleSetting = (key: keyof typeof quickSettings) => {
    setQuickSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative">
      {/* Tray Icons */}
      <div className="flex items-center gap-0.5">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 px-2 flex items-center gap-2 rounded hover:bg-white/10 transition-colors"
        >
          <ChevronUp className={cn("w-3 h-3 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
        </button>
        
        <button className="h-8 px-1.5 flex items-center justify-center rounded hover:bg-white/10 transition-colors">
          <Wifi className="w-3.5 h-3.5" />
        </button>
        <button className="h-8 px-1.5 flex items-center justify-center rounded hover:bg-white/10 transition-colors">
          <Volume2 className="w-3.5 h-3.5" />
        </button>
        <button className="h-8 px-1.5 flex items-center gap-1 rounded hover:bg-white/10 transition-colors">
          <Battery className="w-3.5 h-3.5" />
          <span className="text-[10px]">100%</span>
        </button>
        
        <button 
          onClick={onOpenNotifications}
          className="relative h-8 px-1.5 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
        >
          <BellRing className="w-3.5 h-3.5" />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary text-primary-foreground text-[8px] font-bold rounded-full flex items-center justify-center">
              {notifications > 9 ? '9+' : notifications}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Quick Settings Panel */}
      {isExpanded && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsExpanded(false)} />
          <div className="absolute bottom-full right-0 mb-2 z-50 w-80 animate-window-open">
            <div className="glass-effect rounded-xl border border-white/20 shadow-2xl p-4">
              {/* Quick Settings Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <QuickSettingButton
                  icon={Wifi}
                  label="Wi-Fi"
                  active={quickSettings.wifi}
                  onClick={() => toggleSetting('wifi')}
                />
                <QuickSettingButton
                  icon={Bluetooth}
                  label="Bluetooth"
                  active={quickSettings.bluetooth}
                  onClick={() => toggleSetting('bluetooth')}
                />
                <QuickSettingButton
                  icon={Plane}
                  label="Avion"
                  active={quickSettings.airplane}
                  onClick={() => toggleSetting('airplane')}
                />
                <QuickSettingButton
                  icon={Focus}
                  label="Focus"
                  active={quickSettings.focus}
                  onClick={() => toggleSetting('focus')}
                />
                <QuickSettingButton
                  icon={quickSettings.nightLight ? Moon : Sun}
                  label="Nuit"
                  active={quickSettings.nightLight}
                  onClick={() => toggleSetting('nightLight')}
                />
                <QuickSettingButton
                  icon={Cast}
                  label="Cast"
                  active={quickSettings.cast}
                  onClick={() => toggleSetting('cast')}
                />
              </div>

              {/* Sliders */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Sun className="w-4 h-4 text-muted-foreground" />
                  <input 
                    type="range" 
                    className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    defaultValue={80}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <input 
                    type="range" 
                    className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    defaultValue={60}
                  />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/10 transition-colors text-xs">
                  <Settings className="w-3.5 h-3.5" />
                  Paramètres
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/10 transition-colors text-xs">
                  <Accessibility className="w-3.5 h-3.5" />
                  Accessibilité
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function QuickSettingButton({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all",
        active 
          ? "bg-primary text-primary-foreground" 
          : "bg-white/5 hover:bg-white/10 text-muted-foreground"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

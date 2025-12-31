import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Settings, Volume2, VolumeX, Monitor, Moon, Sun, Palette,
  Bell, BellOff, Save, RotateCcw, Gamepad2, X
} from "lucide-react";
import { setMuted, getMuted, setVolume, getVolume } from "@/utils/soundEngine";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  onSave: () => void;
}

export function SettingsPanel({ isOpen, onClose, onReset, onSave }: SettingsPanelProps) {
  const [isMuted, setIsMuted] = useState(getMuted());
  const [volume, setLocalVolume] = useState(getVolume() * 100);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setMuted(newMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setLocalVolume(newVolume);
    setVolume(newVolume / 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 glass-effect rounded-xl border border-white/20 shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Paramètres</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Sound Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio
            </h3>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-sm">Sons</span>
              <button 
                onClick={handleMuteToggle}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isMuted ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"
                )}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3 rounded-lg bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Volume</span>
                <span className="text-xs text-muted-foreground">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </h3>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-sm">Activer les notifications</span>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  notificationsEnabled ? "bg-primary" : "bg-white/20"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                  notificationsEnabled ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </div>

          {/* Gameplay */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Gameplay
            </h3>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <span className="text-sm block">Sauvegarde automatique</span>
                <span className="text-xs text-muted-foreground">Toutes les minutes</span>
              </div>
              <button 
                onClick={() => setAutoSave(!autoSave)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  autoSave ? "bg-primary" : "bg-white/20"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                  autoSave ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Apparence
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dark', label: 'Sombre', icon: Moon },
                { id: 'light', label: 'Clair', icon: Sun },
                { id: 'system', label: 'Système', icon: Monitor },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id as any)}
                  className={cn(
                    "p-3 rounded-lg flex flex-col items-center gap-1 transition-all",
                    theme === id 
                      ? "bg-primary/20 border border-primary/50" 
                      : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex gap-2">
          <button
            onClick={onSave}
            className="flex-1 py-2 px-4 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
          <button
            onClick={onReset}
            className="py-2 px-4 bg-destructive/20 hover:bg-destructive/30 text-destructive rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

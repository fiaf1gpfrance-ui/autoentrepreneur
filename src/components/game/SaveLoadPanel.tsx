import { useState, useEffect } from 'react';
import { useGameSave, SaveSlot, GameSave } from '@/hooks/useGameSave';
import { Company } from '@/types/game';
import { GameSettings } from './CompanySetup';
import { formatCurrency } from '@/utils/gameEngine';
import { 
  Save, 
  Download, 
  Trash2, 
  Cloud, 
  HardDrive, 
  Clock, 
  Building2,
  Calendar,
  Coins,
  RefreshCw,
  Plus,
  LogIn,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SaveLoadPanelProps {
  company: Company;
  gameState: { day: number; month: number; year: number; isPaused: boolean; speed: number };
  settings: GameSettings;
  onLoad: (save: GameSave) => void;
  onClose?: () => void;
}

export function SaveLoadPanel({ company, gameState, settings, onLoad, onClose }: SaveLoadPanelProps) {
  const { 
    isLoading, 
    saves, 
    saveGame, 
    loadSavesList, 
    loadSave, 
    deleteSave, 
    isLoggedIn,
    playTime 
  } = useGameSave();

  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  const [newSaveName, setNewSaveName] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    loadSavesList();
  }, [loadSavesList]);

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = async () => {
    const name = newSaveName.trim() || `Sauvegarde ${new Date().toLocaleDateString('fr-FR')}`;
    await saveGame(company, gameState, settings, name, false);
    setNewSaveName('');
    await loadSavesList();
  };

  const handleQuickSave = async () => {
    await saveGame(company, gameState, settings, 'Sauvegarde rapide', false);
    await loadSavesList();
  };

  const handleLoad = async (save: SaveSlot) => {
    const fullSave = await loadSave(save.id, save.is_cloud);
    if (fullSave) {
      onLoad(fullSave);
      toast.success(`Partie "${save.save_name}" chargée !`);
      onClose?.();
    }
  };

  const handleDelete = async (save: SaveSlot) => {
    if (confirm(`Supprimer "${save.save_name}" ?`)) {
      await deleteSave(save.id, save.is_cloud);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` }
        });
        if (error) throw error;
        toast.success('Compte créé ! Vérifiez votre email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Connecté !');
        setShowAuth(false);
        await loadSavesList();
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur d\'authentification');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info('Déconnecté');
    await loadSavesList();
  };

  return (
    <div className="game-panel p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          <Save className="w-6 h-6 text-primary" />
          Sauvegardes
        </h2>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-success flex items-center gap-1">
                <Cloud className="w-3 h-3" /> Cloud activé
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuth(true)}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <LogIn className="w-3 h-3" /> Connexion pour sync cloud
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && !isLoggedIn && (
        <div className="bg-secondary/80 rounded-lg p-4 space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setAuthMode('login')}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm transition-colors",
                authMode === 'login' ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              Connexion
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm transition-colors",
                authMode === 'signup' ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              Inscription
            </button>
          </div>
          <form onSubmit={handleAuth} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
              required
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
              required
              minLength={6}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAuth(false)}
                className="flex-1 btn-game-secondary text-sm"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={authLoading}
                className="flex-1 btn-game-primary text-sm disabled:opacity-50"
              >
                {authLoading ? 'Chargement...' : authMode === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('save')}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",
            activeTab === 'save' ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
          )}
        >
          <Save className="w-4 h-4" /> Sauvegarder
        </button>
        <button
          onClick={() => setActiveTab('load')}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",
            activeTab === 'load' ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
          )}
        >
          <Download className="w-4 h-4" /> Charger
        </button>
      </div>

      {/* Save Tab */}
      {activeTab === 'save' && (
        <div className="space-y-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Nouvelle sauvegarde</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSaveName}
                onChange={e => setNewSaveName(e.target.value)}
                placeholder="Nom de la sauvegarde..."
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="btn-game-primary text-sm px-4 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-1 inline" /> Sauvegarder
              </button>
            </div>
          </div>

          <button
            onClick={handleQuickSave}
            disabled={isLoading}
            className="w-full btn-game-secondary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" /> Sauvegarde rapide
          </button>

          {/* Current game info */}
          <div className="bg-secondary/30 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entreprise</span>
              <span className="font-medium">{company.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jour</span>
              <span>{gameState.day}/{gameState.month}/{gameState.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trésorerie</span>
              <span className="text-success">{formatCurrency(company.treasury)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Temps de jeu</span>
              <span>{formatPlayTime(playTime)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Load Tab */}
      {activeTab === 'load' && (
        <div className="space-y-3">
          <button
            onClick={loadSavesList}
            disabled={isLoading}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} /> Actualiser
          </button>

          {saves.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Save className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Aucune sauvegarde trouvée</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {saves.map(save => (
                <div 
                  key={save.id} 
                  className="bg-secondary/50 rounded-lg p-3 hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{save.save_name}</p>
                        {save.is_cloud ? (
                          <Cloud className="w-3 h-3 text-info" />
                        ) : (
                          <HardDrive className="w-3 h-3 text-muted-foreground" />
                        )}
                        {save.is_auto_save && (
                          <span className="text-xs bg-warning/20 text-warning px-1.5 py-0.5 rounded">Auto</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {save.company_name}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleLoad(save)}
                        disabled={isLoading}
                        className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(save)}
                        disabled={isLoading}
                        className="p-2 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> J{save.day} M{save.month} A{save.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3" /> {formatCurrency(save.treasury)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatPlayTime(save.play_time)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(save.updated_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

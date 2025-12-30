import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/game';
import { GameSettings } from '@/components/game/CompanySetup';
import { toast } from 'sonner';

const LOCAL_STORAGE_KEY = 'simu_entrepreneur_save';
const AUTO_SAVE_INTERVAL = 60000; // 1 minute

export interface GameSave {
  id?: string;
  save_name: string;
  company_data: Company;
  game_state: {
    day: number;
    month: number;
    year: number;
    isPaused: boolean;
    speed: number;
    coins: number;
  };
  game_settings: GameSettings;
  created_at?: string;
  updated_at?: string;
  play_time: number;
  is_auto_save: boolean;
}

export interface SaveSlot {
  id: string;
  save_name: string;
  company_name: string;
  day: number;
  month: number;
  year: number;
  treasury: number;
  play_time: number;
  is_auto_save: boolean;
  created_at: string;
  updated_at: string;
  is_cloud: boolean;
}

export function useGameSave() {
  const [isLoading, setIsLoading] = useState(false);
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [playTime, setPlayTime] = useState(0);

  // Check auth status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Track play time
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage
  const saveToLocal = useCallback((save: GameSave): boolean => {
    try {
      const localSaves = getLocalSaves();
      const existingIndex = localSaves.findIndex(s => s.save_name === save.save_name);
      
      if (existingIndex >= 0) {
        localSaves[existingIndex] = { ...save, updated_at: new Date().toISOString() };
      } else {
        localSaves.push({ 
          ...save, 
          id: `local_${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localSaves));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }, []);

  // Get saves from localStorage
  const getLocalSaves = useCallback((): GameSave[] => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }, []);

  // Save to Cloud
  const saveToCloud = useCallback(async (save: GameSave): Promise<boolean> => {
    if (!userId) {
      console.log('No user logged in, skipping cloud save');
      return false;
    }

    try {
      const { error } = await supabase
        .from('game_saves')
        .upsert({
          user_id: userId,
          save_name: save.save_name,
          company_data: save.company_data as any,
          game_state: save.game_state as any,
          game_settings: save.game_settings as any,
          play_time: save.play_time,
          is_auto_save: save.is_auto_save,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,save_name'
        });

      if (error) {
        // If conflict on unique constraint, try update instead
        const { error: updateError } = await supabase
          .from('game_saves')
          .update({
            company_data: save.company_data as any,
            game_state: save.game_state as any,
            game_settings: save.game_settings as any,
            play_time: save.play_time,
            is_auto_save: save.is_auto_save,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('save_name', save.save_name);

        if (updateError) throw updateError;
      }

      return true;
    } catch (error) {
      console.error('Error saving to cloud:', error);
      return false;
    }
  }, [userId]);

  // Main save function
  const saveGame = useCallback(async (
    company: Company,
    gameState: { day: number; month: number; year: number; isPaused: boolean; speed: number },
    settings: GameSettings,
    saveName: string = 'Sauvegarde rapide',
    isAutoSave: boolean = false
  ): Promise<boolean> => {
    setIsLoading(true);

    const save: GameSave = {
      save_name: saveName,
      company_data: company,
      game_state: { ...gameState, coins: company.coins || 0 },
      game_settings: settings,
      play_time: playTime,
      is_auto_save: isAutoSave
    };

    // Always save to localStorage
    const localSuccess = saveToLocal(save);

    // Try to save to cloud if logged in
    let cloudSuccess = false;
    if (userId) {
      cloudSuccess = await saveToCloud(save);
    }

    setIsLoading(false);

    if (localSuccess) {
      if (cloudSuccess) {
        if (!isAutoSave) toast.success('Partie sauvegardée (local + cloud)');
      } else {
        if (!isAutoSave) toast.success('Partie sauvegardée localement');
      }
      return true;
    }

    toast.error('Erreur lors de la sauvegarde');
    return false;
  }, [playTime, saveToLocal, saveToCloud, userId]);

  // Load saves list
  const loadSavesList = useCallback(async () => {
    setIsLoading(true);
    const allSaves: SaveSlot[] = [];

    // Load local saves
    const localSaves = getLocalSaves();
    localSaves.forEach(save => {
      allSaves.push({
        id: save.id || `local_${Date.now()}`,
        save_name: save.save_name,
        company_name: save.company_data.name,
        day: save.game_state.day,
        month: save.game_state.month,
        year: save.game_state.year,
        treasury: save.company_data.treasury,
        play_time: save.play_time,
        is_auto_save: save.is_auto_save,
        created_at: save.created_at || new Date().toISOString(),
        updated_at: save.updated_at || new Date().toISOString(),
        is_cloud: false
      });
    });

    // Load cloud saves if logged in
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('game_saves')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!error && data) {
          data.forEach(save => {
            const companyData = save.company_data as any;
            const gameState = save.game_state as any;
            allSaves.push({
              id: save.id,
              save_name: save.save_name,
              company_name: companyData?.name || 'Entreprise',
              day: gameState?.day || 1,
              month: gameState?.month || 1,
              year: gameState?.year || 2024,
              treasury: companyData?.treasury || 0,
              play_time: save.play_time,
              is_auto_save: save.is_auto_save,
              created_at: save.created_at,
              updated_at: save.updated_at,
              is_cloud: true
            });
          });
        }
      } catch (error) {
        console.error('Error loading cloud saves:', error);
      }
    }

    // Sort by updated_at
    allSaves.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    
    setSaves(allSaves);
    setIsLoading(false);
  }, [getLocalSaves, userId]);

  // Load a specific save
  const loadSave = useCallback(async (saveId: string, isCloud: boolean): Promise<GameSave | null> => {
    setIsLoading(true);

    try {
      if (isCloud && userId) {
        const { data, error } = await supabase
          .from('game_saves')
          .select('*')
          .eq('id', saveId)
          .eq('user_id', userId)
          .single();

        if (error) throw error;

        setIsLoading(false);
        return {
          id: data.id,
          save_name: data.save_name,
          company_data: data.company_data as unknown as Company,
          game_state: data.game_state as unknown as GameSave['game_state'],
          game_settings: data.game_settings as unknown as GameSettings,
          play_time: data.play_time,
          is_auto_save: data.is_auto_save,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
      } else {
        const localSaves = getLocalSaves();
        const save = localSaves.find(s => s.id === saveId);
        setIsLoading(false);
        return save || null;
      }
    } catch (error) {
      console.error('Error loading save:', error);
      setIsLoading(false);
      toast.error('Erreur lors du chargement');
      return null;
    }
  }, [getLocalSaves, userId]);

  // Delete a save
  const deleteSave = useCallback(async (saveId: string, isCloud: boolean): Promise<boolean> => {
    setIsLoading(true);

    try {
      if (isCloud && userId) {
        const { error } = await supabase
          .from('game_saves')
          .delete()
          .eq('id', saveId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const localSaves = getLocalSaves();
        const filtered = localSaves.filter(s => s.id !== saveId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      }

      await loadSavesList();
      toast.success('Sauvegarde supprimée');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error deleting save:', error);
      toast.error('Erreur lors de la suppression');
      setIsLoading(false);
      return false;
    }
  }, [getLocalSaves, loadSavesList, userId]);

  // Quick load (most recent save)
  const quickLoad = useCallback(async (): Promise<GameSave | null> => {
    await loadSavesList();
    if (saves.length === 0) {
      toast.info('Aucune sauvegarde trouvée');
      return null;
    }
    return loadSave(saves[0].id, saves[0].is_cloud);
  }, [loadSave, loadSavesList, saves]);

  return {
    isLoading,
    saves,
    userId,
    playTime,
    saveGame,
    loadSavesList,
    loadSave,
    deleteSave,
    quickLoad,
    isLoggedIn: !!userId
  };
}

import { useState, useEffect } from "react";
import { GameState } from "@/types/game";
import { createInitialState, loadGame, saveGame } from "@/utils/gameEngine";
import { CompanySetup, GameSettings } from "@/components/game/CompanySetup";
import { GameDashboard } from "@/components/game/GameDashboard";

const Index = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load saved game
    const savedGame = loadGame();
    if (savedGame && savedGame.company) {
      setGameState(savedGame);
    } else {
      setGameState(createInitialState());
    }
    setIsLoading(false);
  }, []);

  const handleCompanyCreated = (company: GameState['company'], settings: GameSettings) => {
    const newState: GameState = {
      ...createInitialState(),
      company,
      isPaused: false,
      difficulty: settings.difficulty === 'tutorial' ? 'facile' : 
                  settings.difficulty === 'easy' ? 'facile' :
                  settings.difficulty === 'hard' ? 'difficile' :
                  settings.difficulty === 'hardcore' ? 'hardcore' : 'normal',
    };
    setGameState(newState);
    saveGame(newState);
  };

  const handleReset = () => {
    localStorage.removeItem('simu_entrepreneur_save');
    setGameState(createInitialState());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-pulse">
          <h1 className="text-2xl font-display font-bold text-primary text-glow">
            Chargement...
          </h1>
        </div>
      </div>
    );
  }

  if (!gameState) return null;

  if (!gameState.company) {
    return <CompanySetup onComplete={handleCompanyCreated} />;
  }

  return (
    <GameDashboard 
      initialState={gameState} 
      onReset={handleReset}
    />
  );
};

export default Index;

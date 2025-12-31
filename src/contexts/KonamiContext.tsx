import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { toast } from 'sonner';

interface KonamiContextType {
  konamiActive: boolean;
  activateKonami: () => void;
}

const KonamiContext = createContext<KonamiContextType | null>(null);

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

export function KonamiProvider({ children }: { children: ReactNode }) {
  const [konamiActive, setKonamiActive] = useState(false);
  const konamiSequenceRef = useRef<string[]>([]);

  const activateKonami = () => {
    if (!konamiActive) {
      setKonamiActive(true);
      toast.success('🎮 KONAMI CODE ACTIVÉ ! Mode protégé : crédibilité boostée, faillite impossible !', { duration: 5000 });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Add key to sequence and keep only last 10
      konamiSequenceRef.current = [...konamiSequenceRef.current, e.code].slice(-10);
      
      // Check if konami code matches
      if (konamiSequenceRef.current.length === 10) {
        const matches = konamiSequenceRef.current.every((key, i) => key === KONAMI_CODE[i]);
        if (matches && !konamiActive) {
          activateKonami();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiActive]);

  return (
    <KonamiContext.Provider value={{ konamiActive, activateKonami }}>
      {children}
      
      {/* Konami Code Golden Border - Global */}
      {konamiActive && (
        <>
          <div className="fixed top-0 left-0 right-0 h-[10px] bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 z-[9999] animate-pulse shadow-lg shadow-yellow-500/50" />
          <div className="fixed bottom-0 left-0 right-0 h-[10px] bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 z-[9999] animate-pulse shadow-lg shadow-yellow-500/50" />
          <div className="fixed top-0 left-0 bottom-0 w-[10px] bg-gradient-to-b from-yellow-500 via-yellow-300 to-yellow-500 z-[9999] animate-pulse shadow-lg shadow-yellow-500/50" />
          <div className="fixed top-0 right-0 bottom-0 w-[10px] bg-gradient-to-b from-yellow-500 via-yellow-300 to-yellow-500 z-[9999] animate-pulse shadow-lg shadow-yellow-500/50" />
        </>
      )}
    </KonamiContext.Provider>
  );
}

export function useKonami() {
  const context = useContext(KonamiContext);
  if (!context) {
    throw new Error('useKonami must be used within a KonamiProvider');
  }
  return context;
}

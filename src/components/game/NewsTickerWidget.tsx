import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Newspaper, TrendingUp, TrendingDown, AlertTriangle, Sparkles, Globe } from "lucide-react";

interface NewsItem {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'breaking';
  headline: string;
  impact?: string;
}

interface NewsTickerWidgetProps {
  economicWeather: 'croissance' | 'stable' | 'recession' | 'crise';
  day: number;
}

const baseNews: NewsItem[] = [
  { id: '1', type: 'positive', headline: "La bourse atteint de nouveaux sommets", impact: "+2% marchés" },
  { id: '2', type: 'negative', headline: "Tensions géopolitiques: incertitude sur les marchés", impact: "Volatilité accrue" },
  { id: '3', type: 'neutral', headline: "Nouvelles réglementations fiscales en discussion", impact: "À surveiller" },
  { id: '4', type: 'positive', headline: "Boom du secteur technologique", impact: "+5% tech" },
  { id: '5', type: 'breaking', headline: "FLASH: Fusion majeure dans le secteur bancaire", impact: "Restructuration" },
  { id: '6', type: 'negative', headline: "Inflation en hausse: BCE prudente", impact: "Taux stables" },
  { id: '7', type: 'positive', headline: "Export record pour l'industrie française", impact: "Balance positive" },
  { id: '8', type: 'neutral', headline: "Conférence internationale sur le climat", impact: "Nouvelles normes" },
];

const crisisNews: NewsItem[] = [
  { id: 'c1', type: 'breaking', headline: "ALERTE: Crash boursier, -8% en une séance", impact: "Panique marchés" },
  { id: 'c2', type: 'negative', headline: "Faillites en série dans le secteur bancaire", impact: "Crise confiance" },
  { id: 'c3', type: 'negative', headline: "Chômage en forte hausse", impact: "Consommation -5%" },
];

const boomNews: NewsItem[] = [
  { id: 'b1', type: 'positive', headline: "Euphorie sur les marchés, records historiques", impact: "+15% annuel" },
  { id: 'b2', type: 'positive', headline: "Investissements étrangers massifs en France", impact: "Croissance +3%" },
  { id: 'b3', type: 'breaking', headline: "IPO record: valorisation x10 en 6 mois", impact: "Bulle tech?" },
];

export function NewsTickerWidget({ economicWeather, day }: NewsTickerWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [news, setNews] = useState<NewsItem[]>(baseNews);

  useEffect(() => {
    let newsPool = [...baseNews];
    if (economicWeather === 'crise') {
      newsPool = [...crisisNews, ...baseNews.filter(n => n.type === 'negative')];
    } else if (economicWeather === 'croissance') {
      newsPool = [...boomNews, ...baseNews.filter(n => n.type === 'positive')];
    }
    setNews(newsPool);
  }, [economicWeather]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % news.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [news.length]);

  const currentNews = news[currentIndex];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'positive': return <TrendingUp className="w-3.5 h-3.5 text-success" />;
      case 'negative': return <TrendingDown className="w-3.5 h-3.5 text-destructive" />;
      case 'breaking': return <AlertTriangle className="w-3.5 h-3.5 text-warning animate-pulse" />;
      default: return <Globe className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-success/10 border-success/20';
      case 'negative': return 'bg-destructive/10 border-destructive/20';
      case 'breaking': return 'bg-warning/10 border-warning/20';
      default: return 'bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Newspaper className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium">Actualités économiques</span>
        <span className="text-[10px] text-muted-foreground ml-auto">Jour {day}</span>
      </div>

      <div className={cn(
        "p-3 rounded-lg border transition-all duration-500",
        getTypeBg(currentNews.type)
      )}>
        <div className="flex items-start gap-2">
          {getTypeIcon(currentNews.type)}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium leading-tight mb-1">{currentNews.headline}</p>
            {currentNews.impact && (
              <span className="text-[10px] text-muted-foreground">
                Impact: {currentNews.impact}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1">
        {news.slice(0, 5).map((_, i) => (
          <div 
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all",
              i === currentIndex % 5 ? "bg-primary w-3" : "bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );
}

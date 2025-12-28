import { useState } from "react";
import { ShoppingCart, Coins, Gem, Star, Package, Sparkles, Gift, Crown, Zap, Clock, Shield } from "lucide-react";
import { 
  getShopItems, 
  purchaseItem, 
  useItem,
  updateActiveBoosts,
  ShopItem,
  PlayerInventory,
  ItemCategory,
  ItemRarity,
} from "@/utils/shopEngine";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ShopPanelProps {
  treasury: number;
  onPurchase: (itemId: string, cost: number, currency: 'coins' | 'gems') => void;
}

const categoryConfig: Record<ItemCategory, { label: string; icon: typeof ShoppingCart }> = {
  boost: { label: "Boosts", icon: Zap },
  upgrade: { label: "Améliorations", icon: Sparkles },
  resource: { label: "Ressources", icon: Package },
  cosmetic: { label: "Cosmétiques", icon: Crown },
  pack: { label: "Packs", icon: Gift },
  premium: { label: "Premium", icon: Star },
  seasonal: { label: "Saisonnier", icon: Clock },
  limited: { label: "Limité", icon: Shield },
};

const rarityColors: Record<ItemRarity, string> = {
  common: "border-border",
  uncommon: "border-success",
  rare: "border-primary",
  epic: "border-purple-500",
  legendary: "border-amber-400",
};

const rarityLabels: Record<ItemRarity, string> = {
  common: "Commun",
  uncommon: "Peu commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
};

const createDefaultInventory = (): PlayerInventory => ({
  coins: 5000,
  gems: 50,
  prestigeTokens: 0,
  items: [],
  activeBoosts: [],
});

export function ShopPanel({ treasury, onPurchase }: ShopPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [inventory, setInventory] = useState<PlayerInventory>(() => createDefaultInventory());
  const [searchTerm, setSearchTerm] = useState("");
  
  const allItems = getShopItems();
  const activeBoosts = updateActiveBoosts(inventory).activeBoosts;
  
  const filteredItems = allItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePurchase = (item: ShopItem) => {
    const currency = item.currency === 'coins' ? inventory.coins : 
                    item.currency === 'gems' ? inventory.gems : inventory.prestigeTokens;
    
    if (currency < item.price) {
      toast.error(`${item.currency === 'coins' ? 'Pièces' : 'Gemmes'} insuffisantes !`);
      return;
    }
    
    const result = purchaseItem(inventory, item.id);
    if (result.success) {
      setInventory(result.inventory);
      onPurchase(item.id, item.price, item.currency as 'coins' | 'gems');
      toast.success(`${item.name} acheté !`);
    }
  };

  const handleActivateBoost = (itemId: string) => {
    const result = useItem(inventory, itemId);
    if (result.success) {
      setInventory(result.inventory);
      toast.success("Boost activé !");
    }
  };

  const getOwnedQuantity = (itemId: string) => {
    return inventory.items.find(i => i.itemId === itemId)?.quantity || 0;
  };

  const formatPrice = (price: number, currency: string) => {
    return currency === 'coins' ? `${price.toLocaleString()} 🪙` : 
           currency === 'gems' ? `${price} 💎` : `${price} 🏆`;
  };

  return (
    <div className="space-y-6">
      {/* Header with currencies */}
      <div className="game-panel">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h2 className="font-display font-bold text-xl">Boutique</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-400">{inventory.coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-500/20 px-3 py-1.5 rounded-full">
              <Gem className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-purple-400">{inventory.gems}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-primary/20 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">{inventory.prestigeTokens}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Boosts */}
      {activeBoosts.length > 0 && (
        <div className="game-panel">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-success" />
            Boosts Actifs ({activeBoosts.length})
          </h3>
          <div className="flex gap-2 flex-wrap">
            {activeBoosts.map(boost => {
              const item = allItems.find(i => i.id === boost.itemId);
              const remaining = Math.ceil((boost.expiresAt - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div key={boost.itemId} className="bg-success/20 border border-success/40 rounded-lg px-3 py-2 flex items-center gap-2">
                  <span>{item?.icon}</span>
                  <span className="text-sm font-medium">{item?.name}</span>
                  <span className="text-xs text-muted-foreground">({remaining}j)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Categories */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Rechercher un article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-secondary rounded-lg text-sm border border-border focus:outline-none focus:border-primary"
        />
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              selectedCategory === 'all' ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
            )}
          >
            Tous
          </button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as ItemCategory)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1",
                selectedCategory === key ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
              )}
            >
              <config.icon className="w-3 h-3" />
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map(item => {
          const owned = getOwnedQuantity(item.id);
          const canPurchase = item.currency === 'coins' ? inventory.coins >= item.price :
                             item.currency === 'gems' ? inventory.gems >= item.price : 
                             inventory.prestigeTokens >= item.price;
          
          return (
            <div
              key={item.id}
              className={cn(
                "game-panel border-2 transition-all hover:scale-[1.02]",
                rarityColors[item.rarity],
                item.discountPercent && "ring-2 ring-destructive"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{item.icon}</div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold",
                    item.rarity === 'legendary' ? "bg-amber-400/20 text-amber-400" :
                    item.rarity === 'epic' ? "bg-purple-500/20 text-purple-400" :
                    item.rarity === 'rare' ? "bg-primary/20 text-primary" :
                    item.rarity === 'uncommon' ? "bg-success/20 text-success" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {rarityLabels[item.rarity]}
                  </span>
                  {item.duration && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {item.duration}j
                    </span>
                  )}
                </div>
              </div>

              {/* Name & Description */}
              <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

              {/* Price & Actions */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                <div className="flex flex-col">
                  {item.discountPercent && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      {formatPrice(Math.round(item.price / (1 - item.discountPercent / 100)), item.currency)}
                    </span>
                  )}
                  <span className={cn(
                    "font-bold text-sm",
                    item.currency === 'coins' ? "text-amber-400" : 
                    item.currency === 'gems' ? "text-purple-400" : "text-primary"
                  )}>
                    {formatPrice(item.price, item.currency)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {owned > 0 && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded">x{owned}</span>
                  )}
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!canPurchase || (item.limitedStock !== undefined && owned >= item.limitedStock)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                      canPurchase ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    Acheter
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="game-panel text-center py-12">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Aucun article trouvé</p>
        </div>
      )}

      {/* Inventory Section */}
      <div className="game-panel">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Inventaire ({inventory.items.reduce((sum, i) => sum + i.quantity, 0)} articles)
        </h3>
        {inventory.items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Votre inventaire est vide</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {inventory.items.map(owned => {
              const item = allItems.find(i => i.id === owned.itemId);
              if (!item) return null;
              const isBoost = item.category === 'boost';
              const isActive = activeBoosts.some(b => b.itemId === item.id);
              
              return (
                <div
                  key={owned.itemId}
                  className={cn(
                    "relative bg-secondary rounded-lg p-2 text-center cursor-pointer hover:bg-secondary/80 transition-colors",
                    isActive && "ring-2 ring-success"
                  )}
                  onClick={() => isBoost && !isActive && handleActivateBoost(item.id)}
                  title={isBoost ? "Cliquer pour activer" : item.name}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {owned.quantity}
                  </div>
                  <p className="text-[10px] truncate mt-1">{item.name}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

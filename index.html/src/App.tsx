import React, { useState, useEffect, useMemo } from 'react';
import { Perfume, StoreSettings, FilterState } from './types';
import { INITIAL_PERFUMES, DEFAULT_STORE_SETTINGS } from './data/initialPerfumes';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { AdminPanel } from './components/AdminPanel';
import { BottomNav } from './components/BottomNav';
import { ConsultantBanner } from './components/ConsultantBanner';
import { Heart, AlertCircle, RefreshCw } from 'lucide-react';

const STORAGE_KEY_PERFUMES = 'aromaboutik_catalog_items_v1';
const STORAGE_KEY_SETTINGS = 'aromaboutik_store_settings_v1';
const STORAGE_KEY_FAVORITES = 'aromaboutik_favorites_v1';

export default function App() {
  // 1. Perfumes catalog state with LocalStorage persistence & defensive sanitization
  const [perfumes, setPerfumes] = useState<Perfume[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PERFUMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => ({
            id: item.id || `perfume-${idx}-${Date.now()}`,
            name: item.name || 'Без названия',
            brand: item.brand || 'Селектив',
            price: typeof item.price === 'number' && !isNaN(item.price) ? item.price : 2000,
            currency: item.currency || 'с.',
            gender: item.gender || 'Унисекс',
            category: item.category || 'Нишевая парфюмерия',
            fragranceFamily: item.fragranceFamily || 'Восточные',
            volume: item.volume || '50 мл',
            concentration: item.concentration || 'Eau de Parfum',
            description: item.description || '',
            topNotes: Array.isArray(item.topNotes) ? item.topNotes : [],
            heartNotes: Array.isArray(item.heartNotes) ? item.heartNotes : [],
            baseNotes: Array.isArray(item.baseNotes) ? item.baseNotes : [],
            imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
            inStock: item.inStock !== false,
            isFeatured: !!item.isFeatured,
            isNew: !!item.isNew,
            country: item.country || 'Франция',
            year: item.year || 2023,
            createdAt: item.createdAt || Date.now()
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load perfumes from localStorage', e);
    }
    return INITIAL_PERFUMES;
  });

  // 2. Store & WhatsApp Settings with defensive defaults
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_STORE_SETTINGS,
            ...parsed
          };
        }
      }
    } catch (e) {
      console.error('Failed to load store settings from localStorage', e);
    }
    return DEFAULT_STORE_SETTINGS;
  });

  // 3. Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
    return [];
  });

  // 4. Navigation Tab state
  const [activeTab, setActiveTab] = useState<'catalog' | 'favorites' | 'admin'>('catalog');

  // Save to localStorage when states change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PERFUMES, JSON.stringify(perfumes));
    } catch (e) {
      console.error('Failed to persist perfumes', e);
    }
  }, [perfumes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to persist settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to persist favorites', e);
    }
  }, [favorites]);

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 5. UI Modal States
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [editingPerfumeId, setEditingPerfumeId] = useState<string | null>(null);

  // 6. Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    brand: 'all',
    gender: 'all',
    fragranceFamily: 'all',
    note: 'all',
    priceRange: [0, 100000],
    inStockOnly: false,
    sortBy: 'featured',
  });

  // Handle filter changes
  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      brand: 'all',
      gender: 'all',
      fragranceFamily: 'all',
      note: 'all',
      priceRange: [0, 100000],
      inStockOnly: false,
      sortBy: 'featured',
    });
  };

  // Filter & Sort computation
  const filteredPerfumes = useMemo(() => {
    const listToFilter = activeTab === 'favorites' 
      ? perfumes.filter(p => favorites.includes(p.id))
      : perfumes;

    return listToFilter.filter(item => {
      // 1. Text search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const inName = item.name.toLowerCase().includes(query);
        const inBrand = item.brand.toLowerCase().includes(query);
        const inDesc = item.description?.toLowerCase().includes(query) || false;
        const inNotes = [
          ...(item.topNotes || []),
          ...(item.heartNotes || []),
          ...(item.baseNotes || [])
        ].some(note => note.toLowerCase().includes(query));
        const inCategory = item.category?.toLowerCase().includes(query) || false;

        if (!inName && !inBrand && !inDesc && !inNotes && !inCategory) {
          return false;
        }
      }

      // 2. Gender / Audience filter
      if (filters.gender !== 'all' && item.gender !== filters.gender) {
        return false;
      }

      // 3. In stock only
      if (filters.inStockOnly && !item.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'featured') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [perfumes, favorites, activeTab, filters]);

  // Admin Actions
  const handleSavePerfume = (savedPerfume: Perfume) => {
    setPerfumes(prev => {
      const index = prev.findIndex(p => p.id === savedPerfume.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = savedPerfume;
        return next;
      } else {
        return [savedPerfume, ...prev];
      }
    });
  };

  const handleDeletePerfume = (id: string) => {
    setPerfumes(prev => prev.filter(p => p.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
    if (selectedPerfume?.id === id) {
      setSelectedPerfume(null);
    }
  };

  const handleUpdateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  const handleResetCatalog = () => {
    setPerfumes(INITIAL_PERFUMES);
    setSettings(DEFAULT_STORE_SETTINGS);
    setFavorites([]);
  };

  const handleImportCatalog = (newPerfumes: Perfume[]) => {
    setPerfumes(newPerfumes);
  };

  const handleEditFromCard = (perfume: Perfume) => {
    setEditingPerfumeId(perfume.id);
    setIsAdminOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121316] text-white selection:bg-amber-400 selection:text-black pb-20">
      
      {/* 1. Header with Search Bar matching screenshot */}
      <Header
        settings={settings}
        totalPerfumesCount={perfumes.length}
        favoritesCount={favorites.length}
        filters={filters}
        onFilterChange={handleFilterChange}
        isAdminOpen={isAdminOpen}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'admin') {
            setIsAdminOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5">
        
        {/* Section Header if in Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="mb-4 flex items-center justify-between bg-[#1B1C20] p-3.5 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                Избранные ароматы ({favorites.length})
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Вернуться в каталог
            </button>
          </div>
        )}

        {/* 3. Product Cards Grid (Matching the exact 2-column mobile marketplace style in photo) */}
        {filteredPerfumes.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredPerfumes.map((perfume) => (
              <ProductCard
                key={perfume.id}
                perfume={perfume}
                settings={settings}
                isFavorite={favorites.includes(perfume.id)}
                onToggleFavorite={handleToggleFavorite}
                onOpenDetails={(p) => setSelectedPerfume(p)}
                onEdit={handleEditFromCard}
                isAdminMode={isAdminOpen}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-[#1B1C20] rounded-2xl border border-zinc-800 p-8 text-center max-w-md mx-auto my-8 shadow-md">
            <AlertCircle className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              {activeTab === 'favorites' ? 'В избранном пока пусто' : 'Ароматы не найдены'}
            </h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              {activeTab === 'favorites'
                ? 'Нажмите на иконку сердечка на карточке любого аромата, чтобы сохранить его сюда.'
                : 'Попробуйте изменить поисковый запрос или сбросить фильтры.'}
            </p>
            <button
              onClick={() => {
                setActiveTab('catalog');
                handleResetFilters();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Показать все ароматы</span>
            </button>
          </div>
        )}

        {/* 4. Perfume Concierge Banner */}
        <ConsultantBanner settings={settings} />

      </main>

      {/* 5. Bottom Navigation Bar (Matching exact photo navigation: Поиск, Избранное, WhatsApp, Админ) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'admin') {
            setIsAdminOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        favoritesCount={favorites.length}
        settings={settings}
      />

      {/* 6. Product Details & Olfactory Pyramid Modal */}
      {selectedPerfume && (
        <ProductModal
          perfume={selectedPerfume}
          settings={settings}
          onClose={() => setSelectedPerfume(null)}
          onEdit={handleEditFromCard}
          isAdminMode={isAdminOpen}
        />
      )}

      {/* 7. Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanel
          perfumes={perfumes}
          settings={settings}
          onSavePerfume={handleSavePerfume}
          onDeletePerfume={handleDeletePerfume}
          onUpdateSettings={handleUpdateSettings}
          onResetCatalog={handleResetCatalog}
          onImportCatalog={handleImportCatalog}
          onClose={() => {
            setIsAdminOpen(false);
            setEditingPerfumeId(null);
          }}
          editingPerfumeId={editingPerfumeId}
          onClearEditingPerfume={() => setEditingPerfumeId(null)}
        />
      )}

    </div>
  );
}

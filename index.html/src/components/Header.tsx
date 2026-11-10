import React from 'react';
import { Search, Sparkles, MessageCircle, Settings, ShieldCheck, Heart, X, Check } from 'lucide-react';
import { StoreSettings, FilterState } from '../types';
import { getGeneralWhatsAppLink } from '../utils/whatsapp';
import { Logo } from './Logo';

interface HeaderProps {
  settings: StoreSettings;
  totalPerfumesCount: number;
  favoritesCount: number;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
  activeTab: 'catalog' | 'favorites' | 'admin';
  onSelectTab: (tab: 'catalog' | 'favorites' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  totalPerfumesCount,
  favoritesCount,
  filters,
  onFilterChange,
  isAdminOpen,
  onToggleAdmin,
  activeTab,
  onSelectTab,
}) => {
  const generalWhatsAppUrl = getGeneralWhatsAppLink(settings);

  return (
    <header className="sticky top-0 z-30 bg-[#131417]/95 backdrop-blur-xl border-b border-zinc-800/80 transition-all">
      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 pb-2.5">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          {/* Logo & Store Name */}
          <div 
            id="header-brand-logo"
            onClick={() => onSelectTab('catalog')}
            className="cursor-pointer select-none"
          >
            <Logo
              variant="compact"
              customLogoUrl={settings.logoUrl}
              storeName={settings.storeName || "AromaBoutik"}
              tagline={settings.tagline || "МАГАЗИН ИЗЫСКАННЫХ АРОМАТОВ"}
            />
          </div>

          {/* Action Buttons: WhatsApp & Admin */}
          <div className="flex items-center gap-2">
            {/* Favorites Icon Button with Counter */}
            <button
              onClick={() => onSelectTab(activeTab === 'favorites' ? 'catalog' : 'favorites')}
              className={`relative p-2 rounded-xl border transition-all ${
                activeTab === 'favorites'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-[#1E2025] border-zinc-800 text-zinc-300 hover:text-white'
              }`}
              title="Избранные ароматы"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center px-1">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Direct WhatsApp Consultant */}
            <a
              id="header-whatsapp-btn"
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all shadow-sm active:scale-98"
              title="Консультация в WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Admin toggle */}
            <button
              id="header-admin-toggle-btn"
              onClick={onToggleAdmin}
              className={`p-2 rounded-xl border transition-all ${
                isAdminOpen 
                  ? 'bg-white text-black border-white' 
                  : 'bg-[#1E2025] text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
              }`}
              title="Панель администратора"
            >
              {isAdminOpen ? (
                <ShieldCheck className="w-4 h-4 text-black" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar matching the exact screenshot (dark rounded box with search icon) */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            id="search-perfumes-input"
            type="text"
            placeholder={`Поиск по ${totalPerfumesCount} ароматам, нотам и брендам...`}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-9 py-2.5 bg-[#202226] hover:bg-[#26282E] focus:bg-[#202226] text-sm text-white placeholder-zinc-400 rounded-xl border border-zinc-800/90 focus:border-zinc-600 focus:outline-none transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Category / Filter Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none no-scrollbar">
          {[
            { id: 'all', label: 'Все' },
            { id: 'Унисекс', label: 'Унисекс' },
            { id: 'Женский', label: 'Для нее' },
            { id: 'Мужской', label: 'Для него' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ gender: cat.id })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filters.gender === cat.id
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-[#1E2025] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* In-Stock filter chip */}
          <button
            onClick={() => onFilterChange({ inStockOnly: !filters.inStockOnly })}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
              filters.inStockOnly
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-[#1E2025] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Check className={`w-3 h-3 ${filters.inStockOnly ? 'opacity-100' : 'opacity-30'}`} />
            <span>В наличии</span>
          </button>
        </div>
      </div>
    </header>
  );
};

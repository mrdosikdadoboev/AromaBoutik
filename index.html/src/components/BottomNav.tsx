import React from 'react';
import { Search, Heart, MessageCircle, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../types';
import { getGeneralWhatsAppLink } from '../utils/whatsapp';

interface BottomNavProps {
  activeTab: 'catalog' | 'favorites' | 'admin';
  onSelectTab: (tab: 'catalog' | 'favorites' | 'admin') => void;
  favoritesCount: number;
  settings: StoreSettings;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  settings,
}) => {
  const whatsAppUrl = getGeneralWhatsAppLink(settings);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#131417]/95 backdrop-blur-xl border-t border-zinc-800/80 py-1.5 px-4 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Tab 1: Search / Catalog */}
        <button
          onClick={() => onSelectTab('catalog')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'catalog'
              ? 'text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'catalog' ? 'text-white' : ''}`}>
            <Search className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold">Поиск</span>
        </button>

        {/* Tab 2: Favorites (Избранное) */}
        <button
          onClick={() => onSelectTab('favorites')}
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'favorites'
              ? 'text-rose-400'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className="p-1 relative">
            <Heart className={`w-5 h-5 ${activeTab === 'favorites' || favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute 0 right-0 min-w-[14px] h-3.5 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center px-0.5">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">Избранное</span>
        </button>

        {/* Tab 3: WhatsApp Chat */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-zinc-500 hover:text-[#25D366] transition-colors"
        >
          <div className="p-1">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
          </div>
          <span className="text-[10px] font-semibold text-[#25D366]">WhatsApp</span>
        </a>

        {/* Tab 4: Profile / Admin */}
        <button
          onClick={() => onSelectTab('admin')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'admin'
              ? 'text-amber-400'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className="p-1">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold">Админ</span>
        </button>
      </div>
    </nav>
  );
};

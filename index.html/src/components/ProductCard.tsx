import React from 'react';
import { MessageCircle, Heart, Sparkles, Edit2, Check } from 'lucide-react';
import { Perfume, StoreSettings } from '../types';
import { getPerfumeWhatsAppLink } from '../utils/whatsapp';

interface ProductCardProps {
  perfume: Perfume;
  settings: StoreSettings;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onOpenDetails: (perfume: Perfume) => void;
  onEdit?: (perfume: Perfume) => void;
  isAdminMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  perfume,
  settings,
  isFavorite = false,
  onToggleFavorite,
  onOpenDetails,
  onEdit,
  isAdminMode = false
}) => {
  const whatsAppLink = getPerfumeWhatsAppLink(perfume, settings);

  const topNotes = Array.isArray(perfume.topNotes) ? perfume.topNotes : [];
  const heartNotes = Array.isArray(perfume.heartNotes) ? perfume.heartNotes : [];
  const baseNotes = Array.isArray(perfume.baseNotes) ? perfume.baseNotes : [];

  const previewNotes = [
    ...topNotes.slice(0, 2),
    ...heartNotes.slice(0, 1),
    ...baseNotes.slice(0, 1)
  ].slice(0, 3);

  const priceNumber = typeof perfume.price === 'number' && !isNaN(perfume.price) ? perfume.price : 0;
  const formattedPrice = priceNumber.toLocaleString('ru-RU');
  const currencySymbol = perfume.currency || settings?.currency || 'с.';

  const brandInitials = perfume.brand
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'PF';

  return (
    <div 
      id={`product-card-${perfume.id}`}
      className="group relative flex flex-col bg-[#1B1C20] rounded-2xl p-2.5 sm:p-3 border border-zinc-800/80 shadow-md hover:border-zinc-700 transition-all duration-200"
    >
      {/* Image Container with Top Badge & Mini Brand Avatar (Matching Screenshot) */}
      <div 
        className="relative w-full aspect-square bg-zinc-900 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center" 
        onClick={() => onOpenDetails(perfume)}
      >
        <img
          src={perfume.imageUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'}
          alt={`${perfume.brand} ${perfume.name}`}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Yellow "ТОП" Badge on Top-Left (Exact styling from photo) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {perfume.isFeatured ? (
            <span className="inline-block px-2 py-0.5 rounded bg-[#FFCC00] text-black font-extrabold text-[10px] sm:text-xs tracking-wider shadow-sm">
              ТОП
            </span>
          ) : perfume.isNew ? (
            <span className="inline-block px-2 py-0.5 rounded bg-[#FFCC00] text-black font-extrabold text-[10px] sm:text-xs tracking-wider shadow-sm">
              NEW
            </span>
          ) : (
            <span className="inline-block px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-zinc-200 font-semibold text-[9px] sm:text-[10px]">
              {perfume.gender}
            </span>
          )}
        </div>

        {/* Brand Logo Avatar Badge on Top-Right (Exact styling from photo) */}
        <div className="absolute top-2 right-2 z-10">
          <div 
            className="w-6 h-6 sm:w-7 sm:h-7 bg-black/85 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/15 text-[9px] font-bold text-amber-400 shadow-md"
            title={perfume.brand}
          >
            {brandInitials}
          </div>
        </div>

        {/* In-stock pill */}
        {perfume.inStock && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-emerald-400 text-[9px] font-medium border border-emerald-500/30">
              <Check className="w-2.5 h-2.5" />
              В наличии
            </span>
          </div>
        )}

        {/* Admin edit button */}
        {isAdminMode && onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(perfume);
            }}
            className="absolute bottom-2 right-2 z-20 p-1.5 bg-black/80 hover:bg-white hover:text-black rounded-lg text-white shadow-md border border-white/20 transition-colors"
            title="Редактировать"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Card Body (Photo Layout: Bold Price + Heart, Title, Subtitle, WhatsApp CTA) */}
      <div className="flex-1 flex flex-col justify-between pt-2.5">
        <div>
          {/* Row 1: Price and Heart Icon */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              {formattedPrice} <span className="text-xs sm:text-sm font-semibold text-zinc-300">{currencySymbol}</span>
            </div>

            <button
              id={`fav-btn-${perfume.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(perfume.id);
              }}
              className="p-1 text-zinc-400 hover:text-rose-500 active:scale-90 transition-all"
              title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
              aria-label="Избранное"
            >
              <Heart 
                className={`w-5 h-5 transition-transform ${
                  isFavorite 
                    ? 'fill-rose-500 text-rose-500 scale-110' 
                    : 'stroke-zinc-300 hover:stroke-rose-400'
                }`} 
              />
            </button>
          </div>

          {/* Row 2: Perfume Name */}
          <h3 
            onClick={() => onOpenDetails(perfume)}
            className="text-xs sm:text-sm font-semibold text-zinc-100 hover:text-amber-400 transition-colors cursor-pointer line-clamp-1 mb-0.5"
            title={perfume.name}
          >
            {perfume.name}
          </h3>

          {/* Row 3: Brand & Volume */}
          <div className="text-[11px] text-zinc-400 font-medium truncate mb-1">
            <span>{perfume.brand}</span>
            <span className="mx-1 text-zinc-600">•</span>
            <span>{perfume.volume}</span>
          </div>

          {/* Row 4: Notes Summary */}
          {previewNotes.length > 0 && (
            <div className="text-[10px] text-zinc-500 line-clamp-1 mb-2.5">
              {previewNotes.join(' • ')}
            </div>
          )}
        </div>

        {/* WhatsApp Direct Action Button */}
        <a
          id={`whatsapp-btn-${perfume.id}`}
          href={whatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-2 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 tracking-wide shadow-sm active:scale-98 transition-all"
          title="Связаться в WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

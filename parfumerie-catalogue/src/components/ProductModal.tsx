import React, { useState } from 'react';
import { X, MessageCircle, Share2, Check, Sparkles, MapPin, Calendar, Layers, Feather, Droplets, Flame } from 'lucide-react';
import { Perfume, StoreSettings } from '../types';
import { getPerfumeWhatsAppLink } from '../utils/whatsapp';

interface ProductModalProps {
  perfume: Perfume | null;
  settings: StoreSettings;
  onClose: () => void;
  onEdit?: (perfume: Perfume) => void;
  isAdminMode?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  perfume,
  settings,
  onClose,
  onEdit,
  isAdminMode
}) => {
  const [copied, setCopied] = useState(false);

  if (!perfume) return null;

  const whatsAppLink = getPerfumeWhatsAppLink(perfume, settings);
  const priceNumber = typeof perfume.price === 'number' && !isNaN(perfume.price) ? perfume.price : 0;
  const formattedPrice = priceNumber.toLocaleString('ru-RU');
  const currencySymbol = perfume.currency || settings?.currency || 'с.';

  const topNotes = Array.isArray(perfume.topNotes) ? perfume.topNotes : [];
  const heartNotes = Array.isArray(perfume.heartNotes) ? perfume.heartNotes : [];
  const baseNotes = Array.isArray(perfume.baseNotes) ? perfume.baseNotes : [];

  const handleShare = () => {
    const text = `${perfume.brand} — ${perfume.name} (${perfume.volume || ''}, ${formattedPrice} ${currencySymbol})\n${perfume.description || ''}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#18191D] rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col md:flex-row my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-zinc-800 text-zinc-300 hover:bg-white hover:text-black flex items-center justify-center transition-colors shadow-md"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Perfume Imagery & Quick Badges */}
        <div className="md:w-5/12 bg-zinc-900/60 relative flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-zinc-800 min-h-[260px] md:min-h-full">
          <div className="relative w-full h-64 md:h-full max-h-[340px] flex items-center justify-center">
            <img
              src={perfume.imageUrl}
              alt={`${perfume.brand} ${perfume.name}`}
              className="max-h-full max-w-full object-contain rounded-2xl shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {perfume.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#FFCC00] text-black font-extrabold text-[10px] tracking-wider shadow-sm">
                ТОП ПРОДАЖ
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-xs font-semibold text-zinc-200 border border-white/10">
              {perfume.gender}
            </span>
          </div>

          <div className="mt-4 w-full flex items-center justify-between text-xs text-zinc-400 px-2">
            <span>{perfume.category}</span>
            <span className="text-emerald-400 font-medium">{perfume.inStock ? '🟢 В наличии' : '🟡 Под заказ'}</span>
          </div>
        </div>

        {/* Right: Perfume Details & Olfactory Pyramid */}
        <div className="md:w-7/12 p-6 sm:p-7 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Brand and Family */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                {perfume.brand}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
                {perfume.fragranceFamily}
              </span>
            </div>

            {/* Perfume Name */}
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              {perfume.name}
            </h2>

            {/* Volume & Details */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-4">
              <span className="font-semibold text-white">{perfume.volume}</span>
              {perfume.concentration && <span>• {perfume.concentration}</span>}
              {perfume.country && (
                <span className="inline-flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  {perfume.country}
                </span>
              )}
              {perfume.year && (
                <span className="inline-flex items-center gap-0.5">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  {perfume.year} г.
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-5">
              <h4 className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-1.5">
                О композиции
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {perfume.description}
              </p>
            </div>

            {/* Olfactory Pyramid (Пирамида аромата) */}
            <div className="bg-[#121316] p-4 rounded-2xl border border-zinc-800 mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Пирамида нот аромата</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Top Notes */}
                {topNotes.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-24 shrink-0 flex items-center gap-1 text-zinc-400 font-medium pt-0.5">
                      <Feather className="w-3 h-3 text-amber-400/80" />
                      <span>Верхние ноты:</span>
                    </div>
                    <div className="flex-1 flex flex-wrap gap-1">
                      {topNotes.map((note, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-[#202228] text-zinc-200 rounded-lg font-medium border border-zinc-700/60">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Heart Notes */}
                {heartNotes.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-24 shrink-0 flex items-center gap-1 text-zinc-400 font-medium pt-0.5">
                      <Droplets className="w-3 h-3 text-rose-400/80" />
                      <span>Ноты сердца:</span>
                    </div>
                    <div className="flex-1 flex flex-wrap gap-1">
                      {heartNotes.map((note, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-[#202228] text-zinc-200 rounded-lg font-medium border border-zinc-700/60">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Base Notes */}
                {baseNotes.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-24 shrink-0 flex items-center gap-1 text-zinc-400 font-medium pt-0.5">
                      <Flame className="w-3 h-3 text-amber-500" />
                      <span>Базовые ноты:</span>
                    </div>
                    <div className="flex-1 flex flex-wrap gap-1">
                      {baseNotes.map((note, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-[#202228] text-zinc-200 rounded-lg font-medium border border-zinc-700/60">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Actions & Price */}
          <div className="pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                  Цена флакона
                </span>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {formattedPrice} <span className="text-sm font-normal text-zinc-400">{currencySymbol}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                  title="Скопировать описание"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Скопировано' : 'Поделиться'}</span>
                </button>

                {isAdminMode && onEdit && (
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(perfume);
                    }}
                    className="px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200 text-xs font-medium hover:bg-white hover:text-black transition-colors"
                  >
                    Редактировать
                  </button>
                )}
              </div>
            </div>

            {/* Primary Action: Direct WhatsApp Consultant Contact */}
            <a
              id="modal-whatsapp-contact-btn"
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white font-bold text-sm tracking-wide transition-all shadow-md active:scale-99"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>Запросить консультацию и заказ в WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { MessageCircle, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import { StoreSettings } from '../types';
import { getGeneralWhatsAppLink } from '../utils/whatsapp';

interface ConsultantBannerProps {
  settings: StoreSettings;
}

export const ConsultantBanner: React.FC<ConsultantBannerProps> = ({ settings }) => {
  const whatsAppUrl = getGeneralWhatsAppLink(settings);

  return (
    <section className="mt-8 mb-12 bg-[#18191D] text-white rounded-2xl p-5 sm:p-8 border border-zinc-800 overflow-hidden relative shadow-md">
      <div className="relative z-10 max-w-xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/90 text-xs text-amber-400 font-semibold tracking-wide border border-zinc-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Парфюмерная консультация</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Помочь с выбором аромата?
        </h3>

        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
          Напишите консультанту в WhatsApp — мы подскажем ноты, стойкость, шлейф и поможем подобрать лучший аромат.
        </p>

        <div className="pt-2">
          <a
            id="bottom-banner-whatsapp-btn"
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>Написать в WhatsApp</span>
          </a>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            100% оригинальная парфюмерия
          </span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            Быстрый ответ в чате
          </span>
        </div>
      </div>
    </section>
  );
};

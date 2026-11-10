import { Perfume, StoreSettings } from '../types';

/**
 * Normalizes a phone number for WhatsApp url (e.g. +7 (999) 123-45-67 -> 79991234567)
 */
export function normalizePhoneForWhatsApp(phone?: string): string {
  if (!phone || typeof phone !== 'string') return '79991234567';
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length > 0 ? digits : '79991234567';
}

/**
 * Generates direct WhatsApp chat link for consulting about a specific perfume
 */
export function getPerfumeWhatsAppLink(perfume?: Perfume | null, settings?: StoreSettings | null): string {
  const cleanPhone = normalizePhoneForWhatsApp(settings?.whatsappNumber);
  
  const name = perfume?.name || 'Парфюм';
  const brand = perfume?.brand || '';
  const price = typeof perfume?.price === 'number' ? perfume.price.toLocaleString('ru-RU') : '0';
  const currency = perfume?.currency || settings?.currency || '₽';
  const volume = perfume?.volume || '';
  const concentration = perfume?.concentration || '';
  const category = perfume?.category || '';

  let message = settings?.whatsappMessageTemplate || 
    "Здравствуйте! Меня интересует аромат {brand} - {name} ({volume}, {price} {currency}). Подскажите, пожалуйста, есть ли он в наличии и как получить консультацию?";

  message = message
    .replace(/{name}/g, name)
    .replace(/{brand}/g, brand)
    .replace(/{price}/g, price)
    .replace(/{currency}/g, currency)
    .replace(/{volume}/g, volume)
    .replace(/{concentration}/g, concentration)
    .replace(/{category}/g, category);

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates general WhatsApp consultation link
 */
export function getGeneralWhatsAppLink(settings?: StoreSettings | null, customTopic?: string): string {
  const cleanPhone = normalizePhoneForWhatsApp(settings?.whatsappNumber);
  const text = customTopic 
    ? `Здравствуйте! Хочу получить консультацию парфюмера по теме: ${customTopic}`
    : "Здравствуйте! Хочу получить персональную консультацию по подбору парфюма из каталога.";
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}


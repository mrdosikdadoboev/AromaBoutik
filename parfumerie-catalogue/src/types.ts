export type FragranceGender = 'Унисекс' | 'Женский' | 'Мужской';

export type FragranceCategory = 'Нишевая парфюмерия' | 'Люкс' | 'Селектив' | 'Эксклюзив';

export type FragranceFamily = 
  | 'Древесные'
  | 'Восточные'
  | 'Цветочные'
  | 'Цитрусовые'
  | 'Гурманские'
  | 'Свежие / Акватические'
  | 'Кожаные'
  | 'Пряные'
  | 'Фруктовые'
  | 'Фужерные';

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  gender: FragranceGender;
  category: FragranceCategory;
  fragranceFamily: FragranceFamily;
  volume: string; // e.g. "50 мл" or "100 мл"
  concentration: string; // e.g. "Extrait de Parfum", "Eau de Parfum"
  description: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  imageUrl: string;
  inStock: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  year?: number;
  country?: string;
  createdAt: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  whatsappNumber: string; // e.g. "79991234567"
  whatsappMessageTemplate: string;
  telegramUsername?: string;
  instagramUsername?: string;
  phoneDisplay?: string;
  address?: string;
  workingHours?: string;
  currency: string;
}

export interface FilterState {
  search: string;
  brand: string;
  gender: string;
  fragranceFamily: string;
  note: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'brand-asc';
}

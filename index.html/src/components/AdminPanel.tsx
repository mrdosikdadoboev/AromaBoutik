import React, { useState } from 'react';
import { 
  X, Plus, Edit2, Trash2, Save, RotateCcw, Download, Upload, 
  MessageCircle, Sparkles, Image as ImageIcon, Check, CheckCircle2, 
  Layers, Package, Settings, Eye, AlertTriangle 
} from 'lucide-react';
import { Perfume, StoreSettings, FragranceGender, FragranceCategory, FragranceFamily } from '../types';

interface AdminPanelProps {
  perfumes: Perfume[];
  settings: StoreSettings;
  onSavePerfume: (perfume: Perfume) => void;
  onDeletePerfume: (id: string) => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onResetCatalog: () => void;
  onImportCatalog: (perfumes: Perfume[]) => void;
  onClose: () => void;
  editingPerfumeId?: string | null;
  onClearEditingPerfume?: () => void;
}

const GENDER_OPTIONS: FragranceGender[] = ['Унисекс', 'Женский', 'Мужской'];

const CATEGORY_OPTIONS: FragranceCategory[] = [
  'Нишевая парфюмерия',
  'Люкс',
  'Селектив',
  'Эксклюзив'
];

const FAMILY_OPTIONS: FragranceFamily[] = [
  'Древесные',
  'Восточные',
  'Цветочные',
  'Цитрусовые',
  'Гурманские',
  'Свежие / Акватические',
  'Кожаные',
  'Пряные',
  'Фруктовые',
  'Фужерные'
];

// Preset perfume photos for easy administration
const SAMPLE_IMAGE_PRESETS = [
  { label: 'Золотой флакон', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80' },
  { label: 'Рубиновый флакон', url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80' },
  { label: 'Черный флакон', url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Хрустальный коньячный', url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Минималистичный белый', url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80' },
  { label: 'Крафтовый флакон', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Цветочный флакон', url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80' }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  perfumes,
  settings,
  onSavePerfume,
  onDeletePerfume,
  onUpdateSettings,
  onResetCatalog,
  onImportCatalog,
  onClose,
  editingPerfumeId,
  onClearEditingPerfume
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'form' | 'settings' | 'backup'>(
    editingPerfumeId ? 'form' : 'products'
  );
  
  // Settings Form State
  const [tempSettings, setTempSettings] = useState<StoreSettings>(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Perfume Edit Form State
  const [formData, setFormData] = useState<Partial<Perfume>>(() => {
    if (editingPerfumeId) {
      const existing = perfumes.find(p => p.id === editingPerfumeId);
      if (existing) return { ...existing };
    }
    return {
      id: '',
      name: '',
      brand: '',
      price: 25000,
      currency: settings.currency || '₽',
      gender: 'Унисекс',
      category: 'Нишевая парфюмерия',
      fragranceFamily: 'Восточные',
      volume: '50 мл',
      concentration: 'Eau de Parfum',
      description: '',
      topNotes: ['Бергамот', 'Кардамон'],
      heartNotes: ['Роза', 'Жасмин'],
      baseNotes: ['Амбра', 'Мускус', 'Кедр'],
      imageUrl: SAMPLE_IMAGE_PRESETS[0].url,
      inStock: true,
      isFeatured: false,
      isNew: true,
      country: 'Франция',
      year: new Date().getFullYear()
    };
  });

  // Notes inputs as raw comma-separated text for simple editing
  const [topNotesRaw, setTopNotesRaw] = useState(formData.topNotes?.join(', ') || '');
  const [heartNotesRaw, setHeartNotesRaw] = useState(formData.heartNotes?.join(', ') || '');
  const [baseNotesRaw, setBaseNotesRaw] = useState(formData.baseNotes?.join(', ') || '');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (text: string) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStartCreate = () => {
    setFormData({
      id: `perfume-${Date.now()}`,
      name: '',
      brand: '',
      price: 20000,
      currency: settings.currency || '₽',
      gender: 'Унисекс',
      category: 'Нишевая парфюмерия',
      fragranceFamily: 'Восточные',
      volume: '50 мл',
      concentration: 'Eau de Parfum',
      description: '',
      topNotes: ['Бергамот'],
      heartNotes: ['Ирис'],
      baseNotes: ['Сандал', 'Мускус'],
      imageUrl: SAMPLE_IMAGE_PRESETS[0].url,
      inStock: true,
      isFeatured: false,
      isNew: true,
      country: 'Франция',
      year: new Date().getFullYear()
    });
    setTopNotesRaw('Бергамот');
    setHeartNotesRaw('Ирис');
    setBaseNotesRaw('Сандал, Мускус');
    setActiveTab('form');
  };

  const handleStartEdit = (perfume: Perfume) => {
    setFormData({ ...perfume });
    setTopNotesRaw(perfume.topNotes ? perfume.topNotes.join(', ') : '');
    setHeartNotesRaw(perfume.heartNotes ? perfume.heartNotes.join(', ') : '');
    setBaseNotesRaw(perfume.baseNotes ? perfume.baseNotes.join(', ') : '');
    setActiveTab('form');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.brand?.trim()) {
      showNotification('Пожалуйста, укажите название и бренд аромата');
      return;
    }

    const parseNotes = (str: string) => 
      str.split(',').map(s => s.trim()).filter(Boolean);

    const completedPerfume: Perfume = {
      id: formData.id || `perfume-${Date.now()}`,
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      price: Number(formData.price) || 0,
      currency: formData.currency || settings.currency || '₽',
      gender: formData.gender || 'Унисекс',
      category: formData.category || 'Нишевая парфюмерия',
      fragranceFamily: formData.fragranceFamily || 'Восточные',
      volume: formData.volume?.trim() || '50 мл',
      concentration: formData.concentration?.trim() || 'Eau de Parfum',
      description: formData.description?.trim() || '',
      topNotes: parseNotes(topNotesRaw),
      heartNotes: parseNotes(heartNotesRaw),
      baseNotes: parseNotes(baseNotesRaw),
      imageUrl: formData.imageUrl?.trim() || SAMPLE_IMAGE_PRESETS[0].url,
      inStock: !!formData.inStock,
      isFeatured: !!formData.isFeatured,
      isNew: !!formData.isNew,
      country: formData.country?.trim() || '',
      year: Number(formData.year) || undefined,
      createdAt: formData.createdAt || Date.now()
    };

    onSavePerfume(completedPerfume);
    showNotification(`Аромат "${completedPerfume.name}" успешно сохранен!`);
    setActiveTab('products');
    if (onClearEditingPerfume) onClearEditingPerfume();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    setSettingsSavedMessage(true);
    showNotification('Настройки магазина и WhatsApp сохранены');
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(perfumes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `perfume_catalog_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onImportCatalog(parsed);
            showNotification(`Успешно импортировано ${parsed.length} товаров!`);
          } else {
            showNotification('Файл не содержит корректного массива товаров');
          }
        } catch (err) {
          showNotification('Ошибка при чтении JSON файла');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Панель управления каталогом
              </h2>
              <p className="text-xs text-slate-400">
                Добавление, редактирование товаров и настройка связи через WhatsApp
              </p>
            </div>
          </div>

          <button
            id="close-admin-panel-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 px-6 border-b border-slate-100 flex items-center justify-between overflow-x-auto">
          <div className="flex gap-1.5 py-2.5">
            <button
              id="admin-tab-products"
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'products'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Товары каталога ({perfumes.length})
            </button>

            <button
              id="admin-tab-form"
              onClick={handleStartCreate}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'form'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{formData.id && perfumes.some(p => p.id === formData.id) ? 'Редактировать товар' : 'Добавить парфюм'}</span>
            </button>

            <button
              id="admin-tab-settings"
              onClick={() => setActiveTab('settings')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp & Магазин</span>
            </button>

            <button
              id="admin-tab-backup"
              onClick={() => setActiveTab('backup')}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'backup'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Резервное копирование
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {notification && (
          <div className="bg-[#25D366] text-white text-xs px-5 py-2.5 flex items-center justify-between font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">

          {/* TAB 1: PRODUCTS LIST */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Список товаров в каталоге
                  </h3>
                  <p className="text-xs text-slate-500">
                    Всего {perfumes.length} ароматов. Нажмите «Редактировать» для изменения.
                  </p>
                </div>
                <button
                  id="admin-add-perfume-quick-btn"
                  onClick={handleStartCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Добавить новый парфюм</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
                {perfumes.map((perfume) => (
                  <div 
                    key={perfume.id} 
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Image & Title */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={perfume.imageUrl}
                        alt={perfume.name}
                        className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100 p-1 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = SAMPLE_IMAGE_PRESETS[0].url;
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                            {perfume.brand}
                          </span>
                          {perfume.isFeatured && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                              Хит
                            </span>
                          )}
                          {!perfume.inStock && (
                            <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                              Под заказ
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                          {perfume.name}
                        </h4>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>{perfume.volume}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-900">
                            {perfume.price.toLocaleString('ru-RU')} {perfume.currency || settings.currency}
                          </span>
                          <span>•</span>
                          <span>{perfume.fragranceFamily}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleStartEdit(perfume)}
                        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="Редактировать"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          onDeletePerfume(perfume.id);
                          showNotification(`Аромат "${perfume.name}" удален`);
                        }}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ADD / EDIT PERFUME FORM */}
          {activeTab === 'form' && (
            <form onSubmit={handleSaveForm} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {formData.id && perfumes.some(p => p.id === formData.id) 
                      ? `Редактирование: ${formData.name || 'Аромат'}` 
                      : 'Добавление нового парфюма'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Заполните информацию о товаре и ноты композиции
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="text-xs text-slate-700 font-semibold hover:underline"
                >
                  Вернуться к списку
                </button>
              </div>

              {/* Grid Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Brand */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Бренд *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например: Tom Ford, Kilian, Creed..."
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Perfume Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Название аромата *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например: Lost Cherry, Aventus, Santal 33..."
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Price & Currency */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Цена *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="100"
                      placeholder="25000"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Валюта
                    </label>
                    <input
                      type="text"
                      value={formData.currency || '₽'}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Volume & Concentration */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Объем (мл)
                    </label>
                    <input
                      type="text"
                      placeholder="50 мл, 100 мл, 70 мл..."
                      value={formData.volume || ''}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Концентрация
                    </label>
                    <input
                      type="text"
                      placeholder="Eau de Parfum, Extrait, Parfum..."
                      value={formData.concentration || ''}
                      onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Gender & Category */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Пол / Аудитория
                  </label>
                  <select
                    value={formData.gender || 'Унисекс'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as FragranceGender })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  >
                    {GENDER_OPTIONS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Семейство аромата
                  </label>
                  <select
                    value={formData.fragranceFamily || 'Восточные'}
                    onChange={(e) => setFormData({ ...formData, fragranceFamily: e.target.value as FragranceFamily })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  >
                    {FAMILY_OPTIONS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo URL & Quick Presets */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Ссылка на фотографию товара (URL)
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                  {formData.imageUrl && (
                    <img 
                      src={formData.imageUrl} 
                      alt="Превью" 
                      className="w-11 h-11 object-contain rounded-xl border border-slate-200 bg-slate-50 p-1"
                    />
                  )}
                </div>

                {/* Quick Photo Presets Picker */}
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">
                    Или выберите готовый флакон:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${
                          formData.imageUrl === preset.url
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-900'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Olfactory Pyramid Fields */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Пирамида нот (через запятую)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1 font-medium">
                      Верхние ноты
                    </label>
                    <input
                      type="text"
                      placeholder="Бергамот, Горький миндаль, Шафран"
                      value={topNotesRaw}
                      onChange={(e) => setTopNotesRaw(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 text-xs border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1 font-medium">
                      Ноты сердца
                    </label>
                    <input
                      type="text"
                      placeholder="Жасмин, Турецкая роза, Кедр"
                      value={heartNotesRaw}
                      onChange={(e) => setHeartNotesRaw(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 text-xs border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1 font-medium">
                      Базовые ноты
                    </label>
                    <input
                      type="text"
                      placeholder="Амбра, Мускус, Сандал, Ваниль"
                      value={baseNotesRaw}
                      onChange={(e) => setBaseNotesRaw(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 text-xs border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Brief Description */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Краткое описание аромата *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Опишите характер звучания, шлейф и атмосферу парфюма..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none leading-relaxed transition-colors"
                />
              </div>

              {/* Flags (In Stock, Featured, New) */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock !== false}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-0"
                  />
                  <span>🟢 Товар в наличии</span>
                </label>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                  />
                  <span>⭐ Хит / Бестселлер</span>
                </label>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-0"
                  />
                  <span>✨ Новинка</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  id="admin-save-perfume-submit-btn"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить в каталоге</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: STORE & WHATSAPP SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  Настройки WhatsApp и реквизитов магазина
                </h3>
                <p className="text-xs text-slate-500">
                  При нажатии кнопки «Связаться в WhatsApp» клиенты будут перенаправлены на этот номер
                </p>
              </div>

              {settingsSavedMessage && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>Настройки магазина и WhatsApp успешно обновлены!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* WhatsApp Phone Number */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Номер WhatsApp для связи *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+79991234567 или 998901234567"
                    value={tempSettings.whatsappNumber}
                    onChange={(e) => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Указывайте номер в международном формате с кодом страны (например: +79990001122)
                  </p>
                </div>

                {/* Display Phone */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Отображаемый телефон
                  </label>
                  <input
                    type="text"
                    placeholder="+7 (999) 000-11-22"
                    value={tempSettings.phoneDisplay || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, phoneDisplay: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Store Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Название бутика / витрины
                  </label>
                  <input
                    type="text"
                    value={tempSettings.storeName}
                    onChange={(e) => setTempSettings({ ...tempSettings, storeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Слоган или подзаголовок
                  </label>
                  <input
                    type="text"
                    value={tempSettings.tagline}
                    onChange={(e) => setTempSettings({ ...tempSettings, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Custom Logo URL */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Ссылка на изображение логотипа (URL, опционально)
                  </label>
                  <input
                    type="text"
                    placeholder="Оставьте пустым для встроенного логотипа AromaBoutik"
                    value={tempSettings.logoUrl || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, logoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Основная валюта
                  </label>
                  <input
                    type="text"
                    placeholder="₽ или $ или сум"
                    value={tempSettings.currency}
                    onChange={(e) => setTempSettings({ ...tempSettings, currency: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Working hours */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    График консультаций
                  </label>
                  <input
                    type="text"
                    placeholder="Ежедневно с 10:00 до 22:00"
                    value={tempSettings.workingHours || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, workingHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* WhatsApp Message Template */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Шаблон текста сообщения для WhatsApp
                </label>
                <textarea
                  rows={3}
                  value={tempSettings.whatsappMessageTemplate}
                  onChange={(e) => setTempSettings({ ...tempSettings, whatsappMessageTemplate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Доступные переменные автозамены: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{'{name}'}</code> (название), <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{'{brand}'}</code> (бренд), <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{'{price}'}</code> (цена), <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{'{volume}'}</code> (объем).
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  id="admin-save-settings-btn"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить настройки</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: BACKUP / RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  Резервное копирование и сброс
                </h3>
                <p className="text-xs text-slate-500">
                  Вы можете скачать базу каталога в формате JSON или восстановить эталонную коллекцию
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-slate-700" />
                      Экспорт каталога (JSON)
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      Скачайте резервную копию всех {perfumes.length} товаров на свой компьютер
                    </p>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    className="w-full py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 rounded-full text-xs font-semibold transition-colors shadow-2xs"
                  >
                    Скачать JSON файл
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      Импорт каталога
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      Загрузите товары из ранее сохраненного файла .json
                    </p>
                  </div>
                  <label className="w-full py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 rounded-full text-xs font-semibold transition-colors text-center cursor-pointer block shadow-2xs">
                    <span>Выбрать JSON файл</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-5 bg-rose-50/70 rounded-2xl border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-rose-900">
                      Сброс к исходной коллекции ароматов
                    </h5>
                    <p className="text-[11px] text-rose-700">
                      Восстановит предустановленный набор нишевых шедевров (Tom Ford, Creed, Kilian, MFK, Byredo).
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onResetCatalog();
                    showNotification('Каталог успешно сброшен к исходной коллекции');
                    setActiveTab('products');
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold transition-colors shrink-0 shadow-xs"
                >
                  Сбросить каталог
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

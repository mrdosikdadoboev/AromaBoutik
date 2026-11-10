import React from 'react';
import { Search, X, ArrowUpDown, Check, RotateCcw } from 'lucide-react';
import { FilterState, FragranceFamily } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  availableBrands: string[];
  availableFragranceFamilies: FragranceFamily[];
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableBrands,
  availableFragranceFamilies,
  totalResults,
}) => {
  const isFiltered = 
    filters.search !== '' ||
    filters.brand !== 'all' ||
    filters.gender !== 'all' ||
    filters.fragranceFamily !== 'all' ||
    filters.inStockOnly;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-xs mb-8 space-y-4.5">
      
      {/* Top row: Search input & Sorting */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="search-perfumes-input"
            type="text"
            placeholder="Поиск по названию, бренду или нотам (например: табак, ваниль, уд, роза)..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200/80 focus:border-slate-800 focus:outline-none transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & In-Stock controls */}
        <div className="flex items-center gap-2.5">
          {/* In-stock toggle */}
          <button
            id="toggle-instock-filter"
            onClick={() => onFilterChange({ inStockOnly: !filters.inStockOnly })}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
              filters.inStockOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:border-slate-400'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${filters.inStockOnly ? 'opacity-100' : 'opacity-30'}`} />
            <span>Только в наличии</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              id="sort-by-select"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              aria-label="Сортировка ароматов"
              className="pl-8 pr-8 py-2.5 bg-slate-50 text-xs font-medium text-slate-700 rounded-xl border border-slate-200/80 hover:border-slate-400 focus:outline-none focus:border-slate-800 cursor-pointer appearance-none"
            >
              <option value="featured">По популярности</option>
              <option value="price-asc">Сначала доступные</option>
              <option value="price-desc">Сначала премиальные</option>
              <option value="name-asc">По названию (А-Я)</option>
              <option value="brand-asc">По бренду (А-Я)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: Gender / Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mr-1">
          Категория:
        </span>
        {[
          { id: 'all', label: 'Все ароматы' },
          { id: 'Унисекс', label: 'Унисекс' },
          { id: 'Женский', label: 'Для нее' },
          { id: 'Мужской', label: 'Для него' },
        ].map((item) => (
          <button
            key={item.id}
            id={`filter-gender-${item.id}`}
            onClick={() => onFilterChange({ gender: item.id })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              filters.gender === item.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Row 3: Brand Horizontal Filter Pills */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
            Бренд:
          </span>
          {filters.brand !== 'all' && (
            <button
              onClick={() => onFilterChange({ brand: 'all' })}
              className="text-[11px] text-slate-500 hover:text-slate-900 hover:underline"
            >
              Все бренды
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
          <button
            id="filter-brand-all"
            onClick={() => onFilterChange({ brand: 'all' })}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              filters.brand === 'all'
                ? 'bg-slate-900 text-white font-medium shadow-xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:border-slate-400 hover:text-slate-900'
            }`}
          >
            Все бренды
          </button>
          {availableBrands.map((brand) => (
            <button
              key={brand}
              id={`filter-brand-${brand.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onFilterChange({ brand: brand === filters.brand ? 'all' : brand })}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filters.brand === brand
                  ? 'bg-slate-900 text-white font-medium shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:border-slate-400 hover:text-slate-900'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Row 4: Fragrance Family (Семейство аромата) */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
          Характер и семейство аромата:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            id="filter-family-all"
            onClick={() => onFilterChange({ fragranceFamily: 'all' })}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              filters.fragranceFamily === 'all'
                ? 'bg-slate-800 text-white font-medium'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Любое семейство
          </button>
          {availableFragranceFamilies.map((family) => (
            <button
              key={family}
              id={`filter-family-${family.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onFilterChange({ fragranceFamily: family === filters.fragranceFamily ? 'all' : family })}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filters.fragranceFamily === family
                  ? 'bg-slate-900 text-white font-medium shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {family}
            </button>
          ))}
        </div>
      </div>

      {/* Results Bar & Active Filter Reset */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div>
          Найдено ароматов: <strong className="text-slate-900 font-semibold">{totalResults}</strong>
        </div>

        {isFiltered && (
          <button
            id="reset-all-filters-btn"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Сбросить фильтры</span>
          </button>
        )}
      </div>
    </div>
  );
};

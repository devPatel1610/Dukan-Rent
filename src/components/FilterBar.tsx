import React from 'react';
import { LayoutGrid, List, Filter } from 'lucide-react';
import { RentStatus } from '../types/index.ts';

interface FilterBarProps {
  currentFilter: 'ALL' | RentStatus;
  onFilterChange: (filter: 'ALL' | RentStatus) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  counts: {
    all: number;
    dueSoon: number;
    overdue: number;
    paid: number;
    upcoming: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  counts,
}) => {
  const categories = [
    'All Categories',
    'Retail',
    'Grocery',
    'Food & Cafe',
    'Services',
    'Pharmacy',
    'Electronics',
    'Office',
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      {/* Segmented Filter Buttons */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => onFilterChange('ALL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
            currentFilter === 'ALL'
              ? 'bg-white text-stone-900 shadow-2xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All ({counts.all})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('DUE_SOON')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
            currentFilter === 'DUE_SOON'
              ? 'bg-white text-amber-900 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Due Soon ({counts.dueSoon})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('OVERDUE')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
            currentFilter === 'OVERDUE'
              ? 'bg-white text-rose-800 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Overdue ({counts.overdue})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('PAID')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
            currentFilter === 'PAID'
              ? 'bg-white text-emerald-800 shadow-2xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Paid ({counts.paid})
        </button>
      </div>

      {/* Right controls: Category filter & Grid/Table switch */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <div className="flex items-center bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 shadow-2xs">
          <Filter className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
          <label htmlFor="category-select" className="sr-only">Filter by Category</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-transparent border-none text-xs text-stone-700 font-medium focus:outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            title="Grid View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            title="Table View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

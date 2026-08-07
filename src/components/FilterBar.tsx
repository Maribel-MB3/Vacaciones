import React from 'react';
import { FilterOptions } from '../types';
import { VACATION_TYPES } from '../data/initialData';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  totalCount: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({
      department: 'Desarrollo',
      status: 'all',
      search: '',
      groupByDepartment: false,
    });
  };

  const isFiltered = filters.search !== '';

  return (
    <div className="bg-white border border-[#E5E2D9] rounded-2xl p-4 mb-6 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B8B7A]" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Buscar por empleado o motivo..."
            className="w-full pl-10 pr-8 py-2 bg-[#F9F8F4] border border-[#E5E2D9] rounded-xl text-xs sm:text-sm text-[#2A2A2A] placeholder-[#8B8B7A] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((p) => ({ ...p, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B7A] hover:text-[#2A2A2A]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clear filter indicator if search active */}
        {isFiltered && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#E76F51] font-semibold hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            <X className="w-3 h-3" />
            <span>Limpiar búsqueda ({filteredCount}/{totalCount})</span>
          </button>
        )}

        {/* Color Legend for Vacation Types */}
        <div className="flex items-center gap-3 text-xs text-[#8B8B7A] flex-wrap">
          {VACATION_TYPES.map((t) => (
            <div key={t.id} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


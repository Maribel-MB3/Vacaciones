import React from 'react';
import { VacationRequest, Employee } from '../types';
import { Users, CalendarCheck, AlertTriangle, Palmtree } from 'lucide-react';

interface StatsBarProps {
  vacations: VacationRequest[];
  employees: Employee[];
  onFilterConflicts?: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  vacations,
  employees,
  onFilterConflicts,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // People away today
  const awayToday = vacations.filter((v) => {
    return v.start <= todayStr && v.end >= todayStr;
  });

  // Total periods
  const totalPeriods = vacations.length;

  // Conflict detector: check if 2 or more employees have overlapping vacations
  const conflicts: { names: string[]; dates: string }[] = [];

  for (let i = 0; i < vacations.length; i++) {
    for (let j = i + 1; j < vacations.length; j++) {
      const v1 = vacations[i];
      const v2 = vacations[j];
      if (v1.employee !== v2.employee) {
        // Check date overlap
        if (v1.start <= v2.end && v2.start <= v1.end) {
          const exists = conflicts.some(
            (c) =>
              c.names.includes(v1.employee) && c.names.includes(v2.employee)
          );
          if (!exists) {
            conflicts.push({
              names: [v1.employee, v2.employee],
              dates: `${v1.start} / ${v2.start}`,
            });
          }
        }
      }
    }
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* 1. Out Today */}
      <div className="bg-white border border-[#E5E2D9] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8B8B7A]">
            Fuera hoy
          </span>
          <div className="p-2 rounded-xl bg-[#5A5A40]/10 text-[#5A5A40]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-serif-display text-[#2A2A2A]">
            {awayToday.length}
          </span>
          <span className="text-xs text-[#8B8B7A]">
            de {employees.length} en Desarrollo
          </span>
        </div>
        <p className="text-xs text-[#8B8B7A] mt-1 truncate">
          {awayToday.length > 0
            ? awayToday.map((a) => a.employee).join(', ')
            : 'Todo el equipo presente hoy'}
        </p>
      </div>

      {/* 2. Equipo Desarrollo */}
      <div className="bg-white border border-[#E5E2D9] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8B8B7A]">
            Equipo Desarrollo
          </span>
          <div className="p-2 rounded-xl bg-[#788B97]/20 text-[#222E35]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-serif-display text-[#2A2A2A]">
            {employees.length}
          </span>
          <span className="text-xs text-[#8B8B7A]">
            desarrolladores
          </span>
        </div>
        <p className="text-xs text-[#8B8B7A] mt-1">
          Calendario único de equipo
        </p>
      </div>

      {/* 3. Total Períodos de Vacaciones */}
      <div className="bg-white border border-[#E5E2D9] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8B8B7A]">
            Períodos Registrados
          </span>
          <div className="p-2 rounded-xl bg-[#A3B18A]/20 text-[#2D4023]">
            <Palmtree className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-serif-display text-[#2A2A2A]">
            {totalPeriods}
          </span>
          <span className="text-xs text-[#8B8B7A]">
            vacaciones en total
          </span>
        </div>
        <p className="text-xs text-[#8B8B7A] mt-1">
          Todas las vacaciones confirmadas
        </p>
      </div>

      {/* 4. Solapamientos en el equipo */}
      <div
        onClick={onFilterConflicts}
        className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all ${
          conflicts.length > 0
            ? 'border-[#E76F51]/60 bg-[#E76F51]/10 cursor-pointer'
            : 'border-[#E5E2D9]'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8B8B7A]">
            Solapamientos
          </span>
          <div
            className={`p-2 rounded-xl ${
              conflicts.length > 0
                ? 'bg-[#E76F51]/20 text-[#682312]'
                : 'bg-[#F0EEE6] text-[#8B8B7A]'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-2xl font-bold font-serif-display ${
              conflicts.length > 0 ? 'text-[#E76F51]' : 'text-[#2A2A2A]'
            }`}
          >
            {conflicts.length}
          </span>
          <span className="text-xs text-[#8B8B7A]">
            coincidencias de fechas
          </span>
        </div>
        <p
          className={`text-xs mt-1 truncate ${
            conflicts.length > 0
              ? 'text-[#E76F51] font-semibold'
              : 'text-[#8B8B7A]'
          }`}
        >
          {conflicts.length > 0
            ? `${conflicts[0].names.join(' y ')} coinciden`
            : 'Sin solapamientos críticos'}
        </p>
      </div>
    </div>
  );
};


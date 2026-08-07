import React, { useState } from 'react';
import { VacationRequest, Employee, ViewMode, FilterOptions } from '../types';
import {
  getMonthsData,
  isToday,
  isWeekend,
  getPastelForName,
  getContrastTextColor,
  formatDateSpanish,
  calculateWorkingDays,
} from '../utils/dateUtils';
import { VACATION_TYPES } from '../data/initialData';
import { Clock, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface CalendarGanttProps {
  currentDate: Date;
  viewMode: ViewMode;
  vacations: VacationRequest[];
  employees: Employee[];
  filters: FilterOptions;
  onRequestClick: (request: VacationRequest) => void;
  onAddForEmployee?: (employeeName: string) => void;
}

export const CalendarGantt: React.FC<CalendarGanttProps> = ({
  currentDate,
  viewMode,
  vacations,
  employees,
  filters,
  onRequestClick,
  onAddForEmployee,
}) => {
  const [hoveredVacation, setHoveredVacation] = useState<VacationRequest | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Get visible month blocks based on viewMode & currentDate
  const monthsData = getMonthsData(currentDate, viewMode);
  const totalDaysInView = monthsData.reduce((acc, m) => acc + m.days, 0);

  // Timeline view boundaries
  const firstMonth = monthsData[0];
  const lastMonth = monthsData[monthsData.length - 1];
  const viewStartDate = new Date(firstMonth.year, firstMonth.month, 1);
  const viewEndDate = new Date(lastMonth.year, lastMonth.month, lastMonth.days, 23, 59, 59);

  // Dynamic day column width according to viewMode
  let dayWidth = 32;
  if (viewMode === '3m') dayWidth = 18;
  if (viewMode === '6m') dayWidth = 10;
  if (viewMode === '12m') dayWidth = 5.5;

  const showDayNumbers = viewMode === '1m' || viewMode === '3m';

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchEmp = emp.name.toLowerCase().includes(q) || emp.role?.toLowerCase().includes(q);
      const hasMatchingVacation = vacations.some(
        (v) =>
          v.employee === emp.name &&
          (v.notes?.toLowerCase().includes(q) || v.type.toLowerCase().includes(q))
      );
      if (!matchEmp && !hasMatchingVacation) return false;
    }
    return true;
  });

  // Helper to filter vacation list per employee
  const getEmployeeVacations = (empName: string) => {
    return vacations.filter((v) => v.employee === empName);
  };

  const handleMouseEnter = (e: React.MouseEvent, v: VacationRequest) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
    setHoveredVacation(v);
  };

  const handleMouseLeave = () => {
    setHoveredVacation(null);
    setTooltipPos(null);
  };

  return (
    <div className="bg-white border border-[#E5E2D9] rounded-2xl shadow-2xs overflow-hidden relative">
      
      {/* Scroll Container */}
      <div className="flex w-full overflow-x-auto select-none calendar-scroll" style={{ scrollbarGutter: 'stable' }}>
        
        {/* Fixed Left Column: Employee List */}
        <div className="w-56 sm:w-64 flex-shrink-0 border-r border-[#E5E2D9] bg-white sticky left-0 z-20 shadow-xs">
          
          {/* Header cell */}
          <div className="h-[64px] flex items-center justify-between px-4 text-xs font-bold uppercase tracking-widest text-[#8B8B7A] border-b border-[#E5E2D9] bg-[#F0EEE6]">
            <span>Empleado</span>
            <span className="text-[10px] lowercase font-normal text-[#8B8B7A]">({filteredEmployees.length})</span>
          </div>

          {/* Rows */}
          {filteredEmployees.map((emp) => {
            const empVacations = getEmployeeVacations(emp.name);
            const totalWorkingDays = empVacations.reduce(
              (sum, v) => sum + calculateWorkingDays(v.start, v.end),
              0
            );

            return (
              <div
                key={emp.id}
                className="h-[52px] flex items-center justify-between px-3 sm:px-4 border-b border-[#F0EEE6] hover:bg-[#F7F6F2] transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-2xs"
                    style={{ backgroundColor: emp.avatarColor || '#5A5A40' }}
                  >
                    {emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-[#2A2A2A] truncate group-hover:text-[#5A5A40] transition-colors">
                      {emp.name}
                    </div>
                    <div className="text-[10px] text-[#8B8B7A] truncate flex items-center gap-1">
                      <span>{emp.role}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className="text-[11px] font-mono font-medium text-[#5A5A40] bg-[#F0EEE6] px-2 py-0.5 rounded-md"
                    title="Días hábiles disfrutados/programados"
                  >
                    {totalWorkingDays}d
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scrollable Gantt Timeline Area */}
        <div className="flex-1 bg-white min-w-max">
          
          {/* Header Row: Month Names & Day Ticks */}
          <div className="h-[64px] flex flex-col border-b border-[#E5E2D9] bg-[#F0EEE6] sticky top-0 z-10">
            
            {/* Top row: Month blocks */}
            <div className="flex h-7 border-b border-[#E5E2D9]">
              {monthsData.map((m, idx) => {
                const monthPx = m.days * dayWidth;
                return (
                  <div
                    key={`${m.year}-${m.month}-${idx}`}
                    style={{ width: `${monthPx}px` }}
                    className="flex-shrink-0 text-xs font-bold font-serif-display text-[#2A2A2A] px-2 flex items-center justify-center border-r border-[#E5E2D9] truncate"
                  >
                    {viewMode === '12m' ? m.monthShort : `${m.monthName} ${m.year}`}
                  </div>
                );
              })}
            </div>

            {/* Bottom row: Day numbers or month segment ticks */}
            <div className="flex flex-1">
              {monthsData.map((m) => {
                const dayCols = [];
                for (let d = 1; d <= m.days; d++) {
                  const weekend = isWeekend(m.year, m.month, d);
                  const today = isToday(m.year, m.month, d);
                  dayCols.push(
                    <div
                      key={`hdr-${m.year}-${m.month}-${d}`}
                      style={{ width: `${dayWidth}px` }}
                      className={`flex-shrink-0 flex items-center justify-center text-[10px] font-mono border-r border-[#E5E2D9]/80 ${
                        today
                          ? 'bg-[#5A5A40] text-white font-bold'
                          : weekend
                          ? 'bg-[#E5E2D9]/40 text-[#8B8B7A]'
                          : 'text-[#3D3D3D]'
                      }`}
                    >
                      {showDayNumbers ? d : ''}
                    </div>
                  );
                }
                return dayCols;
              })}
            </div>

          </div>

          {/* Rows Body */}
          <div>
            {filteredEmployees.map((emp) => {
              const empVacations = getEmployeeVacations(emp.name);

              return (
                <div
                  key={`track-${emp.id}`}
                  style={{ width: `${totalDaysInView * dayWidth}px` }}
                  className="h-[52px] relative border-b border-[#F0EEE6] flex items-center hover:bg-[#F7F6F2]/60 transition-colors"
                >
                  {/* Grid background cells (Weekends & Days) */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {monthsData.map((m) => {
                      const cells = [];
                      for (let d = 1; d <= m.days; d++) {
                        const weekend = isWeekend(m.year, m.month, d);
                        const today = isToday(m.year, m.month, d);
                        cells.push(
                          <div
                            key={`cell-${m.year}-${m.month}-${d}`}
                            style={{ width: `${dayWidth}px` }}
                            className={`flex-shrink-0 h-full border-r border-[#F0EEE6] ${
                              today
                                ? 'bg-[#5A5A40]/10 border-r-2 border-r-[#5A5A40]'
                                : weekend
                                ? 'bg-[#F0EEE6]/50'
                                : ''
                            }`}
                          />
                        );
                      }
                      return cells;
                    })}
                  </div>

                  {/* Vacation Bars */}
                  {empVacations.map((vac) => {
                    const start = new Date(vac.start);
                    const end = new Date(vac.end + 'T23:59:59');

                    // Check visibility within view
                    if (end < viewStartDate || start > viewEndDate) return null;

                    const msPerDay = 1000 * 60 * 60 * 24;
                    let startOffsetDays = (start.getTime() - viewStartDate.getTime()) / msPerDay;
                    if (startOffsetDays < 0) startOffsetDays = 0;

                    let endOffsetDays = (end.getTime() - viewStartDate.getTime()) / msPerDay + 1;
                    if (endOffsetDays > totalDaysInView) endOffsetDays = totalDaysInView;

                    const durationDays = Math.max(0.5, endOffsetDays - startOffsetDays);

                    const leftPx = startOffsetDays * dayWidth;
                    const widthPx = durationDays * dayWidth;

                    const pastel = getPastelForName(emp.name);
                    const empHexColor = emp.avatarColor || vac.avatarColor || pastel.hexBg;
                    const contrastTextColor = getContrastTextColor(empHexColor);
                    const typeInfo = VACATION_TYPES.find((t) => t.id === vac.type) || VACATION_TYPES[0];

                    return (
                      <div
                        key={vac.id}
                        onClick={() => onRequestClick(vac)}
                        onMouseEnter={(e) => handleMouseEnter(e, vac)}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          left: `${leftPx}px`,
                          width: `${Math.max(12, widthPx)}px`,
                          backgroundColor: empHexColor,
                          color: contrastTextColor,
                        }}
                        className="absolute top-[9px] h-[34px] rounded-lg cursor-pointer transition-all duration-150 flex items-center px-2.5 shadow-2xs z-10 hover:z-20 hover:scale-[1.02] border border-black/10"
                      >
                        <div className="flex items-center justify-between w-full min-w-0 gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-2 h-2 rounded-full flex-shrink-0 bg-white/40" />
                            <span className="text-xs font-semibold truncate">
                              {viewMode === '12m' && widthPx < 30
                                ? ''
                                : typeInfo.label}
                            </span>
                          </div>

                          {widthPx > 60 && (
                            <span className="text-[10px] font-mono font-bold opacity-90 flex-shrink-0">
                              {calculateWorkingDays(vac.start, vac.end)}d
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Floating Hover Tooltip */}
      {hoveredVacation && tooltipPos && (
        <div
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
          className="fixed -translate-x-1/2 -translate-y-full z-50 pointer-events-none mb-2"
        >
          <div className="bg-[#2A2A2A] text-white text-xs rounded-xl p-3.5 shadow-xl border border-[#5A5A40] w-68 space-y-2">
            <div className="flex items-center justify-between font-bold text-sm text-white border-b border-[#3D3D3D] pb-1.5 font-serif-display">
              <span>{hoveredVacation.employee}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-[#A3B18A]/30 text-[#A3B18A] border border-[#A3B18A]">
                Confirmada
              </span>
            </div>

            <div className="text-[#D6D1C1] space-y-1">
              <p className="flex justify-between">
                <span className="text-[#8B8B7A]">Tipo:</span>
                <span className="font-semibold text-white">{VACATION_TYPES.find((t) => t.id === hoveredVacation.type)?.label}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#8B8B7A]">Fechas:</span>
                <span className="font-mono">{formatDateSpanish(hoveredVacation.start)} - {formatDateSpanish(hoveredVacation.end)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#8B8B7A]">Días Hábiles:</span>
                <span className="font-bold text-[#A3B18A]">{calculateWorkingDays(hoveredVacation.start, hoveredVacation.end)} días</span>
              </p>
              {hoveredVacation.notes && (
                <p className="text-[#8B8B7A] italic text-[11px] pt-1 border-t border-[#3D3D3D]">
                  "{hoveredVacation.notes}"
                </p>
              )}
            </div>
            <div className="text-[10px] text-[#8B8B7A] text-right pt-1">Clic para ver detalles</div>
          </div>
        </div>
      )}

      {filteredEmployees.length === 0 && (
        <div className="p-12 text-center text-[#8B8B7A]">
          <Info className="w-8 h-8 mx-auto mb-2 text-[#8B8B7A]" />
          <p className="text-sm font-semibold">No se encontraron empleados con los criterios de búsqueda.</p>
        </div>
      )}

    </div>
  );

};

import React from 'react';
import { ViewMode } from '../types';
import { getMonthLabel } from '../utils/dateUtils';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCw,
  Settings,
  Sparkles,
  Users,
  CalendarDays,
  Download
} from 'lucide-react';

interface HeaderProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenSettingsModal: () => void;
  onOpenAiModal: () => void;
  onOpenEmployeeModal: () => void;
  onRefresh: () => void;
  onExportJson: () => void;
  statusMessage?: string | null;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  setCurrentDate,
  viewMode,
  setViewMode,
  onOpenSettingsModal,
  onOpenAiModal,
  onOpenEmployeeModal,
  onRefresh,
  onExportJson,
  statusMessage,
  isSyncing,
}) => {
  const monthLabel = getMonthLabel(currentDate, viewMode);

  const handlePrev = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === '1m') nextDate.setMonth(nextDate.getMonth() - 1);
    else if (viewMode === '3m') nextDate.setMonth(nextDate.getMonth() - 3);
    else if (viewMode === '6m') nextDate.setMonth(nextDate.getMonth() - 6);
    else if (viewMode === '12m') nextDate.setFullYear(nextDate.getFullYear() - 1);
    setCurrentDate(nextDate);
  };

  const handleNext = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === '1m') nextDate.setMonth(nextDate.getMonth() + 1);
    else if (viewMode === '3m') nextDate.setMonth(nextDate.getMonth() + 3);
    else if (viewMode === '6m') nextDate.setMonth(nextDate.getMonth() + 6);
    else if (viewMode === '12m') nextDate.setFullYear(nextDate.getFullYear() + 1);
    setCurrentDate(nextDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <header className="bg-white border-b border-[#E5E2D9] sticky top-0 z-30 shadow-2xs">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Title & Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center font-bold shadow-sm">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2A2A2A] tracking-tight flex items-center gap-2 font-serif-display">
                VacationPro <span className="text-[#8B8B7A] font-sans font-normal text-sm">| Calendario</span>
              </h1>
              <p className="text-xs text-[#8B8B7A] font-medium">
                Gestión y control de vacaciones del equipo
              </p>
            </div>
          </div>

          {/* Quick status toast indicator if present */}
          {statusMessage && (
            <div className="lg:hidden text-xs font-semibold px-2.5 py-1 rounded-full bg-[#A3B18A]/20 text-[#2D4023] border border-[#A3B18A]/40">
              {statusMessage}
            </div>
          )}
        </div>

        {/* Central Controls: View switchers & Date Stepper */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 bg-[#F0EEE6] p-1.5 rounded-xl border border-[#E5E2D9]">
          
          {/* View mode toggle */}
          <div className="flex bg-[#E5E2D9]/60 p-0.5 rounded-lg text-xs font-medium">
            {(['1m', '3m', '6m', '12m'] as ViewMode[]).map((mode) => {
              const labels: Record<ViewMode, string> = {
                '1m': '1 Mes',
                '3m': '3 Meses',
                '6m': '6 Meses',
                '12m': '1 Año',
              };
              const active = viewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-md transition-all duration-150 ${
                    active
                      ? 'bg-white text-[#2A2A2A] shadow-xs font-bold'
                      : 'text-[#7D7A6D] hover:text-[#2A2A2A]'
                  }`}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:block h-5 w-px bg-[#D6D1C1]" />

          {/* Period stepper */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              title="Periodo anterior"
              className="p-1.5 hover:bg-white rounded-lg text-[#3D3D3D] transition-colors border border-transparent hover:border-[#E5E2D9]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs sm:text-sm font-bold min-w-[130px] sm:min-w-[150px] text-center text-[#2A2A2A] font-serif-display tracking-tight">
              {monthLabel}
            </span>

            <button
              onClick={handleNext}
              title="Periodo siguiente"
              className="p-1.5 hover:bg-white rounded-lg text-[#3D3D3D] transition-colors border border-transparent hover:border-[#E5E2D9]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold text-[#5A5A40] hover:text-[#2A2A2A] bg-white border border-[#E5E2D9] rounded-lg hover:border-[#C2BCA8] transition-colors ml-1"
            >
              Hoy
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 flex-wrap">
          
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#A3B18A]/20 hover:bg-[#A3B18A]/30 text-[#2D4023] border border-[#A3B18A]/40 text-xs font-bold transition-all cursor-pointer"
            title="Análisis inteligente con IA"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span className="hidden sm:inline">IA Informe</span>
          </button>
          
          <button
            onClick={onExportJson}
            className="p-2 hover:bg-[#F0EEE6] text-[#3D3D3D] rounded-xl border border-[#E5E2D9] bg-white transition-colors cursor-pointer"
            title="Exportar archivo JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onRefresh}
            className={`p-2 hover:bg-[#F0EEE6] text-[#3D3D3D] rounded-xl border border-[#E5E2D9] bg-white transition-colors cursor-pointer ${
              isSyncing ? 'animate-spin text-[#5A5A40]' : ''
            }`}
            title="Recargar datos"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettingsModal}
            className="p-2 hover:bg-[#F0EEE6] text-[#3D3D3D] rounded-xl border border-[#E5E2D9] bg-white transition-colors cursor-pointer"
            title="Configuración de Sincronización"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};

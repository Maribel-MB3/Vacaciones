import React from 'react';
import { X, Settings, Download, Upload, RotateCcw, Check } from 'lucide-react';
import { VacationRequest, Employee } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacations: VacationRequest[];
  employees: Employee[];
  onImportData: (employees: Employee[], vacations: VacationRequest[]) => void;
  onResetDefaults: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  vacations,
  employees,
  onImportData,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      employees,
      vacations,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendario_vacaciones_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.employees && parsed.vacations) {
          onImportData(parsed.employees, parsed.vacations);
          alert('¡Datos importados con éxito!');
          onClose();
        } else {
          alert('El archivo JSON no tiene la estructura esperada.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('¿Restablecer los datos demo originales? Se perderán las solicitudes creadas.')) {
      onResetDefaults();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white border border-[#E5E2D9] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2D9] bg-[#F0EEE6]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#5A5A40] text-white shadow-xs">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2A2A2A] font-serif-display">
                Configuración y Datos
              </h2>
              <p className="text-xs text-[#8B8B7A]">
                Exportar, importar y restaurar copias de seguridad
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8B8B7A] hover:text-[#2A2A2A] rounded-lg hover:bg-[#E5E2D9]/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E2D9] space-y-3">
            <h3 className="font-bold text-[#2A2A2A] text-xs font-serif-display">Copia de Seguridad (JSON)</h3>
            <p className="text-[#8B8B7A]">
              Guarda un respaldo completo de tu plantilla de empleados y todas las solicitudes de vacaciones.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleExportJSON}
                className="flex-1 py-2 px-3 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" /> Exportar JSON
              </button>

              <label className="flex-1 py-2 px-3 bg-[#E5E2D9] hover:bg-[#D6D1C1] text-[#2A2A2A] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                <Upload className="w-4 h-4" /> Importar
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-[#E76F51]/10 p-4 rounded-xl border border-[#E76F51]/30 space-y-2">
            <h3 className="font-bold text-[#682312] text-xs font-serif-display">Restablecer Datos</h3>
            <p className="text-[#682312]/80">
              Vuelve al estado inicial con los datos de demostración predeterminados.
            </p>
            <button
              onClick={handleReset}
              className="py-2 px-3 bg-[#E76F51] hover:bg-[#D1593C] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer mt-1"
            >
              <RotateCcw className="w-4 h-4" /> Restaurar Demo
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E5E2D9] bg-[#F0EEE6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#8B8B7A] hover:bg-[#E5E2D9] rounded-xl cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

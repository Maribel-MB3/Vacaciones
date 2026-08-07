import React, { useState } from 'react';
import { VacationRequest, Employee } from '../types';
import { X, Sparkles, RefreshCw, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacations: VacationRequest[];
  employees: Employee[];
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  vacations,
  employees,
}) => {
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacations, employees }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Error al conectar con la API de IA.');
      }

      const data = await res.json();
      setAnalysisText(data.result || data.analysis || 'Análisis completado.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado al analizar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white border border-[#E5E2D9] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2D9] bg-[#F0EEE6]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#5A5A40] text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2A2A2A] font-serif-display">
                Informe Inteligente del Equipo (IA)
              </h2>
              <p className="text-xs text-[#8B8B7A]">
                Análisis de cobertura, solapamientos y recomendaciones con Gemini
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
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {!analysisText && !loading && !error && (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#A3B18A]/20 text-[#5A5A40] flex items-center justify-center mx-auto">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-sm font-bold text-[#2A2A2A] font-serif-display">
                  Genera una auditoría instantánea de tu calendario
                </h3>
                <p className="text-xs text-[#8B8B7A] mt-1 leading-relaxed">
                  El asistente examinará {vacations.length} vacaciones registradas para {employees.length} empleados, identificando cuellos de botella de personal y sugiriendo mejoras.
                </p>
              </div>
              <button
                onClick={handleRunAnalysis}
                className="px-5 py-2.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5A5A4033] transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generar Informe con IA</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 space-y-3">
              <RefreshCw className="w-8 h-8 text-[#5A5A40] animate-spin mx-auto" />
              <p className="text-xs font-semibold text-[#2A2A2A]">Analizando calendario de vacaciones con IA...</p>
              <p className="text-[11px] text-[#8B8B7A]">Procesando solapamientos por departamento...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-[#E76F51]/10 border border-[#E76F51]/40 rounded-xl text-xs text-[#682312] flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#E76F51] flex-shrink-0" />
              <div>
                <p className="font-bold mb-0.5">Error en el análisis</p>
                <p>{error}</p>
                <button
                  onClick={handleRunAnalysis}
                  className="mt-2 text-xs font-bold text-[#E76F51] hover:underline"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {analysisText && !loading && (
            <div className="space-y-4">
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E2D9]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5E2D9]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B8B7A] flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#A3B18A]" /> Resultado de la auditoría
                  </span>
                  <button
                    onClick={handleRunAnalysis}
                    className="text-xs font-bold text-[#5A5A40] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Actualizar
                  </button>
                </div>
                <div className="text-xs text-[#3D3D3D] leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                  {analysisText}
                </div>
              </div>
            </div>
          )}
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

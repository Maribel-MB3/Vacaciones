import React from 'react';
import { VacationRequest, VacationStatus } from '../types';
import { VACATION_TYPES } from '../data/initialData';
import { formatDateSpanish, calculateWorkingDays, totalCalendarDays } from '../utils/dateUtils';
import { X, CheckCircle2, XCircle, Trash2, Calendar, User, Clock, FileText } from 'lucide-react';

interface RequestDetailModalProps {
  request: VacationRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: VacationStatus) => void;
  onDelete: (id: string) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  isOpen,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  if (!isOpen || !request) return null;

  const typeInfo = VACATION_TYPES.find((t) => t.id === request.type) || VACATION_TYPES[0];
  const workingDays = calculateWorkingDays(request.start, request.end);
  const calendarDays = totalCalendarDays(request.start, request.end);

  const handleStatus = (status: VacationStatus) => {
    onUpdateStatus(request.id, status);
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`¿Eliminar la solicitud de vacaciones de ${request.employee}?`)) {
      onDelete(request.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white border border-[#E5E2D9] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2D9] bg-[#F0EEE6]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-2xs"
              style={{ backgroundColor: request.avatarColor || '#5A5A40' }}
            >
              {request.employee.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2A2A2A] font-serif-display">
                {request.employee}
              </h3>
              <p className="text-xs text-[#8B8B7A] font-medium">{request.department}</p>
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
        <div className="p-6 space-y-4">
          
          {/* Details Card */}
          <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E2D9] space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8B8B7A] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Periodo:
              </span>
              <span className="font-bold font-mono text-[#2A2A2A]">
                {formatDateSpanish(request.start)} - {formatDateSpanish(request.end)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8B8B7A] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Duración:
              </span>
              <span className="font-bold text-[#A3B18A]">
                {workingDays} días hábiles ({calendarDays} naturales)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8B8B7A] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Tipo:
              </span>
              <span className="font-bold text-[#2A2A2A]">
                {typeInfo.label}
              </span>
            </div>

            {request.notes && (
              <div className="pt-2 border-t border-[#E5E2D9] text-[#3D3D3D] italic">
                "{request.notes}"
              </div>
            )}
          </div>

          {/* Action: Delete */}
          <div className="pt-2">
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[#E76F51] hover:bg-[#E76F51]/10 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar Registro</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

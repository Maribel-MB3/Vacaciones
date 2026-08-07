import React, { useState } from 'react';
import { VacationRequest, Employee, VacationType, VacationStatus } from '../types';
import { VACATION_TYPES } from '../data/initialData';
import { calculateWorkingDays, totalCalendarDays } from '../utils/dateUtils';
import { X, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AddRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (request: Omit<VacationRequest, 'id' | 'createdAt'>) => void;
  employees: Employee[];
  vacations: VacationRequest[];
  initialEmployee?: string;
}

export const AddRequestModal: React.FC<AddRequestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employees,
  vacations,
  initialEmployee = '',
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState(
    initialEmployee || (employees[0]?.name || '')
  );
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [department, setDepartment] = useState(employees[0]?.department || 'Ingeniería');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState<VacationType>('vacation');
  const [status, setStatus] = useState<VacationStatus>('approved');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const currentEmpObj = employees.find((e) => e.name === selectedEmployee);
  const empDepartment = currentEmpObj?.department || department;
  const avatarColor = currentEmpObj?.avatarColor || '#3b82f6';

  const workingDays = calculateWorkingDays(startDate, endDate);
  const calendarDays = totalCalendarDays(startDate, endDate);

  // Check for conflicts in same department
  const checkConflicts = () => {
    if (!startDate || !endDate) return [];
    const deptEmployees = employees
      .filter((e) => e.department === empDepartment && e.name !== selectedEmployee)
      .map((e) => e.name);

    return vacations.filter((v) => {
      if (!deptEmployees.includes(v.employee)) return false;
      if (v.status === 'rejected') return false;
      return startDate <= v.end && endDate >= v.start;
    });
  };

  const conflicts = checkConflicts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmployeeName = selectedEmployee === '__new__' ? newEmployeeName.trim() : selectedEmployee;

    if (!finalEmployeeName) {
      setErrorMessage('Por favor indica el nombre del empleado.');
      return;
    }
    if (!startDate || !endDate) {
      setErrorMessage('Selecciona las fechas de inicio y fin.');
      return;
    }
    if (endDate < startDate) {
      setErrorMessage('La fecha fin no puede ser anterior a la fecha inicio.');
      return;
    }

    onSave({
      employee: finalEmployeeName,
      department: empDepartment,
      avatarColor,
      start: startDate,
      end: endDate,
      type,
      status,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white border border-[#E5E2D9] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2D9] bg-[#F0EEE6]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#5A5A40] text-white">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2A2A2A] font-serif-display">
                Nueva solicitud de vacaciones
              </h2>
              <p className="text-xs text-[#8B8B7A]">Registrar ausencias o licencias</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8B8B7A] hover:text-[#2A2A2A] rounded-lg hover:bg-[#E5E2D9]/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Employee Selection */}
          <div>
            <label className="block text-[11px] font-bold text-[#8B8B7A] mb-1.5 uppercase tracking-wider">
              Empleado
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E5E2D9] rounded-xl text-sm font-semibold text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.name}>
                  {emp.name} ({emp.department})
                </option>
              ))}
              <option value="__new__">+ Nuevo empleado...</option>
            </select>

            {selectedEmployee === '__new__' && (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="Nombre y apellidos"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F9F8F4] border border-[#E5E2D9] rounded-xl text-sm"
                />
                <input
                  type="text"
                  placeholder="Departamento (ej. Ingeniería, Diseño)"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F9F8F4] border border-[#E5E2D9] rounded-xl text-sm"
                />
              </div>
            )}
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#8B8B7A] mb-1.5 uppercase tracking-wider">
                Fecha inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E5E2D9] rounded-xl text-sm text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8B8B7A] mb-1.5 uppercase tracking-wider">
                Fecha fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E5E2D9] rounded-xl text-sm text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
              />
            </div>
          </div>

          {/* Days summary pill */}
          {startDate && endDate && endDate >= startDate && (
            <div className="p-3 bg-[#FAF9F6] border border-[#E5E2D9] rounded-xl text-xs flex items-center justify-between">
              <span className="text-[#8B8B7A] font-medium">Duración calculada:</span>
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-[#A3B18A] font-mono text-sm font-bold">{workingDays} días hábiles</span>
                <span className="text-[#8B8B7A]">({calendarDays} naturales)</span>
              </div>
            </div>
          )}

          {/* Department Conflict Warning */}
          {conflicts.length > 0 && (
            <div className="p-3.5 bg-[#E76F51]/10 border border-[#E76F51]/40 rounded-xl text-xs text-[#682312] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#E76F51] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Advertencia de Cobertura en {empDepartment}</span>
                <span>
                  Coincide con {conflicts.map((c) => c.employee).join(', ')} en el mismo periodo.
                </span>
              </div>
            </div>
          )}

          {/* Leave Type & Status Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#8B8B7A] mb-1.5 uppercase tracking-wider">
                Tipo de Ausencia
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VacationType)}
                className="w-full px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E5E2D9] rounded-xl text-sm font-semibold text-[#2A2A2A]"
              >
                {VACATION_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#8B8B7A] mb-1.5 uppercase tracking-wider">
                Estado inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VacationStatus)}
                className="w-full px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E5E2D9] rounded-xl text-sm font-semibold text-[#2A2A2A]"
              >
                <option value="approved">Aprobada</option>
                <option value="pending">Pendiente de Aprobación</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-[#8B8B7A] mb-1.5 uppercase tracking-wider">
              Motivo / Notas opcionales
            </label>
            <input
              type="text"
              placeholder="Ej. Viaje familiar, descanso, consulta médica..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F4] border border-[#E5E2D9] rounded-xl text-sm text-[#2A2A2A]"
            />
          </div>

          {errorMessage && (
            <p className="text-xs font-semibold text-[#E76F51]">
              {errorMessage}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E2D9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8B8B7A] hover:bg-[#F0EEE6] rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#5A5A40] hover:bg-[#4A4A35] text-white rounded-xl shadow-md shadow-[#5A5A4033] cursor-pointer"
            >
              Guardar Solicitud
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Employee } from '../types';
import { DEPARTMENTS } from '../data/initialData';
import { X, Users, Plus, Trash2, Edit2, Check, UserPlus } from 'lucide-react';

interface EmployeeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onDeleteEmployee: (id: string) => void;
}

export const EmployeeManagerModal: React.FC<EmployeeManagerModalProps> = ({
  isOpen,
  onClose,
  employees,
  onAddEmployee,
  onDeleteEmployee,
}) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[1] || 'Ingeniería');
  const [role, setRole] = useState('');
  const [annualAllowance, setAnnualAllowance] = useState(23);
  const [avatarColor, setAvatarColor] = useState('#5A5A40');

  if (!isOpen) return null;

  const colorOptions = [
    '#5A5A40', '#788B97', '#A3B18A', '#E76F51',
    '#E9C46A', '#6B705C', '#B5838D', '#A5A58D'
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddEmployee({
      name: name.trim(),
      department,
      role: role.trim() || 'Especialista',
      annualAllowance: Number(annualAllowance) || 23,
      avatarColor,
    });

    setName('');
    setRole('');
  };

  const handleDelete = (id: string, empName: string) => {
    if (confirm(`¿Eliminar a ${empName} del equipo?`)) {
      onDeleteEmployee(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white border border-[#E5E2D9] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2D9] bg-[#F0EEE6]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#5A5A40] text-white shadow-xs">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2A2A2A] font-serif-display">
                Gestión del Equipo
              </h2>
              <p className="text-xs text-[#8B8B7A]">
                Alta de empleados, roles y saldo de vacaciones
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Add Form */}
          <form onSubmit={handleAdd} className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E2D9] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B8B7A] flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-[#5A5A40]" /> Añadir Empleado
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#8B8B7A] uppercase mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej. Carmen Rivas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E2D9] rounded-lg text-xs text-[#2A2A2A]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8B8B7A] uppercase mb-1">Departamento</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E2D9] rounded-lg text-xs text-[#2A2A2A]"
                >
                  {DEPARTMENTS.filter((d) => d !== 'Todos').map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8B8B7A] uppercase mb-1">Puesto / Cargo</label>
                <input
                  type="text"
                  placeholder="Ej. Senior Frontend"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E2D9] rounded-lg text-xs text-[#2A2A2A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8B8B7A] uppercase mb-1">Días/Año asignados</label>
                <input
                  type="number"
                  value={annualAllowance}
                  onChange={(e) => setAnnualAllowance(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E2D9] rounded-lg text-xs text-[#2A2A2A]"
                />
              </div>
            </div>

            {/* Avatar color choices */}
            <div>
              <label className="block text-[10px] font-bold text-[#8B8B7A] uppercase mb-1">Color de identificación</label>
              <div className="flex items-center gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatarColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      avatarColor === c ? 'ring-2 ring-[#2A2A2A] scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Miembro
              </button>
            </div>
          </form>

          {/* List of current employees */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B8B7A]">
              Miembros del Equipo ({employees.length})
            </h3>

            <div className="divide-y divide-[#E5E2D9] border border-[#E5E2D9] rounded-xl overflow-hidden bg-white">
              {employees.map((emp) => (
                <div key={emp.id} className="p-3 flex items-center justify-between hover:bg-[#FAF9F6]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-2xs"
                      style={{ backgroundColor: emp.avatarColor || '#5A5A40' }}
                    >
                      {emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2A2A2A]">{emp.name}</p>
                      <p className="text-[10px] text-[#8B8B7A]">{emp.department} • {emp.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-medium text-[#5A5A40] bg-[#F0EEE6] px-2 py-0.5 rounded-md">
                      {emp.annualAllowance || 23} días/año
                    </span>
                    <button
                      onClick={() => handleDelete(emp.id, emp.name)}
                      className="p-1.5 text-[#E76F51] hover:bg-[#E76F51]/10 rounded-lg cursor-pointer"
                      title="Eliminar empleado"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

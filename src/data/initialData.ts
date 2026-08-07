import { Employee, VacationRequest } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Laura García', department: 'Desarrollo', role: 'Lead Developer', avatarColor: '#5A5A40', annualAllowance: 23 },
  { id: 'emp-2', name: 'Carlos Méndez', department: 'Desarrollo', role: 'Frontend Engineer', avatarColor: '#788B97', annualAllowance: 23 },
  { id: 'emp-3', name: 'Sofía López', department: 'Desarrollo', role: 'Backend Engineer', avatarColor: '#A3B18A', annualAllowance: 23 },
  { id: 'emp-4', name: 'Elena Torres', department: 'Desarrollo', role: 'UI Developer', avatarColor: '#E76F51', annualAllowance: 23 },
  { id: 'emp-5', name: 'David Ruiz', department: 'Desarrollo', role: 'Full Stack Engineer', avatarColor: '#E9C46A', annualAllowance: 23 },
  { id: 'emp-6', name: 'Javier Navarro', department: 'Desarrollo', role: 'DevOps Engineer', avatarColor: '#6B705C', annualAllowance: 23 },
  { id: 'emp-7', name: 'Ana Gómez', department: 'Desarrollo', role: 'QA Automation', avatarColor: '#B5838D', annualAllowance: 23 },
  { id: 'emp-8', name: 'Mateo Fernández', department: 'Desarrollo', role: 'Mobile Developer', avatarColor: '#A5A58D', annualAllowance: 23 },
];

// Helper to format dates relative to current year and month
const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const nextMonth = String((now.getMonth() + 2) > 12 ? 1 : now.getMonth() + 2).padStart(2, '0');
  const nextYear = now.getMonth() + 2 > 12 ? year + 1 : year;
  const prevMonth = String(now.getMonth() === 0 ? 12 : now.getMonth()).padStart(2, '0');
  const prevYear = now.getMonth() === 0 ? year - 1 : year;

  return { year, month, nextYear, nextMonth, prevYear, prevMonth };
};

export const getInitialVacations = (): VacationRequest[] => {
  const { year, month, nextYear, nextMonth } = getCurrentYearMonth();

  return [
    {
      id: 'vac-1',
      employee: 'Laura García',
      department: 'Desarrollo',
      avatarColor: '#5A5A40',
      start: `${year}-${month}-04`,
      end: `${year}-${month}-08`,
      type: 'vacation',
      status: 'approved',
      notes: 'Vacaciones de verano',
      createdAt: `${year}-${month}-01`,
    },
    {
      id: 'vac-2',
      employee: 'Carlos Méndez',
      department: 'Desarrollo',
      avatarColor: '#788B97',
      start: `${year}-${month}-06`,
      end: `${year}-${month}-12`,
      type: 'vacation',
      status: 'approved',
      notes: 'Viaje familiar',
      createdAt: `${year}-${month}-02`,
    },
    {
      id: 'vac-3',
      employee: 'Sofía López',
      department: 'Desarrollo',
      avatarColor: '#A3B18A',
      start: `${year}-${month}-15`,
      end: `${year}-${month}-19`,
      type: 'vacation',
      status: 'approved',
      notes: 'Descanso de verano',
      createdAt: `${year}-${month}-10`,
    },
    {
      id: 'vac-4',
      employee: 'Elena Torres',
      department: 'Desarrollo',
      avatarColor: '#E76F51',
      start: `${year}-${month}-20`,
      end: `${year}-${month}-22`,
      type: 'personal',
      status: 'approved',
      notes: 'Trámites personales',
      createdAt: `${year}-${month}-11`,
    },
    {
      id: 'vac-5',
      employee: 'David Ruiz',
      department: 'Desarrollo',
      avatarColor: '#E9C46A',
      start: `${nextYear}-${nextMonth}-02`,
      end: `${nextYear}-${nextMonth}-12`,
      type: 'vacation',
      status: 'approved',
      notes: 'Vacaciones de descanso',
      createdAt: `${year}-${month}-12`,
    },
    {
      id: 'vac-6',
      employee: 'Javier Navarro',
      department: 'Desarrollo',
      avatarColor: '#6B705C',
      start: `${year}-${month}-25`,
      end: `${year}-${month}-28`,
      type: 'remote',
      status: 'approved',
      notes: 'Trabajo en remoto desde otra provincia',
      createdAt: `${year}-${month}-14`,
    },
    {
      id: 'vac-7',
      employee: 'Ana Gómez',
      department: 'Desarrollo',
      avatarColor: '#B5838D',
      start: `${year}-${month}-10`,
      end: `${year}-${month}-12`,
      type: 'special',
      status: 'approved',
      notes: 'Permiso de mudanza',
      createdAt: `${year}-${month}-05`,
    },
    {
      id: 'vac-8',
      employee: 'Mateo Fernández',
      department: 'Desarrollo',
      avatarColor: '#A5A58D',
      start: `${year}-${month}-18`,
      end: `${year}-${month}-25`,
      type: 'vacation',
      status: 'approved',
      notes: 'Semana de descanso',
      createdAt: `${year}-${month}-16`,
    },
    {
      id: 'vac-9',
      employee: 'Laura García',
      department: 'Desarrollo',
      avatarColor: '#5A5A40',
      start: `${nextYear}-${nextMonth}-10`,
      end: `${nextYear}-${nextMonth}-18`,
      type: 'vacation',
      status: 'approved',
      notes: 'Vacaciones previstas',
      createdAt: `${year}-${month}-18`,
    }
  ];
};

export const INITIAL_VACATIONS: VacationRequest[] = getInitialVacations();

export const DEPARTMENTS = ['Desarrollo'];

export const VACATION_TYPES: { id: string; label: string; color: string; badgeBg: string; textHex: string }[] = [
  { id: 'vacation', label: 'Vacaciones', color: 'bg-[#A3B18A]', badgeBg: 'bg-[#A3B18A]/20 text-[#2D4023] border-[#A3B18A]', textHex: '#A3B18A' },
  { id: 'personal', label: 'Asuntos Propios', color: 'bg-[#E9C46A]', badgeBg: 'bg-[#E9C46A]/20 text-[#5E4800] border-[#E9C46A]', textHex: '#E9C46A' },
  { id: 'sick', label: 'Baja Médica', color: 'bg-[#E76F51]', badgeBg: 'bg-[#E76F51]/20 text-[#682312] border-[#E76F51]', textHex: '#E76F51' },
  { id: 'special', label: 'Permiso Especial / Mudanza', color: 'bg-[#B5838D]', badgeBg: 'bg-[#B5838D]/20 text-[#4E222A] border-[#B5838D]', textHex: '#B5838D' },
  { id: 'remote', label: 'Teletrabajo', color: 'bg-[#788B97]', badgeBg: 'bg-[#788B97]/20 text-[#222E35] border-[#788B97]', textHex: '#788B97' },
];

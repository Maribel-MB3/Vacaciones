import { ViewMode } from '../types';

export const SPANISH_MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const SPANISH_MONTHS_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export const SPANISH_DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getViewMonthCount(viewMode: ViewMode): number {
  switch (viewMode) {
    case '1m': return 1;
    case '3m': return 3;
    case '6m': return 6;
    case '12m': return 12;
    default: return 1;
  }
}

export function getMonthLabel(currentDate: Date, viewMode: ViewMode): string {
  const m1 = currentDate.getMonth();
  const y1 = currentDate.getFullYear();
  const count = getViewMonthCount(viewMode);

  if (count === 1) {
    return `${SPANISH_MONTHS[m1]} ${y1}`;
  } else {
    const endMonthDate = new Date(y1, m1 + count - 1, 1);
    const m2 = endMonthDate.getMonth();
    const y2 = endMonthDate.getFullYear();

    if (y1 === y2) {
      return `${SPANISH_MONTHS_SHORT[m1]} - ${SPANISH_MONTHS_SHORT[m2]} ${y1}`;
    }
    return `${SPANISH_MONTHS_SHORT[m1]} ${y1} - ${SPANISH_MONTHS_SHORT[m2]} ${y2}`;
  }
}

export interface MonthBlock {
  year: number;
  month: number;
  days: number;
  monthName: string;
  monthShort: string;
}

export function getMonthsData(currentDate: Date, viewMode: ViewMode): MonthBlock[] {
  const count = getViewMonthCount(viewMode);
  const startYear = currentDate.getFullYear();
  const startMonth = currentDate.getMonth();

  const blocks: MonthBlock[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(startYear, startMonth + i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const days = daysInMonth(y, m);
    blocks.push({
      year: y,
      month: m,
      days: days,
      monthName: SPANISH_MONTHS[m],
      monthShort: SPANISH_MONTHS_SHORT[m],
    });
  }
  return blocks;
}

export function calculateWorkingDays(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (end < start) return 0;

  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dayOfWeek = cur.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function totalCalendarDays(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (end < start) return 0;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export function formatDateSpanish(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  const monthIdx = parseInt(m, 10) - 1;
  return `${parseInt(d, 10)} ${SPANISH_MONTHS_SHORT[monthIdx]} ${y}`;
}

export function isDateInPast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0,0,0,0);
  const checkDate = new Date(dateStr);
  return checkDate < today;
}

export function isToday(year: number, month: number, day: number): boolean {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
}

export function isWeekend(year: number, month: number, day: number): boolean {
  const d = new Date(year, month, day);
  const dayOfWeek = d.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

// Natural Tones Bar Palette for Gantt
const NATURAL_TONES_PALETTE = [
  { bg: 'bg-[#A3B18A]', text: 'text-white font-bold', border: 'border-[#8A9A70]', hexBg: '#A3B18A', hexText: '#FFFFFF' },
  { bg: 'bg-[#E9C46A]', text: 'text-[#3D3D3D] font-bold', border: 'border-[#D4AF53]', hexBg: '#E9C46A', hexText: '#3D3D3D' },
  { bg: 'bg-[#E76F51]', text: 'text-white font-bold', border: 'border-[#D1593C]', hexBg: '#E76F51', hexText: '#FFFFFF' },
  { bg: 'bg-[#5A5A40]', text: 'text-white font-bold', border: 'border-[#4A4A35]', hexBg: '#5A5A40', hexText: '#FFFFFF' },
  { bg: 'bg-[#788B97]', text: 'text-white font-bold', border: 'border-[#637580]', hexBg: '#788B97', hexText: '#FFFFFF' },
  { bg: 'bg-[#B5838D]', text: 'text-white font-bold', border: 'border-[#9E6D77]', hexBg: '#B5838D', hexText: '#FFFFFF' },
  { bg: 'bg-[#D6D1C1]', text: 'text-[#2A2A2A] font-bold', border: 'border-[#C2BCA8]', hexBg: '#D6D1C1', hexText: '#2A2A2A' },
  { bg: 'bg-[#6B705C]', text: 'text-white font-bold', border: 'border-[#585D4A]', hexBg: '#6B705C', hexText: '#FFFFFF' },
];

export function getContrastTextColor(hexColor: string): string {
  if (!hexColor || !hexColor.startsWith('#')) return '#FFFFFF';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? '#1A1A1A' : '#FFFFFF';
}

export function getPastelForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % NATURAL_TONES_PALETTE.length;
  return NATURAL_TONES_PALETTE[index];
}

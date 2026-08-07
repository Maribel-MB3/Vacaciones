import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { CalendarGantt } from './components/CalendarGantt';
import { RequestDetailModal } from './components/RequestDetailModal';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { EmployeeManagerModal } from './components/EmployeeManagerModal';
import { SettingsModal } from './components/SettingsModal';

import { INITIAL_EMPLOYEES, INITIAL_VACATIONS } from './data/initialData';
import { Employee, VacationRequest, FilterState, ViewMode } from './types';
import { getPastelForName } from './utils/dateUtils';

export default function App() {
  // Persistence keys
  const STORAGE_KEY_VACATIONS = 'natural_vacations_data_v2';
  const STORAGE_KEY_EMPLOYEES = 'natural_employees_data_v2';

  // State
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [vacations, setVacations] = useState<VacationRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VACATIONS);
    return saved ? JSON.parse(saved) : INITIAL_VACATIONS;
  });

  // Current View Date & View Mode
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 5, 1)); // June 2025 default focus
  const [viewMode, setViewMode] = useState<ViewMode>('3m');

  // Status & Syncing indicators
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    department: 'Desarrollo',
    status: 'all',
    search: '',
    groupByDepartment: false,
  });

  // Modals
  const [selectedVacation, setSelectedVacation] = useState<VacationRequest | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VACATIONS, JSON.stringify(vacations));
  }, [vacations]);

  // Function to load data from vacations.json
  const loadVacationsJson = async (showToast = true) => {
    setIsSyncing(true);
    try {
      const res = await fetch(`./vacations.json?_=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const jsonVacations: VacationRequest[] = await res.json();
        if (Array.isArray(jsonVacations) && jsonVacations.length > 0) {
          setVacations(jsonVacations);

          // Ensure employees list includes anyone present in vacations.json
          setEmployees((prev) => {
            const updated = [...prev];
            jsonVacations.forEach((v) => {
              if (v.employee && !updated.some((e) => e.name === v.employee)) {
                const pastel = getPastelForName(v.employee);
                updated.push({
                  id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                  name: v.employee,
                  department: v.department || 'Desarrollo',
                  role: 'Desarrollador',
                  avatarColor: v.avatarColor || pastel.hexBg,
                  annualAllowance: 23,
                });
              }
            });
            return updated;
          });

          if (showToast) {
            flashStatus('Datos cargados desde vacations.json');
          }
        }
      }
    } catch (err) {
      console.warn('No se pudo cargar vacations.json:', err);
      if (showToast) {
        flashStatus('Usando datos locales');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Initial load on mount
  useEffect(() => {
    loadVacationsJson(false);
  }, []);

  const flashStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 2500);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(vacations, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vacations.json';
    link.click();
    URL.revokeObjectURL(url);
    flashStatus('Archivo vacations.json descargado');
  };

  // Handlers
  const handleUpdateVacationStatus = (id: string, newStatus: any) => {
    setVacations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
  };

  const handleDeleteVacation = (id: string) => {
    setVacations((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddEmployee = (newEmpData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...newEmpData,
      id: `emp-${Date.now()}`,
    };
    setEmployees((prev) => [...prev, newEmp]);
  };

  const handleDeleteEmployee = (id: string) => {
    const empToDelete = employees.find((e) => e.id === id);
    if (empToDelete) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      setVacations((prev) => prev.filter((v) => v.employee !== empToDelete.name));
    }
  };

  const handleResetDefaults = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setVacations(INITIAL_VACATIONS);
    localStorage.removeItem(STORAGE_KEY_EMPLOYEES);
    localStorage.removeItem(STORAGE_KEY_VACATIONS);
  };

  const handleImportData = (impEmployees: Employee[], impVacations: VacationRequest[]) => {
    setEmployees(impEmployees);
    setVacations(impVacations);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#2A2A2A] flex flex-col font-sans selection:bg-[#5A5A40]/20 selection:text-[#2A2A2A]">
      
      {/* Top Professional Header */}
      <Header
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenEmployeeModal={() => setIsEmployeeModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onRefresh={() => loadVacationsJson(true)}
        onExportJson={handleExportJson}
        statusMessage={statusMessage}
        isSyncing={isSyncing}
      />

      {/* Main Body Layout */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        
        {/* Key KPI Stats */}
        <StatsBar vacations={vacations} employees={employees} />

        {/* Filters & Controls */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Multi-view Interactive Gantt Calendar */}
        <CalendarGantt
          currentDate={currentDate}
          viewMode={viewMode}
          employees={employees}
          vacations={vacations}
          filters={filters}
          onRequestClick={(req) => setSelectedVacation(req)}
        />
      </main>

      {/* Modals */}
      <RequestDetailModal
        request={selectedVacation}
        isOpen={!!selectedVacation}
        onClose={() => setSelectedVacation(null)}
        onUpdateStatus={handleUpdateVacationStatus}
        onDelete={handleDeleteVacation}
      />

      <AiAnalysisModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        vacations={vacations}
        employees={employees}
      />

      <EmployeeManagerModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        employees={employees}
        onAddEmployee={handleAddEmployee}
        onDeleteEmployee={handleDeleteEmployee}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        vacations={vacations}
        employees={employees}
        onImportData={handleImportData}
        onResetDefaults={handleResetDefaults}
      />

    </div>
  );
}


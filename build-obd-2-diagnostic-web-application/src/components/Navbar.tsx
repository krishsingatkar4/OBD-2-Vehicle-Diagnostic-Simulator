import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Activity, 
  AlertTriangle, 
  Cpu, 
  FileText, 
  LayoutDashboard, 
  Wifi, 
  WifiOff, 
  Clock, 
  Menu, 
  X, 
  ChevronDown,
  Database,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Vehicle, DiagnosticScanner } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  setActiveVehicle: (veh: Vehicle) => void;
  scanner: DiagnosticScanner;
  activeFaultsCount: number;
  onQuickSave: () => void;
  onQuickLoad: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  vehicles,
  activeVehicle,
  setActiveVehicle,
  scanner,
  activeFaultsCount,
  onQuickSave,
  onQuickLoad
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'live-sensors', label: 'Live Sensor Suite', icon: <Activity className="w-4 h-4" /> },
    { id: 'fault-codes', label: 'Fault Codes (DTC)', icon: <AlertTriangle className="w-4 h-4" />, badge: activeFaultsCount },
    { id: 'ecu-hub', label: 'ECU Workbench', icon: <Cpu className="w-4 h-4" /> },
    { id: 'garage', label: 'Garage Hub', icon: <Car className="w-4 h-4" /> },
    { id: 'reports', label: 'Diagnostic Reports', icon: <FileText className="w-4 h-4" /> },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-slate-950 fill-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-display tracking-wider text-white">APEX<span className="text-cyan-400">OBD</span></span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">SIM PRO v5.4</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Automotive Diagnostics CAN-Bus Emulator</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Controls */}
          <div className="flex items-center gap-3">
            
            {/* Active Vehicle Switcher */}
            <div className="relative">
              <button
                onClick={() => setVehicleDropdownOpen(!vehicleDropdownOpen)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-xl text-left transition-all"
              >
                <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${activeVehicle?.avatar_color || 'from-slate-400 to-slate-600'}`} />
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-200 truncate max-w-[130px]">
                    {activeVehicle ? `${activeVehicle.company} ${activeVehicle.model}` : 'Select Vehicle'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                    {activeVehicle?.vehicle_id || '---'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {vehicleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-2 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider font-display">
                    Active Garage ({vehicles.length})
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {vehicles.map((veh) => (
                      <button
                        key={veh.vehicle_id}
                        onClick={() => {
                          setActiveVehicle(veh);
                          setVehicleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800 transition-colors ${
                          activeVehicle?.vehicle_id === veh.vehicle_id ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${veh.avatar_color || 'from-slate-400 to-slate-600'}`} />
                          <span className="text-xs font-medium truncate">{veh.company} {veh.model} ({veh.year})</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{veh.vehicle_id}</span>
                      </button>
                    ))}
                  </div>
                  <div className="px-3 py-2 bg-slate-950/50 flex justify-between gap-2">
                    <button
                      onClick={() => {
                        onQuickSave();
                        setVehicleDropdownOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-slate-300 font-mono"
                    >
                      <Database className="w-3 h-3" /> Save Data
                    </button>
                    <button
                      onClick={() => {
                        onQuickLoad();
                        setVehicleDropdownOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-slate-300 font-mono"
                    >
                      <Database className="w-3 h-3" /> Load Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Connection Badge */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                scanner.scanner_status === 'Connected' 
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20' 
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {scanner.scanner_status === 'Connected' ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span className="hidden sm:inline">{scanner.scanner_status.toUpperCase()}</span>
              </div>
            </div>

            {/* Realtime CAN Clock Ticker */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-xl text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTime || '00:00:00'}</span>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 xl:hidden focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 mt-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40' 
                      : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>{item.icon}</span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> CAN-Bus ISO 15765-4 Active
            </div>
            <span>{currentTime}</span>
          </div>
        </div>
      )}
    </header>
  );
};

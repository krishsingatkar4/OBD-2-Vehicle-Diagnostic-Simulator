import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Activity, 
  FileText, 
  RefreshCw, 
  Cpu, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  Sparkles,
  Zap
} from 'lucide-react';
import { Vehicle, DiagnosticScanner, FaultCode, LiveSensorData } from '../../types';
import { SensorGauge } from '../Gauges';

interface DashboardTabProps {
  activeVehicle: Vehicle | null;
  scanner: DiagnosticScanner;
  faults: FaultCode[];
  liveData: LiveSensorData;
  onConnectECU: () => void;
  onDisconnectECU: () => void;
  onTriggerScan: () => void;
  onClearAllFaults: () => void;
  onGenerateReport: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  activeVehicle,
  scanner,
  faults,
  liveData,
  onConnectECU,
  onDisconnectECU,
  onTriggerScan,
  onClearAllFaults,
  onGenerateReport,
  setActiveTab
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectClick = () => {
    setIsConnecting(true);
    setTimeout(() => {
      onConnectECU();
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnectClick = () => {
    setIsConnecting(true);
    setTimeout(() => {
      onDisconnectECU();
      setIsConnecting(false);
    }, 1500);
  };

  const activeFaults = faults.filter(f => f.status === 'active');
  const criticalFaults = activeFaults.filter(f => f.severity === 'Critical');

  // Warning calculations
  const isHighRpm = liveData.RPM > 3000;
  const isHighTemp = liveData['Coolant Temp'] >= 105;
  const isLowVoltage = liveData['Battery Voltage'] <= 13.0;
  const isLowFuel = liveData['Fuel Level'] <= 10;
  const isHighSpeed = liveData['Vehicle Speed'] >= 150;
  const isHighLoad = liveData['Engine Load'] >= 80;

  const hasWarnings = isHighRpm || isHighTemp || isLowVoltage || isLowFuel || isHighSpeed || isHighLoad;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Top Banner / Warnings Interceptor */}
      {hasWarnings && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-900/40 via-rose-600/20 to-amber-600/20 border border-rose-500/50 shadow-lg shadow-rose-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-bounce">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-rose-200 tracking-wide uppercase">Active Live Sensor Safety Warning</h3>
              <div className="flex flex-wrap gap-2 mt-1 text-xs font-mono text-rose-300">
                {isHighRpm && <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40">HIGH RPM: {liveData.RPM} (UPSHIFT)</span>}
                {isHighTemp && <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40">OVERHEAT: {liveData['Coolant Temp']}°C</span>}
                {isLowVoltage && <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40">LOW BATTERY: {liveData['Battery Voltage']}V</span>}
                {isLowFuel && <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">LOW FUEL: {liveData['Fuel Level']}%</span>}
                {isHighSpeed && <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40">HIGH SPEED: {liveData['Vehicle Speed']} km/h</span>}
                {isHighLoad && <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40">ENGINE STRESS: {liveData['Engine Load']}% LOAD</span>}
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('live-sensors')}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 font-display uppercase tracking-wider self-end sm:self-center shrink-0 shadow-md shadow-rose-500/20"
          >
            <span>Adjust Telemetry</span> <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero ECU Connection Station */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Vehicle Details */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                Active Test Specimen
              </span>
              <span className="text-xs font-mono text-slate-400 font-medium">
                {activeVehicle?.year || '2026'}
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-3xl font-black text-white font-display tracking-tight truncate">
                {activeVehicle ? `${activeVehicle.company} ${activeVehicle.model}` : 'No Vehicle Selected'}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                VIN: <span className="text-slate-200 font-bold">{activeVehicle?.vin || 'PLEASE ADD A VEHICLE FIRST'}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Owner</span>
                <span className="text-xs font-bold text-slate-200 truncate block mt-0.5">{activeVehicle?.owner_name || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Powertrain Hub</span>
                <span className="text-xs font-bold text-slate-200 truncate block mt-0.5">{activeVehicle?.fuel_type || 'N/A'} Injection</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('garage')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>Manage Vehicle Config</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-500">ID: {activeVehicle?.vehicle_id}</span>
          </div>
        </div>

        {/* Center: OBD-II Connection Sandbox */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between relative overflow-hidden shadow-xl lg:col-span-2">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                  Diagnostic Simulator Interface
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Simulated Link: <span className="text-slate-300 font-mono">{scanner.scanner_name}</span>
              </p>
            </div>

            {/* Link Status switch */}
            <div className="flex items-center gap-3 self-stretch sm:self-auto">
              {scanner.scanner_status === 'Connected' ? (
                <button
                  onClick={handleDisconnectClick}
                  disabled={isConnecting}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/40 text-xs font-bold font-mono tracking-wider transition-all shadow-lg hover:shadow-rose-500/10 cursor-pointer disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>DISCONNECTING...</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4" />
                      <span>TERMINATE LINK</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleConnectClick}
                  disabled={isConnecting}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black font-display uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>HANDSHAKING ECU...</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4 animate-pulse" />
                      <span>INITIALIZE ECU LINK</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Connection Interactive status visualizer */}
          <div className="my-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                scanner.scanner_status === 'Connected'
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/20 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}>
                {scanner.scanner_status === 'Connected' ? <Zap className="w-7 h-7" /> : <WifiOff className="w-7 h-7" />}
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">ECU Multiplex Status</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-base font-bold font-mono tracking-tight ${scanner.scanner_status === 'Connected' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {scanner.scanner_status === 'Connected' ? 'ONLINE (CAN 500kbaud)' : 'OFFLINE'}
                  </span>
                  {scanner.scanner_status === 'Connected' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      0x7E8 LINKED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {scanner.scanner_status === 'Connected' 
                    ? `Connected to Target ECU: ${scanner.connected_ecu?.ecu_id || 'Bosch MED17'} (${scanner.connected_ecu?.firmware || 'v17.7.5'})` 
                    : 'Awaiting simulated ignition key sequence...'}
                </p>
              </div>
            </div>

            {/* Mini DTC active Counter */}
            <div className="flex items-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-800 md:pl-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Diagnostic Intercept</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className={`text-2xl font-black font-mono ${activeFaults.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {activeFaults.length}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Active Faults</span>
                </div>
                {criticalFaults.length > 0 && (
                  <span className="text-[10px] font-bold text-rose-400 font-mono tracking-wide flex items-center gap-1 mt-0.5">
                    <ShieldAlert className="w-3 h-3 inline" /> {criticalFaults.length} Critical
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Core Navigation Quick Action Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => {
                if (scanner.scanner_status === 'Disconnected') {
                  handleConnectClick();
                } else {
                  onTriggerScan();
                  setActiveTab('fault-codes');
                }
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 hover:from-cyan-900/30 hover:to-blue-900/30 border border-slate-800 hover:border-cyan-500/40 transition-all group flex flex-col items-center text-center cursor-pointer shadow-md"
            >
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform mb-2">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white font-display">Scan Faults</span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">Choice #6</span>
            </button>

            <button
              onClick={() => setActiveTab('live-sensors')}
              className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 hover:from-emerald-900/30 hover:to-teal-900/30 border border-slate-800 hover:border-emerald-500/40 transition-all group flex flex-col items-center text-center cursor-pointer shadow-md"
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform mb-2">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white font-display">Live Telemetry</span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">Choice #5</span>
            </button>

            <button
              onClick={onClearAllFaults}
              className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 hover:from-amber-900/30 hover:to-orange-900/30 border border-slate-800 hover:border-amber-500/40 transition-all group flex flex-col items-center text-center cursor-pointer shadow-md"
            >
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white font-display">Clear DTCs</span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">Choice #9</span>
            </button>

            <button
              onClick={() => {
                onGenerateReport();
                setActiveTab('reports');
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 hover:from-purple-900/30 hover:to-indigo-900/30 border border-slate-800 hover:border-purple-500/40 transition-all group flex flex-col items-center text-center cursor-pointer shadow-md"
            >
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white font-display">Certify Report</span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">Choice #10</span>
            </button>
          </div>

        </div>

      </div>

      {/* Quick Interactive Gauge Telemetry Gallery */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-display uppercase tracking-widest text-slate-300">
              Instant Sensor Snapshots (Real-Time CAN Stream)
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('live-sensors')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-medium flex items-center gap-1"
          >
            <span>Full Diagnostic Cockpit</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorGauge
            label="Engine Speed"
            value={liveData.RPM}
            unit="RPM"
            min={0}
            max={8000}
            warningThreshold={5500}
            criticalThreshold={6500}
            colorScheme="cyan"
          />

          <SensorGauge
            label="Vehicle Speed"
            value={liveData['Vehicle Speed']}
            unit="km/h"
            min={0}
            max={300}
            warningThreshold={130}
            criticalThreshold={160}
            colorScheme="emerald"
          />

          <SensorGauge
            label="Coolant Temp"
            value={liveData['Coolant Temp']}
            unit="°C"
            min={40}
            max={120}
            warningThreshold={100}
            criticalThreshold={105}
            colorScheme="rose"
          />

          <SensorGauge
            label="Battery Voltage"
            value={liveData['Battery Voltage']}
            unit="V"
            min={10.0}
            max={16.0}
            warningThreshold={14.8}
            colorScheme="amber"
          />
        </div>
      </div>

      {/* Interactive Vehicle Diagnostics 3D/Wireframe Overview */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              SIMULATED SUBSYSTEM ANALYZER
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-white mt-3 tracking-wide">
              Real-Time Interactive Powertrain Testing
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mt-2">
              Our high-fidelity OBD-II simulation suite simulates bidirectional CAN 11-bit &amp; 29-bit bus requests. Test dynamic throttle responses, intercept simulated Random Cylinder Misfires (P0300), and verify electronic control units instantly.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Simulated Latency</span>
                <span className="text-lg font-black font-mono text-white block mt-0.5">2.4 ms</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">CAN Frames / Sec</span>
                <span className="text-lg font-black font-mono text-white block mt-0.5">500 Baud</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-wider">Simulator Logic</span>
                <span className="text-lg font-black font-mono text-white block mt-0.5">Python Core</span>
              </div>
            </div>
          </div>

          {/* Tech wireframe art graphic */}
          <div className="flex-1 flex items-center justify-center relative w-full max-w-sm py-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-full blur-2xl animate-pulse-slow" />
            
            <div className="w-full aspect-video rounded-2xl border border-slate-700/60 bg-slate-950/90 shadow-2xl relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 scanline opacity-70" />
              
              {/* Wireframe automotive schematic */}
              <svg className="w-full h-full text-cyan-500/40 transform scale-105" viewBox="0 0 500 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Car Outline Body */}
                <path d="M70 160 L50 140 L70 90 L160 80 L230 40 L340 40 L430 90 L460 140 L440 160 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3" />
                <path d="M160 80 L230 40 L340 40 L430 90" stroke="#38bdf8" strokeWidth="3" />
                
                {/* Wheels */}
                <circle cx="130" cy="160" r="30" stroke="#0ea5e9" strokeWidth="3" fill="#0369a1" fillOpacity="0.2" />
                <circle cx="130" cy="160" r="10" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="380" cy="160" r="30" stroke="#0ea5e9" strokeWidth="3" fill="#0369a1" fillOpacity="0.2" />
                <circle cx="380" cy="160" r="10" stroke="#38bdf8" strokeWidth="2" />

                {/* Subsystem Radar Glow Points */}
                <circle cx="160" cy="110" r="6" fill="#f43f5e" className="animate-ping" />
                <circle cx="160" cy="110" r="4" fill="#f43f5e" />
                <text x="175" y="115" fill="#f43f5e" fontSize="12" fontFamily="monospace" fontWeight="bold">DTC P0300 (ECU)</text>

                <circle cx="320" cy="130" r="5" fill="#10b981" />
                <line x1="320" y1="130" x2="350" y2="100" stroke="#10b981" strokeWidth="1.5" />
                <text x="355" y="95" fill="#10b981" fontSize="12" fontFamily="monospace">CAN OK</text>
                
                <circle cx="250" cy="140" r="8" fill="#38bdf8" className="animate-pulse" />
                <text x="235" y="180" fill="#38bdf8" fontSize="11" fontFamily="monospace">OBD PORT</text>
              </svg>

              <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 border border-slate-800 rounded text-[10px] font-mono text-cyan-300">
                ACTIVE RADAR SIMULATION
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

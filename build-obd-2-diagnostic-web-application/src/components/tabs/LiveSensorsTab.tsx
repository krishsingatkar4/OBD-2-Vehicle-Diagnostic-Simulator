import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  ShieldAlert, 
  Sliders, 
  Gauge, 
  Battery, 
  Thermometer, 
  Fuel, 
  Wind, 
  Cpu, 
  Sparkles 
} from 'lucide-react';
import { LiveSensorData, DiagnosticScanner } from '../../types';
import { SensorGauge } from '../Gauges';

interface LiveSensorsTabProps {
  liveData: LiveSensorData;
  setLiveData: React.Dispatch<React.SetStateAction<LiveSensorData>>;
  scanner: DiagnosticScanner;
  onLogEvent: (type: 'info' | 'warn' | 'error' | 'success', text: string, source: 'SCANNER' | 'ECU' | 'VEHICLE') => void;
}

export const LiveSensorsTab: React.FC<LiveSensorsTabProps> = ({
  liveData,
  setLiveData,
  scanner,
  onLogEvent
}) => {
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('Custom');

  // Real-time Simulation Engine
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (simulationActive && scanner.scanner_status === 'Connected') {
      interval = setInterval(() => {
        setLiveData((prev) => {
          // Add organic jitter to sensor metrics
          let nextRpm = prev.RPM + (Math.floor(Math.random() * 200) - 100);
          if (activePreset === 'Highway Cruise') nextRpm = Math.min(Math.max(nextRpm, 2000), 2800);
          else if (activePreset === 'Track Day Redline') nextRpm = Math.min(Math.max(nextRpm, 5500), 7800);
          else if (activePreset === 'City Traffic') nextRpm = Math.min(Math.max(nextRpm, 800), 2200);
          else nextRpm = Math.min(Math.max(nextRpm, 700), 7500);

          let nextSpeed = prev['Vehicle Speed'] + (Math.floor(Math.random() * 6) - 3);
          if (activePreset === 'Highway Cruise') nextSpeed = Math.min(Math.max(nextSpeed, 105), 135);
          else if (activePreset === 'Track Day Redline') nextSpeed = Math.min(Math.max(nextSpeed, 160), 260);
          else if (activePreset === 'City Traffic') nextSpeed = Math.min(Math.max(nextSpeed, 0), 60);
          else nextSpeed = Math.min(Math.max(nextSpeed, 0), 280);

          let nextTemp = prev['Coolant Temp'] + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0);
          if (activePreset === 'Track Day Redline') nextTemp = Math.min(Math.max(nextTemp, 98), 108);
          else nextTemp = Math.min(Math.max(nextTemp, 85), 102);

          const nextLoad = Math.min(Math.max(Math.round((nextRpm / 8000) * 100 + (Math.random() * 10 - 5)), 10), 100);
          const nextThrottle = Math.min(Math.max(Math.round((nextRpm / 8000) * 90 + (Math.random() * 10)), 0), 100);
          const nextVoltage = Number((13.8 + Math.random() * 0.6).toFixed(1));
          const nextFuel = Math.max(prev['Fuel Level'] - (Math.random() > 0.95 ? 1 : 0), 2);
          const nextBoost = Number(((nextLoad / 100) * 18 + Math.random() * 1.5).toFixed(1));

          // Threshold warning alerts exactly matching Choice #5 Python script
          if (nextRpm > 6000 && prev.RPM <= 6000) {
            onLogEvent('warn', `RPM redline warning at ${nextRpm} RPM. Upshift immediate!`, 'ECU');
          }
          if (nextTemp >= 105 && prev['Coolant Temp'] < 105) {
            onLogEvent('error', `CRITICAL OVERHEAT: Coolant temperature reached ${nextTemp}°C!`, 'ECU');
          }
          if (nextSpeed >= 150 && prev['Vehicle Speed'] < 150) {
            onLogEvent('warn', `High vehicle speed advisory: ${nextSpeed} km/h intercepted.`, 'VEHICLE');
          }

          return {
            RPM: nextRpm,
            'Coolant Temp': nextTemp,
            'Battery Voltage': nextVoltage,
            'Fuel Level': nextFuel,
            'Throttle Position': nextThrottle,
            'Vehicle Speed': nextSpeed,
            'Engine Load': nextLoad,
            Boost_Pressure: nextBoost,
            Oil_Temp: Math.min(nextTemp + 6, 115)
          };
        });
      }, 800);
    }

    return () => clearInterval(interval);
  }, [simulationActive, activePreset, scanner.scanner_status, setLiveData, onLogEvent]);

  const handleApplyPreset = (presetName: string) => {
    setActivePreset(presetName);
    if (presetName === 'Highway Cruise') {
      setLiveData({
        RPM: 2400,
        'Coolant Temp': 90,
        'Battery Voltage': 14.2,
        'Fuel Level': 75,
        'Throttle Position': 28,
        'Vehicle Speed': 120,
        'Engine Load': 38,
        Boost_Pressure: 8.5,
        Oil_Temp: 96
      });
      onLogEvent('info', 'Loaded Engine Telemetry Profile: Highway Cruise Mode', 'SCANNER');
    } else if (presetName === 'Track Day Redline') {
      setLiveData({
        RPM: 6800,
        'Coolant Temp': 106,
        'Battery Voltage': 14.4,
        'Fuel Level': 42,
        'Throttle Position': 88,
        'Vehicle Speed': 215,
        'Engine Load': 92,
        Boost_Pressure: 19.4,
        Oil_Temp: 112
      });
      onLogEvent('warn', 'Loaded Engine Telemetry Profile: Track Day Redline (High Load Stress)', 'SCANNER');
    } else if (presetName === 'City Traffic') {
      setLiveData({
        RPM: 1100,
        'Coolant Temp': 96,
        'Battery Voltage': 13.9,
        'Fuel Level': 62,
        'Throttle Position': 14,
        'Vehicle Speed': 35,
        'Engine Load': 24,
        Boost_Pressure: 2.1,
        Oil_Temp: 100
      });
      onLogEvent('info', 'Loaded Engine Telemetry Profile: Stop & Go City Traffic', 'SCANNER');
    } else if (presetName === 'Cold Start Idle') {
      setLiveData({
        RPM: 1450,
        'Coolant Temp': 45,
        'Battery Voltage': 14.6,
        'Fuel Level': 90,
        'Throttle Position': 18,
        'Vehicle Speed': 0,
        'Engine Load': 30,
        Boost_Pressure: 0.0,
        Oil_Temp: 44
      });
      onLogEvent('info', 'Loaded Engine Telemetry Profile: Cold Start Warming Sequence', 'SCANNER');
    }
  };

  const handleSliderChange = (metric: keyof LiveSensorData, val: number) => {
    setActivePreset('Custom');
    setLiveData((prev) => ({
      ...prev,
      [metric]: val
    }));
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Top Header Controls Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-wide">
                Live Sensor Telemetry Suite
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Simulated bidirectional PID reading matching Python Engine Link choice #5
              </p>
            </div>
          </div>
        </div>

        {/* Auto Simulation Master Toggles */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto">
          {scanner.scanner_status === 'Disconnected' ? (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Connect simulator to ECU to enable Auto-Pilot Live stream</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  const nxt = !simulationActive;
                  setSimulationActive(nxt);
                  onLogEvent(
                    nxt ? 'success' : 'info', 
                    nxt ? 'Real-Time CAN Sensor Simulation Auto-Pilot Engaged' : 'Real-Time CAN Sensor Simulation Paused', 
                    'SCANNER'
                  );
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold font-display uppercase tracking-widest text-xs transition-all cursor-pointer shadow-lg ${
                  simulationActive
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {simulationActive ? (
                  <>
                    <Pause className="w-4 h-4 text-slate-950 fill-slate-950" />
                    <span>Pause Auto Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
                    <span>Engage Auto Stream</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleApplyPreset('Highway Cruise')}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors flex items-center justify-center cursor-pointer"
                title="Reset to Baseline"
              >
                <RotateCcw className="w-4 h-4 text-cyan-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Drive Presets Switcher */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold font-mono tracking-wider text-slate-300 uppercase">Engine Test Profile Presets:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Highway Cruise', 'Track Day Redline', 'City Traffic', 'Cold Start Idle'].map((pName) => {
            const isSel = activePreset === pName;
            return (
              <button
                key={pName}
                onClick={() => handleApplyPreset(pName)}
                className={`p-3 rounded-xl text-xs font-semibold font-display tracking-wide transition-all text-left border cursor-pointer flex justify-between items-center ${
                  isSel 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/50 shadow-sm' 
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
              >
                <span>{pName}</span>
                {isSel && <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Primary Circle Digital Gauge Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SensorGauge
          label="Engine RPM"
          value={liveData.RPM}
          unit="RPM"
          min={0}
          max={8000}
          warningThreshold={5500}
          criticalThreshold={6800}
          colorScheme="cyan"
          icon={<Cpu className="w-4 h-4" />}
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
          icon={<Zap className="w-4 h-4" />}
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
          icon={<Thermometer className="w-4 h-4" />}
        />
      </div>

      {/* Secondary Subsystem Progress Bar Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorGauge
          label="Battery Voltage"
          value={liveData['Battery Voltage']}
          unit="V"
          min={10.0}
          max={16.0}
          warningThreshold={14.8}
          colorScheme="amber"
          type="bar"
          icon={<Battery className="w-4 h-4" />}
        />

        <SensorGauge
          label="Fuel Level"
          value={liveData['Fuel Level']}
          unit="%"
          min={0}
          max={100}
          colorScheme="blue"
          type="bar"
          icon={<Fuel className="w-4 h-4" />}
        />

        <SensorGauge
          label="Throttle Position"
          value={liveData['Throttle Position']}
          unit="%"
          min={0}
          max={100}
          colorScheme="purple"
          type="bar"
          icon={<Gauge className="w-4 h-4" />}
        />

        <SensorGauge
          label="Engine Load"
          value={liveData['Engine Load']}
          unit="%"
          min={0}
          max={100}
          warningThreshold={75}
          criticalThreshold={90}
          colorScheme="rose"
          type="bar"
          icon={<Wind className="w-4 h-4" />}
        />
      </div>

      {/* Manual Override Telemetry Sandbox Workbench */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
          <div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              BIDIRECTIONAL INJECTION WORKBENCH
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-1">
              Manual Sensor Signal Overrides
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:block">Real-Time Slider Injectors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Slider #1: RPM */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold uppercase tracking-wider">Engine RPM</span>
              <span className="text-cyan-400 font-black">{liveData.RPM} <span className="text-[10px] font-normal text-slate-500">RPM</span></span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={8000} 
              step={50}
              value={liveData.RPM} 
              onChange={(e) => handleSliderChange('RPM', Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-600">
              <span>0 (Idle)</span>
              <span>8000 (Redline)</span>
            </div>
          </div>

          {/* Slider #2: Speed */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold uppercase tracking-wider">Vehicle Speed</span>
              <span className="text-emerald-400 font-black">{liveData['Vehicle Speed']} <span className="text-[10px] font-normal text-slate-500">km/h</span></span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={300} 
              step={1}
              value={liveData['Vehicle Speed']} 
              onChange={(e) => handleSliderChange('Vehicle Speed', Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-600">
              <span>0 km/h</span>
              <span>300 km/h</span>
            </div>
          </div>

          {/* Slider #3: Coolant Temp */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold uppercase tracking-wider">Coolant Temp</span>
              <span className="text-rose-400 font-black">{liveData['Coolant Temp']} <span className="text-[10px] font-normal text-slate-500">°C</span></span>
            </div>
            <input 
              type="range" 
              min={40} 
              max={120} 
              step={1}
              value={liveData['Coolant Temp']} 
              onChange={(e) => handleSliderChange('Coolant Temp', Number(e.target.value))}
              className="w-full accent-rose-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-600">
              <span>40°C (Cold)</span>
              <span>120°C (Boiling)</span>
            </div>
          </div>

          {/* Slider #4: Battery Voltage */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold uppercase tracking-wider">Battery Voltage</span>
              <span className="text-amber-400 font-black">{liveData['Battery Voltage']} <span className="text-[10px] font-normal text-slate-500">V</span></span>
            </div>
            <input 
              type="range" 
              min={10.0} 
              max={16.0} 
              step={0.1}
              value={liveData['Battery Voltage']} 
              onChange={(e) => handleSliderChange('Battery Voltage', Number(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-600">
              <span>10.0V (Low)</span>
              <span>16.0V (High)</span>
            </div>
          </div>

          {/* Slider #5: Throttle */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold uppercase tracking-wider">Throttle Position</span>
              <span className="text-purple-400 font-black">{liveData['Throttle Position']} <span className="text-[10px] font-normal text-slate-500">%</span></span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={100} 
              step={1}
              value={liveData['Throttle Position']} 
              onChange={(e) => handleSliderChange('Throttle Position', Number(e.target.value))}
              className="w-full accent-purple-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-600">
              <span>0% (Closed)</span>
              <span>100% (WOT)</span>
            </div>
          </div>

          {/* Slider #6: Engine Load */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold uppercase tracking-wider">Engine Load</span>
              <span className="text-rose-400 font-black">{liveData['Engine Load']} <span className="text-[10px] font-normal text-slate-500">%</span></span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={100} 
              step={1}
              value={liveData['Engine Load']} 
              onChange={(e) => handleSliderChange('Engine Load', Number(e.target.value))}
              className="w-full accent-rose-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-600">
              <span>0%</span>
              <span>100% (Heavy Tow)</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

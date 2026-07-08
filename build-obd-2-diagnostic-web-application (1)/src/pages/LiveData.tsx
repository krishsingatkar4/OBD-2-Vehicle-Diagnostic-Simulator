import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Play, Pause, RotateCcw, AlertCircle, Cpu, WifiOff } from 'lucide-react';
import { useStore } from '../store';
import GaugeChart from '../components/GaugeChart';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

interface DataPoint {
  time: string;
  rpm: number;
  coolantTemp: number;
  batteryVoltage: number;
  fuelLevel: number;
  throttlePosition: number;
  vehicleSpeed: number;
  engineLoad: number;
}

export default function LiveData() {
  const { liveData, generateLiveData, scannerStatus, connectedEcuId, ecus } = useStore();
  const [isLive, setIsLive] = useState(false);
  const [history, setHistory] = useState<DataPoint[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connectedEcu = ecus.find(e => e.ecuId === connectedEcuId);

  const startLive = () => {
    if (scannerStatus !== 'Connected') return;
    setIsLive(true);
    generateLiveData();
  };

  const stopLive = () => {
    setIsLive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(() => {
        generateLiveData();
      }, 2000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive, generateLiveData]);

  useEffect(() => {
    if (liveData) {
      setHistory(prev => [...prev.slice(-29), {
        time: liveData.timestamp,
        ...liveData,
      }]);
    }
  }, [liveData]);

  const getWarnings = () => {
    if (!liveData) return [];
    const warnings: { label: string; message: string; type: 'warning' | 'danger' }[] = [];
    if (liveData.rpm > 3000) warnings.push({ label: 'RPM', message: `High RPM at ${liveData.rpm}. Please upshift!`, type: liveData.rpm > 3500 ? 'danger' : 'warning' });
    if (liveData.coolantTemp >= 105) warnings.push({ label: 'Coolant', message: `High coolant temperature: ${liveData.coolantTemp}°C`, type: 'danger' });
    if (liveData.batteryVoltage <= 12.5) warnings.push({ label: 'Battery', message: `Low battery voltage: ${liveData.batteryVoltage}V`, type: 'warning' });
    if (liveData.fuelLevel <= 10) warnings.push({ label: 'Fuel', message: `Low fuel level: ${liveData.fuelLevel}%`, type: 'danger' });
    if (liveData.vehicleSpeed >= 150) warnings.push({ label: 'Speed', message: `High speed warning: ${liveData.vehicleSpeed} km/h`, type: 'danger' });
    if (liveData.engineLoad >= 80) warnings.push({ label: 'Load', message: `High engine load: ${liveData.engineLoad}%`, type: 'warning' });
    return warnings;
  };

  const warnings = getWarnings();

  if (scannerStatus !== 'Connected') {
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-text-primary">Live Sensor Data</h1>
          <p className="text-text-secondary text-sm mt-1">Real-time vehicle telemetry</p>
        </motion.div>
        <motion.div variants={item} className="card-gradient border border-border rounded-xl p-12 text-center">
          <WifiOff className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-40" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">Scanner Not Connected</h2>
          <p className="text-sm text-text-muted max-w-md mx-auto">
            Please connect your diagnostic scanner to an ECU first via the ECU Manager to read live sensor data.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Live Sensor Data</h1>
          <p className="text-text-secondary text-sm mt-1">
            Connected to <span className="text-accent font-medium">{connectedEcu?.ecuId}</span> · {connectedEcu?.manufacturer}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isLive && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">LIVE</span>
            </div>
          )}
          <button
            onClick={() => isLive ? stopLive() : startLive()}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg ${
              isLive
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 shadow-red-500/10'
                : 'bg-accent hover:bg-accent-hover text-white shadow-accent/20'
            }`}
          >
            {isLive ? <><Pause className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4" /> Start Live</>}
          </button>
          <button
            onClick={() => { setHistory([]); }}
            className="p-2.5 bg-bg-card border border-border rounded-lg text-text-muted hover:text-text-primary transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <motion.div variants={item} className="space-y-2">
          {warnings.map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                w.type === 'danger'
                  ? 'bg-red-500/5 border-red-500/20'
                  : 'bg-amber-500/5 border-amber-500/20'
              }`}
            >
              <AlertCircle className={`w-4 h-4 shrink-0 ${w.type === 'danger' ? 'text-red-400' : 'text-amber-400'}`} />
              <span className={`text-sm ${w.type === 'danger' ? 'text-red-400' : 'text-amber-400'}`}>{w.message}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Gauges */}
      {liveData ? (
        <>
          <motion.div variants={item} className="card-gradient border border-border rounded-xl p-6">
            <h2 className="text-base font-semibold text-text-primary mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" /> Gauges
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
              <GaugeChart value={liveData.rpm} max={4000} label="RPM" unit="rpm" color="#3b82f6" warningThreshold={3000} dangerThreshold={3500} />
              <GaugeChart value={liveData.coolantTemp} max={120} label="Coolant" unit="°C" color="#06b6d4" warningThreshold={95} dangerThreshold={105} />
              <GaugeChart value={liveData.batteryVoltage} max={15} label="Battery" unit="V" color="#10b981" />
              <GaugeChart value={liveData.fuelLevel} max={100} label="Fuel" unit="%" color="#f59e0b" warningThreshold={20} dangerThreshold={10} />
              <GaugeChart value={liveData.throttlePosition} max={100} label="Throttle" unit="%" color="#8b5cf6" />
              <GaugeChart value={liveData.vehicleSpeed} max={200} label="Speed" unit="km/h" color="#ec4899" warningThreshold={120} dangerThreshold={150} />
              <GaugeChart value={liveData.engineLoad} max={100} label="Load" unit="%" color="#f97316" warningThreshold={80} dangerThreshold={90} />
            </div>
          </motion.div>

          {/* Data Table */}
          <motion.div variants={item} className="card-gradient border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" />
              <h2 className="text-base font-semibold text-text-primary">Sensor Readings</h2>
              <span className="ml-auto text-xs text-text-muted font-mono">{liveData.timestamp}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/30">
              {[
                { label: 'Engine RPM', value: `${liveData.rpm} RPM`, icon: '🔄' },
                { label: 'Coolant Temperature', value: `${liveData.coolantTemp}°C`, icon: '🌡️' },
                { label: 'Battery Voltage', value: `${liveData.batteryVoltage}V`, icon: '🔋' },
                { label: 'Fuel Level', value: `${liveData.fuelLevel}%`, icon: '⛽' },
                { label: 'Throttle Position', value: `${liveData.throttlePosition}%`, icon: '🎛️' },
                { label: 'Vehicle Speed', value: `${liveData.vehicleSpeed} km/h`, icon: '🏎️' },
                { label: 'Engine Load', value: `${liveData.engineLoad}%`, icon: '⚙️' },
              ].map((reading, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                  <span className="text-lg">{reading.icon}</span>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">{reading.label}</p>
                    <p className="text-sm font-semibold text-text-primary font-mono">{reading.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* History */}
          {history.length > 1 && (
            <motion.div variants={item} className="card-gradient border border-border rounded-xl p-5">
              <h2 className="text-base font-semibold text-text-primary mb-4">Reading History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-text-muted border-b border-border">
                      <th className="text-left py-2 px-2 font-medium">Time</th>
                      <th className="text-right py-2 px-2 font-medium">RPM</th>
                      <th className="text-right py-2 px-2 font-medium">Temp</th>
                      <th className="text-right py-2 px-2 font-medium">Volts</th>
                      <th className="text-right py-2 px-2 font-medium">Fuel</th>
                      <th className="text-right py-2 px-2 font-medium">Throttle</th>
                      <th className="text-right py-2 px-2 font-medium">Speed</th>
                      <th className="text-right py-2 px-2 font-medium">Load</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice().reverse().slice(0, 10).map((h, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-bg-card-hover/30">
                        <td className="py-2 px-2 text-text-muted font-mono">{h.time}</td>
                        <td className="py-2 px-2 text-right text-text-secondary font-mono">{h.rpm}</td>
                        <td className="py-2 px-2 text-right text-text-secondary font-mono">{h.coolantTemp}°</td>
                        <td className="py-2 px-2 text-right text-text-secondary font-mono">{h.batteryVoltage}V</td>
                        <td className="py-2 px-2 text-right text-text-secondary font-mono">{h.fuelLevel}%</td>
                        <td className="py-2 px-2 text-right text-text-secondary font-mono">{h.throttlePosition}%</td>
                        <td className="py-2 px-2 text-right text-text-secondary font-mono">{h.vehicleSpeed}</td>
                        <td className="py-2 px-2 text-right text-text-secondary font-mono">{h.engineLoad}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div variants={item} className="card-gradient border border-border rounded-xl p-12 text-center">
          <Activity className="w-14 h-14 text-text-muted mx-auto mb-4 opacity-30" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">Ready to Read</h2>
          <p className="text-sm text-text-muted max-w-md mx-auto">
            Click "Start Live" to begin reading real-time sensor data from the connected ECU.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

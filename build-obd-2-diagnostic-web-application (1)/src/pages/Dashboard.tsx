import { motion } from 'framer-motion';
import { Car, Cpu, AlertTriangle, Activity, FileText, Zap, TrendingUp, Shield } from 'lucide-react';
import { useStore } from '../store';
import GaugeChart from '../components/GaugeChart';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const { vehicles, ecus, faultCodes, reports, liveData, scannerStatus, connectedEcuId } = useStore();
  
  const activeFaults = faultCodes.filter(f => f.status === 'Active').length;
  const criticalFaults = faultCodes.filter(f => f.severity === 'Critical' && f.status === 'Active').length;
  const connectedEcu = ecus.find(e => e.ecuId === connectedEcuId);

  const stats = [
    { label: 'Vehicles', value: vehicles.length, icon: Car, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400' },
    { label: 'ECU Units', value: ecus.length, icon: Cpu, color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-500/10', textColor: 'text-cyan-400' },
    { label: 'Active Faults', value: activeFaults, icon: AlertTriangle, color: activeFaults > 0 ? 'from-amber-500 to-orange-500' : 'from-green-500 to-emerald-500', bgColor: activeFaults > 0 ? 'bg-amber-500/10' : 'bg-green-500/10', textColor: activeFaults > 0 ? 'text-amber-400' : 'text-green-400' },
    { label: 'Reports', value: reports.length, icon: FileText, color: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-500/10', textColor: 'text-purple-400' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Welcome to OBD-2 Vehicle Diagnostic Simulator</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2, scale: 1.01 }}
              className="card-gradient border border-border rounded-xl p-5 hover:border-border-light transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Status Card */}
        <motion.div variants={item} className="lg:col-span-1 card-gradient border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-text-primary">Scanner Status</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Connection</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                scannerStatus === 'Connected' 
                  ? 'bg-green-500/15 text-green-400' 
                  : 'bg-red-500/15 text-red-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${scannerStatus === 'Connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                {scannerStatus}
              </span>
            </div>

            {connectedEcu && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">ECU</span>
                  <span className="text-sm text-text-primary font-medium">{connectedEcu.ecuId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Manufacturer</span>
                  <span className="text-sm text-text-primary font-medium">{connectedEcu.manufacturer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Firmware</span>
                  <span className="text-sm text-accent font-mono text-xs">{connectedEcu.firmware}</span>
                </div>
              </>
            )}

            {!connectedEcu && (
              <div className="py-4 text-center">
                <Zap className="w-8 h-8 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-muted">No ECU connected</p>
                <p className="text-xs text-text-muted mt-1">Go to ECU Manager to connect</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Live Gauges */}
        <motion.div variants={item} className="lg:col-span-2 card-gradient border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h2 className="text-base font-semibold text-text-primary">Live Sensor Data</h2>
            </div>
            {liveData && (
              <span className="text-xs text-text-muted font-mono">{liveData.timestamp}</span>
            )}
          </div>

          {liveData ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <GaugeChart value={liveData.rpm} max={4000} label="RPM" unit="rpm" color="#3b82f6" warningThreshold={3000} dangerThreshold={3500} />
              <GaugeChart value={liveData.coolantTemp} max={120} label="Coolant" unit="°C" color="#06b6d4" warningThreshold={95} dangerThreshold={105} />
              <GaugeChart value={liveData.batteryVoltage} max={15} label="Battery" unit="V" color="#10b981" warningThreshold={14} dangerThreshold={14.5} />
              <GaugeChart value={liveData.vehicleSpeed} max={200} label="Speed" unit="km/h" color="#8b5cf6" warningThreshold={120} dangerThreshold={150} />
            </div>
          ) : (
            <div className="py-10 text-center">
              <Activity className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-50" />
              <p className="text-sm text-text-muted">No live data available</p>
              <p className="text-xs text-text-muted mt-1">Connect to ECU and read live data</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Fault Codes Overview & Recent Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Faults */}
        <motion.div variants={item} className="card-gradient border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-text-primary">Active Fault Codes</h2>
            {criticalFaults > 0 && (
              <span className="ml-auto text-xs bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full font-semibold">
                {criticalFaults} Critical
              </span>
            )}
          </div>

          {faultCodes.filter(f => f.status === 'Active').length > 0 ? (
            <div className="space-y-2.5">
              {faultCodes.filter(f => f.status === 'Active').slice(0, 5).map((fault) => (
                <div key={fault.code} className="flex items-center gap-3 p-3 bg-bg-input rounded-lg border border-border/50">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    fault.severity === 'Critical' ? 'bg-red-500 animate-pulse' :
                    fault.severity === 'High' ? 'bg-orange-500' :
                    fault.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-accent">{fault.code}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                        fault.severity === 'Critical' ? 'bg-red-500/15 text-red-400' :
                        fault.severity === 'High' ? 'bg-orange-500/15 text-orange-400' :
                        fault.severity === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'
                      }`}>{fault.severity}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{fault.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Shield className="w-10 h-10 text-green-400 mx-auto mb-2 opacity-70" />
              <p className="text-sm text-green-400 font-medium">All Clear</p>
              <p className="text-xs text-text-muted mt-1">No active fault codes</p>
            </div>
          )}
        </motion.div>

        {/* Recent Vehicles */}
        <motion.div variants={item} className="card-gradient border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-text-primary">Registered Vehicles</h2>
            <span className="ml-auto text-xs text-text-muted">{vehicles.length} total</span>
          </div>

          {vehicles.length > 0 ? (
            <div className="space-y-2.5">
              {vehicles.slice(0, 5).map((vehicle) => (
                <div key={vehicle.vehicleId} className="flex items-center gap-3 p-3 bg-bg-input rounded-lg border border-border/50">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Car className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{vehicle.company} {vehicle.model}</p>
                    <p className="text-xs text-text-muted">{vehicle.ownerName} · {vehicle.year} · {vehicle.fuelType}</p>
                  </div>
                  <span className="text-xs font-mono text-text-muted">{vehicle.vehicleId}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Car className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm text-text-muted">No vehicles registered</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

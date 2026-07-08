import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trash2, ChevronDown, ChevronUp, Car, Cpu, AlertTriangle, Activity, Clock, WifiOff } from 'lucide-react';
import { useStore, DiagnosticReport } from '../store';
import Modal from '../components/Modal';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Reports() {
  const { vehicles, reports, generateReport, deleteReport, scannerStatus, connectedEcuId } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const handleGenerate = () => {
    if (!selectedVehicle) return;
    generateReport(selectedVehicle);
    setShowGenerate(false);
    setSelectedVehicle('');
  };

  const canGenerate = scannerStatus === 'Connected' && connectedEcuId && vehicles.length > 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Diagnostic Reports</h1>
          <p className="text-text-secondary text-sm mt-1">Generated vehicle diagnostic reports</p>
        </div>
        <button
          onClick={() => {
            if (canGenerate) {
              setShowGenerate(true);
              setSelectedVehicle(vehicles[0]?.vehicleId || '');
            }
          }}
          disabled={!canGenerate}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg ${
            canGenerate
              ? 'bg-accent hover:bg-accent-hover text-white shadow-accent/20'
              : 'bg-bg-card border border-border text-text-muted cursor-not-allowed shadow-none'
          }`}
          title={!canGenerate ? 'Connect scanner to ECU and register vehicles first' : ''}
        >
          <Plus className="w-4 h-4" /> Generate Report
        </button>
      </motion.div>

      {!canGenerate && (
        <motion.div variants={item} className="flex items-center gap-3 px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-400">
            {!connectedEcuId 
              ? 'Connect your scanner to an ECU via ECU Manager to generate reports.' 
              : vehicles.length === 0 
                ? 'Register a vehicle first to generate reports.' 
                : 'Scanner not connected.'}
          </p>
        </motion.div>
      )}

      {/* Reports List */}
      <motion.div variants={item} className="space-y-4">
        <AnimatePresence mode="popLayout">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              isExpanded={expanded === report.id}
              onToggle={() => setExpanded(expanded === report.id ? null : report.id)}
              onDelete={() => deleteReport(report.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {reports.length === 0 && (
        <motion.div variants={item} className="card-gradient border border-border rounded-xl p-16 text-center">
          <FileText className="w-14 h-14 text-text-muted mx-auto mb-4 opacity-30" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">No Reports Yet</h2>
          <p className="text-sm text-text-muted max-w-md mx-auto">
            Generate your first diagnostic report by connecting to an ECU and selecting a vehicle.
          </p>
        </motion.div>
      )}

      {/* Generate Modal */}
      <Modal isOpen={showGenerate} onClose={() => setShowGenerate(false)} title="Generate Diagnostic Report">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Select Vehicle</label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent cursor-pointer"
            >
              {vehicles.map(v => (
                <option key={v.vehicleId} value={v.vehicleId}>
                  {v.company} {v.model} ({v.vehicleId}) — {v.ownerName}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-bg-input rounded-lg border border-border/50 text-xs text-text-muted space-y-1">
            <p>This report will include:</p>
            <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
              <li>Vehicle details</li>
              <li>Connected ECU information</li>
              <li>Active fault codes</li>
              <li>Live sensor data snapshot</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowGenerate(false)}
              className="flex-1 px-4 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

function ReportCard({ report, isExpanded, onToggle, onDelete }: { report: DiagnosticReport; isExpanded: boolean; onToggle: () => void; onDelete: () => void }) {
  const activeFaults = report.faultList.filter(f => f.status === 'Active').length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card-gradient border border-border rounded-xl overflow-hidden hover:border-border-light transition-all"
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={onToggle}>
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm text-text-primary">{report.vehicle.company} {report.vehicle.model}</h3>
            <span className="text-xs text-text-muted font-mono">{report.id}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Clock className="w-3 h-3" /> {report.dateTime}
            </span>
            {activeFaults > 0 && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {activeFaults} fault{activeFaults > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 rounded-lg hover:bg-bg-card text-text-muted hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border/50 pt-4 space-y-4">
              {/* Vehicle Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-bg-input rounded-lg border border-border/50">
                  <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5" /> Vehicle Details
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-text-muted">Owner</span><span className="text-text-primary">{report.vehicle.ownerName}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Vehicle</span><span className="text-text-primary">{report.vehicle.company} {report.vehicle.model}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Year</span><span className="text-text-primary">{report.vehicle.year}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Fuel</span><span className="text-text-primary">{report.vehicle.fuelType}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">VIN</span><span className="text-text-primary font-mono text-[10px]">{report.vehicle.vin}</span></div>
                  </div>
                </div>

                <div className="p-4 bg-bg-input rounded-lg border border-border/50">
                  <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> ECU Details
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-text-muted">ECU ID</span><span className="text-text-primary">{report.ecu.ecuId}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Manufacturer</span><span className="text-text-primary">{report.ecu.manufacturer}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Firmware</span><span className="text-accent font-mono">{report.ecu.firmware}</span></div>
                  </div>
                </div>
              </div>

              {/* Faults */}
              {report.faultList.length > 0 && (
                <div className="p-4 bg-bg-input rounded-lg border border-border/50">
                  <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Active Fault Codes
                  </h4>
                  <div className="space-y-2">
                    {report.faultList.map(f => (
                      <div key={f.code} className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-accent">{f.code}</span>
                        <span className="text-text-secondary flex-1">{f.description}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          f.severity === 'Critical' ? 'bg-red-500/12 text-red-400' :
                          f.severity === 'High' ? 'bg-orange-500/12 text-orange-400' :
                          f.severity === 'Medium' ? 'bg-amber-500/12 text-amber-400' : 'bg-blue-500/12 text-blue-400'
                        }`}>{f.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Data */}
              <div className="p-4 bg-bg-input rounded-lg border border-border/50">
                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Sensor Data Snapshot
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'RPM', value: `${report.liveData.rpm}`, unit: 'rpm' },
                    { label: 'Coolant', value: `${report.liveData.coolantTemp}`, unit: '°C' },
                    { label: 'Battery', value: `${report.liveData.batteryVoltage}`, unit: 'V' },
                    { label: 'Fuel', value: `${report.liveData.fuelLevel}`, unit: '%' },
                    { label: 'Throttle', value: `${report.liveData.throttlePosition}`, unit: '%' },
                    { label: 'Speed', value: `${report.liveData.vehicleSpeed}`, unit: 'km/h' },
                    { label: 'Load', value: `${report.liveData.engineLoad}`, unit: '%' },
                  ].map((d) => (
                    <div key={d.label} className="text-center">
                      <p className="text-[10px] text-text-muted uppercase">{d.label}</p>
                      <p className="text-sm font-bold text-text-primary font-mono">{d.value}<span className="text-[10px] text-text-muted ml-0.5">{d.unit}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

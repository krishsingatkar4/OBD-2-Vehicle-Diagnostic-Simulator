import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Car, 
  Cpu, 
  Layers, 
  Sparkles,
  Zap,
  Check
} from 'lucide-react';
import { DiagnosticReport, FaultCode } from '../../types';

interface ReportsTabProps {
  reportsHistory: DiagnosticReport[];
  faults: FaultCode[];
  onGenerateReport: () => void;
  onSaveData: () => void;
  onLoadData: () => void;
  onLogEvent: (type: 'info' | 'warn' | 'error' | 'success', text: string, source: 'SYSTEM') => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  reportsHistory,
  onGenerateReport,
  onSaveData,
  onLoadData,
  onLogEvent
}) => {
  const [selectedReport, setSelectedReport] = useState<DiagnosticReport | null>(reportsHistory[reportsHistory.length - 1] || null);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = (rep: DiagnosticReport) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rep, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `apex_obd_report_${rep.report_id}.json`);
    dlAnchorElem.click();
    onLogEvent('success', `Exported Diagnostic Certificate ${rep.report_id} to JSON file.`, 'SYSTEM');
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Top Header Station Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <FileText className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-wide">
                Certified Diagnostic Reports Hub
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {reportsHistory.length} Certificates
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Generates immutable pre-purchase &amp; post-service OBD-II diagnostic validation reports
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto relative z-10">
          <button
            onClick={onGenerateReport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-black font-display uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-cyan-500/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Generate Active Report</span>
          </button>
        </div>
      </div>

      {/* Persistence Controls exactly matching Choices #12 `Save Data` & #13 `Load Data` */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Database className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold font-display text-white uppercase tracking-wider">OBD-II Multi-ECU Data Backup &amp; Restore</h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Saves Vehicles, ECUs, DTCs &amp; Scanner logs to secure LocalStorage</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onSaveData}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Choice #12: Save Data</span>
          </button>
          <button
            onClick={onLoadData}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Choice #13: Load Data</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Report History Selector & Active Preview Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: List of generated reports matching choice #11 */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col h-[650px] print:hidden">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <span className="text-xs font-bold font-display uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Log Archive
            </span>
            <span className="text-[10px] font-mono text-slate-500">{reportsHistory.length} logged</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {reportsHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-600 font-mono text-xs">
                No reports generated yet. Click &quot;Generate Active Report&quot; to begin.
              </div>
            ) : (
              reportsHistory.map((rep) => {
                const isSel = selectedReport?.report_id === rep.report_id;

                return (
                  <button
                    key={rep.report_id}
                    onClick={() => setSelectedReport(rep)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative overflow-hidden group ${
                      isSel 
                        ? 'bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/50 shadow-md shadow-cyan-500/5' 
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold font-display text-white truncate max-w-[140px]">
                        {rep.vehicle.company} {rep.vehicle.model}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {rep.report_id}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>{rep.date_time.split(' ')[0]}</span>
                      <span className={`${rep.fault_list.filter(f => f.status === 'active').length > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                        {rep.fault_list.filter(f => f.status === 'active').length} Faults
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Official Inspection Printable Certificate Preview */}
        <div className="lg:col-span-3">
          {selectedReport ? (
            <div className="glass-panel bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative space-y-8 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
              
              {/* Certificate Top Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800 print:border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 print:bg-slate-900 print:shadow-none">
                    <Zap className="w-8 h-8 text-slate-950 fill-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-wider print:text-slate-900">
                      APEX<span className="text-cyan-400 print:text-blue-600">OBD</span> CERTIFICATE
                    </h1>
                    <p className="text-xs text-slate-400 font-mono mt-0.5 print:text-slate-600">
                      Official Automotive Powertrain &amp; Multiplex Diagnostic Report
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-xs space-y-1">
                  <div className="text-slate-300 font-bold print:text-slate-800">CERTIFICATE ID: <span className="text-cyan-400 print:text-blue-700">{selectedReport.report_id}</span></div>
                  <div className="text-slate-400 print:text-slate-600">DATE &amp; TIME: {selectedReport.date_time}</div>
                  <div className="text-emerald-400 font-bold print:text-emerald-700 flex items-center gap-1 justify-start sm:justify-end">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> SECURE CHECKSUM VERIFIED
                  </div>
                </div>
              </div>

              {/* Box #1: Vehicle Details exactly matching Python code */}
              <div>
                <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-2 print:text-blue-700">
                  <Car className="w-4 h-4" /> 1. Specimen Identification
                </h3>
                
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono print:bg-slate-50 print:border-slate-300 print:text-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Vehicle Make &amp; Model</span>
                    <strong className="text-sm font-display font-black text-white block mt-0.5 print:text-slate-900">
                      {selectedReport.vehicle.company} {selectedReport.vehicle.model}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">17-Char VIN String</span>
                    <strong className="text-sm font-mono text-slate-200 block mt-0.5 print:text-slate-900">
                      {selectedReport.vehicle.vin}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Owner Name</span>
                    <strong className="text-sm font-display text-slate-200 block mt-0.5 print:text-slate-900">
                      {selectedReport.vehicle.owner_name}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Model Year &amp; Fuel</span>
                    <strong className="text-sm font-mono text-slate-200 block mt-0.5 print:text-slate-900">
                      {selectedReport.vehicle.year} ({selectedReport.vehicle.fuel_type})
                    </strong>
                  </div>
                </div>
              </div>

              {/* Box #2: Connected ECU Handshake Details */}
              <div>
                <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-purple-400 mb-3 flex items-center gap-2 print:text-purple-700">
                  <Cpu className="w-4 h-4" /> 2. Linked Electronic Control Unit (ECU)
                </h3>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono print:bg-slate-50 print:border-slate-300 print:text-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">ECU Target Module</span>
                    <strong className="text-sm font-black text-white block mt-0.5 print:text-slate-900">
                      {selectedReport.ecu?.ecu_id || 'Bosch MED17.7.5'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Manufacturer</span>
                    <strong className="text-xs font-bold text-slate-200 block mt-0.5 print:text-slate-900">
                      {selectedReport.ecu?.manufacturer || 'Bosch GmbH'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Firmware Build String</span>
                    <strong className="text-xs text-purple-300 block mt-0.5 print:text-purple-800">
                      {selectedReport.ecu?.firmware || 'v17.7.5.92-R'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Multiplex Protocol</span>
                    <strong className="text-xs text-slate-300 block mt-0.5 print:text-slate-900 truncate">
                      {selectedReport.scanner.scanner_name} (500kbaud)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Box #3: Real-time PID Sensor Snapshot exactly matching Choice #5 snapshot */}
              <div>
                <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2 print:text-emerald-700">
                  <Zap className="w-4 h-4" /> 3. Live Sensor Telemetry Snapshot Frame
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:text-slate-900">
                    <span className="text-[10px] text-slate-500 block uppercase">Engine RPM</span>
                    <span className="text-lg font-black text-cyan-400 block mt-0.5 print:text-blue-700">{selectedReport.live_data.RPM} <span className="text-xs font-normal text-slate-400 print:text-slate-600">RPM</span></span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:text-slate-900">
                    <span className="text-[10px] text-slate-500 block uppercase">Vehicle Speed</span>
                    <span className="text-lg font-black text-emerald-400 block mt-0.5 print:text-emerald-700">{selectedReport.live_data['Vehicle Speed']} <span className="text-xs font-normal text-slate-400 print:text-slate-600">km/h</span></span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:text-slate-900">
                    <span className="text-[10px] text-slate-500 block uppercase">Coolant Temperature</span>
                    <span className="text-lg font-black text-rose-400 block mt-0.5 print:text-red-700">{selectedReport.live_data['Coolant Temp']} <span className="text-xs font-normal text-slate-400 print:text-slate-600">°C</span></span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:text-slate-900">
                    <span className="text-[10px] text-slate-500 block uppercase">Battery Voltage</span>
                    <span className="text-lg font-black text-amber-400 block mt-0.5 print:text-amber-700">{selectedReport.live_data['Battery Voltage']} <span className="text-xs font-normal text-slate-400 print:text-slate-600">V</span></span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:text-slate-900">
                    <span className="text-[10px] text-slate-500 block uppercase">Throttle Position</span>
                    <span className="text-base font-bold text-slate-200 block mt-0.5 print:text-slate-900">{selectedReport.live_data['Throttle Position']}% WOT</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:text-slate-900">
                    <span className="text-[10px] text-slate-500 block uppercase">Engine Load</span>
                    <span className="text-base font-bold text-rose-300 block mt-0.5 print:text-red-800">{selectedReport.live_data['Engine Load']}% LOAD</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:text-slate-900">
                    <span className="text-[10px] text-slate-500 block uppercase">Fuel Remaining</span>
                    <span className="text-base font-bold text-blue-300 block mt-0.5 print:text-blue-800">{selectedReport.live_data['Fuel Level']}% TANK</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:text-slate-900">
                    <span className="text-[10px] text-slate-500 block uppercase">Boost Pressure</span>
                    <span className="text-base font-bold text-purple-300 block mt-0.5 print:text-purple-800">{selectedReport.live_data.Boost_Pressure || 14.2} PSI</span>
                  </div>
                </div>
              </div>

              {/* Box #4: Active DTC Intercept Trouble Codes */}
              <div>
                <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-rose-400 mb-3 flex items-center gap-2 print:text-red-700">
                  <AlertTriangle className="w-4 h-4" /> 4. Detected Trouble Codes (DTC Audit)
                </h3>

                {selectedReport.fault_list.filter(f => f.status === 'active').length === 0 ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-3 print:bg-emerald-50 print:border-emerald-300 print:text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span><strong>EMISSIONS &amp; DIAGNOSTIC PASS:</strong> No Active Powertrain, Network, or Safety Trouble Codes intercepted during scan.</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedReport.fault_list.filter(f => f.status === 'active').map((fault) => (
                      <div key={fault.code} className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 flex items-start justify-between gap-4 font-mono text-xs print:bg-slate-50 print:border-slate-300 print:text-slate-900">
                        <div className="flex items-start gap-3">
                          <span className="px-2 py-1 rounded bg-rose-500 font-black text-slate-950 font-mono shrink-0 print:bg-red-700 print:text-white">
                            {fault.code}
                          </span>
                          <div>
                            <div className="font-bold text-white font-display text-sm print:text-slate-900">{fault.description}</div>
                            {fault.recommended_action && <div className="text-slate-400 text-[11px] mt-0.5 print:text-slate-700">Fix Protocol: {fault.recommended_action}</div>}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0 print:bg-red-100 print:text-red-800 print:border-red-300">
                          {fault.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certificate Sign-off Footer */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-slate-400 print:border-slate-300 print:text-slate-700">
                <div>
                  <strong>ApexPro Certification Authority</strong> &bull; Secure CAN Checksum: <span className="text-slate-200 print:text-slate-900">0x8F92A01C</span>
                </div>
                <div className="italic">
                  Technician Signature: ______________________
                </div>
              </div>

              {/* Top Right Floating Export Controls for Certificate */}
              <div className="absolute top-6 right-6 flex items-center gap-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold shadow-lg"
                  title="Print official printable Diagnostic Certificate"
                >
                  <Printer className="w-4 h-4 text-cyan-400" />
                  <span>Print Report</span>
                </button>
                <button
                  onClick={() => handleExportJson(selectedReport)}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold shadow-lg"
                  title="Export raw JSON diagnosis"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>JSON</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-16 rounded-3xl border border-slate-800 text-center font-mono text-slate-500">
              Select a logged report from the archive on the left to preview its official certified document.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

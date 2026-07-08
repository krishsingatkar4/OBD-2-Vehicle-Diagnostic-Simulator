import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Filter, 
  Sparkles, 
  ShieldAlert, 
  Edit3, 
  Wrench
} from 'lucide-react';
import { FaultCode, FaultSeverity, FaultStatus } from '../../types';
import confetti from 'canvas-confetti';

interface FaultCodesTabProps {
  faults: FaultCode[];
  setFaults: React.Dispatch<React.SetStateAction<FaultCode[]>>;
  onLogEvent: (type: 'info' | 'warn' | 'error' | 'success', text: string, source: 'DTC') => void;
}

export const FaultCodesTab: React.FC<FaultCodesTabProps> = ({
  faults,
  setFaults,
  onLogEvent
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingFault, setEditingFault] = useState<FaultCode | null>(null);

  // New DTC Form State
  const [newCode, setNewCode] = useState<string>('P0');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newSeverity, setNewSeverity] = useState<FaultSeverity>('Warning');
  const [newStatus, setNewStatus] = useState<FaultStatus>('active');
  const [newAction, setNewAction] = useState<string>('');

  const triggerLaserScan = () => {
    setIsScanning(true);
    onLogEvent('info', 'Initiating OBD-II Multiplex DTC Laser Scan across all Modules...', 'DTC');
    setTimeout(() => {
      setIsScanning(false);
      onLogEvent('success', `Scan completed successfully. Intercepted ${faults.filter(f => f.status === 'active').length} Active Trouble Codes.`, 'DTC');
    }, 2500);
  };

  const clearAllActiveFaults = () => {
    setFaults((prev) => prev.map(f => ({ ...f, status: 'cleared' })));
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onLogEvent('success', 'All Active Trouble Codes have been successfully reset to CLEARED status.', 'DTC');
  };

  const handleClearSingleFault = (code: string, mode: 'fully' | 'to_cleared') => {
    if (mode === 'fully') {
      setFaults((prev) => prev.filter(f => f.code.toLowerCase() !== code.toLowerCase()));
      onLogEvent('success', `Fault code ${code} deleted entirely from OBD Database.`, 'DTC');
    } else {
      setFaults((prev) => prev.map(f => f.code.toLowerCase() === code.toLowerCase() ? { ...f, status: 'cleared' } : f));
      onLogEvent('success', `Fault code ${code} status changed from Active to Cleared.`, 'DTC');
    }
  };

  const handleAddFaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newDesc.trim()) return;

    // Verify uniqueness
    if (faults.some(f => f.code.toLowerCase() === newCode.trim().toLowerCase())) {
      alert(`DTC Fault Code ${newCode.trim()} already exists in diagnostic record!`);
      return;
    }

    const newF: FaultCode = {
      code: newCode.trim().toUpperCase(),
      description: newDesc.trim(),
      severity: newSeverity,
      status: newStatus,
      category: newCode.startsWith('P') ? 'Powertrain' : newCode.startsWith('C') ? 'Chassis' : newCode.startsWith('B') ? 'Body' : 'Network',
      recommended_action: newAction.trim() || 'Inspect relevant harness connectors and clear module memory.'
    };

    setFaults((prev) => [newF, ...prev]);
    onLogEvent('success', `New Fault Code ${newF.code} successfully injected into ECU registry.`, 'DTC');
    setIsAddModalOpen(false);
    setNewCode('P0');
    setNewDesc('');
    setNewAction('');
  };

  const handleEditFaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFault) return;

    setFaults((prev) => prev.map(f => f.code === editingFault.code ? editingFault : f));
    onLogEvent('success', `Updated Trouble Code ${editingFault.code} parameters successfully.`, 'DTC');
    setEditingFault(null);
  };

  // Filtered fault codes matching choice #7 and choice #8
  const filteredFaults = faults.filter((f) => {
    const matchesSearch = f.code.toLowerCase().includes(searchTerm.toLowerCase()) || f.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'ALL' || f.severity.toUpperCase() === filterSeverity.toUpperCase();
    const matchesStatus = filterStatus === 'ALL' || f.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Top Cockpit Title & Action Strip */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-wide">
                DTC Fault Trouble Code Suite
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {faults.filter(f => f.status === 'active').length} Active DTCs
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              ISO 15031-6 Standard DTC inspection, custom insertion &amp; bidirectional module reset
            </p>
          </div>
        </div>

        {/* Action triggers matching Choices #6, #7, #9 */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto relative z-10">
          <button
            onClick={triggerLaserScan}
            disabled={isScanning}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-black font-display uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-950 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Executing Laser Scan...' : 'Run Module Scan'}</span>
          </button>

          <button
            onClick={clearAllActiveFaults}
            disabled={faults.filter(f => f.status === 'active').length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-slate-950 font-black font-display uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg shadow-rose-500/20 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Clear All Faults</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
            title="Inject Custom Fault Code into ECU"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Laser Scan Graphic when active */}
      {isScanning && (
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
          <div className="relative w-full max-w-lg h-2 bg-slate-900 rounded-full overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-blue-500 animate-[radar-sweep_1.5s_ease-in-out_infinite]" />
          </div>
          <p className="text-xs font-mono font-bold text-cyan-300 tracking-widest uppercase">
            &gt; Querying Engine ECM, Transmission TCM, and Restraint Control Modules... &lt;
          </p>
        </div>
      )}

      {/* Search & Filtering Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search input matching choice #8 */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Code (e.g. P0300) or description (e.g. Lean, Misfire)..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono transition-colors"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300 font-mono"
            >
              ESC
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-400">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Status:</span>
          </div>
          {['ALL', 'ACTIVE', 'CLEARED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}

          {/* Severity Filters */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 ml-2">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Severity:</span>
          </div>
          {['ALL', 'CRITICAL', 'WARNING', 'LOW', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

      </div>

      {/* Main DTC Grid List */}
      <div>
        {filteredFaults.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto text-slate-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-300">No Diagnostic Trouble Codes Match Filter criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-mono">
              Try clicking &quot;Run Module Scan&quot; or clear existing filter search parameters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredFaults.map((fault) => {
              const isActive = fault.status === 'active';
              const isCritical = fault.severity === 'Critical';

              let severityBadge = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
              if (isCritical) severityBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse';
              else if (fault.severity === 'Warning') severityBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
              else if (fault.severity === 'Low') severityBadge = 'bg-blue-500/10 text-blue-300 border-blue-500/30';

              return (
                <div 
                  key={fault.code} 
                  className={`glass-panel p-5 rounded-2xl border transition-all duration-200 hover:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden group ${
                    isActive ? (isCritical ? 'border-rose-500/40 shadow-lg shadow-rose-500/5' : 'border-amber-500/30') : 'border-slate-800/80 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Left Side: Code & Description */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl font-mono text-base font-black tracking-tight border flex flex-col items-center justify-center min-w-[80px] shrink-0 ${
                      isActive 
                        ? (isCritical ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-md shadow-rose-500/20' : 'bg-amber-500 text-slate-950 border-amber-400') 
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}>
                      <span>{fault.code}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                          isActive ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {isActive ? '● ACTIVE FAULT' : '✔ CLEARED HISTORY'}
                        </span>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${severityBadge}`}>
                          {fault.severity} Severity
                        </span>

                        {fault.category && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                            {fault.category}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white font-display tracking-wide">
                        {fault.description}
                      </h3>

                      {fault.recommended_action && (
                        <p className="text-xs text-slate-400 flex items-start gap-1.5 pt-1">
                          <Wrench className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span><strong className="text-slate-300">Diagnostic Action:</strong> {fault.recommended_action}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Controls matching Python Choice #9 (clear fault or edit fault) */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80 w-full md:w-auto justify-end">
                    
                    <button
                      onClick={() => setEditingFault(fault)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
                      title="Update Fault Parameters (Choice #9 Override)"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Edit DTC</span>
                    </button>

                    {isActive && (
                      <button
                        onClick={() => handleClearSingleFault(fault.code, 'to_cleared')}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                        title="Change status from Active to Cleared"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Clear Fault</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleClearSingleFault(fault.code, 'fully')}
                      className="p-2 bg-slate-900 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 border border-slate-700 rounded-xl transition-all cursor-pointer group-hover:opacity-100"
                      title="Purge DTC exactly from database memory (Choice #9)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal #1: Add New Fault Code (`add_fault`) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold font-display text-white">Inject Custom DTC Fault Code</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleAddFaultSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Fault Trouble Code (DTC)</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. P0300, P0171, C0221, U0100"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Diagnostic Description</label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Random/Multiple Cylinder Misfire Detected"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-display text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as FaultSeverity)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Warning">Warning</option>
                    <option value="Low">Low</option>
                    <option value="Info">Info</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as FaultStatus)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="active">Active</option>
                    <option value="cleared">Cleared</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Recommended Service Action</label>
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="e.g. Inspect spark plugs, verify wiring harness and O2 signals."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-xl text-xs font-display font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20"
                >
                  Confirm Injection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal #2: Edit Existing Fault Code (`update_fault`) */}
      {editingFault && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold font-display text-white">Modify Fault Code: {editingFault.code}</h3>
              </div>
              <button 
                onClick={() => setEditingFault(null)}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleEditFaultSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Diagnostic Description</label>
                <input
                  type="text"
                  required
                  value={editingFault.description}
                  onChange={(e) => setEditingFault({ ...editingFault, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-display text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Severity Level</label>
                  <select
                    value={editingFault.severity}
                    onChange={(e) => setEditingFault({ ...editingFault, severity: e.target.value as FaultSeverity })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Warning">Warning</option>
                    <option value="Low">Low</option>
                    <option value="Info">Info</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Current Status</label>
                  <select
                    value={editingFault.status}
                    onChange={(e) => setEditingFault({ ...editingFault, status: e.target.value as FaultStatus })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="active">Active</option>
                    <option value="cleared">Cleared</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Recommended Service Action</label>
                <input
                  type="text"
                  value={editingFault.recommended_action || ''}
                  onChange={(e) => setEditingFault({ ...editingFault, recommended_action: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingFault(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-xl text-xs font-display font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

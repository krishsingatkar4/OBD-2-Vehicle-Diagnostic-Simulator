import React, { useState } from 'react';
import { Cpu, Search, Plus, Wifi, WifiOff, RefreshCw, Zap } from 'lucide-react';
import { ECU, DiagnosticScanner } from '../../types';

interface EcuHubTabProps {
  ecus: ECU[];
  setEcus: React.Dispatch<React.SetStateAction<ECU[]>>;
  scanner: DiagnosticScanner;
  onConnectTargetEcu: (targetEcu: ECU) => void;
  onDisconnectEcu: () => void;
  onLogEvent: (type: 'info' | 'warn' | 'error' | 'success', text: string, source: 'ECU') => void;
}

export const EcuHubTab: React.FC<EcuHubTabProps> = ({
  ecus,
  setEcus,
  scanner,
  onConnectTargetEcu,
  onDisconnectEcu,
  onLogEvent
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [connectingEcuId, setConnectingEcuId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New ECU form
  const [newId, setNewId] = useState<string>('ECU-');
  const [newManuf, setNewManuf] = useState<string>('');
  const [newFirm, setNewFirm] = useState<string>('v1.0.0-CAN');
  const [newProto, setNewProto] = useState<string>('ISO 15765-4 CAN (11bit, 500kbaud)');

  const handleConnectClick = (target: ECU) => {
    if (scanner.scanner_status === 'Connected' && scanner.connected_ecu?.ecu_id === target.ecu_id) {
      onLogEvent('info', `Target ECU ${target.ecu_id} is already linked to Scanner link.`, 'ECU');
      return;
    }

    setConnectingEcuId(target.ecu_id);
    onLogEvent('info', `Preparing ECU ${target.ecu_id} (${target.manufacturer}) for high-speed diagnostic handshake...`, 'ECU');

    setTimeout(() => {
      onConnectTargetEcu(target);
      setConnectingEcuId(null);
      onLogEvent('success', `ECU ${target.ecu_id} multiplex link established successfully at 500 kbps.`, 'ECU');
    }, 2500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newManuf.trim()) return;

    if (ecus.some(ec => ec.ecu_id.toLowerCase() === newId.trim().toLowerCase())) {
      alert(`ECU ID ${newId} already registered in CAN database!`);
      return;
    }

    const newE: ECU = {
      ecu_id: newId.trim().toUpperCase(),
      manufacturer: newManuf.trim(),
      firmware: newFirm.trim(),
      connection_status: 'Disconnected',
      protocol: newProto,
      bus_speed: '500 kbps'
    };

    setEcus((prev) => [...prev, newE]);
    onLogEvent('success', `Registered new electronic control unit module: ${newE.ecu_id} (${newE.manufacturer}).`, 'ECU');
    setIsAddModalOpen(false);
    setNewId('ECU-');
    setNewManuf('');
  };

  const filteredEcus = ecus.filter(e => 
    e.ecu_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.firmware.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Top Cockpit Title & Action Strip */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-wide">
                ECU Workbench Workbench
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {ecus.length} Target Modules
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Simulated electronic control unit CAN bus architecture and diagnostic handshakes
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-slate-950 font-black font-display uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg shadow-purple-500/20 cursor-pointer self-stretch md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
          <span>Register New ECU Module</span>
        </button>
      </div>

      {/* Search Input Filter */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ECU ID (e.g. MED17) or Manufacturer..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 font-mono transition-colors"
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
      </div>

      {/* ECUs Grid Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEcus.map((ecu) => {
          const isConnected = scanner.scanner_status === 'Connected' && scanner.connected_ecu?.ecu_id === ecu.ecu_id;
          const isConnThis = connectingEcuId === ecu.ecu_id;

          return (
            <div
              key={ecu.ecu_id}
              className={`glass-panel p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                isConnected 
                  ? 'border-emerald-500/70 shadow-2xl shadow-emerald-500/10 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border ${
                      isConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 animate-pulse' : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}>
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">ECU TARGET SPEC</span>
                      <h3 className="text-xl font-black font-display text-white tracking-tight">
                        {ecu.ecu_id}
                      </h3>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                    isConnected 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    {isConnected ? <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" /> : <WifiOff className="w-3 h-3 text-slate-500" />}
                    <span>{isConnected ? 'Active ECM Link' : 'Standby'}</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono py-3 border-y border-slate-800/80 my-2">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Manufacturer:</span>
                    <span className="font-bold text-slate-200">{ecu.manufacturer}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Firmware Build:</span>
                    <span className="font-bold text-purple-300">{ecu.firmware}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Multiplex Protocol:</span>
                    <span className="font-bold truncate max-w-[190px]">{ecu.protocol || 'ISO 15765-4 CAN 500kbaud'}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">CAN Bus Speed:</span>
                    <span className="font-bold text-emerald-400">{ecu.bus_speed || '500 kbps'}</span>
                  </div>
                </div>
              </div>

              {/* Handshake Connect Toggle Button */}
              <div className="pt-4 mt-2">
                {isConnected ? (
                  <button
                    onClick={onDisconnectEcu}
                    className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/40 font-mono font-bold text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <WifiOff className="w-4 h-4" />
                    <span>DISCONNECT FROM {ecu.ecu_id}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnectClick(ecu)}
                    disabled={isConnThis || scanner.scanner_status === 'Connected'}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-purple-300 border border-purple-500/40 font-mono font-bold text-xs tracking-wider transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {isConnThis ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                        <span>ESTABLISHING PING HANDSHAKE...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span>CONNECT SCANNER TO {ecu.ecu_id}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add New ECU Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold font-display text-white">Register Electronic Control Unit</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">ECU Module Identifier</label>
                <input
                  type="text"
                  required
                  value={newId}
                  onChange={(e) => setNewId(e.target.value.toUpperCase())}
                  placeholder="e.g. ECU-MED17, ECU-ABS4, ECU-BCM2"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-purple-300 font-bold focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Manufacturer Name</label>
                <input
                  type="text"
                  required
                  value={newManuf}
                  onChange={(e) => setNewManuf(e.target.value)}
                  placeholder="e.g. Bosch GmbH, Continental, Denso"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-display text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Firmware Revision String</label>
                <input
                  type="text"
                  required
                  value={newFirm}
                  onChange={(e) => setNewFirm(e.target.value)}
                  placeholder="e.g. v17.7.5.92-R"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">CAN-Bus Protocol Architecture</label>
                <input
                  type="text"
                  value={newProto}
                  onChange={(e) => setNewProto(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-400"
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
                  className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-slate-950 rounded-xl text-xs font-display font-black uppercase tracking-widest shadow-lg shadow-purple-500/20"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Plus, Wifi, WifiOff, Search, Loader2 } from 'lucide-react';
import { useStore, ECU } from '../store';
import Modal from '../components/Modal';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function ECUManager() {
  const { ecus, addEcu, connectEcu, disconnectEcu, connectedEcuId, scannerStatus } = useStore();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [form, setForm] = useState({ ecuId: '', manufacturer: '', firmware: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = ecus.filter(e =>
    e.ecuId.toLowerCase().includes(search.toLowerCase()) ||
    e.manufacturer.toLowerCase().includes(search.toLowerCase())
  );

  const handleConnect = async (ecuId: string) => {
    if (connectedEcuId === ecuId) {
      setConnecting(ecuId);
      await new Promise(r => setTimeout(r, 1500));
      disconnectEcu();
      setConnecting(null);
    } else {
      if (connectedEcuId) {
        disconnectEcu();
        await new Promise(r => setTimeout(r, 500));
      }
      setConnecting(ecuId);
      await new Promise(r => setTimeout(r, 2000));
      connectEcu(ecuId);
      setConnecting(null);
    }
  };

  const handleAdd = () => {
    const errs: Record<string, string> = {};
    if (!form.ecuId.trim()) errs.ecuId = 'Required';
    else if (ecus.some(e => e.ecuId === form.ecuId)) errs.ecuId = 'ID exists';
    if (!form.manufacturer.trim()) errs.manufacturer = 'Required';
    if (!form.firmware.trim()) errs.firmware = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    addEcu({ ...form, connectionStatus: 'Disconnected' } as ECU);
    setShowAdd(false);
    setForm({ ecuId: '', manufacturer: '', firmware: '' });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">ECU Manager</h1>
          <p className="text-text-secondary text-sm mt-1">
            Connect and manage Electronic Control Units
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
            scannerStatus === 'Connected' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-bg-card border-border text-text-muted'
          }`}>
            {scannerStatus === 'Connected' ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            Scanner {scannerStatus}
          </div>
          <button
            onClick={() => { setShowAdd(true); setErrors({}); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" /> Add ECU
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search ECU by ID or manufacturer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
        />
      </motion.div>

      {/* ECU Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((ecu) => {
          const isConnected = connectedEcuId === ecu.ecuId;
          const isConnecting = connecting === ecu.ecuId;
          
          return (
            <motion.div
              key={ecu.ecuId}
              layout
              whileHover={{ y: -2 }}
              className={`card-gradient border rounded-xl overflow-hidden transition-all duration-300 ${
                isConnected ? 'border-green-500/40 shadow-lg shadow-green-500/5' : 'border-border hover:border-border-light'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      isConnected ? 'bg-green-500/15' : 'bg-accent/10'
                    }`}>
                      <Cpu className={`w-5 h-5 ${isConnected ? 'text-green-400' : 'text-accent'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary text-sm">{ecu.ecuId}</h3>
                      <p className="text-xs text-text-muted">{ecu.manufacturer}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold ${
                    isConnected 
                      ? 'bg-green-500/15 text-green-400' 
                      : 'bg-gray-500/15 text-gray-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                    {isConnected ? 'Connected' : 'Offline'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Firmware</span>
                    <span className="text-accent font-mono">{ecu.firmware}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Protocol</span>
                    <span className="text-text-secondary">CAN Bus 500kbps</span>
                  </div>
                </div>

                <button
                  onClick={() => handleConnect(ecu.ecuId)}
                  disabled={isConnecting}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isConnecting
                      ? 'bg-bg-card border border-border text-text-muted cursor-wait'
                      : isConnected
                        ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                        : 'bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isConnected ? 'Disconnecting...' : 'Connecting...'}
                    </>
                  ) : isConnected ? (
                    <>
                      <WifiOff className="w-4 h-4" /> Disconnect
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4" /> Connect
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div variants={item} className="text-center py-16">
          <Cpu className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-40" />
          <p className="text-text-muted text-sm">{search ? 'No ECUs match your search' : 'No ECUs registered yet'}</p>
        </motion.div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New ECU">
        <div className="space-y-4">
          {[
            { key: 'ecuId', label: 'ECU ID', placeholder: 'e.g. ECU-004' },
            { key: 'manufacturer', label: 'Manufacturer', placeholder: 'e.g. Bosch' },
            { key: 'firmware', label: 'Firmware Version', placeholder: 'e.g. v4.2.1' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>
              <input
                type="text"
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
              />
              {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 px-4 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors"
            >
              Add ECU
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

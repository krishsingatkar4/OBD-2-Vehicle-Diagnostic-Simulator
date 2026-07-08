import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Plus, Search, Trash2, CheckCircle, Edit2 } from 'lucide-react';
import { useStore, FaultCode } from '../store';
import Modal from '../components/Modal';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const severityColors: Record<string, { bg: string; text: string; dot: string }> = {
  Critical: { bg: 'bg-red-500/12', text: 'text-red-400', dot: 'bg-red-500' },
  High: { bg: 'bg-orange-500/12', text: 'text-orange-400', dot: 'bg-orange-500' },
  Medium: { bg: 'bg-amber-500/12', text: 'text-amber-400', dot: 'bg-amber-500' },
  Low: { bg: 'bg-blue-500/12', text: 'text-blue-400', dot: 'bg-blue-500' },
};

export default function FaultCodes() {
  const { faultCodes, addFaultCode, clearFaultCode, deleteFaultCode, updateFaultCode } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Cleared'>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editFault, setEditFault] = useState<FaultCode | null>(null);
  const [form, setForm] = useState({ code: '', description: '', severity: 'Medium' as FaultCode['severity'], status: 'Active' as FaultCode['status'] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = faultCodes.filter(f => {
    const matchSearch = f.code.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || f.status === filterStatus;
    const matchSeverity = filterSeverity === 'all' || f.severity === filterSeverity;
    return matchSearch && matchStatus && matchSeverity;
  });

  const activeFaults = faultCodes.filter(f => f.status === 'Active').length;
  const clearedFaults = faultCodes.filter(f => f.status === 'Cleared').length;

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!form.code.trim()) errs.code = 'Required';
    else if (!editFault && faultCodes.some(f => f.code === form.code)) errs.code = 'Code exists';
    if (!form.description.trim()) errs.description = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (editFault) {
      updateFaultCode(editFault.code, form);
    } else {
      addFaultCode(form);
    }
    setShowAdd(false);
    setEditFault(null);
    setForm({ code: '', description: '', severity: 'Medium', status: 'Active' });
  };

  const openEdit = (f: FaultCode) => {
    setForm({ ...f });
    setEditFault(f);
    setShowAdd(true);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Fault Codes</h1>
          <p className="text-text-secondary text-sm mt-1">OBD-II Diagnostic Trouble Codes</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditFault(null); setForm({ code: '', description: '', severity: 'Medium', status: 'Active' }); setErrors({}); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-accent/20"
        >
          <Plus className="w-4 h-4" /> Add Fault Code
        </button>
      </motion.div>

      {/* Status summary */}
      <motion.div variants={item} className="flex gap-3 flex-wrap">
        <div className="px-4 py-2 bg-bg-card border border-border rounded-lg text-xs">
          <span className="text-text-muted">Total:</span>{' '}
          <span className="text-text-primary font-semibold">{faultCodes.length}</span>
        </div>
        <div className="px-4 py-2 bg-red-500/5 border border-red-500/20 rounded-lg text-xs">
          <span className="text-red-400/70">Active:</span>{' '}
          <span className="text-red-400 font-semibold">{activeFaults}</span>
        </div>
        <div className="px-4 py-2 bg-green-500/5 border border-green-500/20 rounded-lg text-xs">
          <span className="text-green-400/70">Cleared:</span>{' '}
          <span className="text-green-400 font-semibold">{clearedFaults}</span>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search fault codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Cleared">Cleared</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={item} className="card-gradient border border-border rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-bg-input border-b border-border text-xs font-medium text-text-muted uppercase tracking-wider">
          <div className="col-span-2">Code</div>
          <div className="col-span-5">Description</div>
          <div className="col-span-2">Severity</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border/50">
          <AnimatePresence mode="popLayout">
            {filtered.map((fault) => {
              const sev = severityColors[fault.severity] || severityColors.Low;
              return (
                <motion.div
                  key={fault.code}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-3.5 hover:bg-bg-card-hover/30 transition-colors group items-center"
                >
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${sev.dot} ${fault.status === 'Active' && fault.severity === 'Critical' ? 'animate-pulse' : ''}`} />
                    <span className="font-mono font-bold text-sm text-accent">{fault.code}</span>
                  </div>
                  <div className="sm:col-span-5">
                    <span className="text-sm text-text-secondary">{fault.description}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${sev.bg} ${sev.text}`}>
                      {fault.severity}
                    </span>
                  </div>
                  <div className="sm:col-span-1">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      fault.status === 'Active' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${fault.status === 'Active' ? 'bg-red-400' : 'bg-green-400'}`} />
                      {fault.status}
                    </span>
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(fault)}
                      className="p-1.5 rounded-lg hover:bg-bg-card text-text-muted hover:text-accent transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {fault.status === 'Active' && (
                      <button
                        onClick={() => clearFaultCode(fault.code)}
                        className="p-1.5 rounded-lg hover:bg-bg-card text-text-muted hover:text-green-400 transition-colors"
                        title="Clear"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteFaultCode(fault.code)}
                      className="p-1.5 rounded-lg hover:bg-bg-card text-text-muted hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
            <p className="text-text-muted text-sm">No fault codes found</p>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setEditFault(null); }} title={editFault ? 'Edit Fault Code' : 'Add Fault Code'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Fault Code</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g. P0300"
              disabled={!!editFault}
              className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent font-mono disabled:opacity-50 transition-colors"
            />
            {errors.code && <p className="text-xs text-red-400 mt-1">{errors.code}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the fault code..."
              rows={3}
              className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Severity</label>
            <div className="flex flex-wrap gap-2">
              {(['Low', 'Medium', 'High', 'Critical'] as const).map(s => {
                const color = severityColors[s];
                return (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, severity: s })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      form.severity === s
                        ? `${color.bg} border-current ${color.text}`
                        : 'bg-bg-input border-border text-text-secondary hover:border-border-light'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Status</label>
            <div className="flex gap-2">
              {(['Active', 'Cleared'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, status: s })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    form.status === s
                      ? s === 'Active' ? 'bg-red-500/12 border-red-500/30 text-red-400' : 'bg-green-500/12 border-green-500/30 text-green-400'
                      : 'bg-bg-input border-border text-text-secondary hover:border-border-light'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setShowAdd(false); setEditFault(null); }}
              className="flex-1 px-4 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors"
            >
              {editFault ? 'Save Changes' : 'Add Fault Code'}
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Plus, Search, Edit2, Trash2, Fuel, Calendar, Hash, User } from 'lucide-react';
import { useStore, Vehicle } from '../store';
import Modal from '../components/Modal';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];

const initialForm = {
  vehicleId: '', ownerName: '', company: '', model: '', year: 2024, fuelType: 'Petrol', vin: '',
};

export default function Vehicles() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useStore();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = vehicles.filter(v =>
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.company.toLowerCase().includes(search.toLowerCase()) ||
    v.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    v.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
    v.vin.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.vehicleId.trim()) errs.vehicleId = 'Required';
    else if (!editVehicle && vehicles.some(v => v.vehicleId === form.vehicleId)) errs.vehicleId = 'ID exists';
    if (!form.ownerName.trim()) errs.ownerName = 'Required';
    if (!form.company.trim()) errs.company = 'Required';
    if (!form.model.trim()) errs.model = 'Required';
    if (form.year < 1886 || form.year > 2026) errs.year = 'Invalid year';
    if (!form.vin.trim()) errs.vin = 'Required';
    else if (!editVehicle && vehicles.some(v => v.vin === form.vin)) errs.vin = 'VIN exists';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editVehicle) {
      updateVehicle(editVehicle.vehicleId, form);
    } else {
      addVehicle(form as Vehicle);
    }
    setShowAdd(false);
    setEditVehicle(null);
    setForm(initialForm);
  };

  const openEdit = (v: Vehicle) => {
    setForm({ ...v });
    setEditVehicle(v);
    setShowAdd(true);
  };

  const openAdd = () => {
    setForm(initialForm);
    setEditVehicle(null);
    setErrors({});
    setShowAdd(true);
  };

  const fuelIcon = (fuel: string) => {
    switch (fuel.toLowerCase()) {
      case 'electric': return '⚡';
      case 'hybrid': return '🔋';
      case 'cng': return '💨';
      default: return '⛽';
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Vehicles</h1>
          <p className="text-text-secondary text-sm mt-1">Manage registered vehicles</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-accent/20"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search by model, company, owner, VIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
        />
      </motion.div>

      {/* Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((v) => (
          <motion.div
            key={v.vehicleId}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            className="card-gradient border border-border rounded-xl overflow-hidden hover:border-border-light transition-all duration-300 group"
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Car className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary text-sm">{v.company} {v.model}</h3>
                    <p className="text-xs text-text-muted font-mono">{v.vehicleId}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(v)} className="p-1.5 rounded-lg hover:bg-bg-card text-text-muted hover:text-accent transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteVehicle(v.vehicleId)} className="p-1.5 rounded-lg hover:bg-bg-card text-text-muted hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="px-5 pb-5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-text-secondary">{v.ownerName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-text-secondary">{v.year}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Fuel className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-text-secondary">{fuelIcon(v.fuelType)} {v.fuelType}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Hash className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-text-secondary font-mono text-[11px]">{v.vin}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div variants={item} className="text-center py-16">
          <Car className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-40" />
          <p className="text-text-muted text-sm">{search ? 'No vehicles match your search' : 'No vehicles registered yet'}</p>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setEditVehicle(null); }} title={editVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}>
        <div className="space-y-4">
          {[
            { key: 'vehicleId', label: 'Vehicle ID', placeholder: 'e.g. V005', disabled: !!editVehicle },
            { key: 'ownerName', label: 'Owner Name', placeholder: 'Enter owner name' },
            { key: 'company', label: 'Company', placeholder: 'e.g. Toyota' },
            { key: 'model', label: 'Model', placeholder: 'e.g. Camry' },
          ].map(({ key, label, placeholder, disabled }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>
              <input
                type="text"
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent disabled:opacity-50 transition-colors"
              />
              {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Year</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 0 })}
              min={1886}
              max={2026}
              className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
            />
            {errors.year && <p className="text-xs text-red-400 mt-1">{errors.year}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Fuel Type</label>
            <div className="flex flex-wrap gap-2">
              {fuelTypes.map(ft => (
                <button
                  key={ft}
                  onClick={() => setForm({ ...form, fuelType: ft })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    form.fuelType === ft
                      ? 'bg-accent/15 border-accent text-accent'
                      : 'bg-bg-input border-border text-text-secondary hover:border-border-light'
                  }`}
                >
                  {ft}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">VIN</label>
            <input
              type="text"
              value={form.vin}
              onChange={(e) => setForm({ ...form, vin: e.target.value })}
              placeholder="Enter VIN number"
              className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
            />
            {errors.vin && <p className="text-xs text-red-400 mt-1">{errors.vin}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setShowAdd(false); setEditVehicle(null); }}
              className="flex-1 px-4 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors"
            >
              {editVehicle ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

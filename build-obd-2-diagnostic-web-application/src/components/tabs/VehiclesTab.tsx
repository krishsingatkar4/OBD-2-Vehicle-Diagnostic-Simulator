import React, { useState } from 'react';
import { Car, Search, Plus, Edit3, Check, KeyRound, Fuel, Calendar, User, Trash2 } from 'lucide-react';
import { Vehicle, FuelType } from '../../types';

interface VehiclesTabProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  activeVehicle: Vehicle | null;
  setActiveVehicle: (v: Vehicle) => void;
  onLogEvent: (type: 'info' | 'warn' | 'error' | 'success', text: string, source: 'VEHICLE') => void;
}

export const VehiclesTab: React.FC<VehiclesTabProps> = ({
  vehicles,
  setVehicles,
  activeVehicle,
  setActiveVehicle,
  onLogEvent
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Add Wizard State
  const [newId, setNewId] = useState<string>(`VEH-${String(vehicles.length + 1).padStart(3, '0')}`);
  const [newOwner, setNewOwner] = useState<string>('');
  const [newCompany, setNewCompany] = useState<string>('');
  const [newModel, setNewModel] = useState<string>('');
  const [newYear, setNewYear] = useState<number>(2025);
  const [newFuel, setNewFuel] = useState<FuelType>('Petrol');
  const [newVin, setNewVin] = useState<string>('1FTFW1ED1NFB' + Math.floor(10000 + Math.random() * 90000));

  const validateYear = (yr: number) => yr >= 1886 && yr <= 2026;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations perfectly matching the Python script
    if (!validateYear(newYear)) {
      alert('Invalid vehicle manufacturing year! Please enter a year between 1886 and 2026.');
      return;
    }
    if (!newOwner.trim()) {
      alert('Owner name cannot be empty.');
      return;
    }
    if (vehicles.some(v => v.vehicle_id.toLowerCase() === newId.trim().toLowerCase())) {
      alert(`Vehicle ID ${newId} already exists in diagnostics system!`);
      return;
    }
    if (vehicles.some(v => v.vin.toLowerCase() === newVin.trim().toLowerCase())) {
      alert(`VIN ${newVin} already registered to another specimen!`);
      return;
    }

    const colors = [
      'from-amber-500 to-red-600',
      'from-blue-500 to-indigo-600',
      'from-cyan-500 to-blue-700',
      'from-emerald-500 to-teal-700',
      'from-purple-500 to-pink-600',
      'from-rose-500 to-red-700'
    ];

    const newV: Vehicle = {
      vehicle_id: newId.trim().toUpperCase(),
      owner_name: newOwner.trim(),
      company: newCompany.trim(),
      model: newModel.trim(),
      year: newYear,
      fuel_type: newFuel,
      vin: newVin.trim().toUpperCase(),
      avatar_color: colors[Math.floor(Math.random() * colors.length)]
    };

    setVehicles((prev) => [newV, ...prev]);
    setActiveVehicle(newV);
    onLogEvent('success', `Vehicle specimen ${newV.company} ${newV.model} (${newV.vehicle_id}) added and set as Active.`, 'VEHICLE');
    setIsAddModalOpen(false);
    
    // Reset Form
    setNewId(`VEH-${String(vehicles.length + 2).padStart(3, '0')}`);
    setNewOwner('');
    setNewCompany('');
    setNewModel('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    if (!validateYear(editingVehicle.year)) {
      alert('Invalid year! Must be between 1886 and 2026.');
      return;
    }

    setVehicles((prev) => prev.map(v => v.vehicle_id === editingVehicle.vehicle_id ? editingVehicle : v));
    if (activeVehicle?.vehicle_id === editingVehicle.vehicle_id) {
      setActiveVehicle(editingVehicle);
    }
    onLogEvent('success', `Vehicle ${editingVehicle.vehicle_id} configuration successfully updated.`, 'VEHICLE');
    setEditingVehicle(null);
  };

  const handleDeleteVehicle = (vehId: string, companyName: string, modelName: string) => {
    if (vehicles.length <= 1) {
      alert('Cannot delete the last remaining vehicle specimen from the garage!');
      return;
    }
    if (confirm(`Are you certain you wish to purge ${companyName} ${modelName} (${vehId}) from the diagnostic garage?`)) {
      setVehicles((prev) => prev.filter(v => v.vehicle_id !== vehId));
      if (activeVehicle?.vehicle_id === vehId) {
        const remaining = vehicles.filter(v => v.vehicle_id !== vehId);
        setActiveVehicle(remaining[0]);
      }
      onLogEvent('success', `Vehicle specimen ${vehId} completely purged from Garage.`, 'VEHICLE');
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const q = searchTerm.toLowerCase();
    return v.model.toLowerCase().includes(q) || 
           v.company.toLowerCase().includes(q) || 
           v.owner_name.toLowerCase().includes(q) || 
           v.vin.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Top Banner & Control Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Car className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-wide">
                Automotive Fleet Garage
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {vehicles.length} Specimen
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Select an active specimen for dynamic OBD-II PID / DTC emulation
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-black font-display uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-cyan-500/20 cursor-pointer self-stretch md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
          <span>Register New Specimen</span>
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
            placeholder="Search by Make, Model, Owner name, or VIN..."
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
      </div>

      {/* Vehicles Fleet Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((veh) => {
          const isAct = activeVehicle?.vehicle_id === veh.vehicle_id;

          return (
            <div
              key={veh.vehicle_id}
              onClick={() => setActiveVehicle(veh)}
              className={`glass-panel p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
                isAct 
                  ? 'border-cyan-500/80 shadow-2xl shadow-cyan-500/10 bg-gradient-to-br from-cyan-950/20 via-slate-900 to-slate-950' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
                {isAct && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                    <Check className="w-3 h-3 stroke-[3]" /> ACTIVE SPECIMEN
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${veh.avatar_color || 'from-slate-400 to-slate-600'} flex items-center justify-center font-display font-black text-white text-lg shadow-md`}>
                    {veh.company.slice(0, 1)}{veh.model.slice(0, 1)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">{veh.company}</span>
                    <h3 className="text-lg font-black font-display text-white tracking-tight truncate max-w-[180px]">
                      {veh.model}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono py-4 border-y border-slate-800/80 my-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5 text-cyan-400" /> VIN</span>
                    <span className="font-bold truncate max-w-[170px] selection:bg-cyan-500 selection:text-black">{veh.vin}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-purple-400" /> Owner</span>
                    <span className="font-bold truncate max-w-[170px]">{veh.owner_name}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-400" /> Year Spec</span>
                    <span className="font-bold">{veh.year} ({validateYear(veh.year) ? 'VALID' : 'LEGACY'})</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5 text-emerald-400" /> Fuel Matrix</span>
                    <span className="font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400">{veh.fuel_type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded">
                  {veh.vehicle_id}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingVehicle(veh)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono"
                    title="Update Configuration parameters"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" /> Edit
                  </button>

                  <button
                    onClick={() => handleDeleteVehicle(veh.vehicle_id, veh.company, veh.model)}
                    className="p-2 bg-slate-900 hover:bg-rose-500/20 hover:text-rose-300 text-slate-500 rounded-xl transition-colors cursor-pointer"
                    title="Purge Specimen from Garage"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal #1: Add Wizard matching Python code choice #1 (`add_vehicle`) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold font-display text-white">Register New Vehicle Specimen</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Vehicle ID</label>
                  <input
                    type="text"
                    required
                    value={newId}
                    onChange={(e) => setNewId(e.target.value.toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Fuel Type</label>
                  <select
                    value={newFuel}
                    onChange={(e) => setNewFuel(e.target.value as FuelType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Owner Full Name</label>
                <input
                  type="text"
                  required
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="e.g. Lewis Hamilton"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-display text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Manufacturer Make</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. McLaren"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-display text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="e.g. 720S Spider"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-display text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Model Year</label>
                  <input
                    type="number"
                    required
                    min={1886}
                    max={2026}
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">Spec 1886-2026</span>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Vehicle VIN</label>
                  <input
                    type="text"
                    required
                    value={newVin}
                    onChange={(e) => setNewVin(e.target.value.toUpperCase())}
                    placeholder="17-character VIN string"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
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
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal #2: Edit Modal matching Python code `update_vehicle` */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold font-display text-white">Modify Specimen: {editingVehicle.vehicle_id}</h3>
              </div>
              <button 
                onClick={() => setEditingVehicle(null)}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">1. Update Owner Name</label>
                <input
                  type="text"
                  required
                  value={editingVehicle.owner_name}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, owner_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-display text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">2. Update Company Make</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.company}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, company: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-display text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">3. Update Model</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.model}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-display text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">4. Update Fuel Type</label>
                  <select
                    value={editingVehicle.fuel_type}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, fuel_type: e.target.value as FuelType })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">Model Year</label>
                  <input
                    type="number"
                    required
                    min={1886}
                    max={2026}
                    value={editingVehicle.year}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, year: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block mb-1">5. Update 17-char VIN</label>
                <input
                  type="text"
                  required
                  value={editingVehicle.vin}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, vin: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-xl text-xs font-display font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

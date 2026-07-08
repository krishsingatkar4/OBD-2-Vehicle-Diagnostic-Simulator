import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Vehicle {
  vehicleId: string;
  ownerName: string;
  company: string;
  model: string;
  year: number;
  fuelType: string;
  vin: string;
}

export interface ECU {
  ecuId: string;
  manufacturer: string;
  firmware: string;
  connectionStatus: 'Connected' | 'Disconnected';
}

export interface FaultCode {
  code: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Cleared';
}

export interface LiveData {
  rpm: number;
  coolantTemp: number;
  batteryVoltage: number;
  fuelLevel: number;
  throttlePosition: number;
  vehicleSpeed: number;
  engineLoad: number;
  timestamp: string;
}

export interface DiagnosticReport {
  id: string;
  vehicle: Vehicle;
  ecu: ECU;
  faultList: FaultCode[];
  liveData: LiveData;
  dateTime: string;
}

interface AppState {
  vehicles: Vehicle[];
  ecus: ECU[];
  faultCodes: FaultCode[];
  reports: DiagnosticReport[];
  liveData: LiveData | null;
  connectedEcuId: string | null;
  scannerStatus: 'Connected' | 'Disconnected';
  
  // Vehicle actions
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicleId: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (vehicleId: string) => void;
  
  // ECU actions
  addEcu: (ecu: ECU) => void;
  connectEcu: (ecuId: string) => void;
  disconnectEcu: () => void;
  
  // Fault code actions
  addFaultCode: (fault: FaultCode) => void;
  updateFaultCode: (code: string, updates: Partial<FaultCode>) => void;
  clearFaultCode: (code: string) => void;
  deleteFaultCode: (code: string) => void;
  
  // Live data actions
  generateLiveData: () => void;
  
  // Report actions
  generateReport: (vehicleId: string) => void;
  deleteReport: (id: string) => void;
}

const generateRandomLiveData = (): LiveData => ({
  rpm: Math.floor(Math.random() * 2700) + 800,
  coolantTemp: Math.floor(Math.random() * 30) + 75,
  batteryVoltage: parseFloat((Math.random() * 2.8 + 12.0).toFixed(1)),
  fuelLevel: Math.floor(Math.random() * 100),
  throttlePosition: Math.floor(Math.random() * 100),
  vehicleSpeed: Math.floor(Math.random() * 200),
  engineLoad: Math.floor(Math.random() * 100),
  timestamp: new Date().toLocaleTimeString(),
});

// Default demo data
const defaultVehicles: Vehicle[] = [
  { vehicleId: 'V001', ownerName: 'John Doe', company: 'Toyota', model: 'Camry', year: 2023, fuelType: 'Petrol', vin: '1HGBH41JXMN109186' },
  { vehicleId: 'V002', ownerName: 'Jane Smith', company: 'Honda', model: 'Civic', year: 2022, fuelType: 'Hybrid', vin: '2HGFC2F59MH522345' },
  { vehicleId: 'V003', ownerName: 'Mike Johnson', company: 'Tesla', model: 'Model 3', year: 2024, fuelType: 'Electric', vin: '5YJ3E1EA1PF123456' },
  { vehicleId: 'V004', ownerName: 'Sarah Wilson', company: 'BMW', model: 'X5', year: 2023, fuelType: 'Diesel', vin: 'WBAJB0C51JB084201' },
];

const defaultEcus: ECU[] = [
  { ecuId: 'ECU-001', manufacturer: 'Bosch', firmware: 'v4.2.1', connectionStatus: 'Disconnected' },
  { ecuId: 'ECU-002', manufacturer: 'Continental', firmware: 'v3.8.5', connectionStatus: 'Disconnected' },
  { ecuId: 'ECU-003', manufacturer: 'Denso', firmware: 'v5.1.0', connectionStatus: 'Disconnected' },
];

const defaultFaultCodes: FaultCode[] = [
  { code: 'P0300', description: 'Random/Multiple Cylinder Misfire Detected', severity: 'High', status: 'Active' },
  { code: 'P0171', description: 'System Too Lean (Bank 1)', severity: 'Medium', status: 'Active' },
  { code: 'P0420', description: 'Catalyst System Efficiency Below Threshold', severity: 'Low', status: 'Cleared' },
  { code: 'P0442', description: 'Evaporative Emission System Leak Detected (small leak)', severity: 'Medium', status: 'Active' },
  { code: 'P0128', description: 'Coolant Thermostat Below Regulating Temperature', severity: 'Critical', status: 'Active' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      vehicles: defaultVehicles,
      ecus: defaultEcus,
      faultCodes: defaultFaultCodes,
      reports: [],
      liveData: null,
      connectedEcuId: null,
      scannerStatus: 'Disconnected',

      addVehicle: (vehicle) => set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
      
      updateVehicle: (vehicleId, updates) => set((state) => ({
        vehicles: state.vehicles.map((v) => v.vehicleId === vehicleId ? { ...v, ...updates } : v),
      })),
      
      deleteVehicle: (vehicleId) => set((state) => ({
        vehicles: state.vehicles.filter((v) => v.vehicleId !== vehicleId),
      })),

      addEcu: (ecu) => set((state) => ({ ecus: [...state.ecus, ecu] })),
      
      connectEcu: (ecuId) => set((state) => ({
        ecus: state.ecus.map((e) => ({
          ...e,
          connectionStatus: e.ecuId === ecuId ? 'Connected' : e.connectionStatus,
        })),
        connectedEcuId: ecuId,
        scannerStatus: 'Connected',
      })),
      
      disconnectEcu: () => set((state) => ({
        ecus: state.ecus.map((e) => ({
          ...e,
          connectionStatus: e.ecuId === state.connectedEcuId ? 'Disconnected' : e.connectionStatus,
        })),
        connectedEcuId: null,
        scannerStatus: 'Disconnected',
        liveData: null,
      })),

      addFaultCode: (fault) => set((state) => ({ faultCodes: [...state.faultCodes, fault] })),
      
      updateFaultCode: (code, updates) => set((state) => ({
        faultCodes: state.faultCodes.map((f) => f.code === code ? { ...f, ...updates } : f),
      })),
      
      clearFaultCode: (code) => set((state) => ({
        faultCodes: state.faultCodes.map((f) => f.code === code ? { ...f, status: 'Cleared' as const } : f),
      })),
      
      deleteFaultCode: (code) => set((state) => ({
        faultCodes: state.faultCodes.filter((f) => f.code !== code),
      })),

      generateLiveData: () => set({ liveData: generateRandomLiveData() }),

      generateReport: (vehicleId) => {
        const state = get();
        const vehicle = state.vehicles.find((v) => v.vehicleId === vehicleId);
        const ecu = state.ecus.find((e) => e.ecuId === state.connectedEcuId);
        if (!vehicle || !ecu) return;
        
        const liveData = generateRandomLiveData();
        const report: DiagnosticReport = {
          id: `RPT-${Date.now()}`,
          vehicle,
          ecu,
          faultList: state.faultCodes.filter((f) => f.status === 'Active'),
          liveData,
          dateTime: new Date().toLocaleString(),
        };
        set((state) => ({ reports: [report, ...state.reports], liveData }));
      },

      deleteReport: (id) => set((state) => ({
        reports: state.reports.filter((r) => r.id !== id),
      })),
    }),
    { name: 'obd2-simulator-storage' }
  )
);

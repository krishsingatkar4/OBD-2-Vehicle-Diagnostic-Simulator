export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';

export type ECUConnectionStatus = 'Connected' | 'Disconnected';

export type FaultSeverity = 'Critical' | 'Warning' | 'Low' | 'Info';
export type FaultStatus = 'active' | 'cleared';

export interface Vehicle {
  vehicle_id: string;
  owner_name: string;
  company: string;
  model: string;
  year: number;
  fuel_type: FuelType;
  vin: string;
  avatar_color?: string;
}

export interface ECU {
  ecu_id: string;
  manufacturer: string;
  firmware: string;
  connection_status: ECUConnectionStatus;
  protocol?: string;
  bus_speed?: string;
}

export interface FaultCode {
  code: string;
  description: string;
  severity: FaultSeverity;
  status: FaultStatus;
  category?: string;
  recommended_action?: string;
}

export interface LiveSensorData {
  RPM: number;
  'Coolant Temp': number;
  'Battery Voltage': number;
  'Fuel Level': number;
  'Throttle Position': number;
  'Vehicle Speed': number;
  'Engine Load': number;
  Boost_Pressure?: number;
  Oil_Temp?: number;
}

export interface DiagnosticScanner {
  scanner_id: string;
  scanner_name: string;
  scanner_status: ECUConnectionStatus;
  connected_ecu: ECU | null;
  live_data?: LiveSensorData;
}

export interface DiagnosticReport {
  report_id: string;
  vehicle: Vehicle;
  ecu: ECU | null;
  scanner: DiagnosticScanner;
  fault_list: FaultCode[];
  live_data: LiveSensorData;
  date_time: string;
  diagnostic_summary: string;
}

export interface ConsoleMessage {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'can';
  text: string;
  source: 'SYSTEM' | 'SCANNER' | 'ECU' | 'VEHICLE' | 'DTC';
}

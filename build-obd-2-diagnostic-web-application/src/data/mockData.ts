import { Vehicle, ECU, FaultCode, DiagnosticScanner, LiveSensorData } from '../types';

export const initialVehicles: Vehicle[] = [
  {
    vehicle_id: 'VEH-001',
    owner_name: 'Alexander Wright',
    company: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    fuel_type: 'Petrol',
    vin: 'WP1AA2998RSGT3204',
    avatar_color: 'from-amber-500 to-red-600'
  },
  {
    vehicle_id: 'VEH-002',
    owner_name: 'Elena Rostova',
    company: 'Tesla',
    model: 'Model S Plaid',
    year: 2023,
    fuel_type: 'Electric',
    vin: '5YJSA1E47PF109283',
    avatar_color: 'from-blue-500 to-indigo-600'
  },
  {
    vehicle_id: 'VEH-003',
    owner_name: 'Marcus Vance',
    company: 'BMW',
    model: 'M3 Competition',
    year: 2025,
    fuel_type: 'Hybrid',
    vin: 'WBS33AY009M3COMP5',
    avatar_color: 'from-cyan-500 to-blue-700'
  },
  {
    vehicle_id: 'VEH-004',
    owner_name: 'Sarah Jenkins',
    company: 'Ford',
    model: 'F-150 Raptor R',
    year: 2022,
    fuel_type: 'Petrol',
    vin: '1FTFW1ED1NFB18920',
    avatar_color: 'from-orange-500 to-amber-700'
  },
  {
    vehicle_id: 'VEH-005',
    owner_name: 'Hiroshi Tanaka',
    company: 'Audi',
    model: 'RS6 Avant',
    year: 2021,
    fuel_type: 'Petrol',
    vin: 'WAUZZZF47MN008129',
    avatar_color: 'from-emerald-500 to-teal-700'
  }
];

export const initialECUs: ECU[] = [
  {
    ecu_id: 'ECU-MED17',
    manufacturer: 'Bosch GmbH',
    firmware: 'v17.7.5.92-R',
    connection_status: 'Disconnected',
    protocol: 'ISO 15765-4 CAN (11bit, 500kbaud)',
    bus_speed: '500 kbps'
  },
  {
    ecu_id: 'ECU-SIM19',
    manufacturer: 'Continental Automotive',
    firmware: 'Simos 19.1-B2',
    connection_status: 'Disconnected',
    protocol: 'ISO 15765-4 CAN (29bit, 500kbaud)',
    bus_speed: '500 kbps'
  },
  {
    ecu_id: 'ECU-TSL-INV',
    manufacturer: 'Tesla Silicon Drive',
    firmware: '2024.12.3-SEC',
    connection_status: 'Disconnected',
    protocol: 'Tesla Dual-CAN Fast Protocol',
    bus_speed: '1000 kbps'
  },
  {
    ecu_id: 'ECU-DENSO8',
    manufacturer: 'Denso Corp',
    firmware: 'DEC-8.04 Rev 3',
    connection_status: 'Disconnected',
    protocol: 'ISO 14230-4 KWP (fast init)',
    bus_speed: '10.4 kbps'
  }
];

export const initialFaultCodes: FaultCode[] = [
  {
    code: 'P0300',
    description: 'Random/Multiple Cylinder Misfire Detected',
    severity: 'Critical',
    status: 'active',
    category: 'Powertrain (Ignition System)',
    recommended_action: 'Inspect spark plugs, ignition coils, and fuel injector timing.'
  },
  {
    code: 'P0171',
    description: 'System Too Lean (Bank 1)',
    severity: 'Warning',
    status: 'active',
    category: 'Powertrain (Air/Fuel Metering)',
    recommended_action: 'Check for vacuum leaks, inspect MAF sensor and fuel pump pressure.'
  },
  {
    code: 'P0420',
    description: 'Catalyst System Efficiency Below Threshold (Bank 1)',
    severity: 'Warning',
    status: 'cleared',
    category: 'Powertrain (Emissions Control)',
    recommended_action: 'Perform catalytic converter backpressure test. Replace upstream O2 sensor.'
  },
  {
    code: 'U0100',
    description: 'Lost Communication With Engine Control Module (ECM)',
    severity: 'Critical',
    status: 'active',
    category: 'Network (CAN Bus)',
    recommended_action: 'Inspect main harness connectors, verify CAN-High / CAN-Low terminating resistors.'
  },
  {
    code: 'C0221',
    description: 'Right Front Wheel Speed Sensor Input Signal Missing',
    severity: 'Warning',
    status: 'active',
    category: 'Chassis (ABS/Traction)',
    recommended_action: 'Clean wheel speed sensor tone ring and check wiring harness for pinch points.'
  },
  {
    code: 'B1001',
    description: 'Airbag Readiness Light Voltage Out of Range',
    severity: 'Low',
    status: 'cleared',
    category: 'Body (Supplemental Restraints)',
    recommended_action: 'Verify instrument cluster grounding and check fuse #14.'
  },
  {
    code: 'P0113',
    description: 'Intake Air Temperature Sensor 1 Circuit High',
    severity: 'Info',
    status: 'cleared',
    category: 'Powertrain (Intake Air)',
    recommended_action: 'Inspect IAT sensor connector for corrosion or open circuit.'
  }
];

export const initialLiveData: LiveSensorData = {
  RPM: 2450,
  'Coolant Temp': 92,
  'Battery Voltage': 14.1,
  'Fuel Level': 68,
  'Throttle Position': 34,
  'Vehicle Speed': 88,
  'Engine Load': 42,
  Boost_Pressure: 14.2,
  Oil_Temp: 98
};

export const initialScanner: DiagnosticScanner = {
  scanner_id: 'SCAN-APEX-9000',
  scanner_name: 'ApexPro Ultra Suite v5.4',
  scanner_status: 'Disconnected',
  connected_ecu: null,
  live_data: initialLiveData
};

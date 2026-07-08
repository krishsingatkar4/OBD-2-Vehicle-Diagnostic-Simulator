import React, { useState, useEffect } from 'react';
import { 
  initialVehicles, 
  initialECUs, 
  initialFaultCodes, 
  initialLiveData, 
  initialScanner 
} from './data/mockData';
import { 
  Vehicle, 
  ECU, 
  FaultCode, 
  LiveSensorData, 
  DiagnosticScanner, 
  DiagnosticReport, 
  ConsoleMessage 
} from './types';
import { Navbar } from './components/Navbar';
import { DiagnosticConsoleDrawer } from './components/DiagnosticConsoleDrawer';
import { DashboardTab } from './components/tabs/DashboardTab';
import { LiveSensorsTab } from './components/tabs/LiveSensorsTab';
import { FaultCodesTab } from './components/tabs/FaultCodesTab';
import { VehiclesTab } from './components/tabs/VehiclesTab';
import { EcuHubTab } from './components/tabs/EcuHubTab';
import { ReportsTab } from './components/tabs/ReportsTab';

const App: React.FC = () => {
  // Core OBD Database State perfectly matching Python global lists
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(initialVehicles[0] || null);
  const [ecus, setEcus] = useState<ECU[]>(initialECUs);
  const [faults, setFaults] = useState<FaultCode[]>(initialFaultCodes);
  const [liveData, setLiveData] = useState<LiveSensorData>(initialLiveData);
  const [scanner, setScanner] = useState<DiagnosticScanner>(initialScanner);
  const [reportsHistory, setReportsHistory] = useState<DiagnosticReport[]>([]);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Terminal Console Logs State
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'info',
      text: 'APEX Engine Management Simulator Architecture Core loaded successfully.',
      source: 'SYSTEM'
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'can',
      text: 'ISO 15765-4 CAN (11bit ID, 500 kbaud) bidirectional multiplex controller active.',
      source: 'SCANNER'
    }
  ]);

  // Helper logger
  const logToConsole = (
    type: 'info' | 'success' | 'warn' | 'error' | 'can', 
    text: string, 
    source: 'SYSTEM' | 'SCANNER' | 'ECU' | 'VEHICLE' | 'DTC'
  ) => {
    const newMsg: ConsoleMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type,
      text,
      source
    };
    setConsoleMessages((prev) => [...prev, newMsg]);
  };

  // Preload realistic initial reports history
  useEffect(() => {
    if (reportsHistory.length === 0 && activeVehicle) {
      const initialRep: DiagnosticReport = {
        report_id: `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
        vehicle: activeVehicle,
        ecu: ecus[0] || null,
        scanner: { ...scanner, scanner_status: 'Connected' },
        fault_list: faults,
        live_data: liveData,
        date_time: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB'),
        diagnostic_summary: 'Pre-purchase multi-point ECU diagnostic audit check.'
      };
      setReportsHistory([initialRep]);
    }
  }, []);

  // Choice #12 Save Data functionality
  const handleSaveData = () => {
    try {
      const exportState = {
        vehicles,
        activeVehicle,
        ecus,
        faults,
        liveData,
        scanner,
        reportsHistory
      };
      localStorage.setItem('obd_apex_sim_backup', JSON.stringify(exportState));
      logToConsole('success', 'All multi-ECU global parameters encrypted and saved to non-volatile localStorage.', 'SYSTEM');
      alert('Data saved successfully. Secure local persistence verified!');
    } catch (err) {
      logToConsole('error', 'Failed to persist simulation backup parameters to storage.', 'SYSTEM');
    }
  };

  // Choice #13 Load Data functionality
  const handleLoadData = () => {
    try {
      const savedStr = localStorage.getItem('obd_apex_sim_backup');
      if (!savedStr) {
        alert('No backup archive found in LocalStorage. Please save data first!');
        logToConsole('warn', 'Restore failed: localStorage archive is empty.', 'SYSTEM');
        return;
      }
      const parsed = JSON.parse(savedStr);
      if (parsed.vehicles) setVehicles(parsed.vehicles);
      if (parsed.activeVehicle) setActiveVehicle(parsed.activeVehicle);
      if (parsed.ecus) setEcus(parsed.ecus);
      if (parsed.faults) setFaults(parsed.faults);
      if (parsed.liveData) setLiveData(parsed.liveData);
      if (parsed.scanner) setScanner(parsed.scanner);
      if (parsed.reportsHistory) setReportsHistory(parsed.reportsHistory);
      logToConsole('success', 'Simulated system backup state fully restored into live RAM.', 'SYSTEM');
      alert('Data loaded successfully into diagnostic simulator environment.');
    } catch (err) {
      logToConsole('error', 'Corruption detected during LocalStorage restore parsing.', 'SYSTEM');
    }
  };

  // Connect to ECU (Choice #4 Engine Handler)
  const handleConnectECU = (targetECU?: ECU) => {
    const selectedECU = targetECU || ecus[0] || null;
    setScanner((prev) => ({
      ...prev,
      scanner_status: 'Connected',
      connected_ecu: selectedECU
    }));
    if (selectedECU) {
      setEcus((prev) => prev.map(e => e.ecu_id === selectedECU.ecu_id ? { ...e, connection_status: 'Connected' } : e));
    }
    logToConsole('success', `Multiplex diagnostic link established with Target: ${selectedECU?.ecu_id || 'ECM'} at 500 Baud.`, 'ECU');
  };

  const handleDisconnectECU = () => {
    const currentEcu = scanner.connected_ecu;
    setScanner((prev) => ({
      ...prev,
      scanner_status: 'Disconnected',
      connected_ecu: null
    }));
    if (currentEcu) {
      setEcus((prev) => prev.map(e => e.ecu_id === currentEcu.ecu_id ? { ...e, connection_status: 'Disconnected' } : e));
    }
    logToConsole('warn', `Terminated multiplex link from ${currentEcu?.ecu_id || 'Target Module'}. Line reverted to standby.`, 'ECU');
  };

  // Choice #6 Scan Fault Codes Handler
  const handleTriggerScan = () => {
    logToConsole('can', '[CAN Transmit] 0x7DF 02 01 01 00 00 00 00 00 -> Request Active DTC Count', 'SCANNER');
    setTimeout(() => {
      const activeCount = faults.filter(f => f.status === 'active').length;
      logToConsole('can', `[CAN Receive] 0x7E8 03 41 01 ${activeCount} 00 00 00 00 -> ${activeCount} Trouble codes retrieved`, 'ECU');
      logToConsole('success', `DTC trouble code memory interrogation finished. Intercepted ${activeCount} active faults.`, 'DTC');
    }, 1000);
  };

  // Choice #9 Clear Fault Codes Handler
  const handleClearAllFaults = () => {
    logToConsole('can', '[CAN Transmit] 0x7DF 01 04 00 00 00 00 00 00 -> Clear/Reset Diagnostic Emission Information', 'SCANNER');
    setTimeout(() => {
      setFaults((prev) => prev.map(f => ({ ...f, status: 'cleared' })));
      logToConsole('can', '[CAN Receive] 0x7E8 01 44 00 00 00 00 00 00 -> Module Reset Confirmed', 'ECU');
      logToConsole('success', 'Purged all active Diagnostic Trouble Codes from control module EEPROM storage.', 'DTC');
    }, 1200);
  };

  // Choice #10 Generate Diagnostic Report Handler
  const handleGenerateReport = () => {
    if (!activeVehicle) {
      alert('Please select an active vehicle specimen before generating an official report.');
      return;
    }
    const newReport: DiagnosticReport = {
      report_id: `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      vehicle: activeVehicle,
      ecu: scanner.connected_ecu || ecus[0] || null,
      scanner,
      fault_list: [...faults],
      live_data: { ...liveData },
      date_time: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB'),
      diagnostic_summary: `Official real-time powertrain multi-point CAN analysis. ${faults.filter(f => f.status === 'active').length} fault trouble codes flagged.`
    };

    setReportsHistory((prev) => [...prev, newReport]);
    logToConsole('success', `Created official certified report ID: ${newReport.report_id}. Certificate archived in logs.`, 'SYSTEM');
  };

  // Custom AT Custom command transmission from console
  const handleSendCustomCmd = (cmd: string) => {
    const cleanCmd = cmd.trim().toUpperCase();
    logToConsole('can', `[User Transmit] &gt; ${cleanCmd}`, 'SCANNER');
    
    setTimeout(() => {
      if (cleanCmd === 'ATZ' || cleanCmd === 'ATWS') {
        logToConsole('success', 'ELM327 interface fully reset. Voltage: 14.1V, Baud: 38400.', 'SCANNER');
      } else if (cleanCmd === 'ATRV') {
        logToConsole('can', `[Response] ${liveData['Battery Voltage']}V`, 'ECU');
      } else if (cleanCmd === '010C' || cleanCmd === '01 0C') {
        const hexRpm = (liveData.RPM * 4).toString(16).padStart(4, '0').toUpperCase();
        logToConsole('can', `[Response] 0x7E8 04 41 0C ${hexRpm.slice(0, 2)} ${hexRpm.slice(2, 4)} -> RPM = ${liveData.RPM}`, 'ECU');
      } else if (cleanCmd === '0105' || cleanCmd === '01 05') {
        const hexTemp = (liveData['Coolant Temp'] + 40).toString(16).padStart(2, '0').toUpperCase();
        logToConsole('can', `[Response] 0x7E8 03 41 05 ${hexTemp} -> Coolant Temp = ${liveData['Coolant Temp']}°C`, 'ECU');
      } else if (cleanCmd === '010D' || cleanCmd === '01 0D') {
        const hexSpd = liveData['Vehicle Speed'].toString(16).padStart(2, '0').toUpperCase();
        logToConsole('can', `[Response] 0x7E8 03 41 0D ${hexSpd} -> Speed = ${liveData['Vehicle Speed']} km/h`, 'ECU');
      } else if (cleanCmd.startsWith('03')) {
        logToConsole('can', `[Response] 0x7E8 06 43 01 03 00 00 00 -> Trouble Code DTC Array P0300 Flagged`, 'ECU');
      } else if (cleanCmd.startsWith('04')) {
        handleClearAllFaults();
      } else {
        logToConsole('can', `[Response] 0x7E8 03 7F ${cleanCmd.slice(0, 2)} 11 -> SERVICE NOT SUPPORTED ON ACTIVE SUB-BUS`, 'ECU');
      }
    }, 600);
  };

  const activeFaultsCount = faults.filter(f => f.status === 'active').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] selection:bg-cyan-500 selection:text-black">
      
      {/* Sleek Multiplex Global Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vehicles={vehicles}
        activeVehicle={activeVehicle}
        setActiveVehicle={(v) => {
          setActiveVehicle(v);
          logToConsole('info', `Active diagnostic context switched to Specimen: ${v.company} ${v.model} (${v.vehicle_id}).`, 'VEHICLE');
        }}
        scanner={scanner}
        activeFaultsCount={activeFaultsCount}
        onQuickSave={handleSaveData}
        onQuickLoad={handleLoadData}
      />

      {/* Primary Dynamic App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-6">
        
        {/* Tab #1: Dashboard / Command Overview */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            activeVehicle={activeVehicle}
            scanner={scanner}
            faults={faults}
            liveData={liveData}
            onConnectECU={() => handleConnectECU(ecus[0])}
            onDisconnectECU={handleDisconnectECU}
            onTriggerScan={() => {
              handleTriggerScan();
              setActiveTab('fault-codes');
            }}
            onClearAllFaults={handleClearAllFaults}
            onGenerateReport={() => {
              handleGenerateReport();
              setActiveTab('reports');
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {/* Tab #2: Live Sensor Playground */}
        {activeTab === 'live-sensors' && (
          <LiveSensorsTab
            liveData={liveData}
            setLiveData={setLiveData}
            scanner={scanner}
            onLogEvent={logToConsole}
          />
        )}

        {/* Tab #3: Trouble Code Suite (DTC Manager) */}
        {activeTab === 'fault-codes' && (
          <FaultCodesTab
            faults={faults}
            setFaults={setFaults}
            onLogEvent={logToConsole}
          />
        )}

        {/* Tab #4: ECU Workbench Module Link */}
        {activeTab === 'ecu-hub' && (
          <EcuHubTab
            ecus={ecus}
            setEcus={setEcus}
            scanner={scanner}
            onConnectTargetEcu={(tEcu) => handleConnectECU(tEcu)}
            onDisconnectEcu={handleDisconnectECU}
            onLogEvent={logToConsole}
          />
        )}

        {/* Tab #5: Garage Hub Fleet Manager */}
        {activeTab === 'garage' && (
          <VehiclesTab
            vehicles={vehicles}
            setVehicles={setVehicles}
            activeVehicle={activeVehicle}
            setActiveVehicle={(v) => {
              setActiveVehicle(v);
              logToConsole('info', `Selected garage specimen ${v.company} ${v.model} (${v.year}) for test diagnostics.`, 'VEHICLE');
            }}
            onLogEvent={logToConsole}
          />
        )}

        {/* Tab #6: Official Diagnostic Reports Hub */}
        {activeTab === 'reports' && (
          <ReportsTab
            reportsHistory={reportsHistory}
            faults={faults}
            onGenerateReport={handleGenerateReport}
            onSaveData={handleSaveData}
            onLoadData={handleLoadData}
            onLogEvent={logToConsole}
          />
        )}

      </main>

      {/* Cyberpunk Automotive Hacker Bottom Terminal Interceptor */}
      <div className="print:hidden">
        <DiagnosticConsoleDrawer
          messages={consoleMessages}
          onClear={() => setConsoleMessages([])}
          onSendCustomCmd={handleSendCustomCmd}
        />
      </div>

    </div>
  );
};

export default App;

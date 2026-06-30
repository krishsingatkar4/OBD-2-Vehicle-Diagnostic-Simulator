# OBD-2 Vehicle diagnostic simulator
vehicles = []
fault_database = []
scan_history = []

class Vehicle:
    pass

class ECU:
    pass

class FaultCode:
    pass

class DiagnosticScanner:
    pass

class Report:
    pass


while True:
    print("1. Add Vehicle.")
    print("2. Show All Vehicle.")
    print("3. Search Vehicle.")
    print("4. Connect to ECU.")
    print("5. Read Live Sensor data.")
    print("6. Scan Fault Codes.")
    print("7. Show All Fault Codes.")
    print("8. Search Fault Code.")
    print("9. Clear Fault Code.")
    print("10. Vehicle Health Report.")
    print("11. Export Diagonstic Report.")
    print("12. Save Data.")
    print("13. Load Data.")
    print("14. Exit.")

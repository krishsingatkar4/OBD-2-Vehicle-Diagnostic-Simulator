# OBD-2 Vehicle diagnostic simulator
import time
from datetime import datetime
import random
import json
from json import JSONDecodeError

vehicles = []
fault_database = []
scan_history = []
ecu_database = []
report_history = []
service_database = []

class Vehicle:
    def __init__(self,vehicle_id,owner_name,company,model,year,fuel_type,vin):
        self.vehicle_id = vehicle_id
        self.owner_name = owner_name
        self.company = company
        self.model = model
        self.year = year
        self.fuel_type = fuel_type
        self.vin = vin
         
    def display_vehicle(self):
            print(" ========== VEHICLE ========== ")
            print(f"Vehicle Id : {self.vehicle_id}")
            print(f"Owner : {self.owner_name}")
            print(f"Company : {self.company}")
            print(f"Model : {self.model}")
            print(f"Year : {self.year}")
            print(f"Fuel : {self.fuel_type}")
            print(f"VIN : {self.vin}")
            print("=============================")

    def update_vehicle(self):
        print("1. Want to update owner:- ")
        print("2. Want to update company:- ")
        print("3. Want to update model:- ")
        print("4. Want to update fuel type:- ")
        print("5. Want to update VIN:- ")
        choice = input("Enter your choice:- ")
        if choice == "1":
            owner = input("Enter the new owner:- ")
            self.owner_name = owner
            print(f"Owner name updated successfully : {self.owner_name}")
        elif choice == "2":
            company = input("Enter the new company name:- ")
            self.company = company
            print(f"Company name update successfully : {self.company}")
        elif choice == "3":
            model = input("Enter the new model name:- ")
            self.model = model
            print(f"Model name is updated successfuly : {self.model} ")
        elif choice == "4":
            fuel_type = input("Enter the new fuel type:- ")
            self.fuel_type = fuel_type
            print(f"Fuel type updated successfully : {self.fuel_type}")
        elif choice == "5":
            vin = input("Enter the new VIN:- ")
            self.vin = vin
            print(f"VIN updated successfully : {self.vin}")
        else:
            print("Invalid option selected. Please try again!")

    def to_dict(self):
        return {"Vehicle ID": self.vehicle_id,
         "Owner name": self.owner_name,
         "Company": self.company,
         "Model": self.model,
         "Year": self.year,
         "Fuel Type": self.fuel_type,
         "VIN": self.vin}

def validate_year(year):
    if year >= 1886 and year <= 2026:
        return True
    else:
        return False

def load_vehicle():
    vehicles.clear()
    try:
        with open("vehicle_information.json","r") as file:
            vehicle_data = json.load(file)
            for vehicle in vehicle_data:
                new_vehicle = Vehicle(vehicle["Vehicle ID"],
                                    vehicle["Owner name"],
                                    vehicle["Company"],
                                    vehicle["Model"],
                                    vehicle["Year"],
                                    vehicle["Fuel Type"],
                                    vehicle["VIN"])
                vehicles.append(new_vehicle)
    except FileNotFoundError:
        print("Vehicle data file not found....")
    except json.JSONDecodeError:
        print("Vehicle data file is corrupted.")

def save_vehicle():
    vehicle_data = []
    for vehicle in vehicles:
        vehicle_data.append(vehicle.to_dict())
    with open("vehicle_information.json","w") as file:
            json.dump(vehicle_data, file, indent=4)
        
def update_vehicle():
    vehicle_id = input("Enter the vehicle id of the vehicle which you want to update information:- ")
    for vehicle in vehicles:
        if vehicle.vehicle_id.lower().strip() == vehicle_id.lower().strip():
            vehicle.update_vehicle()
            break
    else:
        print("Vehicle not found!")
            
def add_vehicle():
    while True:
        vehicle_id = input("Enter the ID of the vehicle:- ")
        if is_unique_vehicle_id(vehicle_id): break
        else: print("Vehicle ID already Exists....")
    while True:
        owner_name = input("Enter the name of the owner:- ")
        if is_valid_owner_name(owner_name): break
        else: print("Enter invalid name....")
    company = input("Enter the name of the company:- ")
    model = input("Enter the model of the vehicle:- ")
    while True:
        try:
            year = int(input("Enter the year of the vehicle:- "))
            if validate_year(year): break
            else: validate_year(year), print("Invalid year....")
        except ValueError:
            print("Please enter Year in Number....")
    while True:
        fuel_type = input("Enter the fuel type of the vehicle:- ")
        if is_valid_fuel_type(fuel_type): break
        else: print("Invalid Fuel type entered....")
    while True:
        vin = (input("Enter the VIN of the vehicle:- "))
        if is_unique_vehicle_vin(vin): break
        else: print("VIN already exists....")
    new_vehicle = Vehicle(vehicle_id,owner_name,company,model,year,fuel_type,vin)
    vehicles.append(new_vehicle)
    print("Data added successfully....")

def is_valid_owner_name(owner_name):
    if owner_name.strip() == "":
        return False
    return True

def is_valid_fuel_type(fuel_type):
    if fuel_type.title() in ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"]:
        return True
    return False

def is_unique_vehicle_vin(vin):
    for vehicle in vehicles:
        if vehicle.vin == vin: 
            return False
    return True

def is_unique_vehicle_id(vehicle_id):
    for vehicle in vehicles:
        if vehicle.vehicle_id == vehicle_id:
            return False
    return True

def show_all_vehicle():
    print("DEBUG: show_all_vehicle called")
    if len(vehicles) == 0:
        print("No vehicle found in OBD Diagnostic!")
    else:
        for vehicle in vehicles:
            print(" ========== ALL VEHICLES ==========")
            vehicle.display_vehicle()
            print()

def search_vehicle():
    vehicle_model = input("Enter the model of the vehicle which you want to search:- ")
    for vehicle in vehicles:
        if vehicle.model.lower().strip() == vehicle_model.lower().strip():
            print("Vehicle found Successfully!")
            vehicle.display_vehicle()
            print()
            break
    else:
        print("Vehicle not found. Please first add your vehicle!")       

class ECU:
    def __init__(self,ecu_id,manufacturer,firmware_version,connection_status):
        self.ecu_id = ecu_id
        self.manufacturer = manufacturer
        self.firmware = firmware_version
        self.connection_status = connection_status

    def display_ecu(self):
        print("========== ECU ==========")
        print(f"ECU ID : {self.ecu_id}")
        print(f"Manufacturer : {self.manufacturer}")
        print(f"Firmware : {self.firmware}")
        print(f"Connection : {self.connection_status}")
        print("=========================")

    def connect(self):
        if self.connection_status.lower().strip() == "Connected".lower().strip():
            print("ECU is already connected....")
        else:
            print("Preparing ECU for connection!!!!")
            time.sleep(4)
            self.connection_status = "Connected"
            print("ECU connected successfully....")

    def disconnect(self):
        if self.connection_status.lower().strip() == "Disconnected".lower().strip():
            print("ECU is already disconnected!!!!")
        else:
            print("Preparing ECU for disconnecting!!!!")
            time.sleep(4)
            self.connection_status = "Disconnected"
            print("ECU disconnected successfully....")

    def to_dict(self):
        return{"ECU ID": self.ecu_id,
               "Manufacturer": self.manufacturer,
                "Firmware": self.firmware,
                "Connection Status": self.connection_status}

def load_ecu():
    try:
        ecu_database.clear()
        with open("ecu_data.json","r") as file:
            ecu_data = json.load(file)
            for ecu in ecu_data:
                new_ecu = ECU(ecu["ECU ID"],
                            ecu["Manufacturer"],
                            ecu["Firmware"],
                            ecu["Connection Status"])
                ecu_database.append(new_ecu)
    except FileNotFoundError:
        print("ECU data File not found....")
    except json.JSONDecodeError:
        print("ECU data file not found....")

def save_ecu():
    ecu_data = []
    for ecu in ecu_database:
        ecu_data.append(ecu.to_dict())
    with open("ecu_data.json","w") as file:
        json.dump(ecu_data, file, indent=4)

def add_ecu():
    ecu_id = input("Enter the ECU ID:- ")
    manufacturer = input("Enter the manufacturer name:- ")
    firmware_version = input("Enter the firmware name:- ")
    connection_status = input("Enter the connection status of ECU:- ")
    new_ecu = ECU(ecu_id,manufacturer,firmware_version,connection_status)
    ecu_database.append(new_ecu)

def search_ecu():
    ecu_id = input("Enter the ECU ID of the ECU which you want to search:- ")
    for ecu in ecu_database:
        if ecu.ecu_id.lower().strip() == ecu_id.lower().strip():
            ecu.display_ecu()
            print()
            break
    else:
        print("ECU not founded!")
        
def show_all_ecu():
    if len(ecu_database) == 0:
        print("No ECU found in OBD Diagnostic!!!!")
    else:
        for ecu in ecu_database:
            print("========== ALL ECU ==========")
            ecu.display_ecu()
            print()

class FaultCode:
    def __init__(self,code,description,severity,status):
        self.code = code
        self.description = description
        self.severity = severity
        self.status = status

    def display_fault(self):
        print("========== FAULT CODE ==========")
        print(f"Fault code : {self.code}")
        print(f"Description : {self.description}")
        print(f"Severity : {self.severity}")
        print(f"Status : {self.status}")
        print("=============================")

    def update_fault(self):
        print("1. Want to update code:- ")
        print("2. Want to update description:- ")
        print("3. Want to update severity level:- ")
        print("4. Want to update status:- ")
        choice = input("Enter your choice:- ")
        if choice == "1":
            code = input("Enter the code which you want to update:- ")
            self.code = code 
            print(f"Code is updated successfully : {self.code}")
        elif choice == "2":
            description = input("Enter the description which you want to update:- ")
            self.description = description
            print(f"Description updated successfully : {self.description}")
        elif choice == "3":
            severity = input("Enter the severity level which you want to update:- ")
            self.severity = severity
            print(f"Severity level updated successfully : {self.severity}")
        elif choice == "4":
            status = input("Enter the status which you want to update:- ")
            self.status = status
            print(f"Status updated successfully : {self.status}")
        else:
            print("Invalid option selected. Please try again!")

    def clear_fault(self):
        print("1. You want to clear fault code fully:- ")
        print("2. Want to change status from active to cleared:- ")
        choice = input("Enter your choice:- ")
        if choice == "1":
            fault_database.remove(self)
            print(f"Your fault code {self.code} is removed fully!")
        elif choice == "2":
            if self.status.lower().strip() == "active".lower().strip():
                self.status = "cleared"
                print(f"Your fault code {self.code} status changed to cleared!")
            elif self.status.lower().strip() == "cleared".lower().strip():
                print("Your fault code status is already clear!")
        else:
            print("Invalid option selected. Please try again!")

    def to_dict(self):
        return {"Fault code": self.code,
                "Description": self.description,
                "Severity": self.severity,
                "Status": self.status}

def load_fault():
    try:
        fault_database.clear()
        with open("fault_code_data.json","r") as file:
            fault_data = json.load(file)
            for fault in fault_data:
                new_fault = FaultCode(fault["Fault code"],
                                    fault["Description"],
                                    fault["Severity"],
                                    fault["Status"])
                fault_database.append(new_fault)
    except FileNotFoundError:
        print("Fault code file not found....")
    except json.JSONDecodeError:
        print("Fault code file is corrupted....")

def save_fault():
    fault_data = []
    for fault in fault_database:
        fault_data.append(fault.to_dict())
    with open("fault_code_data.json","w") as file:
        json.dump(fault_data, file, indent=4)

def clear_fault():
    code = input("Enter the fault code which you want to clear:- ")
    for fault in fault_database:
        if fault.code.lower().strip() == code.lower().strip():
            fault.clear_fault()
            break
    else:
        print("Fault code not found!")

def update_fault():
    code = input("Enter the code which you want to update:- ")
    for fault in fault_database:
        if fault.code.lower().strip() == code.lower().strip():
            fault.update_fault()
            break
    else:
        print("Fault code not found!")

def add_fault():
    code = input("Enter the fault code:- ")
    description = input("Enter the description of the fault code:- ")
    severity = input("Enter the severity level of fault code:- ")
    status = input("Enter the status of fault code:- ")
    new_fault = FaultCode(code,description,severity,status)
    fault_database.append(new_fault)

def show_all_faults():
    if len(fault_database) == 0:
        print("No fault code found!")
    else:
        for fault_code in fault_database:
            print("========== ALL FAULT CODE ==========")
            fault_code.display_fault()
            print()

def search_fault():
    fault_code = input("Enter the fault code which you want to search:- ")
    for fault in fault_database:
        if fault.code.lower().strip() == fault_code.lower().strip():
            fault.display_fault()
            print()
            break
    else:
        print("Fault code not found. Please try again later!")

class DiagnosticScanner:
    def __init__(self,scanner_id,scanner_name,scanner_status,connected_ecu):
        self.scanner_id = scanner_id
        self.scanner_name = scanner_name
        self.scanner_status = scanner_status
        self.connected_ecu = connected_ecu
    
    def connect_to_ecu(self):
        connected_ecu = input("Enter the ECU ID of which you want to connect:- ").lower().strip()
        if len(ecu_database) == 0:
            print("No ECU found for connection....")
            return
        for ecu in ecu_database:
            if ecu.ecu_id.lower().strip() == connected_ecu.lower().strip():
                print("ECU found successfully")
                if self.scanner_status == "Connected".lower().strip():
                    print("Your ECU is already connented....")
                    return
                elif self.scanner_status == "Disconnected".lower().strip():
                    print("Preparing for connecting to ECU!!!!")
                    time.sleep(2)
                    ecu.connect()
                    self.scanner_status = "Connected"
                    self.connected_ecu = ecu 
                    print(f"Scanner connected to ECU : {ecu.ecu_id}")
                    return
        else:
            print("ECU not found....")

    def disconnect_from_ecu(self):
        if len(ecu_database) == 0:
            print("No ECU found for disconnecting....")    
        if self.scanner_status == "Disconnected".lower().strip():
                    print("ECU is already Disconnected....")
                    return
        elif self.scanner_status == "Connected".lower().strip():
                print("Preparing for disconnecting from ECU!!!!")
                time.sleep(2)
                self.connected_ecu.disconnect()
                self.scanner_status = "Disconnected"
                ecu=self.connected_ecu
                ecu.disconnect()
                print(ecu.ecu_id)
                self.connected_ecu=None
                print(f"Scanner disconnected from ECU : {self.connected_ecu.ecu_id}")
                return
        else:
            print("ECU not found....")

    def display_scanner(self):
        print("========== DIAGNOSTIC SCANNER ==========")
        print(f"Scanner ID : {self.scanner_id}")
        print(f"Scanner Name : {self.scanner_name}")
        print(f"Scanner Status : {self.scanner_status}")
        print(f"Connected ECU : {self.connected_ecu}")
        print("====================")

    def scan_fault_codes(self):
        if self.scanner_status == "Disconnected".lower().strip():
            print("Please first connect scanner to ECU....")
            self.connect_to_ecu()
        if self.scanner_status.lower()=="connected":
            if len(fault_database) == 0:
                print("No Fault Code found....")
            else:
                for fault_code in fault_database:
                    fault_code.display_fault()
            print("Scan completed")

    def read_live_data(self):
        rpm = random.randint(800, 3500)
        coolant_temp = random.randint(75, 105)
        battery_voltage = round(random.uniform(12.0, 14.8),2)
        fuel_level = random.randint(0, 100)
        throttle_position = random.randint(0, 100)
        vehicle_speed = random.randint(0, 200)
        engine_load = random.randint(0, 100)
        self.live_data = {"RPM": rpm,
                          "Coolant Temp": coolant_temp,
                          "Battery Voltage": battery_voltage,
                          "Fuel Level": fuel_level,
                          "Throttle Position": throttle_position,
                          "Vehicle Speed": vehicle_speed,
                          "Engine Load": engine_load} 
        if self.scanner_status == "Disconnected".lower().strip():
            print("Please first connect scanner to ECU....")
            self.connect_to_ecu()
        elif self.scanner_status == "Connected".lower().strip():
            print("Generating Live Data....")
            time.sleep(2)
            print("========== LIVE DATA ==========")
            print(f"RPM : {rpm} RPM")
            print(f"Coolant Temp : {coolant_temp} °C")
            print(f"Battery voltage : {battery_voltage} V")
            print(f"Fuel level : {fuel_level} %")
            print(f"Throttle Position : {throttle_position} %")
            print(f"Vehicle Speed : {vehicle_speed} Km/h")
            print(f"Engine Load : {engine_load} %")
            print("===============================")
        if rpm > 3000:
            print(f"RPM at {rpm}. Please upshift!!!")
        if coolant_temp >= 105:
            print(f"High Coolant Temperature {coolant_temp}!!!!")
        if battery_voltage <= 13:
            print(f"Low Battery Voltage {battery_voltage}!!!!")
        if fuel_level <= 10:
            print(f"Low fuel level {fuel_level}!!!!")
        if vehicle_speed >= 150:
            print(f"High speed warning {vehicle_speed}!!!!")
        if engine_load >= 80:
            print(f"Engine is on high load {engine_load}")
            print()
        print("Live Data Read Successfully....")

    def display_live_data(self):
        print("========== LIVE DATA ===========")
        print(f"RPM : {self.live_data['RPM']} RPM")
        print(f"Coolant Temp : {self.live_data['Coolant Temp']} °C")
        print(f"Battery Voltage : {self.live_data['Battery Voltage']} V")
        print(f"Fuel level : {self.live_data['Fuel Level']} %")
        print(f"Throttle Position : {self.live_data['Throttle Position']} %")
        print(f"Vehicle Speed : {self.live_data['Vehicle Speed']} km/h")
        print(f"Engine Load : {self.live_data['Engine Load']} %")
        print("====================")

    def to_dict(self):
        return {"Scanner ID": self.scanner_id,
                "Scanner Name": self.scanner_name,
                "Scanner Status": self.scanner_status,
                "Connected ECU": self.connected_ecu.ecu_id if self.connected_ecu else None}
    
def save_scanner():
    scanner_data = []
    for scanner in scan_history:
        scanner_data.append(scanner.to_dict())
    with open("scanner_data","w") as file:
        json.dump(scanner_data, file, indent=4)

def load_scanner():
    scan_history.clear()
    try:
        with open("scanner_data.json", "w") as file:
            scanner_data = json.load(file)
            for scanner in scanner_data:
                new_scanner = DiagnosticScanner(
                    scanner["Scanner ID"],
                    scanner["Scanner Name"],
                    scanner["Scanner Status"],
                    scanner["Connected ECU"])
                scan_history.append(new_scanner)
    except FileNotFoundError:
        print("Scanner data file not found....")
    except json.JSONDecodeError:
        print("Scanner data file is corrupted.")

class DiagnosticReport:
    def __init__(self,vehicle,ecu,scanner,fault_list,live_data,date_time):
        self.vehicle = vehicle
        self.ecu = ecu
        self.scanner = scanner
        self.fault_list = fault_list
        self.live_data = live_data
        self.date_time = date_time

    def generate_report(self):
        print("========== DAIGNOSTIC REPORT ==========")
        print("Vehicle Details")
        self.vehicle.display_vehicle()

        print("\nECU Details")
        self.ecu.display_ecu()

        print("\nFault code Details")
        if len(self.fault_list) == 0:
            print("No Fault Codes")
        else:
            for fault in self.fault_list:
                fault.display_fault()

        print("\nScanner Details")
        self.scanner.display_scanner()

        print("\nLive Data")
        self.scanner.display_live_data()

        print(f"\nDate & Time : {self.date_time}")
        print("====================")

    def to_dict(self):
        return {"Vehicle": self.vehicle.to_dict(),
                "ECU": self.ecu.to_dict(),
                "Scanner": self.scanner.to_dict(),
                "Fault List":[fault.to_dict() for fault in self.fault_list],
                "Live Data": self.live_data,
                "Data Time": self.date_time}
    
def save_report(report):
    report_history.append(report)
    print("Report saved successfully!")

def show_report_history():
    if len(report_history) == 0:
        print("No Reports Found!")
        return
    print("========== REPORT HISTORY ==========")
    for report in report_history:
        report.generate_report()
        print()

def generate_diagnostic_report():
    if len(vehicles) == 0:
        print("No vehicle found!")
        return
    if len(ecu_database) == 0:
        print("No ECU found!")
        return
    if len(scan_history) == 0:
        print("No scanner found!")
        return
    scanner = scan_history[0]
    if scanner.scanner_status.lower().strip() != "connected":
        print("Please connect the scanner to an ECU first.")
        return
    if not hasattr(scanner, "live_data"):
        print("Please read live sensor data first.")
        return
    report = DiagnosticReport(
        vehicle=vehicles[0],
        ecu=scanner.connected_ecu,
        scanner=scanner,
        fault_list=fault_database,
        live_data=scanner.live_data,
        date_time=datetime.now().strftime("%d-%m-%Y %H:%M:%S"))
    report.generate_report()
    save_report(report)

load_vehicle()
load_ecu()
load_fault()
load_scanner()

while True:
    print("==========================================")
    print("      AUTOMOTIVE MANAGEMENT SYSTEM")
    print("==========================================")
    print("\n1. Add Vehicles.")
    print("2. Show All Vehicle.")
    print("3. Search Vehicle.")
    print("4. Connect to ECU.")
    print("5. Read Live Sensor data.")
    print("6. Scan Fault Codes.")
    print("7. Show All Fault Codes.")
    print("8. Search Fault Code.")
    print("9. Clear Fault Code.")
    print("10. Generate Diagnostic Report.")
    print("11. Show Report History.")
    print("12. Save Data.")
    print("13. Load Data.")
    print("14. Exit.\n")
    print("==========================================")

    choice = input("Enter your choice:- ")
    if choice == "1":
        add_vehicle()
    elif choice == "2":
        show_all_vehicle()
    elif choice == "3":
        search_vehicle()
    elif choice == "4":
        scan_history[0].connect_to_ecu()
    elif choice == "5":
        scan_history[0].read_live_data()
    elif choice == "6":
        scan_history[0].scan_fault_codes()
    elif choice == "7":
        show_all_faults()
    elif choice == "8":
        search_fault()
    elif choice == "9":
        clear_fault()
    elif choice == "10":
        generate_diagnostic_report()
    elif choice == "11":
        show_report_history()
    elif choice == "12":
        save_vehicle()
        save_ecu()
        save_fault()
        save_scanner()
        print("Data saved successfully.")
    elif choice == "13":
        load_vehicle()
        load_ecu()
        load_fault()
        load_scanner()
        print("Data loaded successfully.")
    elif choice == "14":
        save_vehicle()
        save_ecu()
        save_fault()
        save_scanner()
        print("Data saved successfully.")
        print("Thank you for using Automotive Management System!!!!")
        break
    else:
        print("Invaild choice. Please try again!!!!")
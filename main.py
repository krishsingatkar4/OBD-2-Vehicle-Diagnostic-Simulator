# OBD-2 Vehicle diagnostic simulator
import time
import random
import json

vehicles = []
fault_database = []
scan_history = []
ecu_database = []
report_history = []

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

def load_vehicle():
    vehicles.clear()
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
    vehicle_id = input("Enter the ID of the vehicle:- ")
    owner_name = input("Enter the name of the owner:- ")
    company = input("Enter the name of the company:- ")
    model = input("Enter the model of the vehicle:- ")
    year = input("Enter the year of the vehicle:- ")
    fuel_type = input("Enter the fuel type of the vehicle:- ")
    vin = input("Enter the VIN of the vehicle:- ")
    new_vehicle = Vehicle(vehicle_id,owner_name,company,model,year,fuel_type,vin)
    vehicles.append(new_vehicle)

def show_all_vehicle():
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
        if self.connection_status.lower().strip() == "Disconnect".lower().strip():
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
    ecu_database.clear()
    with open("ecu_data.json","r") as file:
        ecu_data = json.load(file)
        for ecu in ecu_data:
            new_ecu = ECU(ecu["ECU ID"],
                          ecu["Manufacturer"],
                          ecu["Firmware"],
                          ecu["Connection Status"])
            ecu_database.append(new_ecu)

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
        print("No ECU found in OBD Daignostic!!!!")
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
    fault_database.clear()
    with open("fault_code_data.json","r") as file:
        fault_data = json.load(file)
        for fault in fault_data:
            new_fault = FaultCode(fault["Fault Code"],
                                  fault["Description"],
                                  fault["Severity"],
                                  fault["Status"])
            fault_database.append(new_fault)

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
    
    def connect_to_ecu(self, ecu):
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
                self.connected_ecu = None
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
        elif self.scanner_status == "Connected".lower().strip():
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
            print(f"High Coolant Temprature {coolant_temp}!!!!")
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

class DaignosticReport:
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
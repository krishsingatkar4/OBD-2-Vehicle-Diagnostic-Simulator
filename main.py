# OBD-2 Vehicle diagnostic simulator
import time

vehicles = []
fault_database = []
scan_history = []
ecu_database = []

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

# OBD-2 Vehicle diagnostic simulator
vehicles = []
fault_database = []
scan_history = []

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

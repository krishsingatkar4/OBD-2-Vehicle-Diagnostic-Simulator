# 🚗 OBD-II Vehicle Diagnostic Simulator
A Python-based **Object-Oriented Vehicle Diagnostic Simulator** that mimics the basic functionality of an OBD-II automotive diagnostic system. The project demonstrates how vehicles, ECUs, diagnostic scanners, fault codes, and live sensor data interact in a real-world automotive environment.
---
## 📌 Features
- 🚘 Vehicle Management
  - Add Vehicle
  - Search Vehicle
  - Display All Vehicles
  - Update Vehicle Information

- ⚙️ ECU Management
  - Add ECU
  - Search ECU
  - Display All ECUs
  - Connect / Disconnect ECU

- ⚠️ Fault Code Management
  - Add Fault Codes
  - Search Fault Codes
  - Display All Fault Codes
  - Clear Fault Codes
  - Update Fault Information

- 🔍 Diagnostic Scanner
  - Connect to ECU
  - Scan Fault Codes
  - Read Live Sensor Data

- 📊 Live Sensor Simulation
  - Engine RPM
  - Coolant Temperature
  - Battery Voltage
  - Fuel Level
  - Throttle Position
  - Vehicle Speed
  - Engine Load

- 📄 Diagnostic Report Generation
  - Vehicle Details
  - ECU Information
  - Scanner Information
  - Fault Code Summary
  - Live Sensor Data
  - Date & Time

- 💾 JSON Data Storage
  - Vehicle Database
  - ECU Database
  - Fault Code Database
  - Scanner Database
---
## 🛠 Technologies Used
- Python 3
- Object-Oriented Programming (OOP)
- JSON File Handling
- Random Module
- Datetime Module
- Time Module
---
## 📂 Project Structure
```
OBD-II-Vehicle-Diagnostic-Simulator/
│
├── main.py
├── vehicle_information.json
├── ecu_data.json
├── fault_code_data.json
├── scanner_data.json
└── README.md
```
---
## 🚀 How to Run
1. Clone the repository
```bash
git clone https://github.com/your-username/OBD-II-Vehicle-Diagnostic-Simulator.git
```
2. Open the project folder
```bash
cd OBD-II-Vehicle-Diagnostic-Simulator
```
3. Run the project
```bash
python main.py
```
---
## 📋 Main Menu
```
1. Add Vehicle
2. Show All Vehicles
3. Search Vehicle
4. Connect to ECU
5. Read Live Sensor Data
6. Scan Fault Codes
7. Show All Fault Codes
8. Search Fault Code
9. Clear Fault Code
10. Generate Diagnostic Report
11. Show Report History
12. Save Data
13. Load Data
14. Exit
```
---
## 💡 Concepts Demonstrated
- Object-Oriented Programming
- Classes & Objects
- Encapsulation
- File Handling
- JSON Serialization
- Data Persistence
- Menu-Driven Programs
- Automotive Diagnostics Simulation
---
## 🎯 Future Improvements

- GUI using Streamlit or Tkinter
- CAN Bus Simulation
- Real OBD-II Integration using ELM327
- SQLite Database Support
- VIN Validation
- Advanced Fault Code Library
- Sensor Graph Visualization
- ECU Communication Simulation
---
## 👨‍💻 Author
**Krish Singatkar**
Python Developer | Automotive Enthusiast | Learning Automotive Diagnostics & ECU Programming
---
## 📜 License
This project is created for educational purposes.

# Raspberry Pi GPIO Energy Current Simulation (WIP)

## Project Overview

This project simulates electrical energy flow and current behavior between hardware GPIO pins and Raspberry Pi systems. It provides real-time visualization of voltage, current, and power consumption patterns with interactive circuit design capabilities.

## Features

- **Real-time GPIO simulation**: Virtual representation of Raspberry Pi GPIO pins
- **Current flow visualization**: Dynamic display of electrical current paths
- **Interactive circuit builder**: Drag-and-drop interface for creating circuits
- **Power consumption monitoring**: Real-time energy usage calculations
- **Hardware interfacing**: Connect to actual Raspberry Pi GPIO (when available)
- **Data logging**: Historical power consumption data with export capabilities
- **3D visualization**: Three.js-powered 3D circuit representation

## Technologies Used

### Frontend
- **React 18** - Main UI framework
- **Three.js** - 3D visualization and circuit rendering
- **D3.js** - Data visualization for graphs and charts
- **Tailwind CSS** - Responsive styling
- **Recharts** - Chart components for data analysis
- **Lucide React** - Icon components

### Backend (Node.js/Express)
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Socket.io** - Real-time bidirectional communication
- **SQLite** - Local database for simulation data
- **Johnny-Five** - JavaScript robotics and IoT platform
- **Raspi-io** - Raspberry Pi I/O plugin for Johnny-Five

### Hardware Integration
- **GPIO simulation library** - Virtual GPIO pin management
- **PWM signal generation** - Pulse width modulation simulation
- **ADC/DAC emulation** - Analog-to-digital conversion simulation
- **I2C/SPI protocol support** - Communication protocol simulation

### Data Processing
- **WebAssembly (WASM)** - High-performance calculations
- **Web Workers** - Background processing for complex simulations
- **IndexedDB** - Client-side data storage
- **CSV export** - Data analysis capabilities

## Installation

### Prerequisites
- Node.js 18+
- Python 3.8+ (for hardware interfacing)
- Raspberry Pi OS (for actual hardware)

### Setup
```bash
# Clone repository
git clone https://github.com/your-org/pi-energy-simulation.git
cd pi-energy-simulation

# Install dependencies
npm install
pip install RPi.GPIO gpiozero

# Start development server
npm run dev

# Start backend simulation server
npm run server
```

## Architecture

### System Components
1. **Frontend React App**: User interface and real-time visualization
2. **Simulation Engine**: Core electrical simulation algorithms
3. **GPIO Interface**: Hardware abstraction layer
4. **Data Pipeline**: Real-time data processing and storage
5. **3D Renderer**: Three.js-based circuit visualization

### Key Algorithms
- **Ohm's Law calculations**: V = I × R
- **Kirchhoff's circuit laws**: Current and voltage analysis
- **Power dissipation modeling**: P = V × I
- **Thermal simulation**: Heat generation and dissipation
- **Signal processing**: Digital and analog signal analysis

## Usage

1. **Design Circuit**: Use the drag-and-drop interface to create circuits
2. **Configure Parameters**: Set voltage, resistance, and component values
3. **Run Simulation**: Execute real-time current flow simulation
4. **Monitor Data**: View live graphs of voltage, current, and power
5. **Export Results**: Download simulation data for analysis

## Future Enhancements

- Machine learning for predictive power consumption
- Multi-board simulation support
- IoT device integration
- Cloud-based simulation sharing
- Advanced thermal modeling
- PCB layout integration

## License

MIT License - see LICENSE.md for details.

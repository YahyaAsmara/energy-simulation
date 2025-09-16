import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Zap, Settings, Download, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as THREE from 'three';

const EnergySimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [voltage, setVoltage] = useState(3.3);
  const [resistance, setResistance] = useState(1000);
  const [gpioStates, setGpioStates] = useState({});
  const [energyData, setEnergyData] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  // GPIO pins configuration
  const gpioPins = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(800, 400);
    renderer.setClearColor(0x000000, 0.1);
    mountRef.current.appendChild(renderer.domElement);

    // Create Raspberry Pi board representation
    const boardGeometry = new THREE.BoxGeometry(8, 5, 0.2);
    const boardMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    scene.add(board);

    // Create GPIO pins
    const pinGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
    const pinMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
    
    for (let i = 0; i < 40; i++) {
      const pin = new THREE.Mesh(pinGeometry, pinMaterial);
      const row = Math.floor(i / 2);
      const col = i % 2;
      pin.position.set(-3.5 + col * 0.2, 2 - row * 0.2, 0.2);
      scene.add(pin);
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    camera.position.set(0, 0, 10);
    sceneRef.current = { scene, camera, renderer };

    const animate = () => {
      requestAnimationFrame(animate);
      board.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Simulation loop
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 0.1);
        
        // Calculate current using Ohm's law: I = V / R
        const current = voltage / resistance;
        const power = voltage * current;
        
        // Generate some realistic noise
        const noiseVoltage = voltage + (Math.random() - 0.5) * 0.1;
        const noiseCurrent = current + (Math.random() - 0.5) * current * 0.05;
        const noisePower = power + (Math.random() - 0.5) * power * 0.05;

        setEnergyData(prev => {
          const newData = [...prev, {
            time: currentTime,
            voltage: parseFloat(noiseVoltage.toFixed(3)),
            current: parseFloat((noiseCurrent * 1000).toFixed(3)), // Convert to mA
            power: parseFloat((noisePower * 1000).toFixed(3)) // Convert to mW
          }];
          return newData.slice(-100); // Keep last 100 points
        });

        // Update GPIO states randomly for demonstration
        setGpioStates(prev => {
          const newStates = { ...prev };
          const randomPin = gpioPins[Math.floor(Math.random() * gpioPins.length)];
          newStates[randomPin] = Math.random() > 0.7;
          return newStates;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, voltage, resistance, currentTime]);

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setEnergyData([]);
    setGpioStates({});
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Time,Voltage(V),Current(mA),Power(mW)\n"
      + energyData.map(row => `${row.time},${row.voltage},${row.current},${row.power}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "energy_simulation_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleGpioPin = (pin) => {
    setGpioStates(prev => ({
      ...prev,
      [pin]: !prev[pin]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Cpu className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Raspberry Pi Energy Simulation</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={toggleSimulation}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Pause' : 'Start'}</span>
              </button>
              <button
                onClick={resetSimulation}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Square className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={exportData}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Controls</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Voltage (V): {voltage}
                  </label>
                  <input
                    type="range"
                    min="1.8"
                    max="5.0"
                    step="0.1"
                    value={voltage}
                    onChange={(e) => setVoltage(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resistance (Ω): {resistance}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={resistance}
                    onChange={(e) => setResistance(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-gray-300">Current</div>
                      <div className="text-lg font-bold text-green-400">
                        {((voltage / resistance) * 1000).toFixed(1)} mA
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-300">Power</div>
                      <div className="text-lg font-bold text-yellow-400">
                        {((voltage * voltage / resistance) * 1000).toFixed(1)} mW
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Visualization */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">3D Circuit View</h3>
              </div>
              <div ref={mountRef} className="w-full h-96 rounded-lg overflow-hidden bg-black/20" />
            </div>

            {/* GPIO Status */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">GPIO Status</h3>
              <div className="grid grid-cols-6 gap-2 max-h-96 overflow-y-auto">
                {gpioPins.map(pin => (
                  <button
                    key={pin}
                    onClick={() => toggleGpioPin(pin)}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      gpioStates[pin] 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/50' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {pin}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Charts */}
          <div className="mt-6 bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Real-time Energy Monitoring</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="voltage" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={false}
                    name="Voltage (V)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={false}
                    name="Current (mA)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="power" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={false}
                    name="Power (mW)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergySimulation;

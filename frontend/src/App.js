import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Camera } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('Idle');
  const [moveValue, setMoveValue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [gamepadStatus, setGamepadStatus] = useState('No gamepad connected');
  const videoRef = useRef(null);

  const tabs = ['Idle', 'Direct Drive', 'Autonomous Drive', 'Camera Feed', 'Test'];

  useEffect(() => {
    const generateData = () => {
      const newData = Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value1: Math.random() * 100,
        value2: Math.random() * 100,
        value3: Math.random() * 100,
        value4: Math.random() * 100,
      }));
      setChartData(newData);
    };

    generateData();
    const interval = setInterval(generateData, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => {
          console.error("Error accessing webcam:", error);
        });
    }
  }, []);

  useEffect(() => {
    const handleGamepadConnected = (e) => {
      setGamepadStatus(`Gamepad connected!: ${e.gamepad.id}`);
    };

    const handleGamepadDisconnected = () => {
      setGamepadStatus('No gamepad connected!');
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  const CommandButton = ({ label }) => (
    <button className="bg-gray-800 text-white rounded px-2 py-1 text-sm hover:bg-gray-700 transition-colors">
      {label}
    </button>
  );

  const Lever = ({ value }) => (
    <div className="flex flex-col items-center mx-2">
      <div className="h-24 w-1 bg-gray-300 relative rounded">
        <div 
          className="absolute bottom-0 w-1 bg-gray-800 rounded"
          style={{ height: `${value * 100}%` }}
        />
      </div>
      <div className="mt-1 bg-gray-800 text-white rounded px-1 py-0.5 text-xs">
        {value.toFixed(1)}
      </div>
    </div>
  );

  const Chart = ({ dataKey }) => (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={chartData}>
        <XAxis dataKey="time" />
        <YAxis />
        <Line type="monotone" dataKey={dataKey} stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="flex flex-col items-center p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Mars Web UI</h1>
      
      <nav className="w-full mb-6">
        <ul className="flex justify-center space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-gray-800 shadow'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex w-full gap-4">
        <div className="w-1/2 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-center mb-2 text-lg font-semibold text-gray-800">Live Webcam Feed</h2>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-gray-800 text-white rounded-full p-1">
                <Camera size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-center mb-2 text-lg font-semibold text-gray-800">Controls</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['Raise Bucket Ladder', 'Lower Bucket Ladder', 'Raise Deposit Bin', 'Lower Deposit Bin', 'Dig', 'Dump'].map((label, index) => (
                <CommandButton key={index} label={label} />
              ))}
            </div>
            <button className="w-full p-2 bg-red-500 text-white rounded-md text-center hover:bg-red-600 transition-colors">
              ESTOP
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-center mb-2 text-lg font-semibold text-gray-800">Move</h2>
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-600">0°</span>
              <input
                type="range"
                min="0"
                max="360"
                value={moveValue}
                onChange={(e) => setMoveValue(Number(e.target.value))}
                className="mx-2 flex-grow"
              />
              <span className="text-sm text-gray-600">360°</span>
            </div>
            <p className="text-center mt-1 text-sm text-gray-600">Current: {moveValue}°</p>
          </div>
        </div>

        <div className="w-1/2 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-center mb-2 text-lg font-semibold text-gray-800">Charts</h2>
            <div className="grid grid-cols-2 gap-2">
              <Chart dataKey="value1" />
              <Chart dataKey="value2" />
              <Chart dataKey="value3" />
              <Chart dataKey="value4" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-center mb-2 text-lg font-semibold text-gray-800">Levers</h2>
            <div className="flex justify-center">
              {[0.9, 0.3, 0.7, 0.8].map((value, index) => (
                <Lever key={index} value={value} />
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-center mb-2 text-lg font-semibold text-gray-800">Other Readings</h2>
            <div className="flex justify-center">
              <div className="bg-gray-800 text-white rounded-md px-2 py-1 m-1 text-sm">
                Live Value: 0.0
              </div>
              <div className="bg-gray-800 text-white rounded-md px-2 py-1 m-1 text-sm">
                Live Value: 0.0
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-center mb-2 text-lg font-semibold text-gray-800">Gamepad Status</h2>
            <p className="text-center text-gray-600">{gamepadStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
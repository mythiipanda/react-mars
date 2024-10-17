import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Camera } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('Gamepad');
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
    <button className="bg-gray-800 text-white rounded px-2 py-1 text-sm">
      {label}
    </button>
  );

  const Lever = ({ value }) => (
    <div className="flex flex-col items-center mx-2">
      <div className="h-24 w-1 bg-gray-300 relative">
        <div 
          className="absolute bottom-0 w-1 bg-gray-800" 
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
      <nav className="w-full mb-4">
        <ul className="flex justify-between">
          {tabs.map((tab) => (
            <li 
              key={tab} 
              className={`cursor-pointer ${activeTab === tab ? 'font-bold' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex w-full gap-4">
        <div className="w-1/2 flex flex-col gap-4">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-center mb-2 text-lg font-semibold">Live Webcam Feed</h2>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-gray-800 text-white rounded-full p-1">
                <Camera size={20} />
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-center mb-2 text-lg font-semibold">Controls</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['Raise Bucket Ladder', 'Lower Bucket Ladder', 'Raise Deposit Bin', 'Lower Deposit Bin', 'Dig', 'Dump'].map((label, index) => (
                <CommandButton key={index} label={label} />
              ))}
            </div>
            <button className="w-full p-2 bg-red-500 text-white rounded text-center">
              ESTOP
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-center mb-2 text-lg font-semibold">Move</h2>
            <div className="flex items-center justify-center">
              <span className="text-sm">0°</span>
              <input
                type="range"
                min="0"
                max="360"
                value={moveValue}
                onChange={(e) => setMoveValue(Number(e.target.value))}
                className="mx-2 flex-grow"
              />
              <span className="text-sm">360°</span>
            </div>
            <p className="text-center mt-1 text-sm">Current: {moveValue}°</p>
          </div>
        </div>

        <div className="w-1/2 flex flex-col gap-4">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-center mb-2 text-lg font-semibold">Charts</h2>
            <div className="grid grid-cols-2 gap-2">
              <Chart dataKey="value1" />
              <Chart dataKey="value2" />
              <Chart dataKey="value3" />
              <Chart dataKey="value4" />
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-center mb-2 text-lg font-semibold">Levers</h2>
            <div className="flex justify-center">
              {[0.9, 0.3, 0.7, 0.8].map((value, index) => (
                <Lever key={index} value={value} />
              ))}
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-center mb-2 text-lg font-semibold">Other Readings</h2>
            <div className="flex justify-center">
              <div className="bg-gray-800 text-white rounded px-2 py-1 m-1 text-sm">
                Live Value: 0.0
              </div>
              <div className="bg-gray-800 text-white rounded px-2 py-1 m-1 text-sm">
                Live Value: 0.0
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-center mb-2 text-lg font-semibold">Gamepad Status</h2>
            <p className="text-center">{gamepadStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
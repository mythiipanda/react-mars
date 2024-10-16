import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const App = () => {
  const [activeTab, setActiveTab] = useState('Gamepad');
  const [moveValue, setMoveValue] = useState(0);
  const [chartData, setChartData] = useState([]);

  const tabs = ['Gamepad', 'Idle', 'Direct Drive', 'Autonomous Drive', 'Camera Feed', 'Test'];

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

  const CommandButton = ({ label }) => (
    <button className="bg-gray-800 text-white rounded px-3 py-1 m-1">
      {label}
    </button>
  );

  const Lever = ({ value }) => (
    <div className="flex flex-col items-center mx-4">
      <div className="h-32 w-1 bg-gray-300 relative">
        <div 
          className="absolute bottom-0 w-1 bg-gray-800" 
          style={{ height: `${value * 100}%` }}
        />
      </div>
      <div className="mt-2 bg-gray-800 text-white rounded px-2 py-1">
        Live Value: {value.toFixed(1)}
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
    <div className="flex flex-col items-center p-4 max-w-3xl mx-auto">
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

      <div className="w-full bg-gray-100 p-4 rounded mb-8">
        <h2 className="text-center mb-4">Commands</h2>
        <div className="flex justify-center">
          {['Raise', 'Raise', 'Raise', 'Raise', 'Raise', 'Raise'].map((label, index) => (
            <CommandButton key={index} label={label} />
          ))}
        </div>
      </div>

      <div className="w-full bg-gray-100 p-4 rounded mb-8">
        <h2 className="text-center mb-4">Charts</h2>
        <div className="grid grid-cols-2 gap-4">
          <Chart dataKey="value1" />
          <Chart dataKey="value2" />
          <Chart dataKey="value3" />
          <Chart dataKey="value4" />
        </div>
      </div>

      <div className="flex justify-center mb-8">
        {[0.9, 0.3, 0.7, 0.8].map((value, index) => (
          <Lever key={index} value={value} />
        ))}
      </div>

      <div className="w-full bg-gray-100 p-4 rounded mb-8">
        <h2 className="text-center mb-4">Move</h2>
        <div className="flex items-center justify-center">
          <span>0°</span>
          <input
            type="range"
            min="0"
            max="360"
            value={moveValue}
            onChange={(e) => setMoveValue(Number(e.target.value))}
            className="mx-4"
          />
          <span>360°</span>
        </div>
        <p className="text-center mt-2">Play around: {moveValue}°</p>
      </div>

      <div className="w-full bg-gray-100 p-4 rounded">
        <h2 className="text-center mb-4">Other Readings</h2>
        <div className="flex justify-center">
          <div className="bg-gray-800 text-white rounded px-2 py-1 m-2">
            Live Value: 0.0
          </div>
          <div className="bg-gray-800 text-white rounded px-2 py-1 m-2">
            Live Value: 0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
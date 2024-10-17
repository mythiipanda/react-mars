import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Camera } from 'lucide-react';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('Idle');
  const [moveValue, setMoveValue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [gamepadStatus, setGamepadStatus] = useState('No gamepad connected!');
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
    <button className="command-button">
      {label}
    </button>
  );

  const Lever = ({ value }) => (
    <div className="lever-container">
      <div className="lever">
        <div 
          className="lever-fill"
          style={{ height: `${value * 100}%` }}
        />
      </div>
      <div className="lever-value">
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
    <div className="app-container">
      <h1 className="title">Mars Web UI</h1>
      
      <nav className="nav">
        <ul className="tab-list">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="content">
        <div className="left-panel">
          <div className="panel">
            <h2 className="panel-title">Live Webcam Feed</h2>
            <div className="webcam-container">
              <video ref={videoRef} autoPlay playsInline muted className="webcam" />
              <div className="camera-icon">
                <Camera size={20} />
              </div>
            </div>
          </div>

          <div className="panel">
            <h2 className="panel-title">Controls</h2>
            <div className="command-grid">
              {['Raise Bucket Ladder', 'Raise Deposit Bin', 'Dig', 'Lower Bucket Ladder', 'Lower Deposit Bin', 'Dump'].map((label, index) => (
                <CommandButton key={index} label={label} />
              ))}
            </div>
            <button className="estop-button">
              ESTOP
            </button>
          </div>

          <div className="panel">
            <h2 className="panel-title">Move</h2>
            <div className="move-control">
              <span className="move-label">0°</span>
              <input
                type="range"
                min="0"
                max="360"
                value={moveValue}
                onChange={(e) => setMoveValue(Number(e.target.value))}
                className="move-slider"
              />
              <span className="move-label">360°</span>
            </div>
            <p className="move-current">Current: {moveValue}°</p>
          </div>
        </div>

        <div className="right-panel">
          <div className="panel">
            <h2 className="panel-title">Charts</h2>
            <div className="chart-grid">
              <Chart dataKey="value1" />
              <Chart dataKey="value2" />
              <Chart dataKey="value3" />
              <Chart dataKey="value4" />
            </div>
          </div>

          <div className="panel">
            <h2 className="panel-title">Levers</h2>
            <div className="lever-grid">
              {[0.9, 0.3, 0.7, 0.8].map((value, index) => (
                <Lever key={index} value={value} />
              ))}
            </div>
          </div>

          <div className="panel">
            <h2 className="panel-title">Other Readings</h2>
            <div className="reading-grid">
              <div className="reading">Live Value: 0.0</div>
              <div className="reading">Live Value: 0.0</div>
            </div>
          </div>
          
          <div className="panel">
            <h2 className="panel-title">Gamepad Status</h2>
            <p className="gamepad-status">{gamepadStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
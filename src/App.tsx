import { useEffect, useState } from 'react'
import * as d3 from "d3";
import './App.css'

function App() {

  const [battery, setBattery] = useState(null);

  useEffect(() => {
    const updateBatteryStatus = async () => {
      const battery = await navigator.getBattery();
      setBattery(battery);

      const handleBatteryChange = () => {
        setBattery({ ...battery });
      };

      battery.addEventListener('levelchange', handleBatteryChange);
      battery.addEventListener('chargingchange', handleBatteryChange);

      return () => {
        battery.removeEventListener('levelchange', handleBatteryChange);
        battery.removeEventListener('chargingchange', handleBatteryChange);
      };
    };

    if ('getBattery' in navigator) {
      updateBatteryStatus();
    } else {
      console.log('Battery Status API not supported');
    }
  }, []);




  const PercentScale = d3.scaleLinear([0, 100], [0, 900])
  const [value, setValue] = useState(50); // Initial value

  // Handle change event
  const handleBatteryChange = (event) => {
    setValue(event.target.value);
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleChargingChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      {/*<div>
        <p>Battery Level: {(battery.level * 100).toFixed(0)}%</p>
        <p>{battery.charging ? 'Charging' : 'Not Charging'}</p>
        <p>Charging Time: {battery.chargingTime === Infinity ? 'Not charging' : `${battery.chargingTime} seconds`}</p>
        <p>Discharging Time: {battery.dischargingTime === Infinity ? 'Not discharging' : `${battery.dischargingTime} seconds`}</p>
      </div>*/}

      <svg height={500} width={500} viewBox="0 0 1000 1000" fill='white' xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="green" />
            <stop offset="25%" stopColor="LawnGreen" />
            <stop offset="50%" stopColor="yellow" />
            <stop offset="75%" stopColor="orange" />
            <stop offset="100%" stopColor="red" />
          </linearGradient>
        </defs>
        <rect x="400" y="20" width="200" height="100" rx="20" />
        <rect x="250" y="100" width="500" height="900" rx="5" fill="url(#Gradient2)" />
        <rect x="250" y="100" width="500" height={900 - PercentScale(value)} rx="5" />
        {isChecked && <path
          fill="gold"
          stroke="black"
          strokeWidth={7}
          d="M 500,200
             L 300,600
             L 500,600
             L 500,900
             L 700,500
             L 500,500
           z" />}
      </svg>
      <div className="slider-container">
        <label htmlFor="slider">Battery Level: {value}</label>
        <input
          id="slider"
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleBatteryChange}
          className="slider"
        />

      </div>
      <div className="switch-container">
        <label className="switch">
          <input type="checkbox" checked={isChecked} onChange={handleChargingChange} />
          <span className="chargeingslider"></span>
        </label>
        <p>Charging is {isChecked ? 'ON' : 'OFF'}</p>
      </div>
    </>

  )
}

export default App

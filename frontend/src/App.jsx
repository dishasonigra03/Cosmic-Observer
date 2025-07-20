import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ISSTrackerPage from './pages/ISSTrackerPage';
import MarsWeatherPage from './pages/MarsWeatherPage';
import NeoWatchPage from './pages/NeoWatchPage';
import TelemetryPage from './pages/TelemetryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/iss-tracker" element={<ISSTrackerPage />} />
        <Route path="/mars-weather" element={<MarsWeatherPage />} />
        <Route path="/neo-watch" element={<NeoWatchPage />} />
        <Route path="/telemetry" element={<TelemetryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
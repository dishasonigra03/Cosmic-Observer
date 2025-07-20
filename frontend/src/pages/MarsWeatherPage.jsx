import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { TextureLoader } from 'three';
import axios from 'axios';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Navbar from '../components/layout/Navbar';

function Mars() {
  const marsTexture = useLoader(TextureLoader, '/textures/mars.jpg');
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={marsTexture} />
    </mesh>
  );
}

const DataCard = ({ label, value, unit }) => (
    <motion.div
        className="data-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
    >
        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{label}</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)', margin: '0.5rem 0' }}>{value}</div>
        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{unit}</div>
    </motion.div>
);

const MarsWeatherPage = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const { data } = await axios.get('http://localhost:3001/api/mars-weather');
                setWeather(data);
            } catch (err) {
                console.error("Failed to fetch Mars weather", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    return (
        <>
         <Navbar />
        <div style={{ position: 'relative', width: '100vw', height: '100vh', margin: '-80px -2rem -2rem -2rem'}}>
            <Suspense fallback={<LoadingSpinner />}>
                <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <Stars radius={100} depth={50} count={10000} factor={4} saturation={0} fade />
                    <Mars />
                    <OrbitControls autoRotate autoRotateSpeed={0.2} enableZoom={false} />
                </Canvas>
            </Suspense>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <h1 className="page-title" style={{ color: 'white', textShadow: '2px 2px 4px #000' }}>Mars Weather Report</h1>
                {loading ? <LoadingSpinner/> : weather ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem' }}>
                        <DataCard label="Average Temperature" value={parseFloat(weather.avg_temp).toFixed(1)} unit="°C" />
                        <DataCard label="Atmospheric Pressure" value={parseFloat(weather.pressure).toFixed(1)} unit="Pa" />
                        <DataCard label="Horizontal Wind Speed" value={parseFloat(weather.wind_speed).toFixed(1)} unit="m/s" />
                    </div>
                ) : (
                    <p>Could not retrieve weather data.</p>
                )}
                 <p style={{ position: 'absolute', bottom: '2rem', color: 'var(--text-secondary)'}}>Data from NASA's InSight Lander | Sol: {weather?.sol || 'N/A'}</p>
            </div>
        </div>
        </>
    );
};

export default MarsWeatherPage;
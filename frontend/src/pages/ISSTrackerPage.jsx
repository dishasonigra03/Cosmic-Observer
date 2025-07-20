import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
import { TextureLoader } from 'three';
import axios from 'axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Navbar from '../components/layout/Navbar';

function ISSModel({ position }) {
  // IMPORTANT: You must provide your own 'iss.glb' file in the '/public/models/' directory.
  // Once you have the file, you can uncomment the line below.
  // const { scene } = useGLTF('/models/iss.glb');
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
        ref.current.position.set(position[0], position[1], position[2]);
    }
  });

  // This will render a placeholder until you provide the model.
  return (
    <mesh ref={ref} scale={0.05}>
        <boxGeometry />
        <meshStandardMaterial color="white" />
    </mesh>
  );
  // Once you have your model, replace the mesh above with this line:
  // return <primitive object={scene} ref={ref} scale={0.005} />;
}

function Earth() {
  const dayMap = useLoader(TextureLoader, '/textures/earth_day.jpg');
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={dayMap} />
    </mesh>
  );
}

const ISSTrackerPage = () => {
    const [issData, setIssData] = useState(null);
    const [issPosition3D, setIssPosition3D] = useState([1.1, 0, 0]);

    useEffect(() => {
        const fetchISSLocation = async () => {
          try {
            const { data } = await axios.get('http://localhost:3001/api/iss-location');
            setIssData(data);
            const phi = (90 - data.latitude) * (Math.PI / 180);
            const theta = (data.longitude + 180) * (Math.PI / 180);
            const radius = 1.1;
            const x = -(radius * Math.sin(phi) * Math.cos(theta));
            const z = (radius * Math.sin(phi) * Math.sin(theta));
            const y = (radius * Math.cos(phi));
            setIssPosition3D([x, y, z]);
          } catch (err) { console.error(err); }
        };
        fetchISSLocation();
        const intervalId = setInterval(fetchISSLocation, 5000);
        return () => clearInterval(intervalId);
      }, []);

  return (
    <>
     <Navbar />
    <div className="page-container">
      <h1 className="page-title">ISS Real-time 3D Tracker</h1>
      <div className="detail-page-layout">
        <div className="info-panel">
          <h2>Telemetry Data</h2>
          {issData ? (
              <>
                <p><strong>Latitude:</strong> {issData.latitude.toFixed(4)}°</p>
                <p><strong>Longitude:</strong> {issData.longitude.toFixed(4)}°</p>
                <p><strong>Altitude:</strong> {issData.altitude.toFixed(2)} km</p>
                <p><strong>Velocity:</strong> {issData.velocity.toFixed(2)} km/h</p>
              </>
          ) : <p>Fetching data...</p>}
        </div>
        <div className="visualization-panel">
          <Suspense fallback={<LoadingSpinner />}>
            <Canvas camera={{ position: [0, 0, 2.5], fov: 75 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[100, 100, 100]} intensity={2}/>
              <Stars radius={300} depth={50} count={20000} factor={7} saturation={0} fade />
              <Earth />
              <ISSModel position={issPosition3D} />
              <OrbitControls enableZoom={true} enablePan={true} autoRotate autoRotateSpeed={0.3} />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </div>
    </>
  );
};

export default ISSTrackerPage;

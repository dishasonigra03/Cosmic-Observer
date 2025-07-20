import React from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, Stars } from '@react-three/drei';

function AnimatedBackground() {
  const knotRef = React.useRef();
  useFrame((state, delta) => {
    if (knotRef.current) {
      knotRef.current.rotation.x += delta * 0.1;
      knotRef.current.rotation.y += delta * 0.1;
    }
  });
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} color="#4299e1" intensity={1.5} />
      <TorusKnot ref={knotRef} args={[1.5, 0.3, 1024, 16]}>
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.8} wireframe />
      </TorusKnot>
    </>
  );
}

function HomePage() {
  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}>
        <Canvas><AnimatedBackground /></Canvas>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center', padding: '2rem'}}>
        <h1 style={{fontSize: '4.5rem', fontWeight: 700, margin: 0, letterSpacing: '-2px', color: '#fff'}}>Cosmic Observer</h1>
        <p style={{fontSize: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '2.5rem', maxWidth: '500px'}}>
          Your portal to the cosmos. Explore real-time space mission data.
        </p>
        <nav style={{display: 'flex', gap: '1rem'}}>
          <Link to="/iss-tracker" className="nav-link" style={{backgroundColor: 'var(--accent)', color: 'white'}}>ISS Tracker</Link>
          <Link to="/mars-weather" className="nav-link" style={{backgroundColor: 'var(--accent)', color: 'white'}}>Mars Weather</Link>
          <Link to="/neo-watch" className="nav-link" style={{backgroundColor: 'var(--accent)', color: 'white'}}>NEO Watch</Link>
          <Link to="/telemetry" className="nav-link" style={{backgroundColor: 'var(--accent)', color: 'white'}}>Telemetry</Link>
        </nav>
      </div>
    </div>
  );
}

export default HomePage;

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Line } from '@react-three/drei';
import axios from 'axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Navbar from '../components/layout/Navbar';

const Earth = () => (
    <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" />
    </mesh>
)

const NeoPath = ({ miss_distance_km }) => {
    const scaledDistance = (miss_distance_km / 1000000) * 2 + 0.5;
    const points = [[-10, scaledDistance, 0], [10, scaledDistance, 0]];
    return <Line points={points} color="red" lineWidth={2} dashed dashScale={10} gapSize={5} />
}

const NeoWatchPage = () => {
    const [neos, setNeos] = useState([]);
    const [selectedNeo, setSelectedNeo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNeos = async () => {
            try {
                const { data } = await axios.get('http://localhost:3001/api/neos');
                setNeos(data);
                if (data.length > 0) setSelectedNeo(data[0]);
            } catch (err) {
                console.error("Failed to fetch NEOs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNeos();
    }, []);

    return (
        <>
         <Navbar />
        <div className="page-container">
            <h1 className="page-title">Near-Earth Object Watch</h1>
            {loading ? <LoadingSpinner/> : (
                <div className="detail-page-layout">
                    <div className="info-panel" style={{height: 'calc(100vh - 160px)'}}>
                        <h2>Upcoming Approaches</h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {neos.map(neo => (
                                <li key={neo.id} onClick={() => setSelectedNeo(neo)} style={{
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    borderLeft: selectedNeo?.id === neo.id ? '4px solid var(--accent)' : '4px solid transparent',
                                    background: selectedNeo?.id === neo.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
                                }}>
                                    <strong>{neo.name}</strong>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                                        {new Date(neo.close_approach_date).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="visualization-panel">
                        <Suspense fallback={<LoadingSpinner />}>
                            <Canvas camera={{ position: [0, 5, 15], fov: 75 }}>
                                <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} />
                                <Stars count={5000} />
                                <Earth />
                                {selectedNeo && <NeoPath miss_distance_km={selectedNeo.miss_distance_km} />}
                                {selectedNeo &&
                                    <Text position={[0, 1.5, 0]} fontSize={0.5} color="white" anchorX="center">
                                        {selectedNeo.name}
                                    </Text>
                                }
                                <OrbitControls />
                            </Canvas>
                            {selectedNeo && (
                                <div style={{position:'absolute', bottom: '2rem', left: '2rem', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', pointerEvents: 'all'}}>
                                    <p><strong>Miss Distance:</strong> {new Intl.NumberFormat().format(selectedNeo.miss_distance_km)} km</p>
                                    <p><strong>Est. Diameter:</strong> {selectedNeo.estimated_diameter_m} m</p>
                                </div>
                            )}
                        </Suspense>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default NeoWatchPage;
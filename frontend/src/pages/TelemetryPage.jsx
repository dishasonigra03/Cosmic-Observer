import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const socket = io('http://localhost:3001');
const MAX_DATA_POINTS = 30;

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { ticks: { color: 'var(--text-secondary)' } }, y: { ticks: { color: 'var(--text-secondary)' } } },
    plugins: { legend: { labels: { color: 'var(--text-primary)' } } },
    animation: { duration: 0 }
};

const DigitalDisplay = ({ label, value, unit }) => (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>{label}</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)', margin: '0.5rem 0' }}>{value}</div>
        <div style={{ color: 'var(--text-secondary)' }}>{unit}</div>
    </div>
);

const TelemetryPage = () => {
    const [status, setStatus] = useState({ label: "Connecting...", color: "#94a3b8" });
    const [data, setData] = useState({});
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            { label: 'Temperature (°C)', data: [], borderColor: '#f87171' },
            { label: 'Voltage (V)', data: [], borderColor: '#60a5fa' },
        ],
    });

    useEffect(() => {
        socket.on('connect', () => setStatus({ label: "NOMINAL", color: "#34d399" }));
        socket.on('disconnect', () => setStatus({ label: "DISCONNECTED", color: "#ef4444" }));

        const handleTelemetry = (newData) => {
            setData(newData);
            setChartData(currentData => {
                const newLabels = [...currentData.labels, new Date(newData.timestamp).toLocaleTimeString()];
                const newTempData = [...currentData.datasets[0].data, newData.temperature];
                const newVoltageData = [...currentData.datasets[1].data, newData.voltage];

                if (newLabels.length > MAX_DATA_POINTS) {
                    newLabels.shift(); newTempData.shift(); newVoltageData.shift();
                }

                return {
                    labels: newLabels,
                    datasets: [
                        { ...currentData.datasets[0], data: newTempData },
                        { ...currentData.datasets[1], data: newVoltageData },
                    ]
                };
            });
        };
        socket.on('telemetryData', handleTelemetry);

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('telemetryData', handleTelemetry);
        };
    }, []);

    return (
        <>
         <Navbar />
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="page-title" style={{textAlign: 'left', margin: 0}}>Live Telemetry</h1>
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--card-bg)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: status.color }}></div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{status.label}</span>
                </motion.div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
                <DigitalDisplay label="Altitude" value={data.altitude?.toFixed(2) || '...'} unit="km" />
                <DigitalDisplay label="Velocity" value={data.velocity?.toFixed(2) || '...'} unit="km/h" />
                <DigitalDisplay label="Battery" value={`${data.battery?.toFixed(1) || '...'}%`} unit="Charge" />
                <DigitalDisplay label="Signal" value={`${data.signal?.toFixed(1) || '...'} dBm`} unit="Strength" />
            </div>
            <div style={{ marginTop: '2rem', height: '400px', background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px' }}>
                <Line options={chartOptions} data={chartData} />
            </div>
        </div>
        </>
    );
};

export default TelemetryPage;
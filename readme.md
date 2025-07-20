# Cosmic Observer Dashboard

Cosmic Observer is an immersive, multi-page web application designed to visualize real-time and simulated space mission data. The project features a stunning animated landing page and four distinct, interactive pages, each dedicated to a different aspect of space exploration. It leverages modern web technologies, including React and Three.js, to create a rich, 3D user experience.


---

## Features

*   **Multi-Page Architecture:** A fully routed application with a persistent navigation bar for seamless navigation.
*   **Immersive 3D Visualizations:** Each data page features interactive 3D models rendered with `react-three-fiber` and `drei`.
*   **Real-Time Data Integration:** Connects to live public APIs for accurate, up-to-the-minute information.
*   **Live WebSocket Connection:** A dedicated page for streaming simulated satellite telemetry in real-time.
*   **Modern UI/UX:** Styled with a clean, dark-themed aesthetic suitable for data visualization and animated with `framer-motion`.

---

## Page Breakdown

The application is divided into five main pages, each serving a unique purpose.

### 1. Home Page (`/`)

The landing page provides an engaging entry point to the application.
*   **Functionality:** It features a full-screen, animated 3D background with interactive stars and a rotating torus knot. It serves as a navigational hub with prominent links to the four main data pages.
*   **Technology:** `react-three-fiber/drei` for the 3D animation and `react-router-dom` for navigation links.
*   ![Text][screen 1.jpg]

### 2. ISS Real-time 3D Tracker (`/iss-tracker`)

This page provides a live, 3D visualization of the International Space Station's position relative to Earth.
*   **Functionality:**
    *   Fetches real-time latitude, longitude, altitude, and velocity from the `wheretheiss.at` API every 5 seconds.
    *   Converts the geographical coordinates into a 3D vector to accurately place a model of the ISS over a rotating 3D model of Earth.
    *   Displays the raw telemetry data in an information panel alongside the visualization.
    *   Allows users to rotate and zoom the scene using mouse controls.
*   **Technology:** `axios` for API requests, `react-three-fiber` for the 3D scene, and `useGLTF` for loading the ISS model.

### 3. Mars Weather Report (`/mars-weather`)

This page presents the latest available weather data from NASA's InSight lander on Mars.
*   **Functionality:**
    *   Fetches the most recent weather data (temperature, pressure, wind speed) from the NASA InSight API.
    *   Displays the data in animated, futuristic data cards that overlay a beautiful, slowly rotating 3D model of Mars.
    *   Creates a fully immersive "full-screen" experience.
*   **Technology:** `axios` for NASA API requests, `framer-motion` for UI animations, and `react-three-fiber` for the Mars model.

### 4. Near-Earth Object (NEO) Watch (`/neo-watch`)

This page tracks asteroids and comets that are scheduled to make a close approach to Earth.
*   **Functionality:**
    *   Fetches a list of upcoming NEOs from the NASA NeoWs API.
    *   Displays the list in a scrollable information panel. Clicking on an NEO in the list selects it.
    *   The 3D visualization updates based on the selected NEO, showing a representation of its fly-by path relative to Earth.
    *   Displays key details like miss distance and estimated diameter.
*   **Technology:** `axios` for API requests and `react-three-fiber` for the interactive 3D visualization of the NEO's trajectory.

### 5. Live Telemetry (`/telemetry`)

This page simulates a mission control interface, showing a live stream of satellite health and status data.
*   **Functionality:**
    *   Establishes a WebSocket connection to the backend server to receive a stream of data once per second.
    *   Displays key metrics like altitude, velocity, and battery status in large digital displays.
    *   Plots historical data for temperature and voltage on a real-time, scrolling line chart.
    *   Shows a "NOMINAL" or "DISCONNECTED" status indicator based on the WebSocket connection state.
*   **Technology:** `socket.io-client` for real-time communication and `react-chartjs-2` for data charting.

---

## Technology Stack

### Frontend
*   **Framework:** React 18
*   **3D Rendering:** `react-three-fiber`, `drei`, `three.js`
*   **Routing:** `react-router-dom`
*   **Data Fetching:** `axios`
*   **Real-time Communication:** `socket.io-client`
*   **Animation:** `framer-motion`
*   **Charting:** `react-chartjs-2`
*   **Build Tool:** Vite

### Backend
*   **Framework:** Node.js with Express
*   **Real-time Communication:** `socket.io`
*   **API Communication:** `axios`
*   **Environment Variables:** `dotenv`

### APIs & Services
*   **ISS Location:** `wheretheiss.at`
*   **Mars Weather & NEOs:** NASA Open APIs

---

## Project Setup and Installation

You will need to run two servers simultaneously: the backend (for data) and the frontend (for the user interface). **You will need two separate terminal windows for this.**

### Prerequisites

1.  **Node.js and npm:** You must have Node.js (which includes npm) installed. Download from [nodejs.org](https://nodejs.org/).
2.  **NASA API Key:** Two of the pages require a free API key from NASA. Get yours from [api.nasa.gov](https://api.nasa.gov/).

### Terminal 1: Run the Backend

1.  **Navigate to the backend folder:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Configure your API Key:**
    *   Rename the `.env.example` file to `.env`.
    *   Open the new `.env` file and replace `YOUR_API_KEY_HERE` with the actual API key you got from NASA.
    *   Save the file.

4.  **Start the backend server:**
    ```sh
    npm start
    ```
    ✅ You should see the message: `Backend server running on http://localhost:3001`. Leave this terminal running.

### Terminal 2: Run the Frontend

1.  **Open a new terminal window.**

2.  **Navigate to the frontend folder:**
    ```sh
    cd frontend
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Add Required Assets:**
    *   This is a crucial step for the 3D visualizations to work.
    *   Inside the `frontend/public/` directory, create a folder named `textures`.
    *   Download and place the following images inside `frontend/public/textures/`:
        *   `earth_day.jpg` (A texture map of Earth)
        *   `mars.jpg` (A texture map of Mars)
    *   (Optional) If you have a 3D model of the ISS, place the `iss.glb` file inside `frontend/public/models/` and update the code in `ISSTrackerPage.jsx`. A placeholder cube will be used if the model is not found.

5.  **Start the frontend development server:**
    ```sh
    npm run dev
    ```
    ✅ You should see a message giving you a local URL, typically `Local: http://localhost:5173/`.

### Viewing the Application

1.  Open your web browser (Chrome, Firefox, etc.).
2.  Go to the URL provided by the frontend server: **http://localhost:5173**

The animated home page should now be visible. Clicking the navigation links will take you to the respective data pages.

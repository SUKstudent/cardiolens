# CardioLens frontend
React + Vite + Tailwind + Recharts.

    npm install
    npm run dev

Without `VITE_API_URL` set, the app uses mock predictions (Oct 5 milestone).
To connect FastAPI: copy `.env.example` to `.env` and start the backend (allow CORS for http://localhost:5173).
Dark Doctor Mode and light Patient Mode (switch in the sidebar). The 3D heart (Member 4) plugs into `src/components/HeartPanel.jsx`.

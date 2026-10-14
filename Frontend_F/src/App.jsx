import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import ChooseMode from './pages/ChooseMode'
import About from './pages/About'
import { DoctorDashboard, DoctorPatientData, DoctorViz, DoctorRisk, DoctorReports } from './pages/doctor'
import WhatIf from './pages/WhatIf'
import Twins from './pages/Twins'
import AnatomyTour from './pages/AnatomyTour'
import { PatientProvider } from './context/PatientContext'
import { PatientHome, PatientRisk, PatientFactors, PatientViz } from './pages/patient'
import PatientLogin from './pages/PatientLogin'

export default function App() {
  return (
    <PatientProvider>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/mode" element={<ChooseMode />} />
        <Route path="/about" element={<About />} />

        <Route path="/doctor" element={<Layout mode="doctor" />}>
          <Route index element={<DoctorDashboard />} />
          <Route path="patient-data" element={<DoctorPatientData />} />
          <Route path="risk-analysis" element={<DoctorRisk />} />
          <Route path="what-if" element={<WhatIf />} />
          <Route path="compare" element={<Twins />} />
          <Route path="anatomy-tour" element={<AnatomyTour />} />
          <Route path="3d-visualization" element={<DoctorViz />} />
          <Route path="reports" element={<DoctorReports />} />
        </Route>

        <Route path="/patient" element={<Layout mode="patient" />}>
          <Route path="login" element={<PatientLogin />} />
          <Route index element={<PatientHome />} />
          <Route path="my-risk" element={<PatientRisk />} />
          <Route path="risk-factors" element={<PatientFactors />} />
          <Route path="3d-visualization" element={<PatientViz />} />
          <Route path="anatomy-tour" element={<AnatomyTour />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PatientProvider>
  )
}
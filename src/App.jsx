import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorDashboard from "./pages/DoctorDashboard";
import Dashboard from "./pages/Dashboard";
import Triage from "./pages/Triage";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Medication from "./pages/Medication";

export default function App() {
  return (
    <div className="bg-animate">
      <div className="orb blue"></div>
      <div className="orb cyan"></div>
      <div className="orb purple"></div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/triage" element={<Triage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/medication" element={<Medication />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
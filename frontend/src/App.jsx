import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layouts/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import FindDoctors from "./pages/FindDoctors";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import RegisterDoctor from "./pages/RegisterDoctor";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorCompleteProfile from "./pages/DoctorCompleteProfile";
import AdminDoctors from "./pages/AdminDoctors";  
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  return (
    <BrowserRouter>

      {/* Global Navbar */}
      <Navbar />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-doctor" element={<RegisterDoctor />} />
        <Route path="/find-doctors" element={<FindDoctors />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/book/:doctorId" element={<BookAppointment />} />
        <Route path="/doctor/complete-profile" element={<DoctorCompleteProfile />} />
        
        {/* Example Protected Route */}
        
        <Route path="/admin/doctors" element={
          <ProtectedRoute role="admin">
          <AdminDoctors />
          </ProtectedRoute>} />
        
        <Route path="/patient/dashboard" element={
          <ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />

        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="p-10 text-2xl">Dashboard (Protected)</div>
            </ProtectedRoute>
          }
        />

        <Route path="/doctor/dashboard" element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
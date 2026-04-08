import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import PredictionPage from './pages/PredictionPage'
import SignalPage from './pages/SignalPage'
import UpDownPage from "./pages/UpDownPage";
import AboutUs from './pages/AboutUs';
import ProjectDetails from './pages/ProjectDetails';
import SupportPage from './pages/SupportPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/prediction" element={
          <ProtectedRoute>
            <PredictionPage />
          </ProtectedRoute>
        } />
        <Route path="/signals" element={
          <ProtectedRoute>
            <SignalPage />
          </ProtectedRoute>
        } />
        <Route path="/updown" element={
          <ProtectedRoute>
            <UpDownPage />
          </ProtectedRoute>
        } />
        <Route path="/about" element={
          <ProtectedRoute>
            <AboutUs />
          </ProtectedRoute>
        } />
        <Route path="/project-details" element={
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        } />
        <Route path="/support" element={
          <ProtectedRoute>
            <SupportPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

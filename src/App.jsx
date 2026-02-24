import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Home from './pages/Home';
import Dashboard from './pages/dashboard';
import Profiles from './pages/Profile';
import Debate from './pages/Debate';

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  return isSignedIn ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profiles" element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
        <Route path="/debate" element={<ProtectedRoute><Debate /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
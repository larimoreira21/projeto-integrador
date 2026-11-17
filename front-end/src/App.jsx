import { useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { EngagementProvider } from './context/EngagementContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EngagementModal from './components/EngagementModal';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import PontosColeta from './pages/PontosColeta';
import Calculadora from './pages/Calculadora';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;
    const timer = window.setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [hash, pathname]);

  return null;
}

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <AdminDashboard />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <EngagementProvider>
          <BrowserRouter>
            <ScrollToHash />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/pontos-coleta" element={<PontosColeta />} />
                <Route path="/calculadora" element={<Calculadora />} />
                <Route path="/admin/login" element={<AdminLogin />} />
              </Route>
              <Route
                path="/admin"
                element={(
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                )}
              />
            </Routes>
            <EngagementModal />
          </BrowserRouter>
        </EngagementProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

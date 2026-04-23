import { Routes, Route, Navigate } from 'react-router'
import { BranchProvider } from './context/BranchContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import BranchSelector from './components/BranchSelector'
import CartSidebar from './components/CartSidebar'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Cuenta from './pages/Cuenta'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import { useAuth } from './hooks/useAuth'
import { useState, useEffect } from 'react'

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BranchProvider>
      <CartProvider>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
        <Navbar />
        <BranchSelector />
        <CartSidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>} />
          <Route path="/cuenta" element={<ProtectedRoute><Cuenta /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </BranchProvider>
  );
}

export default function App() {
  return <AppLayout />;
}

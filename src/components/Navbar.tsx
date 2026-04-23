import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ShoppingBag, MapPin, User, Menu, X, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useBranch } from '../context/BranchContext';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { totalItems } = useCart();
  const { selectedBranch, setShowSelector } = useBranch();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16"
      style={{
        background: 'rgba(245, 240, 232, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(212, 167, 167, 0.2)',
      }}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-white.png" alt="Chelato" className="h-8 w-auto" style={{ filter: 'brightness(0) invert(0.2)' }} />
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => setShowSelector(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-[#663a7c] hover:text-[#c67d6f] transition-colors">
            <MapPin size={16} />
            <span className="max-w-[140px] truncate">
              {selectedBranch ? selectedBranch.name : 'Elegir Sucursal'}
            </span>
          </button>
          <a href="/#catalogo" className="text-sm font-medium text-[#663a7c] hover:text-[#c67d6f] transition-colors">Catalogo</a>
          <a href="/#nosotros" className="text-sm font-medium text-[#663a7c] hover:text-[#c67d6f] transition-colors">Nosotros</a>
          <a href="/#sucursales" className="text-sm font-medium text-[#663a7c] hover:text-[#c67d6f] transition-colors">Sucursales</a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button onClick={() => {}} className="relative p-2 text-[#663a7c] hover:text-[#c67d6f] transition-colors">
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#c67d6f] text-white text-xs flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-[rgba(212,167,167,0.15)] transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#663a7c] flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <ChevronDown size={14} className="text-[#663a7c]" />
              </button>
              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 top-12 w-56 rounded-xl shadow-xl z-50 py-2"
                    style={{ background: '#f5f0e8', border: '1px solid rgba(212,167,167,0.3)' }}>
                    <div className="px-4 py-2 border-b border-[rgba(212,167,167,0.2)]">
                      <p className="text-sm font-semibold text-[#2c1810]">{user?.name}</p>
                      <p className="text-xs text-[#2c1810]/50">{user?.email}</p>
                    </div>
                    <button onClick={() => { navigate('/cuenta'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#2c1810] hover:bg-[rgba(212,167,167,0.15)] transition-colors text-left">
                      <User size={16} /> Mi Cuenta
                    </button>
                    {isAdmin && (
                      <button onClick={() => { navigate('/dashboard'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#2c1810] hover:bg-[rgba(212,167,167,0.15)] transition-colors text-left">
                        <Settings size={16} /> Panel Admin
                      </button>
                    )}
                    <button onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#c67d6f] hover:bg-[rgba(212,167,167,0.15)] transition-colors text-left">
                      <LogOut size={16} /> Cerrar Sesion
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium text-[#663a7c] hover:text-[#c67d6f] px-3 py-1.5">Ingresar</Link>
              <Link to="/login" className="text-sm font-medium text-white bg-[#663a7c] hover:bg-[#c67d6f] px-4 py-1.5 rounded-full transition-colors">Registrarse</Link>
            </div>
          )}

          <button className="md:hidden p-2 text-[#663a7c]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 py-4 px-4 shadow-lg"
          style={{ background: 'rgba(245, 240, 232, 0.98)', backdropFilter: 'blur(12px)' }}>
          <button onClick={() => { setShowSelector(true); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 w-full py-3 text-[#663a7c] font-medium">
            <MapPin size={18} /> {selectedBranch ? selectedBranch.name : 'Elegir Sucursal'}
          </button>
          <a href="/#catalogo" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[#663a7c] font-medium">Catalogo</a>
          <a href="/#nosotros" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[#663a7c] font-medium">Nosotros</a>
          <a href="/#sucursales" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[#663a7c] font-medium">Sucursales</a>
          {!isAuthenticated && (
            <div className="flex gap-3 mt-3 pt-3 border-t border-[rgba(212,167,167,0.3)]">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-[#663a7c] border border-[#663a7c] rounded-full font-medium">Ingresar</Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-white bg-[#663a7c] rounded-full font-medium">Registrarse</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

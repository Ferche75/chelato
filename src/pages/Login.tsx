import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronLeft, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegister) {
      if (form.password !== form.confirm) {
        setError('Las contrasenas no coinciden');
        setLoading(false);
        return;
      }
      const ok = register(form.name, form.email, form.password);
      if (!ok) {
        setError('Este email ya esta registrado');
        setLoading(false);
        return;
      }
      navigate('/');
      return;
    }

    const ok = login(form.email, form.password);
    if (!ok) {
      setError('Email o contrasena incorrectos');
      setLoading(false);
      return;
    }
    navigate('/');
  };

  const quickLogin = (email: string) => {
    setLoading(true);
    login(email, 'any');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #e8dcc8 0%, #d4a7a7 50%, #663a7c 100%)' }}>
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-6 transition-colors">
          <ChevronLeft size={16} /> Volver al inicio
        </Link>

        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: '#f5f0e8' }}>
          <div className="text-center mb-6">
            <img src="/logo-white.png" alt="Chelato" className="h-12 mx-auto mb-3" style={{ filter: 'brightness(0) invert(0.2)' }} />
            <h1 className="text-2xl font-bold text-[#663a7c] font-display">
              {isRegister ? 'Crear Cuenta' : 'Bienvenido'}
            </h1>
            <p className="text-sm text-[#2c1810]/50 mt-1">
              {isRegister ? 'Registrate para empezar a pedir' : 'Ingresa a tu cuenta'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-[#2c1810] mb-1">Nombre</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-[#d4a7a7] bg-white text-sm focus:outline-none focus:border-[#663a7c] focus:ring-2 focus:ring-[#663a7c]/10"
                  placeholder="Tu nombre" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#2c1810] mb-1">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#d4a7a7] bg-white text-sm focus:outline-none focus:border-[#663a7c] focus:ring-2 focus:ring-[#663a7c]/10"
                placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c1810] mb-1">Contrasena</label>
              <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#d4a7a7] bg-white text-sm focus:outline-none focus:border-[#663a7c] focus:ring-2 focus:ring-[#663a7c]/10"
                placeholder="********" />
            </div>
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-[#2c1810] mb-1">Confirmar contrasena</label>
                <input type="password" required value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-[#d4a7a7] bg-white text-sm focus:outline-none focus:border-[#663a7c] focus:ring-2 focus:ring-[#663a7c]/10"
                  placeholder="********" />
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-full bg-[#663a7c] text-white font-semibold text-sm hover:bg-[#c67d6f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? '...' : isRegister ? <><UserPlus size={16} /> Crear Cuenta</> : <><LogIn size={16} /> Ingresar</>}
            </button>
          </form>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#d4a7a7]/30" />
            <span className="text-xs text-[#2c1810]/30">acceso rapido</span>
            <div className="flex-1 h-px bg-[#d4a7a7]/30" />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            <button onClick={() => quickLogin('admin@chelato.com.uy')}
              className="py-2.5 rounded-full border border-[#c67d6f] text-[#c67d6f] text-xs font-semibold hover:bg-[#c67d6f] hover:text-white transition-colors">
              Demo Admin
            </button>
            <button onClick={() => quickLogin('juan@email.com')}
              className="py-2.5 rounded-full border border-[#663a7c] text-[#663a7c] text-xs font-semibold hover:bg-[#663a7c] hover:text-white transition-colors">
              Demo Cliente
            </button>
          </div>

          <p className="text-center text-sm text-[#2c1810]/40">
            {isRegister ? 'Ya tenes cuenta?' : 'No tenes cuenta?'}{' '}
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-[#663a7c] font-semibold hover:text-[#c67d6f] transition-colors">
              {isRegister ? 'Ingresa' : 'Registrate'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

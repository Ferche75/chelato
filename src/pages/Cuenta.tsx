import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, ShoppingBag, MapPin, Repeat } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

type Tab = 'orders' | 'profile';

export default function Cuenta() {
  const { user } = useAuth();
  const { addItem, setIsOpen } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  // Load orders from localStorage
  const orders = JSON.parse(localStorage.getItem('chelato_orders') || '[]');

  const handleRepeat = (order: { items: Array<{ formatLabel: string; unitPrice: number; flavors: string[]; quantity: number }> }) => {
    for (const item of order.items) {
      addItem({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        formatKey: 'repeat',
        formatLabel: item.formatLabel,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        flavors: item.flavors.map(f => ({ name: f, image: '' })),
        maxFlavors: item.flavors.length,
      });
    }
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4" style={{ background: '#f5f0e8' }}>
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-[#663a7c] hover:text-[#c67d6f] mb-4">
          <ChevronLeft size={16} /> Volver al inicio
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#663a7c] flex items-center justify-center text-white text-2xl font-bold font-display">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#2c1810] font-display">{user?.name}</h1>
            <p className="text-sm text-[#2c1810]/50">{user?.email}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8 border-b border-[rgba(212,167,167,0.3)] pb-4">
          <button onClick={() => setActiveTab('orders')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-[#663a7c] text-white' : 'text-[#663a7c] hover:bg-[rgba(212,167,167,0.15)]'}`}>
            Mis Pedidos
          </button>
          <button onClick={() => setActiveTab('profile')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-[#663a7c] text-white' : 'text-[#663a7c] hover:bg-[rgba(212,167,167,0.15)]'}`}>
            Mis Datos
          </button>
        </div>

        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[rgba(212,167,167,0.15)] flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={28} className="text-[#663a7c]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2c1810] mb-1">No tenes pedidos aun</h3>
                <p className="text-sm text-[#2c1810]/40 mb-4">Hace tu primer pedido</p>
                <Link to="/" className="inline-block px-6 py-2.5 rounded-full bg-[#663a7c] text-white text-sm font-medium hover:bg-[#c67d6f]">
                  Ver Catalogo
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: { id: number; customerName: string; total: number; items: Array<{ formatLabel: string; flavors: string[] }>; deliveryAddress: string; createdAt: string }) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-[#663a7c]">#{order.id}</span>
                        </div>
                        <p className="text-xs text-[#2c1810]/40 mb-2">
                          {new Date(order.createdAt).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <div className="space-y-1 mb-2">
                          {order.items.map((it: { formatLabel: string; flavors: string[] }, idx: number) => (
                            <p key={idx} className="text-sm text-[#2c1810]/70">
                              <span className="font-medium">{it.formatLabel}:</span> {it.flavors.join(', ')}
                            </p>
                          ))}
                        </div>
                        <p className="text-xs text-[#2c1810]/40 flex items-center gap-1">
                          <MapPin size={12} /> {order.deliveryAddress}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#c67d6f]">${order.total.toFixed(0)}</p>
                        <button onClick={() => handleRepeat(order)}
                          className="mt-2 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[rgba(212,167,167,0.15)] text-[#663a7c] hover:bg-[#663a7c] hover:text-white transition-colors">
                          <Repeat size={12} /> Repetir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
            <h3 className="text-lg font-bold text-[#2c1810] font-display mb-6">Mis Datos</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2c1810] mb-1">Nombre</label>
                <input defaultValue={user?.name || ''} readOnly
                  className="w-full px-4 py-3 rounded-xl border border-[#d4a7a7] bg-[#f5f0e8] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c1810] mb-1">Email</label>
                <input defaultValue={user?.email || ''} readOnly
                  className="w-full px-4 py-3 rounded-xl border border-[#d4a7a7] bg-[#f5f0e8] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c1810] mb-1">Telefono</label>
                <input placeholder="09XX XXX XXX"
                  className="w-full px-4 py-3 rounded-xl border border-[#d4a7a7] bg-white text-sm" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

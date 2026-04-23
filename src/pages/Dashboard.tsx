import { useState } from 'react';
import { Link } from 'react-router';
import { LayoutDashboard, IceCream, ClipboardList, MapPin, Package, ChevronLeft, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { trpc } from '@/providers/trpc';

type Tab = 'dashboard' | 'products' | 'orders' | 'branches';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  preparing: 'bg-blue-100 text-blue-700',
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};
const statusLabels: Record<string, string> = {
  pending: 'Pendiente', preparing: 'En preparacion', ready: 'Listo', delivered: 'Entregado', cancelled: 'Cancelado',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products, refetch: refetchProducts } = trpc.product.list.useQuery({});
  const { data: branches } = trpc.branch.list.useQuery();

  const toggleProduct = trpc.product.toggleAvailable.useMutation({
    onSuccess: () => refetchProducts(),
  });

  // Local orders
  const localOrders = JSON.parse(localStorage.getItem('chelato_orders') || '[]');

  const tabs = [
    { key: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'products' as Tab, label: 'Productos', icon: IceCream },
    { key: 'orders' as Tab, label: 'Pedidos', icon: ClipboardList },
    { key: 'branches' as Tab, label: 'Sucursales', icon: MapPin },
  ];

  const filteredProducts = products?.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex pt-16" style={{ background: '#f5f0e8' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden lg:block" style={{ background: '#663a7c' }}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 text-white mb-8">
            <ChevronLeft size={18} />
            <span className="text-sm font-medium">Volver al sitio</span>
          </Link>
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === tab.key
                    ? 'bg-[rgba(255,255,255,0.1)] text-white border-l-3 border-[#c67d6f]'
                    : 'text-[#d4a7a7] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                }`}>
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around py-2" style={{ background: '#663a7c' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs ${activeTab === tab.key ? 'text-white' : 'text-[#d4a7a7]'}`}>
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 pb-24 lg:pb-10 overflow-auto">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold text-[#663a7c] font-display mb-2">Dashboard</h1>
            <p className="text-sm text-[#2c1810]/50 mb-8">Bienvenido, {user?.name}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Pedidos Totales', value: localOrders.length, icon: ClipboardList },
                { label: 'Ingresos', value: `$${localOrders.reduce((s: number, o: { total: number }) => s + (o.total || 0), 0).toFixed(0)}`, icon: Package },
                { label: 'Productos Activos', value: products?.filter(p => p.isAvailable).length || 0, icon: IceCream },
                { label: 'Sucursales', value: branches?.length || 0, icon: MapPin },
              ].map(stat => (
                <div key={stat.label} className="p-6 rounded-xl bg-white shadow-sm">
                  <stat.icon size={20} className="text-[#c67d6f] mb-3" />
                  <p className="text-2xl font-bold text-[#663a7c] font-display">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wider text-[#2c1810]/40 font-semibold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-[#663a7c] font-display">Productos</h1>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2c1810]/30" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar..."
                  className="pl-9 pr-4 py-2 rounded-full border border-[#d4a7a7] bg-white text-sm focus:outline-none focus:border-[#663a7c] w-48" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-[#2c1810]/40 font-semibold bg-[rgba(212,167,167,0.08)]">
                      <th className="px-6 py-3">Producto</th>
                      <th className="px-6 py-3">Categoria</th>
                      <th className="px-6 py-3">Precio</th>
                      <th className="px-6 py-3">Disponible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts?.map(p => (
                      <tr key={p.id} className="border-t border-[rgba(212,167,167,0.1)]">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            {p.image && <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />}
                            <div>
                              <p className="text-sm font-semibold text-[#2c1810]">{p.name}</p>
                              <p className="text-xs text-[#2c1810]/40">{p.isPopsicle ? 'Paleta' : 'Helado'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm">{p.isPopsicle ? 'Paletas' : 'Helados'}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-[#c67d6f]">${parseFloat(p.basePrice).toFixed(0)}</td>
                        <td className="px-6 py-3">
                          <button onClick={() => toggleProduct.mutate({ id: p.id, isAvailable: !p.isAvailable })}>
                            {p.isAvailable ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-gray-300" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <h1 className="text-3xl font-bold text-[#663a7c] font-display mb-6">Pedidos</h1>
            {localOrders.length === 0 ? (
              <div className="text-center py-16 text-[#2c1810]/40">No hay pedidos registrados aun</div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-[#2c1810]/40 font-semibold bg-[rgba(212,167,167,0.08)]">
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Cliente</th>
                        <th className="px-6 py-3">Items</th>
                        <th className="px-6 py-3">Total</th>
                        <th className="px-6 py-3">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localOrders.map((o: { id: number; customerName: string; total: number; items: Array<{ formatLabel: string; flavors: string[] }>; createdAt: string }) => (
                        <tr key={o.id} className="border-t border-[rgba(212,167,167,0.1)]">
                          <td className="px-6 py-3 text-sm font-medium">#{o.id}</td>
                          <td className="px-6 py-3 text-sm">{o.customerName}</td>
                          <td className="px-6 py-3 text-sm text-[#2c1810]/60">
                            {o.items.map((it: { formatLabel: string; flavors: string[] }) => `${it.formatLabel}: ${it.flavors.join(', ')}`).join(' | ')}
                          </td>
                          <td className="px-6 py-3 text-sm font-bold text-[#c67d6f]">${o.total.toFixed(0)}</td>
                          <td className="px-6 py-3 text-sm text-[#2c1810]/50">
                            {new Date(o.createdAt).toLocaleDateString('es-UY')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BRANCHES */}
        {activeTab === 'branches' && (
          <div>
            <h1 className="text-3xl font-bold text-[#663a7c] font-display mb-6">Sucursales</h1>
            <div className="grid sm:grid-cols-2 gap-4">
              {branches?.map(b => {
                const hours = b.openingHours as Record<string, string>;
                return (
                  <div key={b.id} className="p-5 rounded-xl bg-white shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[rgba(102,58,124,0.1)] flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-[#663a7c]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2c1810]">{b.name}</h3>
                        <p className="text-xs text-[#2c1810]/50">{b.address}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-[#2c1810]/60">
                      {Object.entries(hours || {}).slice(0, 3).map(([day, time]) => (
                        <div key={day} className="flex justify-between"><span className="capitalize">{day}</span><span>{time}</span></div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

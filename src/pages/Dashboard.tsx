import { useState } from 'react';
import { Link } from 'react-router';
import { LayoutDashboard, IceCream, ClipboardList, MapPin, Package, ChevronLeft, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type Tab = 'dashboard' | 'products' | 'orders' | 'branches';

const MOCK_PRODUCTS = [
  { id: 1, name: "Dulce de Leche", image: "/flavors/dulce-de-leche.jpg", basePrice: "8.50", isAvailable: true, isPopsicle: false },
  { id: 2, name: "Chocolate", image: "/flavors/chocolate.jpg", basePrice: "8.50", isAvailable: true, isPopsicle: false },
  { id: 3, name: "Frutilla", image: "/flavors/frutilla.jpg", basePrice: "8.50", isAvailable: true, isPopsicle: false },
  { id: 4, name: "Vainilla", image: "/flavors/crema-americana.jpg", basePrice: "8.00", isAvailable: true, isPopsicle: false },
  { id: 5, name: "Menta Granizada", image: "/flavors/menta-granizada.jpg", basePrice: "9.00", isAvailable: true, isPopsicle: false },
  { id: 6, name: "Cookies & Cream", image: "/flavors/cookies-cream.jpg", basePrice: "9.50", isAvailable: true, isPopsicle: false },
  { id: 7, name: "Pistacho", image: "/flavors/pistacho.jpg", basePrice: "10.00", isAvailable: true, isPopsicle: false },
  { id: 8, name: "Café", image: "/flavors/cafe.jpg", basePrice: "9.00", isAvailable: true, isPopsicle: false },
  { id: 9, name: "Coco", image: "/flavors/coco.jpg", basePrice: "8.50", isAvailable: true, isPopsicle: false },
  { id: 10, name: "Banana Split", image: "/flavors/banana-split.jpg", basePrice: "9.50", isAvailable: true, isPopsicle: false },
  { id: 11, name: "Limón", image: "/flavors/limon.jpg", basePrice: "8.00", isAvailable: true, isPopsicle: false },
  { id: 12, name: "Maracuyá", image: "/flavors/maracuya.jpg", basePrice: "8.50", isAvailable: true, isPopsicle: false },
  { id: 13, name: "Chocolate Blanco", image: "/flavors/chocolate-blanco.jpg", basePrice: "9.50", isAvailable: true, isPopsicle: false },
  { id: 14, name: "Nocciola", image: "/flavors/nocciola.jpg", basePrice: "10.00", isAvailable: true, isPopsicle: false },
  { id: 15, name: "Tramontana", image: "/flavors/tramontana.jpg", basePrice: "9.00", isAvailable: true, isPopsicle: false },
  { id: 101, name: "Paleta Dulce de Leche", image: "/flavors/paleta-dulce-de-leche.jpg", basePrice: "5.50", isAvailable: true, isPopsicle: true },
  { id: 102, name: "Paleta Fresa", image: "/flavors/paleta-fresa.jpg", basePrice: "5.00", isAvailable: true, isPopsicle: true },
  { id: 103, name: "Paleta Limón", image: "/flavors/paleta-limon.jpg", basePrice: "5.00", isAvailable: true, isPopsicle: true },
  { id: 104, name: "Paleta Mango", image: "/flavors/paleta-mango.jpg", basePrice: "5.50", isAvailable: true, isPopsicle: true },
  { id: 105, name: "Paleta Oreo", image: "/flavors/paleta-oreo.jpg", basePrice: "6.00", isAvailable: true, isPopsicle: true },
];

const MOCK_BRANCHES = [
  { id: 1, name: "Chelato Miami Beach", address: "123 Ocean Drive, Miami Beach, FL 33139", phone: "+1 (305) 555-0123", openingHours: { lunes: "12:00 - 22:00", martes: "12:00 - 22:00", miercoles: "12:00 - 22:00", jueves: "12:00 - 23:00", viernes: "12:00 - 24:00", sabado: "11:00 - 24:00", domingo: "11:00 - 22:00" } },
  { id: 2, name: "Chelato Wynwood", address: "456 NW 27th St, Miami, FL 33127", phone: "+1 (305) 555-0456", openingHours: { lunes: "13:00 - 21:00", martes: "13:00 - 21:00", miercoles: "13:00 - 21:00", jueves: "13:00 - 22:00", viernes: "13:00 - 23:00", sabado: "12:00 - 23:00", domingo: "12:00 - 21:00" } },
  { id: 3, name: "Chelato Brickell", address: "789 Brickell Ave, Miami, FL 33131", phone: "+1 (305) 555-0789", openingHours: { lunes: "11:00 - 21:00", martes: "11:00 - 21:00", miercoles: "11:00 - 21:00", jueves: "11:00 - 22:00", viernes: "11:00 - 23:00", sabado: "10:00 - 23:00", domingo: "10:00 - 21:00" } },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const branches = MOCK_BRANCHES;
  const localOrders = JSON.parse(localStorage.getItem('chelato_orders') || '[]');

  const tabs = [
    { key: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'products' as Tab, label: 'Productos', icon: IceCream },
    { key: 'orders' as Tab, label: 'Pedidos', icon: ClipboardList },
    { key: 'branches' as Tab, label: 'Sucursales', icon: MapPin },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProduct = (id: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
  };

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
                { label: 'Productos Activos', value: products.filter(p => p.isAvailable).length, icon: IceCream },
                { label: 'Sucursales', value: branches.length, icon: MapPin },
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
                    {filteredProducts.map(p => (
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
                        <td className="px-6 py-3 text-sm font-semibold text-[#c67d6f]">${parseFloat(p.basePrice).toFixed(2)}</td>
                        <td className="px-6 py-3">
                          <button onClick={() => toggleProduct(p.id)}>
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
                      {localOrders.map((o: any) => (
                        <tr key={o.id} className="border-t border-[rgba(212,167,167,0.1)]">
                          <td className="px-6 py-3 text-sm font-medium">#{o.id}</td>
                          <td className="px-6 py-3 text-sm">{o.customerName}</td>
                          <td className="px-6 py-3 text-sm text-[#2c1810]/60">
                            {o.items.map((it: any) => `${it.formatLabel}: ${it.flavors.join(', ')}`).join(' | ')}
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
              {branches.map(b => {
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
import { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Phone, ChevronDown, Instagram, Facebook, MessageCircle, Plus, Minus, X, ShoppingBag, Check } from 'lucide-react';
import { useBranch } from '../context/BranchContext';
import { useCart } from '../context/CartContext';
import type { CartFlavor } from '../context/CartContext';

const FORMATS = [
  { key: '1/4kg', label: '1/4 kg', desc: '2 gustos', price: 8.50, maxFlavors: 2, icon: 'cup' },
  { key: '1/2kg', label: '1/2 kg', desc: '3 gustos', price: 14.00, maxFlavors: 3, icon: 'cup' },
  { key: '1kg', label: '1 kg', desc: '4 gustos', price: 24.00, maxFlavors: 4, icon: 'cup' },
  { key: 'cono', label: 'Cono', desc: '2 gustos', price: 5.50, maxFlavors: 2, icon: 'cone' },
  { key: 'vaso', label: 'Vaso', desc: '2 gustos', price: 6.00, maxFlavors: 2, icon: 'cup' },
];

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

export default function Home() {
  const { selectedBranch, setShowSelector } = useBranch();
  const { addItem, setIsOpen } = useCart();
  const [heroLoaded, setHeroLoaded] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<typeof FORMATS[0] | null>(null);
  const [pickedFlavors, setPickedFlavors] = useState<CartFlavor[]>([]);
  const [qty, setQty] = useState(1);

  const catalogRef = useRef<HTMLDivElement>(null);
  const locationsRef = useRef<HTMLDivElement>(null);

  const products = MOCK_PRODUCTS;
  const allBranches = MOCK_BRANCHES;
  const isLoading = false;

  useEffect(() => { setHeroLoaded(true); }, []);

  const helados = products.filter(p => !p.isPopsicle);
  const paletas = products.filter(p => p.isPopsicle);

  const openFlavorPicker = (format: typeof FORMATS[0]) => {
    setSelectedFormat(format);
    setPickedFlavors([]);
    setQty(1);
    setPickerOpen(true);
  };

  const toggleFlavor = (name: string, image: string) => {
    if (!selectedFormat) return;
    setPickedFlavors(prev => {
      const exists = prev.find(f => f.name === name);
      if (exists) return prev.filter(f => f.name !== name);
      if (prev.length >= selectedFormat.maxFlavors) return prev;
      return [...prev, { name, image }];
    });
  };

  const addToCart = () => {
    if (!selectedFormat || pickedFlavors.length === 0) return;
    addItem({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      formatKey: selectedFormat.key,
      formatLabel: selectedFormat.label,
      unitPrice: selectedFormat.price,
      quantity: qty,
      flavors: pickedFlavors,
      maxFlavors: selectedFormat.maxFlavors,
    });
    setPickerOpen(false);
    setIsOpen(true);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ background: '#f5f0e8' }}>
      {/* HERO */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        <video autoPlay muted loop playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          poster="/flavors/dulce-de-leche.jpg">
          <source src="/hero-gelato.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(245, 240, 232, 0.15) 0%, rgba(245, 240, 232, 0.7) 70%, #f5f0e8 100%)'
        }} />
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto" style={{ transform: 'translateY(-10%)' }}>
          <p className={`text-sm uppercase tracking-[0.2em] text-[#c67d6f] font-semibold mb-4 transition-all duration-800 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '0.3s' }}>Helado Artesanal</p>
          <h1 className={`text-5xl md:text-7xl font-bold text-[#663a7c] font-display leading-[0.95] mb-6 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ textShadow: '0 2px 40px rgba(245, 240, 232, 0.5)', transitionDelay: '0.5s' }}>
            Hecho con alma,<br />servido con amor
          </h1>
          <p className={`text-lg text-[#2c1810] mb-8 transition-all duration-800 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '0.8s' }}>
            Descubri los sabores de Chelato en tu sucursal mas cercana
          </p>
          <button onClick={() => selectedBranch ? scrollTo(catalogRef) : setShowSelector(true)}
            className={`px-10 py-4 rounded-full bg-[#663a7c] text-white font-semibold text-base hover:bg-[#c67d6f] hover:scale-105 transition-all duration-400 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '1s' }}>
            {selectedBranch ? 'Hacer Pedido' : 'Elegir Sucursal'}
          </button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <ChevronDown size={28} className="text-[#663a7c] opacity-50" />
        </div>
      </section>

      {/* CATALOGO */}
      <section id="catalogo" ref={catalogRef} className="py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.12em] text-[#c67d6f] font-semibold mb-2">Hace tu pedido</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#663a7c] font-display mb-4">Elegi tu Formato</h2>
            {selectedBranch ? (
              <p className="text-sm text-[#2c1810]/50 flex items-center justify-center gap-1">
                <MapPin size={14} /> Sucursal: <span className="font-semibold text-[#663a7c]">{selectedBranch.name}</span>
              </p>
            ) : (
              <button onClick={() => setShowSelector(true)}
                className="px-6 py-2 rounded-full bg-[#663a7c] text-white text-sm font-medium hover:bg-[#c67d6f] transition-colors mt-2">
                Seleccionar Sucursal
              </button>
            )}
          </div>

          {!selectedBranch ? (
            <div className="text-center py-16 text-[#2c1810]/40">
              Selecciona una sucursal para ver los productos disponibles
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#663a7c] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-16">
                {FORMATS.map(fmt => (
                  <button key={fmt.key} onClick={() => openFlavorPicker(fmt)}
                    className="group relative p-6 rounded-2xl text-center transition-all hover:-translate-y-1.5 hover:shadow-xl"
                    style={{ background: '#f5f0e8', boxShadow: '0 4px 24px rgba(44,24,16,0.06)', border: '1px solid rgba(212,167,167,0.2)' }}>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(212,167,167,0.15)] flex items-center justify-center group-hover:bg-[rgba(102,58,124,0.1)] transition-colors">
                      {fmt.icon === 'cone' ? (
                        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" stroke="#663a7c" strokeWidth="2">
                          <path d="M16 8 L24 40 L32 8" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 8 Q24 0 36 8" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" stroke="#663a7c" strokeWidth="2">
                          <path d="M14 20 Q14 8 24 8 Q34 8 34 20 L32 36 Q32 40 24 40 Q16 40 16 36 Z" strokeLinecap="round"/>
                          <ellipse cx="24" cy="20" rx="10" ry="6" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#2c1810] mb-1">{fmt.label}</h3>
                    <p className="text-xs text-[#2c1810]/50 mb-3">{fmt.desc}</p>
                    <p className="text-xl font-bold text-[#c67d6f]">${fmt.price.toFixed(2)}</p>
                    <div className="mt-4 px-4 py-2 rounded-full bg-[#663a7c] text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Elegir Gustos
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#663a7c] font-display text-center mb-8">Nuestras Paletas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                  {paletas.map(p => (
                    <div key={p.id} className="group rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
                      style={{ background: '#f5f0e8', boxShadow: '0 4px 24px rgba(44,24,16,0.06)' }}>
                      <div className="relative h-48 overflow-hidden bg-gradient-to-b from-[rgba(212,167,167,0.15)] to-transparent">
                        {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" />}
                      </div>
                      <div className="p-4">
                        <h4 className="font-display font-bold text-[#2c1810] text-sm mb-1">{p.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#c67d6f]">${parseFloat(p.basePrice).toFixed(2)}</span>
                          <button onClick={() => {
                            addItem({
                              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                              formatKey: 'paleta',
                              formatLabel: p.name,
                              unitPrice: parseFloat(p.basePrice),
                              quantity: 1,
                              flavors: [{ name: p.name, image: p.image || '' }],
                              maxFlavors: 1,
                            });
                            setIsOpen(true);
                          }}
                            className="px-3 py-1.5 rounded-full bg-[#663a7c] text-white text-xs font-semibold hover:bg-[#c67d6f] transition-colors">
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FLAVOR PICKER MODAL */}
      {pickerOpen && selectedFormat && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[rgba(44,24,16,0.6)] backdrop-blur-sm" onClick={() => setPickerOpen(false)} />
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-scale-in"
            style={{ background: '#f5f0e8' }}>
            <div className="flex items-center justify-between p-5 border-b border-[rgba(212,167,167,0.2)]">
              <div>
                <h3 className="text-xl font-bold text-[#663a7c] font-display">
                  {selectedFormat.label} — Elegi tus gustos
                </h3>
                <p className="text-xs text-[#2c1810]/50 mt-0.5">
                  Selecciona hasta {selectedFormat.maxFlavors} {selectedFormat.maxFlavors === 1 ? 'gusto' : 'gustos'} (${selectedFormat.price.toFixed(2)})
                </p>
              </div>
              <button onClick={() => setPickerOpen(false)} className="p-1 text-[#2c1810]/40 hover:text-[#2c1810]">
                <X size={20} />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-[rgba(212,167,167,0.15)] flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#2c1810]/50 uppercase tracking-wider">Tus gustos:</span>
              {pickedFlavors.length === 0 ? (
                <span className="text-xs text-[#2c1810]/30">Ninguno seleccionado</span>
              ) : (
                pickedFlavors.map(f => (
                  <span key={f.name} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#663a7c] text-white text-xs font-medium">
                    {f.name}
                    <button onClick={() => toggleFlavor(f.name, f.image)} className="hover:text-[#c67d6f]"><X size={12} /></button>
                  </span>
                ))
              )}
              <span className="ml-auto text-xs text-[#c67d6f] font-semibold">
                {pickedFlavors.length}/{selectedFormat.maxFlavors}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {helados.map(h => (
                  <button key={h.id}
                    onClick={() => toggleFlavor(h.name, h.image || '')}
                    className={`relative rounded-xl overflow-hidden transition-all ${
                      pickedFlavors.find(f => f.name === h.name)
                        ? 'ring-2 ring-[#663a7c] ring-offset-2 scale-[0.97]'
                        : pickedFlavors.length >= selectedFormat.maxFlavors
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:scale-[1.02] hover:shadow-md'
                    }`}
                    disabled={pickedFlavors.length >= selectedFormat.maxFlavors && !pickedFlavors.find(f => f.name === h.name)}>
                    <div className="aspect-square bg-gradient-to-b from-[rgba(212,167,167,0.15)] to-transparent">
                      {h.image && <img src={h.image} alt={h.name} className="w-full h-full object-contain p-2" />}
                    </div>
                    <div className="p-2 text-center">
                      <p className="text-xs font-semibold text-[#2c1810] truncate">{h.name}</p>
                    </div>
                    {pickedFlavors.find(f => f.name === h.name) && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#663a7c] flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-[rgba(212,167,167,0.2)] flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-full border border-[#d4a7a7] flex items-center justify-center text-[#663a7c]">
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-full border border-[#d4a7a7] flex items-center justify-center text-[#663a7c]">
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs text-[#2c1810]/50">Total</p>
                <p className="text-xl font-bold text-[#c67d6f]">${(selectedFormat.price * qty).toFixed(2)}</p>
              </div>
              <button onClick={addToCart}
                disabled={pickedFlavors.length === 0}
                className={`px-8 py-3 rounded-full font-semibold text-sm transition-all ${
                  pickedFlavors.length > 0
                    ? 'bg-[#663a7c] text-white hover:bg-[#c67d6f]'
                    : 'bg-[rgba(212,167,167,0.3)] text-[#2c1810]/30 cursor-not-allowed'
                }`}>
                <ShoppingBag size={16} className="inline mr-2" />
                Agregar al Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT */}
      <section id="nosotros" className="py-20 md:py-28 px-4 md:px-8" style={{ background: '#f5f0e8' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[#c67d6f] font-semibold mb-3">Desde 2019</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#663a7c] font-display mb-6 leading-tight">
              La Historia<br />de Chelato
            </h2>
            <p className="text-[#2c1810]/70 leading-relaxed mb-8">
              Lo que empezo como un sueno entre amigos se convirtio en la heladeria favorita de Miami.
              Cada sabor cuenta una historia, cada paleta lleva una sonrisa. Usamos ingredientes frescos,
              recetas tradicionales y mucho amor para crear helados que hacen feliz a cualquier dia.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[{ number: '3', label: 'Sucursales' }, { number: '20+', label: 'Sabores' }, { number: '50K+', label: 'Sonrisas' }].map(s => (
                <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-bold text-[#c67d6f] font-display">{s.number}</p>
                  <p className="text-xs uppercase tracking-wider text-[#2c1810]/50 font-semibold mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <img src="/about-shop.jpg" alt="Chelato" className="w-full h-[400px] md:h-[500px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(102,58,124,0.3)] to-transparent" />
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="sucursales" ref={locationsRef}
        className="py-20 md:py-28 px-4 md:px-8"
        style={{ background: 'linear-gradient(135deg, #d4a7a7 0%, #e8dcc8 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#663a7c] font-display mb-3">Encontra tu Chelato</h2>
            <p className="text-[#2c1810]/60">3 sucursales en Miami para que nunca te falte helado</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {allBranches.map(b => {
              const hours = b.openingHours as Record<string, string>;
              const today = new Date().toLocaleDateString('es-UY', { weekday: 'long' }).toLowerCase();
              return (
                <div key={b.id} className="p-5 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: 'rgba(245,240,232,0.8)', backdropFilter: 'blur(8px)' }}>
                  <h3 className="font-display text-xl font-bold text-[#663a7c] mb-2">{b.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-[#2c1810]/70">
                      <MapPin size={14} className="flex-shrink-0 mt-0.5 text-[#663a7c]" />
                      <span>{b.address}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#2c1810]/60">
                      <Clock size={14} className="flex-shrink-0 mt-0.5 text-[#663a7c]" />
                      <span className="text-xs">{hours?.[today] || 'Consultar'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#663a7c' }} className="text-[#d4a7a7]">
        <div className="py-16 px-4 md:px-8 border-b border-[rgba(212,167,167,0.2)]">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white font-display mb-3">Sumate a la familia Chelato</h3>
            <p className="text-sm text-[#d4a7a7]/70 mb-6">Recibi promociones exclusivas y novedades de nuevos sabores.</p>
            <div className="flex gap-2">
              <input placeholder="Tu email"
                className="flex-1 px-5 py-3 rounded-full text-sm bg-[rgba(245,240,232,0.15)] border border-[#d4a7a7]/30 text-white placeholder:text-[#d4a7a7]/50 focus:outline-none focus:border-[#d4a7a7]" />
              <button className="px-6 py-3 rounded-full bg-[#c67d6f] text-white text-sm font-semibold hover:bg-[#d4a7a7] hover:text-[#663a7c] transition-colors">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
        <div className="py-10 px-4 md:px-8">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <img src="/logo-white.png" alt="Chelato" className="h-10 w-auto mb-3 opacity-80" />
              <p className="text-sm text-[#d4a7a7]/60">Helado artesanal hecho con alma.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Productos</h4>
              <ul className="space-y-2 text-sm text-[#d4a7a7]/70">
                <li><a href="#catalogo" className="hover:text-white transition-colors">Helados</a></li>
                <li><a href="#catalogo" className="hover:text-white transition-colors">Paletas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Sucursales</h4>
              <ul className="space-y-2 text-sm text-[#d4a7a7]/70">
                {allBranches.slice(0, 5).map(b => <li key={b.id}><span className="hover:text-white transition-colors cursor-pointer">{b.name}</span></li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Contacto</h4>
              <p className="text-sm text-[#d4a7a7]/70 mb-3">hola@chelato.com</p>
              <div className="flex gap-3">
                <Instagram size={20} className="hover:text-white transition-colors cursor-pointer" />
                <Facebook size={20} className="hover:text-white transition-colors cursor-pointer" />
                <MessageCircle size={20} className="hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        <div className="py-4 px-4 text-center border-t border-[rgba(212,167,167,0.1)]">
          <p className="text-xs text-[#d4a7a7]/40"> 2025 Chelato. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

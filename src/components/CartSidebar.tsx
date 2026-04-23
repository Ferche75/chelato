import { useState } from 'react';
import { X, Plus, Minus, Trash2, MapPin, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useBranch } from '../context/BranchContext';
import { useAuth } from '../hooks/useAuth';

type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'success';

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, subtotal, total, isOpen, setIsOpen, clearCart, deliveryFee } = useCart();
  const { selectedBranch } = useBranch();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mercadopago'>('cash');
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setStep('delivery');
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = () => {
    // Mock order creation
    setOrderId(Math.random().toString(36).slice(2, 8).toUpperCase());
    // Save to local order history
    const order = {
      id: Date.now(),
      items: items.map(item => ({
        formatLabel: item.formatLabel,
        flavors: item.flavors.map(f => f.name),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      total,
      customerName: formData.name,
      deliveryAddress: formData.address,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const prev = JSON.parse(localStorage.getItem('chelato_orders') || '[]');
    localStorage.setItem('chelato_orders', JSON.stringify([order, ...prev]));
    setStep('success');
    clearCart();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[55] bg-[rgba(44,24,16,0.4)]" onClick={() => setIsOpen(false)} />
      <div className="fixed top-0 right-0 bottom-0 z-[56] w-full max-w-md animate-slide-in-right flex flex-col"
        style={{ background: '#f5f0e8', borderLeft: '1px solid #d4a7a7' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(212,167,167,0.2)]">
          <div>
            <h2 className="text-lg font-bold text-[#663a7c] font-display">
              {step === 'cart' && 'Tu Pedido'}
              {step === 'delivery' && 'Datos de Entrega'}
              {step === 'payment' && 'Metodo de Pago'}
              {step === 'success' && 'Pedido Confirmado'}
            </h2>
            {selectedBranch && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-[#663a7c]" />
                <span className="text-xs text-[#663a7c] font-medium">{selectedBranch.name}</span>
              </div>
            )}
          </div>
          <button onClick={() => { setIsOpen(false); setStep('cart'); }} className="p-1 text-[#2c1810]/40 hover:text-[#2c1810]">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* CART ITEMS */}
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-20 h-20 rounded-full bg-[rgba(212,167,167,0.15)] flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-[#663a7c]" />
                  </div>
                  <p className="text-[#2c1810]/40 font-medium">Tu carrito esta vacio</p>
                  <p className="text-sm text-[#2c1810]/30 mt-1">Elegi un formato y tus gustos favoritos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="p-4 rounded-xl bg-white/60">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-[#2c1810] text-sm">{item.formatLabel}</p>
                          <p className="text-xs text-[#c67d6f] font-medium">${item.unitPrice} c/u</p>
                        </div>
                        <p className="text-lg font-bold text-[#c67d6f]">${(item.unitPrice * item.quantity).toFixed(0)}</p>
                      </div>
                      {/* Flavors */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.flavors.map(f => (
                          <span key={f.name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(102,58,124,0.08)] text-[#663a7c] text-xs font-medium">
                            {f.image && <img src={f.image} alt="" className="w-4 h-4 rounded-full object-cover" />}
                            {f.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-[#d4a7a7] flex items-center justify-center text-[#663a7c] hover:bg-[rgba(212,167,167,0.2)]">
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-[#d4a7a7] flex items-center justify-center text-[#663a7c] hover:bg-[rgba(212,167,167,0.2)]">
                            <Plus size={12} />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)}
                          className="p-1 text-[#2c1810]/30 hover:text-[#c67d6f] transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* DELIVERY */}
          {step === 'delivery' && (
            <form onSubmit={handleDeliverySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2c1810] mb-1">Nombre completo</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-[#d4a7a7] bg-white text-sm focus:outline-none focus:border-[#663a7c] focus:ring-2 focus:ring-[#663a7c]/10"
                  placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c1810] mb-1">Telefono</label>
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-[#d4a7a7] bg-white text-sm focus:outline-none focus:border-[#663a7c] focus:ring-2 focus:ring-[#663a7c]/10"
                  placeholder="09XX XXX XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c1810] mb-1">Direccion</label>
                <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-[#d4a7a7] bg-white text-sm focus:outline-none focus:border-[#663a7c] focus:ring-2 focus:ring-[#663a7c]/10"
                  placeholder="Calle, numero, apartamento" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c1810] mb-1">Notas (opcional)</label>
                <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-[#d4a7a7] bg-white text-sm focus:outline-none focus:border-[#663a7c] focus:ring-2 focus:ring-[#663a7c]/10 resize-none h-20"
                  placeholder="Instrucciones especiales..." />
              </div>
              <button type="submit" className="w-full py-3 rounded-full bg-[#663a7c] text-white font-semibold text-sm hover:bg-[#c67d6f] transition-colors">
                Continuar
              </button>
            </form>
          )}

          {/* PAYMENT */}
          {step === 'payment' && (
            <div className="space-y-4">
              <p className="text-sm text-[#2c1810]/60 mb-3">Selecciona como queres pagar:</p>
              {[
                { value: 'cash' as const, label: 'Efectivo', desc: 'Paga al recibir tu pedido' },
                { value: 'card' as const, label: 'Tarjeta de credito/debito', desc: 'Pago seguro con tarjeta' },
                { value: 'mercadopago' as const, label: 'Mercado Pago', desc: 'Paga con tu cuenta de MP' },
              ].map(method => (
                <button key={method.value} onClick={() => setPaymentMethod(method.value)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === method.value ? 'border-[#663a7c] bg-[rgba(102,58,124,0.05)]' : 'border-transparent bg-white/60 hover:bg-white'
                  }`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.value ? 'border-[#663a7c] bg-[#663a7c]' : 'border-[#d4a7a7]'
                  }`}>
                    {paymentMethod === method.value && <Check size={12} className="text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2c1810]">{method.label}</p>
                    <p className="text-xs text-[#2c1810]/50">{method.desc}</p>
                  </div>
                </button>
              ))}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 bg-white/60 rounded-xl">
                  <input placeholder="Numero de tarjeta" className="w-full px-3 py-2 rounded-lg border border-[#d4a7a7] bg-white text-sm" />
                  <div className="flex gap-3">
                    <input placeholder="MM/AA" className="flex-1 px-3 py-2 rounded-lg border border-[#d4a7a7] bg-white text-sm" />
                    <input placeholder="CVV" className="w-24 px-3 py-2 rounded-lg border border-[#d4a7a7] bg-white text-sm" />
                  </div>
                </div>
              )}
              <button onClick={handlePayment}
                className="w-full py-3 rounded-full bg-[#663a7c] text-white font-semibold text-sm hover:bg-[#c67d6f] transition-colors">
                Confirmar Pedido — ${total.toFixed(0)}
              </button>
            </div>
          )}

          {/* SUCCESS */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="100" strokeDashoffset="0"
                    style={{ animation: 'drawCheck 0.6s ease-out forwards' }} />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#663a7c] font-display mb-2">Pedido Confirmado!</h3>
              <p className="text-sm text-[#2c1810]/60 mb-1">Pedido #{orderId}</p>
              <p className="text-sm text-[#2c1810]/40 mb-6">Te contactaremos para confirmar la entrega</p>
              <button onClick={() => { setIsOpen(false); setStep('cart'); }}
                className="px-8 py-3 rounded-full bg-[#663a7c] text-white font-semibold text-sm hover:bg-[#c67d6f] transition-colors">
                Volver al Catalogo
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'cart' && items.length > 0 && (
          <div className="p-4 border-t border-[rgba(212,167,167,0.2)] space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#2c1810]/60">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-[#2c1810]/60">
                <span>Envio</span>
                <span>${deliveryFee.toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#663a7c] text-base pt-1 border-t border-[rgba(212,167,167,0.2)]">
                <span>Total</span>
                <span>${total.toFixed(0)}</span>
              </div>
            </div>
            <button onClick={handleCheckout}
              className="w-full py-3 rounded-full bg-[#663a7c] text-white font-semibold text-sm hover:bg-[#c67d6f] transition-colors">
              Ir a pagar
            </button>
          </div>
        )}
      </div>
    </>
  );
}

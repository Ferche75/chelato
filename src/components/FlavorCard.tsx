import { useState, useCallback } from 'react';
import { Plus, Minus, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface FlavorCardProps {
  product: {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    basePrice: string;
    priceHalfKg: string | null;
    priceOneKg: string | null;
    priceCone: string | null;
    priceCup: string | null;
    isPopsicle: boolean;
    maxFlavors: number;
    tags: unknown;
    branchAvailable: boolean | null;
  };
}

const sizeOptions = [
  { key: '1/4kg', label: '1/4 kg', priceKey: 'basePrice' as const },
  { key: '1/2kg', label: '1/2 kg', priceKey: 'priceHalfKg' as const },
  { key: '1kg', label: '1 kg', priceKey: 'priceOneKg' as const },
  { key: 'cono', label: 'Cono', priceKey: 'priceCone' as const },
  { key: 'vaso', label: 'Vaso', priceKey: 'priceCup' as const },
];

export default function FlavorCard({ product }: FlavorCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [added, setAdded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const getPrice = useCallback(() => {
    const price = selectedSize.priceKey === 'basePrice'
      ? product.basePrice
      : product[selectedSize.priceKey];
    return price ? parseFloat(price) : parseFloat(product.basePrice);
  }, [selectedSize, product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    setTilt({ x: y, y: x });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleAdd = () => {
    if (product.image) {
      addItem({
        productId: product.id,
        name: product.name,
        image: product.image,
        size: selectedSize.key,
        quantity,
        unitPrice: getPrice(),
        isPopsicle: product.isPopsicle,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    }
  };

  const availableSizes = sizeOptions.filter(s => {
    if (s.priceKey === 'basePrice') return true;
    return product[s.priceKey] !== null;
  });

  const tags = (product.tags as string[]) || [];

  return (
    <div
      className="group w-full rounded-2xl overflow-hidden transition-all duration-400"
      style={{
        background: '#f5f0e8',
        boxShadow: '0 4px 24px rgba(44, 24, 16, 0.06)',
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-b from-[rgba(212,167,167,0.15)] to-transparent">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {product.isPopsicle && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#c67d6f] text-white">
            Paleta
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5 pt-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-lg font-bold text-[#2c1810] leading-tight">{product.name}</h3>
          <span className="text-lg font-bold text-[#c67d6f] flex-shrink-0">${getPrice().toFixed(0)}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-[#2c1810]/50 font-medium">{(4.5 + Math.random() * 0.5).toFixed(1)}</span>
          </div>
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-[#d4a7a7] text-[#663a7c]">
              {tag}
            </span>
          ))}
        </div>

        {/* Size selector */}
        {!product.isPopsicle && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {availableSizes.map(size => (
              <button
                key={size.key}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedSize.key === size.key
                    ? 'bg-[#663a7c] text-white'
                    : 'bg-[rgba(212,167,167,0.15)] text-[#663a7c] hover:bg-[rgba(212,167,167,0.3)]'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        )}

        {/* Quantity + Add */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-[#d4a7a7] flex items-center justify-center text-[#663a7c] hover:bg-[rgba(212,167,167,0.2)] transition-colors">
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full border border-[#d4a7a7] flex items-center justify-center text-[#663a7c] hover:bg-[rgba(212,167,167,0.2)] transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className={`flex-1 py-2.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              added
                ? 'bg-green-500 text-white scale-105'
                : 'bg-[#663a7c] text-white hover:bg-[#c67d6f]'
            }`}
            style={{ transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
          >
            <ShoppingBag size={14} />
            {added ? 'Agregado!' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface CartFlavor {
  name: string;
  image: string;
}

export interface CartItem {
  id: string;
  formatKey: string;
  formatLabel: string;
  unitPrice: number;
  quantity: number;
  flavors: CartFlavor[];
  maxFlavors: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  deliveryFee: number;
  total: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
  isOpen: false,
  setIsOpen: () => {},
  deliveryFee: 50,
  total: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("chelato_cart_v2");
    return stored ? JSON.parse(stored) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const deliveryFee = 50;

  const persist = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("chelato_cart_v2", JSON.stringify(newItems));
  }, []);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const newItems = [...prev, item];
      localStorage.setItem("chelato_cart_v2", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.id !== id);
      localStorage.setItem("chelato_cart_v2", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => {
      const newItems = prev.map(i => i.id === id ? { ...i, quantity } : i);
      localStorage.setItem("chelato_cart_v2", JSON.stringify(newItems));
      return newItems;
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("chelato_cart_v2");
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, subtotal, isOpen, setIsOpen, deliveryFee, total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

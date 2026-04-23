import { createTRPCReact } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

// Mock data - Heladería Chelato Miami
const MOCK_BRANCHES = [
  {
    id: 1,
    name: "Chelato Miami Beach",
    address: "123 Ocean Drive, Miami Beach, FL 33139",
    phone: "+1 (305) 555-0123",
    openingHours: {
      lunes: "12:00 - 22:00",
      martes: "12:00 - 22:00",
      miercoles: "12:00 - 22:00",
      jueves: "12:00 - 23:00",
      viernes: "12:00 - 24:00",
      sabado: "11:00 - 24:00",
      domingo: "11:00 - 22:00",
    },
  },
  {
    id: 2,
    name: "Chelato Wynwood",
    address: "456 NW 27th St, Miami, FL 33127",
    phone: "+1 (305) 555-0456",
    openingHours: {
      lunes: "13:00 - 21:00",
      martes: "13:00 - 21:00",
      miercoles: "13:00 - 21:00",
      jueves: "13:00 - 22:00",
      viernes: "13:00 - 23:00",
      sabado: "12:00 - 23:00",
      domingo: "12:00 - 21:00",
    },
  },
  {
    id: 3,
    name: "Chelato Brickell",
    address: "789 Brickell Ave, Miami, FL 33131",
    phone: "+1 (305) 555-0789",
    openingHours: {
      lunes: "11:00 - 21:00",
      martes: "11:00 - 21:00",
      miercoles: "11:00 - 21:00",
      jueves: "11:00 - 22:00",
      viernes: "11:00 - 23:00",
      sabado: "10:00 - 23:00",
      domingo: "10:00 - 21:00",
    },
  },
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

// Create mock tRPC with proper proxy
export const trpc = createTRPCReact<any>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity, refetchOnWindowFocus: false },
  },
});

// Create proxy that returns mock hooks
const createMockProxy = () => {
  return new Proxy({} as any, {
    get: (_target, prop: string) => {
      if (prop === 'useQuery') {
        return (input: any, options: any) => ({
          data: input?.branchId ? MOCK_PRODUCTS : MOCK_BRANCHES,
          isLoading: false,
          isError: false,
          error: null,
          refetch: () => Promise.resolve({ data: MOCK_PRODUCTS }),
        });
      }
      if (prop === 'useMutation') {
        return (options: any) => ({
          mutate: () => { if (options?.onSuccess) options.onSuccess(); },
          mutateAsync: async () => true,
          isLoading: false,
          isError: false,
          error: null,
        });
      }
      return createMockProxy();
    },
  });
};

const mockClient = createMockProxy();

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={mockClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
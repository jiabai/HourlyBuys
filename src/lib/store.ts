"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, HistoryEntry, CalculationResult, UserProfile } from '@/lib/types';
import { Leaf, Wheat, Droplet, Beef, Egg, Milk, ShoppingBasket } from 'lucide-react';
import type { PriceSanityCheckOutput } from '@/ai/flows/price-sanity-check';

const getDefaultProducts = (): Product[] => [
  { id: 'rice', name: 'Rice', unit: 'CNY/jin', price: 2.5, icon: Leaf },
  { id: 'flour', name: 'Flour', unit: 'CNY/jin', price: 3.0, icon: Wheat },
  { id: 'cooking-oil', name: 'Cooking Oil', unit: 'CNY/liter', price: 8.0, icon: Droplet },
  { id: 'pork', name: 'Pork', unit: 'CNY/jin', price: 15.0, icon: Beef },
  { id: 'eggs', name: 'Eggs', unit: 'CNY/jin', price: 5.0, icon: Egg },
  { id: 'milk', name: 'Milk', unit: 'CNY/bottle', price: 6.0, icon: Milk },
];

const defaultUserProfile: UserProfile = {
  username: 'Guest User',
  email: 'guest@example.com',
  bio: 'Loves to calculate purchasing power!',
  avatarUrl: 'https://placehold.co/128x128.png',
};

interface AppState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, 'id' | 'isCustom' | 'icon'>) => void;
  updateProductPrice: (id: string, price: number) => void;
  removeProduct: (id: string) => void;
  hourlyWage: number | null;
  setHourlyWage: (wage: number | null) => void;
  history: HistoryEntry[];
  addHistoryEntry: (entryData: { hourlyWage: number; products: Product[], results: CalculationResult[], sanityCheckAnomalies?: PriceSanityCheckOutput['anomalousPrices'] }) => void;
  clearHistory: () => void;
  deleteHistoryEntry: (id: string) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  resetApp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      products: getDefaultProducts(),
      setProducts: (products) => set({ products }),
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: crypto.randomUUID(),
          isCustom: true,
          icon: ShoppingBasket, 
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },
      updateProductPrice: (id, price) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, price } : p)),
        })),
      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      hourlyWage: null,
      setHourlyWage: (wage) => set({ hourlyWage: wage }),
      history: [],
      addHistoryEntry: (entryData) => {
        const newEntry: HistoryEntry = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          ...entryData,
        };
        set((state) => ({ history: [newEntry, ...state.history] }));
      },
      clearHistory: () => set({ history: [] }),
      deleteHistoryEntry: (id) =>
        set((state) => ({
          history: state.history.filter((entry) => entry.id !== id),
        })),
      userProfile: defaultUserProfile,
      setUserProfile: (profileUpdate) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profileUpdate },
        })),
      resetApp: () => {
        set({ products: getDefaultProducts(), hourlyWage: null, userProfile: defaultUserProfile });
      }
    }),
    {
      name: 'hourlybuys-storage', 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => {
        // Exclude products from persistence due to non-serializable icon components
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { products, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: (state) => {
        return (hydratedState, error) => {
          if (error) {
            console.error("Failed to rehydrate state from storage:", error);
          }
          if (hydratedState) {
             // Ensure userProfile is initialized if not in storage
            if (!hydratedState.userProfile) {
              hydratedState.userProfile = defaultUserProfile;
            }
          }
        }
      }
    }
  )
);

// Rehydrate default products and icons on load
// This runs after zustand's own rehydration
useAppStore.subscribe(
  (state, prevState) => {
    if (prevState.products.length === 0 && state.products.length === 0) { // Only on initial load if products are empty
      const defaultProductsWithIcons = getDefaultProducts();
       useAppStore.setState({ products: defaultProductsWithIcons });
    } else {
      // For existing products, ensure icons are correctly mapped if they were somehow lost or not set
      const defaultMap = new Map(getDefaultProducts().map(p => [p.id, p.icon]));
      const needsIconUpdate = state.products.some(p => 
        (!p.isCustom && defaultMap.has(p.id) && typeof p.icon !== 'function') || 
        (p.isCustom && typeof p.icon !== 'function')
      );

      if (needsIconUpdate) {
        useAppStore.setState(s => ({
          products: s.products.map(p => {
            if (!p.isCustom && defaultMap.has(p.id) && typeof p.icon !== 'function') {
              return { ...p, icon: defaultMap.get(p.id) };
            }
            if (p.isCustom && typeof p.icon !== 'function') {
              return { ...p, icon: ShoppingBasket }; // Default for custom
            }
            return p;
          })
        }));
      }
    }
  }
);

// Initialize userProfile if it's not properly set after hydration
const initialUserProfile = useAppStore.getState().userProfile;
if (!initialUserProfile || Object.keys(initialUserProfile).length === 0) {
  useAppStore.setState({ userProfile: defaultUserProfile });
}

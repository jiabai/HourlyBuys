
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
  location: string | null;
  setLocation: (location: string | null) => void;
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
      location: null,
      setLocation: (location) => set({ location }),
      history: [],
      addHistoryEntry: (entryData) => {
        const newEntry: HistoryEntry = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          location: get().location, // Include location
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
        set({ products: getDefaultProducts(), hourlyWage: null, location: null, userProfile: defaultUserProfile });
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
      onRehydrateStorage: () => { // This function now returns the inner callback directly
        return (hydratedState, error) => {
          if (error) {
            console.error("Failed to rehydrate state from storage:", error);
          }
          if (hydratedState) {
             // Ensure userProfile is initialized if not in storage
            if (!hydratedState.userProfile) {
              hydratedState.userProfile = defaultUserProfile;
            }
             // Ensure location is initialized if not in storage or is undefined
            if (hydratedState.location === undefined) { // Check for undefined specifically
              hydratedState.location = null;
            }
          }
        }
      }
    }
  )
);

// The problematic subscribe block and standalone initializers have been removed.
// products are initialized via getDefaultProducts() and are not persisted, so they are always fresh.
// userProfile and location are handled by onRehydrateStorage for defaults if missing from persisted state.

import type { PriceSanityCheckOutput } from '@/ai/flows/price-sanity-check';

export interface Product {
  id: string;
  name: string;
  unit: string;
  price: number;
  isCustom?: boolean;
  icon?: React.ElementType;
}

export interface CalculationResult extends Product {
  quantityPurchasable: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  hourlyWage: number;
  products: Product[];
  results: CalculationResult[];
  sanityCheckAnomalies?: PriceSanityCheckOutput['anomalousPrices'];
  location?: string | null; // Added location
}

export interface UserProfile {
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
}

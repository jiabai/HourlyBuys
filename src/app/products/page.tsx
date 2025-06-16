
"use client";

import React from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { ProductList } from "@/components/products/ProductList";
import { useAppStore } from "@/lib/store";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { priceSanityCheck, PriceSanityCheckInput, PriceSanityCheckOutput } from '@/ai/flows/price-sanity-check';
import { PriceSanityCheckAlert } from '@/components/products/PriceSanityCheckAlert';

export default function ProductManagementPage() {
  const { products, addProduct, updateProductPrice } = useAppStore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSanityCheckLoading, setIsSanityCheckLoading] = React.useState(false);
  const [sanityCheckAnomalies, setSanityCheckAnomalies] = React.useState<PriceSanityCheckOutput['anomalousPrices'] | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);


  const handleAddProduct = (data: { name: string; unit: string; price: number }) => {
    addProduct(data);
    toast({
      title: "Product Added",
      description: `${data.name} has been added to your list.`,
    });
  };
  
  const handleUpdatePriceFromAlert = (productName: string, newPrice: number) => {
    const productToUpdate = products.find(p => p.name === productName);
    if (productToUpdate) {
      updateProductPrice(productToUpdate.id, newPrice);
      toast({
        title: "Price Updated",
        description: `Price for ${productName} updated to ¥${newPrice.toFixed(2)}.`,
      });
      // Optionally, re-run sanity check or update the displayed anomalies
      const updatedAnomalies = sanityCheckAnomalies?.filter(a => a.productName !== productName) || null;
      setSanityCheckAnomalies(updatedAnomalies);
      if (updatedAnomalies && updatedAnomalies.length === 0) {
        setIsAlertOpen(false); // Close alert if all anomalies resolved
      }
    }
  };


  const handleNextStep = async () => {
    if (products.length === 0) {
      toast({
        title: "No Products",
        description: "Please add at least one product to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsSanityCheckLoading(true);
    try {
      const sanityCheckInput: PriceSanityCheckInput = {
        products: products.map(p => ({
          productName: p.name,
          unit: p.unit,
          currentPrice: p.price,
        }))
      };
      const result = await priceSanityCheck(sanityCheckInput);
      if (result.anomalousPrices && result.anomalousPrices.length > 0) {
        setSanityCheckAnomalies(result.anomalousPrices);
        setIsAlertOpen(true);
      } else {
        // No anomalies, proceed directly
        router.push("/salary");
      }
    } catch (error) {
      console.error("Price sanity check failed:", error);
      toast({
        title: "Error",
        description: "Failed to perform price sanity check. Proceeding without it.",
        variant: "destructive",
      });
      router.push("/salary"); // Proceed even if AI fails, with a message
    } finally {
      setIsSanityCheckLoading(false);
    }
  };

  const proceedToSalaryPage = () => {
    setIsAlertOpen(false);
    router.push("/salary");
  };


  return (
    <AppLayout title="Select and Set Product Prices">
      <div className="space-y-6">
        <div className="flex justify-end">
          <ProductFormDialog onAddProduct={handleAddProduct} />
        </div>
        
        <ProductList />

        <div className="flex justify-between items-center mt-8 pt-4 border-t">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
            </Link>
          </Button>
          <Button onClick={handleNextStep} disabled={isSanityCheckLoading}>
            {isSanityCheckLoading ? "Checking Prices..." : "Next Step → Calculate Salary"}
            {!isSanityCheckLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
      {sanityCheckAnomalies && sanityCheckAnomalies.length > 0 && (
        <PriceSanityCheckAlert
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          anomalies={sanityCheckAnomalies}
          onProceed={proceedToSalaryPage}
          onUpdatePrice={handleUpdatePriceFromAlert}
        />
      )}
    </AppLayout>
  );
}

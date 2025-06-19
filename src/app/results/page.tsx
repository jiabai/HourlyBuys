
"use client";

import React from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import type { CalculationResult, Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import { ArrowLeft, RefreshCcw, Download, Share2, History, TrendingUp, BadgeJapaneseYen } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchasingPowerChart } from "@/components/results/PurchasingPowerChart";
import Link from "next/link";

export default function ResultsPage() {
  const { products, hourlyWage, addHistoryEntry, resetApp, location } = useAppStore();
  const router = useRouter();
  const { toast } = useToast();
  const [results, setResults] = React.useState<CalculationResult[]>([]);
  const chartRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (hourlyWage === null || products.length === 0) {
      toast({
        title: "Missing Data",
        description: "Hourly wage or product list is not set. Please complete previous steps.",
        variant: "destructive",
      });
      if (hourlyWage === null) router.push('/salary');
      else router.push('/products');
      return;
    }

    const calculatedResults = products.map((product) => ({
      ...product,
      quantityPurchasable: product.price > 0 ? hourlyWage / product.price : Infinity,
    }));
    setResults(calculatedResults);
    
    const { sanityCheckAnomalies: currentSanityCheckAnomalies } = useAppStore.getState().history[0] || {};
    addHistoryEntry({ hourlyWage, products, results: calculatedResults, sanityCheckAnomalies: currentSanityCheckAnomalies });

  }, [hourlyWage, products, addHistoryEntry, router, toast, location]);

  const bestValueProduct = React.useMemo(() => {
    if (!results || results.length === 0) return null;
    
    const purchasableProducts = results.filter(r => isFinite(r.quantityPurchasable) && r.quantityPurchasable > 0);
    
    if (purchasableProducts.length === 0) {
      const freeProducts = results.filter(r => r.price === 0);
      if (freeProducts.length > 0) return freeProducts[0]; 
      return results.length > 0 ? results[0] : null; 
    }
    
    return purchasableProducts.reduce((best, current) => 
        current.quantityPurchasable > best.quantityPurchasable ? current : best
    , purchasableProducts[0]);
  }, [results]);


    
  const handleSaveAsImage = async () => {
    if (!chartRef.current) {
      toast({
        title: "Save Failed",
        description: "Could not find chart element. Please try again later.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // Show loading status
      toast({
        title: "Generating Image...",
        description: "Please wait while we prepare your chart image.",
      });
  
      // Capture chart with html2canvas
      const canvas = await html2canvas(chartRef.current, {
        scale: window.devicePixelRatio, // Improve image quality
        useCORS: true,
        logging: false
      });
  
      // Create download link
      const imageUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `Purchasing-Power-Analysis_${new Date().toLocaleDateString()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast({
        title: "Image Saved",
        description: "Chart has been successfully saved to your device.",
      });
    } catch (error) {
      console.error("Image save failed:", error);
      toast({
        title: "Save Failed",
        description: "An error occurred while generating the image. Please try again.",
        variant: "destructive",
      });
    }
  };


  const handleShare = async () => {
     if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Purchasing Power - HourlyBuys',
          text: `With an hourly wage of ¥${hourlyWage?.toFixed(2)}, I can buy: ${results.slice(0,3).map(r => 
            `${r.name} × ${isFinite(r.quantityPurchasable) ? r.quantityPurchasable.toFixed(1) : 'Many'} ${r.unit.split('/')[1] || ''}`
          ).join(', ')}... Check out HourlyBuys!`,
          url: window.location.href,
        });
        toast({ title: "Shared!", description: "Results shared successfully." });
      } catch (error) {
        console.error('Error sharing:', error);
        let description = "Could not share results. Please try again or copy the page URL.";
        if (error instanceof Error) {
          if (error.message.toLowerCase().includes('permission denied')) {
            description = "Sharing permission was denied. This might be due to browser/environment settings. You can try copying the page URL manually.";
          } else if (error.name === 'AbortError') {
            description = "Sharing was cancelled by you.";
          }
        }
        toast({ title: "Share Failed", description, variant: "destructive" });
      }
    } else {
      toast({ title: "Share Not Supported", description: "Web Share API is not supported in your browser. Try copying the page URL." });
    }
  };

  const handleResetAndStartOver = () => {
    resetApp();
    router.push('/salary'); 
    toast({ title: "Application Reset", description: "You can start a new calculation now."});
  }

  return (
    <AppLayout> 
      <div className="purple-pink-gradient text-primary-foreground p-4 md:p-6 rounded-lg shadow-md mb-6 text-center">
        <h1 className="text-xl md:text-3xl font-bold flex items-center justify-center">
          <BadgeJapaneseYen className="mr-2 h-6 w-6" />
          Your Purchasing Power Analysis
        </h1>
        {hourlyWage !== null && (
          <p className="text-sm md:text-lg mt-1">
            Based on your hourly wage of <strong className="font-semibold">¥{hourlyWage.toFixed(2)}</strong>/hour
            {location && ` in ${location}`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="md:col-span-2">
          <PurchasingPowerChart data={results} chartRef={chartRef} />
        </div>
        <div className="md:col-span-1">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Quick Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 rounded-md flex justify-between items-center" style={{ backgroundColor: 'hsl(var(--quick-summary-hourly-wage-bg))' }}>
                <span className="text-card-foreground/80">Hourly Wage:</span>
                <strong className="text-card-foreground">¥{hourlyWage?.toFixed(2) || 'N/A'}</strong>
              </div>
              {location && (
                <div className="p-3 rounded-md flex justify-between items-center" style={{ backgroundColor: 'hsl(var(--quick-summary-industry-bg))' }}>
                  <span className="text-card-foreground/80">Location:</span>
                  <span className="font-medium" style={{color: "hsl(var(--chart-3))"}}>{location}</span>
                </div>
              )}
              <div className="p-3 rounded-md flex justify-between items-center" style={{ backgroundColor: 'hsl(var(--quick-summary-products-bg))' }}>
                <span className="text-card-foreground/80">Products Analyzed:</span>
                <strong className="text-card-foreground">{products.length} items</strong>
              </div>
              {bestValueProduct && (
                <div className="p-3 rounded-md" style={{ backgroundColor: 'hsl(var(--quick-summary-best-value-bg))' }}>
                  <p className="font-semibold mb-1 text-sm" style={{color: 'hsl(25 80% 50%)'}}>
                    <TrendingUp className="inline-block mr-1.5 h-4 w-4 md:h-5 md:w-5" />Best Value:
                  </p>
                  <p className="text-card-foreground/90 text-xs md:text-sm">
                    You can buy {isFinite(bestValueProduct.quantityPurchasable) ? bestValueProduct.quantityPurchasable.toFixed(1) : 'an abundance of'} {bestValueProduct.unit.split('/')[1] || bestValueProduct.name.toLowerCase()} of <span className="font-medium">{bestValueProduct.name}</span>.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-md mb-6">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Detailed Breakdown</CardTitle>
          <CardDescription>What one hour of your work can buy.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2 md:p-4">Product Name</TableHead>
                  <TableHead className="p-2 md:p-4">Unit</TableHead>
                  <TableHead className="text-right p-2 md:p-4">Current Price</TableHead>
                  <TableHead className="text-right p-2 md:p-4">Quantity You Can Buy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <TableRow 
                      key={item.id} 
                      className={index % 2 !== 0 ? 'bg-[hsl(var(--table-row-alt-bg))]' : ''}
                    >
                      <TableCell className="font-medium p-2 md:p-4">
                        <div className="flex items-center gap-2">
                          {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                          <span>{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-2 md:p-4">{item.unit}</TableCell>
                      <TableCell className="text-right p-2 md:p-4">¥{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold text-primary p-2 md:p-4">
                        {isFinite(item.quantityPurchasable) 
                          ? `${item.quantityPurchasable.toFixed(2)} ${item.unit.split('/')[1] || ''}` 
                          : (item.price === 0 ? '∞ (Free!)' : 'N/A')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Button variant="outline" asChild className="w-full">
            <Link href="/products">
              <ArrowLeft /> Re-set Prices
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/salary">
              <RefreshCcw /> Recalculate
            </Link>
          </Button>
          <Button variant="outline" onClick={handleSaveAsImage} className="w-full">
            <Download /> Save as Image
          </Button>
          <Button variant="outline" onClick={handleShare} className="w-full">
            <Share2 /> Share Results
          </Button>
        </CardContent>
        <CardFooter className="border-t pt-4 mt-4 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
           <Button variant="secondary" className="w-full sm:w-auto" asChild>
            <Link href="/history">
              <History /> View History
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleResetAndStartOver}  className="w-full sm:w-auto">
            <RefreshCcw /> Reset & Start Over
          </Button>
        </CardFooter>
      </Card>
    </AppLayout>
  );
}

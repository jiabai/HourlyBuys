
"use client";

import React from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import type { CalculationResult, Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RefreshCcw, Download, Share2, History } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchasingPowerChart } from "@/components/results/PurchasingPowerChart";
import Link from "next/link";
// import html2canvas from 'html2canvas'; // Would be needed for "Save as Image"

export default function ResultsPage() {
  const { products, hourlyWage, addHistoryEntry, resetApp } = useAppStore();
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
    
    // Save to history automatically when results are calculated
    // For sanityCheckAnomalies, this would ideally be passed from the products page or stored temporarily.
    // For this version, we'll omit it from history for simplicity if not readily available here.
    addHistoryEntry({ hourlyWage, products, results: calculatedResults });

  }, [hourlyWage, products, addHistoryEntry, router, toast]);

  const handleSaveAsImage = async () => {
    toast({
      title: "Feature In Development",
      description: "'Save as Image' functionality will be implemented soon using a library like html2canvas.",
    });
    // if (chartRef.current) {
    //   try {
    //     const canvas = await html2canvas(chartRef.current, { backgroundColor: getComputedStyle(document.body).getPropertyValue('--background').trim() || '#ffffff' });
    //     const image = canvas.toDataURL("image/png");
    //     const link = document.createElement('a');
    //     link.href = image;
    //     link.download = 'purchasing-power-chart.png';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     toast({ title: "Image Saved!", description: "Chart saved as PNG."});
    //   } catch (error) {
    //     console.error("Error saving image:", error);
    //     toast({ title: "Error", description: "Could not save image.", variant: "destructive" });
    //   }
    // }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Purchasing Power',
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
    router.push('/');
    toast({ title: "Application Reset", description: "You can start a new calculation now."});
  }


  return (
    <AppLayout title="Your Purchasing Power Analysis">
      {hourlyWage !== null && (
         <p className="text-lg text-center mb-6 p-3 bg-primary/10 rounded-md text-primary-foreground/80">
           Based on your current hourly wage of <strong className="font-bold text-primary-foreground">¥{hourlyWage.toFixed(2)}</strong>
         </p>
      )}

      <div className="space-y-8">
        <PurchasingPowerChart data={results} chartRef={chartRef} />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Detailed Data</CardTitle>
            <CardDescription>Here's what one hour of your work can buy.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Current Price</TableHead>
                    <TableHead className="text-right">Can Buy Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-right">¥{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {isFinite(item.quantityPurchasable) ? `${item.quantityPurchasable.toFixed(2)} ${item.unit.split('/')[1] || ''}` : '∞ (Free!)'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" /> Re-set Prices
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/salary">
                <RefreshCcw className="mr-2 h-4 w-4" /> Recalculate Wage
              </Link>
            </Button>
            <Button variant="outline" onClick={handleSaveAsImage}>
              <Download className="mr-2 h-4 w-4" /> Save as Image
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" /> Share Results
            </Button>
          </CardContent>
          <CardFooter className="border-t pt-4 mt-4 flex flex-col sm:flex-row justify-center gap-4">
             <Button variant="secondary" className="w-full sm:w-auto" asChild>
              <Link href="/history">
                <History className="mr-2 h-4 w-4" /> View History
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleResetAndStartOver}  className="w-full sm:w-auto">
              <RefreshCcw className="mr-2 h-4 w-4" /> Reset & Start Over
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}


"use client";

import React from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalaryInputPage() {
  const { hourlyWage, setHourlyWage, products } = useAppStore();
  const [inputValue, setInputValue] = React.useState<string>(hourlyWage?.toString() || "");
  const [confirmedWage, setConfirmedWage] = React.useState<number | null>(hourlyWage);
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (products.length === 0) {
      toast({
        title: "No Products",
        description: "Product list is empty. Please add products first.",
        variant: "destructive",
      });
      router.push('/products');
    }
  }, [products, router, toast]);

  const handleConfirmWage = () => {
    const wage = parseFloat(inputValue);
    if (isNaN(wage) || wage <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid positive number for your hourly wage.",
        variant: "destructive",
      });
      return;
    }
    setHourlyWage(wage);
    setConfirmedWage(wage);
    toast({
      title: "Wage Confirmed",
      description: `Your hourly wage is set to ¥${wage.toFixed(2)}/hour.`,
      className: "bg-green-50 border-green-200 text-green-700", // A more positive toast
    });
  };

  const handleNextStep = () => {
    if (confirmedWage === null) {
      toast({
        title: "Wage Not Confirmed",
        description: "Please enter and confirm your hourly wage first.",
        variant: "destructive",
      });
      return;
    }
    router.push("/results");
  };

  return (
    <AppLayout title="Input Salary Information">
      <div className="max-w-lg mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Enter Your Hourly Wage</CardTitle>
            <CardDescription>
              Provide your after-tax hourly wage in CNY.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hourly-wage" className="text-base">After-Tax Hourly Wage (CNY)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="hourly-wage"
                  type="number"
                  placeholder="e.g., 50"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setConfirmedWage(null); // Reset confirmed wage on input change
                  }}
                  className="text-lg h-12"
                  min="0"
                  step="0.01"
                />
                <Button onClick={handleConfirmWage} className="h-12 px-6 text-base bg-primary hover:bg-primary/90">
                  Confirm
                </Button>
              </div>
            </div>

            {confirmedWage !== null && (
              <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg text-center text-accent-foreground shadow">
                <CheckCircle className="inline-block mr-2 h-6 w-6 text-accent" />
                <span className="text-lg font-medium">
                  Your after-tax hourly wage is: <strong className="text-xl">¥{confirmedWage.toFixed(2)}/hour</strong>
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between mt-4 pt-4 border-t">
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
              </Link>
            </Button>
            <Button onClick={handleNextStep} disabled={confirmedWage === null} className="bg-accent hover:bg-accent/90">
              Next Step → View Results
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}

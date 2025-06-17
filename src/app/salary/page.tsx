
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
import { ArrowLeft, ArrowRight, CheckCircle, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalaryInputPage() {
  const { hourlyWage, setHourlyWage, products, location, setLocation } = useAppStore();
  const [wageInputValue, setWageInputValue] = React.useState<string>(hourlyWage?.toString() || "");
  const [locationInputValue, setLocationInputValue] = React.useState<string>(location || "");

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

  const handleWageInputBlur = () => {
    const wage = parseFloat(wageInputValue);
    if (isNaN(wage) || wage <= 0) {
      if (wageInputValue !== "") { // Only show error if user typed something invalid
        toast({
          title: "Invalid Wage",
          description: "Please enter a valid positive number for your hourly wage.",
          variant: "destructive",
        });
      }
      if (hourlyWage !== null) { // If there was a valid wage, but user cleared or put invalid, reset it in store
        setHourlyWage(null);
      }
      return;
    }
    // Only update and show toast if value changed and is valid
    if (wage !== hourlyWage) {
      setHourlyWage(wage);
      toast({
        title: "Wage Updated",
        description: `Your hourly wage is set to ¥${wage.toFixed(2)}/hour.`,
        className: "bg-green-50 border-green-200 text-green-700",
      });
    }
  };
  
  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocationInputValue(newLocation);
    setLocation(newLocation.trim() === "" ? null : newLocation.trim());
  };


  const handleNextStep = () => {
    if (hourlyWage === null || hourlyWage <= 0) {
      toast({
        title: "Wage Not Set",
        description: "Please enter a valid hourly wage first.",
        variant: "destructive",
      });
      return;
    }
    router.push("/results");
  };

  return (
    <AppLayout title="Input Salary & Location">
      <div className="max-w-lg mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
            <CardDescription>
              Provide your after-tax hourly wage in CNY and your current location.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hourly-wage" className="text-base">After-Tax Hourly Wage (CNY)</Label>
              <Input
                id="hourly-wage"
                type="number"
                placeholder="e.g., 50"
                value={wageInputValue}
                onChange={(e) => setWageInputValue(e.target.value)}
                onBlur={handleWageInputBlur}
                className="text-lg h-12"
                min="0.01"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-base">Location (e.g., City, Region)</Label>
              <div className="flex items-center gap-2">
                 <MapPin className="h-5 w-5 text-muted-foreground" />
                 <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Shanghai"
                  value={locationInputValue}
                  onChange={handleLocationInputChange}
                  className="text-lg h-12"
                />
              </div>
            </div>

            {hourlyWage !== null && hourlyWage > 0 && (
              <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg text-center text-accent-foreground shadow">
                <CheckCircle className="inline-block mr-2 h-6 w-6 text-accent" />
                <span className="text-lg font-medium">
                  Hourly wage: <strong className="text-xl">¥{hourlyWage.toFixed(2)}/hour</strong>
                </span>
                {location && (
                   <span className="block text-sm mt-1">
                     Location: <strong className="text-base">{location}</strong>
                   </span>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between mt-4 pt-4 border-t">
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
              </Link>
            </Button>
            <Button 
              onClick={handleNextStep} 
              disabled={hourlyWage === null || hourlyWage <= 0} 
              className="bg-accent hover:bg-accent/90"
            >
              Next Step → View Results
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}


"use client";

import React from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckCircle, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalaryInputPage() {
  const { hourlyWage, setHourlyWage, location, setLocation } = useAppStore();
  const [wageInputValue, setWageInputValue] = React.useState<string>(hourlyWage?.toString() || "");
  const [locationInputValue, setLocationInputValue] = React.useState<string>(location || "");

  const router = useRouter();
  const { toast } = useToast();

  const handleWageInputBlur = () => {
    const wage = parseFloat(wageInputValue);
    if (isNaN(wage) || wage <= 0) {
      if (wageInputValue !== "") { 
        toast({
          title: "Invalid Wage",
          description: "Please enter a valid positive number for your hourly wage.",
          variant: "destructive",
        });
      }
      if (hourlyWage !== null) { 
        setHourlyWage(null);
      }
      return;
    }
    if (wage !== hourlyWage) {
      setHourlyWage(wage);
      toast({
        title: "Wage Updated",
        description: `Your hourly wage is set to ¥${wage.toFixed(2)}/hour.`,
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
    router.push("/results"); // Changed from /products to /results
  };

  return (
    <AppLayout title="Input Salary & Location">
      <div className="w-full max-w-lg mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Enter Your Details</CardTitle>
            <CardDescription>
              Do you know how many necessities can one hour of your work buy?
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
              <div className="p-3 md:p-4 bg-accent/10 border border-accent/30 rounded-lg text-center text-accent-foreground shadow">
                <CheckCircle className="inline-block mr-2 h-5 md:h-6 w-5 md:w-6 text-accent" />
                <span className="text-md md:text-lg font-medium">
                  Hourly wage: <strong className="text-lg md:text-xl">¥{hourlyWage.toFixed(2)}/hour</strong>
                </span>
                {location && (
                   <span className="block text-sm mt-1">
                     Location: <strong className="text-base">{location}</strong>
                   </span>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end mt-4 pt-4 border-t">
            <Button 
              onClick={handleNextStep} 
              disabled={hourlyWage === null || hourlyWage <= 0} 
              className="bg-accent hover:bg-accent/90 w-full sm:w-auto text-base"
              size="lg"
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

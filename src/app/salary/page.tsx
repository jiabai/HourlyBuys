
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckCircle, Coins, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from '@/components/layout/AppLayout';

export default function SalaryInputPage() {
  const { hourlyWage, setHourlyWage, location, setLocation } = useAppStore();
  const [wageInputValue, setWageInputValue] = React.useState<string>(hourlyWage?.toString() || "");
  const [locationInputValue, setLocationInputValue] = React.useState<string>(location || "");
  const [showManualLocationInput, setShowManualLocationInput] = React.useState<boolean>(!!location);

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
    router.push("/results");
  };

  const handleAutoLocation = () => {
    toast({
      title: "Feature in development",
      description: "Automatic location detection will be available soon.",
    });
    // Placeholder: In a real app, you'd use navigator.geolocation here
    // For now, let's just show the manual input if it was hidden.
    if (!showManualLocationInput) {
      setShowManualLocationInput(true);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center pt-8 md:pt-12 pb-8 w-full max-w-md mx-auto">
        {/* Custom Logo and Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full purple-pink-gradient shadow-md">
            <Coins className="w-8 h-8 md:w-10 md:h-10 text-white opacity-90 transform -translate-x-1 -translate-y-1" />
            <Coins className="w-8 h-8 md:w-10 md:h-10 text-white opacity-70 transform translate-x-1 translate-y-1 absolute" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            你的购买力
          </h1>
        </div>
        <p className="text-sm md:text-base text-muted-foreground mb-8 text-center px-4">
          你知道你一个小时的工作能换多少生活必需品吗?
        </p>

        <Card className="w-full shadow-xl">
          <CardContent className="pt-6 space-y-6">
            <div>
              <Label htmlFor="location-info" className="text-sm font-medium text-muted-foreground">地域信息</Label>
              <Button
                variant="outline"
                className="w-full mt-2 bg-muted/50 hover:bg-muted/70 text-foreground justify-start"
                onClick={handleAutoLocation}
              >
                <MapPin className="mr-2 h-4 w-4" />
                自动获取当前位置
              </Button>
              {!showManualLocationInput && (
                <Button
                  variant="link"
                  className="text-sm mt-2 p-0 h-auto text-primary"
                  onClick={() => setShowManualLocationInput(true)}
                >
                  手动输入位置信息
                </Button>
              )}
              {showManualLocationInput && (
                <div className="mt-3 space-y-1">
                   <Label htmlFor="manual-location" className="text-xs text-muted-foreground pl-1">手动输入位置:</Label>
                   <Input
                    id="manual-location"
                    type="text"
                    placeholder="例如: 上海 (e.g., Shanghai)"
                    value={locationInputValue}
                    onChange={handleLocationInputChange}
                    className="text-base h-11"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly-wage" className="text-sm font-medium text-muted-foreground">
                税后时薪 (单位: 元)
              </Label>
              <Input
                id="hourly-wage"
                type="number"
                placeholder="500"
                value={wageInputValue}
                onChange={(e) => setWageInputValue(e.target.value)}
                onBlur={handleWageInputBlur}
                className="text-base h-12"
                min="0.01"
                step="0.01"
              />
            </div>

            {hourlyWage !== null && hourlyWage > 0 && (
              <div 
                className="p-3 md:p-4 rounded-lg text-center shadow-sm"
                style={{ backgroundColor: 'hsl(var(--quick-summary-hourly-wage-bg))' }} 
              >
                <span className="text-sm md:text-base font-medium" style={{color: 'hsl(145 50% 40%)'}}>
                  您的税后时薪为: <strong className="text-base md:text-lg">¥{hourlyWage.toFixed(2)}/小时</strong>
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end mt-2 pt-4 pb-6">
            <Button
              onClick={handleNextStep}
              disabled={hourlyWage === null || hourlyWage <= 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-base text-white"
              size="lg"
            >
              下一步 → 查看购买力 →
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}

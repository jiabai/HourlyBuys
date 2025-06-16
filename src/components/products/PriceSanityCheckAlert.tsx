"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { PriceSanityCheckOutput } from '@/ai/flows/price-sanity-check';
import { Lightbulb, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button"; // Added import

interface PriceSanityCheckAlertProps {
  isOpen: boolean;
  onClose: () => void;
  anomalies: PriceSanityCheckOutput['anomalousPrices'];
  onProceed: () => void;
  onUpdatePrice: (productName: string, newPrice: number) => void;
}

export function PriceSanityCheckAlert({
  isOpen,
  onClose,
  anomalies,
  onProceed,
  onUpdatePrice,
}: PriceSanityCheckAlertProps) {
  if (!anomalies || anomalies.length === 0) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <TriangleAlert className="mr-2 h-6 w-6 text-yellow-500" />
            Price Sanity Check
          </AlertDialogTitle>
          <AlertDialogDescription>
            Our AI has found some prices that might be unusual. Please review them.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="max-h-[60vh] overflow-y-auto space-y-4 p-1">
          {anomalies.map((anomaly) => (
            <Alert key={anomaly.productName} variant="destructive" className="bg-destructive/10 border-destructive/30">
               <Lightbulb className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="font-semibold text-destructive-foreground/90">{anomaly.productName}</AlertTitle>
              <AlertDescription className="text-sm text-destructive-foreground/80">
                {anomaly.reason}
                <div className="mt-2">
                  Suggested Price: <Badge variant="secondary" className="text-base">¥{anomaly.suggestedPrice.toFixed(2)}</Badge>
                </div>
                <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-accent mt-1"
                    onClick={() => onUpdatePrice(anomaly.productName, anomaly.suggestedPrice)}
                >
                    Use suggested price
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Review Prices</AlertDialogCancel>
          <AlertDialogAction onClick={onProceed} className="bg-primary hover:bg-primary/90">
            Proceed Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { HistoryEntry } from "@/lib/types";
import { format } from 'date-fns';
import { Eye, MapPin } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryDetailDialogProps {
  entry: HistoryEntry;
  children?: React.ReactNode;
}

export function HistoryDetailDialog({ entry, children }: HistoryDetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button variant="ghost" size="sm"><Eye className="mr-2 h-4 w-4" />View Details</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-xs sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">History Record Details</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            Calculation from {format(new Date(entry.timestamp), "PPP p")}
            {entry.location && ` in ${entry.location}`}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] md:max-h-[70vh] pr-3">
          <div className="space-y-3 md:space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs md:text-sm">
              <p><strong>Hourly Wage:</strong> ¥{entry.hourlyWage.toFixed(2)}</p>
              {entry.location && (
                <p className="flex items-center">
                  <MapPin className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                  <strong>Location:</strong> {entry.location}
                </p>
              )}
              <p><strong>Products Analyzed:</strong> {entry.products.length}</p>
            </div>


            {entry.sanityCheckAnomalies && entry.sanityCheckAnomalies.length > 0 && (
              <div className="my-3 md:my-4">
                <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Price Sanity Check Notes:</h4>
                <ul className="list-disc pl-4 md:pl-5 space-y-1 text-xs md:text-sm text-muted-foreground">
                  {entry.sanityCheckAnomalies.map(anomaly => (
                    <li key={anomaly.productName}>
                      <strong>{anomaly.productName}:</strong> {anomaly.reason} (Suggested: ¥{anomaly.suggestedPrice.toFixed(2)})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <h4 className="font-semibold mt-3 md:mt-4 text-sm md:text-base">Purchasing Power Results:</h4>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="p-1.5 md:p-2">Product</TableHead>
                    <TableHead className="p-1.5 md:p-2">Original Price</TableHead>
                    <TableHead className="text-right p-1.5 md:p-2">Quantity Purchasable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs md:text-sm">
                  {entry.results.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium p-1.5 md:p-2">{item.name}</TableCell>
                      <TableCell className="p-1.5 md:p-2">¥{item.price.toFixed(2)} per {item.unit.split('/')[1] || item.unit}</TableCell>
                      <TableCell className="text-right font-semibold text-primary p-1.5 md:p-2">
                        {isFinite(item.quantityPurchasable) ? `${item.quantityPurchasable.toFixed(2)} ${item.unit.split('/')[1] || ''}` : '∞ (Free!)'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

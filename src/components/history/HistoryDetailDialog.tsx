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
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>History Record Details</DialogTitle>
          <DialogDescription>
            Calculation from {format(new Date(entry.timestamp), "PPP p")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
          <p><strong>Hourly Wage:</strong> ¥{entry.hourlyWage.toFixed(2)}</p>
          <p><strong>Number of Products:</strong> {entry.products.length}</p>

          {entry.sanityCheckAnomalies && entry.sanityCheckAnomalies.length > 0 && (
            <div className="my-4">
              <h4 className="font-semibold mb-2">Price Sanity Check Notes:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {entry.sanityCheckAnomalies.map(anomaly => (
                  <li key={anomaly.productName}>
                    <strong>{anomaly.productName}:</strong> {anomaly.reason} (Suggested: ¥{anomaly.suggestedPrice.toFixed(2)})
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <h4 className="font-semibold mt-4">Purchasing Power Results:</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Original Price</TableHead>
                <TableHead className="text-right">Quantity Purchasable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entry.results.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>¥{item.price.toFixed(2)} per {item.unit.split('/')[1] || item.unit}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                     {isFinite(item.quantityPurchasable) ? `${item.quantityPurchasable.toFixed(2)} ${item.unit.split('/')[1] || ''}` : '∞ (Free!)'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

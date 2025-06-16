
"use client";

import React from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { Trash2, AlertTriangle, History } from "lucide-react";
import { HistoryDetailDialog } from "@/components/history/HistoryDetailDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function HistoryPage() {
  const { history, deleteHistoryEntry, clearHistory } = useAppStore();
  const { toast } = useToast();

  const handleDeleteAll = () => {
    clearHistory();
    toast({ title: "History Cleared", description: "All records have been deleted."});
  }

  const handleDeleteSingle = (id: string) => {
    deleteHistoryEntry(id);
    toast({ title: "Record Deleted", description: "The selected record has been deleted."});
  }

  return (
    <AppLayout title="History Records">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Past Calculations</CardTitle>
            <CardDescription>Review your previous purchasing power analyses.</CardDescription>
          </div>
          {history.length > 0 && (
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear All Records
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your history records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <History className="mx-auto h-16 w-16 mb-4 opacity-50" />
              <p className="text-xl">No history records found.</p>
              <p>Complete a calculation to see it here.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-20rem)]"> {/* Adjust height as needed */}
              <div className="space-y-4 pr-4">
                {history.map((entry) => (
                  <Card key={entry.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {format(new Date(entry.timestamp), "MMMM d, yyyy 'at' h:mm a")}
                          </CardTitle>
                          <CardDescription>
                            Hourly Wage: ¥{entry.hourlyWage.toFixed(2)} &bull; Products: {entry.products.length}
                          </CardDescription>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                               <Trash2 className="h-4 w-4" />
                             </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Are you sure you want to delete this history record?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteSingle(entry.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground truncate">
                        Summary: {entry.results.slice(0, 3).map(r => 
                          `${r.name} × ${isFinite(r.quantityPurchasable) ? r.quantityPurchasable.toFixed(1) : 'Many'} ${r.unit.split('/')[1] || ''}`
                        ).join(', ')}{entry.results.length > 3 ? '...' : ''}
                      </p>
                      {entry.sanityCheckAnomalies && entry.sanityCheckAnomalies.length > 0 && (
                        <Badge variant="outline" className="mt-2 bg-yellow-50 border-yellow-300 text-yellow-700">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {entry.sanityCheckAnomalies.length} price suggestion(s)
                        </Badge>
                      )}
                    </CardContent>
                    <CardFooter>
                      <HistoryDetailDialog entry={entry}>
                        <Button variant="outline" size="sm">View Full Details</Button>
                      </HistoryDetailDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}

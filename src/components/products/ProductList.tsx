"use client";

import React from 'react';
import { useAppStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit3, ShoppingBasket, Leaf, Wheat, Droplet, Beef, Egg, Milk } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const iconMap: { [key: string]: React.ElementType } = {
  Rice: Leaf,
  Flour: Wheat,
  CookingOil: Droplet,
  Pork: Beef,
  Eggs: Egg,
  Milk: Milk,
  Default: ShoppingBasket,
};

export function ProductList() {
  const { products, updateProductPrice, removeProduct } = useAppStore();

  const handlePriceChange = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (!isNaN(price) && price >= 0) {
      updateProductPrice(id, price);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Your Product List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="w-[150px]">Current Price</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No products added yet. Add some to get started!
                  </TableCell>
                </TableRow>
              )}
              {products.map((product) => {
                const IconComponent = product.icon || iconMap[product.name.replace(/\s/g, '')] || iconMap.Default;
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <IconComponent className="h-6 w-6 text-primary" />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(e) => handlePriceChange(product.id, e.target.value)}
                        min="0"
                        step="0.01"
                        className="h-9"
                        aria-label={`Price for ${product.name}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {product.isCustom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProduct(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {/* Edit button can be added here if needed */}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

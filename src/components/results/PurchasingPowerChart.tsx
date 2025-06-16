"use client"

import React from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import type { CalculationResult } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface PurchasingPowerChartProps {
  data: CalculationResult[];
  chartRef?: React.RefObject<HTMLDivElement>;
}

export function PurchasingPowerChart({ data, chartRef }: PurchasingPowerChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchasing Power Visualization</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No data to display. Please complete previous steps.</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map(item => ({
    name: item.name,
    quantity: parseFloat(item.quantityPurchasable.toFixed(2)), // Ensure quantity is a number
    unitLabel: item.unit.split('/')[1] || item.unit // Extract unit like 'jin', 'liter'
  }));
  

  return (
    <Card className="shadow-lg" ref={chartRef}>
      <CardHeader>
        <CardTitle>Purchasing Power Visualization</CardTitle>
        <CardDescription>Units of each product you can buy with one hour of work.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              angle={-30} 
              textAnchor="end" 
              height={70} 
              interval={0}
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `${value}`}
              label={{ value: 'Quantity Purchasable', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))', fontSize: 14, dy:40 }}
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number, name: string, props: any) => [`${value} ${props.payload.unitLabel || ''}`, "Quantity"]}
            />
            <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="quantity" name="Quantity Purchasable" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

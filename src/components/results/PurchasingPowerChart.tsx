
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
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Purchasing Power Visualization</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] md:h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No data to display. Please complete previous steps.</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map(item => ({
    name: item.name,
    quantity: parseFloat(item.quantityPurchasable.toFixed(2)), 
    unitLabel: item.unit.split('/')[1] || item.unit 
  }));
  

  return (
    <Card className="shadow-md" ref={chartRef}>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Purchasing Power Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250} className="md:h-[350px]">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 60 }}> {/* Adjusted margins */}
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              interval={0}
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }} /* Smaller font for x-axis */
              style={{ userSelect: 'none' }}
            />
            <YAxis 
              tickFormatter={(value) => `${value}`}
              label={{ value: 'Quantity', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))', fontSize: 11, dy: 30 }} /* Adjusted label */
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }} /* Smaller font for y-axis */
              width={50} // Adjust width to give more space for labels
              style={{ userSelect: 'none' }}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted)/0.5)' }} 
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--popover-foreground))',
                boxShadow: '0 4px 12px hsl(var(--foreground)/0.1)', 
                padding: '6px 10px', 
                fontSize: '11px'
              }}
              formatter={(value: number, name: string, props: any) => [`${value} ${props.payload.unitLabel || ''}`, "Quantity"]}
            />
            <Bar dataKey="quantity" name="Quantity Purchasable" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

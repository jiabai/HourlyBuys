
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
          <CardTitle className="text-xl">Purchasing Power Visualization</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] md:h-[400px] flex items-center justify-center">
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
        <CardTitle className="text-xl">Purchasing Power Visualization</CardTitle>
        {/* Removed CardDescription to match image's cleaner look */}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300} className="md:h-[400px]">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 50 }}> {/* Adjusted left margin */}
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              angle={-35} 
              textAnchor="end" 
              height={70} 
              interval={0}
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} /* Smaller font for x-axis */
            />
            <YAxis 
              tickFormatter={(value) => `${value}`}
              label={{ value: 'Quantity', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))', fontSize: 12, dy: 30 }} /* Adjusted label */
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} /* Smaller font for y-axis */
              width={40} // Adjust width to give more space for labels
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted)/0.5)' }} // Lighter cursor
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))', // Use popover for tooltip bg
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--popover-foreground))',
                boxShadow: '0 4px 12px hsl(var(--foreground)/0.1)', // Add subtle shadow
                padding: '8px 12px', // Adjust padding
                fontSize: '12px'
              }}
              formatter={(value: number, name: string, props: any) => [`${value} ${props.payload.unitLabel || ''}`, "Quantity"]}
            />
            {/* Legend is not present in the target image, so commenting it out. Re-enable if needed.
            <Legend 
              wrapperStyle={{ color: 'hsl(var(--foreground))', fontSize: '12px', paddingTop: '10px' }} 
            />
            */}
            <Bar dataKey="quantity" name="Quantity Purchasable" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

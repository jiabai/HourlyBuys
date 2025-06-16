"use client";

import { BarChartBig } from 'lucide-react';
import Link from 'next/link';

interface AppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function AppLogo({ className, iconSize = 28, textSize = "text-2xl" }: AppLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-primary hover:opacity-80 transition-opacity ${className}`}>
      <BarChartBig size={iconSize} aria-hidden="true" />
      <span className={`font-bold font-headline ${textSize}`}>HourlyBuys</span>
    </Link>
  );
}

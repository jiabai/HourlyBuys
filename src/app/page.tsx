
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // Optional: for a loading spinner

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/salary');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-foreground text-lg">Redirecting to HourlyBuys application...</p>
    </div>
  );
}

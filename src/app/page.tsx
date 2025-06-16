
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/AppLogo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 text-center">
      <header className="mb-12">
        <AppLogo iconSize={48} textSize="text-5xl" />
      </header>

      <main className="flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-headline text-foreground/90 mb-10 max-w-2xl">
          Do you know how much in essential goods your one hour of work can buy?
        </h2>
        
        <Button
          asChild
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out"
          aria-label="Start Calculation"
        >
          <Link href="/products">
            Start Calculation
            <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </Button>
      </main>

      <footer className="absolute bottom-6 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PowerPerHour. All rights reserved.</p>
      </footer>
    </div>
  );
}

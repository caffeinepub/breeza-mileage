import LoginButton from '../auth/LoginButton';
import HelpDialog from '../help/HelpDialog';
import { Fuel, TrendingUp, BarChart3, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function OnboardingScreen() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Fuel className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Breeza Mileage</h1>
          </div>
          <div className="flex items-center gap-2">
            <HelpDialog />
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6 flex justify-center">
              <img
                src="/assets/generated/car-hero.dim_1600x900.png"
                alt="Car mileage tracking"
                className="w-full max-w-2xl rounded-2xl shadow-lg"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Track Your Car's Fuel Efficiency
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Calculate your exact mileage by recording fill-ups and odometer readings. 
              Get insights into your fuel consumption and driving efficiency.
            </p>
            <LoginButton />
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Accurate Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Calculate mileage from odometer readings and fuel amounts for precise efficiency metrics.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Detailed Stats</h3>
                <p className="text-sm text-muted-foreground">
                  View average mileage, best and worst tanks, and total distance traveled over time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Private & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is stored securely on the Internet Computer with Internet Identity authentication.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Ready to start tracking your fuel efficiency?
            </p>
            <LoginButton />
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/30 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with love using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

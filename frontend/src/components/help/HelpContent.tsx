import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HelpContent() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          How Mileage is Calculated
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your car's fuel efficiency (mileage) is calculated using the "tank-to-tank" method:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-2">
          <li>Record your odometer reading and fuel amount each time you fill up</li>
          <li>The app calculates distance traveled since the last fill-up</li>
          <li>Mileage = Distance ÷ Fuel Added</li>
        </ol>
      </section>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription className="text-sm">
          Your first fill-up entry cannot calculate mileage because there's no previous reading to compare. 
          Mileage calculations begin with your second entry.
        </AlertDescription>
      </Alert>

      <section>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Tips for Accurate Results
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span><strong>Fill to the same level:</strong> Always fill your tank to the same point (e.g., first click of the pump) for consistency</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span><strong>Avoid partial fills:</strong> Partial fill-ups will skew your mileage calculations</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span><strong>Record immediately:</strong> Enter your data right after filling up to avoid forgetting the exact odometer reading</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span><strong>Use consistent units:</strong> Stick with either metric or imperial units throughout your tracking</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span><strong>Track regularly:</strong> More data points provide better insights into your fuel efficiency trends</span>
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mb-3">Understanding Your Stats</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground">Average Mileage:</strong> The mean fuel efficiency across all your recorded fill-ups
          </div>
          <div>
            <strong className="text-foreground">Best Tank:</strong> Your most efficient fill-up period (highest km/L or MPG)
          </div>
          <div>
            <strong className="text-foreground">Worst Tank:</strong> Your least efficient fill-up period (lowest km/L or MPG)
          </div>
          <div>
            <strong className="text-foreground">Total Distance:</strong> Cumulative distance traveled based on your odometer readings
          </div>
        </div>
      </section>
    </div>
  );
}

import { DollarSignIcon, TrendingUpIcon, TrendingDownIcon, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface RevenueSummaryProps {
  totalRevenue: number;
  percentageChange: number;
  comparisonPeriod: string;
}

export function RevenueSummary({ 
  totalRevenue = 36000, 
  percentageChange = 12.5, 
  comparisonPeriod = "last month" 
}: RevenueSummaryProps) {
  const isPositive = percentageChange >= 0;
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0
                }).format(totalRevenue)}
              </h3>
              
              <div className="flex items-center mt-2">
                <div className={`flex items-center ${isPositive ? 'text-primary' : 'text-destructive'} text-sm font-medium`}>
                  {isPositive ? <TrendingUpIcon className="w-4 h-4 mr-1" /> : <TrendingDownIcon className="w-4 h-4 mr-1" />}
                  <span>{isPositive ? '+' : ''}{percentageChange}%</span>
                </div>
                <span className="text-sm text-muted-foreground ml-2">vs. {comparisonPeriod}</span>
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSignIcon className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Order Value</p>
              <h3 className="text-2xl font-bold">$850</h3>
              
              <div className="flex items-center mt-2">
                <div className="flex items-center text-primary text-sm font-medium">
                  <TrendingUpIcon className="w-4 h-4 mr-1" />
                  <span>+3.2%</span>
                </div>
                <span className="text-sm text-muted-foreground ml-2">vs. last month</span>
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-tertiary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
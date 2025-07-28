import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Card, CardContent } from "../ui/card";

// Sample sales data - in a real app, this would come from an API
const salesData = [
  {
    month: "Jan",
    products: 4000,
    services: 2400,
    total: 6400
  },
  {
    month: "Feb",
    products: 3500,
    services: 2800,
    total: 6300
  },
  {
    month: "Mar",
    products: 5000,
    services: 3000,
    total: 8000
  },
  {
    month: "Apr",
    products: 4800,
    services: 3500,
    total: 8300
  },
  {
    month: "May",
    products: 6000,
    services: 4200,
    total: 10200
  },
  {
    month: "Jun",
    products: 6500,
    services: 5000,
    total: 11500
  }
];

// Format currency for tooltip and axes
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export function SalesChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-card border border-border rounded-lg shadow-lg">
          <p className="font-medium text-sm text-foreground">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-xs text-[#c1f17e] flex items-center justify-between">
              <span>Products:</span>
              <span className="font-medium ml-2">{formatCurrency(payload[0].value)}</span>
            </p>
            <p className="text-xs text-[#8A4FFF] flex items-center justify-between">
              <span>Services:</span>
              <span className="font-medium ml-2">{formatCurrency(payload[1].value)}</span>
            </p>
            <p className="text-xs text-foreground border-t border-border pt-1 mt-1 flex items-center justify-between">
              <span>Total:</span>
              <span className="font-medium ml-2">{formatCurrency(payload[0].value + payload[1].value)}</span>
            </p>
          </div>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="w-full h-full">
      <div className="pb-2 flex items-center justify-between">
        <h3 className="font-medium">Sales Performance</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-primary mr-1"></span>
            <span className="text-sm text-muted-foreground">Products</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-tertiary mr-1"></span>
            <span className="text-sm text-muted-foreground">Services</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={salesData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          onMouseMove={(e) => {
            if (e.activeTooltipIndex !== undefined) {
              setActiveIndex(e.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="productsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c1f17e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#c1f17e" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="servicesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8A4FFF" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8A4FFF" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(214, 221, 230, 0.1)" 
          />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#d6dde6', fontSize: 12 }} 
            axisLine={{ stroke: 'rgba(214, 221, 230, 0.2)' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#d6dde6', fontSize: 12 }} 
            axisLine={{ stroke: 'rgba(214, 221, 230, 0.2)' }} 
            tickLine={false}
            tickFormatter={formatCurrency}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="products" 
            stroke="#c1f17e" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#productsGradient)" 
            activeDot={{ 
              r: 6, 
              stroke: '#c1f17e', 
              strokeWidth: 2, 
              fill: '#080f17' 
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="services" 
            stroke="#8A4FFF" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#servicesGradient)" 
            activeDot={{ 
              r: 6, 
              stroke: '#8A4FFF', 
              strokeWidth: 2, 
              fill: '#080f17' 
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DailyHydrationRecord } from '@/lib/types';
import { getDateRange } from '@/lib/dateUtils';

interface HydrationChartProps {
  records: DailyHydrationRecord[];
  currentGoal: number;
}

export function HydrationChart({ records, currentGoal }: HydrationChartProps) {
  const chartData = useMemo(() => {
    const last30Days = getDateRange(30);
    const recordMap = new Map(records.map(r => [r.date, r]));
    
    return last30Days.map(date => {
      const record = recordMap.get(date);
      return {
        date,
        displayDate: date.slice(5), // MM-DD
        consumed: record?.consumedOz ?? 0,
      };
    });
  }, [records]);

  const maxConsumed = Math.max(...chartData.map(d => d.consumed), currentGoal, 10);

  return (
    <div className="stat-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Water consumption per day
      </h3>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(220, 15%, 20%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }}
              tickLine={{ stroke: 'hsl(220, 15%, 20%)' }}
              axisLine={{ stroke: 'hsl(220, 15%, 20%)' }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }}
              tickLine={{ stroke: 'hsl(220, 15%, 20%)' }}
              axisLine={{ stroke: 'hsl(220, 15%, 20%)' }}
              domain={[0, maxConsumed + 10]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(220, 15%, 12%)',
                border: '1px solid hsl(220, 15%, 25%)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(210, 20%, 95%)' }}
              itemStyle={{ color: 'hsl(190, 90%, 50%)' }}
              formatter={(value: number) => [`${value} oz`, 'Consumed']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            {currentGoal > 0 && (
              <ReferenceLine 
                y={currentGoal} 
                stroke="hsl(25, 95%, 55%)" 
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
            )}
            <Line 
              type="monotone" 
              dataKey="consumed" 
              stroke="hsl(190, 90%, 50%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(190, 90%, 50%)', strokeWidth: 0, r: 3 }}
              activeDot={{ fill: 'hsl(190, 90%, 60%)', strokeWidth: 0, r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {currentGoal > 0 && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Dashed line = current daily goal ({currentGoal} oz)
        </p>
      )}
    </div>
  );
}

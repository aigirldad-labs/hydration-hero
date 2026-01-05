import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WeightInputProps {
  initialWeight: number | null;
  onWeightChange: (weight: number) => void;
}

export function WeightInput({ initialWeight, onWeightChange }: WeightInputProps) {
  const [value, setValue] = useState(initialWeight?.toString() ?? '');

  useEffect(() => {
    if (initialWeight !== null && value === '') {
      setValue(initialWeight.toString());
    }
  }, [initialWeight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue > 0) {
      onWeightChange(numValue);
    }
  };

  return (
    <div className="stat-card animate-fade-in">
      <Label htmlFor="weight" className="text-sm font-medium text-muted-foreground mb-2 block">
        Body weight (lbs)
      </Label>
      <Input
        id="weight"
        type="number"
        min="1"
        step="1"
        placeholder="Enter your weight"
        value={value}
        onChange={handleChange}
        className="bg-secondary/50 border-border/50 text-foreground text-lg font-medium h-12 focus:ring-primary focus:border-primary"
      />
    </div>
  );
}

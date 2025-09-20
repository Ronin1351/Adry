'use client';

import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface SalarySliderProps {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export function SalarySlider({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min = 3000,
  max = 30000,
  step = 500,
  disabled = false,
  className = '',
}: SalarySliderProps) {
  const [localMinValue, setLocalMinValue] = useState(minValue);
  const [localMaxValue, setLocalMaxValue] = useState(maxValue);

  useEffect(() => {
    setLocalMinValue(minValue);
  }, [minValue]);

  useEffect(() => {
    setLocalMaxValue(maxValue);
  }, [maxValue]);

  const handleMinChange = (value: number[]) => {
    const newMin = value[0];
    if (newMin <= localMaxValue) {
      setLocalMinValue(newMin);
      onMinChange(newMin);
    }
  };

  const handleMaxChange = (value: number[]) => {
    const newMax = value[0];
    if (newMax >= localMinValue) {
      setLocalMaxValue(newMax);
      onMaxChange(newMax);
    }
  };

  const getSliderColor = (value: number, isMin: boolean) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    if (isMin) {
      if (percentage < 20) return 'bg-green-500';
      if (percentage < 40) return 'bg-yellow-500';
      return 'bg-orange-500';
    } else {
      if (percentage < 30) return 'bg-green-500';
      if (percentage < 60) return 'bg-yellow-500';
      return 'bg-orange-500';
    }
  };

  const getRangeLabel = () => {
    const diff = localMaxValue - localMinValue;
    if (diff < 5000) return 'Very Narrow Range';
    if (diff < 10000) return 'Narrow Range';
    if (diff < 15000) return 'Moderate Range';
    if (diff < 20000) return 'Wide Range';
    return 'Very Wide Range';
  };

  const getRangeColor = () => {
    const diff = localMaxValue - localMinValue;
    if (diff < 5000) return 'text-green-600';
    if (diff < 10000) return 'text-yellow-600';
    if (diff < 15000) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label className="text-base font-medium">Salary Range</Label>
        <p className="text-sm text-gray-600">
          Set your minimum and maximum salary expectations
        </p>
      </div>

      {/* Current Values Display */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <Label className="text-sm text-gray-600">Minimum Salary</Label>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(localMinValue)}
              </div>
              <div className="text-xs text-gray-500">per month</div>
            </div>
            <div className="text-center">
              <Label className="text-sm text-gray-600">Maximum Salary</Label>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(localMaxValue)}
              </div>
              <div className="text-xs text-gray-500">per month</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Range:</span>
              <span className={`text-sm font-medium ${getRangeColor()}`}>
                {getRangeLabel()}
              </span>
            </div>
            <div className="text-center mt-1">
              <span className="text-lg font-semibold">
                {formatCurrency(localMaxValue - localMinValue)} difference
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Minimum Salary Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">Minimum Salary</Label>
          <span className="text-sm text-gray-600">
            {formatCurrency(localMinValue)}
          </span>
        </div>
        <Slider
          value={[localMinValue]}
          onValueChange={handleMinChange}
          min={min}
          max={Math.min(max, localMaxValue)}
          step={step}
          disabled={disabled}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatCurrency(min)}</span>
          <span>{formatCurrency(Math.min(max, localMaxValue))}</span>
        </div>
      </div>

      {/* Maximum Salary Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">Maximum Salary</Label>
          <span className="text-sm text-gray-600">
            {formatCurrency(localMaxValue)}
          </span>
        </div>
        <Slider
          value={[localMaxValue]}
          onValueChange={handleMaxChange}
          min={Math.max(min, localMinValue)}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatCurrency(Math.max(min, localMinValue))}</span>
          <span>{formatCurrency(max)}</span>
        </div>
      </div>

      {/* Salary Range Visualization */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Salary Range Visualization</Label>
        <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
            style={{
              left: `${((localMinValue - min) / (max - min)) * 100}%`,
              width: `${((localMaxValue - localMinValue) / (max - min)) * 100}%`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-white drop-shadow">
              {formatCurrency(localMinValue)} - {formatCurrency(localMaxValue)}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatCurrency(min)}</span>
          <span>{formatCurrency(max)}</span>
        </div>
      </div>

      {/* Market Insights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Market Insights</h4>
          <div className="space-y-1 text-xs text-blue-800">
            <p>• Average housekeeper salary: ₱8,000 - ₱15,000</p>
            <p>• Live-in positions typically pay ₱6,000 - ₱12,000</p>
            <p>• Live-out positions typically pay ₱8,000 - ₱18,000</p>
            <p>• Experience and skills can increase rates significantly</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

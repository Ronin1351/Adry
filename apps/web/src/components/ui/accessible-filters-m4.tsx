'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Accessible filter group component
interface AccessibleFilterGroupProps {
  children: React.ReactNode;
  label: string;
  description?: string;
  className?: string;
}

export const AccessibleFilterGroup = forwardRef<HTMLDivElement, AccessibleFilterGroupProps>(
  ({ children, label, description, className }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={`${label.toLowerCase().replace(/\s+/g, '-')}-label`}
        aria-describedby={description ? `${label.toLowerCase().replace(/\s+/g, '-')}-description` : undefined}
        className={cn('space-y-2', className)}
      >
        <div
          id={`${label.toLowerCase().replace(/\s+/g, '-')}-label`}
          className="text-sm font-medium text-gray-900"
        >
          {label}
        </div>
        {description && (
          <div
            id={`${label.toLowerCase().replace(/\s+/g, '-')}-description`}
            className="text-xs text-gray-600"
          >
            {description}
          </div>
        )}
        {children}
      </div>
    );
  }
);

AccessibleFilterGroup.displayName = 'AccessibleFilterGroup';

// Accessible checkbox group
interface AccessibleCheckboxGroupProps {
  children: React.ReactNode;
  label: string;
  description?: string;
  className?: string;
}

export const AccessibleCheckboxGroup = forwardRef<HTMLDivElement, AccessibleCheckboxGroupProps>(
  ({ children, label, description, className }, ref) => {
    return (
      <AccessibleFilterGroup
        ref={ref}
        label={label}
        description={description}
        className={className}
      >
        <div role="group" className="space-y-2">
          {children}
        </div>
      </AccessibleFilterGroup>
    );
  }
);

AccessibleCheckboxGroup.displayName = 'AccessibleCheckboxGroup';

// Accessible checkbox item
interface AccessibleCheckboxItemProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  count?: number;
  disabled?: boolean;
  className?: string;
}

export const AccessibleCheckboxItem = forwardRef<HTMLDivElement, AccessibleCheckboxItemProps>(
  ({ id, checked, onChange, label, count, disabled, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center space-x-2', className)}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          aria-describedby={count ? `${id}-count` : undefined}
        />
        <label
          htmlFor={id}
          className="text-sm flex-1 cursor-pointer select-none"
        >
          {label}
          {count !== undefined && (
            <span
              id={`${id}-count`}
              className="text-gray-500 ml-1"
              aria-label={`${count} results`}
            >
              ({count})
            </span>
          )}
        </label>
      </div>
    );
  }
);

AccessibleCheckboxItem.displayName = 'AccessibleCheckboxItem';

// Accessible select
interface AccessibleSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; count?: number }>;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  ({ id, label, value, onChange, options, placeholder, description, disabled, className }, ref) => {
    return (
      <AccessibleFilterGroup
        label={label}
        description={description}
        className={className}
      >
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
            disabled && 'bg-gray-100 cursor-not-allowed',
            className
          )}
          aria-describedby={description ? `${id}-description` : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} {option.count !== undefined ? `(${option.count})` : ''}
            </option>
          ))}
        </select>
      </AccessibleFilterGroup>
    );
  }
);

AccessibleSelect.displayName = 'AccessibleSelect';

// Accessible input
interface AccessibleInputProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ id, label, type = 'text', value, onChange, placeholder, description, disabled, required, min, max, step, className }, ref) => {
    return (
      <AccessibleFilterGroup
        label={label}
        description={description}
        className={className}
      >
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
            disabled && 'bg-gray-100 cursor-not-allowed',
            className
          )}
          aria-describedby={description ? `${id}-description` : undefined}
        />
      </AccessibleFilterGroup>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

// Accessible range slider
interface AccessibleRangeSliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const AccessibleRangeSlider = forwardRef<HTMLDivElement, AccessibleRangeSliderProps>(
  ({ id, label, min, max, value, onChange, step = 1, description, disabled, className }, ref) => {
    return (
      <AccessibleFilterGroup
        ref={ref}
        label={label}
        description={description}
        className={className}
      >
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>₱{min.toLocaleString()}</span>
            <span>₱{max.toLocaleString()}</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value[0]}
              onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
              disabled={disabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              aria-label={`Minimum ${label}`}
            />
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value[1]}
              onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
              disabled={disabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              aria-label={`Maximum ${label}`}
            />
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>₱{value[0].toLocaleString()}</span>
            <span>₱{value[1].toLocaleString()}</span>
          </div>
        </div>
      </AccessibleFilterGroup>
    );
  }
);

AccessibleRangeSlider.displayName = 'AccessibleRangeSlider';

// Accessible search input
interface AccessibleSearchInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  disabled?: boolean;
  className?: string;
}

export const AccessibleSearchInput = forwardRef<HTMLInputElement, AccessibleSearchInputProps>(
  ({ id, value, onChange, placeholder, onSearch, disabled, className }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch();
      }
    };

    return (
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
            disabled && 'bg-gray-100 cursor-not-allowed',
            className
          )}
          aria-label="Search workers"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    );
  }
);

AccessibleSearchInput.displayName = 'AccessibleSearchInput';
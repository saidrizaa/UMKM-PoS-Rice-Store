import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function CurrencyInput({ value, onChange, label, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(value.toLocaleString('id-ID'));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = rawValue === '' ? 0 : parseInt(rawValue, 10);
    
    setDisplayValue(numericValue === 0 ? '' : numericValue.toLocaleString('id-ID'));
    onChange(numericValue);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Rp</span>
        <Input
          {...props}
          type="text"
          value={displayValue}
          onChange={handleChange}
          className={`pl-10 ${props.className}`}
          placeholder="0"
        />
      </div>
    </div>
  );
}

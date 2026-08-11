import React from "react";
import { IndianRupee } from "lucide-react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  autoFocus?: boolean;
}

export function AmountInput({ value, onChange, error, autoFocus = false }: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow numbers and single decimal point
    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
      onChange(val);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor="upi-amount" className="block text-xs font-black uppercase tracking-wider text-gray-700">
        Amount <span className="text-red-500">*</span>
      </label>
      <div
        className={`relative flex items-center rounded-lg border bg-white shadow-2xs transition-all focus-within:ring-2 ${
          error
            ? "border-red-500 focus-within:ring-red-500"
            : "border-gray-300 focus-within:ring-black focus-within:border-black"
        }`}
      >
        <span className="pl-4 text-gray-400 font-bold text-lg select-none flex items-center">
          <IndianRupee className="size-5 text-gray-800 stroke-[2.5]" />
        </span>
        <input
          id="upi-amount"
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          placeholder="0.00"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          autoFocus={autoFocus}
          className="w-full bg-transparent px-3 py-3 text-2xl font-black tracking-tight text-black placeholder:text-gray-300 focus:outline-none"
        />
      </div>
      {error && <p className="text-xs font-semibold text-red-600 mt-1">{error}</p>}
    </div>
  );
}

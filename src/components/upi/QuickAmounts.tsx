interface QuickAmountsProps {
  onSelect: (amount: string) => void;
  currentAmount?: string;
}

const PRESETS = [
  { label: "₹100", value: "100" },
  { label: "₹200", value: "200" },
  { label: "₹500", value: "500" },
  { label: "₹1,000", value: "1000" },
  { label: "₹2,000", value: "2000" },
];

export function QuickAmounts({ onSelect, currentAmount }: QuickAmountsProps) {
  return (
    <div className="space-y-1.5">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
        Quick Select Amount
      </span>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => {
          const isSelected = currentAmount === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => onSelect(p.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-black tracking-wide transition-all shadow-2xs ${
                isSelected
                  ? "bg-amber-400 text-black ring-2 ring-black font-extrabold"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-black"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

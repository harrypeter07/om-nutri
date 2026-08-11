import { AmountInput } from "./AmountInput";
import { QuickAmounts } from "./QuickAmounts";
import { QrCode } from "lucide-react";

interface UpiFormProps {
  upiId: string;
  setUpiId: (val: string) => void;
  payeeName: string;
  setPayeeName: (val: string) => void;
  amount: string;
  setAmount: (val: string) => void;
  upiIdError?: string | null;
  amountError?: string | null;
  onGenerateClick?: () => void;
}

export function UpiForm({
  upiId,
  setUpiId,
  payeeName,
  setPayeeName,
  amount,
  setAmount,
  upiIdError,
  amountError,
  onGenerateClick,
}: UpiFormProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* UPI ID Field */}
      <div>
        <label htmlFor="upi-id" className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
          UPI ID <span className="text-red-500">*</span>
        </label>
        <input
          id="upi-id"
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="9322909257@ybl"
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm font-extrabold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
            upiIdError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-black focus:ring-black"
          }`}
        />
        {upiIdError && <p className="text-xs font-semibold text-red-600 mt-1">{upiIdError}</p>}
      </div>

      {/* Payee Name Field */}
      <div>
        <label htmlFor="payee-name" className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
          Payee Name
        </label>
        <input
          id="payee-name"
          type="text"
          value={payeeName}
          onChange={(e) => setPayeeName(e.target.value)}
          placeholder="OM Nutrition"
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm font-extrabold text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Amount Input Component */}
      <AmountInput value={amount} onChange={setAmount} error={amountError} />

      {/* Quick Select Buttons */}
      <QuickAmounts onSelect={setAmount} currentAmount={amount} />

      {/* Explicit Generate QR Button */}
      {onGenerateClick && (
        <button
          type="button"
          onClick={onGenerateClick}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-black py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-gray-800 transition-colors shadow-sm"
        >
          <QrCode className="size-4" /> Generate QR
        </button>
      )}
    </div>
  );
}

import { QrCode, ShieldCheck } from "lucide-react";

interface QrPreviewProps {
  qrDataUrl: string | null;
  amount: number | string;
  payeeName: string;
  upiId: string;
  isLoading?: boolean;
}

export function QrPreview({
  qrDataUrl,
  amount,
  payeeName,
  upiId,
  isLoading = false,
}: QrPreviewProps) {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  const formattedAmount = isNaN(numAmount) || numAmount <= 0 ? "0.00" : numAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
      {/* Header Badge */}
      <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-900 mb-4">
        <ShieldCheck className="size-3.5 text-amber-700" />
        <span>Scan to Pay</span>
      </div>

      {/* Amount Display */}
      <div className="mb-4">
        <span className="text-3xl font-black text-black tracking-tight">
          ₹{formattedAmount}
        </span>
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">
          {payeeName || "OM Nutrition"}
        </p>
      </div>

      {/* QR Code Container with Quiet Zone */}
      <div className="relative aspect-square w-full max-w-[260px] rounded-xl border border-gray-200 bg-white p-4 shadow-inner flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            <span className="text-xs font-semibold">Updating QR...</span>
          </div>
        ) : qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`UPI QR Code for ₹${formattedAmount} to ${upiId}`}
            className="size-full object-contain rounded"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <QrCode className="size-16 stroke-1 text-gray-300" />
            <span className="text-xs font-medium">Enter an amount to view QR</span>
          </div>
        )}
      </div>

      {/* UPI VPA Subtitle */}
      <div className="mt-4 text-center">
        <p className="text-xs font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-md inline-block border border-gray-200">
          {upiId || "9322909257@ybl"}
        </p>
        <p className="text-[10px] font-medium text-gray-400 mt-2">
          Supports Google Pay, PhonePe, Paytm, BHIM & all UPI apps
        </p>
      </div>
    </div>
  );
}

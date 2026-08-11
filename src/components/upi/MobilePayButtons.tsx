import { useState } from "react";
import { ArrowUpRight, Check, Send, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { createUpiUrl, getAppUpiLink, validateUpiId } from "@/lib/upi";
import { currency } from "@/lib/site";

interface MobilePayButtonsProps {
  amount: number | string;
  upiId?: string;
  payeeName?: string;
  transactionNote?: string;
  compact?: boolean;
}

export function MobilePayButtons({
  amount,
  upiId = "9322909257@ybl",
  payeeName = "OM Nutrition",
  transactionNote = "OM Nutrition Order",
  compact = false,
}: MobilePayButtonsProps) {
  const [customerUpiId, setCustomerUpiId] = useState("");
  const [upiIdError, setUpiIdError] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  const numAmount = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
  const upiParams = { upiId, payeeName, amount: numAmount, transactionNote };

  const genericUrl = createUpiUrl(upiParams);
  const gpayUrl = getAppUpiLink("gpay", upiParams);
  const phonepeUrl = getAppUpiLink("phonepe", upiParams);
  const paytmUrl = getAppUpiLink("paytm", upiParams);

  const handleAppClick = (url: string, appName: string) => {
    window.location.href = url;
    toast.info(`Opening ${appName}...`);
  };

  const handleSendPaymentRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateUpiId(customerUpiId);
    if (err) {
      setUpiIdError(err);
      return;
    }
    setUpiIdError(null);

    // Create payment request deep link targeting customer VPA
    const collectDeepLink = createUpiUrl({
      upiId,
      payeeName,
      amount: numAmount,
      transactionNote: `Collect request from ${customerUpiId}`,
    });

    setRequestSent(true);
    toast.success(`Payment request of ${currency(numAmount)} created for ${customerUpiId}!`);

    // Redirect or trigger app intent
    setTimeout(() => {
      window.location.href = collectDeepLink;
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* 1. Direct App Selector Buttons */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
            <Smartphone className="size-4 text-emerald-600" /> Direct Mobile Payment Apps
          </span>
          <span className="text-[10px] font-bold text-gray-500">Auto-Fills Amount</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Google Pay */}
          <button
            type="button"
            onClick={() => handleAppClick(gpayUrl, "Google Pay")}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 hover:border-blue-500 hover:bg-blue-50/50 transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded bg-blue-600 text-[10px] font-black text-white">G</span>
              <span className="text-xs font-black text-black group-hover:text-blue-600">GPay</span>
            </div>
            <ArrowUpRight className="size-3.5 text-gray-400 group-hover:text-blue-600" />
          </button>

          {/* PhonePe */}
          <button
            type="button"
            onClick={() => handleAppClick(phonepeUrl, "PhonePe")}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 hover:border-purple-600 hover:bg-purple-50/50 transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded bg-purple-700 text-[10px] font-black text-white">P</span>
              <span className="text-xs font-black text-black group-hover:text-purple-700">PhonePe</span>
            </div>
            <ArrowUpRight className="size-3.5 text-gray-400 group-hover:text-purple-700" />
          </button>

          {/* Paytm */}
          <button
            type="button"
            onClick={() => handleAppClick(paytmUrl, "Paytm")}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 hover:border-cyan-600 hover:bg-cyan-50/50 transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded bg-cyan-500 text-[10px] font-black text-white">P</span>
              <span className="text-xs font-black text-black group-hover:text-cyan-600">Paytm</span>
            </div>
            <ArrowUpRight className="size-3.5 text-gray-400 group-hover:text-cyan-600" />
          </button>

          {/* Any UPI App */}
          <button
            type="button"
            onClick={() => handleAppClick(genericUrl, "UPI App")}
            className="flex items-center justify-between rounded-xl border border-black bg-black p-3 hover:bg-gray-800 transition-all shadow-2xs group text-white"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="size-4 text-amber-400" />
              <span className="text-xs font-black text-white">Any UPI</span>
            </div>
            <ArrowUpRight className="size-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* 2. Send Payment Request to Customer UPI ID */}
      {!compact && (
        <form onSubmit={handleSendPaymentRequest} className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 space-y-2.5">
          <label htmlFor="customer-vpa" className="block text-[11px] font-black uppercase tracking-wider text-black">
            Or Enter Your UPI ID to Request Payment ({currency(numAmount)})
          </label>
          <div className="flex gap-2">
            <input
              id="customer-vpa"
              type="text"
              placeholder="e.g. mobile@ybl or name@okicici"
              value={customerUpiId}
              onChange={(e) => {
                setCustomerUpiId(e.target.value);
                if (upiIdError) setUpiIdError(null);
              }}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-black uppercase text-white hover:bg-gray-800 transition-colors shadow-2xs shrink-0"
            >
              {requestSent ? <Check className="size-3.5 text-emerald-400" /> : <Send className="size-3.5 text-amber-400" />}
              {requestSent ? "Sent" : "Send Request"}
            </button>
          </div>
          {upiIdError && <p className="text-[11px] font-semibold text-red-600">{upiIdError}</p>}
        </form>
      )}
    </div>
  );
}

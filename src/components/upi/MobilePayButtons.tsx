import { ArrowUpRight, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { createUpiUrl, getAppUpiLink } from "@/lib/upi";

interface MobilePayButtonsProps {
  amount: number | string;
  upiId?: string;
  payeeName?: string;
  transactionNote?: string;
}

export function MobilePayButtons({
  amount,
  upiId = "9322909257@ybl",
  payeeName = "OM Nutrition",
  transactionNote = "OM Nutrition Order",
}: MobilePayButtonsProps) {
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

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
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
  );
}

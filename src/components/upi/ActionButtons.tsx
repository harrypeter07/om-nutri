import { useState } from "react";
import { Copy, Download, RefreshCw, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { getUpiQrFilename } from "@/lib/upi";

interface ActionButtonsProps {
  qrDataUrl: string | null;
  upiUrl: string;
  amount: number | string;
  onReset: () => void;
  disabled?: boolean;
}

export function ActionButtons({
  qrDataUrl,
  upiUrl,
  amount,
  onReset,
  disabled = false,
}: ActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Download QR Code PNG
  const handleDownload = () => {
    if (!qrDataUrl) return;
    try {
      const filename = getUpiQrFilename(amount);
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloaded ${filename}`);
    } catch {
      toast.error("Failed to download QR image");
    }
  };

  // Copy UPI URI to Clipboard
  const handleCopy = async () => {
    if (!upiUrl) return;
    try {
      await navigator.clipboard.writeText(upiUrl);
      setCopied(true);
      toast.success("UPI Payment Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy link to clipboard");
    }
  };

  // Web Share API with fallback to copy
  const handleShare = async () => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    const formattedAmount = isNaN(numAmount) ? "0.00" : numAmount.toFixed(2);
    const title = `UPI Payment ₹${formattedAmount}`;
    const text = `Scan or click to pay ₹${formattedAmount} via UPI`;

    if (navigator.share && qrDataUrl) {
      try {
        // Try sharing image file if Web Share API supports files
        const response = await fetch(qrDataUrl);
        const blob = await response.blob();
        const file = new File([blob], getUpiQrFilename(amount), { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title,
            text,
            files: [file],
          });
          return;
        }

        // Fallback to text link sharing
        await navigator.share({ title, text, url: upiUrl });
        return;
      } catch (err: any) {
        if (err.name !== "AbortError") {
          handleCopy();
        }
        return;
      }
    }
    handleCopy();
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center">
      {/* Download QR */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || !qrDataUrl}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-2xs"
      >
        <Download className="size-4" /> Download QR
      </button>

      {/* Copy UPI Link */}
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled || !upiUrl}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-2xs"
      >
        {copied ? (
          <>
            <Check className="size-4 text-emerald-600 stroke-[3]" /> Copied!
          </>
        ) : (
          <>
            <Copy className="size-4 text-gray-700" /> Copy Link
          </>
        )}
      </button>

      {/* Share */}
      <button
        type="button"
        onClick={handleShare}
        disabled={disabled || !upiUrl}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-2xs"
      >
        <Share2 className="size-4 text-gray-700" /> Share
      </button>

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-200 hover:text-black transition-colors"
      >
        <RefreshCw className="size-3.5 text-gray-600" /> Reset
      </button>
    </div>
  );
}

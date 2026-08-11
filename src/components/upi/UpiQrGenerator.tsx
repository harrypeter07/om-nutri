import { useCallback, useEffect, useState } from "react";
import { ActionButtons } from "./ActionButtons";
import { QrPreview } from "./QrPreview";
import { UpiForm } from "./UpiForm";
import { createUpiUrl, validateAmount, validateUpiId } from "@/lib/upi";
import { generateQrDataUrl } from "@/lib/qr";

interface UpiQrGeneratorProps {
  initialUpiId?: string;
  initialPayeeName?: string;
  initialAmount?: number | string;
  readOnlyAmount?: boolean;
  onAmountChange?: (val: string) => void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  transactionNote?: string;
}

export function UpiQrGenerator({
  initialUpiId = "9322909257@ybl",
  initialPayeeName = "OM Nutrition",
  initialAmount = "",
  readOnlyAmount = false,
  onAmountChange,
  title,
  subtitle,
  compact = false,
  transactionNote,
}: UpiQrGeneratorProps) {
  const [upiId, setUpiId] = useState(initialUpiId);
  const [payeeName, setPayeeName] = useState(initialPayeeName);
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : "");

  const [upiIdError, setUpiIdError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [upiUrl, setUpiUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Sync initial prop updates if embedded
  useEffect(() => {
    if (initialAmount !== undefined) {
      setAmount(String(initialAmount));
    }
  }, [initialAmount]);

  const handleAmountChange = (val: string) => {
    setAmount(val);
    if (onAmountChange) onAmountChange(val);
  };

  // Generate QR Code with validation & debouncing
  const updateQrCode = useCallback(async () => {
    // Validate inputs
    const idErr = validateUpiId(upiId);
    setUpiIdError(idErr);

    const amtErr = amount ? validateAmount(amount) : null;
    setAmountError(amtErr);

    if (idErr || (amount && amtErr)) {
      setQrDataUrl(null);
      setUpiUrl("");
      return;
    }

    const generatedUpiUrl = createUpiUrl({
      upiId,
      payeeName,
      amount: amount || 0,
      transactionNote,
    });

    setUpiUrl(generatedUpiUrl);
    setIsGenerating(true);

    try {
      const dataUrl = await generateQrDataUrl(generatedUpiUrl, {
        width: 600,
        margin: 3,
      });
      setQrDataUrl(dataUrl);
    } catch {
      setQrDataUrl(null);
    } finally {
      setIsGenerating(false);
    }
  }, [upiId, payeeName, amount, transactionNote]);

  // Debounced effect whenever inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      updateQrCode();
    }, 250);
    return () => clearTimeout(timer);
  }, [updateQrCode]);

  const handleReset = () => {
    setUpiId(initialUpiId);
    setPayeeName(initialPayeeName);
    setAmount(initialAmount ? String(initialAmount) : "");
    setUpiIdError(null);
    setAmountError(null);
  };

  return (
    <div className="w-full">
      {/* Header section if provided */}
      {title && (
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs font-semibold text-gray-500">{subtitle}</p>
          )}
        </div>
      )}

      {/* Main Generator Card Grid: 2 Column Desktop / Stacked Mobile */}
      <div
        className={`grid gap-6 ${
          compact ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 lg:grid-cols-12"
        }`}
      >
        {/* Left Inputs Column */}
        <div className={compact ? "" : "lg:col-span-6 xl:col-span-6 space-y-5"}>
          <UpiForm
            upiId={upiId}
            setUpiId={setUpiId}
            payeeName={payeeName}
            setPayeeName={setPayeeName}
            amount={amount}
            setAmount={handleAmountChange}
            upiIdError={upiIdError}
            amountError={amountError}
            onGenerateClick={updateQrCode}
          />
        </div>

        {/* Right QR Preview & Action Buttons Column */}
        <div className={compact ? "" : "lg:col-span-6 xl:col-span-6 space-y-5 flex flex-col justify-between"}>
          <QrPreview
            qrDataUrl={qrDataUrl}
            amount={amount}
            payeeName={payeeName}
            upiId={upiId}
            isLoading={isGenerating}
          />

          <div className="pt-2">
            <ActionButtons
              qrDataUrl={qrDataUrl}
              upiUrl={upiUrl}
              amount={amount}
              onReset={handleReset}
              disabled={isGenerating || !!upiIdError || !!amountError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

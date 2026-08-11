export interface UpiParams {
  upiId: string;
  payeeName: string;
  amount: number | string;
  transactionNote?: string;
  transactionRef?: string;
}

/**
 * Creates a standard UPI deep link URL suitable for QR code encoding.
 * Format: upi://pay?pa=...&pn=...&am=...&cu=INR[&tn=...]
 */
export function createUpiUrl({
  upiId,
  payeeName,
  amount,
  transactionNote,
  transactionRef,
}: UpiParams): string {
  const cleanUpiId = upiId.trim();
  const cleanPayee = payeeName.trim();
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  const formattedAmount = isNaN(numAmount) || numAmount < 0 ? "0.00" : numAmount.toFixed(2);

  let url = `upi://pay?pa=${encodeURIComponent(cleanUpiId)}&pn=${encodeURIComponent(cleanPayee)}&am=${formattedAmount}&cu=INR`;

  if (transactionNote) {
    url += `&tn=${encodeURIComponent(transactionNote.trim())}`;
  }
  if (transactionRef) {
    url += `&tr=${encodeURIComponent(transactionRef.trim())}`;
  }

  return url;
}

/**
 * Generates app-specific deep link for direct opening on mobile.
 */
export function getAppUpiLink(
  app: "gpay" | "phonepe" | "paytm" | "bhim" | "generic",
  params: UpiParams
): string {
  const genericUrl = createUpiUrl(params);
  const rawQuery = genericUrl.replace("upi://pay?", "");

  switch (app) {
    case "gpay":
      return `gpay://upi/pay?${rawQuery}`;
    case "phonepe":
      return `phonepe://pay?${rawQuery}`;
    case "paytm":
      return `paytmmp://pay?${rawQuery}`;
    case "bhim":
      return `bhim://pay?${rawQuery}`;
    default:
      return genericUrl;
  }
}

/**
 * Basic non-restrictive UPI ID validation.
 */
export function validateUpiId(upiId: string): string | null {
  const trimmed = upiId.trim();
  if (!trimmed) {
    return "UPI ID is required";
  }
  if (!trimmed.includes("@")) {
    return "Please enter a valid UPI ID (e.g. name@upi)";
  }
  return null;
}

/**
 * Validates payment amount.
 */
export function validateAmount(amount: number | string): string | null {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num <= 0) {
    return "Please enter an amount greater than 0";
  }
  if (num > 100000) {
    return "Amount exceeds daily UPI limit (₹1,00,000)";
  }
  // Check max 2 decimal places
  const str = num.toString();
  if (str.includes(".") && str.split(".")[1].length > 2) {
    return "Maximum 2 decimal places allowed";
  }
  return null;
}

/**
 * Generates clean filename for QR download.
 * e.g., ₹500 -> upi-qr-500.png, ₹499.50 -> upi-qr-499.50.png
 */
export function getUpiQrFilename(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num <= 0) return "upi-qr.png";
  
  const formatted = num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
  return `upi-qr-${formatted}.png`;
}


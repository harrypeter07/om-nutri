import QRCode from "qrcode";

export interface QrOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  darkColor?: string;
  lightColor?: string;
}

/**
 * Client-side QR Data URL generator.
 * Generates a high-resolution canvas Data URL for crisp rendering and sharp downloads.
 */
export async function generateQrDataUrl(
  text: string,
  options: QrOptions = {}
): Promise<string> {
  const {
    width = 600,
    margin = 3,
    errorCorrectionLevel = "M",
    darkColor = "#000000",
    lightColor = "#ffffff",
  } = options;

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width,
      margin,
      errorCorrectionLevel,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    });
    return dataUrl;
  } catch (err) {
    console.error("QR Code generation error:", err);
    throw new Error("Failed to generate QR code");
  }
}

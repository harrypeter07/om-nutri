import { createFileRoute } from "@tanstack/react-router";
import { UpiQrGenerator } from "@/components/upi/UpiQrGenerator";

export const Route = createFileRoute("/upi")({
  head: () => ({
    meta: [
      { title: "UPI QR Generator | OM Nutrition Panipat" },
      {
        name: "description",
        content:
          "Create a payment QR code with a pre-filled amount instantly. Free lightweight UPI QR tool for fast payments.",
      },
    ],
  }),
  component: UpiPage,
});

function UpiPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <UpiQrGenerator
          title="UPI QR Generator"
          subtitle="Create a payment QR with a pre-filled amount"
          initialUpiId="9322909257@ybl"
          initialPayeeName="OM Nutrition"
        />
      </div>
    </div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("LKR", "Rs.");
}

export const SRI_LANKA_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Moneragala",
  "Ratnapura",
  "Kegalle",
];

export function calculateDeliveryFee(district: string): number {
  if (!district) return 400;
  const normalized = district.trim().toLowerCase();
  if (normalized === "colombo") return 300;
  if (normalized === "gampaha" || normalized === "kalutara") return 350;
  return 450; // Islandwide flat rate for rest of Sri Lanka
}

export function generateWhatsAppOrderLink(
  phone: string,
  orderId: string,
  customerName: string,
  totalAmount: number,
  itemsCount: number
): string {
  const cleanPhone = "94767568100"; // MIKI WhatsApp contact: 0767568100 -> international 94767568100
  const message = `Hello MIKI Baby SL! 👶🏼\nI would like an update on my order:\n\n*Order Ref:* ${orderId}\n*Name:* ${customerName}\n*Items:* ${itemsCount} item(s)\n*Total COD Amount:* ${formatPrice(
    totalAmount
  )}\n\nThank you!`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppDirectInquiry(productName?: string): string {
  const cleanPhone = "94767568100";
  const message = productName
    ? `Hi MIKI Baby SL! 🎀 I'm interested in *${productName}*. Could you give me more details?`
    : `Hi MIKI Baby SL! 👶🏼 I have an inquiry about your baby room wall art & gifts catalog.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

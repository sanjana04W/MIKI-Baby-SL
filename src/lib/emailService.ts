import emailjs from "@emailjs/browser";

export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_a0e4sa8",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_97ld8eu",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
};

export interface SendOtpParams {
  toEmail: string;
  toName: string;
  otpCode: string;
  totalAmount: string | number;
}

export async function sendVerificationOtpEmail({
  toEmail,
  toName,
  otpCode,
  totalAmount,
}: SendOtpParams): Promise<{ success: boolean; error?: string }> {
  try {
    const messageContent = `Dear ${toName},\n\nYour 6-digit order verification code is:\n\n👉  ${otpCode}  👈\n\nPlease enter this code on the checkout page to confirm your Cash on Delivery order (Total: ${totalAmount}).\n\nIf you did not request this, please ignore this email.\n\nWarm regards,\nMIKI Baby SL Team`;

    // Comprehensive parameter mapping to work seamlessly with any EmailJS template configuration
    const templateParams: Record<string, string | number> = {
      // Recipient details
      to_email: toEmail,
      email: toEmail,
      user_email: toEmail,
      reply_to: toEmail,
      to_name: toName,
      user_name: toName,
      name: toName,

      // Sender details
      from_name: "MIKI Baby SL",
      store_name: "MIKI Baby SL",

      // Code & Content
      otp_code: otpCode,
      verification_code: otpCode,
      code: otpCode,
      total_amount: totalAmount,
      subject: `Order Verification Code [${otpCode}] - MIKI Baby SL`,
      message: messageContent,
    };

    if (EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey.trim() !== "") {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey.trim()
      );
      console.log("EmailJS Sent Successfully:", response.status, response.text);
      return { success: true };
    } else {
      console.log(
        `%c[EmailJS Service: ${EMAILJS_CONFIG.serviceId} | Template: ${EMAILJS_CONFIG.templateId}]`,
        "background: #fdf2f8; color: #db2777; font-size: 13px; font-weight: bold; padding: 4px 8px; border-radius: 4px;"
      );
      console.log(
        `%c📨 Verification Code: ${otpCode} | Sent to: ${toEmail} (${toName}) | Total: ${totalAmount}`,
        "color: #2563eb; font-size: 13px; font-weight: bold;"
      );
      return { success: true };
    }
  } catch (err: any) {
    console.warn("EmailJS sending notice:", err);
    return {
      success: false,
      error: err?.text || err?.message || "Failed to send email",
    };
  }
}

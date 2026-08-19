"use client";

import React, { useState } from "react";
import {
  X,
  MessageCircle,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Save,
  AlertTriangle,
  Printer,
  QrCode,
  Gift,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatPrice, formatDate, generateWhatsAppOrderLink } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";

interface OrderModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ order, onClose }) => {
  const { updateOrderStatus } = useStore();

  const [status, setStatus] = useState<OrderStatus>(order?.orderStatus || "Pending");
  const [cancellationReason, setCancellationReason] = useState(
    order?.cancellationReason || ""
  );
  const [internalNotes, setInternalNotes] = useState(order?.internalNotes || "");
  const [courierTrackingNo, setCourierTrackingNo] = useState(order?.courierTrackingNo || "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPrintSlip, setShowPrintSlip] = useState(false);

  if (!order) return null;

  const handleSave = () => {
    setIsSaving(true);
    updateOrderStatus(order.orderId, status, cancellationReason, internalNotes);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }, 400);
  };

  const whatsappLink = generateWhatsAppOrderLink(
    order.customerInfo.phone,
    order.orderId,
    order.customerInfo.name,
    order.totalAmount,
    order.items.reduce((s, i) => s + i.quantity, 0)
  );

  const statusOptions: OrderStatus[] = [
    "Pending",
    "Confirmed",
    "Processing",
    "Dispatched",
    "Completed",
    "Cancelled",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto border border-slate-100">
        {/* Printable Courier Dispatch Slip View */}
        {showPrintSlip ? (
          <div className="p-4 sm:p-8 space-y-6 bg-white text-slate-900 font-sans border-2 sm:border-4 border-slate-900 rounded-3xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-900 pb-4 gap-2">
              <div>
                <h1 className="text-lg sm:text-2xl font-black tracking-tight">MIKI BABY SL • COURIER PACKING SLIP</h1>
                <p className="text-xs font-bold text-slate-600">CASH ON DELIVERY (COD) FULFILLMENT</p>
              </div>
              <div className="sm:text-right">
                <span className="text-base sm:text-xl font-black border-2 border-slate-900 px-3 py-1 rounded-lg">
                  REF: {order.orderId}
                </span>
                <p className="text-[10px] font-bold text-slate-500 mt-1">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            {/* Courier COD Collection Callout */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-bold text-miki-yellow block">COURIER CASH TO COLLECT</span>
                <span className="text-2xl sm:text-3xl font-black text-white">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="sm:text-right text-xs">
                <span className="font-bold bg-white text-slate-900 px-3 py-1 rounded">METHOD: COD CASH</span>
              </div>
            </div>

            {/* Address Box */}
            <div className="border-2 border-slate-900 rounded-xl p-4 space-y-2 text-xs">
              <span className="font-black text-slate-900 uppercase tracking-wider block text-xs">
                DELIVERY RECIPIENT & LOCATION:
              </span>
              <p className="text-sm font-black">{order.customerInfo.name}</p>
              <p className="font-bold">PHONE: {order.customerInfo.phone}</p>
              <p>ADDRESS: {order.customerInfo.address}</p>
              <p className="font-black text-sm">DISTRICT: {order.customerInfo.district.toUpperCase()}</p>
              {order.customerInfo.notes && (
                <p className="bg-slate-100 p-2 rounded text-slate-800 font-semibold mt-1">
                  NOTES: {order.customerInfo.notes}
                </p>
              )}
            </div>

            {/* Items Checklist */}
            <div className="space-y-2 overflow-x-auto">
              <span className="font-black text-xs uppercase tracking-wider block">ITEMS CHECKLIST:</span>
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                    <th className="p-2 border-r border-slate-300">Product Name</th>
                    <th className="p-2 border-r border-slate-300">Dimensions</th>
                    <th className="p-2 border-r border-slate-300">Personalization Text</th>
                    <th className="p-2 text-center">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-300">
                      <td className="p-2 border-r border-slate-300 font-bold">{item.name} ({item.variant || "Standard"})</td>
                      <td className="p-2 border-r border-slate-300">{item.dimensions || "N/A"}</td>
                      <td className="p-2 border-r border-slate-300 font-mono text-[11px]">{item.personalizationDetails || "None"}</td>
                      <td className="p-2 text-center font-bold">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {order.customerInfo.giftWrap && (
              <div className="p-3 bg-pink-50 border border-pink-300 rounded-xl text-xs text-pink-900 font-bold flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-600" />
                <span>PACKAGING NOTICE: Includes Gift Wrapping & Ribbon! Message: "{order.customerInfo.giftNote || "Best Wishes"}"</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Dispatch Slip
              </button>

              <button
                onClick={() => setShowPrintSlip(false)}
                className="text-slate-600 font-bold hover:underline"
              >
                ← Back to Order Editor
              </button>
            </div>
          </div>
        ) : (
          /* Normal Modal View */
          <>
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-miki-cream sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">{order.orderId}</h2>
                  <span className="bg-miki-pink/10 text-miki-pink text-[10px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-1 rounded-full uppercase">
                    COD Order
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setShowPrintSlip(true)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-miki-pink" />
                  <span className="hidden sm:inline">Print Dispatch Slip</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Order Status & Actions */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="w-full sm:w-auto">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Update Order Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as OrderStatus)}
                      className="w-full sm:w-auto bg-white border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          Status: {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Customer</span>
                  </a>
                </div>

                {status === "Cancelled" && (
                  <div className="pt-2 animate-fadeIn">
                    <label className="text-xs font-bold text-rose-600 flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Cancellation Reason (Mandatory)
                    </label>
                    <input
                      type="text"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="e.g. Customer requested cancellation, out of stock"
                      className="w-full bg-white border border-rose-200 text-xs text-slate-800 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Internal Admin & Courier Tracking Notes
                  </label>
                  <textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add courier tracking numbers, packing details, or customer notes..."
                    rows={2}
                    className="w-full bg-white border border-slate-200 text-xs text-slate-800 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-miki-pink"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-miki-dark hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savedSuccess ? "Saved!" : isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>

              {/* Grid Layout: Customer Info & Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer & Address */}
                <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-miki-pink" /> Customer Details
                  </h3>

                  <div className="space-y-2 text-xs text-slate-700">
                    <p><strong className="text-slate-900">Name:</strong> {order.customerInfo.name}</p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-900">Phone:</strong> {order.customerInfo.phone}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-900">Email:</strong> {order.customerInfo.email}
                    </p>
                    <div className="flex items-start gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-miki-pink shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Delivery Address:</p>
                        <p className="text-slate-600">{order.customerInfo.address}</p>
                        <span className="inline-block bg-slate-100 font-bold text-slate-800 text-[10px] px-2 py-0.5 rounded mt-1">
                          District: {order.customerInfo.district}
                        </span>
                      </div>
                    </div>

                    {order.customerInfo.giftWrap && (
                      <div className="bg-pink-50 p-2.5 rounded-xl border border-pink-200 text-pink-800 text-[11px] mt-2">
                        <strong>Gift Wrap Requested:</strong> {order.customerInfo.giftNote || "Includes gift card"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items & Totals */}
                <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                    Order Items ({order.items.length})
                  </h3>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                          {item.personalizationDetails && (
                            <p className="text-[10px] text-miki-pink font-semibold truncate">
                              Personalized: {item.personalizationDetails}
                            </p>
                          )}
                          <p className="text-[10px] text-slate-500">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="font-bold text-slate-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{formatPrice(order.deliveryFee)}</span>
                    </div>
                    {order.giftWrapFee && order.giftWrapFee > 0 && (
                      <div className="flex justify-between font-semibold">
                        <span>Gift Packaging</span>
                        <span>+{formatPrice(order.giftWrapFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                      <span>Total Amount (COD)</span>
                      <span className="text-miki-rose">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

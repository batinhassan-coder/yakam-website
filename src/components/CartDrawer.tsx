import React, { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Tag, Check, MapPin, Truck } from "lucide-react";
import { CartItem, SupportedLanguage } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  language: SupportedLanguage;
  onPlaceOrder: (orderDetails: any) => void;
}

const CITIES_SHIPPING = [
  { key: "Erbil", en: "Erbil", ar: "أربيل", ku: "هەولێر", cost: 3.00 },
  { key: "Sulaymaniyah", en: "Sulaymaniyah", ar: "السليمانية", ku: "سلێمانی", cost: 2.00 },
  { key: "Duhok", en: "Duhok", ar: "دهوك", ku: "دهۆک", cost: 4.00 },
  { key: "Baghdad", en: "Baghdad", ar: "بغداد", ku: "بەغداد", cost: 6.00 },
  { key: "Kirkuk", en: "Kirkuk", ar: "كركوك", ku: "کەرکوک", cost: 4.00 },
  { key: "Basra", en: "Basra", ar: "البصرة", ku: "بەسرە", cost: 7.00 }
];

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  language,
  onPlaceOrder
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountFlat, setDiscountFlat] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [couponError, setCouponError] = useState("");

  // Checkout info
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState("Erbil");
  const [address, setAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.selectedVariant.price * item.quantity, 0);
  const activeShippingObj = CITIES_SHIPPING.find((c) => c.key === selectedCity) || CITIES_SHIPPING[0];
  const shippingCost = cartItems.length > 0 ? activeShippingObj.cost : 0;
  
  const discountAmount = (subtotal * discountPercent) / 100 + discountFlat;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = () => {
    setCouponError("");
    const cleaned = couponCode.trim().toUpperCase();
    
    if (cleaned === "ECO20") {
      setDiscountPercent(20);
      setDiscountFlat(0);
      setCouponApplied("ECO20 (20% Off)");
    } else if (cleaned === "PACK10") {
      setDiscountPercent(10);
      setDiscountFlat(0);
      setCouponApplied("PACK10 (10% Off)");
    } else if (cleaned === "FIRSTORDER") {
      setDiscountPercent(0);
      setDiscountFlat(5.00);
      setCouponApplied("FIRSTORDER ($5 Off)");
    } else {
      setCouponError("Invalid coupon code. Try ECO20 or PACK10");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountPercent(0);
    setDiscountFlat(0);
    setCouponApplied("");
    setCouponCode("");
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) return;

    const orderReceipt = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      phone,
      city: selectedCity,
      address,
      notes: orderNotes,
      items: cartItems.map((item) => ({
        productTitle: item.product.title[language] || item.product.title.en,
        variantSku: item.selectedVariant.sku,
        variantCap: item.selectedVariant.capacity,
        quantity: item.quantity,
        price: item.selectedVariant.price
      })),
      subtotal,
      discountAmount,
      shippingCost,
      totalAmount: finalTotal,
      couponUsed: couponApplied,
      status: "PENDING_IG",
      date: new Date().toLocaleDateString()
    };

    onPlaceOrder(orderReceipt);
    setCheckoutStep("success");
  };

  const handleCloseAndClear = () => {
    onClearCart();
    setCheckoutStep("cart");
    // Clear form states
    setCustomerName("");
    setPhone("");
    setAddress("");
    setOrderNotes("");
    handleRemoveCoupon();
    onClose();
  };

  const dict = {
    en: {
      cartTitle: "Your Cart",
      checkoutTitle: "Secure Checkout",
      successTitle: "Order Initiated!",
      empty: "Your cart is empty",
      summary: "Order Summary",
      subtotal: "Subtotal",
      shipping: "Delivery Fee",
      discount: "Discount",
      total: "Estimated Total",
      couponLabel: "Do you have a coupon?",
      couponBtn: "Apply",
      btnCheckout: "Proceed to Checkout",
      btnOrder: "Initiate Instagram Order",
      btnBack: "Back to Cart",
      name: "Your Name",
      phone: "Phone Number",
      address: "Delivery Address",
      city: "City",
      notes: "Delivery Notes",
      successMsg: "Your order receipt has been recorded! To complete delivery, click the button below to copy your details and confirm with our team in Instagram DM.",
      btnFinalIg: "Send Details on Instagram",
      btnClear: "Clear All Items"
    },
    ar: {
      cartTitle: "حقيبتك",
      checkoutTitle: "إتمام الشراء",
      successTitle: "تم تسجيل الطلب!",
      empty: "سلة التسوق فارغة",
      summary: "ملخص الطلب",
      subtotal: "المجموع الفرعي",
      shipping: "تكلفة التوصيل",
      discount: "الخصم",
      total: "المجموع المقدر",
      couponLabel: "هل لديك كود خصم؟",
      couponBtn: "تطبيق",
      btnCheckout: "المتابعة لإتمام الشراء",
      btnOrder: "تأكيد الطلب على إنستغرام",
      btnBack: "الرجوع للحقيبة",
      name: "الاسم الكامل",
      phone: "رقم الهاتف",
      address: "عنوان التوصيل بالكامل",
      city: "المدينة",
      notes: "ملاحظات الشحن والتوصيل",
      successMsg: "تم تسجيل طلبك بنجاح! لإتمام عملية الشحن والتوصيل، اضغط على الزر أدناه لنسخ إيصال الطلب وتأكيده مع فريقنا عبر رسائل إنستغرام.",
      btnFinalIg: "إرسال التفاصيل على إنستغرام",
      btnClear: "إفراغ السلة بالكامل"
    },
    ku: {
      cartTitle: "سەبەتەکەت",
      checkoutTitle: "تۆمارکردنی داواکاری",
      successTitle: "داواکارییەکەت نێردرا!",
      empty: "سەبەتەکەت چۆڵە",
      summary: "کورتەی داواکاری",
      subtotal: "کۆی گشتی یەکەکان",
      shipping: "نرخی گواستنەوە",
      discount: "داشکاندن",
      total: "کۆی گشتی شایستە",
      couponLabel: "کۆدی داشکاندنت هەیە؟",
      couponBtn: "جێبەجێکردن",
      btnCheckout: "بەردەوامبە بۆ پڕکردنەوەی زانیاری",
      btnOrder: "تۆمارکردن لە ئینستاگرام",
      btnBack: "گەڕانەوە بۆ سەبەتە",
      name: "ناوی تەواو",
      phone: "ژمارەی مۆبایل",
      address: "ناونیشانی تەواوی گواستنەوە",
      city: "شار",
      notes: "تێبینییەکانی گواستنەوە",
      successMsg: "داواکارییەکەت بە سەرکەوتوویی تۆمارکرا! بۆ تەواوکردنی پرۆسەی ناردن، کلیک بکە لەسەر دوگمەی خوارەوە بۆ کۆپیکردنی پسوولەکە و ناردنی بۆ ژوری چاتی ئینستاگرامی ئێمە.",
      btnFinalIg: "ناردنی وردەکاری لە ئینستاگرام",
      btnClear: "پاککردنەوەی سەبەتە"
    }
  };

  const t = dict[language] || dict.en;

  const currentLang = language;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      
      {/* Backdrop click close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Cart Drawer Canvas */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-slate-900" />
            <h3 className="font-sans text-base font-bold text-slate-900 tracking-tight">
              {checkoutStep === "cart" ? t.cartTitle : checkoutStep === "checkout" ? t.checkoutTitle : t.successTitle}
            </h3>
            {cartItems.length > 0 && checkoutStep === "cart" && (
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
                {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-5">
          {checkoutStep === "success" ? (
            /* Success Checkout Mode */
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100">
                <Check size={32} className="animate-bounce" />
              </div>
              <h4 className="font-sans text-lg font-bold text-slate-900 tracking-tight">
                {t.successTitle}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                {t.successMsg}
              </p>

              <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-left font-mono text-[10px] text-slate-600 max-h-[160px] overflow-y-auto">
                <strong>📝 Order Receipt Summary:</strong><br />
                • Name: {customerName}<br />
                • Phone: {phone}<br />
                • Destination: {selectedCity}<br />
                • Address: {address}<br />
                • Items count: {cartItems.reduce((sum, item) => sum + item.quantity, 0)} packages<br />
                • Final Price: ${finalTotal.toFixed(2)}
              </div>

              <button
                onClick={() => {
                  const productTitleMock = cartItems.map((i) => `${i.product.title[language]} (${i.selectedVariant.capacity} x${i.quantity})`).join(", ");
                  const igMsg = `Hello Packing Store 👋\nI have completed cart checkout on your website.\n\n📋 Order details:\n• Products: ${productTitleMock}\n• Total Amount: $${finalTotal.toFixed(2)}\n• Shipping to: ${selectedCity}, ${address}\n• Customer Name: ${customerName}\n• Phone: ${phone}\n\nPlease confirm my order. Thanks!`;
                  navigator.clipboard.writeText(igMsg);
                  window.open("https://instagram.com/packing_store_mock", "_blank");
                }}
                className="w-full py-2.5 rounded-xl bg-pink-500 text-xs font-bold text-white shadow-lg hover:bg-pink-600 transition-colors"
              >
                {t.btnFinalIg}
              </button>
              
              <button
                onClick={handleCloseAndClear}
                className="w-full text-[11px] font-bold text-slate-600 hover:underline"
              >
                Close and Clear Cart
              </button>
            </div>
          ) : checkoutStep === "checkout" ? (
            /* Checkout Form Mode */
            <form onSubmit={handleSubmitCheckout} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wide">
                  {t.name} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Dana Ahmed"
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-slate-950 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wide">
                    {t.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +964 770..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-slate-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wide">
                    {t.city} *
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-slate-950 focus:outline-none"
                  >
                    {CITIES_SHIPPING.map((city) => (
                      <option key={city.key} value={city.key}>
                        {city[language] || city.en} (+${city.cost})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wide">
                  {t.address} *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, near hospital, landmark..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-slate-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wide">
                  {t.notes}
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. deliver after 4 PM, call before arrival..."
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-slate-950 focus:outline-none resize-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{t.subtotal}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-medium">
                    <span>{t.discount}</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{t.shipping} ({selectedCity})</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-2 mt-2">
                  <span>{t.total}</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-xs font-semibold text-white shadow-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {t.btnOrder}
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutStep("cart")}
                  className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
                >
                  {t.btnBack}
                </button>
              </div>
            </form>
          ) : cartItems.length === 0 ? (
            /* Empty Cart Mode */
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <div className="rounded-full bg-slate-50 p-4 border border-slate-100 text-slate-400">
                <ShoppingBag size={28} />
              </div>
              <h4 className="font-sans text-sm font-bold text-slate-800 tracking-tight">
                {t.empty}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Add packaging items from our catalog to customize and place orders!
              </p>
            </div>
          ) : (
            /* Regular Cart Items Mode */
            <div className="space-y-4">
              
              {/* Product list */}
              <div className="space-y-3 divide-y divide-slate-100">
                {cartItems.map((item) => {
                  const title = item.product.title[language] || item.product.title.en;
                  const varImg = item.selectedVariant.images?.[0] || item.product.images[0];
                  return (
                    <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                      <img
                        src={varImg}
                        alt={title}
                        className="h-14 w-14 shrink-0 rounded-lg object-cover border border-slate-100 bg-slate-50"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans text-xs font-bold text-slate-900 truncate tracking-tight">
                          {title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          Size: {item.selectedVariant.capacity} ({item.selectedVariant.packQty})
                        </span>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-2 py-0.5 bg-slate-50/50">
                            <button
                              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                              className="text-slate-500 hover:text-slate-900"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-bold text-slate-800 min-w-[12px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                              className="text-slate-500 hover:text-slate-900"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-900">
                              ${(item.selectedVariant.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clear Cart Button */}
              <button
                onClick={onClearCart}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-700 block text-right w-full mt-2"
              >
                {t.btnClear}
              </button>

              {/* Coupon Engine */}
              <div className="border-t border-slate-100 pt-4 mt-6">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  {t.couponLabel}
                </span>
                
                {couponApplied ? (
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs text-emerald-800">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Tag size={12} />
                      {couponApplied} applied
                    </span>
                    <button onClick={handleRemoveCoupon} className="text-emerald-700 hover:underline text-[10px] font-bold">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Try PACK10 or ECO20"
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-1 text-xs focus:border-slate-950 focus:outline-none uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="rounded-lg bg-slate-900 px-4 py-1 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                      >
                        {t.couponBtn}
                      </button>
                    </div>
                    {couponError && (
                      <span className="text-[10px] text-red-500 font-medium block">
                        {couponError}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Summary calculations */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-1">
                  {t.summary}
                </h5>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{t.subtotal}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-medium">
                    <span>{t.discount}</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{t.shipping}</span>
                  <span className="italic text-[10px]">Calculated next</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-2 mt-2">
                  <span>{t.total}</span>
                  <span>${(subtotal - discountAmount).toFixed(2)}</span>
                </div>
              </div>

              {/* Big action button */}
              <button
                onClick={() => setCheckoutStep("checkout")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-slate-800 active:scale-95 transition-all mt-4 cursor-pointer"
              >
                <CreditCard size={14} />
                {t.btnCheckout}
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

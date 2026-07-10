import React, { useState } from "react";
import { X, Check, Copy, Instagram, ShieldCheck, MapPin } from "lucide-react";
import { Product, ProductVariant, SupportedLanguage } from "../types";

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

const CITIES_LIST = [
  { en: "Erbil", ar: "أربيل", ku: "هەولێر" },
  { en: "Sulaymaniyah", ar: "السليمانية", ku: "سلێمانی" },
  { en: "Duhok", ar: "دهوك", ku: "دهۆک" },
  { en: "Baghdad", ar: "بغداد", ku: "بەغداد" },
  { en: "Kirkuk", ar: "كركوك", ku: "کەرکوک" },
  { en: "Basra", ar: "البصرة", ku: "بەسرە" }
];

export default function InstagramModal({ isOpen, onClose, product, selectedVariant, quantity }: InstagramModalProps) {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>("en");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState("Erbil");
  const [fullAddress, setFullAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  if (!isOpen) return null;

  const totalCost = selectedVariant.price * quantity;

  // Professional message templates for all three languages
  const getMessageTemplate = (lang: SupportedLanguage) => {
    const productTitle = product.title[lang] || product.title.en;
    const variantCap = selectedVariant.capacity;
    const packQty = selectedVariant.packQty;
    const sku = selectedVariant.sku;
    
    switch (lang) {
      case "ar":
        return `مرحباً فريق Packing Store 👋
أود تقديم طلب شراء مباشر من حسابي على إنستغرام:

📋 تفاصيل الطلب:
• المنتج: ${productTitle}
• الحجم/السعة: ${variantCap}
• الكمية المطلوبة: ${quantity} عبوة (${packQty})
• رمز الـ SKU: ${sku}
• السعر الفردي: $${selectedVariant.price.toFixed(2)}
• السعر الإجمالي: $${totalCost.toFixed(2)}

👤 معلومات المستلم الشحن:
• الاسم الكامل: ${customerName || "[يرجى كتابة الاسم هنا]"}
• رقم الهاتف: ${phone || "[يرجى كتابة رقم الهاتف هنا]"}
• المدينة: ${selectedCity}
• العنوان الكامل: ${fullAddress || "[يرجى كتابة العنوان هنا]"}
• ملاحظات إضافية: ${notes || "لا توجد"}

شكراً لكم، بانتظار تأكيد الطلب وتفاصيل التوصيل! ✨`;

      case "ku":
        return `سڵاو تیمی Packing Store 👋
دەمهەوێت ئەم داواکارییە بە شێوەیەکی ڕاستەوخۆ پێشکەش بکەم:

📋 وردەکاری داواکاری:
• بەرهەم: ${productTitle}
• قەبارە/توانا: ${variantCap}
• بڕی داواکراو: ${quantity} پاکێج (${packQty})
• کۆدی SKU: ${sku}
• نرخی یەکە: $${selectedVariant.price.toFixed(2)}
• نرخی گشتی: $${totalCost.toFixed(2)}

👤 زانیارییەکانی گواستنەوە:
• ناوی تەواو: ${customerName || "[تکایە ناوی خۆت لێرە بنووسە]"}
• ژمارەی مۆبایل: ${phone || "[تکایە ژمارەی مۆبایل بنووسە]"}
• شار: ${selectedCity}
• ناونیشانی تەواو: ${fullAddress || "[تکایە ناونیشان لێرە بنووسە]"}
• تێبینی زیاتر: ${notes || "نییە"}

سوپاستان دەکەم، چاوەڕوانی وەڵام و ناردنی کاڵاکەم! ✨`;

      default: // en
        return `Hello Packing Store Team 👋
I would like to place a direct order for the following item:

📋 Order Details:
• Product: ${productTitle}
• Capacity/Size: ${variantCap}
• Quantity: ${quantity} pack(s) (${packQty})
• SKU: ${sku}
• Unit Price: $${selectedVariant.price.toFixed(2)}
• Total Price: $${totalCost.toFixed(2)}

👤 Shipping & Delivery Info:
• Customer Name: ${customerName || "[Please fill in your name]"}
• Phone Number: ${phone || "[Please fill in your phone number]"}
• City: ${selectedCity}
• Full Delivery Address: ${fullAddress || "[Please fill in your address]"}
• Order Notes: ${notes || "None"}

Thank you! Looking forward to your order confirmation. ✨`;
    }
  };

  const currentMessage = getMessageTemplate(selectedLang);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRedirect = () => {
    handleCopy();
    // Redirect to Packing Store mock instagram page
    window.open("https://instagram.com/packing_store_mock", "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all md:flex">
        
        {/* Left Side Info Panel */}
        <div className="bg-slate-900 p-6 text-white md:w-5/12 flex flex-col justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-3 py-1 text-xs text-pink-400 font-semibold border border-pink-500/20">
              <Instagram size={14} />
              Instagram Direct Order
            </div>
            <h3 className="font-sans text-xl font-semibold text-white tracking-tight leading-snug">
              Order Instantly via DM
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              We understand you want a fast, secure, personalized buying experience. Fill in your details, select your language, copy the pre-made order receipt, and send it to us via Instagram DM!
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 font-bold">1</span>
                <span>Select your preferred message language.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 font-bold">2</span>
                <span>Input your shipping address and name.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 font-bold">3</span>
                <span>Copy the dynamic message and send to our Instagram chat.</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>Secure Direct Social Sales Bridge</span>
            </div>
          </div>
        </div>

        {/* Right Side Form and Preview */}
        <div className="p-6 md:w-7/12 max-h-[85vh] overflow-y-auto">
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>

          {!showTemplate ? (
            <div>
              <h4 className="font-sans text-lg font-semibold text-slate-900 tracking-tight">
                Enter Delivery Details
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Let's pre-populate your order template.</p>

              {/* Language Selection */}
              <div className="mt-4">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Message Language / لغة الرسالة / زمانی نامە
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'en', label: 'English' },
                    { id: 'ar', label: 'العربية' },
                    { id: 'ku', label: 'کوردی' }
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLang(lang.id as SupportedLanguage)}
                      className={`rounded-lg py-1.5 text-xs font-medium border transition-all ${
                        selectedLang === lang.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Full Name / الاسم</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">Phone Number / الموبايل</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +964 770..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">City / المدينة</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:border-slate-900 focus:bg-white focus:outline-none transition-all"
                    >
                      {CITIES_LIST.map((city) => (
                        <option key={city.en} value={city.en}>
                          {city[selectedLang] || city.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Delivery Address / العنوان بالكامل</label>
                  <input
                    type="text"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Neighborhood, street, nearest landmark"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Order Notes (Optional) / ملاحظات</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any packaging requests, customized logo requirements, or timing..."
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowTemplate(true)}
                disabled={!customerName || !phone || !fullAddress}
                className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-slate-800 active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:active:scale-100 transition-all cursor-pointer"
              >
                Generate Order Message
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-sans text-lg font-semibold text-slate-900 tracking-tight">Your Order Receipt</h4>
                  <button onClick={() => setShowTemplate(false)} className="text-[11px] font-bold text-slate-600 hover:underline">
                    ← Edit Details
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Copy this exact block and paste in our Instagram direct chat.</p>

                {/* Pre-formatted receipt viewer */}
                <div className="mt-4 relative rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <pre className="font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto pr-1">
                    {currentMessage}
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute right-3 top-3 rounded-lg bg-white p-1.5 text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
                    title="Copy receipt"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={handleRedirect}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 py-2.5 text-xs font-semibold text-white shadow-lg hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Instagram size={16} />
                  Copy & Open Instagram Chat
                </button>
                <button
                  onClick={onClose}
                  className="w-full rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

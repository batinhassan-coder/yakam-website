import React, { useState } from "react";
import { X, Sparkles, Flame, Snowflake, Check, Loader2, ArrowRight, ArrowLeft, Instagram, HelpCircle, AlertTriangle } from "lucide-react";
import { SupportedLanguage } from "../types";

interface PackagingFinderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onLaunchInstagramOrder: (productMock: any, variantMock: any) => void;
}

const STEPS = [
  { id: 1, name: { en: "Food Service", ar: "نوع الخدمة", ku: "جۆری خواردن" } },
  { id: 2, name: { en: "Temperature", ar: "درجة الحرارة", ku: "پلەی گەرمی" } },
  { id: 3, name: { en: "Material & Size", ar: "المواد والأحجام", ku: "ماددە و قەبارە" } },
  { id: 4, name: { en: "Preferences", ar: "التفضيلات والجهة", ku: "خواستەکان" } }
];

export default function PackagingFinderWizard({ isOpen, onClose, language, onLaunchInstagramOrder }: PackagingFinderWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");
  const [results, setResults] = useState<any>(null);
  const [apiError, setApiError] = useState(false);

  // Form States
  const [foodType, setFoodType] = useState("Specialty Coffee");
  const [temperature, setTemperature] = useState("Hot");
  const [material, setMaterial] = useState("Paper");
  const [capacity, setCapacity] = useState("12 oz");
  const [color, setColor] = useState("Kraft/Brown");
  const [budget, setBudget] = useState("Standard");

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      fetchRecommendations();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    setApiError(false);
    
    // Smooth loader phase transitions to enhance UX
    const phases = [
      { t: "Analyzing food thermal and grease resistance requirements...", s: 600 },
      { t: "Mapping sustainable kraft board layers and venting models...", s: 1300 },
      { t: "Configuring cost-effective carton quantities and SKU parameters...", s: 2000 }
    ];
    
    phases.forEach((p) => {
      setTimeout(() => setLoadingPhase(p.t), p.s);
    });

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodType,
          temperature,
          material,
          capacity,
          color,
          budget,
          language
        })
      });
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Failed to fetch smart recommendations:", err);
      setApiError(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setLoadingPhase("");
      }, 2500);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setResults(null);
  };

  // Translations dictionary
  const dict = {
    en: {
      title: "Smart Packaging Finder",
      subtitle: "AI-Powered Custom Fit Recommendations",
      foodLabel: "What food or drink do you serve?",
      tempLabel: "Is your food typically served Hot or Cold?",
      hot: "Hot Food / Drinks",
      cold: "Cold Food / Drinks",
      materialLabel: "Do you have a preferred container material?",
      capacityLabel: "What is your target size or capacity?",
      colorLabel: "Do you prefer a specific aesthetic color?",
      budgetLabel: "What is your purchasing budget level?",
      economy: "Economy (High Volume)",
      standard: "Standard (Eco-Focus)",
      premium: "Premium (Luxury Finish)",
      btnNext: "Continue",
      btnFind: "Find Ideal Packaging",
      btnBack: "Back",
      btnRestart: "Start Over",
      resultsTitle: "Your Custom Packaging Matches",
      fitScore: "Match Fit",
      advantage: "Key Benefit:",
      orderIg: "Order on Instagram",
      ecoFriendly: "Eco Friendly",
      foodSafe: "Food Grade Approved"
    },
    ar: {
      title: "مستشار التعبئة والتغليف الذكي",
      subtitle: "توصيات تعبئة مخصصة مدعومة بالذكاء الاصطناعي",
      foodLabel: "ما نوع الطعام أو الشراب الذي تقدمه؟",
      tempLabel: "هل يتم تقديم الطعام ساخناً أم بارداً بالعادة؟",
      hot: "أطعمة / مشروبات ساخنة",
      cold: "أطعمة / مشروبات باردة",
      materialLabel: "هل تفضل مادة صنع معينة للحاويات والعلب؟",
      capacityLabel: "ما هي السعة أو الحجم المستهدف؟",
      colorLabel: "هل تفضل لوناً معيناً لعلامتك التجارية؟",
      budgetLabel: "ما هي فئة الميزانية المحددة لشركتك؟",
      economy: "اقتصادية (كميات ضخمة وموفرة)",
      standard: "قياسية (تركيز على البيئة)",
      premium: "فاخرة (تشطيب لۆكس راقي)",
      btnNext: "استمرار",
      btnFind: "ابحث عن التغليف المثالي",
      btnBack: "رجوع",
      btnRestart: "البدء من جديد",
      resultsTitle: "خيارات التعبئة والتغليف الموصى بها لك",
      fitScore: "نسبة التطابق",
      advantage: "الميزة الأساسية:",
      orderIg: "الطلب عبر إنستغرام",
      ecoFriendly: "صديق للبيئة",
      foodSafe: "معتمد وآمن للغذاء"
    },
    ku: {
      title: "ڕاوێژکاری زیرەکی پاکێجینگ",
      subtitle: "پێشنیارکردنی باشترین پاکێج بە هاوکاری ژیری دەستکرد",
      foodLabel: "چی جۆرە خواردن یان خواردنەوەیەک پێشکەش دەکەن؟",
      tempLabel: "ئایا خواردنەکەتان بە گەرمی پێشکەش دەکرێت یان ساردی؟",
      hot: "خواردن / خواردنەوەی گەرم",
      cold: "خواردن / خواردنەوەی سارد",
      materialLabel: "ئایا ماددەیەکی تایبەتت لا پەسەندە بۆ دەفرەکە؟",
      capacityLabel: "قەبارە یان توانای دڵخوازتان چییە؟",
      colorLabel: "ڕەنگێکی تایبەت هەیە کە پێتان باش بێت؟",
      budgetLabel: "ئاستی بوودجەی کڕینتان چۆن دیاری دەکەن؟",
      economy: "ئابووری (بڕی زۆر و گونجاو)",
      standard: "ستاندارد (دۆستی ژینگە)",
      premium: "نایاب و لۆکس (کوالێتی زۆر بەرز)",
      btnNext: "بەردەوامبە",
      btnFind: "پاکێجی گونجاو بدۆزەوە",
      btnBack: "گەڕانەوە",
      btnRestart: "دووبارە دەستپێکردنەوە",
      resultsTitle: "گرووپی پێشنیارکراوی پاکێجینگ بۆ ئێوە",
      fitScore: "گونجاوی سێتەکە",
      advantage: "سوودی سەرەکی:",
      orderIg: "داواکاری لە ئینستاگرام",
      ecoFriendly: "دۆستی ژینگە",
      foodSafe: "مۆڵەت پێدراوی تەندروستی"
    }
  };

  const t = dict[language] || dict.en;

  const currentDict = dict[language] || dict.en;

  const handleOrderRedirect = (rec: any) => {
    // Construct a mock product and variant based on AI recommendation to feed into InstagramModal
    const mockProduct = {
      id: "ai-match",
      title: {
        en: rec.title,
        ar: rec.title,
        ku: rec.title
      },
      category: { id: "custom", en: rec.category, ar: rec.category, ku: rec.category },
      brand: "Packing Store AI",
      basePrice: 12.00,
      description: { en: rec.explanation, ar: rec.explanation, ku: rec.explanation },
      features: { en: [rec.advantage], ar: [rec.advantage], ku: [rec.advantage] },
      specifications: {
        material: { en: rec.material, ar: rec.material, ku: rec.material },
        color: { en: color, ar: color, ku: color },
        barcode: "AI-102938475",
        piecesPerPack: "100 Pcs",
        packsPerCarton: "10 Packs",
        microwaveSafe: temperature === "Hot",
        freezerSafe: temperature === "Cold",
        ecoFriendly: true,
        recyclable: true,
        foodGrade: true,
        bpaFree: true
      },
      images: [
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"
      ],
      badges: [],
      rating: 5.0,
      reviewCount: 1,
      variants: [],
      reviewsList: []
    };

    const mockVariant = {
      id: "ai-var",
      capacity: capacity,
      size: "Custom Fit Size",
      packQty: "100 Pcs Packs",
      price: rec.priceRating.includes("Premium") ? 18.50 : 11.20,
      stock: 150,
      sku: rec.sku || "PS-AI-MATCH"
    };

    onLaunchInstagramOrder(mockProduct, mockVariant);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400 border border-emerald-500/20">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-sans text-base font-semibold text-white tracking-tight">{t.title}</h3>
              <p className="text-[10px] text-slate-400">{t.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Wizard Main Panel */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
          
          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-16 text-center h-full min-h-[300px]">
              <div className="relative flex items-center justify-center">
                <Loader2 size={44} className="animate-spin text-slate-900" />
                <Sparkles size={16} className="absolute text-emerald-400 animate-bounce" />
              </div>
              <h4 className="mt-6 font-sans text-sm font-semibold text-slate-800 uppercase tracking-wider">
                Consulting AI Assistant...
              </h4>
              <p className="mt-2 text-xs text-slate-500 max-w-sm font-mono h-8">
                {loadingPhase || "Matching with best food packaging specs..."}
              </p>
            </div>
          ) : results ? (
            /* Recommendations Results State */
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    {results.source === "gemini" ? "AI Live Grounded Match" : "Expert System Match"}
                  </span>
                  <h4 className="mt-1.5 font-sans text-xl font-semibold text-slate-900 tracking-tight">
                    {t.resultsTitle}
                  </h4>
                </div>
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  {t.btnRestart}
                </button>
              </div>

              {results.summary && (
                <div className="mb-6 rounded-xl bg-slate-900 text-slate-200 p-4 text-xs leading-relaxed italic border border-slate-800">
                  ⚡ <strong>Consultant Summary:</strong> {results.summary}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.recommendations?.map((rec: any, idx: number) => (
                  <div key={idx} className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">
                          {rec.sku || `PS-AI-${idx}`}
                        </span>
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                          <Check size={10} />
                          <span>{rec.fitScore || "95%"} {t.fitScore}</span>
                        </div>
                      </div>

                      <h5 className="font-sans text-sm font-bold text-slate-900 tracking-tight leading-snug">
                        {rec.title}
                      </h5>
                      <span className="text-[10px] font-semibold text-slate-500 block mt-1">
                        Category: {rec.category}
                      </span>

                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                        <div className="text-[11px] text-slate-600 leading-relaxed">
                          <strong>{t.advantage}</strong> <span className="text-slate-800 font-medium">{rec.advantage}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">
                          "{rec.explanation}"
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-slate-500">
                          Est. Pricing:
                        </span>
                        <span className="text-[11px] font-bold text-slate-800">
                          {rec.priceRating}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleOrderRedirect(rec)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-pink-500 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-pink-600 transition-colors cursor-pointer"
                      >
                        <Instagram size={12} />
                        {t.orderIg}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Multi-step Question Forms */
            <div>
              {/* Stepper Header */}
              <div className="mb-6 flex items-center justify-between">
                {STEPS.map((step) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        currentStep === step.id
                          ? "bg-slate-900 text-white shadow-sm"
                          : currentStep > step.id
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      {currentStep > step.id ? <Check size={12} /> : step.id}
                    </div>
                    <span
                      className={`hidden sm:inline text-xs font-medium ${
                        currentStep === step.id ? "text-slate-900 font-semibold" : "text-slate-400"
                      }`}
                    >
                      {step.name[language] || step.name.en}
                    </span>
                    {step.id < 4 && <div className="hidden sm:block h-px w-8 bg-slate-200" />}
                  </div>
                ))}
              </div>

              {/* Step Forms */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[220px]">
                {currentStep === 1 && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                      {t.foodLabel}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        "Specialty Coffee", "Iced Latte & Sodas", "Gourmet Burgers",
                        "Crispy French Fries", "Fresh Salads", "Hot Ramen & Soups",
                        "Bakery & Croissants", "Pizza", "Cakes & Desserts"
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => setFoodType(item)}
                          className={`rounded-xl border p-3.5 text-left transition-all ${
                            foodType === item
                              ? "border-slate-900 bg-slate-50 text-slate-900 shadow-sm ring-1 ring-slate-900"
                              : "border-slate-150 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          <span className="block text-xs font-bold">{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                      {t.tempLabel}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setTemperature("Hot")}
                        className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                          temperature === "Hot"
                            ? "border-red-500 bg-red-50/10 text-red-900 ring-1 ring-red-400 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="rounded-full bg-red-100 p-3 text-red-500">
                          <Flame size={24} />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-slate-900">{t.hot}</span>
                          <span className="block text-xs text-slate-500 mt-0.5">Retain steam, prevent sleeve burn</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setTemperature("Cold")}
                        className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                          temperature === "Cold"
                            ? "border-blue-500 bg-blue-50/10 text-blue-900 ring-1 ring-blue-400 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="rounded-full bg-blue-100 p-3 text-blue-500">
                          <Snowflake size={24} />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-slate-900">{t.cold}</span>
                          <span className="block text-xs text-slate-500 mt-0.5">High clarity, moisture resistant</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                          {t.materialLabel}
                        </label>
                        <div className="space-y-2">
                          {["Paper", "Plastic", "Aluminium", "Biodegradable Wood", "Any"].map((mat) => (
                            <button
                              key={mat}
                              onClick={() => setMaterial(mat)}
                              className={`w-full rounded-xl border px-4 py-2.5 text-left text-xs font-semibold transition-all ${
                                material === mat
                                  ? "border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {mat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                          {t.capacityLabel}
                        </label>
                        <div className="space-y-2">
                          {["8 oz (approx. 240ml)", "12 oz (approx. 350ml)", "16 oz (approx. 470ml)", "500 ml", "750 ml / Medium Size", "Large Box", "Any"].map((cap) => (
                            <button
                              key={cap}
                              onClick={() => setCapacity(cap)}
                              className={`w-full rounded-xl border px-4 py-2.5 text-left text-xs font-semibold transition-all ${
                                capacity === cap
                                  ? "border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {cap}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                          {t.colorLabel}
                        </label>
                        <div className="space-y-2">
                          {["Kraft/Brown", "Pure White", "Matte Black", "Crystal Clear / Transparent", "Any"].map((cl) => (
                            <button
                              key={cl}
                              onClick={() => setColor(cl)}
                              className={`w-full rounded-xl border px-4 py-2.5 text-left text-xs font-semibold transition-all ${
                                color === cl
                                  ? "border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {cl}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                          {t.budgetLabel}
                        </label>
                        <div className="space-y-3">
                          {[
                            { id: "Economy", title: t.economy, desc: "Focus on low unit-cost and commercial volume carton packaging." },
                            { id: "Standard", title: t.standard, desc: "A healthy balance of sustainable paper materials and standard pricing." },
                            { id: "Premium", title: t.premium, desc: "Thick double-walls, textured surfaces, pristine brand aesthetic." }
                          ].map((b) => (
                            <button
                              key={b.id}
                              onClick={() => setBudget(b.id)}
                              className={`w-full rounded-xl border p-3 text-left transition-all ${
                                budget === b.id
                                  ? "border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900 shadow-sm"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span className="block text-xs font-bold text-slate-900">{b.title}</span>
                              <span className="block text-[10px] text-slate-500 mt-0.5">{b.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard Navigation */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-0 disabled:active:scale-100 transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  {t.btnBack}
                </button>

                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all cursor-pointer animate-shimmer"
                >
                  <span>{currentStep === 4 ? t.btnFind : t.btnNext}</span>
                  {currentStep === 4 ? <Sparkles size={14} /> : <ArrowRight size={14} />}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Search, ShoppingCart, Heart, Sparkles, Instagram, Layers, ShieldCheck, HelpCircle, User, Code, FileText, ChevronRight, Menu, X, ArrowUpDown, SlidersHorizontal, ArrowRight, Check, Star, RefreshCw, Eye, EyeOff, Clipboard, AlertCircle, Share2, Facebook, Plus, Minus, CheckCircle, MapPin, Phone, UserCheck, LogOut
} from "lucide-react";

// Imports from created local modules
import { PRODUCTS, CATEGORIES, FAQS, INSTAGRAM_FEED } from "./data/products";
import { Product, ProductVariant, CartItem, SupportedLanguage, ActiveTab, FAQItem } from "./types";
import InstagramModal from "./components/InstagramModal";
import PackagingFinderWizard from "./components/PackagingFinderWizard";
import CartDrawer from "./components/CartDrawer";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [userRole, setUserRole] = useState<"guest" | "customer" | "admin">("guest");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modals & Drawers States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isIgModalOpen, setIsIgModalOpen] = useState(false);
  const [selectedProductForIg, setSelectedProductForIg] = useState<Product | null>(null);
  const [selectedVariantForIg, setSelectedVariantForIg] = useState<ProductVariant | null>(null);
  const [qtyForIg, setQtyForIg] = useState(1);

  // Catalog State Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [priceRange, setPriceRange] = useState<number>(30);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");

  // Core Cart, Wishlist, Recently Viewed States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [showComparePanel, setShowComparePanel] = useState(false);

  // Active Selected Product Details View
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [detailQuantity, setDetailQuantity] = useState(1);

  // Checkout Orders State (pipes directly into Admin Dashboard)
  const [sessionOrders, setSessionOrders] = useState<any[]>([]);

  // Real-time flash sale countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keep activeTab safe when userRole changes
  useEffect(() => {
    const guestTabs = ["home", "shop", "about", "contact", "login"];
    const customerTabs = ["home", "shop", "profile", "cart", "wishlist"];
    const adminTabs = ["home", "shop", "profile", "admin"];
    
    let isValid = false;
    if (userRole === "guest" && guestTabs.includes(activeTab)) isValid = true;
    if (userRole === "customer" && customerTabs.includes(activeTab)) isValid = true;
    if (userRole === "admin" && adminTabs.includes(activeTab)) isValid = true;

    if (!isValid) {
      setActiveTab("home");
    }
  }, [userRole]);

  // Sync default variant when product is selected
  useEffect(() => {
    if (selectedProduct) {
      setSelectedVariant(selectedProduct.variants[0]);
      setActiveImageIdx(0);
      setDetailQuantity(1);
    }
  }, [selectedProduct]);

  // Handle Dynamic Stock & Price Modifiers from Admin Dashboard
  const [customProducts, setCustomProducts] = useState<Product[]>(PRODUCTS);

  const handleUpdateVariantStock = (productId: string, variantId: string, newStock: number) => {
    setCustomProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock: newStock } : v))
        };
      })
    );
    // Sync current viewed selected variant as well
    if (selectedProduct && selectedProduct.id === productId && selectedVariant && selectedVariant.id === variantId) {
      setSelectedVariant((prev) => prev ? { ...prev, stock: newStock } : null);
    }
  };

  const handleUpdateVariantPrice = (productId: string, variantId: string, newPrice: number) => {
    setCustomProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) => (v.id === variantId ? { ...v, price: newPrice } : v))
        };
      })
    );
    if (selectedProduct && selectedProduct.id === productId && selectedVariant && selectedVariant.id === variantId) {
      setSelectedVariant((prev) => prev ? { ...prev, price: newPrice } : null);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setSessionOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Cart operations
  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    const itemId = `${product.id}-${variant.id}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i));
      } else {
        return [...prev, { id: itemId, product, selectedVariant: variant, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(itemId);
    } else {
      setCartItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i)));
    }
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handlePlaceOrder = (orderReceipt: any) => {
    setSessionOrders((prev) => [orderReceipt, ...prev]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const cleaned = prev.filter((id) => id !== productId);
      return [productId, ...cleaned].slice(0, 4);
    });
  };

  const toggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 3) return prev; // Limit comparison set to 3 items
        return [...prev, product];
      }
    });
    setShowComparePanel(true);
  };

  // Launch Order directly from anywhere
  const triggerIgOrderDirectly = (product: Product, variant: ProductVariant, quantity: number) => {
    setSelectedProductForIg(product);
    setSelectedVariantForIg(variant);
    setQtyForIg(quantity);
    setIsIgModalOpen(true);
  };

  // Multilingual searching filtering logic (EN, AR, Sorani Kurdish keywords)
  const filteredProducts = customProducts.filter((p) => {
    const query = searchQuery.trim().toLowerCase();
    
    // Check search fields across three languages
    const titleEn = p.title.en.toLowerCase();
    const titleAr = p.title.ar.toLowerCase();
    const titleKu = p.title.ku.toLowerCase();
    const descEn = p.description.en.toLowerCase();
    const descAr = p.description.ar.toLowerCase();
    const descKu = p.description.ku.toLowerCase();
    const catEn = p.category.en.toLowerCase();
    const catAr = p.category.ar.toLowerCase();
    const catKu = p.category.ku.toLowerCase();
    const materialEn = p.specifications.material.en.toLowerCase();
    const materialAr = p.specifications.material.ar.toLowerCase();
    const materialKu = p.specifications.material.ku.toLowerCase();

    const matchesSearch =
      query === "" ||
      titleEn.includes(query) ||
      titleAr.includes(query) ||
      titleKu.includes(query) ||
      descEn.includes(query) ||
      descAr.includes(query) ||
      descKu.includes(query) ||
      catEn.includes(query) ||
      catAr.includes(query) ||
      catKu.includes(query) ||
      materialEn.includes(query) ||
      materialAr.includes(query) ||
      materialKu.includes(query);

    const matchesCategory = selectedCategory === "all" || p.category.id === selectedCategory;
    
    const matchesMaterial =
      selectedMaterial === "all" ||
      p.specifications.material.en.toLowerCase().includes(selectedMaterial.toLowerCase()) ||
      p.specifications.material.ar.includes(selectedMaterial) ||
      p.specifications.material.ku.includes(selectedMaterial);

    const matchesColor =
      selectedColor === "all" ||
      p.specifications.color.en.toLowerCase().includes(selectedColor.toLowerCase()) ||
      p.specifications.color.ar.includes(selectedColor);

    const matchesPrice = p.variants.some((v) => v.price <= priceRange);

    return matchesSearch && matchesCategory && matchesMaterial && matchesColor && matchesPrice;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.variants[0]?.price || a.basePrice;
    const priceB = b.variants[0]?.price || b.basePrice;

    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // default
  });

  // App Copy Translations
  const trans = {
    en: {
      siteName: "Packing Store",
      tagline: "Premium Disposable Food Packaging",
      home: "Home",
      shop: "Shop Catalog",
      profile: "My Account",
      admin: "Store Admin",
      about: "About Us",
      contact: "Contact",
      login: "Login",
      cart: "Cart",
      wishlist: "Wishlist",
      searchPlaceholder: "Search Paper Cup, كرتون, کاسە...",
      heroHeading: "The Elite Packaging Choice for Growing Food Brands",
      heroDesc: "Empowering cafes, restaurants, and cloud kitchens with gorgeous, sustainable, and leak-proof disposable containers. Boost your brand presentation with certified food-grade boxes.",
      heroBtnWizard: "Launch AI Packaging Finder",
      heroBtnShop: "Explore Full Catalog",
      featuredCats: "Featured Packaging Categories",
      bestSellers: "Trending Best Sellers",
      newArrivals: "New Design Arrivals",
      flashSales: "Weekly Packaging Flash Offers",
      endsIn: "Offer Ends In:",
      reviewsTitle: "What Renowned Chefs & Cafe Owners Say",
      followUs: "Follow Us @PackingStore",
      followDesc: "Get premium branding inspirations and new product releases directly on your feed.",
      orderOnIg: "Order on Instagram",
      addToCart: "Add to Cart",
      specs: "Technical Specifications",
      compTitle: "Product Comparison",
      compDesc: "Compare up to 3 chosen containers to optimize your purchase.",
      viewDetails: "View Packaging Details",
      pieces: "Pcs",
      stock: "In Stock",
      sku: "SKU",
      material: "Material",
      color: "Color",
      capacity: "Capacity",
      dimensions: "Dimensions",
      piecesPerPack: "Pieces per Pack",
      packsPerCarton: "Packs per Carton",
      microwave: "Microwave Safe",
      freezer: "Freezer Safe",
      recyclable: "Recyclable",
      foodGrade: "Food Grade Approved",
      recentlyViewedTitle: "Recently Viewed Packaging",
      wishlistTitle: "My Wishlist",
      compareBtn: "Compare Specs",
      noResults: "No products match your criteria. Try adjusting the sidebar filters!"
    },
    ar: {
      siteName: "Packing Store",
      tagline: "مستلزمات التعبئة والتغليف الغذائي الفاخرة",
      home: "الرئيسية",
      shop: "دليل المنتجات",
      profile: "حسابي",
      admin: "إدارة المتجر",
      about: "من نحن",
      contact: "اتصل بنا",
      login: "تسجيل الدخول",
      cart: "حقيبة التسوق",
      wishlist: "المفضلة",
      searchPlaceholder: "ابحث عن كوب ورقي، علب بيتزا، نایلون...",
      heroHeading: "خيار التغليف الفاخر لمطاعم ومقاهي العراق",
      heroDesc: "نمكن المقاهي والمطاعم والمطابخ السحابية من تقديم وجباتها بحاويات صديقة للبيئة، متينة ومقاومة تماماً للتسرب. ارتقِ بهوية براندك بمنتجات معتمدة وصحية.",
      heroBtnWizard: "مستشار التعبئة الذكي (AI)",
      heroBtnShop: "تصفح الكتالوج بالكامل",
      featuredCats: "تصنيفات التعبئة المميزة",
      bestSellers: "المنتجات الأكثر طلباً ومبيعاً",
      newArrivals: "تصاميم ومنتجات جديدة",
      flashSales: "عروض التعبئة الأسبوعية الخاطفة",
      endsIn: "تنتهي العروض في:",
      reviewsTitle: "ماذا يقول شركاؤنا من أصحاب المطاعم والمقاهي",
      followUs: "تابعونا على إنستغرام @PackingStore",
      followDesc: "احصل على أفكار تصميمية متميزة وإعلانات المنتجات الجديدة مباشرة على حسابك.",
      orderOnIg: "الطلب على إنستغرام",
      addToCart: "أضف للحقيبة",
      specs: "المواصفات الفنية التقنية",
      compTitle: "مقارنة مواصفات المنتجات",
      compDesc: "قارن بين 3 حاويات لتحديد المنتج الأنسب لتقديم طعامك.",
      viewDetails: "عرض تفاصيل التغليف",
      pieces: "قطعة",
      stock: "متوفر بالمخزن",
      sku: "رمز الـ SKU",
      material: "المادة",
      color: "اللون",
      capacity: "السعة / الحجم",
      dimensions: "الأبعاد",
      piecesPerPack: "عدد القطع في المغلف",
      packsPerCarton: "عدد المغلفات في الكرتون",
      microwave: "آمن للميكروويف",
      freezer: "آمن للفريزر",
      recyclable: "قابل لإعادة التدوير",
      foodGrade: "آمن وصحي تماماً للغذاء",
      recentlyViewedTitle: "منتجات تصفحتها مؤخراً",
      wishlistTitle: "قائمة المفضلة الخاصة بي",
      compareBtn: "قارن المواصفات",
      noResults: "لم نجد أي منتجات تطابق اختياراتك. يرجى تجربة تعديل فلاتر البحث الجانبية!"
    },
    ku: {
      siteName: "Packing Store",
      tagline: "پاکێجینگ و دەفری خواردنی لۆکس و تەندروست",
      home: "سەرەکی",
      shop: "کەتەلۆگی بەرهەمەکان",
      profile: "هەژماری من",
      admin: "بەڕێوەبردنی فرۆشگا",
      about: "دەربارەی ئێمە",
      contact: "پەیوەندی",
      login: "چوونەژوورەوە",
      cart: "سەبەتەی کڕین",
      wishlist: "دڵخوازەکان",
      searchPlaceholder: "بگەڕێ بۆ پەرداخ، بۆکسی پیتزا، عەلاگە...",
      heroHeading: "هەڵبژاردنی نایاب و لۆکس بۆ پاکێجکردنی خواردنەکانت",
      heroDesc: "پشتگیری کافێ، ڕێستۆرانت و چێشتخانەکان دەکەین بە دابینکردنی دەفری زۆر شیک، دۆستی ژینگە و دژە دزەکردن. ناوبانگی براندەکەت بەرز بکەرەوە بە بەرهەمە مۆڵەتدراوەکانمان.",
      heroBtnWizard: "ڕاوێژکاری زیرەکی پاکێج (AI)",
      heroBtnShop: "بینینی هەموو بەرهەمەکان",
      featuredCats: "بەشەکانی پاکێجینگ و دەفرەکان",
      bestSellers: "بەرهەمە پڕفرۆش و دڵخوازەکان",
      newArrivals: "نوێترین بەرهەم و دیزاینەکان",
      flashSales: "داشکاندنی کاتیی و هەفتانە",
      endsIn: "داشکاندنەکە کۆتایی دێت لە:",
      reviewsTitle: "کڕیاران و خاوەن کافێکان دەربارەی ئێمە چی دەڵێن",
      followUs: "هاوڕێمان بن لە ئینستاگرام @PackingStore",
      followDesc: "بیرۆکەی دیزاینی نایاب و بەرهەمی نوێ ڕاستەوخۆ لە ئینستاگرام ببینە.",
      orderOnIg: "داواکاری لە ئینستاگرام",
      addToCart: "بخەرە سەبەتەوە",
      specs: "تایبەتمەندییە تەکنیکییەکان",
      compTitle: "موقارنەی بەرهەمەکان",
      compDesc: "موقارنە لە نێوان ٣ دەفردا بکە بۆ هەڵبژاردنی باشترین.",
      viewDetails: "بینینی وردەکاری بەرهەم",
      pieces: "دانە",
      stock: "مەوجودە لە کۆگا",
      sku: "کۆدی SKU",
      material: "ماددە",
      color: "ڕەنگ",
      capacity: "توانا / قەبارە",
      dimensions: "دوورییەکان",
      piecesPerPack: "ژمارەی پارچە لە پاکەتێکدا",
      packsPerCarton: "ژمارەی پاکەت لە کارتۆنێکدا",
      microwave: "بەکارهێنان لە مایکڕۆوەیڤ",
      freezer: "پاراستن لە فرێزەر",
      recyclable: "دوبارە بەکارهێنانەوە",
      foodGrade: "مۆڵەتی تەندروستی خواردنی هەیە",
      recentlyViewedTitle: "بەرهەمە بینراوەکانی پێشوو",
      wishlistTitle: "دڵخوازەکانی من",
      compareBtn: "موقارنەکردنی تایبەتمەندییەکان",
      noResults: "هیچ بەرهەمێک نەدۆزرایەوە کە لەگەڵ فلتەرەکانت بگونجێت. تکایە فلتەرەکان بگۆڕە!"
    }
  };

  const currentCopy = trans[language] || trans.en;
  const isRtl = language === "ar" || language === "ku";

  const getNavTabs = () => {
    switch (userRole) {
      case "guest":
        return [
          { id: "home", label: currentCopy.home || "Home" },
          { id: "shop", label: currentCopy.shop || "Shop Catalog" },
          { id: "about", label: currentCopy.about || "About Us" },
          { id: "contact", label: currentCopy.contact || "Contact" },
          { id: "login", label: currentCopy.login || "Login" }
        ];
      case "customer":
        return [
          { id: "home", label: currentCopy.home || "Home" },
          { id: "shop", label: currentCopy.shop || "Shop Catalog" },
          { id: "profile", label: currentCopy.profile || "My Account" },
          { id: "cart", label: currentCopy.cart || "Cart" },
          { id: "wishlist", label: currentCopy.wishlist || "Wishlist" }
        ];
      case "admin":
        return [
          { id: "home", label: currentCopy.home || "Home" },
          { id: "shop", label: currentCopy.shop || "Shop Catalog" },
          { id: "profile", label: currentCopy.profile || "My Account" },
          { id: "admin", label: currentCopy.admin || "Store Admin" }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="rounded-xl bg-slate-900 p-2 text-white shadow-sm">
              <Layers size={18} />
            </div>
            <div>
              <h1 className="font-sans text-base font-bold text-slate-900 tracking-tight leading-tight">
                {currentCopy.siteName}
              </h1>
              <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block">
                {currentCopy.tagline}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {getNavTabs().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Utility Tools & Multilingual Selector */}
          <div className="flex items-center gap-3">
            
            {/* Language dropdown */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="en">English 🇬🇧</option>
              <option value="ar">العربية 🇮🇶</option>
              <option value="ku">کوردی (Sorani) ☀️</option>
            </select>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-500 hover:text-slate-950 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Wishlist toggle view */}
            <button
              onClick={() => {
                setActiveTab(userRole === "guest" ? "login" : "profile");
                addToRecentlyViewed("");
              }}
              className="relative p-1.5 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              title="View Wishlist"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              title="Open Cart"
            >
              <ShoppingCart size={18} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-150 shadow-inner px-4 py-2.5 flex flex-col gap-1.5 sticky top-16 z-30">
          {getNavTabs().map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isRtl ? "text-right" : "text-left"
              } ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Container Router Switch */}
      <main className="min-h-[calc(100vh-140px)]">
        
        {/* VIEW 1: HOME VIEW */}
        {activeTab === "home" && (
          <div className="space-y-12">
            
            {/* STUNNING PREMIUM HERO BANNER */}
            <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_40%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.05),transparent_40%)]" />
              
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-7 space-y-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <Sparkles size={12} />
                    AI-powered packaging consultant online
                  </span>
                  <h2 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {currentCopy.heroHeading}
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                    {currentCopy.heroDesc}
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setIsWizardOpen(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-600 active:scale-95 transition-all cursor-pointer"
                    >
                      <Sparkles size={16} />
                      {currentCopy.heroBtnWizard}
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("shop");
                        setSelectedCategory("all");
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white border border-white/10 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
                    >
                      {currentCopy.heroBtnShop}
                      <ArrowRight size={14} className={isRtl ? "rotate-180" : ""} />
                    </button>
                  </div>
                </div>

                {/* Hero visual feature mockup */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-slate-800/50 p-3 backdrop-blur-md">
                    <img
                      src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800"
                      alt="Premium Food Containers Display"
                      className="rounded-xl w-full h-[320px] object-cover"
                    />
                    <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-slate-900/90 border border-white/10 p-4 text-white backdrop-blur-md flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Double-wall Insulation</span>
                        <h4 className="font-sans font-bold text-xs mt-0.5">Ripple Kraft Paper Cup Series</h4>
                      </div>
                      <button
                        onClick={() => {
                          const p = customProducts.find(x => x.id === "prod-cup-1") || customProducts[0];
                          setSelectedProduct(p);
                        }}
                        className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-all"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURED CATEGORIES BENTO GRID */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8">
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {currentCopy.featuredCats}
                </h3>
                <div className="h-1 w-12 bg-slate-900 mx-auto mt-2 rounded" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
                  // select realistic image representer for each category
                  let image = "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400";
                  if (cat.id === "cups") image = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400";
                  if (cat.id === "boxes") image = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400";
                  if (cat.id === "wrap") image = "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&q=80&w=400";
                  if (cat.id === "cutlery") image = "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=400";

                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTab("shop");
                      }}
                      className="group relative h-40 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all border border-slate-100"
                    >
                      <img
                        src={image}
                        alt={cat[language]}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="font-sans text-xs font-bold block truncate tracking-tight">{cat[language]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* DYNAMIC FLASH SALES */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-2xl" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                      Flash Sale
                    </span>
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {currentCopy.flashSales}
                    </h3>
                    <p className="text-xs text-slate-400">Grab 20% discount on entire bio-degradable wooden and paper cup carton sets!</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{currentCopy.endsIn}</span>
                    <div className="flex gap-2">
                      {[
                        { val: timeLeft.hours, lbl: "hr" },
                        { val: timeLeft.minutes, lbl: "min" },
                        { val: timeLeft.seconds, lbl: "sec" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <span className="bg-slate-800 border border-slate-700 text-sm font-mono font-bold text-white h-9 w-10 flex items-center justify-center rounded-lg">
                            {String(item.val).padStart(2, "0")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Flash Products Promo Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  {customProducts.slice(0, 3).map((p) => {
                    const price = p.variants[0]?.price || p.basePrice;
                    const discountPrice = price * 0.8; // 20% mock discount
                    return (
                      <div key={p.id} className="rounded-xl bg-slate-800/40 border border-white/5 p-4 flex gap-3 text-xs">
                        <img
                          src={p.images[0]}
                          alt={p.title.en}
                          className="h-16 w-16 rounded-lg object-cover bg-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-white truncate leading-tight">{p.title[language]}</h4>
                            <span className="text-[10px] text-slate-400 mt-1 block">Moisture Proof, Food Grade</span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-emerald-400">${discountPrice.toFixed(2)}</span>
                              <span className="text-[10px] text-slate-500 line-through">${price.toFixed(2)}</span>
                            </div>
                            <button
                              onClick={() => handleAddToCart(p, p.variants[0], 1)}
                              className="rounded bg-white text-slate-900 font-bold px-2 py-0.5 text-[9px] hover:bg-slate-100"
                            >
                              Quick Add
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* BEST SELLERS GRID */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8">
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {currentCopy.bestSellers}
                </h3>
                <div className="h-1 w-12 bg-slate-900 mx-auto mt-2 rounded" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {customProducts.map((p) => {
                  const defaultVar = p.variants[0];
                  const inWishlist = wishlist.includes(p.id);
                  const inCompare = compareList.some((item) => item.id === p.id);

                  return (
                    <div
                      key={p.id}
                      className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      {/* Product Image Panel */}
                      <div className="relative overflow-hidden aspect-video bg-slate-50 border-b border-slate-100">
                        <img
                          src={p.images[0]}
                          alt={p.title.en}
                          className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        
                        {/* Wishlist floating toggle */}
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className={`absolute top-3 right-3 rounded-full p-2 border shadow-sm transition-all cursor-pointer ${
                            inWishlist
                              ? "bg-red-50 border-red-200 text-red-500"
                              : "bg-white/80 border-slate-100 text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Heart size={14} fill={inWishlist ? "currentColor" : "none"} />
                        </button>

                        {/* Badges */}
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                          {p.badges.map((b, idx) => (
                            <span
                              key={idx}
                              className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm text-white ${
                                b.type === "bestseller"
                                  ? "bg-amber-500"
                                  : b.type === "eco"
                                  ? "bg-emerald-600"
                                  : b.type === "new"
                                  ? "bg-blue-600"
                                  : "bg-slate-700"
                              }`}
                            >
                              {b.label[language] || b.label.en}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Product copy info */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                              {p.brand}
                            </span>
                            <div className="flex items-center text-amber-500 text-[11px] font-bold">
                              <Star size={11} fill="currentColor" className="mr-0.5" />
                              <span>{p.rating}</span>
                            </div>
                          </div>

                          <h4 className="font-sans text-sm font-bold text-slate-900 tracking-tight leading-snug">
                            {p.title[language]}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {p.description[language]}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Min. Option Price:</span>
                            <span className="text-sm font-extrabold text-slate-950">${defaultVar.price.toFixed(2)}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedProduct(p);
                                addToRecentlyViewed(p.id);
                              }}
                              className="rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                              title={currentCopy.viewDetails}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => toggleCompare(p)}
                              className={`rounded-lg p-2 border transition-colors cursor-pointer ${
                                inCompare
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                              title={currentCopy.compareBtn}
                            >
                              <RefreshCw size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* INTEGRATED INSTAGRAM SOCIAL FEED */}
            <section className="bg-slate-100/50 py-12">
              <div className="max-w-7xl mx-auto px-4">
                
                <div className="text-center mb-8 space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-pink-500 font-bold text-xs uppercase tracking-wider bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                    <Instagram size={14} />
                    Social Sales Hub
                  </div>
                  <h3 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {currentCopy.followUs}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">{currentCopy.followDesc}</p>
                </div>

                {/* Feed simulator */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {INSTAGRAM_FEED.map((post) => (
                    <div key={post.id} className="group relative rounded-xl overflow-hidden shadow-sm bg-white border border-slate-200/80">
                      <div className="aspect-square relative overflow-hidden bg-slate-50">
                        <img
                          src={post.imageUrl}
                          alt="Instagram Feed Image"
                          className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        {post.type === "reel" && (
                          <span className="absolute top-3 right-3 rounded bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-bold">
                            Reel {post.duration}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs font-bold">
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                        </div>
                      </div>

                      <div className="p-3">
                        <p className="text-[10px] text-slate-600 line-clamp-3 leading-relaxed">
                          {post.caption}
                        </p>
                        <button
                          onClick={() => triggerIgOrderDirectly(customProducts[0], customProducts[0].variants[0], 2)}
                          className="w-full mt-3 flex items-center justify-center gap-1 rounded bg-slate-900 text-[10px] font-bold text-white py-1 hover:bg-slate-800"
                        >
                          <Instagram size={10} />
                          Shop this post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQS */}
            <section className="max-w-4xl mx-auto px-4 pb-8">
              <div className="text-center mb-8">
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Frequently Asked Questions
                </h3>
                <div className="h-1 w-12 bg-slate-900 mx-auto mt-2 rounded" />
              </div>

              <div className="space-y-3">
                {FAQS.map((faq) => (
                  <div key={faq.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="font-sans text-xs font-bold text-slate-900">
                      {faq.question[language]}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {faq.answer[language]}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: SHOP CATALOG VIEW */}
        {activeTab === "shop" && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Sidebar Filters */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-sans text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <SlidersHorizontal size={14} />
                      Filter Sidebar
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedMaterial("all");
                        setSelectedColor("all");
                        setPriceRange(30);
                        setSearchQuery("");
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-800"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* Search */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                      Live Search
                    </label>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={currentCopy.searchPlaceholder}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                      Category
                    </label>
                    <div className="space-y-1">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCategory(c.id)}
                          className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                            selectedCategory === c.id
                              ? "bg-slate-900 text-white font-semibold"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span>{c[language]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Material Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                      Material
                    </label>
                    <select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
                    >
                      <option value="all">Any Material</option>
                      <option value="Paper">Paper / Kraft Board</option>
                      <option value="Plastic">PET / Polypropylene Plastic</option>
                      <option value="Wood">White Birchwood</option>
                      <option value="PVC">PVC Wrap Films</option>
                    </select>
                  </div>

                  {/* Color Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                      Color Aesthetic
                    </label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
                    >
                      <option value="all">Any Color</option>
                      <option value="Kraft">Organic Kraft Brown</option>
                      <option value="White">Clean White</option>
                      <option value="Clear">Clear / Transparent</option>
                    </select>
                  </div>

                  {/* Price Slider */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                      <span>Max Option Price</span>
                      <span className="text-slate-900 font-mono">${priceRange.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="30"
                      step="0.5"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseFloat(e.target.value))}
                      className="w-full accent-slate-900"
                    />
                  </div>

                </div>
              </div>

              {/* Products List Panel */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Header panel */}
                <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm text-xs">
                  <span className="font-bold text-slate-500">
                    Showing {sortedProducts.length} Packaging matches
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="rounded border border-slate-200 bg-white px-2 py-0.5 focus:outline-none text-slate-700 cursor-pointer"
                    >
                      <option value="default">Default</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Review Rating</option>
                    </select>
                  </div>
                </div>

                {sortedProducts.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <AlertCircle size={32} className="text-slate-400 mx-auto mb-3" />
                    <h4 className="font-sans text-sm font-bold text-slate-800 mb-1">
                      {currentCopy.noResults}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Reset your color, price, or keyword filters to search our complete foodgrade containers list.
                    </p>
                  </div>
                ) : (
                  /* Catalogue Grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {sortedProducts.map((p) => {
                      const inWishlist = wishlist.includes(p.id);
                      const inCompare = compareList.some((item) => item.id === p.id);
                      return (
                        <div
                          key={p.id}
                          className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div className="relative aspect-video bg-slate-50">
                            <img
                              src={p.images[0]}
                              alt={p.title.en}
                              className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                            />
                            
                            {/* Badges */}
                            <div className="absolute bottom-3 left-3 flex gap-1">
                              {p.badges.map((b, idx) => (
                                <span
                                  key={idx}
                                  className="bg-slate-900/80 text-white font-bold text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm"
                                >
                                  {b.label[language] || b.label.en}
                                </span>
                              ))}
                            </div>

                            {/* Wishlist toggle */}
                            <button
                              onClick={() => toggleWishlist(p.id)}
                              className={`absolute top-3 right-3 rounded-full p-1.5 border shadow-sm transition-colors ${
                                inWishlist ? "bg-red-50 text-red-500 border-red-100" : "bg-white/80 text-slate-500 hover:text-slate-800 border-slate-100"
                              }`}
                            >
                              <Heart size={12} fill={inWishlist ? "currentColor" : "none"} />
                            </button>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 font-mono block mb-0.5">{p.brand}</span>
                              <h4 className="font-sans text-xs font-bold text-slate-950 leading-snug">{p.title[language]}</h4>
                              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{p.description[language]}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <div>
                                <span className="text-[9px] text-slate-400 block font-semibold">Min Price Option:</span>
                                <span className="text-xs font-extrabold text-slate-950">${p.variants[0]?.price.toFixed(2)}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedProduct(p);
                                    addToRecentlyViewed(p.id);
                                  }}
                                  className="rounded bg-slate-900 text-white text-[10px] font-semibold px-3 py-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                  Configure
                                </button>
                                <button
                                  onClick={() => toggleCompare(p)}
                                  className={`rounded p-1.5 border transition-all ${
                                    inCompare ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                  }`}
                                  title="Add to compare"
                                >
                                  <RefreshCw size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* NEW VIEW: ABOUT US */}
        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {language === "ar" ? "قصتنا" : language === "ku" ? "چیرۆکی ئێمە" : "Our Story"}
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {language === "ar" ? "حول متجر التعبئة والتغليف" : language === "ku" ? "دەربارەی مەکۆی پاکێجینگ" : "About Packing Store"}
              </h2>
              <div className="h-1 w-16 bg-slate-900 mx-auto rounded" />
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
                {language === "ar" 
                  ? "نحن المزود الرائد لحلول التغليف والتعبئة الغذائية الفاخرة والمعتمدة صحياً للمطاعم والمقاهي الراقية في العراق." 
                  : language === "ku" 
                  ? "ئێمە دابینکەری سەرەکی دەفر و پاکێجینگی لۆکس و تەندروستین بۆ باشترین کافێ و ڕێستۆرانتەکانی کوردستان و عێراق." 
                  : "We are the leading provider of elite, certified food-grade packaging solutions for high-end restaurants, cafes, and hotels across Iraq."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="rounded-xl bg-slate-900 text-white p-3 w-fit">
                  <Layers size={20} />
                </div>
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  {language === "ar" ? "جودة غذائية معتمدة" : language === "ku" ? "تەندروستی و سەلامەتی" : "Food Grade Certified"}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {language === "ar"
                    ? "جميع حاوياتنا مصنوعة من مواد معتمدة صحياً تماماً وخالية من الروائح لحماية نكهة طعامك."
                    : language === "ku"
                    ? "هەموو بەرهەمەکانمان بێبەرین لە ماددە زیانبەخشەکان و تەندروستن بۆ پاراستنی تامی خواردنەکە."
                    : "100% odor-free, non-toxic, and certified food-safe materials that guarantee the original aroma and taste."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="rounded-xl bg-slate-900 text-white p-3 w-fit">
                  <SlidersHorizontal size={20} />
                </div>
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  {language === "ar" ? "تصاميم صديقة للبيئة" : language === "ku" ? "دۆستی ژینگە" : "Eco-Friendly Designs"}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {language === "ar"
                    ? "نقدم حاويات كرتونية وورقية قابلة لإعادة التدوير والتحلل لحماية بيئتنا الغالية."
                    : language === "ku"
                    ? "دەفری کاغذی و کڕافت دابین دەکەین کە دووبارە بەکاردێنەوە بۆ پاراستنی ژینگەی کوردستان."
                    : "Biodegradable, recyclable, and premium compostable Kraft paper solutions that reduce chemical footprints."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="rounded-xl bg-slate-900 text-white p-3 w-fit">
                  <CheckCircle size={20} />
                </div>
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  {language === "ar" ? "مقاومة للتسرب والحرارة" : language === "ku" ? "دژە دزەکردن" : "Leakproof & Tough"}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {language === "ar"
                    ? "أغطية محكمة الإغلاق ومقاومة تامة للحرارة والزيوت تضمن سلامة وجبات التوصيل."
                    : language === "ku"
                    ? "دەفرەکانمان زۆر پتەون و سەرەکانیان قوفڵ دەبن بۆ ڕێگریکردن لە دزەکردنی ڕۆن و شلەمەنی."
                    : "Double-sealed rim structures and oil-resistant coatings optimized for intensive courier and delivery handling."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NEW VIEW: CONTACT */}
        {activeTab === "contact" && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {language === "ar" ? "تواصل معنا" : language === "ku" ? "پایوەندیمان پێوە بکە" : "Get In Touch"}
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {language === "ar" ? "يسعدنا دائماً خدمتك" : language === "ku" ? "خۆشحاڵین بە یارمەتیدانت" : "Contact Our Team"}
              </h2>
              <div className="h-1 w-16 bg-slate-900 mx-auto rounded" />
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                {language === "ar"
                  ? "هل تحتاج لتصاميم مخصصة أو طلبيات كرتونية بالجملة لبراندك؟ تواصل معنا مباشرة."
                  : language === "ku"
                  ? "دەتەوێت بۆکسی تایبەت بە نیشانەی بازرگانی خۆت دروست بکەیت یان داواکاری گەورەت هەیە؟ پەیوەندیمان پێوە بکە."
                  : "Need custom printing or high-volume wholesale contracts for your hotel or coffee chain? Reach out to our specialist agents today."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Info column */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                    {language === "ar" ? "مكاتبنا ومعلومات الاتصال" : language === "ku" ? "ناونیشان و پەیوەندی" : "HQ Locations & Support"}
                  </h3>
                  
                  <div className="space-y-4 text-xs">
                    <div className="flex gap-3">
                      <div className="text-slate-500 shrink-0"><MapPin size={16} /></div>
                      <div>
                        <strong className="text-slate-900 block">{language === "ar" ? "مكتب أربيل الرئيسي" : language === "ku" ? "نووسینگەی سەرەکی هەولێر" : "Erbil HQ Office"}</strong>
                        <span className="text-slate-500 block mt-0.5">{language === "ar" ? "شارع 100م، قرب مستشفى رزكاري" : language === "ku" ? "شەقامی ١٠٠م، نزیک نەخۆشخانەی ڕزگاری" : "100m Road, Near Rizgari Hospital"}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="text-slate-500 shrink-0"><MapPin size={16} /></div>
                      <div>
                        <strong className="text-slate-900 block">{language === "ar" ? "مكتب السليمانية" : language === "ku" ? "نووسینگەی سلێمانی" : "Sulaymaniyah Branch"}</strong>
                        <span className="text-slate-500 block mt-0.5">{language === "ar" ? "شارع سالم، عمارة باشا" : language === "ku" ? "شەقامی سالم، تەلارى پاشا" : "Salem Street, Pasha Tower"}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="text-slate-500 shrink-0"><Phone size={16} /></div>
                      <div>
                        <strong className="text-slate-900 block">{language === "ar" ? "رقم الهاتف والواتساب" : language === "ku" ? "ژمارەی تەلەفۆن و واتسئاپ" : "Direct Phone & WhatsApp"}</strong>
                        <span className="text-slate-500 block mt-0.5">+964 (0) 750 123 4567</span>
                        <span className="text-slate-500 block">+964 (0) 770 987 6543</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form column */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 mb-4">
                  {language === "ar" ? "أرسل لنا استفسارك" : language === "ku" ? "نامەکەت بنێرە" : "Send A Query"}
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); alert(language === "ar" ? "شكراً لك! تم استلام رسالتك وسيتواصل معك مندوبنا قريباً." : language === "ku" ? "سوپاس! نامەکەت گەیشت و بەم زووانە پەیوەندیت پێوە دەکەین." : "Thank you! Your inquiry has been received. Our team will contact you shortly."); }} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{language === "ar" ? "الاسم الكامل" : language === "ku" ? "ناوی تەواو" : "Full Name"}</label>
                    <input required type="text" className="w-full rounded border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900" />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{language === "ar" ? "البريد الإلكتروني / الهاتف" : language === "ku" ? "تەلەفۆن یان ئیمەیڵ" : "Email / Phone"}</label>
                    <input required type="text" className="w-full rounded border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900" />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{language === "ar" ? "تفاصيل طلبك" : language === "ku" ? "تێبینی و داواکارییەکانت" : "Inquiry Details"}</label>
                    <textarea required rows={4} className="w-full rounded border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"></textarea>
                  </div>
                  <button type="submit" className="w-full rounded bg-slate-900 text-white font-bold py-2 hover:bg-slate-800 transition-colors cursor-pointer">
                    {language === "ar" ? "إرسال الآن" : language === "ku" ? "بینێرە" : "Submit Query"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* NEW VIEW: PORTAL/LOGIN */}
        {activeTab === "login" && (
          <div className="max-w-md mx-auto px-4 py-16">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md space-y-6 text-center">
              <div>
                <div className="rounded-2xl bg-slate-900 text-white p-3 w-fit mx-auto shadow-sm">
                  <UserCheck size={28} />
                </div>
                <h3 className="font-sans text-xl font-extrabold text-slate-900 mt-4">
                  {language === "ar" ? "بوابة تسجيل الدخول" : language === "ku" ? "بەر دەروازەی چوونەژوورەوە" : "Client & Admin Portal"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === "ar" ? "اختر نوع الحساب للوصول السريع إلى الميزات المقررة" : language === "ku" ? "ڕۆڵێکی گونجاو هەڵبژێرە بۆ چوونە ناو سیستمەکە" : "Select an identity role to access tailored shop options"}
                </p>
              </div>

              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">
                  {language === "ar" ? "الدور الحالي النشط:" : language === "ku" ? "ڕۆڵی ئێستات لە سیستم:" : "Current Active Role:"}
                </span>
                <span className="rounded bg-slate-900 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 tracking-wider font-mono">
                  {userRole}
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    setUserRole("guest");
                    setActiveTab("home");
                  }}
                  className={`w-full rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-between px-4 border cursor-pointer ${
                    userRole === "guest"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User size={15} />
                    {language === "ar" ? "تصفح كـ زائر" : language === "ku" ? "چوونەژوورەوە وەک میوان" : "Sign in as Guest"}
                  </span>
                  <span className="text-[9px] font-bold opacity-60">GUEST</span>
                </button>

                <button
                  onClick={() => {
                    setUserRole("customer");
                    setActiveTab("home");
                  }}
                  className={`w-full rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-between px-4 border cursor-pointer ${
                    userRole === "customer"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserCheck size={15} />
                    {language === "ar" ? "دخول كـ زبون" : language === "ku" ? "چوونەژوورەوە وەک کڕیار" : "Sign in as Customer"}
                  </span>
                  <span className="text-[9px] font-bold opacity-60">CUSTOMER</span>
                </button>

                <button
                  onClick={() => {
                    setUserRole("admin");
                    setActiveTab("home");
                  }}
                  className={`w-full rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-between px-4 border cursor-pointer ${
                    userRole === "admin"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={15} />
                    {language === "ar" ? "دخول كـ مدير متجر" : language === "ku" ? "چوونەژوورەوە وەک بەڕێوەبەر" : "Sign in as Admin"}
                  </span>
                  <span className="text-[9px] font-bold opacity-60">ADMIN</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NEW VIEW: CART */}
        {activeTab === "cart" && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div>
              <h2 className="font-sans text-2xl font-bold text-slate-900 tracking-tight">
                {language === "ar" ? "حقيبة التسوق الخاصة بك" : language === "ku" ? "سەبەتەی کڕینەکەت" : "Your Shopping Cart"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === "ar" ? "راجع تفاصيل وجباتك وحاوياتك لإجراء الطلب." : language === "ku" ? "پێداچوونەوە بکە بە دەفرەکانت پێش ناردنی داواکاریەکە." : "Review and configure final quantities before submitting logs."}
              </p>
            </div>

            {cartItems.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4">
                <div className="rounded-full bg-slate-50 p-4 text-slate-300 w-fit mx-auto">
                  <ShoppingCart size={40} />
                </div>
                <p className="text-xs text-slate-400">
                  {language === "ar" ? "حقيبة التسوق فارغة حالياً!" : language === "ku" ? "سەبەتەکەت هیچ بەرهەمێکی تێدا نییە!" : "Your cart is currently empty."}
                </p>
                <button
                  onClick={() => setActiveTab("shop")}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {language === "ar" ? "تصفح المنتجات" : language === "ku" ? "بگەڕێ بۆ بەرهەمەکان" : "Browse Shop Catalog"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 flex gap-4 text-xs">
                      <img
                        src={item.productImage}
                        alt={item.productTitle[language]}
                        className="h-16 w-16 rounded object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 truncate">{item.productTitle[language]}</h4>
                            <button
                              onClick={() => handleRemoveCartItem(item.id)}
                              className="text-slate-400 hover:text-red-500"
                              title="Remove item"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {language === "ar" ? "الباقة:" : language === "ku" ? "دیزاین:" : "Variant:"} {item.variantTitle}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {language === "ar" ? "الكمية:" : language === "ku" ? "ژمارە:" : "Quantity:"} {item.quantity} x {item.quantityPerPack} {language === "ar" ? "قطعة" : language === "ku" ? "دانە" : "pcs"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                          <span className="font-mono text-[10px] text-slate-400">SKU: {item.sku}</span>
                          <span className="font-extrabold text-slate-950">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 text-xs h-fit">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                    {language === "ar" ? "ملخص الحساب" : language === "ku" ? "کۆی گشتی" : "Cart Summary"}
                  </h3>

                  <div className="space-y-2 text-slate-500">
                    <div className="flex justify-between">
                      <span>{language === "ar" ? "المجموع الفرعي:" : language === "ku" ? "کۆی سەرەتایی:" : "Subtotal:"}</span>
                      <span className="font-bold text-slate-800">
                        ${cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>{language === "ar" ? "تخفيض القسيمة:" : language === "ku" ? "داشکاندنی کۆپۆن:" : "Coupon Discount:"}</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-2 text-slate-900 font-extrabold text-sm">
                      <span>{language === "ar" ? "الكلي:" : language === "ku" ? "کۆی گشتی:" : "Total Amount:"}</span>
                      <span>
                        ${cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      alert(language === "ar" ? "الرجاء استخدام زر الشراء السريع لتسجيل الطلب فوراً بنظام الأتمتة الإقليمي!" : language === "ku" ? "تکایە دوگمەی 'Checkout' داواکاری بەکاربێنە بۆ ناردنی بەستەری خێرا." : "Please trigger full Checkout via our floating cart panel or details dialog for automated logistics processing!");
                    }}
                    className="w-full rounded-xl bg-slate-900 py-2.5 font-bold text-white hover:bg-slate-800 transition-colors text-center cursor-pointer"
                  >
                    {language === "ar" ? "الذهاب للدفع" : language === "ku" ? "تەواوکردنی کڕین" : "Proceed to Checkout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NEW VIEW: WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div>
              <h2 className="font-sans text-2xl font-bold text-slate-900 tracking-tight">
                {language === "ar" ? "قائمة رغباتك المفضلة" : language === "ku" ? "لیستی دڵخوازەکانت" : "Your Saved Wishlist"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === "ar" ? "احفظ حاويات الطعام الفاخرة التي تهم براندك لتطلبها لاحقاً." : language === "ku" ? "دەفری دڵخوازی خۆت بپارێزە بۆ کڕینی خێرا لە کاتێکی تردا." : "Save premium food containers for fast-tracked recurring logs."}
              </p>
            </div>

            {wishlist.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4">
                <div className="rounded-full bg-slate-50 p-4 text-slate-300 w-fit mx-auto">
                  <Heart size={40} />
                </div>
                <p className="text-xs text-slate-400">
                  {language === "ar" ? "لم تحفظ أي منتجات حتى الآن!" : language === "ku" ? "هیچ بەرهەمێکت زیاد نەکردووە بۆ دڵخوازەکانت!" : "No saved items found."}
                </p>
                <button
                  onClick={() => setActiveTab("shop")}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {language === "ar" ? "تصفح المنتجات" : language === "ku" ? "بگەڕێ بۆ بەرهەمەکان" : "Browse Shop Catalog"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map((id) => {
                  const p = customProducts.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 flex gap-4 text-xs shadow-sm justify-between items-center">
                      <div className="flex gap-3 min-w-0">
                        <img
                          src={p.images[0]}
                          alt={p.title.en}
                          className="h-14 w-14 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate leading-tight">{p.title[language]}</h4>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{p.brand}</span>
                          <span className="font-bold text-slate-950 mt-1 block">${p.variants[0]?.price.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="rounded bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 hover:bg-slate-800 cursor-pointer text-center"
                        >
                          {language === "ar" ? "شراء" : language === "ku" ? "کڕین" : "Configure"}
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="text-[10px] text-slate-400 hover:text-red-500 font-bold"
                        >
                          {language === "ar" ? "إزالة" : language === "ku" ? "سڕینەوە" : "Remove"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CUSTOMER PROFILE VIEW (RESTRUCTURED) */}
        {activeTab === "profile" && (userRole === "customer" || userRole === "admin") && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                {userRole === "admin" ? "Admin Session Profile" : "Customer Dashboard"}
              </span>
              <h2 className="mt-4 font-sans text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Purchases & Wishlist
              </h2>
              <p className="mt-1 text-xs text-slate-500">Track order fulfillment and access customized logs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Profile Details Card */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-slate-100 p-3 text-slate-700">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-slate-900 leading-tight">
                        {userRole === "admin" ? "Systems Administrator" : "Verified Customer Account"}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {userRole === "admin" ? "admin@packingstore.com" : "customer@packingstore.com"}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3 space-y-2">
                    <div><strong>Registered State:</strong> {userRole === "admin" ? "Global Admin Bridge" : "Certified Customer Bridge"}</div>
                    <div><strong>Active Session Location:</strong> Iraq Region (Erbil / Sulaymaniyah)</div>
                    <div><strong>Session Orders count:</strong> {sessionOrders.length} records</div>
                  </div>

                  <button
                    onClick={() => {
                      setUserRole("guest");
                      setActiveTab("home");
                    }}
                    className="w-full mt-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 py-2.5 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} />
                    {language === "ar" ? "تسجيل الخروج" : language === "ku" ? "چوونەدەرەوە" : "Logout / Switch to Guest"}
                  </button>
                </div>

                {/* Recently Viewed Block */}
                {recentlyViewed.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h4 className="font-sans text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
                      {currentCopy.recentlyViewedTitle}
                    </h4>
                    <div className="space-y-3">
                      {recentlyViewed.map((id) => {
                        const p = customProducts.find((x) => x.id === id);
                        if (!p) return null;
                        return (
                          <div key={p.id} className="flex gap-2 text-xs">
                            <img
                              src={p.images[0]}
                              alt={p.title.en}
                              className="h-10 w-10 rounded object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="font-bold text-slate-900 truncate leading-tight">{p.title[language]}</h5>
                              <button
                                onClick={() => setSelectedProduct(p)}
                                className="text-[9px] font-bold text-slate-400 hover:text-slate-800 block mt-1"
                              >
                                View Specs
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Saved Wishlist Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="font-sans text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                    {currentCopy.wishlistTitle}
                  </h4>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400">
                      No favorite items saved yet. Tap the heart icons on packaging lists to record products here!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlist.map((id) => {
                        const p = customProducts.find((x) => x.id === id);
                        if (!p) return null;
                        return (
                          <div key={p.id} className="rounded-xl border border-slate-150 p-3 flex gap-3 text-xs">
                            <img
                              src={p.images[0]}
                              alt={p.title.en}
                              className="h-14 w-14 shrink-0 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <h5 className="font-bold text-slate-900 truncate">{p.title[language]}</h5>
                                <span className="text-[9px] text-slate-400 mt-0.5 block">{p.brand}</span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-slate-900">${p.variants[0]?.price.toFixed(2)}</span>
                                <button
                                  onClick={() => setSelectedProduct(p)}
                                  className="text-[10px] font-bold text-slate-900 hover:underline"
                                >
                                  Buy
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Submissions Logs */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="font-sans text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                    My Order History Log
                  </h4>

                  {sessionOrders.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      You haven't initiated any checkout orders in this session.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sessionOrders.map((o) => (
                        <div key={o.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
                          <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                            <div>
                              <span className="font-bold text-slate-900 font-mono">{o.id}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">Initiated: {o.date}</span>
                            </div>
                            <span className="rounded bg-pink-50 text-pink-700 border border-pink-100 px-2.5 py-0.5 font-bold font-mono">
                              {o.status}
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-slate-600">
                            <div><strong>Recipient Name:</strong> {o.customerName}</div>
                            <div><strong>City Shipping:</strong> {o.city}</div>
                            <div><strong>Full Address:</strong> {o.address}</div>
                            <div><strong>Voucher Used:</strong> {o.couponUsed || "None"}</div>
                            <div><strong>Final Cost Paid:</strong> ${o.totalAmount.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECURED VIEW: ADMIN VIEW */}
        {activeTab === "admin" && userRole === "admin" && (
          <AdminDashboard
            products={customProducts}
            onUpdateVariantStock={handleUpdateVariantStock}
            onUpdateVariantPrice={handleUpdateVariantPrice}
            orders={sessionOrders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

      </main>

      {/* 2. PRODUCT DETAILED MODAL VIEW */}
      {selectedProduct && selectedVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/80 backdrop-blur-sm p-1.5 text-slate-400 hover:bg-white hover:text-slate-800 shadow-sm transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Left Column: Visual Gallery */}
            <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col justify-between border-r border-slate-100">
              <div className="flex-1 flex items-center justify-center min-h-[220px]">
                <img
                  src={selectedVariant.images?.[activeImageIdx] || selectedProduct.images[activeImageIdx] || selectedProduct.images[0]}
                  alt={selectedProduct.title.en}
                  className="max-h-[300px] rounded-xl object-contain shadow-sm"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 justify-center mt-4">
                {(selectedVariant.images?.length ? selectedVariant.images : selectedProduct.images).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-12 w-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx ? "border-slate-900 shadow-smScale-105" : "border-slate-200 opacity-60"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Detailed config Form */}
            <div className="md:w-1/2 p-6 overflow-y-auto max-h-[90vh] md:max-h-full">
              
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider block uppercase">
                    {selectedProduct.brand}
                  </span>
                  <h3 className="font-sans text-xl font-bold text-slate-900 tracking-tight leading-snug mt-1">
                    {selectedProduct.title[language]}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider">
                      {selectedVariant.sku}
                    </span>
                    <div className="flex items-center text-amber-500 text-xs font-bold">
                      <Star size={12} fill="currentColor" className="mr-0.5" />
                      <span>{selectedProduct.rating} ({selectedProduct.reviewCount} customer ratings)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "{selectedProduct.description[language]}"
                </p>

                {/* DYNAMIC VARIANT SELECTOR */}
                <div className="border-t border-slate-100 pt-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Select Capacity / Packaging Option:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProduct.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVariant(v);
                          setActiveImageIdx(0);
                        }}
                        className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          selectedVariant.id === v.id
                            ? "border-slate-900 bg-slate-50 shadow-sm ring-1 ring-slate-900"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span className="block text-xs font-bold text-slate-900">{v.capacity}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{v.packQty}</span>
                        <span className="block text-xs font-bold text-slate-950 mt-1.5">${v.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technical Specifications specifications Grid */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                    {currentCopy.specs}
                  </span>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] text-slate-600">
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="text-slate-400">{currentCopy.material}:</span>
                      <span className="font-semibold text-slate-800">{selectedProduct.specifications.material[language]}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="text-slate-400">{currentCopy.color}:</span>
                      <span className="font-semibold text-slate-800">{selectedProduct.specifications.color[language]}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="text-slate-400">{currentCopy.sku}:</span>
                      <span className="font-semibold text-slate-800 font-mono">{selectedVariant.sku}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="text-slate-400">{currentCopy.piecesPerPack}:</span>
                      <span className="font-semibold text-slate-800">{selectedProduct.specifications.piecesPerPack}</span>
                    </div>
                  </div>

                  {/* Certifications badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {selectedProduct.specifications.foodGrade && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✔ Food Grade APPROVED
                      </span>
                    )}
                    {selectedProduct.specifications.ecoFriendly && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✔ 100% Eco Friendly
                      </span>
                    )}
                    {selectedProduct.specifications.bpaFree && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✔ BPA Free
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom line selectors quantity & action buttons */}
                <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pricing Tier total:</span>
                      <span className="text-xl font-extrabold text-slate-900 block mt-0.5">
                        ${(selectedVariant.price * detailQuantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-3 py-1 bg-slate-50/50">
                      <button
                        onClick={() => setDetailQuantity(q => Math.max(1, q - 1))}
                        className="text-slate-500 hover:text-slate-900 p-1"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold text-slate-800 min-w-[16px] text-center">
                        {detailQuantity}
                      </span>
                      <button
                        onClick={() => setDetailQuantity(q => q + 1)}
                        className="text-slate-500 hover:text-slate-900 p-1"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <button
                      onClick={() => handleAddToCart(selectedProduct, selectedVariant, detailQuantity)}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white shadow-md transition-colors cursor-pointer"
                    >
                      {currentCopy.addToCart}
                    </button>
                    <button
                      onClick={() => triggerIgOrderDirectly(selectedProduct, selectedVariant, detailQuantity)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-xs font-semibold text-white shadow-md transition-colors cursor-pointer"
                    >
                      <Instagram size={14} />
                      {currentCopy.orderOnIg}
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* 3. FLOATING INSTAGRAM BUTTON AND DIRECT LAUNCHERS */}
      <button
        onClick={() => {
          setSelectedProduct(customProducts[0]);
          setSelectedVariant(customProducts[0].variants[0]);
          triggerIgOrderDirectly(customProducts[0], customProducts[0].variants[0], 1);
        }}
        className="fixed bottom-6 right-6 z-35 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Direct Instagram Order Support"
      >
        <Instagram size={24} />
      </button>

      {/* 4. PRODUCT COMPARISON FIXED SLIDEOVER PANEL */}
      {showComparePanel && compareList.length > 0 && (
        <div className="fixed bottom-4 left-4 z-40 w-full max-w-lg rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-2xl p-4 overflow-hidden transition-all">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw size={12} className="text-emerald-400 animate-spin" />
              {currentCopy.compTitle} ({compareList.length}/3 chosen)
            </h4>
            <button
              onClick={() => setShowComparePanel(false)}
              className="rounded-full p-1 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {compareList.map((item) => (
              <div key={item.id} className="relative rounded-lg bg-slate-800/60 border border-slate-700 p-2 text-[10px] flex flex-col justify-between">
                <button
                  onClick={() => setCompareList((prev) => prev.filter((p) => p.id !== item.id))}
                  className="absolute top-1 right-1 rounded-full bg-slate-900 p-0.5 text-slate-400 hover:text-white"
                >
                  <X size={10} />
                </button>
                <div>
                  <img src={item.images[0]} alt="img" className="h-10 w-full object-cover rounded mb-1" />
                  <strong className="block truncate leading-tight">{item.title[language]}</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Mat: {item.specifications.material[language]}</span>
                  <span className="text-[9px] text-slate-400 block">Cap: {item.variants[0].capacity}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(item);
                    setShowComparePanel(false);
                  }}
                  className="mt-2 w-full text-center py-0.5 rounded bg-slate-100 text-slate-900 font-bold text-[8px]"
                >
                  Configure
                </button>
              </div>
            ))}
          </div>

          {compareList.length < 3 && (
            <div className="text-[9px] text-slate-400 mt-2 italic text-center">
              Choose up to {3 - compareList.length} more containers in shop list to compare side-by-side.
            </div>
          )}
        </div>
      )}

      {/* 5. FLOATING WIZARD COMPONENT CONTAINER */}
      <PackagingFinderWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        language={language}
        onLaunchInstagramOrder={(pMock, vMock) => {
          setIsWizardOpen(false);
          setSelectedProductForIg(pMock);
          setSelectedVariantForIg(vMock);
          setQtyForIg(1);
          setIsIgModalOpen(true);
        }}
      />

      {/* 6. INSTAGRAM MESSAGE GENERATOR MODAL CONTAINER */}
      {selectedProductForIg && selectedVariantForIg && (
        <InstagramModal
          isOpen={isIgModalOpen}
          onClose={() => setIsIgModalOpen(false)}
          product={selectedProductForIg}
          selectedVariant={selectedVariantForIg}
          quantity={qtyForIg}
        />
      )}

      {/* 7. CART DRAWER CONTAINER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        language={language}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500 p-2 text-white">
                <Layers size={16} />
              </div>
              <h4 className="font-bold tracking-tight text-base">{currentCopy.siteName}</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premium disposable food packaging specifically tailored for cafés, bakeries, pizzerias, and gourmet restaurants in Erbil, Sulaymaniyah, Baghdad, and other Iraqi cities.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              {language === "ar" ? "روابط سريعة" : language === "ku" ? "بەستەرە خێراکان" : "Quick Links"}
            </h5>
            <ul className="text-xs text-slate-500 space-y-2">
              <li><button onClick={() => setActiveTab("home")} className="hover:text-slate-300 transition-colors">
                {language === "ar" ? "الرئيسية" : language === "ku" ? "سەرەکی" : "Home"}
              </button></li>
              <li><button onClick={() => setActiveTab("shop")} className="hover:text-slate-300 transition-colors">
                {language === "ar" ? "دليل المنتجات" : language === "ku" ? "کەتەلۆگی بەرهەمەکان" : "Shop Catalog"}
              </button></li>
              <li><button onClick={() => setActiveTab("about")} className="hover:text-slate-300 transition-colors">
                {language === "ar" ? "من نحن" : language === "ku" ? "دەربارەی ئێمە" : "About Us"}
              </button></li>
              <li><button onClick={() => setActiveTab("contact")} className="hover:text-slate-300 transition-colors">
                {language === "ar" ? "اتصل بنا" : language === "ku" ? "پەیوەندی" : "Contact"}
              </button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Customer Care</h5>
            <ul className="text-xs text-slate-500 space-y-2">
              <li><button onClick={() => { setActiveTab("home"); setIsWizardOpen(true); }} className="hover:text-slate-300 transition-colors">AI Packaging Finder</button></li>
              <li><button onClick={() => setIsCartOpen(true)} className="hover:text-slate-300 transition-colors">Secure Guest Checkout</button></li>
              <li><a href="https://instagram.com/packing_store_mock" target="_blank" className="hover:text-slate-300 transition-colors flex items-center gap-1"><Instagram size={12} /> Instagram DM Ordering</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Secure Credentials</h5>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 rounded-lg border border-slate-900 bg-slate-950 p-3">
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <span>Full compliance with secure server API structures. Credentials stored safely.</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 border-t border-slate-900 pt-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} Packing Store Ltd. All Rights Reserved.</span>
          <span>Certified Food-Grade Containers.</span>
        </div>
      </footer>

    </div>
  );
}

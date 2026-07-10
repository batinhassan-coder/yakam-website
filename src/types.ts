export interface ProductVariant {
  id: string;
  capacity: string;      // e.g., "8 oz", "12 oz", "16 oz", "500 ml", "Large"
  size: string;          // e.g., "80mm diameter", "24x24x4cm"
  packQty: string;       // e.g., "50 Pieces", "100 Pieces", "1,000 Pcs (Bulk Carton)"
  price: number;
  stock: number;
  sku: string;
  images: string[];      // Variant-specific images
}

export interface ProductBadge {
  type: 'new' | 'sale' | 'bestseller' | 'popular' | 'limited' | 'eco' | 'foodsafe' | 'delivery';
  label: {
    en: string;
    ar: string;
    ku: string;
  };
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: {
    en: string;
    ar: string;
    ku: string;
  };
  date: string;
  verified: boolean;
  avatar: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
}

export interface Product {
  id: string;
  title: {
    en: string;
    ar: string;
    ku: string;
  };
  category: {
    id: string;
    en: string;
    ar: string;
    ku: string;
  };
  brand: string;
  basePrice: number;
  description: {
    en: string;
    ar: string;
    ku: string;
  };
  features: {
    en: string[];
    ar: string[];
    ku: string[];
  };
  specifications: {
    material: { en: string; ar: string; ku: string };
    color: { en: string; ar: string; ku: string };
    barcode: string;
    piecesPerPack: string;
    packsPerCarton: string;
    microwaveSafe: boolean;
    freezerSafe: boolean;
    ecoFriendly: boolean;
    recyclable: boolean;
    foodGrade: boolean;
    bpaFree: boolean;
  };
  images: string[]; // fallback gallery
  variants: ProductVariant[];
  badges: ProductBadge[];
  rating: number;
  reviewCount: number;
  reviewsList: Review[];
}

export interface CartItem {
  id: string; // unique item id (productId + variantId)
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface FAQItem {
  id: string;
  question: {
    en: string;
    ar: string;
    ku: string;
  };
  answer: {
    en: string;
    ar: string;
    ku: string;
  };
  category: string;
}

export interface InstagramPost {
  id: string;
  type: 'image' | 'video' | 'reel';
  url: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption: string;
  duration?: string;
}

export type SupportedLanguage = 'en' | 'ar' | 'ku';

export type ActiveTab = 'home' | 'shop' | 'profile' | 'admin' | 'about' | 'contact' | 'login' | 'cart' | 'wishlist';

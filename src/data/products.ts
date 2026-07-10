import { Product, FAQItem, InstagramPost } from "../types";

export const CATEGORIES = [
  { id: 'all', en: 'All Products', ar: 'جميع المنتجات', ku: 'هەموو بەرهەمەکان' },
  { id: 'cups', en: 'Paper & Plastic Cups', ar: 'أكواب ورقية وبلاستيكية', ku: 'پەرداخی کاغەزی و بلاستیکی' },
  { id: 'boxes', en: 'Pizza & Burger Boxes', ar: 'علب البيتزا والبرجر', ku: 'بۆکسی پیتزا و هەمبەرگەر' },
  { id: 'containers', en: 'Food Containers & Bowls', ar: 'حاويات وأوعية الطعام', ku: 'دەفر و سینی خواردن' },
  { id: 'wrap', en: 'Wraps, Foils & Bags', ar: 'الأغلفة والرقائق والحقائب', ku: 'نايلۆن، سفره و عەلاگە' },
  { id: 'cutlery', en: 'Spoons, Straws & Napkins', ar: 'ملاعق، قش ومنديل', ku: 'کەوچک، چلوک و کلێنس' }
];

export const BRANDS = ["Packing Store Eco", "AeroVent Premium", "ThermoShield Pro", "SustainGuard"];

export const PRODUCTS: Product[] = [
  {
    id: "prod-cup-1",
    title: {
      en: "Premium Double-Wall Kraft Paper Cup",
      ar: "كوب ورقي كرافت مزدوج الجدار ممتاز",
      ku: "پەرداخی کاغەزی کرافتی دووقاتی لۆکس"
    },
    category: {
      id: "cups",
      en: "Paper & Plastic Cups",
      ar: "أكواب ورقية وبلاستيكية",
      ku: "پەرداخی کاغەزی و بلاستیکی"
    },
    brand: "Packing Store Eco",
    basePrice: 4.50,
    description: {
      en: "Designed with an innovative ripple double-wall exterior, this kraft paper cup provides superior thermal insulation. Keep your specialty coffees, teas, and hot cocoas steaming hot while ensuring your customers' hands remain perfectly cool without the need for additional paper sleeves.",
      ar: "تم تصميم هذا الكوب الورقي بطبقة كرافت مزدوجة خارجية مموجة ومبتكرة لتوفير عزل حراري فائق. حافظ على قهوتك المختصة، الشاي، والكاكاو الساخن دافئاً مع ضمان بقاء أيدي عملائك باردة تماماً دون الحاجة إلى أكمام ورقية إضافية.",
      ku: "ئەم پەرداخە کاغەزییە بە شێوازی دووقاتی شەپۆلدار دیزاین کراوە بۆ دابینکردنی باشترین گەرمی پارێزی. قاوە، چا و خواردنەوە گەرمەکانت بە گەرمی دەهێڵێتەوە لە کاتێکدا دەستی کڕیارەکانت بە تەواوی دەپارێزێت بەبێ پێویستبوونی کاغەزی زیادە."
    },
    features: {
      en: [
        "Dynamic double-wall corrugated design eliminates the need for hot sleeves",
        "Made from certified 100% sustainable food-grade kraft paper board",
        "Leak-resistant tight rim design fits standard travel lids perfectly",
        "Heat-retaining structure maintains beverage temperature up to 45 minutes"
      ],
      ar: [
        "تصميم مموج مزدوج الجدار يلغي الحاجة إلى أكمام الأكواب الساخنة",
        "مصنوع من ورق كرافت آمن غذائيًا بنسبة 100% ومستدام ومعتمد",
        "حافة دائرية محكمة ومقاومة للتسرب تتناسب تمامًا مع الأغطية القياسية",
        "هيكل يحتفظ بالحرارة ويحافظ على درجة حرارة المشروبات لمدة تصل إلى 45 دقيقة"
      ],
      ku: [
        "دیزاینی دووقاتی شەپۆلدار پێویستی بە بەکارهێنانی کاغەزی پارێزەر ناهێڵێت",
        "دروستکراوە لە کاغەزی کرافتی ١٠٠٪ تەندروست و دۆستی ژینگە",
        "لێواری توند و دژە دزەکردن کە بە تەواوی لەگەڵ سەر قاپ دەگونجێت",
        "پێکهاتەی پارێزەری گەرمی کە تا ٤٥ خولەک پلەی گەرمی خواردنەوەکە دەپارێزێت"
      ]
    },
    specifications: {
      material: { en: "High-Density Kraft Paper & PLA Lining", ar: "ورق كرافت عالي الكثافة وبطانة PLA", ku: "کاغەزی کرافتی چڕی بەرز و ناوپۆشی PLA" },
      color: { en: "Organic Kraft Brown", ar: "بني كرافت طبيعي", ku: "قاوەیی کرافتی سروشتی" },
      barcode: "6971234560012",
      piecesPerPack: "50 Pcs",
      packsPerCarton: "20 Packs (1000 Pcs/Box)",
      microwaveSafe: false,
      freezerSafe: false,
      ecoFriendly: true,
      recyclable: true,
      foodGrade: true,
      bpaFree: true
    },
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=800"
    ],
    badges: [
      { type: "bestseller", label: { en: "Best Seller", ar: "الأكثر مبيعاً", ku: "پڕفرۆشترین" } },
      { type: "eco", label: { en: "Eco Friendly", ar: "صديق للبيئة", ku: "دۆستی ژینگە" } },
      { type: "foodsafe", label: { en: "Food Safe", ar: "آمن للغذاء", ku: "تەندروست بۆ خواردن" } }
    ],
    rating: 4.9,
    reviewCount: 142,
    variants: [
      {
        id: "v-cup-1-8oz",
        capacity: "8 oz (approx. 240ml)",
        size: "80mm Top Diameter",
        packQty: "50 Pcs (Retail Pack)",
        price: 4.50,
        stock: 120,
        sku: "PS-KW-08-P50",
        images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800"]
      },
      {
        id: "v-cup-1-12oz",
        capacity: "12 oz (approx. 350ml)",
        size: "90mm Top Diameter",
        packQty: "50 Pcs (Retail Pack)",
        price: 5.50,
        stock: 85,
        sku: "PS-KW-12-P50",
        images: ["https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800"]
      },
      {
        id: "v-cup-1-16oz",
        capacity: "16 oz (approx. 470ml)",
        size: "90mm Top Diameter",
        packQty: "50 Pcs (Retail Pack)",
        price: 6.50,
        stock: 50,
        sku: "PS-KW-16-P50",
        images: ["https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=800"]
      },
      {
        id: "v-cup-1-12oz-bulk",
        capacity: "12 oz (approx. 350ml)",
        size: "90mm Top Diameter",
        packQty: "1,000 Pcs (Bulk Carton)",
        price: 92.00,
        stock: 15,
        sku: "PS-KW-12-C1000",
        images: ["https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800"]
      }
    ],
    reviewsList: [
      {
        id: "rev-1",
        customerName: "Ahmad K. (Sulaymaniyah)",
        rating: 5,
        comment: {
          en: "These cups are amazing! Our cafe guests always mention how thick they are. No heat sleeves required at all, which saves us money.",
          ar: "هذه الأكواب رائعة للغاية! زبائن المقهى يثنون دائماً على سماكتها وجودتها. لا نحتاج لأكمام أكواب إضافية، مما يوفر لنا الكثير.",
          ku: "ئەم پەرداخانە نایابن! کڕیارانی کافێیەکەمان هەمیشە باسی ئەستووری و باشی پەرداخەکان دەکەن. هیچ پێویست بە کاغەزی زیادە ناکات کە ئەمەش پارەمان بۆ دەگێڕێتەوە."
        },
        date: "2026-06-25",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
      },
      {
        id: "rev-2",
        customerName: "Lana O. (Erbil)",
        rating: 4,
        comment: {
          en: "Very high quality kraft cups. Lids fit tightly, great for take-away orders. Wish they had custom branding options in low MOQ.",
          ar: "أكواب كرافت بجودة عالية جداً. الأغطية تتطابق بإحكام، وهي مثالية لطلبات التوصيل والوجبات السريعة. نتمنى توفر طباعة خاصة بكميات قليلة.",
          ku: "پەرداخی کوالێتی زۆر بەرز. سەر قاپەکەی بە توندی دادەخرێت و زۆر باشە بۆ سەفەری. هیوادارم لۆگۆی خۆمانی لەسەر چاپ بکەن بە ژمارەی کەم."
        },
        date: "2026-07-02",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
      }
    ]
  },
  {
    id: "prod-container-2",
    title: {
      en: "Eco Leak-Proof Salad Bowl with PET Lid",
      ar: "وعاء سلطة صديق للبيئة مضاد للتسرب مع غطاء PET",
      ku: "قاپ یان کاسەی سلطەی دۆستی ژینگە دژە دزەکردن لەگەڵ سەر قاپی PET"
    },
    category: {
      id: "containers",
      en: "Food Containers & Bowls",
      ar: "حاويات وأوعية الطعام",
      ku: "دەفر و سینی خواردن"
    },
    brand: "Packing Store Eco",
    basePrice: 8.90,
    description: {
      en: "Perfect for healthy salad bowls, dynamic poke orders, pasta lunches, and general catering. Crafted with an internal bio-lining that makes it 100% greaseproof and leak-proof. Complete with a crystal-clear premium PET dome lid that locks in freshness while offering gorgeous display value for grab-and-go displays.",
      ar: "مثالي لأوعية السلطات الصحية، أطباق البوك الديناميكية، معكرونة الغداء، والمطاعم بشكل عام. مصنوع ببطانة داخلية حيوية تجعله مقاوماً للزيوت والتسرب بنسبة 100%. يأتي مع غطاء مقبب شفاف للغاية يحفظ النضارة ويعرض الوجبات بشكل جذاب للعملاء.",
      ku: "گونجاوە بۆ زەڵاتەی تەندروست، پاستا، و خواردنی ئامادەکراو. دروستکراوە بە ناوپۆشێکی بایۆ کە وای لێدەکات ١٠٠٪ بەرگری لە بەرامبەر چەوری و دزەکردن هەبێت. لەگەڵ سەر قاپی PETی ڕوون کە تازەیی خواردنەکە دەپارێزێت."
    },
    features: {
      en: [
        "100% greaseproof barrier resists oil, dressings, and vinegar perfectly",
        "Includes airtight snap-on crystal clear PET lids for brilliant presentation",
        "Stackable rigid structure designed specifically for delivery optimization",
        "Completely eco-friendly and compostable paper base"
      ],
      ar: [
        "حاجز مقاوم للزيوت بنسبة 100% يقاوم الزيت والصلصات والخل تمامًا",
        "يتضمن غطاء PET محكم الإغلاق وشفاف للغاية لتقديم رائع وطازج",
        "هيكل متين وقابل للتكديس مصمم خصيصًا لتسهيل التوصيل",
        "قاعدة ورقية صديقة للبيئة بالكامل وقابلة للتحلل"
      ],
      ku: [
        "١٠٠٪ دژە چەوری کە بەرگری بەرامبەر ڕۆن، سۆس و سرکە دەکات",
        "لەگەڵ سەر قاپی PETی زۆر ڕوون کە بە توندی دادەخرێت",
        "پێکهاتەیەکی ڕەق کە دەتوانرێت بە ئاسانی لەسەر یەک دابنرێن بۆ گواستنەوە",
        "بنکەیەکی کاغەزی تەواو ژینگەیی و شیبۆوە لە سروشتدا"
      ]
    },
    specifications: {
      material: { en: "Clay-Coated Natural Kraft Board & PET Lid", ar: "ورق كرافت طبيعي مطلي بطبقة حماية وغطاء PET", ku: "کارتۆنی کرافتی سروشتی و سەر قاپی PET" },
      color: { en: "Natural Brown & Clear Lid", ar: "بني طبيعي مع غطاء شفاف", ku: "قاوەیی سروشتی لەگەڵ سەر قاپی ڕوون" },
      barcode: "6971234560029",
      piecesPerPack: "50 Pcs with Lids",
      packsPerCarton: "6 Packs (300 Sets/Box)",
      microwaveSafe: true,
      freezerSafe: true,
      ecoFriendly: true,
      recyclable: true,
      foodGrade: true,
      bpaFree: true
    },
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
    ],
    badges: [
      { type: "eco", label: { en: "Eco Friendly", ar: "صديق للبيئة", ku: "دۆستی ژینگە" } },
      { type: "new", label: { en: "New Arrival", ar: "وصل حديثاً", ku: "نوێترین" } },
      { type: "delivery", label: { en: "Fast Delivery", ar: "توصيل سريع", ku: "گواستنەوەی خێرا" } }
    ],
    rating: 4.8,
    reviewCount: 96,
    variants: [
      {
        id: "v-bowl-500ml",
        capacity: "500 ml",
        size: "150mm x 45mm",
        packQty: "50 Bowl + Lid Sets",
        price: 8.90,
        stock: 140,
        sku: "PS-SB-500-P50",
        images: ["https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"]
      },
      {
        id: "v-bowl-750ml",
        capacity: "750 ml",
        size: "150mm x 60mm",
        packQty: "50 Bowl + Lid Sets",
        price: 10.50,
        stock: 110,
        sku: "PS-SB-750-P50",
        images: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"]
      },
      {
        id: "v-bowl-1000ml",
        capacity: "1000 ml",
        size: "150mm x 78mm",
        packQty: "50 Bowl + Lid Sets",
        price: 12.00,
        stock: 65,
        sku: "PS-SB-1000-P50",
        images: ["https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"]
      }
    ],
    reviewsList: [
      {
        id: "rev-3",
        customerName: "Zana T. (Duhok)",
        rating: 5,
        comment: {
          en: "We run a health-food bar, and these salad bowls are our primary packaging. Customers love that the base is biodegradable. Absolutely leak-free.",
          ar: "ندير مطعمًا للوجبات الصحية، وهذه الأوعية هي تغليفنا الأساسي. يحب الزبائن حقيقة أن القاعدة قابلة للتحلل البيولوجي. خالية تمامًا من التسرب.",
          ku: "ئێمە ڕێستۆرانتی خواردنی تەندروستمان هەیە، و ئەم کاسانە سەرەکیترین پاکێجمانن. کڕیاران دڵخۆشن بەوەی کە ژێری کاسەکە شی دەبێتەوە. بە تەواوی بێ کێشەیە."
        },
        date: "2026-07-04",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
      }
    ]
  },
  {
    id: "prod-box-3",
    title: {
      en: "Heavy-Duty Corrugated Pizza Box",
      ar: "علبة بيتزا مموجة متينة للغاية",
      ku: "بۆکسی پیتزای کارتۆنی بەهێز"
    },
    category: {
      id: "boxes",
      en: "Pizza & Burger Boxes",
      ar: "علب البيتزا والبرجر",
      ku: "بۆکسی پیتزا و هەمبەرگەر"
    },
    brand: "AeroVent Premium",
    basePrice: 14.20,
    description: {
      en: "Engineered specifically for busy pizzerias and high-volume delivery. Our pizza boxes feature heavy-duty corrugated E-flute board with structural steam venting. Laminated internal layers maintain structural stiffness, trapping heat while preventing steam build-up, ensuring your gourmet crust stays perfectly crispy and hot all the way to your customer's doorstep.",
      ar: "مصمم خصيصاً لمطاعم البيتزا المزدحمة والتوصيل بكميات كبيرة. تتميز علب البيتزا لدينا بكرتون مموج من نوع E-flute عالي المتانة مع فتحات تهوية هيكلية للبخار. تحافظ الطبقات الداخلية المصفحة على صلابة الهيكل، مما يحبس الحرارة ويمنع تراكم الرطوبة، لتبقي العجينة مقرمشة وساخنة.",
      ku: "بۆ چێشتخانەی پیتزای قەرەباڵغ و گواستنەوەی خێرا بە تایبەت دروستکراوە. بۆکسەکانمان خاوەن کارتۆنی بەهێزی E-fluteن لەگەڵ ڕێڕەوی تایبەتی هەڵم. گەرمی دەهێڵێتەوە و ڕێگری دەکات لە دروستبوونی دڵۆپەی ئاو کە پیتزاکە نەرم دەکات."
    },
    features: {
      en: [
        "Premium corrugated E-flute build resists stack crushing during delivery",
        "Integrated dual-rear venting outlets release steam without cooling food",
        "Pre-creased lines allow for extremely fast folding and setup under rush hours",
        "Stunning organic kraft texture provides premium brand styling options"
      ],
      ar: [
        "هيكل E-flute مموج ممتاز يقاوم السحق والضغط أثناء التوصيل",
        "فتحات تهوية خلفية مزدوجة متكاملة تطلق البخار الزائد دون تبريد الطعام",
        "خطوط مطوية مسبقًا تتيح الطي السريع جدًا خلال أوقات الذروة",
        "ملمس كرافت عضوي رائع يوفر خيارات ترويجية متميزة للعلامات التجارية"
      ],
      ku: [
        "پێکهاتەی بەهێزی E-flute ڕێگری دەکات لە پانبوونەوە لە کاتی گواستنەوەدا",
        "کونە مدمجەکان هەڵمی زیادە دەردەکەن بەبێ ساردکردنەوەی پیتزاکە",
        "هێڵکاری ئامادەکراو کە ڕێگە دەدات لە چەند چرکەیەکدا بۆکسەکە دروست بکەیت",
        "دیزاینێکی قاوەیی سروشتی شیک کە نیشانەی لۆکسی چێشتخانەکەتە"
      ]
    },
    specifications: {
      material: { en: "Recycled Corrugated Kraft Board", ar: "كرتون كرافت مموج معاد تدويره", ku: "کارتۆنی کرافتی بەهێز" },
      color: { en: "Classic Kraft Brown / Clean White Inside", ar: "بني كرافت كلاسيكي / أبيض نظيف بالداخل", ku: "قاوەیی کلاسیک / سپی لە ناوەوە" },
      barcode: "6971234560036",
      piecesPerPack: "100 Pcs Bundle",
      packsPerCarton: "1 Bundle per Carton",
      microwaveSafe: false,
      freezerSafe: true,
      ecoFriendly: true,
      recyclable: true,
      foodGrade: true,
      bpaFree: true
    },
    images: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=800"
    ],
    badges: [
      { type: "bestseller", label: { en: "Best Seller", ar: "الأكثر مبيعاً", ku: "پڕفرۆشترین" } },
      { type: "eco", label: { en: "Eco Friendly", ar: "صديق للبيئة", ku: "دۆستی ژینگە" } }
    ],
    rating: 4.7,
    reviewCount: 78,
    variants: [
      {
        id: "v-pizza-9inch",
        capacity: "9 inch (Medium)",
        size: "23cm x 23cm x 4.5cm",
        packQty: "100 Pcs (Bundle)",
        price: 14.20,
        stock: 55,
        sku: "PS-PB-09-K100",
        images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800"]
      },
      {
        id: "v-pizza-12inch",
        capacity: "12 inch (Large)",
        size: "31cm x 31cm x 4.5cm",
        packQty: "100 Pcs (Bundle)",
        price: 18.50,
        stock: 40,
        sku: "PS-PB-12-K100",
        images: ["https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=800"]
      },
      {
        id: "v-pizza-15inch",
        capacity: "15 inch (XL)",
        size: "38cm x 38cm x 5.0cm",
        packQty: "100 Pcs (Bundle)",
        price: 24.00,
        stock: 25,
        sku: "PS-PB-15-K100",
        images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800"]
      }
    ],
    reviewsList: [
      {
        id: "rev-4",
        customerName: "Mustafa S. (Baghdad)",
        rating: 5,
        comment: {
          en: "Solid pizza boxes! They do not get soggy even with extra steam from cheesy pizzas. Highly recommend this size and material.",
          ar: "علب بيتزا ممتازة وقوية! لا تصبح لينة أو مبللة حتى مع البخار الزائد من الجبن والبيتزا الساخنة. نوصي بها وبشدة.",
          ku: "بۆکسی پیتزای زۆر بەهێز! بە هەڵمی پیتزای گەرم و پڕ چەوری نەرم نابێتەوە. زۆر پێشنیاری دەکەم."
        },
        date: "2026-06-18",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
      }
    ]
  },
  {
    id: "prod-wrap-4",
    title: {
      en: "Enterprise High-Cling Food Wrap Film",
      ar: "رول تغليف الطعام عالي الالتصاق للمنشآت",
      ku: "نایلۆنی لۆکس و توندی پێچانی خواردن"
    },
    category: {
      id: "wrap",
      en: "Wraps, Foils & Bags",
      ar: "الأغلفة والرقائق والحقائب",
      ku: "نایلۆن، سفره و عەلاگە"
    },
    brand: "ThermoShield Pro",
    basePrice: 12.50,
    description: {
      en: "Our industrial-strength PVC food cling wrap offers exceptional puncture resistance, high stretch elasticity, and premium stickiness. It creates a flawless oxygen barrier that locks in moisture and delays oxidation, keeping raw ingredients, leftovers, catering platters, and bakery items fresh for days.",
      ar: "يوفر رول تغليف الطعام القوي والمرن المصنوع من الـ PVC مقاومة استثنائية للثقب، مرونة تمدد عالية، والتصاقاً ممتازاً. يشكل حاجزاً يمنع دخول الأكسجين مما يحافظ على نضارة المكونات والوجبات لأيام.",
      ku: "ئەم نایلۆنی پێچانەوەیە تایبەتە بە کارگەی خواردن و چێشتخانەکان. بەهێزە، ناڕدڕێت و بە باشترین شێوە دەنووسێت بە دەفرەکەوە بۆ پاراستنی تەواوی خواردنەکە لە شێداربوون و ئۆکسجین."
    },
    features: {
      en: [
        "Unbeatable cling tension wraps safely around ceramic, metal, glass and plastic",
        "Includes premium slide cutter box for clean cuts, reducing waste by 30%",
        "Microwave-safe under moderate temperatures for fast heating tasks",
        "Extra-long commercial grade rolls fit for standard dispenser boxes"
      ],
      ar: [
        "قوة التصاق لا مثيل لها تلتف بأمان حول السيراميك والمعدن والزجاج والبلاستيك",
        "تتضمن علبة كرتون مجهزة بقطاعة منزلقة لقص نظيف، مما يقلل الهدر بنسبة 30%",
        "آمن للاستخدام في الميكروويف في درجات الحرارة المعتدلة للمهام السريعة",
        "لفات طويلة جداً بمستوى تجاري تناسب صناديق الموزع القياسية"
      ],
      ku: [
        "هێزی نووسانی بێوێنە لەسەر سیرامیک، کانزا، شووشە و بلاستیک",
        "لەگەڵ بۆکسی بڕینی تایبەت کە ڕێگری دەکات لە بەهەدەردانی نایلۆنەکە بە ڕێژەی ٣٠٪",
        "دەتوانرێت بەکاربهێنرێت لە مایکڕۆوەیڤ بۆ گەرمکردنەوەی خێرا",
        "ڕوولی زۆر درێژ کە گونجاوە بۆ بەکارهێنانی زۆری بازرگانی"
      ]
    },
    specifications: {
      material: { en: "Premium Grade PVC Cling Film", ar: "بلاستيك PVC عالي الجودة والالتصاق", ku: "نایلۆنی کوالێتی بەرزی PVC" },
      color: { en: "Ultra-Transparent Clear", ar: "شفاف للغاية", ku: "تەواو ڕوون" },
      barcode: "6971234560043",
      piecesPerPack: "1 Large Roll with Slider Cutter",
      packsPerCarton: "6 Rolls per Master Box",
      microwaveSafe: true,
      freezerSafe: true,
      ecoFriendly: false,
      recyclable: true,
      foodGrade: true,
      bpaFree: true
    },
    images: [
      "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&q=80&w=800"
    ],
    badges: [
      { type: "popular", label: { en: "Most Popular", ar: "الأكثر شعبية", ku: "پڕبینەرترین" } },
      { type: "foodsafe", label: { en: "Food Grade", ar: "آمن للغذاء", ku: "تەندروست بۆ خواردن" } }
    ],
    rating: 4.6,
    reviewCount: 43,
    variants: [
      {
        id: "v-wrap-30cm",
        capacity: "30cm Width x 300m",
        size: "30cm Roll",
        packQty: "1 Roll in Cutter Box",
        price: 12.50,
        stock: 90,
        sku: "PS-CW-30-300",
        images: ["https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&q=80&w=800"]
      },
      {
        id: "v-wrap-45cm",
        capacity: "45cm Width x 300m",
        size: "45cm Roll",
        packQty: "1 Roll in Cutter Box",
        price: 17.50,
        stock: 45,
        sku: "PS-CW-45-300",
        images: ["https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&q=80&w=800"]
      }
    ],
    reviewsList: [
      {
        id: "rev-5",
        customerName: "Rayan M. (Erbil)",
        rating: 4,
        comment: {
          en: "Excellent cling wrap. The built-in slide cutter makes wrapping 100 catering platters a breeze. Highly recommended for commercial kitchens.",
          ar: "غلاف التصاق ممتاز ورائع. القطاعة المنزلقة المدمجة تجعل تغليف 100 طبق من طلبات البوفيه أمراً في غاية السهولة والسرعة.",
          ku: "نایلۆنێکی زۆر باشە. هێڵکار و بڕەرە منزڵقەکەی ناو بۆکسەکە کارەکە زۆر خێرا دەکات بۆ چێشتخانە گەورەکان."
        },
        date: "2026-05-12",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
      }
    ]
  },
  {
    id: "prod-cutlery-5",
    title: {
      en: "Eco-Friendly Birchwood Fork & Spoon Set",
      ar: "مجموعة ملاعق وشوك خشب البتولا الصديقة للبيئة",
      ku: "سێتی کەوچک و چەتاڵی دارینی لۆکس و سروشتی"
    },
    category: {
      id: "cutlery",
      en: "Spoons, Straws & Napkins",
      ar: "ملاعق، قش ومنديل",
      ku: "کەوچک، چلوک و کلێنس"
    },
    brand: "SustainGuard",
    basePrice: 5.80,
    description: {
      en: "Provide an elegant, modern, and completely plastic-free eating experience for your delivery and takeaway guests. Made from beautifully polished, certified sustainable white birchwood, these sturdy spoons and forks are free of chemicals, dyes, or glaze, and feature an incredibly smooth mouthfeel without splintering.",
      ar: "وفر تجربة طعام أنيقة وعصرية وخالية تماماً من البلاستيك لضيوفك في طلبات التيك أواي والتوصيل. مصنوعة من خشب البتولا الأبيض المصقول والمستدام، وخالية من المواد الكيميائية والأصباغ والطلاء الزجاجي.",
      ku: "ئەم سێتە دارینە شیکە ئەزموونێکی نوێ و دوور لە بلاستیک بە کڕیارەکانت دەبەخشێت. دروستکراوە لە داری بتولای سپی زۆر ساف کە بە هیچ شێوەیەک زیانی نییە و نادڕێت."
    },
    features: {
      en: [
        "100% natural and compostable white birchwood disintegrates in 90 days",
        "Heat-resistant rigid design handles hot soups and heavy steaks with ease",
        "Polished double-tumble process ensures exceptionally smooth edges",
        "Perfect replacement for traditional single-use petroleum plastic utensils"
      ],
      ar: [
        "طبيعي 100% وقابل للتحلل بالكامل، يتفكك في غضon 90 يوماً فقط",
        "تصميم متين ومقاوم للحرارة يتعامل مع الحساء الساخن والوجبات الثقيلة بسهولة",
        "تلميع مزدوج يضمن حواف ناعمة للغاية وملمس رائع ومريح بالفم",
        "بديل مثالي لأدوات المائدة البلاستيكية التقليدية الملوثة للبيئة"
      ],
      ku: [
        "١٠٠٪ سروشتی و دۆستی ژینگە کە لە ماوەی ٩٠ ڕۆژدا تێکەڵ بە سروشت دەبێتەوە",
        "بەرگری گەرمی بەهێز کە بەرگەی شۆربای گەرم و خواردنە قورسەکان دەگرێت",
        "سافکردنی دووقات کە پێست ناڕوشێنێت و لێوارەکانی زۆر سافن",
        "جێگرەوەیەکی نایاب بۆ کەوچک و چەتاڵی بلاستیکی زیانبەخش"
      ]
    },
    specifications: {
      material: { en: "100% Organic Smooth Birchwood", ar: "خشب البتولا العضوي المصقول 100%", ku: "داری بتولای ١٠٠٪ سروشتی" },
      color: { en: "Natural Light Birch Wood", ar: "خشب البتولا الفاتح الطبيعي", ku: "ڕەنگی داری سروشتی گەش" },
      barcode: "6971234560050",
      piecesPerPack: "100 Pcs (50 Forks + 50 Spoons)",
      packsPerCarton: "20 Packs (2000 Pcs/Box)",
      microwaveSafe: false,
      freezerSafe: true,
      ecoFriendly: true,
      recyclable: true,
      foodGrade: true,
      bpaFree: true
    },
    images: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=800"
    ],
    badges: [
      { type: "eco", label: { en: "100% Compostable", ar: "قابل للتحلل بالكامل", ku: "تەواو شیبۆوە" } },
      { type: "limited", label: { en: "Eco Gold Standard", ar: "المعيار البيئي الذهبي", ku: "ستانداردی زێڕینی ژینگەیی" } }
    ],
    rating: 4.9,
    reviewCount: 64,
    variants: [
      {
        id: "v-cutlery-100pcs",
        capacity: "16cm Standard Length",
        size: "160mm Spoons & Forks",
        packQty: "100 Pcs (50 Spoons + 50 Forks)",
        price: 5.80,
        stock: 150,
        sku: "PS-WCS-16-P100",
        images: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=800"]
      },
      {
        id: "v-cutlery-bulk",
        capacity: "16cm Standard Length",
        size: "160mm Spoons & Forks",
        packQty: "1,000 Pcs Bulk Carton (500s+500f)",
        price: 46.00,
        stock: 30,
        sku: "PS-WCS-16-C1000",
        images: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=800"]
      }
    ],
    reviewsList: [
      {
        id: "rev-6",
        customerName: "Darya H. (Sulaymaniyah)",
        rating: 5,
        comment: {
          en: "These wooden cutlery pieces are so smooth! Unlike cheaper versions, these have zero splintering. Clients appreciate our eco focus.",
          ar: "أدوات مائدة خشبية ناعمة للغاية ومصقولة بشكل رائع! على عكس الأنواع الرخيصة، هذه لا تحتوي على أي زوائد خشبية. العملاء يقدرون اهتمامنا بالبيئة.",
          ku: "ئەم کەوچک و چەتاڵە دارینانە زۆر سافن! بە پێچەوانەی جۆرە هەرزانەکانەوە هیچ دەردراوێکی تیژی داری نییە. کڕیارەکان سوپاسی گرنگیدانمان دەکەن بە ژینگە."
        },
        date: "2026-06-30",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
      }
    ]
  },
  {
    id: "prod-box-6",
    title: {
      en: "Premium Kraft Clamshell Burger Box",
      ar: "علبة برجر كرافت تيك أواي فاخرة",
      ku: "بۆکسی هەمبەرگەری کرافتی لۆکس"
    },
    category: {
      id: "boxes",
      en: "Pizza & Burger Boxes",
      ar: "علب البيتزا والبرجر",
      ku: "بۆکسی پیتزا و هەمبەرگەر"
    },
    brand: "Packing Store Eco",
    basePrice: 7.20,
    description: {
      en: "Elevate your gourmet burger presentation with our heavy-weight organic kraft clamshell boxes. Boasting high moisture tolerance and dynamic corner lock tabs, these boxes capture the heat of a fresh bun while ensuring steam escapes gracefully through rear vents to prevent any bun sogginess. Perfect for high-tier smash burger operations.",
      ar: "ارتقِ بطريقة تقديم وجبات البرجر الفاخرة مع علب كرافت ذات الوزن الثقيل والمقاومة للرطوبة. مجهزة بأقفال زوايا ديناميكية قوية، تحافظ هذه العلب على حرارة البرجر مع السماح للبخار الزائد بالخروج بنعومة لتجنب رطوبة الخبز.",
      ku: "بۆکیسی هەمبەرگەری کرافتی قورس بۆ چێشتخانە و هەمبەرگەرخانە نایابەکان. گەرمی هەمبەرگەرەکە دەپارێزێت بەبێ ئەوەی سەری نانەکە شێدار و نەرم ببێتەوە."
    },
    features: {
      en: [
        "Thick clay-coated grease barrier resists hot oils and mayonnaise stains",
        "Unique lock-clamshell system avoids accidental openings during delivery",
        "Heat-retaining organic board keeps sandwiches warm for up to 30 minutes",
        "100% biodegradable and compostable paperboard"
      ],
      ar: [
        "طبقة مقاومة للزيوت والدهون السميكة تمنع بقع الزيوت الحارة والمايونيز والصلصات",
        "نظام إغلاق فريد ومحكم يمنع الفتح العرضي أو المفاجئ أثناء النقل والتوصيل",
        "لوح كرتون عضوي يحتفظ بالحرارة ويبقي البرجر والوجبة دافئة لمدة تصل إلى 30 دقيقة",
        "ورق كرتون عضوي قابل للتحلل البيولوجي والتحلل العضوي بنسبة 100%"
      ],
      ku: [
        "ڕووکەشی ئەستووری دژە چەوری کە ڕێگری لە ڕۆن و پەڵەی سۆس دەکات",
        "سیستەمی قوفڵکردنی تایبەت کە ڕێگری دەکات لە کرانەوەی خۆبەخۆ لە کاتی گواستنەوەدا",
        "کارتۆنی سروشتی گەرمی پارێز کە هەمبەرگەرەکە تا ٣٠ خولەک بە گەرمی دەهێڵێتەوە",
        "١٠٠٪ کاغەزی شیبۆوە و پارێزراوی ژینگەیی"
      ]
    },
    specifications: {
      material: { en: "High-Weight Clay-Coated Organic Paperboard", ar: "ورق كرتون عضوي ثقيل الوزن مطلي بطبقة طينية", ku: "کارتۆنی کرافتی چڕی قورسی دژە ڕۆن" },
      color: { en: "Natural Kraft Brown Inside & Out", ar: "بني كرافت طبيعي بالداخل والخارج", ku: "قاوەیی کرافتی سروشتی لە ناوەوە و دەرەوە" },
      barcode: "6971234560067",
      piecesPerPack: "100 Pcs Clamshells",
      packsPerCarton: "5 Packs (500 Pcs/Box)",
      microwaveSafe: true,
      freezerSafe: false,
      ecoFriendly: true,
      recyclable: true,
      foodGrade: true,
      bpaFree: true
    },
    images: [
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800"
    ],
    badges: [
      { type: "bestseller", label: { en: "Best Seller", ar: "الأكثر مبيعاً", ku: "پڕفرۆشترین" } },
      { type: "foodsafe", label: { en: "Microwave Safe", ar: "آمن للميكروويف", ku: "بەکارهێنان لە مایکڕۆوەیڤ" } }
    ],
    rating: 4.8,
    reviewCount: 115,
    variants: [
      {
        id: "v-burger-standard",
        capacity: "Standard Size (10x10x8cm)",
        size: "10.5cm x 10.5cm x 8.5cm",
        packQty: "100 Pcs Clamshell Pack",
        price: 7.20,
        stock: 220,
        sku: "PS-BB-STD-P100",
        images: ["https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800"]
      },
      {
        id: "v-burger-large",
        capacity: "XL Size (12x12x9cm)",
        size: "12.5cm x 12.5cm x 9.5cm",
        packQty: "100 Pcs Clamshell Pack",
        price: 9.50,
        stock: 130,
        sku: "PS-BB-XL-P100",
        images: ["https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800"]
      }
    ],
    reviewsList: [
      {
        id: "rev-7",
        customerName: "Dilan F. (Sulaymaniyah)",
        rating: 5,
        comment: {
          en: "These clamshells lock perfectly. Our gourmet burgers look exceptionally high-end inside them. Best purchase we made for our delivery launch.",
          ar: "هذه الصناديق تقفل بإحكام رائع وممتاز. وجبات البرجر الخاصة بنا تبدو فخمة وراقية جداً بداخلها. أفضل عملية شراء قمنا بها لإطلاق خدمات التوصيل.",
          ku: "ئەم بۆکسانە بە باشی قوفڵ دەبن. هەمبەرگەرە لۆکسەکانمان سیمایەکی زۆر سەرنجڕاکێش و گرانبەهایان پێوە دەردەکەوێت لە ناو ئەم بۆکسەدا."
        },
        date: "2026-07-07",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
      }
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: {
      en: "How does the Instagram Ordering system work?",
      ar: "كيف يعمل نظام الطلب عبر الإنستغرام؟",
      ku: "سیستەمی داواکارییەکەم لە ڕێگەی ئینستاگرامەوە چۆن کار دەکات؟",
    },
    answer: {
      en: "We've created a direct order bridge! Browse products, select your desired specifications and quantity, then click 'Order on Instagram'. You will instantly receive a custom DM text translated into English, Arabic, or Kurdish detailing the items, pricing, and your shipping information. Copy the text or click to send, opening an instant connection with our social team.",
      ar: "لقد أنشأنا جسراً مباشراً للطلب! تصفح المنتجات، حدد المواصفات والكمية المطلوبة، ثم اضغط على 'الطلب على إنستغرام'. ستتلقى فوراً رسالة منسقة ومترجمة باللغة العربية أو الإنجليزية أو الكردية تحتوي على تفاصيل المنتجات والأسعار ومعلومات الشحن الخاصة بك لتتمكن من إرسالها لفريقنا بضغطة زر.",
      ku: "ئێمە بەستەرێکی ڕاستەوخۆمان دروستکردووە! بەرهەمەکان ببینە، تایبەتمەندی و بڕی دڵخوازت دیاری بکە، پاشان کلیک بکە لەسەر 'Order on Instagram'. دەستبەجێ کورتەیەکی تەواوی داواکارییەکەت بە زمانەکانی کوردی، عەرەبی یان ئینگلیزی بە هەموو نرخ و وردەکارییەکانی شایستەی ناردن بۆ نوێنەری فرۆشتنی ئینستاگرامی ئێمە بۆ ئامادە دەکرێت."
    },
    category: "Ordering"
  },
  {
    id: "faq-2",
    question: {
      en: "Are your packaging products certified food-grade?",
      ar: "هل منتجات التعبئة والتغليف الخاصة بكم معتمدة وآمنة للغذاء؟",
      ku: "ئایا بەرهەمەکانی پاکێجینگەکەتان مۆڵەتی تەندروستی خواردنیان هەیە؟"
    },
    answer: {
      en: "Yes, 100% of our catalogue is certified Food-Grade. We strictly source from premium certified manufacturers who utilize raw chemical-free paperboard and BPA-free polymers. Every single item is completely safe for direct contact with food.",
      ar: "نعم، جميع منتجات الكتالوج الخاص بنا معتمدة وآمنة تماماً للغذاء. نحن نستورد بدقة من مصانع متميزة حاصلة على شهادات الجودة والتي تستخدم ورق كرتون خالي من الكيماويات وبوليمرات خالية تماماً من الـ BPA. كل قطعة آمنة تماماً للملامسة المباشرة للأغذية.",
      ku: "بەڵێ، ١٠٠٪ی کەتەلۆگەکەمان مۆڵەتی تەندروستی خواردنیان هەیە. ئێمە بە توندی سەرچاوەی کاڵاکانمان لە کارگە باوەڕپێکراوەکانەوە دابین دەکەین کە کاغەزی سروشتی بێ ماددەی کیمیایی و بلاستیکی دوور لە BPA بەکاردەهێنن."
    },
    category: "Quality"
  },
  {
    id: "faq-3",
    question: {
      en: "Can I order custom branding and logo printing?",
      ar: "هل يمكنني طلب طباعة خاصة لعلامتي التجارية وشعاري؟",
      ku: "ئایا دەتوانم داوای چاپکردنی لۆگۆ و ناوی تایبەتی خۆم بکەم لەسەر بەرهەمەکان؟"
    },
    answer: {
      en: "Absolutely! We specialize in custom logo and brand printing for coffee shops, restaurants, and catering brands. We offer low Minimum Order Quantities (MOQ) starting from just 5,000 Pcs. Contact us on Instagram to request custom samples and custom dimensions.",
      ar: "بكل تأكيد! نحن متخصصون في طباعة الشعارات والعلامات التجارية المخصصة للمقاهي والمطاعم ومحلات الحلويات. نحن نقدم كميات طلب دنيا منخفضة تبدأ من 5,000 قطعة فقط. اتصل بنا عبر رسائل إنستغرام لطلب عينات مجانية ومواصفات مخصصة.",
      ku: "بێگومان! ئێمە خزمەتگوزاری چاپی تایبەت پێشکەش دەکەین بۆ کافێ، ڕێستۆرانت و لۆگۆی براندەکان. کەمترین بڕی داواکاری بۆ چاپی تایبەت تەنها لە ٥,٠٠٠ دانەوە دەست پێدەکات. لە ڕێگەی ئینستاگرامەوە پەیوەندیمان پێوە بکە بۆ داواکردنی نموونە."
    },
    category: "Customization"
  }
];

export const INSTAGRAM_FEED: InstagramPost[] = [
  {
    id: "ig-1",
    type: "reel",
    url: "https://instagram.com/p/C_packing_store_1",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400",
    likes: 1240,
    comments: 86,
    caption: "Serve cold brew or specialty lattes? ☕️ Our double-wall premium kraft paper cups retain the temperature without burning your fingers. No sleeve required! Click 'Order on Instagram' to stock up your cafe today. #PackingStore #CoffeePacking #SulaymaniyahCafes #ErbilCoffee",
    duration: "0:15"
  },
  {
    id: "ig-2",
    type: "image",
    url: "https://instagram.com/p/C_packing_store_2",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400",
    likes: 850,
    comments: 34,
    caption: "Salad bar owners! 🥗 Say goodbye to messy delivery spills. Our clay-coated eco paper salad bowls are 100% greaseproof and leakproof, paired with secure crystal clear PET dome lids for unmatched visual display. Tap link in bio to shop! #HealthyEating #EcoFriendlyPackaging #ErbilFood #SulaymaniyahRestaurants"
  },
  {
    id: "ig-3",
    type: "reel",
    url: "https://instagram.com/p/C_packing_store_3",
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400",
    likes: 1980,
    comments: 112,
    caption: "Unboxing the perfect smash burger clamshell box! 🍔 Thicker organic board, airtight corner locks, and steam-vent features to prevent bun sogginess. Your gourmet burgers deserve premium containers. #SmashBurger #BurgerBox #PackagingStore #IraqRestaurants",
    duration: "0:22"
  },
  {
    id: "ig-4",
    type: "image",
    url: "https://instagram.com/p/C_packing_store_4",
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=400",
    likes: 640,
    comments: 15,
    caption: "Step into the future of eco-luxury dining. 🌿 White birchwood spoons, forks, and knives. Beautifully polished, 100% chemical-free and splinter-free mouthfeel. Order on Instagram to upgrade your delivery kits. #GoGreen #ZeroPlastic #IraqEco"
  }
];

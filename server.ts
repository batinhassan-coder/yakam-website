import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GoogleGenAI client to prevent startup crashes when API key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY environment variable is not configured. Falling back to rule-based engine.");
    return null;
  }
  
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. AI-powered Packaging Recommendation API
app.post("/api/recommendations", async (req, res) => {
  const { foodType, temperature, material, capacity, color, budget, language } = req.body;

  const currentLanguage = language || "en";

  try {
    const ai = getAiClient();
    
    if (ai) {
      // Prompt construction for Gemini
      const systemInstruction = `You are the lead packaging consultant at "Packing Store", a world-class premium disposable food packaging supplier.
Your objective is to provide professional, precise, and highly tailored packaging recommendations based on the customer's food service requirements.
You must respond in a beautiful JSON format following the schema provided. Translate your answers completely to the requested language: "${currentLanguage}" (en = English, ar = Arabic, ku = Kurdish Sorani).
Ensure that the names of the suggested products refer to actual real disposable food packaging types, and include a convincing, realistic architectural explanation of why this material and style is chosen (e.g., thermal insulation properties for hot soup, venting for crispy fries, grease resistance for burgers).`;

      const userPrompt = `A customer needs food packaging recommendations with the following criteria:
- Food/Drink Served: ${foodType}
- Temperature: ${temperature} (Hot or Cold)
- Preferred Material: ${material} (e.g., Paper, Plastic, Aluminium, Bio-degradable, or Any)
- Desired Capacity/Size: ${capacity} (e.g., 8oz, 12oz, 500ml, Large, standard, etc.)
- Preferred Color: ${color} (e.g., White, Kraft/Brown, Black, Transparent, or Any)
- Budget Constraint: ${budget} (Economy, Standard, or Premium)

Recommend exactly 3 highly relevant packaging products. For each product, provide:
1. Product Title (localized)
2. Perfect Category (e.g., Cups, Lunch Boxes, Bowls, Food Wrap, Boxes)
3. Material (localized)
4. Primary Advantage (e.g., 'Eco-friendly kraft backing', 'Double-wall heat shield', 'Crystal clear PET visual appeal')
5. Dynamic Fit Score (a percentage string like "98%")
6. Detailed Explanation/Justification (localized, explaining why it suits their criteria perfectly)
7. Mock SKU code (e.g., PS-PPC-12W)
8. Ideal estimated cost description (e.g., "Very cost-effective", "Value pack", "Premium tier choice")`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "A brief, highly professional localized expert summary of the recommendation set."
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    category: { type: Type.STRING },
                    material: { type: Type.STRING },
                    advantage: { type: Type.STRING },
                    fitScore: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    sku: { type: Type.STRING },
                    priceRating: { type: Type.STRING }
                  },
                  required: ["title", "category", "material", "advantage", "fitScore", "explanation", "sku", "priceRating"]
                }
              }
            },
            required: ["summary", "recommendations"]
          }
        }
      });

      if (response.text) {
        const parsedResponse = JSON.parse(response.text.trim());
        return res.json({ source: "gemini", ...parsedResponse });
      }
    }
  } catch (error) {
    console.error("Gemini AI API Error, utilizing fallback generator:", error);
  }

  // Robust Multilingual Rule-Based Fallback Generator
  console.log("Generating rule-based expert recommendations.");
  
  // Localized template arrays
  const localizations = {
    en: {
      summary: `Based on your request for serving ${temperature.toLowerCase()} ${foodType}, our design team recommends Kraft and Eco-Shield packaging ranges which excel in thermal endurance and structural integrity.`,
      options: [
        {
          title: `${material !== 'Any' ? material : 'Kraft'} Premium Double-Wall Container`,
          category: "Lunch Boxes & Bowls",
          material: material !== 'Any' ? material : "Heavy-Duty Kraft Paper",
          advantage: "Double-wall air insulation layer to preserve temperature and prevent leakage",
          fitScore: "97%",
          explanation: `Excellent choice for serving ${foodType}. The thick composite base handles moisture and fat without sagging, preserving a premium tableside presentation.`,
          sku: "PS-KDB-750",
          priceRating: budget === 'Premium' ? "Premium luxury finish" : "Cost-effective volume pack"
        },
        {
          title: `Eco-Vent Vapour-Safe Food Box`,
          category: "Boxes & Trays",
          material: "Eco Kraft Cardboard",
          advantage: "Integrated micro-perforations to prevent condensation while maintaining structural strength",
          fitScore: "94%",
          explanation: `Specifically selected for ${foodType}. Vents allow steam to escape so food stays perfectly crisp and fresh during transit.`,
          sku: "PS-EVB-MD",
          priceRating: "High-value commercial pack"
        },
        {
          title: "Sustain-Shield Compostable Protective Wrap",
          category: "Food Wrap & Cling",
          material: "Biodegradable Plant Starch",
          advantage: "High tensile strength, 100% compostable and microwave-safe",
          fitScore: "90%",
          explanation: `Provides a beautiful, tight protective layer. Certified food-grade barrier keeps grease contained while displaying the brand's eco-commitment.`,
          sku: "PS-SSW-100",
          priceRating: "Eco economy tier"
        }
      ]
    },
    ar: {
      summary: `بناءً على طلبك لتقديم ${foodType} ${temperature === 'Hot' ? 'الساخن' : 'البارد'}، يوصي فريق التصميم لدينا بمجموعة عبوات كرافت وحواجز الحماية البيئية التي تتميز بمقاومتها للحرارة ومتانتها الهيكلية.`,
      options: [
        {
          title: `وعاء ${material !== 'Any' ? material : 'ورق كرافت'} مزدوج الجدار الفاخر`,
          category: "علب الغداء والأوعية",
          material: material !== 'Any' ? material : "ورق كرافت عالي المتانة",
          advantage: "طبقة عازلة للهواء مزدوجة الجدار للحفاظ على الحرارة ومنع التسرب",
          fitScore: "97%",
          explanation: `خيار ممتاز لتقديم ${foodType}. القاعدة المركبة السميكة تتحمل الرطوبة والدهون دون انحناء، مما يحافظ على التقديم الفاخر.`,
          sku: "PS-KDB-750",
          priceRating: budget === 'Premium' ? "تشطيب فاخر متميز" : "عبوة اقتصادية موفرة للتكاليف"
        },
        {
          title: `علبة طعام بفتحات تهوية البخار الأمنة`,
          category: "العلب والصواني",
          material: "كرتون كرافت صديق للبيئة",
          advantage: "فتحات دقيقة مدمجة تمنع تكثف الرطوبة مع الحفاظ على القوة الهيكلية",
          fitScore: "94%",
          explanation: `تم اختيارها خصيصًا لـ ${foodType}. تسمح الفتحات بخروج البخار ليبقى الطعام مقرمشاً وطازجاً أثناء التوصيل.`,
          sku: "PS-EVB-MD",
          priceRating: "عبوة تجارية عالية القيمة"
        },
        {
          title: "غلاف وقائي قابل للتحلل صديق للبيئة",
          category: "أغلفة الطعام",
          material: "نشا نباتي قابل للتحلل الحيوي",
          advantage: "قوة شد عالية، قابل للتحلل 100% وآمن للاستخدام في الميكروويف",
          fitScore: "90%",
          explanation: `يوفر طبقة حماية محكمة وجميلة. يحافظ الحاجز المعتمد على احتواء الدهون مع إظهار الالتزام البيئي للعلامة التجارية.`,
          sku: "PS-SSW-100",
          priceRating: "فئة اقتصادية صديقة للبيئة"
        }
      ]
    },
    ku: {
      summary: `بەپێی داواکارییەکەت بۆ پێشکەشکردنی ${foodType}ی ${temperature === 'Hot' ? 'گەرم' : 'سارد'}، تیمی دیزاینمان پێشنیاری بەرهەمەکانی کاغەزی کرافت و دژە-شێ دەکات کە خاوەن بەرگرییەکی بەرزن لە بەرامبەر گەرمی و پاراستنی شێوازەکەیان.`,
      options: [
        {
          title: `قاپ و دەفری لۆکس بە دیواری دوانە لە ${material !== 'Any' ? material : 'کرافت'}`,
          category: "قاپ و دەفری خواردن",
          material: material !== 'Any' ? material : "کاغەزی کرافتی بەهێز",
          advantage: "دیواری دووقات بۆ پاراستنی پلەی گەرمی و ڕێگریکردن لە دزەکردنی شلەمەنی",
          fitScore: "97%",
          explanation: `هەڵبژاردنێکی نایاب بۆ پێشکەشکردنی ${foodType}. بنکە ئەستوورەکەی بەرگەی شێ و چەوری دەگرێت بەبێ تێکچوونی شێوەکەی.`,
          sku: "PS-KDB-750",
          priceRating: budget === 'Premium' ? "دیزاینی لۆکس و نایاب" : "گرووپی ئابووری و بەسوود"
        },
        {
          title: `بۆکسی خواردنی دژە هەڵم و شێداربوون`,
          category: "بۆکس و سینی",
          material: "کارتۆنی کرافتی دۆستی ژینگە",
          advantage: "کونە بچووکەکان ڕێگری دەکەن لە دروستبوونی دڵۆپە شێ بەبێ تێکدانی کارتۆنەکە",
          fitScore: "94%",
          explanation: `بە تایبەت بۆ ${foodType} هەڵبژێردراوە. کونەکان ڕێگە دەدەن هەڵمەکە بڕواتە دەرەوە بۆ ئەوەی خواردنەکە بە تەواوی کریسپی و تازە بمێنێتەوە.`,
          sku: "PS-EVB-MD",
          priceRating: "پاکێجی بازرگانی کوالێتی بەرز"
        },
        {
          title: "نایلۆنی پارێزەری شیبۆوەی دۆستی ژینگە",
          category: "نایلۆنی خواردن",
          material: "نیشاستەی ڕووەکی ١٠٠٪ شیبۆوە",
          advantage: "بەرگری بەرز، دەتوانرێت لە مایکڕۆوەیڤ دابنرێت و ١٠٠٪ شیبۆوەیە لە سروشتدا",
          fitScore: "90%",
          explanation: `پارێزگارییەکی توند و جوان پێشکەش دەکات. ڕێگری لە چەوری دەکات و گرنگیدانی براندەکەت بە پاکوخاوێنی ژینگە دەردەخات.`,
          sku: "PS-SSW-100",
          priceRating: "ئاستی ئابووری دۆستی ژینگە"
        }
      ]
    }
  };

  const localizedData = localizations[currentLanguage as keyof typeof localizations] || localizations.en;

  res.json({
    source: "fallback",
    summary: localizedData.summary,
    recommendations: localizedData.options
  });
});

// 2. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 3. Mount Vite server middleware in development / static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA Fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Packing Store backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

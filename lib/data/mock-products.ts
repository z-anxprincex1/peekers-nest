import type { StoreName } from "@/lib/types";

interface MockProductSeed {
  source: StoreName;
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  shippingInfo: string;
  inStock: boolean;
  tags: string[];
  specs: string[];
}

export const mockCatalog: MockProductSeed[] = [
  {
    source: "Amazon",
    title: "Apple iPhone 15 Pro 128GB - Unlocked",
    description: "Flagship titanium iPhone with ProMotion display and A17 Pro chip.",
    category: "Smartphones",
    price: 949,
    originalPrice: 999,
    rating: 4.7,
    reviewCount: 1840,
    shippingInfo: "Free Prime delivery tomorrow",
    inStock: true,
    tags: ["iphone", "apple", "pro", "phone", "smartphone"],
    specs: ["6.1-inch OLED", "A17 Pro", "128GB storage", "48MP camera"]
  },
  {
    source: "Best Buy",
    title: "Apple iPhone 15 Pro 256GB - Natural Titanium",
    description: "Unlocked premium iPhone with a larger storage tier for creators.",
    category: "Smartphones",
    price: 1049,
    originalPrice: 1099,
    rating: 4.8,
    reviewCount: 928,
    shippingInfo: "Free 2-day shipping",
    inStock: true,
    tags: ["iphone", "apple", "pro", "phone", "smartphone"],
    specs: ["6.1-inch OLED", "A17 Pro", "256GB storage", "USB-C"]
  },
  {
    source: "Walmart",
    title: "Apple iPhone 15 Pro Renewed 128GB",
    description: "Refurbished unlocked iPhone 15 Pro inspected for value shoppers.",
    category: "Smartphones",
    price: 799,
    originalPrice: 899,
    rating: 4.2,
    reviewCount: 261,
    shippingInfo: "Free shipping in 3 days",
    inStock: true,
    tags: ["iphone", "apple", "renewed", "budget", "phone"],
    specs: ["6.1-inch OLED", "A17 Pro", "128GB storage", "Refurbished"]
  },
  {
    source: "Target",
    title: "Apple iPhone 15 128GB - Blue",
    description: "Base iPhone 15 option with excellent battery life and dynamic island.",
    category: "Smartphones",
    price: 729,
    originalPrice: 799,
    rating: 4.6,
    reviewCount: 510,
    shippingInfo: "Pickup today or free shipping",
    inStock: true,
    tags: ["iphone", "apple", "phone", "smartphone"],
    specs: ["6.1-inch OLED", "A16 Bionic", "128GB storage", "Dynamic Island"]
  },
  {
    source: "Amazon",
    title: "Acer Nitro 27-inch 1440p 180Hz Gaming Monitor",
    description: "Budget-friendly QHD monitor with fast refresh and IPS panel.",
    category: "Monitors",
    price: 229,
    originalPrice: 299,
    rating: 4.5,
    reviewCount: 1344,
    shippingInfo: "Free Prime shipping",
    inStock: true,
    tags: ["monitor", "27 inch", "1440p", "gaming", "budget"],
    specs: ["2560x1440", "180Hz", "IPS", "1ms response"]
  },
  {
    source: "Best Buy",
    title: "LG UltraGear 27-inch QHD 165Hz Monitor",
    description: "Balanced 1440p gaming monitor with strong color accuracy.",
    category: "Monitors",
    price: 249,
    originalPrice: 349,
    rating: 4.7,
    reviewCount: 902,
    shippingInfo: "Free shipping this week",
    inStock: true,
    tags: ["monitor", "27 inch", "1440p", "gaming", "lg"],
    specs: ["2560x1440", "165Hz", "IPS", "HDR10"]
  },
  {
    source: "Walmart",
    title: "Samsung Odyssey G5 27-inch 1440p Curved Monitor",
    description: "Immersive curved QHD display with excellent contrast.",
    category: "Monitors",
    price: 239,
    originalPrice: 329,
    rating: 4.4,
    reviewCount: 640,
    shippingInfo: "Free delivery in 2 days",
    inStock: false,
    tags: ["monitor", "27 inch", "1440p", "curved", "samsung"],
    specs: ["2560x1440", "165Hz", "VA panel", "1000R curve"]
  },
  {
    source: "Target",
    title: "Dell G2724D 27-inch QHD Gaming Monitor",
    description: "Reliable 1440p Dell display with strong value and clean stand design.",
    category: "Monitors",
    price: 244,
    originalPrice: 299,
    rating: 4.6,
    reviewCount: 388,
    shippingInfo: "Store pickup available",
    inStock: true,
    tags: ["monitor", "27 inch", "1440p", "dell", "gaming"],
    specs: ["2560x1440", "165Hz", "IPS", "G-Sync Compatible"]
  },
  {
    source: "Amazon",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description: "Class-leading ANC headphones with superb comfort and battery life.",
    category: "Headphones",
    price: 328,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 5260,
    shippingInfo: "Free Prime delivery",
    inStock: true,
    tags: ["headphones", "wireless", "noise cancelling", "sony", "premium"],
    specs: ["30-hour battery", "ANC", "Multipoint Bluetooth", "Fast charging"]
  },
  {
    source: "Best Buy",
    title: "Bose QuietComfort Ultra Wireless Headphones",
    description: "Premium comfort-focused ANC headphones with immersive audio mode.",
    category: "Headphones",
    price: 349,
    originalPrice: 429,
    rating: 4.7,
    reviewCount: 1445,
    shippingInfo: "Free shipping or pickup today",
    inStock: true,
    tags: ["headphones", "wireless", "noise cancelling", "bose", "premium"],
    specs: ["24-hour battery", "ANC", "Spatial audio", "Fold-flat design"]
  },
  {
    source: "Walmart",
    title: "Soundcore Space One Wireless Noise Cancelling Headphones",
    description: "Affordable ANC pick with long battery life and warm sound.",
    category: "Headphones",
    price: 99,
    originalPrice: 149,
    rating: 4.4,
    reviewCount: 2201,
    shippingInfo: "Free shipping in 2 days",
    inStock: true,
    tags: ["headphones", "wireless", "noise cancelling", "budget", "soundcore"],
    specs: ["40-hour battery", "ANC", "Hi-Res Audio", "Lightweight"]
  },
  {
    source: "Target",
    title: "JBL Live 770NC Wireless Noise Cancelling Headphones",
    description: "Mid-range ANC headphones with punchy sound and app controls.",
    category: "Headphones",
    price: 159,
    originalPrice: 199,
    rating: 4.3,
    reviewCount: 617,
    shippingInfo: "Pickup today at select stores",
    inStock: true,
    tags: ["headphones", "wireless", "noise cancelling", "jbl", "midrange"],
    specs: ["50-hour battery", "Adaptive ANC", "Bluetooth 5.3", "Ambient Aware"]
  }
];

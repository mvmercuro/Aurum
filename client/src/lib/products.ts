export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  thc: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  weight: string;
  type: "Sativa" | "Indica" | "Hybrid";
  effects: string[];
  description: string;
  tags?: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Wedding Cake Reserve",
    brand: "Aurum Farms",
    category: "Flower",
    thc: "28.5%",
    price: 58,
    image: "/images/wedding-cake.jpg",
    rating: 4.7,
    reviews: 268,
    weight: "1/2 oz",
    type: "Indica",
    effects: ["Relaxed", "Happy", "Euphoric"],
    description: "Wedding Cake is a potent indica-hybrid marijuana strain made by crossing Triangle Kush with Animal Mints. It provides relaxing and euphoric effects that calm the body and mind. This strain features a rich and tangy flavor profile with undertones of earthy pepper.",
    tags: ["Top Shelf", "High THC"]
  },
  {
    id: "2",
    name: "Blue Dream Sativa",
    brand: "Pacific Stone",
    category: "Flower",
    thc: "24.2%",
    price: 108,
    image: "/images/blue-dream.jpg",
    rating: 4.7,
    reviews: 148,
    weight: "1 oz",
    type: "Sativa",
    effects: ["Creative", "Energizing", "Focus"],
    description: "Blue Dream is a sativa-dominant hybrid marijuana strain made by crossing Blueberry with Haze. This strain produces a balanced high, along with effects such as cerebral stimulation and full-body relaxation. Blue Dream smells and tastes like sweet berries.",
    tags: ["Popular", "Daytime"]
  },
  {
    id: "3",
    name: "Gelato #41",
    brand: "Connected",
    category: "Flower",
    thc: "26.8%",
    price: 65,
    image: "/images/gelato.jpg",
    rating: 4.9,
    reviews: 312,
    weight: "1/8 oz",
    type: "Hybrid",
    effects: ["Euphoric", "Aroused", "Happy"],
    description: "Gelato is a hybrid marijuana strain made by crossing Sunset Sherbet with Thin Mint GSC. This strain produces a euphoric high accompanied by strong feelings of relaxation. Gelato features a fruity and creamy aroma.",
    tags: ["Exotic", "Staff Pick"]
  },
  {
    id: "4",
    name: "Jack Herer Classic",
    brand: "Heavy Hitters",
    category: "Flower",
    thc: "22.5%",
    price: 45,
    image: "/images/jack-herer.jpg",
    rating: 4.6,
    reviews: 89,
    weight: "1/8 oz",
    type: "Sativa",
    effects: ["Energetic", "Uplifted", "Focused"],
    description: "Jack Herer is a sativa-dominant cannabis strain that has gained as much renown as its namesake, the marijuana activist and author of The Emperor Wears No Clothes. Combining a Haze hybrid with a Northern Lights #5 and Shiva Skunk cross, Sensi Seeds created Jack Herer hoping to capture both cerebral elevation and heavy resin production.",
    tags: ["Classic", "Sativa"]
  },
  {
    id: "5",
    name: "OG Kush Original",
    brand: "Valley Grown",
    category: "Flower",
    thc: "25.1%",
    price: 50,
    image: "/images/og-kush.jpg",
    rating: 4.8,
    reviews: 420,
    weight: "1/8 oz",
    type: "Hybrid",
    effects: ["Hungry", "Sleepy", "Euphoric"],
    description: "OG Kush was first cultivated in Florida in the early ‘90s when a strain from Northern California was supposedly crossed with Chemdawg, Lemon Thai and a Hindu Kush plant from Amsterdam. The result was a hybrid with a unique terpene profile that boasts a complex aroma with notes of fuel, skunk, and spice.",
    tags: ["Legendary", "Strong"]
  },
  {
    id: "6",
    name: "Midnight Berry Pen",
    brand: "Luxe Vapes",
    category: "Vape",
    thc: "85.0%",
    price: 35,
    image: "/images/vape-category.jpg",
    rating: 4.9,
    reviews: 56,
    weight: "1g",
    type: "Indica",
    effects: ["Sleepy", "Relaxed"],
    description: "A potent indica vape cartridge perfect for nighttime use. Solventless extraction preserves the natural terpenes for a true-to-plant taste.",
    tags: ["Solventless"]
  },
  {
    id: "7",
    name: "Gold Leaf Truffles",
    brand: "Gourmet Edibles",
    category: "Edibles",
    thc: "100mg",
    price: 25,
    image: "/images/edible-category.jpg",
    rating: 5.0,
    reviews: 112,
    weight: "100mg",
    type: "Hybrid",
    effects: ["Happy", "Relaxed"],
    description: "Artisan chocolate truffles infused with premium cannabis distillate. Each piece contains 10mg of THC for easy dosing.",
    tags: ["Gluten Free"]
  }
];

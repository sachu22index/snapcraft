import logoImg from "@/assets/snapcraft-logo.jpg";
import bloomBlissImg from "@/assets/bloom-bliss-hamper.jpg";
import chocolateLoveImg from "@/assets/chocolate-love-box.jpg";
import roseBouquetImg from "@/assets/rose-bouquet.jpg";
import selfCareImg from "@/assets/self-care-box.jpg";
import anniversaryImg from "@/assets/anniversary-memories.jpg";
import gourmetImg from "@/assets/snapcraft-hamper.jpg";
import bouquetsImg from "@/assets/snapcraft-bouquets.jpg";
import weddingImg from "@/assets/snapcraft-wedding.jpg";
import framesImg from "@/assets/snapcraft-frames.jpg";
import hamperImg from "@/assets/hamper.jpeg";
import jumkaImg from "@/assets/Jumka set.jpeg";

export { logoImg };

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number | undefined;
  rating: number;
  reviewsCount: number;
  category: "hampers" | "bouquets" | "boxes" | "keepsakes" | "curated";
  categoryLabel: string;
  occasion: string[];
  image: string;
  additionalImages?: string[] | undefined;
  badge?: "Bestseller" | "Signature" | "Popular" | "Romantic" | "New" | undefined;
  inclusions: string[];
  customizable: boolean;
  isAvailable: boolean;
  leadTime: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "bloom-and-bliss",
    name: "Bloom & Bliss Hamper",
    slug: "bloom-and-bliss-hamper",
    tagline: "English garden roses, sparkling cider, artisan chocolates & raw honey",
    description:
      "Our signature luxury wicker basket overflowing with fresh pastel blooms, artisanal dark chocolates, wildflower honey, and fine celebratory cider.",
    longDescription:
      "The quintessential SnapCraft celebration gift. Handcrafted in our bespoke wicker basket, this hamper combines fresh garden roses and delicate lavender with Belgian dark chocolate bars, Cotswold sparkling apple cider, and pure raw honey with an artisanal wooden dipper. Hand-finished with a wide terracotta linen ribbon and personalized wax-sealed greeting card.",
    price: 3499,
    originalPrice: 3999,
    rating: 4.9,
    reviewsCount: 142,
    category: "hampers",
    categoryLabel: "Gift Hampers",
    occasion: ["Birthday", "Anniversary", "Celebration", "Congratulations"],
    image: bloomBlissImg,
    additionalImages: [bloomBlissImg, bouquetsImg, gourmetImg],
    badge: "Bestseller",
    inclusions: [
      "Signature Handwoven Wicker Basket with Terracotta Ribbon",
      "Fresh English Garden Roses & Dried Lavender Sprigs",
      "Artisanal Single-Origin Dark Chocolate Bars (2x)",
      "Raw Wildflower Valley Honey (250g) with Wooden Dipper",
      "Sparkling Apple Cider (Non-Alcoholic Celebration Edition)",
      "Personalized Hand-Lettered Wax-Sealed Note Card",
    ],
    customizable: true,
    isAvailable: true,
    leadTime: "Same day dispatch / 24 hrs pre-booking",
  },
  {
    id: "chocolate-love-box",
    name: "Chocolate Love Box",
    slug: "chocolate-love-box",
    tagline: "Hand-dipped chocolate strawberries, gold-leaf truffles & blush satin",
    description:
      "An irresistible collection of gourmet chocolate-dipped strawberries, handcrafted gold-dusted pralines, and fragrant dried rose petals in a keepsake blush box.",
    longDescription:
      "Crafted for lovers of pure decadence. Each box features ripe, juicy strawberries double-dipped in Belgian dark and milk chocolate with white drizzle, alongside artisan truffles finished with edible 24k gold leaf and crushed Sicilian pistachios. Presented in a luxury blush kraft box with satin ribbon.",
    price: 1899,
    originalPrice: 2299,
    rating: 4.95,
    reviewsCount: 98,
    category: "boxes",
    categoryLabel: "Chocolate Boxes",
    occasion: ["Anniversary", "Love", "Birthday", "Valentine"],
    image: chocolateLoveImg,
    additionalImages: [chocolateLoveImg, bouquetsImg],
    badge: "Romantic",
    inclusions: [
      "6 Handcrafted Dark & White Chocolate-Dipped Fresh Strawberries",
      "6 Artisanal Pralines with Edible Gold Leaf & Crushed Pistachio",
      "Fragrant Dried Damask Rose Petals Bedding",
      "Luxury Blush Kraft Keepsake Box with Golden Embossing",
      "Satin Ribbon Bow with Custom Message Tag",
    ],
    customizable: true,
    isAvailable: true,
    leadTime: "Made fresh daily / Pre-book recommended",
  },
  {
    id: "elegant-rose-bouquet",
    name: "Elegant Rose Bouquet",
    slug: "elegant-rose-bouquet",
    tagline: "Velvety peach and crimson garden roses wrapped in vintage kraft",
    description:
      "A breath-taking hand-tied floral arrangement featuring garden roses, fragrant eucalyptus, and gypsophila tied with a forest olive ribbon.",
    longDescription:
      "Express your deepest emotions with timeless elegance. Our florists hand-select only the freshest premium roses in complementary hues of blush, warm peach, and crimson. Enveloped in multiple layers of rustic kraft paper and crowned with our signature forest olive green satin ribbon.",
    price: 1499,
    originalPrice: 1799,
    rating: 4.88,
    reviewsCount: 115,
    category: "bouquets",
    categoryLabel: "Flower Bouquets",
    occasion: ["Birthday", "Anniversary", "Love", "Thank You", "Congratulations"],
    image: roseBouquetImg,
    additionalImages: [roseBouquetImg, bouquetsImg],
    badge: "Signature",
    inclusions: [
      "18 Stem Premium Dutch Garden Roses (Blush, Peach & Crimson)",
      "Fresh Silver Dollar Eucalyptus & White Gypsophila",
      "Multi-layered Japanese Kraft Paper Wrapping",
      "Deep Olive Green Double-Face Satin Ribbon",
      "Flower Food Sachet & Care Instruction Card",
    ],
    customizable: true,
    isAvailable: true,
    leadTime: "Hand-delivered fresh within hours",
  },
  {
    id: "gourmet-celebration-hamper",
    name: "Gourmet Celebration Hamper",
    slug: "gourmet-celebration-hamper",
    tagline: "Fine savory treats, roasted dry fruits, chocolates & festive keepsakes",
    description:
      "A grand celebration hamper curated for momentous occasions. Features luxury dry fruits, artisanal savories, fine chocolates, and golden celebration touches.",
    longDescription:
      "Designed for grand gatherings, festive cheer, and prestigious corporate celebrations. Every element has been handpicked to provide an opulent unboxing experience. Housed in a sturdy handcrafted hamper with premium textures and festive warmth.",
    price: 400,
    originalPrice: 4899,
    rating: 4.92,
    reviewsCount: 84,
    category: "hampers",
    categoryLabel: "Gift Hampers",
    occasion: ["Wedding", "Anniversary", "Corporate", "Festival", "Congratulations"],
    image: gourmetImg,
    additionalImages: [gourmetImg, bloomBlissImg],
    badge: "Popular",
    inclusions: [
      "Grand Wicker & Faux-Leather Trunk with Brass Hardware",
      "Artisanal Roasted Almonds & Cashews in Jute Pouches (200g each)",
      "Assorted Belgian Truffles Box (12 pcs)",
      "Sparkling Grape & Berry Celebration Drink (750ml)",
      "Scented Soy Candle in Amber Glass with Brass Lid",
      "Personalized Congratulations Note Card",
    ],
    customizable: true,
    isAvailable: true,
    leadTime: "Available for nationwide dispatch",
  },
  {
    id: "self-care-gift-box",
    name: "Self-Care & Mindfulness Box",
    slug: "self-care-gift-box",
    tagline: "Hand-poured lavender soy candle, botanical soap & ceramic mug",
    description:
      "A calming sanctuary in a box. Includes organic herbal tea, botanical cold-process rose soap, a handmade ceramic 'Cozy Moments' mug, and soothing lavender.",
    longDescription:
      "Give the gift of rest, renewal, and gentle luxury. Whether for a birthday, get-well wish, pregnancy pampering, or a thoughtful 'thinking of you', this tranquil gift hamper envelops the recipient in pure comfort and botanical warmth.",
    price: 2299,
    originalPrice: 2699,
    rating: 4.87,
    reviewsCount: 76,
    category: "boxes",
    categoryLabel: "Curated Boxes",
    occasion: ["Birthday", "Baby Shower", "Thank You", "Love", "Personalized"],
    image: selfCareImg,
    additionalImages: [selfCareImg, hamperImg],
    badge: "Popular",
    inclusions: [
      "Artisanal Ceramic 'Cozy Moments' Speckled Mug",
      "Hand-Poured Scented Soy Candle (Lavender & Damask Rose)",
      "Botanical Cold-Processed Rose & Shea Soap Bar",
      "Organic Herbal Soothing Blend Loose Leaf Tea Tin (40g)",
      "Natural Waffle Weave Pure Cotton Face Towel",
      "Dried French Lavender Posy",
    ],
    customizable: true,
    isAvailable: true,
    leadTime: "Ready to ship in 24 hours",
  },
  {
    id: "anniversary-memories-hamper",
    name: "Anniversary Memories Hamper",
    slug: "anniversary-memories-hamper",
    tagline: "Custom engraved photo frame, preserved roses, champagne flutes & love letter",
    description:
      "Our most romantic anniversary tribute. Features an engraved wooden couple frame, warm fairy lights, preserved ruby roses, and a gold wax-sealed letter.",
    longDescription:
      "Celebrate the magic of your love story. Send us your favorite photograph and we'll print and frame it within an artisanal textured wooden frame. Combined with forever-preserved red roses illuminated by soft micro fairy lights, heart truffles, and your personal heartfelt message sealed in gold wax.",
    price: 4799,
    originalPrice: 5499,
    rating: 4.98,
    reviewsCount: 167,
    category: "keepsakes",
    categoryLabel: "Photo Keepsakes",
    occasion: ["Anniversary", "Wedding", "Love"],
    image: anniversaryImg,
    additionalImages: [anniversaryImg, framesImg],
    badge: "Bestseller",
    inclusions: [
      "Luxury Olive Suede Keepsake Box with Brass Clasp",
      "Handcrafted Wooden Custom Couple Photo Frame (6x6 inch)",
      "Preserved Everlasting Deep Red Rose Bouquet with Micro Fairy Lights",
      "Set of 2 Elegant Gold-Rimmed Crystal Champagne Flutes",
      "Artisan Heart-Shaped Dark Chocolate Truffles Box",
      "Custom Love Letter on Textured Deckle Linen Paper with Wax Seal",
    ],
    customizable: true,
    isAvailable: true,
    leadTime: "1-2 days (custom photo print & framing included)",
  },
  {
    id: "traditional-jumka-keepsake",
    name: "Royal Heritage Jewellery Hamper",
    slug: "royal-heritage-jewellery-hamper",
    tagline: "Handcrafted traditional Jumka set, festive sweets & floral packaging",
    description:
      "A cultural celebration featuring handcrafted traditional Jumka earrings, gold-foil dry fruit box, scented marigold potpourri, and keepsake velvet casing.",
    longDescription:
      "Honoring Indian celebrations with handcrafted artistry. An exquisite pair of traditional brass and pearl Jumkas nestled alongside hand-rolled gourmet sweets and traditional floral touches.",
    price: 1299,
    originalPrice: 2499,
    rating: 4.82,
    reviewsCount: 53,
    category: "keepsakes",
    categoryLabel: "Personalized Keepsakes",
    occasion: ["Wedding", "Festival", "Anniversary", "Birthday"],
    image: jumkaImg,
    additionalImages: [jumkaImg, hamperImg],
    badge: "New",
    inclusions: [
      "Handcrafted Artisan Jumka Earrings with Pearl Drops",
      "Velvet Jewellery Keepsake Box",
      "Gourmet Kaju & Pista Handcrafted Delights (250g)",
      "Aromatic Marigold & Rose Petal Potpourri",
      "Custom Festive Blessing Card",
    ],
    customizable: true,
    isAvailable: true,
    leadTime: "Immediate dispatch",
  },
  {
    id: "chocolate-tower-bouquet",
    name: "Sweet Celebration Chocolate Bouquet",
    slug: "sweet-celebration-chocolate-bouquet",
    tagline: "Ferrero Rocher & KitKat flower tower with celebration cake addon",
    description:
      "A dramatic and cheerful bouquet constructed with delicious premium chocolates arranged like flowering blooms, wrapped in elegant black & gold paper.",
    longDescription:
      "The ultimate showstopper for sweet tooth celebrations! Hand-crafted with over 24 pieces of luxury chocolates artfully arranged amidst faux blossoms and topped with celebratory ribbons.",
    price: 999,
    originalPrice: 3199,
    rating: 4.89,
    reviewsCount: 88,
    category: "bouquets",
    categoryLabel: "Chocolate Bouquets",
    occasion: ["Birthday", "Congratulations", "Love", "Thank You"],
    image: bouquetsImg,
    additionalImages: [bouquetsImg, chocolateLoveImg],
    badge: "Popular",
    inclusions: [
      "Arrangement of 24+ Premium Chocolates (Ferrero, Hershey's, Lindt)",
      "Everlasting Decorative Silk Blossom Accents",
      "Two-tone Luxury Matte Waterproof Wrapper",
      "Glittering Celebration Tag & Gold Butterfly Accents",
      "Personalized Balloon or Handwritten Note Option",
    ],
    customizable: true,
    isAvailable: true,
    leadTime: "Available for same day local delivery",
  },
  {
    id: "photo-memories-merge-frame",
    name: "Generations Photo Keepsake Frame",
    slug: "generations-photo-keepsake-frame",
    tagline: "Artistic photo merging, restoration and archival wooden framing",
    description:
      "Bring cherished memories together. Seamlessly merge photos of loved ones, ancestral portraits, or childhood moments into one timeless art piece.",
    longDescription:
      "One of our most emotional and cherished creations. Our digital artists delicately blend separate photographs—such as grandparents who never met grandchildren, or vintage wedding memories—into one harmonious portrait, printed on archival canvas paper and framed with premium glass.",
    price: 2499,
    originalPrice: 2999,
    rating: 4.96,
    reviewsCount: 134,
    category: "keepsakes",
    categoryLabel: "Photo Frames",
    occasion: ["Anniversary", "Birthday", "Wedding", "Baby Shower"],
    image: framesImg,
    additionalImages: [framesImg, anniversaryImg],
    badge: "Signature",
    inclusions: [
      "Professional Digital Artist Photo Merging & Color Retouching",
      "Archival 300 GSM Textured Fine Art Matte Print",
      "Solid Teak-Finish Wooden Deep Frame (8x10 or 10x12 inch)",
      "Shatter-Resistant Acrylic Protection",
      "Velvet Backing with Sturdy Brass Wall Hangers",
    ],
    customizable: true,
    isAvailable: true,
    leadTime: "2-3 days for artist draft & approval",
  },
  {
    id: "wedding-decor-garland-set",
    name: "Wedding & Festive Garland Suite",
    slug: "wedding-and-festive-garland-suite",
    tagline: "Hand-threaded fresh rose petal & jasmine garlands with bridal floral styling",
    description:
      "Traditional and contemporary floral styling for brides, grooms, baptism ceremonies, and sacred celebrations crafted with fresh, hand-selected flowers.",
    longDescription:
      "SnapCraft specializes in bespoke floral decorations for intimate ceremonies. From fragrant bridal garlands (Varmala) made with rose petals and baby's breath to ceremonial baptism and Holy Communion candles adorned with satin and greenery.",
    price: 399,
    originalPrice: 499,
    rating: 4.91,
    reviewsCount: 42,
    category: "curated",
    categoryLabel: "Ceremonial & Decor",
    occasion: ["Wedding", "Baby Shower", "Celebration", "Congratulations"],
    image: weddingImg,
    additionalImages: [weddingImg, roseBouquetImg],
    badge: "New",
    inclusions: [
      "Pair of Handcrafted Bride & Groom Floral Garlands (Varmala)",
      "Fresh Rose Petal Weaving with Gold Thread Accents",
      "Matching Floral Hair Accessory / Boutonnière",
      "Eco-friendly Insulated Fresh Box Delivery",
      "Consultation with SnapCraft Head Florist",
    ],
    customizable: true,
    isAvailable: true,
    leadTime: "Advance pre-booking of 3 days required",
  },
];

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  count: number;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "gift-hampers",
    name: "Gift Hampers",
    slug: "hampers",
    tagline: "Curated wicker & box hampers",
    description:
      "Thoughtfully assembled baskets overflowing with gourmet treats, flowers, and cherished surprises.",
    image: bloomBlissImg,
    count: 24,
  },
  {
    id: "flower-bouquets",
    name: "Flower Bouquets",
    slug: "bouquets",
    tagline: "Hand-tied fresh botanical blooms",
    description:
      "Artisan floral arrangements wrapped in vintage kraft paper with elegant satin ribbons.",
    image: roseBouquetImg,
    count: 18,
  },
  {
    id: "birthday-gifts",
    name: "Birthday Gifts",
    slug: "birthday",
    tagline: "Vibrant surprises for their day",
    description:
      "Joyful hampers, chocolate boxes, and personalized gifts made to make them feel deeply celebrated.",
    image: chocolateLoveImg,
    count: 32,
  },
  {
    id: "anniversary-gifts",
    name: "Anniversary Gifts",
    slug: "anniversary",
    tagline: "Romantic milestones & forever keepsakes",
    description:
      "Preserved roses, custom photo frames, candlelight sets, and sweet romantic hampers.",
    image: anniversaryImg,
    count: 21,
  },
  {
    id: "wedding-gifts",
    name: "Wedding Gifts",
    slug: "wedding",
    tagline: "Blessings for the new beginning",
    description:
      "Graceful bridal keepsakes, ceremony garlands, and opulent gift trunks for couples.",
    image: weddingImg,
    count: 16,
  },
  {
    id: "corporate-gifts",
    name: "Corporate Gifts",
    slug: "corporate",
    tagline: "Sophisticated executive gestures",
    description:
      "Premium hampers with brass stationery, artisanal coffee, gourmet nuts, and custom branding.",
    image: gourmetImg,
    count: 15,
  },
  {
    id: "personalized-gifts",
    name: "Personalized Gifts",
    slug: "personalized",
    tagline: "Custom memories, frames & names",
    description:
      "Photo merging frames, engraved wooden keepsakes, personalized mugs, and bespoke message cards.",
    image: framesImg,
    count: 29,
  },
  {
    id: "festival-gifts",
    name: "Festival Gifts",
    slug: "festival",
    tagline: "Traditional warmth & festive hampers",
    description:
      "Heritage hampers with brass diyas, traditional jewellery sets, handcrafted sweets, and dry fruits.",
    image: jumkaImg,
    count: 19,
  },
];

export const OCCASIONS_LIST = [
  {
    name: "Birthday",
    description: "Joyful celebrations with cake, chocolates and blooms",
    icon: "Cake",
  },
  {
    name: "Anniversary",
    description: "Romantic gestures honouring years of togetherness",
    icon: "Heart",
  },
  {
    name: "Love & Romance",
    description: "Sweet tokens of affection for someone truly special",
    icon: "Flame",
  },
  {
    name: "Wedding",
    description: "Opulent hampers and elegant floral garlands for the couple",
    icon: "Ring",
  },
  {
    name: "Baby Shower",
    description: "Gentle pastel gifts and pampering boxes for mom and baby",
    icon: "Baby",
  },
  {
    name: "Thank You",
    description: "Heartfelt expressions of gratitude crafted with sincerity",
    icon: "Sparkles",
  },
  {
    name: "Congratulations",
    description: "Celebrate milestones, promotions and new chapters in style",
    icon: "Award",
  },
  {
    name: "Corporate",
    description: "Polished, distinguished hampers for clients and valued teams",
    icon: "Briefcase",
  },
];

export const WHY_US_FEATURES = [
  {
    title: "Handcrafted With Love",
    description:
      "Every ribbon bow, flower stem, and tissue fold is prepared by hand with obsessive care.",
    icon: "HeartHandshake",
  },
  {
    title: "Premium Quality",
    description:
      "We source only top-grade blooms, Belgian chocolates, organic honey, and solid wood frames.",
    icon: "Gem",
  },
  {
    title: "Personalised Gifts",
    description:
      "Custom photo prints, name calligraphy, personalized wax seals, and bespoke selections.",
    icon: "Sparkles",
  },
  {
    title: "Beautiful Packaging",
    description:
      "Rustic wicker baskets, vintage kraft boxes, Italian satin ribbons, and wax-stamped notes.",
    icon: "Gift",
  },
  {
    title: "Fresh & Carefully Selected",
    description:
      "Fresh flower blooms cut each morning and gourmet delicacies sourced from certified artisans.",
    icon: "Leaf",
  },
  {
    title: "Delivered With Care",
    description:
      "Temperature-conscious packaging and express delivery ensuring pristine doorstep arrival.",
    icon: "Truck",
  },
];

export const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: "Aparna & Rohit Nair",
    location: "Kochi, Kerala",
    rating: 5,
    title: "The hamper stole everyone's heart!",
    review:
      "Ordered the Bloom & Bliss Hamper for our 5th wedding anniversary. The wicker basket was breathtaking, the flowers smelled divine, and the personalized wax seal note added such a romantic touch. SnapCraft is our go-to gifting brand now!",
    hamper: "Bloom & Bliss Hamper",
    date: "February 2026",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Vikram Sengupta",
    location: "Bengaluru, Karnataka",
    rating: 5,
    title: "Impressed my corporate clients completely",
    review:
      "We ordered 20 customized hampers for our executive retreat. The craft paper packaging, roasted dry fruits, and brass stationery were impeccably curated. Professional, timely delivery, and extraordinary presentation.",
    hamper: "Gourmet Celebration Hamper",
    date: "January 2026",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Sneha Menon",
    location: "Mumbai, Maharashtra",
    rating: 5,
    title: "Cried happy tears when she opened the photo frame",
    review:
      "SnapCraft merged an old photo of my late grandmother holding my daughter for our baby shower. The artist did an incredible job and framed it so gracefully. It is now our most prized family possession.",
    hamper: "Generations Photo Keepsake Frame",
    date: "March 2026",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Pooja & Karan Sharma",
    location: "New Delhi",
    rating: 5,
    title: "The chocolate strawberries were heavenly!",
    review:
      "The Chocolate Love Box arrived fresh and perfectly chilled. The edible gold flakes and the sweet packaging made our midnight celebration unforgettable. 10/10 recommendation!",
    hamper: "Chocolate Love Box",
    date: "February 2026",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
];

export const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: bloomBlissImg,
    likes: 482,
    caption: "Morning sunshine with our signature English garden hamper ✨ #SnapCraftGifts",
  },
  {
    id: 2,
    image: chocolateLoveImg,
    likes: 621,
    caption: "Hand-dipped strawberries & pure Belgian cocoa indulgence 🍓 #ChocolateLove",
  },
  {
    id: 3,
    image: roseBouquetImg,
    likes: 389,
    caption: "Earthy kraft paper & velvety garden roses. Timeless beauty in every fold 🌿",
  },
  {
    id: 4,
    image: selfCareImg,
    likes: 512,
    caption: "Self-care Sunday in a box: lavender, soy candle & warm tea moments 🕯️",
  },
  {
    id: 5,
    image: anniversaryImg,
    likes: 744,
    caption: "Fairy lights, framed memories and forever roses for our couple's milestone 💫",
  },
  {
    id: 6,
    image: bouquetsImg,
    likes: 430,
    caption: "Sweet towers crafted with sweet chocolates & celebratory ribbons 🍫✨",
  },
];

export const BUILDER_DATA = {
  occasions: [
    { id: "birthday", label: "Birthday Celebration", icon: "🎂" },
    { id: "anniversary", label: "Romantic Anniversary", icon: "💍" },
    { id: "love", label: "Love & Romance", icon: "❤️" },
    { id: "wedding", label: "Wedding & Engagement", icon: "✨" },
    { id: "babyshower", label: "Baby Shower & Welcome", icon: "👶" },
    { id: "thankyou", label: "Thank You & Gratitude", icon: "💐" },
    { id: "corporate", label: "Corporate & Executive", icon: "💼" },
    { id: "festival", label: "Festival / Festive Joy", icon: "🪔" },
  ],
  recipients: [
    { id: "partner", label: "Spouse / Partner", icon: "💑" },
    { id: "parents", label: "Mom / Dad / Parents", icon: "🏡" },
    { id: "friend", label: "Best Friend", icon: "🌟" },
    { id: "sibling", label: "Brother / Sister", icon: "🤝" },
    { id: "colleague", label: "Colleague / Boss", icon: "💼" },
    { id: "client", label: "Valued Client", icon: "🎖️" },
  ],
  packagingStyles: [
    {
      id: "wicker",
      label: "Signature Woven Cane Hamper",
      price: 650,
      icon: "🧺",
      desc: "Natural handcrafted wicker basket with reusable keepsake utility",
    },
    {
      id: "kraft",
      label: "Vintage Kraft Keepsake Box",
      price: 400,
      icon: "📦",
      desc: "Eco-friendly sturdy kraft box with hand-stamped botanicals",
    },
    {
      id: "trunk",
      label: "Royal Olive Suede Trunk",
      price: 950,
      icon: "🧳",
      desc: "Luxurious velvet-lined trunk with antique brass lock clasp",
    },
    {
      id: "crate",
      label: "Rustic Pine Wood Crate",
      price: 550,
      icon: "🪵",
      desc: "Artisanal natural timber crate with rope carrying handles",
    },
  ],
  flowers: [
    { id: "garden-roses", label: "Fresh English Garden Roses", price: 550, icon: "🌹" },
    { id: "lavender-wheat", label: "Wild French Dried Lavender & Wheat", price: 450, icon: "🌾" },
    { id: "exotic-peach", label: "Peach Florals & Baby's Breath", price: 500, icon: "🌸" },
    { id: "none", label: "No Flowers (Treats Only)", price: 0, icon: "🌿" },
  ],
  chocolates: [
    { id: "strawberries", label: "Chocolate Dipped Strawberries (6pcs)", price: 450, icon: "🍓" },
    {
      id: "belgian-truffles",
      label: "Artisan Belgian Gold Truffles (8pcs)",
      price: 400,
      icon: "🍫",
    },
    { id: "macarons", label: "French Vanilla & Rose Macarons (4pcs)", price: 350, icon: "🧁" },
    { id: "none", label: "No Chocolates", price: 0, icon: "🚫" },
  ],
  snacksGourmet: [
    {
      id: "honey-dipper",
      label: "Raw Valley Wildflower Honey & Wood Dipper",
      price: 350,
      icon: "🍯",
    },
    { id: "dry-fruits", label: "Artisanal Roasted Salted Dry Fruits Jar", price: 400, icon: "🥜" },
    {
      id: "sparkling-cider",
      label: "Sparkling Celebration Apple Cider (750ml)",
      price: 550,
      icon: "🍾",
    },
    { id: "none", label: "No Snacks", price: 0, icon: "🚫" },
  ],
  personalizedItems: [
    { id: "wooden-frame", label: "Personalized Photo Frame with Print", price: 500, icon: "🖼️" },
    { id: "soy-candle", label: "Hand-poured Amber Rose Soy Candle", price: 400, icon: "🕯️" },
    { id: "ceramic-mug", label: "Artisanal Speckled Ceramic Keepsake Mug", price: 350, icon: "☕" },
    { id: "fairy-lights", label: "Warm Micro Fairy Lights String", price: 150, icon: "✨" },
    { id: "none", label: "No Keepsake Items", price: 0, icon: "🚫" },
  ],
  waxSeals: [
    { id: "gold", label: "Royal Gold Wax Stamp", color: "#C99738" },
    { id: "terracotta", label: "Earthy Terracotta Seal", color: "#C45934" },
    { id: "olive", label: "Deep Forest Olive Seal", color: "#2E4624" },
    { id: "blush", label: "Vintage Rose Blush Seal", color: "#DF9B9B" },
  ],
};

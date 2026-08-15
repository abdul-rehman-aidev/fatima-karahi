/**
 * The menu — the owner's single file for menu edits.
 * Add/remove/edit dishes here; the /menu page, category nav, and Menu
 * JSON-LD are all generated from this data.
 *
 * Sourced verbatim from the client-supplied PDF menu ("Fatima Book menu"):
 * same sections, same items, same prices, same descriptions.
 *
 * One photo per menu SECTION, not per dish (client-supplied, see
 * MenuCategory.image below) — dishes themselves carry no image.
 *
 * Dish fields:
 *  - urdu        Urdu dish name (rendered with lang="ur" dir="rtl")
 *  - spice       0–3 → rendered as dots (●●○), never emoji
 *  - signature   small gold "Signature" tag on the row
 *  - price       single price, most dishes
 *  - priceTiers  weight/size-based pricing (e.g. ½ kg vs 1 kg, Half vs Full)
 *    — a dish has either `price` or `priceTiers`, never neither.
 */

export type PriceTier = { label: string; price: string };

export type Dish = {
  name: string;
  urdu?: string;
  desc?: string;
  price?: string;
  priceTiers?: PriceTier[];
  spice?: 0 | 1 | 2 | 3;
  signature?: boolean;
};

export type MenuCategory = {
  id: string;
  label: string;
  urdu: string;
  /** small note under the heading, e.g. "Weekends only, 11am to 2pm." */
  note?: string;
  /** section photo (from public/img) — omit for sections with no photo. */
  image?: string;
  dishes: Dish[];
};

export const menu: MenuCategory[] = [
  {
    id: "appetizers",
    label: "Appetizers",
    urdu: "سٹارٹرز",
    image: "menu-appetizers",
    dishes: [
      {
        name: "Veggie Pakoras",
        urdu: "ویجی پکوڑے",
        price: "$8.99",
        desc: "Deep-fried crispy fritter made with vegetables.",
      },
      {
        name: "Fried Shrimp",
        urdu: "فرائیڈ جھینگا",
        price: "$16.99",
        desc: "Shrimps fried in a special recipe.",
      },
      {
        name: "Veggie Samosa",
        urdu: "ویجی سموسہ",
        price: "$5.99",
        desc: "2 pieces of veggie samosa with tamarind sauce.",
      },
      {
        name: "Samosas Chaat",
        urdu: "سموسہ چاٹ",
        price: "$8.99",
        desc: "Veggie Samosa with chickpeas.",
      },
      {
        name: "Gol Gappay",
        urdu: "گول گپے",
        price: "$8.99",
        desc: "6 pieces of gol gappay with the combination of sweet and sour water.",
      },
      {
        name: "Papri Chat",
        urdu: "پاپڑی چاٹ",
        price: "$8.99",
        desc: "Chickpeas mixed with vegetables and papri.",
      },
      {
        name: "Fish Pakoras",
        urdu: "فش پکوڑے",
        price: "$14.99",
        desc: "Deep-fried basa fillets mix with gram flour.",
      },
      {
        name: "Chicken Wings",
        urdu: "چکن ونگز",
        price: "$15.99",
        desc: "10 pieces of wings marinated with special recipe.",
      },
    ],
  },
  {
    id: "bbq",
    label: "BBQ Dishes",
    urdu: "باربی کیو",
    image: "menu-bbq",
    dishes: [
      {
        name: "Beef Kebab",
        urdu: "بیف کباب",
        price: "$15.99",
        desc: "Finely minced beef with spices and herbs grilled in the clay oven.",
      },
      {
        name: "Chicken Kebab",
        urdu: "چکن کباب",
        price: "$15.99",
        desc: "Minced chicken marinated with spices grilled in the clay oven.",
      },
      {
        name: "Chicken Tikka Boneless",
        urdu: "چکن تکہ بون لیس",
        price: "$17.99",
        desc: "Boneless chicken pieces marinated with spices grilled in the clay oven.",
      },
      {
        name: "Chicken Tikka Bone-In",
        urdu: "چکن تکہ بون ان",
        price: "$16.99",
        desc: "Bone-in chicken pieces marinated with spices grilled in the clay oven.",
      },
      {
        name: "Lamb Chops",
        urdu: "لیمب چاپس",
        price: "$24.99",
        desc: "Lamb chops marinated with special spices.",
      },
      {
        name: "Chicken Broast",
        urdu: "چکن بروسٹ",
        priceTiers: [
          { label: "Half", price: "$18.99" },
          { label: "Full", price: "$31.99" },
        ],
        desc: "Minced with special spices.",
      },
      {
        name: "Beef Steak",
        urdu: "بیف سٹیک",
        price: "$26.99",
        desc: "Beef steak with mashed potatoes.",
      },
      {
        name: "Beef Ribs",
        urdu: "بیف رِبز",
        price: "$21.99",
        desc: "Tender beef ribs seasoned with our special spice blend, red chilli, and black pepper, finished with fresh lemon zest.",
      },
      {
        name: "Tandoori Fish",
        urdu: "تندوری مچھلی",
        price: "$21.99",
        desc: "Tandoor-grilled fish marinated with red chilli, salt, and fresh lemon juice. Served hot on a sizzling platter.",
      },
      {
        name: "Platter",
        urdu: "پلیٹر",
        price: "$36.99",
        desc: "Beef Kebab OR Chicken Kebab, Chicken Tikka & Fish.",
      },
      {
        name: "Chapli Kebab",
        urdu: "چپلی کباب",
        price: "$17.99",
        desc: "Finely minced beef with spices and herbs grilled in the clay oven.",
      },
      {
        name: "Chicken Malai Boti",
        urdu: "چکن ملائی بوٹی",
        price: "$17.99",
        desc: "Chicken marinated with spices, milk, and yogurt grilled in the clay oven with a topping of mozzarella cheese.",
      },
    ],
  },
  {
    id: "chicken-karahi",
    label: "Chicken Karahi",
    urdu: "چکن کڑاہی",
    image: "menu-chicken-karahi",
    dishes: [
      {
        name: "Chicken Karahi",
        urdu: "چکن کڑاہی",
        priceTiers: [
          { label: "½ kg", price: "$27.99" },
          { label: "1 kg", price: "$47.99" },
        ],
        desc: "Chicken cooked in Karahi using our special mixed spices and our signature gravy.",
      },
      {
        name: "Boneless Chicken",
        urdu: "بون لیس چکن کڑاہی",
        priceTiers: [
          { label: "½ kg", price: "$29.99" },
          { label: "1 kg", price: "$49.99" },
        ],
        desc: "Boneless chicken cooked in Karahi using our mixed spices and our signature gravy.",
      },
      {
        name: "Chicken Achari",
        urdu: "چکن اچاری",
        priceTiers: [
          { label: "½ kg", price: "$28.99" },
          { label: "1 kg", price: "$47.99" },
        ],
        spice: 2,
        desc: "Chicken cooked in Karahi and Achar using our special mixed spices and our signature gravy.",
      },
      {
        name: "Chicken Ginger",
        urdu: "چکن جنجر",
        priceTiers: [
          { label: "½ kg", price: "$28.99" },
          { label: "1 kg", price: "$47.99" },
        ],
        desc: "Chicken cooked in Karahi using our mixed spices, ginger and our signature gravy.",
      },
      {
        name: "Chicken White",
        urdu: "چکن وائٹ کڑاہی",
        priceTiers: [
          { label: "½ kg", price: "$30.99" },
          { label: "1 kg", price: "$49.99" },
        ],
        desc: "Boneless chicken cooked in Karahi using our mixed spices and signature gravy.",
      },
      {
        name: "Qeema Karahi",
        urdu: "قیمہ کڑاہی",
        priceTiers: [
          { label: "½ kg", price: "$31.99" },
          { label: "1 kg", price: "$49.99" },
        ],
        desc: "Minced Chicken Queema cooked in Karahi with our mixed spices and signature gravy.",
      },
    ],
  },
  {
    id: "lamb-karahi",
    label: "Lamb Karahi",
    urdu: "لیمب کڑاہی",
    image: "menu-lamb-karahi",
    dishes: [
      {
        name: "Lamb Karahi",
        urdu: "لیمب کڑاہی",
        priceTiers: [
          { label: "½ kg", price: "$41.99" },
          { label: "1 kg", price: "$73.99" },
        ],
        desc: "Lamb cooked in Karahi using our special mixed spices and our signature gravy.",
      },
      {
        name: "Lamb Achari",
        urdu: "لیمب اچاری",
        priceTiers: [
          { label: "½ kg", price: "$43.99" },
          { label: "1 kg", price: "$75.99" },
        ],
        spice: 2,
        desc: "Tender Lamb, cooked with tangy pickle (achar), bold red chilli, and our signature special masala blend.",
      },
    ],
  },
  {
    id: "goat-karahi",
    label: "Goat Karahi",
    urdu: "بکرے کی کڑاہی",
    image: "menu-goat-karahi",
    dishes: [
      {
        name: "Goat Karahi",
        urdu: "بکرے کی کڑاہی",
        priceTiers: [
          { label: "½ kg", price: "$42.99" },
          { label: "1 kg", price: "$74.99" },
        ],
        desc: "Goat cooked in Karahi using our special mixed spices and our signature gravy.",
      },
      {
        name: "Goat Achari",
        urdu: "بکرے کی اچاری",
        priceTiers: [
          { label: "½ kg", price: "$44.99" },
          { label: "1 kg", price: "$76.99" },
        ],
        spice: 2,
        desc: "Tender Goat, cooked with tangy pickle (achar), bold red chilli, and our signature special masala blend.",
      },
    ],
  },
  {
    id: "vegetarian",
    label: "Vegetarian Dishes",
    urdu: "سبزی کے کھانے",
    image: "menu-vegetarian",
    dishes: [
      {
        name: "Daal Mash",
        urdu: "دال ماش",
        price: "$12.99",
        desc: "Mash beans cooked in ground spices.",
      },
      {
        name: "Mixed Sabzi",
        urdu: "مکس سبزی",
        price: "$12.99",
        desc: "Mix vegetables cooked in spices.",
      },
      {
        name: "Daal Makhani",
        urdu: "دال مکھنی",
        price: "$16.99",
        desc: "Whole black lentils and red kidney beans slow cooked with spices.",
      },
      {
        name: "Saag",
        urdu: "ساگ",
        price: "$12.99",
        desc: "Mustard leaves cooked with special spices.",
      },
      {
        name: "Butter Paneer Masala",
        urdu: "بٹر پنیر مسالہ",
        price: "$13.99",
        desc: "Paneer cooked in special spices.",
      },
      {
        name: "Chana Masala",
        urdu: "چنا مسالہ",
        price: "$12.99",
        desc: "Chick peas cooked with special spices.",
      },
      {
        name: "Paneer Karahi",
        urdu: "پنیر کڑاہی",
        price: "$21.99",
        desc: "454g of paneer and bell peppers cooked in special spices.",
      },
      {
        name: "Palak Paneer",
        urdu: "پالک پنیر",
        price: "$13.99",
        desc: "Spinach and homemade cheese cooked with spices.",
      },
    ],
  },
  {
    id: "bread",
    label: "Bread",
    urdu: "نان روٹی",
    image: "menu-bread",
    dishes: [
      {
        name: "Roti",
        urdu: "روٹی",
        price: "$3.99",
        desc: "Simple bread/Chapati.",
      },
      {
        name: "Naan",
        urdu: "نان",
        price: "$3.99",
        desc: "Choose your naan: Regular Naan or Sesame & Butter.",
      },
      {
        name: "Garlic Naan",
        urdu: "گارلک نان",
        price: "$4.99",
        desc: "Sesame seed, butter and garlic.",
      },
    ],
  },
  {
    id: "rice",
    label: "Rice Dishes",
    urdu: "چاول",
    image: "menu-rice",
    dishes: [
      {
        name: "Chicken Biryani",
        urdu: "چکن بریانی",
        price: "$16.99",
        desc: "Aromatic rice and tender chicken slow-cooked on “dum” with our special masala. Served with fresh raita.",
      },
      {
        name: "Chicken Tikka Biryani",
        urdu: "چکن تکہ بریانی",
        price: "$17.99",
      },
      {
        name: "Veggie Biryani",
        urdu: "ویجی بریانی",
        price: "$12.99",
      },
      {
        name: "Lamb Biryani",
        urdu: "لیمب بریانی",
        price: "$16.99",
      },
      {
        name: "Plain Rice",
        urdu: "سادہ چاول",
        price: "$8.99",
      },
      {
        name: "Biryani Rice",
        urdu: "بریانی چاول",
        price: "$9.99",
      },
      {
        name: "Plain Pulao Rice",
        urdu: "سادہ پلاؤ چاول",
        price: "$9.99",
        desc: "Rice with carrots and raisins.",
      },
      {
        name: "Pulao Rice",
        urdu: "پلاؤ چاول",
        price: "$17.99",
        desc: "Choice of: Chicken Kebab, Beef Kebab, Chicken Tikka, or Malai Boti.",
      },
      {
        name: "Kabuli Pulao",
        urdu: "کابلی پلاؤ",
        price: "$20.99",
        desc: "Boneless lamb and rice with carrots and raisins.",
      },
    ],
  },
  {
    id: "fast-food",
    label: "Fast Food",
    urdu: "فاسٹ فوڈ",
    image: "menu-fast-food",
    dishes: [
      {
        name: "Beef Burger",
        urdu: "بیف برگر",
        price: "$10.99",
        desc: "A juicy beef patty served in a soft bun with fresh toppings.",
      },
      {
        name: "Fish Burger",
        urdu: "فش برگر",
        price: "$10.99",
        desc: "A crispy fish fillet served in a soft bun with fresh toppings.",
      },
      {
        name: "Chicken Burger",
        urdu: "چکن برگر",
        price: "$10.99",
        desc: "A juicy chicken patty served in a soft bun with fresh toppings.",
      },
      {
        name: "Chicken Cheese Burger",
        urdu: "چکن چیز برگر",
        price: "$11.99",
        desc: "A juicy chicken patty topped with melted cheese and fresh toppings, served in a soft bun.",
      },
      {
        name: "Chicken Chow Mein",
        urdu: "چکن چاؤ مین",
        price: "$15.99",
        desc: "Stir-fried noodles with tender chicken and fresh vegetables.",
      },
    ],
  },
  {
    id: "kebab-karahi",
    label: "Kebab Karahi",
    urdu: "کباب کڑاہی",
    image: "menu-kebab-karahi",
    dishes: [
      {
        name: "Beef Kebab Karahi",
        urdu: "بیف کباب کڑاہی",
        price: "$25.99",
        desc: "Beef grilled in clay oven and cooked with signature gravy. All boneless.",
      },
      {
        name: "Chicken Kebab Karahi",
        urdu: "چکن کباب کڑاہی",
        price: "$25.99",
        desc: "Chicken grilled in clay oven and cooked with signature gravy. All boneless.",
      },
      {
        name: "Chicken Tikka Karahi",
        urdu: "چکن تکہ کڑاہی",
        price: "$27.99",
        desc: "Chicken Tikka grilled in clay oven and cooked with signature gravy. All boneless.",
      },
    ],
  },
  {
    id: "sides",
    label: "Sides",
    urdu: "سائیڈز",
    image: "menu-sides",
    dishes: [
      {
        name: "Onion Salad",
        urdu: "پیاز سلاد",
        price: "$2.99",
        desc: "Fresh sliced onions served with a light seasoning.",
      },
      {
        name: "Garden Salad",
        urdu: "گارڈن سلاد",
        price: "$5.99",
        desc: "Fresh mixed greens and vegetables served with a light dressing.",
      },
      {
        name: "Raita",
        urdu: "رائتہ",
        price: "$2.99",
        desc: "Creamy yogurt blended with refreshing herbs and spices.",
      },
      {
        name: "Mint Chutney",
        urdu: "پودینے کی چٹنی",
        price: "$3.99",
        desc: "A refreshing blend of fresh mint, herbs, and aromatic spices.",
      },
      {
        name: "Tamarind Chutney",
        urdu: "املی کی چٹنی",
        price: "$2.99",
        desc: "A sweet and tangy chutney made with tamarind and aromatic spices.",
      },
    ],
  },
  {
    id: "curries",
    label: "Curry Dishes",
    urdu: "سالن",
    image: "menu-curry",
    dishes: [
      {
        name: "Butter Chicken",
        urdu: "بٹر چکن",
        price: "$17.99",
        desc: "Tandoori boneless cubes cooked in tomatoes and butter sauce.",
      },
      {
        name: "Chicken Tikka Masala",
        urdu: "چکن تکہ مسالہ",
        price: "$14.99",
        desc: "Cooked in a rich curry sauce.",
      },
      {
        name: "Palak Chicken",
        urdu: "پالک چکن",
        price: "$13.99",
        desc: "Spinach and boneless chicken cooked in curry sauce, tomatoes and ginger.",
      },
      {
        name: "Palak Lamb",
        urdu: "پالک لیمب",
        price: "$14.99",
        desc: "Spinach and boneless lamb in curry sauce, tomatoes and ginger.",
      },
      {
        name: "Paya / Goat Feet",
        urdu: "پائے",
        price: "$16.99",
        desc: "Goat feet cooked with tomatoes, ginger, chilli and curry.",
      },
      {
        name: "Goat Curry",
        urdu: "بکرے کا سالن",
        price: "$17.99",
        desc: "Bone-in goat in curry sauce.",
      },
      {
        name: "Lahori Murg Chana",
        urdu: "لاہوری مرغ چنا",
        price: "$14.99",
        desc: "Chickpeas cooked with ginger, chilli tomatoes and curry.",
      },
      {
        name: "Brain Masala",
        urdu: "مغز مسالہ",
        price: "$17.99",
        desc: "Tender beef brain cooked with aromatic spices, herbs, and a rich masala sauce.",
      },
      {
        name: "Beef Nehari",
        urdu: "بیف نہاری",
        price: "$19.99",
        desc: "Beef shanks cooked on slow heat in traditional way.",
      },
      {
        name: "Gola Kebab Masala",
        urdu: "گولہ کباب مسالہ",
        price: "$14.99",
        desc: "Beef or Chicken kebab cooked in curry sauce.",
      },
      {
        name: "Beef Haleem",
        urdu: "بیف حلیم",
        price: "$17.99",
        desc: "Mixed lentils and blended beef cooked in spices.",
      },
    ],
  },
  {
    id: "kids-menu",
    label: "Kids Menu",
    urdu: "بچوں کا مینو",
    dishes: [
      {
        name: "Spring Rolls",
        urdu: "سپرنگ رولز",
        price: "$12.99",
        desc: "Crispy, bite-sized rolls filled with a savoury filling.",
      },
      {
        name: "Fries",
        urdu: "فرائز",
        price: "$8.99",
        desc: "Crispy golden fries, perfect for little hands.",
      },
      {
        name: "Chicken Burger",
        urdu: "چکن برگر",
        price: "$10.99",
        desc: "A delicious chicken burger served in a soft bun.",
      },
      {
        name: "Kids Combo",
        urdu: "کڈز کومبو",
        price: "$15.99",
        desc: "A tasty kid-friendly meal with delicious fries, burger and juice.",
      },
      {
        name: "Nuggets",
        urdu: "نگٹس",
        price: "$11.99",
        desc: "Crispy, golden chicken nuggets that kids love.",
      },
      {
        name: "Apple Juice",
        urdu: "سیب کا جوس",
        price: "$3.99",
        desc: "Sweet and refreshing apple juice.",
      },
      {
        name: "Orange Juice",
        urdu: "مالٹے کا جوس",
        price: "$3.99",
        desc: "Fresh and refreshing orange juice.",
      },
    ],
  },
  {
    id: "mocktails",
    label: "Mocktails",
    urdu: "ماک ٹیلز",
    image: "menu-mocktails",
    dishes: [
      {
        name: "Mint Margarita",
        urdu: "منٹ مارگریٹا",
        price: "$8.99",
        desc: "A refreshing blend of fresh mint, lime, and sweetness.",
      },
      {
        name: "Lemonade Chiller",
        urdu: "لیمونیڈ چلر",
        price: "$8.99",
        desc: "A cool and refreshing lemonade served chilled.",
      },
      {
        name: "Mango Mojito",
        urdu: "مینگو موہیتو",
        price: "$8.99",
        desc: "A refreshing blend of sweet mango, lime and mint.",
      },
      {
        name: "Blue Lagoon",
        urdu: "بلیو لگون",
        price: "$8.99",
        desc: "A refreshing blue citrus drink with a sweet, tangy flavour.",
      },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    urdu: "مشروبات",
    image: "menu-drinks",
    dishes: [
      {
        name: "Mango Lassi",
        urdu: "مینگو لسی",
        price: "$6.99",
      },
      {
        name: "Salty Lassi",
        urdu: "نمکین لسی",
        price: "$6.99",
      },
      {
        name: "Sweet Lassi",
        urdu: "میٹھی لسی",
        price: "$6.99",
      },
      {
        name: "Lemon Water",
        urdu: "لیموں پانی",
        price: "$4.99",
      },
      {
        name: "Sparkling Water",
        urdu: "سپارکلنگ واٹر",
        price: "$3.99",
      },
      {
        name: "Pop",
        urdu: "پاپ",
        price: "$2.50",
      },
      {
        name: "Green Tea",
        urdu: "گرین ٹی",
        price: "$4.99",
      },
      {
        name: "Desi Chai",
        urdu: "دیسی چائے",
        price: "$4.99",
      },
      {
        name: "Kashmiri Chai",
        urdu: "کشمیری چائے",
        price: "$4.99",
        desc: "A creamy pink tea infused with cardamom and topped with crushed nuts.",
      },
    ],
  },
  {
    id: "shakes",
    label: "Shakes",
    urdu: "شیکس",
    image: "menu-shakes",
    dishes: [
      { name: "Strawberry Shake", urdu: "سٹرابیری شیک", price: "$7.99" },
      { name: "Vanilla Shake", urdu: "وینیلا شیک", price: "$7.99" },
      { name: "Chocolate Shake", urdu: "چاکلیٹ شیک", price: "$7.99" },
      { name: "Mango Shake", urdu: "مینگو شیک", price: "$7.99" },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    urdu: "میٹھا",
    image: "menu-desserts",
    dishes: [
      {
        name: "Ras Malai",
        urdu: "راس ملائی",
        price: "$7.99",
        desc: "Soft, spongy milk dumplings soaked in rich, creamy saffron milk and topped with pistachios.",
      },
      {
        name: "Khoya Kheer",
        urdu: "کھویا کھیر",
        price: "$9.99",
        signature: true,
        desc: "Traditional Pakistani rice pudding made with creamy khoya, milk, delicate spices, and pistachios.",
      },
      {
        name: "Gajar Ka Halwa",
        urdu: "گاجر کا حلوہ",
        price: "$10.99",
      },
      {
        name: "Gulab Jamun",
        urdu: "گلاب جامن",
        price: "$7.99",
        desc: "2 pieces with pistachios.",
      },
      {
        name: "Ice Cream",
        urdu: "آئس کریم",
        price: "$7.99",
        desc: "Choice of: Chocolate, Strawberry, or Vanilla.",
      },
    ],
  },
  {
    id: "breakfast-specials",
    label: "Breakfast Specials",
    urdu: "ناشتہ",
    note: "Weekends only, 11am to 2pm.",
    dishes: [
      {
        name: "Goat Paya",
        urdu: "بکرے کے پائے",
        price: "$16.99",
      },
      {
        name: "Beef Paya",
        urdu: "بیف پائے",
        price: "$16.99",
      },
      {
        name: "Omelette",
        urdu: "آملیٹ",
        price: "$8.99",
      },
      {
        name: "Cheese Omelette",
        urdu: "چیز آملیٹ",
        price: "$10.99",
      },
      {
        name: "Kulcha",
        urdu: "قلچہ",
        price: "$3.99",
      },
      {
        name: "Lachha Paratha",
        urdu: "لچھا پراٹھا",
        price: "$4.99",
      },
      {
        name: "Halwa Puri Combo",
        urdu: "حلوہ پوری کومبو",
        price: "$9.99",
        signature: true,
        desc: "2 Puris, spicy onion, Alu Tarkari.",
      },
      {
        name: "Sweet Lassi",
        urdu: "میٹھی لسی",
        price: "$6.99",
      },
      {
        name: "Salty Lassi",
        urdu: "نمکین لسی",
        price: "$6.99",
      },
      {
        name: "Desi Chai",
        urdu: "دیسی چائے",
        price: "$3.99",
      },
      {
        name: "Kashmiri Chai",
        urdu: "کشمیری چائے",
        price: "$4.99",
      },
    ],
  },
];

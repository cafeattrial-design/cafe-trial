import type { MenuItem } from "./types";

const photo = (number: number) => `/assets/menu/drive-menu-${String(number).padStart(2, "0")}.jpg`;

const servingOptions: Record<string, { label: string; pricePaise: number }[]> = {
  "bangkok-bao": [{ label: "2P", pricePaise: 19900 }, { label: "3P", pricePaise: 25900 }],
  "broccoli-melt-bao": [{ label: "2P", pricePaise: 20900 }, { label: "3P", pricePaise: 26900 }],
  "spicy-veggie-bao": [{ label: "2P", pricePaise: 18900 }, { label: "3P", pricePaise: 24900 }],
  "crystal-veg-dimsum": [{ label: "4P", pricePaise: 21900 }, { label: "7P", pricePaise: 32900 }],
  "truffle-edamame-dimsum": [{ label: "4P", pricePaise: 23900 }, { label: "7P", pricePaise: 34900 }],
  "cheesy-shroom-dimsum": [{ label: "4P", pricePaise: 24900 }, { label: "7P", pricePaise: 33900 }],
  "cottage-cheese-chilli-dimsum": [{ label: "4P", pricePaise: 22900 }, { label: "7P", pricePaise: 33900 }],
  "assorted-dimsums": [{ label: "8P", pricePaise: 42000 }],
  "mozzarella-sticks": [{ label: "2P", pricePaise: 10900 }, { label: "5P", pricePaise: 26900 }, { label: "7P", pricePaise: 32900 }],
  "vada-bao": [{ label: "2P", pricePaise: 22900 }, { label: "3P", pricePaise: 29900 }],
  "flaming-hot-mozzarella-sticks": [{ label: "2P", pricePaise: 14900 }, { label: "5P", pricePaise: 31900 }, { label: "7P", pricePaise: 39900 }],
  "lindor-din-tai-fung": [{ label: "3P", pricePaise: 22900 }, { label: "5P", pricePaise: 33900 }],
  "mushroom-cream-cheese-bagel": [{ label: "250g", pricePaise: 27900 }], "korean-gochujang-bagel": [{ label: "250g", pricePaise: 25900 }], "bombay-masala-bagel": [{ label: "250g", pricePaise: 21900 }],
  "spicy-chilli-oil-ramen": [{ label: "450g", pricePaise: 26900 }], "cheesy-miso-ramen": [{ label: "450g", pricePaise: 29900 }],
  "crinkle-fries": [{ label: "180g", pricePaise: 11900 }, { label: "300g", pricePaise: 19900 }], "potato-pillows": [{ label: "8P", pricePaise: 9900 }, { label: "14P", pricePaise: 17900 }, { label: "20P", pricePaise: 21900 }],
  "japanese-long-fries": [{ label: "180g", pricePaise: 17900 }, { label: "300g", pricePaise: 25900 }], "peri-peri-japanese-fries": [{ label: "180g", pricePaise: 20800 }, { label: "300g", pricePaise: 28800 }], "flaming-hot-japanese-fries": [{ label: "180g", pricePaise: 21800 }, { label: "300g", pricePaise: 29800 }],
  "veggie-sushi-finger": [{ label: "5P", pricePaise: 27900 }, { label: "7P", pricePaise: 32900 }], "mushroom-sushi-finger": [{ label: "5P", pricePaise: 31900 }, { label: "7P", pricePaise: 39900 }],
  "thecha-hummus": [{ label: "200g", pricePaise: 17900 }], "classic-garlicy-hummus": [{ label: "200g", pricePaise: 15900 }], "mango-hummus": [{ label: "200g", pricePaise: 17900 }], "muhammara": [{ label: "200g", pricePaise: 16900 }], "mezze-platter": [{ label: "400g", pricePaise: 42000 }],
  "chocolate-protein-smoothie": [{ label: "350ml", pricePaise: 17900 }], "malai-kulfi-protein-smoothie": [{ label: "350ml", pricePaise: 19900 }], "mocha-crunch-smoothie-bowl": [{ label: "300g", pricePaise: 33900 }], "biscoff-caramel-smoothie-bowl": [{ label: "300g", pricePaise: 34900 }], "berry-blast-smoothie-bowl": [{ label: "300g", pricePaise: 36900 }],
  "white-monster-boba": [{ label: "350ml", pricePaise: 24900 }],
  "japanese-coffee-jelly": [{ label: "350ml", pricePaise: 22900 }, { label: "450ml", pricePaise: 28900 }], "cranberry-iced-tea": [{ label: "350ml", pricePaise: 16900 }, { label: "450ml", pricePaise: 21900 }], "peach-iced-tea": [{ label: "350ml", pricePaise: 15900 }, { label: "450ml", pricePaise: 21900 }], "tiramisu-frappe": [{ label: "350ml", pricePaise: 17900 }, { label: "450ml", pricePaise: 24900 }], "orng-diet-coke-espresso": [{ label: "350ml", pricePaise: 18900 }, { label: "450ml", pricePaise: 25900 }], "brazilian-lemonade": [{ label: "350ml", pricePaise: 15900 }, { label: "450ml", pricePaise: 22900 }], "hazelnut-frappe": [{ label: "350ml", pricePaise: 16900 }, { label: "450ml", pricePaise: 23900 }], "cinnamon-frappe": [{ label: "350ml", pricePaise: 15900 }, { label: "450ml", pricePaise: 22900 }], "strawberry-zillianade": [{ label: "350ml", pricePaise: 17900 }, { label: "450ml", pricePaise: 24900 }], "lemon-iced-tea": [{ label: "350ml", pricePaise: 14900 }, { label: "450ml", pricePaise: 19900 }], "pink-grapefruit-iced-tea": [{ label: "350ml", pricePaise: 17900 }, { label: "450ml", pricePaise: 22900 }], "lavender-iced-tea": [{ label: "350ml", pricePaise: 16900 }, { label: "450ml", pricePaise: 20900 }], "chunky-coconut-boba": [{ label: "350ml", pricePaise: 20900 }, { label: "450ml", pricePaise: 26900 }], "irish-cream-frappe": [{ label: "350ml", pricePaise: 15900 }, { label: "450ml", pricePaise: 22900 }]
};

const correctImageNumbers: Record<string, number> = { "bangkok-bao": 15, "broccoli-melt-bao": 14, "spicy-veggie-bao": 12, "crystal-veg-dimsum": 13, "truffle-edamame-dimsum": 17, "cheesy-shroom-dimsum": 16, "cottage-cheese-chilli-dimsum": 18, "assorted-dimsums": 10, "mozzarella-sticks": 11, "vada-bao": 35, "flaming-hot-mozzarella-sticks": 30, "lindor-din-tai-fung": 33, "korean-gochujang-bagel": 9, "mushroom-cream-cheese-bagel": 5, "bombay-masala-bagel": 8, "spicy-chilli-oil-ramen": 7, "cheesy-miso-ramen": 4, "crinkle-fries": 6, "potato-pillows": 3, "japanese-long-fries": 2, "veggie-sushi-finger": 34, "mushroom-sushi-finger": 40, "mango-hummus": 19, "thecha-hummus": 28, "classic-garlicy-hummus": 29, "muhammara": 27, "mezze-platter": 25, "chocolate-protein-smoothie": 21, "malai-kulfi-protein-smoothie": 20, "mocha-crunch-smoothie-bowl": 26, "biscoff-caramel-smoothie-bowl": 24, "berry-blast-smoothie-bowl": 23, "white-monster-boba": 36, "japanese-coffee-jelly": 44, "cranberry-iced-tea": 48, "peach-iced-tea": 47, "tiramisu-frappe": 51, "orng-diet-coke-espresso": 55, "brazilian-lemonade": 43, "hazelnut-frappe": 52, "cinnamon-frappe": 53, "strawberry-zillianade": 50, "lemon-iced-tea": 49, "pink-grapefruit-iced-tea": 46, "lavender-iced-tea": 45, "chunky-coconut-boba": 43, "irish-cream-frappe": 51, "seasonal-chocolate-dipped-fruits": 59, "pistachio-cookie": 62, "nutella-filled-cookie": 60, "triple-chocolate-mini-cookies": 61, "hazelnut-chip-cookie": 69, "belgian-truffle-cheesecake": 65, "swiss-chocolate-cheesecake": 66, "white-chocolate-cheesecake": 68, "double-chocolate-cheesecake": 71, "chocolate-dipped-croissants": 67, "cinnamon-bun": 70, "dark-chocolate-berry-cake": 64 };
export const categories = [
  "Bao & Dimsum",
  "Bagels & Ramen",
  "Fries & Snacks",
  "Hummus & Bowls",
  "Coolers & Boba",
  "Desserts"
];

const item = (id: string, category: string, name: string, description: string, price: number, imageNumber: number, rating = 4.7, reviewCount = 40): MenuItem => ({
  id,
  cafeId: "d-treat",
  name,
  category,
  description,
  imageUrl: photo(correctImageNumbers[id] || imageNumber),
  pricePaise: servingOptions[id]?.[0]?.pricePaise || price * 100,
  portionOptions: servingOptions[id],
  pureVeg: true,
  highMargin: false,
  rating,
  reviewCount
});

export const seedMenu: MenuItem[] = [
  item("bangkok-bao", "Bao & Dimsum", "Bangkok Bao", "Soft steamed bao with Thai-style vegetable filling.", 199, 9),
  item("broccoli-melt-bao", "Bao & Dimsum", "Broccoli Melt Bao", "Steamed bao with a rich broccoli and cheese filling.", 209, 5),
  item("spicy-veggie-bao", "Bao & Dimsum", "Spicy Veggie Bao", "Spiced vegetables in a fluffy steamed bao.", 249, 8),
  item("crystal-veg-dimsum", "Bao & Dimsum", "Crystal Veg Dimsum", "Translucent vegetable dimsum.", 219, 12),
  item("truffle-edamame-dimsum", "Bao & Dimsum", "Truffle Edamame Dimsum", "Edamame dimsum with truffle notes.", 239, 16),
  item("cheesy-shroom-dimsum", "Bao & Dimsum", "Cheesy Shroom Dimsum", "Mushroom and cheese filled dimsum.", 249, 13),
  item("cottage-cheese-chilli-dimsum", "Bao & Dimsum", "Cottage Cheese Chilli Dimsum", "Cottage cheese dimsum with a chilli kick.", 229, 14),
  item("assorted-dimsums", "Bao & Dimsum", "Assorted Dimsums", "Any eight dimsum pieces of your choice.", 420, 10),
  item("mozzarella-sticks", "Bao & Dimsum", "Mozzarella Sticks", "Golden, cheesy mozzarella sticks.", 269, 11),
  item("vada-bao", "Bao & Dimsum", "Vada Bao", "Crisp vada-style bao with house chutney.", 229, 17),
  item("flaming-hot-mozzarella-sticks", "Bao & Dimsum", "Flaming Hot Mozzarella Sticks", "Spicy, crunchy mozzarella sticks.", 319, 11),
  item("lindor-din-tai-fung", "Bao & Dimsum", "Lindor Din Tai Fung", "Chocolate-inspired sweet dimsum.", 229, 35),

  item("mushroom-cream-cheese-bagel", "Bagels & Ramen", "Mushroom Cream Cheese Bagel", "Toasted bagel with mushrooms and cream cheese.", 259, 5),
  item("korean-gochujang-bagel", "Bagels & Ramen", "Korean Gochujang Bagel", "Korean-style bagel with gochujang flavours.", 259, 8),
  item("bombay-masala-bagel", "Bagels & Ramen", "Bombay Masala Bagel", "Mumbai masala filling in a toasted bagel.", 219, 8),
  item("spicy-chilli-oil-ramen", "Bagels & Ramen", "Spicy Chilli Oil Ramen", "Ramen tossed in aromatic chilli oil.", 269, 4),
  item("cheesy-miso-ramen", "Bagels & Ramen", "Cheesy Miso Ramen", "Creamy miso ramen with a cheesy finish.", 299, 7),

  item("crinkle-fries", "Fries & Snacks", "Crinkle Fries", "Crisp crinkle-cut fries.", 119, 6),
  item("potato-pillows", "Fries & Snacks", "Potato Pillows", "Crispy potato bites with a soft centre.", 99, 3),
  item("japanese-long-fries", "Fries & Snacks", "Japanese Long Fries", "Long-cut fries with Japanese-style seasoning.", 179, 2),
  item("peri-peri-japanese-fries", "Fries & Snacks", "Peri Peri Japanese Long Fries", "Japanese long fries with peri peri spice.", 208, 2),
  item("flaming-hot-japanese-fries", "Fries & Snacks", "Flaming Hot Japanese Long Fries", "Japanese long fries with flaming hot spice.", 218, 2),
  item("veggie-sushi-finger", "Fries & Snacks", "Veggie Sushi Finger", "Vegetable sushi finger rolls.", 279, 34),
  item("mushroom-sushi-finger", "Fries & Snacks", "Mushroom Sushi Finger", "Mushroom-filled sushi finger rolls.", 319, 40),

  item("thecha-hummus", "Hummus & Bowls", "Thecha Hummus", "200g of thecha-spiced hummus.", 179, 76),
  item("classic-garlicy-hummus", "Hummus & Bowls", "Classic Garlicy Hummus", "200g of classic garlic hummus.", 159, 73),
  item("mango-hummus", "Hummus & Bowls", "Mango Hummus", "200g of sweet and savoury mango hummus.", 179, 75),
  item("muhammara", "Hummus & Bowls", "Muhammara", "200g of roasted pepper and walnut dip.", 169, 74),
  item("mezze-platter", "Hummus & Bowls", "Mezze Platter", "Three hummus flavours and muhammara with accompaniments.", 420, 25),
  item("chocolate-protein-smoothie", "Hummus & Bowls", "Chocolate Protein Smoothie", "350ml, 30g protein chocolate smoothie.", 179, 21),
  item("malai-kulfi-protein-smoothie", "Hummus & Bowls", "Malai Kulfi Protein Smoothie", "350ml, 30g protein malai kulfi smoothie.", 199, 20),
  item("mocha-crunch-smoothie-bowl", "Hummus & Bowls", "Mocha Crunch Smoothie Bowl", "300g mocha bowl with crunchy toppings.", 339, 24),
  item("biscoff-caramel-smoothie-bowl", "Hummus & Bowls", "Biscoff Caramel Smoothie Bowl", "300g caramel and Biscoff smoothie bowl.", 349, 26),
  item("berry-blast-smoothie-bowl", "Hummus & Bowls", "Berry Blast Smoothie Bowl", "300g berry smoothie bowl.", 369, 23),

  item("white-monster-boba", "Coolers & Boba", "White Monster Boba", "350ml creamy boba cooler.", 249, 36),
  item("japanese-coffee-jelly", "Coolers & Boba", "Japanese Coffee Jelly", "Iced coffee with Japanese coffee jelly.", 229, 44),
  item("cranberry-iced-tea", "Coolers & Boba", "Cranberry Iced Tea", "Refreshing cranberry iced tea.", 169, 48),
  item("peach-iced-tea", "Coolers & Boba", "Peach Iced Tea", "Peach-flavoured iced tea.", 159, 47),
  item("tiramisu-frappe", "Coolers & Boba", "Tiramisu Frappe", "Dessert-inspired tiramisu frappe.", 179, 51),
  item("orng-diet-coke-espresso", "Coolers & Boba", "ORNG Diet Coke Espresso", "Bold espresso with sparkling Diet Coke.", 189, 55),
  item("brazilian-lemonade", "Coolers & Boba", "Brazilian Lemonade", "Creamy Brazilian-style lemonade.", 159, 43),
  item("hazelnut-frappe", "Coolers & Boba", "Hazelnut Frappe", "Creamy hazelnut frappe.", 169, 52),
  item("cinnamon-frappe", "Coolers & Boba", "Cinnamon Frappe", "Smooth cinnamon-spiced frappe.", 289, 53),
  item("strawberry-zillianade", "Coolers & Boba", "Strawberry Zillianade", "Strawberry lemonade cooler.", 219, 50),
  item("lemon-iced-tea", "Coolers & Boba", "Lemon Iced Tea", "Classic zesty lemon iced tea.", 219, 49),
  item("pink-grapefruit-iced-tea", "Coolers & Boba", "Pink Grapefruit Iced Tea", "Tart pink grapefruit iced tea.", 249, 46),
  item("lavender-iced-tea", "Coolers & Boba", "Lavender Iced Tea", "Floral lavender iced tea.", 259, 45),
  item("chunky-coconut-boba", "Coolers & Boba", "Chunky Coconut Boba", "Coconut boba cooler.", 229, 45),
  item("irish-cream-frappe", "Coolers & Boba", "Irish Cream Frappe", "Rich Irish cream-style frappe.", 239, 51),

  item("seasonal-chocolate-dipped-fruits", "Desserts", "Seasonal Chocolate Dipped Fruits", "Seasonal fruits dipped in chocolate.", 99, 61),
  item("pistachio-cookie", "Desserts", "Pistachio Cookie", "Buttery pistachio cookie.", 119, 62),
  item("nutella-filled-cookie", "Desserts", "Nutella Filled Cookie", "Soft cookie with a Nutella centre.", 119, 60),
  item("triple-chocolate-mini-cookies", "Desserts", "Triple Chocolate Mini Cookies", "170g pack of triple chocolate cookies.", 279, 62),
  item("hazelnut-chip-cookie", "Desserts", "Hazelnut Chip Cookie", "Hazelnut and chocolate chip cookie.", 139, 69),
  item("belgian-truffle-cheesecake", "Desserts", "Belgian Truffle Cheesecake", "Indulgent Belgian truffle cheesecake.", 279, 64),
  item("swiss-chocolate-cheesecake", "Desserts", "Swiss Chocolate Cheesecake", "Rich Swiss chocolate cheesecake.", 229, 65),
  item("white-chocolate-cheesecake", "Desserts", "White Chocolate Cheesecake", "Creamy white chocolate cheesecake.", 219, 66),
  item("double-chocolate-cheesecake", "Desserts", "Double Chocolate Cheesecake", "Deep double chocolate cheesecake.", 249, 71),
  item("chocolate-dipped-croissants", "Desserts", "Chocolate Dipped Croissants", "Flaky croissants dipped in chocolate.", 169, 67),
  item("cinnamon-bun", "Desserts", "Cinnamon Bun", "Soft cinnamon bun with icing.", 209, 70),
  item("dark-chocolate-berry-cake", "Desserts", "Dark Chocolate Berry Cake", "Dark chocolate cake with berries.", 259, 68)
];
const initialProducts = [
  {
    id: 1,
    image: ["/img1.jpg", "/img1-a.jpg", "/img1-b.jpg", "/img1-c.jpg"],
    style: "Work & Office",
    category: "w",
    heading: "Timeless Classic Collection",
    desc: "Crafted from soft, breathable fabrics, the relaxed fit provides a carefree silhouette, while thoughtful details add a touch of urban chic. Whether you’re lounging at home or navigating a bustling day, our Timeless Classic Collection effortlessly combine ease with fashion, allowing you to move with relaxed confidence while making a statement of casual sophistication.",
    maindesc:
      "Embrace comfort without sacrificing style in our Timeless Classic Collection, the epitome of laid-back luxury. Perfect for both active pursuits and leisurely moments, these joggers offer a harmonious blend of comfort and trendsetting design. Crafted from soft, breathable fabrics, the relaxed fit provides a carefree silhouette, while thoughtful details add a touch of urban chic. Whether you’re lounging at home or navigating a bustling day, our Timeless Classic Collection effortlessly combine ease with fashion, allowing you to move with relaxed confidence while making a statement of casual sophistication.",
    price: 144.9,
    popular: true,
    colors: [
      { name: "Red", class: "bg-red-500", imgIndex: 0 },
      { name: "White", class: "bg-white", imgIndex: 1 },
      { name: "Green", class: "bg-green-500", imgIndex: 2 },
      { name: "Black", class: "bg-black", imgIndex: 3 },
    ],
    sizes: ["M", "L", "XL"],
  },
  {
    id: 2,
    image: ["/img2.jpg", "/img-02-b.jpg", "/img-02-a.jpg"],
    style: "Casual",
    category: "c",
    heading: "Bohemian Rhapsody Attire",
    desc: "From the office to high-powered meetings, our Bohemian Rhapsody Attire is more than clothing; it’s a statement of strength, ambition, and unwavering elegance, ensuring you stride into any professional setting with unparalleled grace and authority.",
    maindesc:
      "Command attention and redefine authority with our Bohemian Rhapsody Attire – a collection tailored to empower the modern woman. Immerse yourself in a fusion of sleek design and undeniable confidence as you slip into our meticulously crafted suits. With sharp lines, sophisticated cuts, and attention to detail, each piece in this ensemble exudes professionalism without compromising on style. From the office to high-powered meetings, our Bohemian Rhapsody Attire is more than clothing; it’s a statement of strength, ambition, and unwavering elegance, ensuring you stride into any professional setting with unparalleled grace and authority.",
    price: 165.5,
    popular: false,
    colors: [
      { name: "Black", class: "bg-black", imgIndex: 0 },
      { name: "Red", class: "bg-red-500", imgIndex: 1 },
      { name: "Green", class: "bg-green-500", imgIndex: 2 },
    ],
    sizes: [], // Not popular
  },
  {
    id: 3,
    image: ["/img3.jpg", "/img3-a.jpg", "/img3-b.jpg", "/img3-c.jpg"],
    style: "Evening Dress",
    category: "e",
    heading: "Midnight Gala Maxi Dress",
    desc: "The deep midnight hue, combined with subtle detailing and a touch of glamour, creates a look that is both timeless and captivating. Whether you’re attending a gala, a wedding, or a special event, the Midnight Gala Maxi Dress ensures you’ll be the epitome of sophistication, leaving a trail of enchantment wherever you go.",
    maindesc:
      "Step into the spotlight with our Midnight Gala Maxi Dress, a mesmerizing ensemble that embodies elegance and allure. This exquisite dress is designed to make a statement at every soirée, featuring a flowing silhouette that gracefully cascades to the floor. The deep midnight hue, combined with subtle detailing and a touch of glamour, creates a look that is both timeless and captivating. Whether you’re attending a gala, a wedding, or a special event, the Midnight Gala Maxi Dress ensures you’ll be the epitome of sophistication, leaving a trail of enchantment wherever you go.",
    price: 180.0,
    popular: false,
    colors: [
      { name: "White", class: "bg-white", imgIndex: 0 },
      { name: "Black", class: "bg-black", imgIndex: 1 },
      { name: "Green", class: "bg-green-500", imgIndex: 2 },
      { name: "Red", class: "bg-red-500", imgIndex: 3 },
    ],
    sizes: [], // Not popular
  },
  {
    id: 4,
    image: ["/img4.jpg", "/img4-a.jpg", "/img4-b.jpg", "/img4-c.jpg"],
    style: "Casual",
    category: "c",
    heading: "Power Suit Ensemble",
    desc: "Whether you’re leading a meeting or making a statement at a professional event, our Power Suit Ensemble effortlessly blends professionalism with contemporary flair, ensuring you exude confidence and leave a lasting impression wherever your ambitions take you.",
    maindesc:
      "Step into the boardroom with confidence and style in our Power Suit Ensemble – tailored for the modern, empowered woman. This ensemble is designed to make a statement at every professional setting, featuring a structured silhouette that exudes authority and sophistication. Whether you’re leading a meeting or making a statement at a professional event, our Power Suit Ensemble effortlessly blends professionalism with contemporary flair, ensuring you exude confidence and leave a lasting impression wherever your ambitions take you.",
    price: 125.5,
    popular: true,
    colors: [
      { name: "White", class: "bg-white", imgIndex: 0 },
      { name: "Black", class: "bg-black", imgIndex: 1 },
      { name: "Green", class: "bg-green-500", imgIndex: 2 },
      { name: "Red", class: "bg-red-500", imgIndex: 3 },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 5,
    image: ["/img-01.jpg", "/img-01-a.jpg", "/img-1-b.jpg", "/img-01.jpg"],
    style: "Work & Office",
    category: "w",
    heading: "Relaxed Fit Joggers",
    desc: "The soft, breathable fabric and relaxed silhouette provide an unmatched level of ease, making them perfect for lounging at home or stepping out for an on-the-go adventure. Versatile and effortlessly cool, our Relaxed Fit Joggers seamlessly combine comfort and fashion, ensuring you feel relaxed and look effortlessly stylish no matter the occasion.",
    maindesc:
      "Unwind in comfort without compromising style with our Relaxed Fit Joggers. This pair of joggers is designed to provide ultimate comfort and style, featuring a relaxed fit that allows you to move freely while maintaining a polished appearance. The soft, breathable fabric ensures you stay comfortable throughout the day, while the relaxed silhouette adds a touch of casual sophistication to your wardrobe. Whether you're lounging at home or heading out for a casual outing, our Relaxed Fit Joggers offer a perfect blend of comfort and fashion, making them a must-have addition to your wardrobe.",
    price: 250.0,
    popular: false,
    colors: [],
    sizes: [], // Not popular
  },
  {
    id: 6,
    image: ["/img-02.jpg", "/img-2-a.jpg", "/img-2-b.jpg", "/img-2-c.jpg"],
    style: "Active Wear",
    category: "a",
    heading: "Professional Pinstripe Blazer",
    desc: "Whether you’re leading a meeting or attending a formal event, the structured silhouette and refined details of our Professional Pinstripe Blazer will elevate your style, leaving an indelible mark of professionalism and grace.",
    maindesc:
      "Make a bold statement with our Professional Pinstripe Blazer — tailored for elegance. This blazer is designed to make a statement at every professional setting, featuring a structured silhouette that exudes authority and sophistication. Whether you’re leading a meeting or attending a formal event, the structured silhouette and refined details of our Professional Pinstripe Blazer will elevate your style, leaving an indelible mark of professionalism and grace.",
    price: 109.99,
    popular: false,
    colors: [],
    sizes: [], 
  },
  {
    id: 7,
    image: ["/img-04.jpg", "/img-04-c.jpg", "/img-04-b.jpg", "/img-04-a.jpg"],
    style: "Evening Dress",
    category: "e",
    heading: "Urban Chic Ensemble",
    desc: "The structured silhouette and refined details create a commanding presence, whether you’re leading a meeting or making a powerful entrance at a formal event. Versatile and chic, our Urban Chic Ensemble is not just a garment; it’s a symbol of confidence, competence, and sartorial excellence, ensuring you leave an indelible mark wherever your professional journey takes you.",
    maindesc:
      "Elevate your wardrobe with our Urban Chic Ensemble — a symbol of sophistication. This ensemble is designed to make a statement at every professional setting, featuring a structured silhouette that exudes authority and sophistication. Whether you’re leading a meeting or attending a formal event, the structured silhouette and refined details of our Professional Pinstripe Blazer will elevate your style, leaving an indelible mark of professionalism and grace.",
    price: 224.95,
    popular: true,
    colors: [],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 8,
    image: [
      "/img-03.jpg",
      "/img-03-a (1).jpg",
      "/img-03-c (1).jpg",
      "/img-03-b (1).jpg",
    ],
    style: "Active Wear",
    category: "a",
    heading: "Weekend Wanderlust Wardrobe",
    desc: "The structured silhouette and refined details create a commanding presence, whether you’re leading a meeting or making a powerful entrance at a formal event. Versatile and chic, our Weekend Wanderlust Wardrobe is not just a garment; it’s a symbol of confidence, competence, and sartorial excellence, ensuring you leave an indelible mark wherever your professional journey takes you.",
    maindesc:
      "Weekend Wanderlust Wardrobe blends sophistication with a relaxed, elegant vibe. This ensemble is designed to make a statement at every professional setting, featuring a structured silhouette that exudes authority and sophistication. Whether you’re leading a meeting or attending a formal event, the structured silhouette and refined details of our Professional Pinstripe Blazer will elevate your style, leaving an indelible mark of professionalism and grace.",
    price: 119.95,
    popular: true,
    colors: [],
    sizes: ["S", "M", "L"],
  },
];

export default initialProducts;

/**
 * utils/seed.js — Database Seeder
 *
 * Seeds the database with:
 *   - 1 Admin user
 *   - 3 Customer users
 *   - 20 Clothing products (across all categories)
 *   - 2 Sample orders
 *
 * Usage:
 *   node utils/seed.js          → seed data (clears existing first)
 *   node utils/seed.js --destroy → wipe all data without re-seeding
 */

const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Resolve .env from the server root regardless of where the script is invoked
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// ─── Sample Users ─────────────────────────────────────────────────────────────

const hashedPass = bcrypt.hashSync('password123', 12);

const users = [
  {
    name: 'Admin User',
    email: 'admin@shopify.com',
    password: hashedPass,
    role: 'admin',
    phone: '9000000001',
    address: {
      street: '1 Admin Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    },
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: hashedPass,
    role: 'customer',
    phone: '9876543210',
    address: {
      street: '22 Garden View',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India',
    },
  },
  {
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    password: hashedPass,
    role: 'customer',
    phone: '9123456789',
    address: {
      street: '88 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
    },
  },
  {
    name: 'Anita Patel',
    email: 'anita@example.com',
    password: hashedPass,
    role: 'customer',
    phone: '9988776655',
    address: {
      street: '5 Salt Lake',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700091',
      country: 'India',
    },
  },
];

// ─── Sample Products ──────────────────────────────────────────────────────────

const products = [
  // ── MEN ───────────────────────────────────────────────────────────────────
  {
    name: "Men's Classic Oxford Shirt",
    description:
      'Timeless Oxford shirt crafted from premium 100% cotton. Perfect for office wear or casual outings. Features a button-down collar and chest pocket.',
    price: 1499,
    discountPrice: 1199,
    category: 'men',
    brand: 'Arrow',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600',
        altText: "Men's Oxford Shirt",
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue', 'Navy'],
    countInStock: 85,
    isFeatured: true,
    rating: 4.5,
    numReviews: 38,
  },
  {
    name: "Men's Slim Fit Chinos",
    description:
      'Versatile slim-fit chinos made from stretch cotton blend. Ideal for both casual and smart-casual occasions. Wrinkle-resistant fabric.',
    price: 1799,
    discountPrice: 1399,
    category: 'men',
    brand: 'Levi\'s',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600',
        altText: "Men's Slim Fit Chinos",
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Khaki', 'Olive', 'Black', 'Navy'],
    countInStock: 60,
    isFeatured: false,
    rating: 4.3,
    numReviews: 22,
  },
  {
    name: "Men's Graphic Oversized Tee",
    description:
      'Trendy oversized t-shirt with bold graphic print. Made from 100% combed cotton for all-day comfort. Drop shoulder cut.',
    price: 699,
    discountPrice: 499,
    category: 'men',
    brand: 'H&M',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
        altText: "Men's Graphic Tee",
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'White', 'Grey'],
    countInStock: 120,
    isFeatured: true,
    rating: 4.7,
    numReviews: 95,
  },
  {
    name: "Men's Denim Jacket",
    description:
      'Classic denim jacket with a modern fit. Features two chest pockets, button closure, and adjustable hem. Stonewashed finish.',
    price: 2999,
    discountPrice: 2499,
    category: 'men',
    brand: 'Wrangler',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600',
        altText: "Men's Denim Jacket",
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Light Wash', 'Dark Wash'],
    countInStock: 45,
    isFeatured: true,
    rating: 4.6,
    numReviews: 52,
  },

  // ── WOMEN ─────────────────────────────────────────────────────────────────
  {
    name: "Women's Floral Wrap Dress",
    description:
      'Elegant floral wrap dress in lightweight chiffon. Perfect for brunches, parties, or semi-formal occasions. Self-tie waist belt included.',
    price: 2199,
    discountPrice: 1699,
    category: 'women',
    brand: 'Zara',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
        altText: "Women's Floral Wrap Dress",
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink Floral', 'Blue Floral', 'Red Floral'],
    countInStock: 70,
    isFeatured: true,
    rating: 4.8,
    numReviews: 112,
  },
  {
    name: "Women's High-Rise Skinny Jeans",
    description:
      'High-rise skinny jeans with 4-way stretch denim for ultimate comfort. Flattering silhouette with a classic five-pocket design.',
    price: 1999,
    discountPrice: 1599,
    category: 'women',
    brand: 'Levi\'s',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
        altText: "Women's Skinny Jeans",
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Classic Blue', 'Black', 'Grey'],
    countInStock: 95,
    isFeatured: false,
    rating: 4.5,
    numReviews: 78,
  },
  {
    name: "Women's Cotton Anarkali Kurta",
    description:
      'Beautiful Anarkali style kurta in premium cotton fabric. Features intricate embroidery at the neckline and sleeves. Includes matching dupatta.',
    price: 1799,
    discountPrice: 1399,
    category: 'women',
    brand: 'Biba',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600',
        altText: "Women's Anarkali Kurta",
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Mustard Yellow', 'Teal', 'Rose Pink'],
    countInStock: 55,
    isFeatured: true,
    rating: 4.9,
    numReviews: 143,
  },
  {
    name: "Women's Linen Blazer",
    description:
      'Structured linen blazer for a polished, professional look. Single-button closure with notch lapels. Lined interior for comfort.',
    price: 3499,
    discountPrice: 2799,
    category: 'women',
    brand: 'Mango',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4c5b?w=600',
        altText: "Women's Linen Blazer",
      },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Beige', 'White', 'Black'],
    countInStock: 30,
    isFeatured: false,
    rating: 4.4,
    numReviews: 29,
  },

  // ── KIDS ──────────────────────────────────────────────────────────────────
  {
    name: "Kids' Dinosaur Print T-Shirt",
    description:
      'Fun and colourful dinosaur print t-shirt for kids. Made from soft, hypoallergenic 100% cotton. Easy-care machine washable fabric.',
    price: 499,
    discountPrice: 349,
    category: 'kids',
    brand: 'Mothercare',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600',
        altText: "Kids' Dinosaur T-Shirt",
      },
    ],
    sizes: ['Free Size'],
    colors: ['Green', 'Orange', 'Blue'],
    countInStock: 200,
    isFeatured: false,
    rating: 4.7,
    numReviews: 63,
  },
  {
    name: "Kids' Denim Dungaree",
    description:
      'Adorable denim dungaree with adjustable straps and multiple pockets. Durable fabric perfect for active kids. Available in multiple sizes.',
    price: 899,
    discountPrice: 699,
    category: 'kids',
    brand: 'FirstCry',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600',
        altText: "Kids' Denim Dungaree",
      },
    ],
    sizes: ['Free Size'],
    colors: ['Light Blue', 'Dark Blue'],
    countInStock: 80,
    isFeatured: false,
    rating: 4.6,
    numReviews: 41,
  },

  // ── ACCESSORIES ───────────────────────────────────────────────────────────
  {
    name: 'Leather Bifold Wallet',
    description:
      'Premium genuine leather bifold wallet with RFID blocking technology. Features 6 card slots, 2 bill compartments, and a slim profile.',
    price: 1299,
    discountPrice: 999,
    category: 'accessories',
    brand: 'Hidesign',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
        altText: 'Leather Bifold Wallet',
      },
    ],
    sizes: ['Free Size'],
    colors: ['Tan Brown', 'Black', 'Dark Chocolate'],
    countInStock: 150,
    isFeatured: true,
    rating: 4.5,
    numReviews: 87,
  },
  {
    name: 'Canvas Tote Bag',
    description:
      'Large capacity canvas tote bag perfect for shopping, beach trips, or everyday use. Features reinforced handles and an inner zip pocket.',
    price: 799,
    discountPrice: 599,
    category: 'accessories',
    brand: 'Baggit',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600',
        altText: 'Canvas Tote Bag',
      },
    ],
    sizes: ['Free Size'],
    colors: ['Natural', 'Black', 'Navy'],
    countInStock: 110,
    isFeatured: false,
    rating: 4.3,
    numReviews: 54,
  },

  // ── FOOTWEAR ──────────────────────────────────────────────────────────────
  {
    name: "Men's White Leather Sneakers",
    description:
      'Clean, minimalist leather sneakers with a cushioned insole and rubber outsole. Versatile design that pairs well with any casual outfit.',
    price: 3999,
    discountPrice: 2999,
    category: 'footwear',
    brand: 'Puma',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        altText: "Men's White Sneakers",
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'White/Gold'],
    countInStock: 65,
    isFeatured: true,
    rating: 4.6,
    numReviews: 102,
  },
  {
    name: "Women's Block Heel Sandals",
    description:
      'Elegant block heel sandals with an adjustable ankle strap. Padded footbed for all-day comfort. Perfect for office or evening wear.',
    price: 2499,
    discountPrice: 1899,
    category: 'footwear',
    brand: 'Metro',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600',
        altText: "Women's Block Heel Sandals",
      },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Nude', 'Black', 'Tan'],
    countInStock: 40,
    isFeatured: false,
    rating: 4.4,
    numReviews: 36,
  },

  // ── ACTIVEWEAR ────────────────────────────────────────────────────────────
  {
    name: "Men's Compression Training Tee",
    description:
      'High-performance compression t-shirt with moisture-wicking technology. 4-way stretch fabric for unrestricted movement. Anti-odour finish.',
    price: 1199,
    discountPrice: 899,
    category: 'activewear',
    brand: 'Nike',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600',
        altText: "Men's Sports Tee",
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Red'],
    countInStock: 130,
    isFeatured: true,
    rating: 4.7,
    numReviews: 189,
  },
  {
    name: "Women's Yoga Leggings",
    description:
      'High-waist yoga leggings with a hidden waistband pocket. Four-way stretch fabric provides maximum flexibility. Squat-proof and moisture-wicking.',
    price: 1499,
    discountPrice: 1099,
    category: 'activewear',
    brand: 'Adidas',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600',
        altText: "Women's Yoga Leggings",
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Charcoal', 'Dark Teal'],
    countInStock: 90,
    isFeatured: true,
    rating: 4.8,
    numReviews: 215,
  },

  // ── ETHNIC ────────────────────────────────────────────────────────────────
  {
    name: "Men's Silk Kurta Pyjama Set",
    description:
      'Luxurious silk blend kurta pyjama set perfect for festivals and celebrations. Intricate zari embroidery at the collar and cuffs.',
    price: 4999,
    discountPrice: 3999,
    category: 'ethnic',
    brand: 'Manyavar',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1620835838116-a4e4b62b9c8c?w=600',
        altText: "Men's Silk Kurta Set",
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Ivory', 'Royal Blue', 'Maroon'],
    countInStock: 35,
    isFeatured: true,
    rating: 4.9,
    numReviews: 68,
  },
  {
    name: "Women's Banarasi Silk Saree",
    description:
      'Authentic Banarasi silk saree with traditional zari weave. Comes with an unstitched blouse piece. A timeless piece for special occasions.',
    price: 8999,
    discountPrice: 7499,
    category: 'ethnic',
    brand: 'Nalli',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
        altText: "Women's Banarasi Saree",
      },
    ],
    sizes: ['Free Size'],
    colors: ['Red Gold', 'Green Gold', 'Purple Gold'],
    countInStock: 20,
    isFeatured: true,
    rating: 4.9,
    numReviews: 47,
  },

  // ── WESTERN ───────────────────────────────────────────────────────────────
  {
    name: "Women's Cropped Denim Jacket",
    description:
      'Trendy cropped denim jacket with raw hem edge details. Slightly oversized cut for a relaxed layering effect. Pairs perfectly with dresses and joggers.',
    price: 2499,
    discountPrice: 1999,
    category: 'western',
    brand: 'Only',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548624313-0396a9287738?w=600',
        altText: "Women's Cropped Denim Jacket",
      },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Light Wash', 'Medium Wash'],
    countInStock: 55,
    isFeatured: false,
    rating: 4.5,
    numReviews: 61,
  },
];

// ─── Seeder Function ──────────────────────────────────────────────────────────

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // ── Wipe existing data ───────────────────────────────────────────────────
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // ── Insert users ─────────────────────────────────────────────────────────
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0];
    const customerUser = createdUsers[1];
    console.log(`👤 Created ${createdUsers.length} users`);

    // ── Insert products ──────────────────────────────────────────────────────
    const productsWithCreator = products.map((p) => ({
      ...p,
      createdBy: adminUser._id,
    }));
    const createdProducts = await Product.insertMany(productsWithCreator);
    console.log(`👕 Created ${createdProducts.length} products`);

    // ── Create sample orders ─────────────────────────────────────────────────
    const sampleOrders = [
      {
        user: customerUser._id,
        orderItems: [
          {
            name: createdProducts[0].name,
            quantity: 1,
            image: createdProducts[0].images[0].url,
            price: createdProducts[0].discountPrice || createdProducts[0].price,
            size: 'M',
            color: 'White',
            product: createdProducts[0]._id,
          },
          {
            name: createdProducts[2].name,
            quantity: 2,
            image: createdProducts[2].images[0].url,
            price: createdProducts[2].discountPrice || createdProducts[2].price,
            size: 'L',
            color: 'Black',
            product: createdProducts[2]._id,
          },
        ],
        shippingAddress: {
          street: '22 Garden View',
          city: 'Delhi',
          state: 'Delhi',
          postalCode: '110001',
          country: 'India',
        },
        paymentMethod: 'UPI',
        itemsPrice: 2197,
        taxPrice: 395.46,
        shippingPrice: 0,
        totalPrice: 2592.46,
        isPaid: true,
        paidAt: new Date(),
        status: 'delivered',
        isDelivered: true,
        deliveredAt: new Date(),
        trackingNumber: 'BLUE123456789',
      },
      {
        user: createdUsers[2]._id,
        orderItems: [
          {
            name: createdProducts[4].name,
            quantity: 1,
            image: createdProducts[4].images[0].url,
            price: createdProducts[4].discountPrice || createdProducts[4].price,
            size: 'S',
            color: 'Pink Floral',
            product: createdProducts[4]._id,
          },
        ],
        shippingAddress: {
          street: '88 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
        },
        paymentMethod: 'CreditCard',
        itemsPrice: 1699,
        taxPrice: 305.82,
        shippingPrice: 0,
        totalPrice: 2004.82,
        isPaid: true,
        paidAt: new Date(),
        status: 'shipped',
        isDelivered: false,
        trackingNumber: 'DELHIVERY987654',
      },
    ];

    await Order.insertMany(sampleOrders);
    console.log(`📦 Created ${sampleOrders.length} sample orders`);

    // ─── Summary ─────────────────────────────────────────────────────────────
    console.log('\n🌱 Database seeded successfully!\n');
    console.log('─────────────────────────────────────────');
    console.log('🔑 Login Credentials (all passwords: password123)');
    console.log('─────────────────────────────────────────');
    console.log('  ADMIN    → admin@shopify.com');
    console.log('  Customer → priya@example.com');
    console.log('  Customer → rahul@example.com');
    console.log('  Customer → anita@example.com');
    console.log('─────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// ─── Destroy Mode ─────────────────────────────────────────────────────────────

const destroyDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
    ]);

    console.log('🗑️  All data destroyed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Destroy failed:', error.message);
    process.exit(1);
  }
};

// ─── Entry Point ──────────────────────────────────────────────────────────────

if (process.argv[2] === '--destroy') {
  destroyDB();
} else {
  seedDB();
}

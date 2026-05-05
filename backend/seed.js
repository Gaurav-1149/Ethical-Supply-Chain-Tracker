import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';
import { calculateEthicalScore } from './controllers/scoreEngine.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Traceable Organic Coffee',
    price: 18.5,
    category: 'Beverages',
    supplyChain: [
      {
        stepName: 'Farmer Cooperative',
        location: 'Chikmagalur, India',
        description: 'Smallholder growers cultivate shade-grown coffee with fair wage agreements.',
        transportDistance: 80,
        ethicalFlags: {
          fairWages: true,
          ecoFriendly: true,
          lowCarbon: true,
          sustainablePractices: true
        }
      },
      {
        stepName: 'Processing Unit',
        location: 'Bengaluru, India',
        description: 'Beans are washed using water recycling systems and solar drying beds.',
        transportDistance: 240,
        ethicalFlags: {
          fairWages: true,
          ecoFriendly: true,
          lowCarbon: true,
          sustainablePractices: true
        }
      },
      {
        stepName: 'Distribution Hub',
        location: 'Mumbai, India',
        description: 'Bulk shipments are consolidated for lower per-unit emissions.',
        transportDistance: 980,
        ethicalFlags: {
          fairWages: true,
          ecoFriendly: false,
          lowCarbon: false,
          sustainablePractices: true
        }
      }
    ]
  },
  {
    name: 'Recycled Cotton Tote',
    price: 12,
    category: 'Accessories',
    supplyChain: [
      {
        stepName: 'Fiber Recovery',
        location: 'Surat, India',
        description: 'Post-industrial cotton scraps are sorted and respun into usable fiber.',
        transportDistance: 65,
        ethicalFlags: {
          fairWages: true,
          ecoFriendly: true,
          lowCarbon: true,
          sustainablePractices: true
        }
      },
      {
        stepName: 'Stitching Workshop',
        location: 'Ahmedabad, India',
        description: 'Bags are stitched by a verified workshop with worker safety audits.',
        transportDistance: 270,
        ethicalFlags: {
          fairWages: true,
          ecoFriendly: true,
          lowCarbon: true,
          sustainablePractices: true
        }
      }
    ]
  },
  {
    name: 'Everyday Plastic Lunchbox',
    price: 7.25,
    category: 'Home Goods',
    supplyChain: [
      {
        stepName: 'Raw Material Supplier',
        location: 'Unknown',
        description: 'Supplier documentation is incomplete and recycled content is unverified.',
        transportDistance: 1600,
        ethicalFlags: {
          fairWages: false,
          ecoFriendly: false,
          lowCarbon: false,
          sustainablePractices: false
        }
      },
      {
        stepName: 'Packaging',
        location: 'Chennai, India',
        description: 'Single-use retail packaging is used with limited sourcing data.',
        transportDistance: 720,
        ethicalFlags: {
          fairWages: true,
          ecoFriendly: false,
          lowCarbon: false,
          sustainablePractices: false
        }
      }
    ]
  }
];

async function seed() {
  await connectDB();
  await User.deleteMany({});
  await Product.deleteMany({});

  const buyer = await User.create({
    name: 'Demo Buyer',
    email: 'buyer@example.com',
    password: 'password123',
    role: 'user'
  });

  const seller = await User.create({
    name: 'GreenPath Seller',
    email: 'seller@example.com',
    password: 'password123',
    role: 'seller'
  });

  await Product.insertMany(
    sampleProducts.map((product) => ({
      ...product,
      seller: seller._id,
      ethicalScore: calculateEthicalScore(product.supplyChain)
    }))
  );

  console.log(`Seeded users ${buyer.email}, ${seller.email} and ${sampleProducts.length} products.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

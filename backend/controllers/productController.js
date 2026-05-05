import Product from '../models/Product.js';
import { calculateEthicalScore, getScoreBand } from './scoreEngine.js';

function withScoreBand(product) {
  const data = product.toObject ? product.toObject() : product;
  return {
    ...data,
    scoreBand: getScoreBand(data.ethicalScore)
  };
}

export async function createProduct(req, res, next) {
  try {
    const { name, price, category } = req.body;
    const product = await Product.create({
      name,
      price,
      category,
      seller: req.user._id
    });

    res.status(201).json(withScoreBand(product));
  } catch (error) {
    next(error);
  }
}

export async function getProducts(req, res, next) {
  try {
    const { search = '', minScore, ecoFriendlyOnly, sellerOnly } = req.query;
    const query = {};

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (minScore) {
      query.ethicalScore = { $gte: Number(minScore) };
    }

    if (ecoFriendlyOnly === 'true') {
      query['supplyChain.ethicalFlags.ecoFriendly'] = true;
    }

    if (sellerOnly === 'true' && req.user?.role === 'seller') {
      query.seller = req.user._id;
    }

    const products = await Product.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json(products.map(withScoreBand));
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(withScoreBand(product));
  } catch (error) {
    next(error);
  }
}

export async function addSupplyChainStep(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.seller.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the product seller can add supply chain steps' });
    }

    product.supplyChain.push(req.body);
    product.ethicalScore = calculateEthicalScore(product.supplyChain);
    await product.save();
    await product.populate('seller', 'name email');

    res.status(201).json(withScoreBand(product));
  } catch (error) {
    next(error);
  }
}

export async function getSupplyChain(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).select('name ethicalScore supplyChain');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      productId: product._id,
      name: product.name,
      ethicalScore: product.ethicalScore,
      scoreBand: getScoreBand(product.ethicalScore),
      supplyChain: product.supplyChain
    });
  } catch (error) {
    next(error);
  }
}

export async function getDashboard(req, res, next) {
  try {
    const [summary] = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          averageEthicalScore: { $avg: '$ethicalScore' },
          sustainableProducts: {
            $sum: {
              $cond: [{ $gte: ['$ethicalScore', 70] }, 1, 0]
            }
          }
        }
      }
    ]);

    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          averageScore: { $avg: '$ethicalScore' },
          count: { $sum: 1 }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);

    res.json({
      totalProducts: summary?.totalProducts || 0,
      averageEthicalScore: Math.round(summary?.averageEthicalScore || 0),
      sustainableProducts: summary?.sustainableProducts || 0,
      categories: categories.map((category) => ({
        category: category._id,
        averageScore: Math.round(category.averageScore),
        count: category.count
      }))
    });
  } catch (error) {
    next(error);
  }
}

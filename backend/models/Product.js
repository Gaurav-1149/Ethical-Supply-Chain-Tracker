import mongoose from 'mongoose';

const ethicalFlagsSchema = new mongoose.Schema(
  {
    fairWages: {
      type: Boolean,
      default: false
    },
    ecoFriendly: {
      type: Boolean,
      default: false
    },
    lowCarbon: {
      type: Boolean,
      default: false
    },
    sustainablePractices: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const supplyChainStepSchema = new mongoose.Schema(
  {
    stepName: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    transportDistance: {
      type: Number,
      required: true,
      min: 0
    },
    ethicalFlags: {
      type: ethicalFlagsSchema,
      default: () => ({})
    }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ethicalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    supplyChain: {
      type: [supplyChainStepSchema],
      default: []
    }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', category: 'text' });

export default mongoose.model('Product', productSchema);

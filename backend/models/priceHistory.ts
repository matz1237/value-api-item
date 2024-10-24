//backend/models/products.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  currentPrice: number;
  priceHistory: {
    price: number;
    changedBy: mongoose.Types.ObjectId;
    changedAt: Date;
  }[];
}

const productSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  currentPrice: { 
    type: Number, 
    required: true 
  },
  priceHistory: [{
    price: { 
      type: Number, 
      required: true 
    },
    changedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    changedAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product
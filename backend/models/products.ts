import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true }
  // Add other fields as needed
});

const Product = mongoose.model('Product', productSchema);

export default Product;

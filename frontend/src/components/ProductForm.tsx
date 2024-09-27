// src/components/ProductForm.tsx
import React, { useState } from 'react';
import { createProduct, updateProduct } from '../api';

const ProductForm = ({ productId, onSuccess }: { productId?: string; onSuccess: () => void }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = { name, price, description };
    if (productId) {
      await updateProduct(productId, product);
    } else {
      await createProduct(product);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default ProductForm;

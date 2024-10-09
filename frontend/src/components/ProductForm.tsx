// frontend/src/components/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct, getProduct } from '../api'; // Assuming getProduct is used for fetching product details
import { useNavigate } from 'react-router-dom';

interface ProductFormProps {
  productId?: string;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch product details if editing
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const { data } = await getProduct(productId);
          setFormData({
            name: data.name,
            price: data.price,
            description: data.description,
          });
        } catch (err) {
          alert('Error fetching product details');
        }
      };
      fetchProduct();
    }
  }, [productId]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form
  const validateForm = () => {
    const { name, price } = formData;
    if (!name || !price || isNaN(Number(price))) {
      return 'Please enter valid product details.';
    }
    return null;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    setIsLoading(true);
    try {
      if (productId) {
        await updateProduct(productId, formData);
      } else {
        await createProduct(formData);
      }
      onSuccess();
      navigate('/products'); // Navigate to product list or a success page
    } catch (err) {
      alert('Error saving product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Product Price"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Product'}
      </button>
    </form>
  );
};

export default ProductForm;

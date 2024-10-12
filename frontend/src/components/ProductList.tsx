//frontend/src/components/ProductList.tsx
import React, { useEffect, useState } from 'react';
import { getProducts } from '../api';

interface Product {
  _id: string; // Assuming _id is the unique identifier
  name: string;
  price: number;
}


const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(); // Using the imported getProducts function
        setProducts(response.data); // Update the state with fetched products
      } catch (err) {
        setError('Error fetching products: ' + (err as Error).message); // Handle any errors
      } finally {
        setLoading(false); // Set loading to false whether fetch succeeds or fails
      }
    };

    fetchProducts(); // Call the fetch function
  }, []); // Empty dependency array means this runs once when the component mounts
  
  if (loading) {
    return <p>Loading...</p>; // Show loading message while fetching
  }

  if (error) {
    return <p>{error}</p>; // Show error message if there was a problem
  }

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;

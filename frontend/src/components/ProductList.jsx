import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then((response) => response.json())
      .then((data) => setProducts(data));

    fetch('http://127.0.0.1:8000/api/categories/')
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className="px-4 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors"
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className="px-4 py-2 rounded-full bg-white border border-pink-300 text-pink-600 hover:bg-pink-50 transition-colors"
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
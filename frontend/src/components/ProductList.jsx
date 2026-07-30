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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2 rounded-full font-medium border-2 transition-all ${
            selectedCategory === null
              ? 'bg-orange-600 text-white border-orange-600 shadow-md'
              : 'bg-white text-gray-700 border-sky-200 hover:border-sky-400'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2 rounded-full font-medium border-2 transition-all ${
              selectedCategory === category.id
                ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                : 'bg-white text-gray-700 border-sky-200 hover:border-sky-400'
            }`}
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
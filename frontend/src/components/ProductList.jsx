import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/`)
      .then((response) => response.json())
      .then((data) => setProducts(data));

    fetch(`${import.meta.env.VITE_API_URL}/categories/`)
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  let filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (searchQuery) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F6] p-6">
      {searchQuery && (
        <p className="text-center text-[#7E818C] mb-4">
          Showing results for "<span className="font-semibold text-[#282C3F]">{searchQuery}</span>"
        </p>
      )}

      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
            selectedCategory === null
              ? 'bg-[#FF3F6C] text-white border-[#FF3F6C]'
              : 'bg-white text-[#282C3F] border-gray-200 hover:border-[#FF3F6C]'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
              selectedCategory === category.id
                ? 'bg-[#FF3F6C] text-white border-[#FF3F6C]'
                : 'bg-white text-[#282C3F] border-gray-200 hover:border-[#FF3F6C]'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import CategoryTiles from './CategoryTiles';
import { useLanguage } from '../context/LanguageContext';
import NailPaintPicker from './NailPaintPicker';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/`)
      .then((response) => response.json())
      .then((data) => setProducts(data));

    fetch(`${import.meta.env.VITE_API_URL}/categories/`)
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug && categories.length > 0) {
      const matchedCategory = categories.find((cat) => cat.slug === categorySlug);
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.id);
      }
    }
  }, [searchParams, categories]);

  let filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (searchQuery) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const selectedCategoryObj = categories.find((cat) => cat.id === selectedCategory);
  const isNailPaintCategory = selectedCategoryObj?.slug === 'nail-paint';

  return (
    <div className="min-h-screen bg-[#F5F5F6] p-6">
      {searchQuery && (
        <p className="text-center text-[#7E818C] mb-4">
          Showing results for "<span className="font-semibold text-[#282C3F]">{searchQuery}</span>"
        </p>
      )}

      <CategoryTiles
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        t={t}
      />

      {isNailPaintCategory ? (
        <NailPaintPicker />
      ) : filteredProducts.length === 0 ? (
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
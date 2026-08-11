import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import CategoryTiles from './CategoryTiles';
import { useLanguage } from '../context/LanguageContext';
import NailPaintPicker from './NailPaintPicker';
import HomeSuggestions from './HomeSuggestions';

const CATEGORY_GROUPS = {
  cloth: ['cloth', 'kurti', 'plazo'],
  jewelry: ['jewelry', 'mangalsutra', 'earrings', 'jhumka', 'nath'],
};

function seededShuffle(array, seed) {
  const shuffled = [...array];
  let random = seed;

  const nextRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getTimeSeed() {
  const tenHourBlock = Math.floor(Date.now() / (10 * 60 * 60 * 1000));
  return tenHourBlock;
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { t } = useLanguage();
  const navigate = useNavigate();

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
    } else {
      setSelectedCategory(null);
    }
  }, [searchParams, categories]);

  const handleCategorySelect = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      navigate(`/?category=${category.slug}`);
    } else {
      navigate('/');
    }
  };

  const categorySlug = searchParams.get('category');
  const group = CATEGORY_GROUPS[categorySlug];

  let filteredProducts = products;

  if (group) {
    const groupCategoryIds = categories
      .filter((cat) => group.includes(cat.slug))
      .map((cat) => cat.id);
    const groupProducts = products.filter((product) => groupCategoryIds.includes(product.category));
    filteredProducts = categorySlug === 'jewelry' ? seededShuffle(groupProducts, getTimeSeed()) : groupProducts;
  } else if (selectedCategory) {
    filteredProducts = products.filter((product) => product.category === selectedCategory);
  }

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

      <div className="sticky top-0 z-30 bg-[#F5F5F6] pt-2 pb-2 -mx-6 px-3">
        <CategoryTiles
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
          t={t}
        />
      </div>

      {isNailPaintCategory ? (
        <NailPaintPicker />
      ) : selectedCategory === null && !searchQuery ? (
        <HomeSuggestions products={products} />
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
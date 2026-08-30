import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import CategoryTiles from './CategoryTiles';
import { useLanguage } from '../context/LanguageContext';
import NailPaintPicker from './NailPaintPicker';
import HomeSuggestions from './HomeSuggestions';
import ProductCardSkeleton from './ProductCardSkeleton';


const CATEGORY_GROUPS = {
  cloth: ['cloth', 'kurti', 'plazo'],
  jewelry: ['jewelry', 'mangalsutra', 'earrings', 'jhumka', 'nath'],
};

let cachedProducts = null;
let cachedCategories = null;
let filteredCache = {};

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
  const [products, setProducts] = useState(cachedProducts || []);
  const [categories, setCategories] = useState(cachedCategories || []);
  const [loading, setLoading] = useState(!cachedProducts);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (cachedProducts && cachedCategories) {
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/products/?page_size=100`)
      .then((response) => response.json())
      .then((data) => {
        const list = data.results || data;
        cachedProducts = list;
        setProducts(list);
      })
      .finally(() => setLoading(false));

    fetch(`${import.meta.env.VITE_API_URL}/categories/?page_size=100`)
      .then((response) => response.json())
      .then((data) => {
        const list = data.results || data;
        cachedCategories = list;
        setCategories(list);
      });
  }, []);

  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const matchedCategory = categories.find((cat) => cat.slug === categorySlug);
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.id);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [categorySlug, categories]);

  // Category ya search select hone par, backend se hi poora fresh data maango
  // (already-loaded products mein se filter nahi karte, taaki 100 se zyada
  // products wali category (jaise 120 jewelry) bhi poori dikhe)
  useEffect(() => {
    const group = CATEGORY_GROUPS[categorySlug];

    if (!categorySlug && !searchQuery) {
      setFilteredProducts([]);
      return;
    }

    const cacheKey = `${categorySlug || ''}|${searchQuery || ''}`;

    if (filteredCache[cacheKey]) {
      // Purana cached data turant dikhao, background mein fresh data bhi le aayenge
      setFilteredProducts(filteredCache[cacheKey]);
      setFilterLoading(false);
    } else {
      setFilterLoading(true);
    }

    const params = new URLSearchParams();
    params.set('page_size', '300');

    if (group) {
      params.set('category', group.join(','));
    } else if (categorySlug) {
      params.set('category', categorySlug);
    }

    if (searchQuery) {
      params.set('search', searchQuery);
    }

    fetch(`${import.meta.env.VITE_API_URL}/products/?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        let results = data.results || data;
        if (categorySlug === 'jewelry') {
          results = seededShuffle(results, getTimeSeed());
        }
        filteredCache[cacheKey] = results;
        setFilteredProducts(results);
      })
      .finally(() => setFilterLoading(false));
  }, [categorySlug, searchQuery]);

  const handleCategorySelect = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      navigate(`/?category=${category.slug}`);
    } else {
      navigate('/');
    }
  };

  const selectedCategoryObj = categories.find((cat) => cat.id === selectedCategory);
  const isNailPaintCategory = selectedCategoryObj?.slug === 'nail-paint';
  const isActiveFilter = !!categorySlug || !!searchQuery;

  const sortedCategories = [...categories].sort((a, b) => {
    const countA = products.filter((p) => p.category === a.id).length;
    const countB = products.filter((p) => p.category === b.id).length;
    return countB - countA;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F6] p-6">
      {searchQuery && (
        <p className="text-center text-[#7E818C] mb-4">
          Showing results for "<span className="font-semibold text-[#282C3F]">{searchQuery}</span>"
        </p>
      )}

      <div className="sticky top-0 z-30 bg-[#F5F5F6] pt-2 pb-2 -mx-6 px-3">
        <CategoryTiles
          categories={sortedCategories}
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
          t={t}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : isNailPaintCategory ? (
        <NailPaintPicker />
      ) : !isActiveFilter ? (
        <HomeSuggestions products={products} />
      ) : filterLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
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
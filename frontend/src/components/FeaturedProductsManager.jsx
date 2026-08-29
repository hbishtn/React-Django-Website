import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function FeaturedProductsManager() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState([]); // array of product ids, in order
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/products/?page_size=200`).then((r) => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/products/featured/`).then((r) => r.json()),
    ]).then(([allData, featuredData]) => {
      setProducts(allData.results || allData);
      const orderedIds = (featuredData || [])
        .slice()
        .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))
        .map((p) => p.id);
      setSelected(orderedIds);
      setLoading(false);
    });
  }, []);

  const toggleSelect = (productId) => {
    setSelected((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 6) {
        setMessage('Max 6 products hi select kar sakte ho. Pehle koi hatao.');
        return prev;
      }
      setMessage('');
      return [...prev, productId];
    });
  };

  const handleSave = () => {
    setSaving(true);
    setMessage('');
    fetch(`${import.meta.env.VITE_API_URL}/products/set-featured/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ product_ids: selected }),
    })
      .then((response) => response.json())
      .then(() => {
        setMessage('Hero section save ho gaya!');
      })
      .catch(() => setMessage('Kuch galat ho gaya, dobara try karo.'))
      .finally(() => setSaving(false));
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <p className="text-center mt-10 text-[#7E818C]">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F6] p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-5">
        <h2 className="text-xl font-bold text-[#282C3F] mb-1">Set Hero Section</h2>
        <p className="text-xs text-[#7E818C] mb-4">
          Max 6 products select karo. Jitne order mein click karoge, wahi order home page pe dikhega.
        </p>

        <input
          type="text"
          placeholder="Product search karo..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-[#F5F5F6] border border-gray-200 rounded-full px-4 py-2 text-sm mb-4 focus:outline-none focus:border-[#FF3F6C]"
        />

        {message && (
          <p className="text-xs text-center text-[#FF3F6C] font-semibold mb-3">{message}</p>
        )}

        <div className="max-h-[420px] overflow-y-auto flex flex-col gap-2 mb-4">
          {filteredProducts.map((product) => {
            const selectedIndex = selected.indexOf(product.id);
            const isSelected = selectedIndex !== -1;
            const img = product.images?.find((im) => im.is_primary) || product.images?.[0];

            return (
              <button
                key={product.id}
                onClick={() => toggleSelect(product.id)}
                className={`flex items-center gap-3 p-2 rounded-lg border text-left ${
                  isSelected ? 'border-[#FF3F6C] bg-[#FFF0F4]' : 'border-gray-200'
                }`}
              >
                <div className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-[#F5F5F6]">
                  {img && (
                    <img src={img.image} alt={product.name} className="w-full h-full object-cover" />
                  )}
                  {isSelected && (
                    <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#FF3F6C] text-white text-[11px] font-bold flex items-center justify-center">
                      {selectedIndex + 1}
                    </span>
                  )}
                </div>
                <span className="text-sm text-[#282C3F] font-medium truncate">{product.name}</span>
              </button>
            );
          })}

          {filteredProducts.length === 0 && (
            <p className="text-center text-sm text-[#7E818C] py-6">Koi product nahi mila.</p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 rounded-lg bg-[#FF3F6C] text-white font-bold text-sm disabled:opacity-60"
        >
          {saving ? 'Save ho raha hai...' : `Save (${selected.length}/6 selected)`}
        </button>
      </div>
    </div>
  );
}

export default FeaturedProductsManager;
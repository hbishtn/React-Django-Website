import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function QuickAddProduct() {
  const { token } = useAuth();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [categorySlug, setCategorySlug] = useState('jewelry');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [secondImage, setSecondImage] = useState(null);
  const [secondImagePreview, setSecondImagePreview] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [removingBg, setRemovingBg] = useState(false);

  const [matching, setMatching] = useState(false);
  const [matchInfo, setMatchInfo] = useState(null);
  const [showCategoryPhotos, setShowCategoryPhotos] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories/?page_size=100`)
        .then((response) => response.json())
        .then((data) => setCategories(data.results || data));
    }, []);
    

  const checkImageMatch = async (compressedFile) => {
    setMatching(true);
    setMatchInfo(null);
    try {
      const formData = new FormData();
      formData.append('image', compressedFile);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/match-image/`, {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });
      const data = await response.json();

      if (data.match) {
        setName(data.match.name);
        setDescription(data.match.description);
        setCategorySlug(data.match.category_slug);
        setMatchInfo({ confidence: data.match.confidence });
        setMessage(`Milta-julta purana product mila (${data.match.confidence}% match) — verify karke save karo.`);
      }
    } catch (err) {
      console.error('Match check failed:', err);
      // Match check fail ho jaaye to bhi koi baat nahi — user "Auto-Generate
      // with AI" button se normally aage badh sakta hai.
    }
    setMatching(false);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessage('');
    setMatchInfo(null);
    try {
      const compressed = await compressImage(file);
      setImage(compressed);
      setImagePreview(URL.createObjectURL(compressed));
      setName('');
      setDescription('');
      // Pehle apne purane products se match check karo (fast, free, AI nahi
      // lagti) — sirf tabhi AI (Groq) ka sahara lena padega jab match na mile.
      checkImageMatch(compressed);
    } catch (err) {
      console.error('Image compress failed:', err);
      setMessage('Yeh photo process nahi ho payi. Kripya doosri photo try karo.');
    }
    };

  const handleSecondImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessage('');
    try {
      const compressed = await compressImage(file);
      setSecondImage(compressed);
      setSecondImagePreview(URL.createObjectURL(compressed));
    } catch (err) {
      console.error('Image compress failed:', err);
      setMessage('Yeh photo process nahi ho payi. Kripya doosri photo try karo.');
    }
    };

  const removeMainImage = () => {
    setImage(null);
    setImagePreview(null);
    setSecondImage(null);
    setSecondImagePreview(null);
    setName('');
    setDescription('');
  };

  const removeSecondImage = () => {
    setSecondImage(null);
    setSecondImagePreview(null);
  };

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    // Fast, memory-safe path: createImageBitmap lets the browser downscale
    // WHILE decoding, so a huge (e.g. 48MP/108MP) camera photo never has to
    // sit in memory at full resolution. This is what was silently failing
    // (or hanging) on large photos with the old FileReader+<img> approach.
    if (typeof createImageBitmap === 'function') {
      return (async () => {
        try {
          const original = await createImageBitmap(file);
          const scale = Math.min(1, maxWidth / original.width);
          const targetWidth = Math.round(original.width * scale);
          const targetHeight = Math.round(original.height * scale);

          let resizedBitmap = original;
          if (scale < 1) {
            resizedBitmap = await createImageBitmap(original, {
              resizeWidth: targetWidth,
              resizeHeight: targetHeight,
              resizeQuality: 'high',
            });
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(resizedBitmap, 0, 0, targetWidth, targetHeight);

          original.close();
          if (resizedBitmap !== original) resizedBitmap.close();

          const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(
              (b) => (b ? resolve(b) : reject(new Error('compress-failed'))),
              'image/jpeg',
              quality
            );
          });

          return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
        } catch (err) {
          console.warn('Fast compress path failed, falling back:', err);
          return compressImageLegacy(file, maxWidth, quality);
        }
      })();
    }

    return compressImageLegacy(file, maxWidth, quality);
  };

  // Fallback for older browsers (or if the fast path throws). Same logic as
  // before, but now properly rejects on failure instead of hanging forever.
  const compressImageLegacy = (file, maxWidth, quality) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
            (blob) => {
                if (!blob) { reject(new Error('compress-failed')); return; }
                const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
                resolve(compressedFile);
            },
            'image/jpeg',
            quality
            );
        };
        img.onerror = () => reject(new Error('image-decode-failed'));
        img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('file-read-failed'));
        reader.readAsDataURL(file);
    });
    };
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    fetch(`${import.meta.env.VITE_API_URL}/create-category/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ name: newCategoryName }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories((prev) => [...prev, data]);
        setCategorySlug(data.slug);
        setNewCategoryName('');
        setShowNewCategory(false);
      });
};

  const handleCategoryImageSelect = async (e, categoryId) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Category icons chhote (w-16 h-16) dikhte hain, isliye 400px kaafi hai —
      // isse file aur bhi chhoti (halki) ban jaati hai product photos se.
      const compressed = await compressImage(file, 400, 0.7);
      const formData = new FormData();
      formData.append('image', compressed);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}/image/`, {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });
      const data = await response.json();
      setCategories((prev) => prev.map((c) => (c.id === categoryId ? data : c)));
    } catch (err) {
      console.error('Category image upload failed:', err);
      setMessage('Category photo upload nahi ho payi, dubara try karo.');
    }
  };

  const handleAnalyze = () => {
    if (!image) return;
    setAnalyzing(true);

    const formData = new FormData();
    formData.append('image', image);

    fetch(`${import.meta.env.VITE_API_URL}/analyze-image/`, {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
        setAnalyzing(false);
        console.log('AI raw response:', data);
        if (data.error) {
            setMessage(`Error: ${data.error}`);
            return;
        }
        try {
            const withoutMarkdown = data.suggestion.replace(/```json|```/gi, '');
            const jsonMatch = withoutMarkdown.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? jsonMatch[0] : withoutMarkdown;
            const parsed = JSON.parse(jsonText);
            setName(parsed.name || '');
            setDescription(parsed.description || '');
        }   catch (err) {
            console.log('Parse error:', err, 'Raw text:', data.suggestion);
            setMessage('AI ka response samajh nahi aaya, manually likh do.');
        }
            
        })
        .catch(() => {
        setAnalyzing(false);
        setMessage('Kuch error aa gaya. Manually likh do.');
        });
    };

  const handleRemoveBackground = () => {
    if (!image) return;
    setRemovingBg(true);

    const formData = new FormData();
    formData.append('image', image);

    fetch(`${import.meta.env.VITE_API_URL}/remove-background/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setRemovingBg(false);
        if (data.image) {
          fetch(data.image)
            .then((res) => res.blob())
            .then((blob) => {
              const newFile = new File([blob], 'bg-removed.png', { type: 'image/png' });
              setImage(newFile);
              setImagePreview(data.image);
            });
        }
      })
      .catch(() => setRemovingBg(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Saving...');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category_slug', categorySlug);
    formData.append('image', image);
    if (secondImage) {
        formData.append('second_image', secondImage);
    }


    fetch(`${import.meta.env.VITE_API_URL}/quick-add-product/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage('Product added! 🎉');
        setRecentlyAdded((prev) => [data, ...prev].slice(0, 5));
        setImage(null);
        setImagePreview(null);
        setSecondImage(null);
        setSecondImagePreview(null);
        setName('');
        setDescription('');
        setPrice('');
        setFileInputKey((prev) => prev + 1);
      })
      .catch(() => setMessage('Save fail ho gaya.'));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F6] p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-[#282C3F] mb-2">Quick Add Product</h2>

        <Link
          to="/x7k9-featured-products"
          className="block text-center text-sm font-semibold text-[#FF3F6C] border border-[#FF3F6C] rounded-lg py-2 mb-4 hover:bg-[#FFF0F4]"
        >
          Set Hero Section (Home Page Tiles)
        </Link>

        {!imagePreview && (
          <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#FF3F6C] transition-colors mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7E818C" strokeWidth="1.8">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span className="text-sm text-gray-500 mt-2">Upload Product Image</span>
            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </label>
        )}
        
        {imagePreview && (
          <div className="relative mb-3">
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />

            <button
              type="button"
              onClick={removeMainImage}
              className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-sm"
            >
              ×
            </button>
            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveBackground}
                disabled={removingBg}
                className="absolute top-2 left-12 bg-white shadow-md px-2 py-1 rounded-full text-xs font-medium border border-gray-200 hover:border-[#FF3F6C] disabled:opacity-50"
              >
                {removingBg ? '...' : 'Remove BG'}
              </button>
            )}

            <label className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#FF3F6C] transition-colors">
              <span className="text-gray-500 text-lg leading-none">+</span>
              <input type="file" accept="image/*" onChange={handleSecondImageSelect} className="hidden" />
            </label>

            {secondImagePreview && (
              <div className="absolute bottom-2 right-2">
                <img
                  src={secondImagePreview}
                  alt="Second"
                  className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-md"
                />
                <button
                  type="button"
                  onClick={removeSecondImage}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {image && matching && (
          <p className="text-xs text-center text-gray-400 mb-3">🔍 Purane products se match check ho raha hai...</p>
        )}

        {image && !matching && !name && (
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full bg-[#282C3F] text-white py-2 rounded-full text-sm font-medium mb-4 disabled:opacity-50"
          >

            {analyzing ? 'Analyzing...' : '✨ Auto-Generate with AI'}
          </button>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
            rows={3}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
          />
          <select
            value={showNewCategory ? '__new__' : categorySlug}
            onChange={(e) => {
              if (e.target.value === '__new__') {
                setShowNewCategory(true);
              } else {
                setCategorySlug(e.target.value);
                setShowNewCategory(false);
              }
            }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 bg-white"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
            <option value="__new__">+ New Category</option>
          </select>

          {showNewCategory && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                className="bg-[#282C3F] text-white px-4 rounded-lg text-sm font-medium"
              >
                Create
              </button>
            </div>
          )}

          {categories.length > 0 && (
            <div className="mb-4 border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setShowCategoryPhotos((prev) => !prev)}
                className="w-full flex items-center justify-between px-3 py-2.5"
              >
                <span className="text-xs font-medium text-[#7E818C]">Category Photos</span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7E818C" strokeWidth="2.5"
                  className={`transition-transform ${showCategoryPhotos ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {showCategoryPhotos && (
                <div className="space-y-2 px-3 pb-3">
                  {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F5F5F6] shrink-0 border border-gray-200">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#7E818C]">
                            {cat.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-[#282C3F] truncate">{cat.name}</span>
                    </div>

                    <label className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#FF3F6C] hover:text-[#FF3F6C] text-gray-400 text-lg font-semibold shrink-0">
                      +
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCategoryImageSelect(e, cat.id)}
                        className="hidden"
                      />
                    </label>
                  </div>
                ))}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#FF3F6C] text-white py-2.5 rounded-full text-sm font-semibold"
          >
            Save Product
          </button>
        </form>
        {recentlyAdded.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 mb-2">Recently added</p>
            <div className="space-y-2">
              {recentlyAdded.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-[#F5F5F6] rounded-lg p-2">
                  {p.images?.[0] && (
                    <img src={p.images[0].image} alt={p.name} loading="lazy" className="w-8 h-8 rounded object-cover" />
                  )}
                  <span className="text-xs text-[#282C3F]">{p.name}</span>
                  <span className="text-xs text-[#FF3F6C] ml-auto">₹{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {message && <p className="text-sm text-center mt-3 text-[#282C3F]">{message}</p>}
      </div>
    </div>
  );
}

export default QuickAddProduct;
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories/`)
        .then((response) => response.json())
        .then((data) => setCategories(data));
    }, []);
    

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const compressed = await compressImage(file);
    setImage(compressed);
    setImagePreview(URL.createObjectURL(compressed));
    setName('');
    setDescription('');
    };

  const compressImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxWidth = 800;
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
            (blob) => {
                const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
                resolve(compressedFile);
            },
            'image/jpeg',
            0.7
            );
        };
        img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
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

    fetch(`${import.meta.env.VITE_API_URL}/quick-add-product/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        setMessage('Product added! 🎉');
        setImage(null);
        setImagePreview(null);
        setName('');
        setDescription('');
        setPrice('');
      })
      .catch(() => setMessage('Save fail ho gaya.'));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F6] p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-[#282C3F] mb-4">Quick Add Product</h2>

        <input type="file" accept="image/*" onChange={handleImageSelect} className="mb-3" />

        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-3" />
        )}

        {image && !name && (
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
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 bg-white"
            >
            <option value="">Select category</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                {cat.name}
                </option>
            ))}
            </select>

          <button
            type="submit"
            className="w-full bg-[#FF3F6C] text-white py-2.5 rounded-full text-sm font-semibold"
          >
            Save Product
          </button>
        </form>

        {message && <p className="text-sm text-center mt-3 text-[#282C3F]">{message}</p>}
      </div>
    </div>
  );
}

export default QuickAddProduct;
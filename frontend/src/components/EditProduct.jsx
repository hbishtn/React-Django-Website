import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EditProduct() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [categories, setCategories] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [newSecondImage, setNewSecondImage] = useState(null);
  const [newSecondImagePreview, setNewSecondImagePreview] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [message, setMessage] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setStock(data.stock);
        setCurrentImages(data.images || []);
      });

    fetch(`${import.meta.env.VITE_API_URL}/categories/?page_size=100`)
      .then((response) => response.json())
      .then((data) => setCategories(data.results || data));
  }, [id]);

  // Yahi compression logic QuickAddProduct mein bhi use hoti hai — badi
  // (48MP/108MP jaisi) photos ke liye createImageBitmap se memory-safe
  // resize karta hai, purane browsers ke liye fallback bhi hai.
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
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
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
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

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setNewImage(compressed);
      setNewImagePreview(URL.createObjectURL(compressed));
    } catch (err) {
      console.error('Image compress failed:', err);
      setMessage('Yeh photo process nahi ho payi. Doosri photo try karo.');
    }
  };

  const handleSecondImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setNewSecondImage(compressed);
      setNewSecondImagePreview(URL.createObjectURL(compressed));
    } catch (err) {
      console.error('Image compress failed:', err);
      setMessage('Yeh photo process nahi ho payi. Doosri photo try karo.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Saving...');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    if (categorySlug) formData.append('category_slug', categorySlug);
    if (newImage) formData.append('image', newImage);
    if (newSecondImage) formData.append('second_image', newSecondImage);

    fetch(`${import.meta.env.VITE_API_URL}/products/${id}/edit/`, {
      method: 'PATCH',
      headers: { Authorization: `Token ${token}` },
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        setMessage('Updated! 🎉');
        setTimeout(() => navigate(`/products/${id}`), 1000);
      })
      .catch(() => setMessage('Update fail ho gaya.'));
  };

  const handleDelete = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }

    setDeleting(true);
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}/delete/`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        setDeleting(false);
        setConfirmingDelete(false);
        setMessage('Delete fail ho gaya, dubara try karo.');
      });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F6] p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-[#282C3F] mb-4">Edit Product</h2>

        {currentImages.length > 0 && (
          <div className="flex gap-2 mb-3">
            {currentImages.map((img) => (
              <img
                key={img.id}
                src={img.image}
                alt="Current"
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Add / replace image</label>
            <label className="w-full flex items-center justify-center bg-[#282C3F] text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:opacity-90">
              Choose Image
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>
            {newImagePreview && (
              <img src={newImagePreview} alt="New" className="w-full h-24 object-cover rounded-lg mt-2" />
            )}
          </div>

          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Add second image</label>
            <label className="w-full flex items-center justify-center bg-[#282C3F] text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:opacity-90">
              Choose Image
              <input type="file" accept="image/*" onChange={handleSecondImageSelect} className="hidden" />
            </label>
            {newSecondImagePreview && (
              <img src={newSecondImagePreview} alt="New second" className="w-full h-24 object-cover rounded-lg mt-2" />
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
            rows={3}
            required
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
            required
          />
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
          />
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 bg-white"
          >
            <option value="">Keep current category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-[#FF3F6C] text-white py-2.5 rounded-full text-sm font-semibold"
          >
            Save Changes
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className={`w-full py-2.5 rounded-full text-sm font-semibold border transition-colors disabled:opacity-50 ${
              confirmingDelete
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-red-600 border-red-300 hover:bg-red-50'
            }`}
          >
            {deleting
              ? 'Deleting...'
              : confirmingDelete
              ? 'Tap again to confirm delete'
              : 'Delete Product'}
          </button>
          {confirmingDelete && !deleting && (
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="w-full mt-2 text-xs text-gray-400 text-center"
            >
              Cancel
            </button>
          )}
        </div>

        {message && <p className="text-sm text-center mt-3 text-[#282C3F]">{message}</p>}
      </div>
    </div>
  );
}

export default EditProduct;
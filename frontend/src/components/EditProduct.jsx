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
  const [currentImages, setCurrentImages] = useState([]);
  const [message, setMessage] = useState('');

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

    fetch(`${import.meta.env.VITE_API_URL}/categories/`)
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, [id]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
    setNewImagePreview(URL.createObjectURL(file));
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

        <label className="text-xs text-gray-500 mb-1 block">Add new image (optional)</label>
        <label className="inline-block bg-[#282C3F] text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 mb-3">
            Choose Image
            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
        </label>
        {newImagePreview && (
          <img src={newImagePreview} alt="New" className="w-full h-32 object-cover rounded-lg mb-3" />
        )}

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

        {message && <p className="text-sm text-center mt-3 text-[#282C3F]">{message}</p>}
      </div>
    </div>
  );
}

export default EditProduct;
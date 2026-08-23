import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Signup from './components/Signup';
import Checkout from './components/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import AnnouncementBar from './components/AnnouncementBar';
import NailPaintPicker from './components/NailPaintPicker';
import BottomNav from './components/BottomNav';
import QuickAddProduct from './components/QuickAddProduct';
import AdminRoute from './components/AdminRoute';
import EditProduct from './components/EditProduct';

function App() {
  return (
    <>
      <Navbar />
      <AnnouncementBar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/nail-paint" element={<NailPaintPicker />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/x7k9-quick-add"
          element={
            <AdminRoute>
              <QuickAddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/x7k9-edit-product/:id"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
      <ChatWidget />
      <BottomNav />
    </>
  );
}

export default App;
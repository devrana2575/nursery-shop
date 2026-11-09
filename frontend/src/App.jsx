import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { GuestRoute, ProtectedRoute } from './components/RouteGuards';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import About from './pages/About';
import AddPlant from './pages/AddPlant';
import AdminOrders from './pages/AdminOrders';
import CartPage from './pages/CartPage';
import Contact from './pages/Contact';
import EditPlant from './pages/EditPlant';
import Login from './pages/Login';
import Messages from './pages/Messages';
import MyOrders from './pages/MyOrders';
import NotFound from './pages/NotFound';
import PlantList from './pages/PlantList';
import Register from './pages/Register';
import UserHome from './pages/UserHome';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<UserHome />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="cart" element={<CartPage />} />

                <Route element={<GuestRoute />}>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="orders" element={<MyOrders />} />
                </Route>

                <Route path="admin" element={<ProtectedRoute roles={['admin']} />}>
                  <Route index element={<PlantList />} />
                  <Route path="plants/new" element={<AddPlant />} />
                  <Route path="plants/:id/edit" element={<EditPlant />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="messages" element={<Messages />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

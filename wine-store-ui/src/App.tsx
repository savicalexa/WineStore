// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Wines from "./pages/Wines";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Blog from "./components/Blog";
import Pairing from "./pages/BlogPairing";
import Grapes from "./pages/BlogGrapes";
import Regions from "./pages/BlogRegions";
import LoginPage from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AuthProvider, RequireAdmin } from "./context/AuthContext";
import Account from "./pages/AccountPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Javne stranice */}
            <Route path="/" element={<Home />} />
            <Route path="/wines" element={<Wines />} />
            <Route path="/viski" element={<Wines />} />
            <Route path="/rakije" element={<Wines />} />
            <Route path="/oprema" element={<Wines />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/pairing" element={<Pairing />} />
            <Route path="/grapes" element={<Grapes />} />
            <Route path="/regions" element={<Regions />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account />} />
            {/* Zaštićena admin ruta */}
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

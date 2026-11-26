import { Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './features/landing/pages/LandingPage';
import { ProductsPage } from './features/products/pages/ProductsPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

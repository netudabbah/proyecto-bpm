import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Dashboard, Orders, OrderDetail, RealOrders, RealOrderDetail, Receipts, RealReceipts, RealReceiptDetail, Analytics, Settings } from './pages';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/real-orders" element={<RealOrders />} />
        <Route path="/real-orders/:orderNumber" element={<RealOrderDetail />} />
        <Route path="/receipts" element={<Receipts />} />
        <Route path="/real-receipts" element={<RealReceipts />} />
        <Route path="/real-receipts/:id" element={<RealReceiptDetail />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

import React from 'react';
import { testBackend } from './API';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { AuthPage } from './components/auth/AuthPage';
import { CustomerNavbar } from './components/customer/CustomerNavbar';
import { CustomerSidebar } from './components/customer/CustomerSidebar';
import { CartDrawer } from './components/customer/CartDrawer';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { CustomerOrders } from './components/customer/CustomerOrders';
import { OrderUpdateCart } from './components/customer/OrderUpdateCart';
import { PaymentBill } from './components/customer/PaymentBill';
import { PersonalInformation } from './components/customer/PersonalInformation';
import { OthersPage } from './components/customer/OthersPage';
import AdminDashboard from './components/admin/AdminDashboard';
import { DeliveryDashboard } from './components/delivery/DeliveryDashboard';

const MainApp = () => {
  const { isAuthenticated, currentRole } = useAuth();
  const { activeView } = useRestaurant();
  
  React.useEffect(() => {
  testBackend()
    .then((data) => {
      console.log('Backend message:', data.message);
    })
    .catch((error) => {
      console.error('Backend connection failed:', error);
    });

}, []);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Universal Quick Portal Switcher (Customer / Admin / Delivery staff) */}
      <RoleSwitcher />

      {/* RENDER BY CURRENT ROLE */}
      {currentRole === 'admin' ? (
        // ADMIN PORTAL
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          <AdminDashboard />
        </main>
      ) : currentRole === 'delivery' ? (
        // DELIVERY STAFF PORTAL
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          <DeliveryDashboard />
        </main>
      ) : (
        // CUSTOMER PORTAL (Direct from Sketches Pages 1, 3, 4, 5, 6, 7)
        <>
          <CustomerNavbar />
          <CustomerSidebar />
          <CartDrawer />

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            {activeView === 'dashboard' && <CustomerDashboard />}
            {activeView === 'foods_drinks_snacks' && <CustomerDashboard />}
            {activeView === 'my_orders' && <CustomerOrders />}
            {activeView === 'updates_orders' && <OrderUpdateCart />}
            {activeView === 'my_bill' && <PaymentBill />}
            {activeView === 'personal_info' && <PersonalInformation />}
            {activeView === 'others' && <OthersPage />}
          </main>
        </>
      )}

      {/* Clean Global Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-slate-700">
            &copy; {new Date().getFullYear()} <span className="text-amber-600 font-bold">Holland Restaurant</span>. Haki zote zimehifadhiwa.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Zanribar, Tanzania</span>
            <span>•</span>
            <span>Phone:📞 0657281070</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">Lipa kwa M-PESA / Card</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <RestaurantProvider>
            <MainApp />
          </RestaurantProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}

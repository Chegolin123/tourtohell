import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import BookingPage from './pages/BookingPage';
import AboutPage from './pages/AboutPage';
import ContactsPage from './pages/ContactsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ReviewsPage from './pages/ReviewsPage';
import AdminPage from './pages/AdminPage';
import WishlistPage from './pages/WishlistPage';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <ScrollToTop />
              <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
                <Header />
                
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tours" element={<ToursPage />} />
                    <Route path="/tours/:id" element={<TourDetailPage />} />
                    <Route path="/booking/:tourId" element={<BookingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    
                    {/* 404 Page */}
                    <Route path="*" element={
                      <div className="container-custom py-20 text-center">
                        <div className="text-9xl mb-4 animate-bounce">🔥</div>
                        <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                          404
                        </h1>
                        <p className="text-2xl text-gray-400 mb-8">
                          Эта страница сгорела в аду
                        </p>
                        <a 
                          href="/" 
                          className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-white font-bold hover:scale-105 transition-transform"
                        >
                          Вернуться в ад
                        </a>
                      </div>
                    } />
                  </Routes>
                </main>
                
                <Footer />
                
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#1f2937',
                      color: '#fff',
                      border: '1px solid #ef4444',
                    },
                    success: {
                      icon: '🔥',
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      icon: '💀',
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { api } from './services/api.ts';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { MarketplacePage } from './pages/MarketplacePage.tsx';
import { IDDetailsPage } from './pages/IDDetailsPage.tsx';
import { AuthPage } from './pages/AuthPage.tsx';
import { CustomerDashboard } from './pages/CustomerDashboard.tsx';
import { CustomerOrdersPage } from './pages/CustomerOrdersPage.tsx';
import { CustomerProfilePage } from './pages/CustomerProfilePage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { FAQPage } from './pages/FAQPage.tsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { AdminIDsPage } from './pages/admin/AdminIDsPage.tsx';
import { AdminCreateEditIDPage } from './pages/admin/AdminCreateEditIDPage.tsx';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage.tsx';
import { AdminUsersPage } from './pages/admin/AdminUsersPage.tsx';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage.tsx';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.tsx';

function MainRouter() {
  const { user, isAdmin, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    return typeof window !== 'undefined' ? window.location.search : '';
  });
  const [settings, setSettings] = useState<any>(null);

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchQuery(window.location.search);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch site settings
  useEffect(() => {
    api.getSettings().then((res) => {
      if (res.success && res.data) {
        setSettings(res.data);
      }
    }).catch(() => {});
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      const [pathname, search] = path.split('?');
      setCurrentPath(pathname || '/');
      setSearchQuery(search ? `?${search}` : '');
      window.scrollTo(0, 0);
    }
  };

  const currencySymbol = settings?.currencySymbol || '৳';
  const announcement = settings?.announcementBanner?.enabled
    ? settings?.announcementBanner?.text
    : undefined;

  // Route matching
  const renderRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          navigate={navigate}
          onSelectID={(id) => navigate(`/ids/${id}`)}
          currencySymbol={currencySymbol}
        />
      );
    }

    // 2. Marketplace list
    if (currentPath === '/ids') {
      return (
        <MarketplacePage
          navigate={navigate}
          onSelectID={(id) => navigate(`/ids/${id}`)}
          initialQuery={searchQuery}
          currencySymbol={currencySymbol}
        />
      );
    }

    // 3. ID Details (/ids/:id)
    if (currentPath.startsWith('/ids/')) {
      const id = currentPath.replace('/ids/', '');
      return (
        <IDDetailsPage
          id={id}
          navigate={navigate}
          currencySymbol={currencySymbol}
          settings={settings}
        />
      );
    }

    // 4. Auth
    if (currentPath === '/login') {
      return <AuthPage initialMode="login" navigate={navigate} />;
    }
    if (currentPath === '/register') {
      return <AuthPage initialMode="register" navigate={navigate} />;
    }

    // 5. Customer Dashboard (Protected)
    if (currentPath === '/dashboard') {
      if (!isLoading && !user) {
        navigate('/login?redirect=/dashboard');
        return null;
      }
      return <CustomerDashboard navigate={navigate} currencySymbol={currencySymbol} />;
    }

    if (currentPath === '/dashboard/orders') {
      if (!isLoading && !user) {
        navigate('/login?redirect=/dashboard/orders');
        return null;
      }
      return <CustomerOrdersPage navigate={navigate} currencySymbol={currencySymbol} />;
    }

    if (currentPath === '/dashboard/profile') {
      if (!isLoading && !user) {
        navigate('/login?redirect=/dashboard/profile');
        return null;
      }
      return <CustomerProfilePage />;
    }

    // 6. Informational
    if (currentPath === '/contact') {
      return <ContactPage settings={settings} />;
    }
    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }
    if (currentPath === '/faq') {
      return <FAQPage navigate={navigate} />;
    }

    // 7. Admin Routes (Admin-Only)
    if (currentPath.startsWith('/admin')) {
      if (!isLoading && !isAdmin) {
        return (
          <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
            <p className="text-xs text-slate-400">
              You must be logged in with administrator privileges to view this section.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Sign In as Admin
            </button>
          </div>
        );
      }

      if (currentPath === '/admin') {
        return <AdminDashboard navigate={navigate} currencySymbol={currencySymbol} />;
      }
      if (currentPath === '/admin/ids') {
        return <AdminIDsPage navigate={navigate} currencySymbol={currencySymbol} />;
      }
      if (currentPath === '/admin/ids/create') {
        return <AdminCreateEditIDPage navigate={navigate} currencySymbol={currencySymbol} />;
      }
      if (currentPath.startsWith('/admin/ids/') && currentPath.endsWith('/edit')) {
        const id = currentPath.replace('/admin/ids/', '').replace('/edit', '');
        return <AdminCreateEditIDPage id={id} navigate={navigate} currencySymbol={currencySymbol} />;
      }
      if (currentPath === '/admin/orders') {
        return <AdminOrdersPage navigate={navigate} currencySymbol={currencySymbol} />;
      }
      if (currentPath === '/admin/users') {
        return <AdminUsersPage navigate={navigate} />;
      }
      if (currentPath === '/admin/reviews') {
        return <AdminReviewsPage navigate={navigate} />;
      }
      if (currentPath === '/admin/settings') {
        return <AdminSettingsPage navigate={navigate} />;
      }
    }

    // Fallback 404
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested page could not be located.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
        >
          Return Home
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 font-sans">
      <Navbar currentPath={currentPath} navigate={navigate} announcement={announcement} />
      <main className="flex-1">{renderRoute()}</main>
      <Footer navigate={navigate} settings={settings} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainRouter />
      </ToastProvider>
    </AuthProvider>
  );
}

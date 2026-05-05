import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProductExplorer from './pages/ProductExplorer.jsx';
import SellerConsole from './pages/SellerConsole.jsx';
import { api, clearAuth, loadAuth, saveAuth } from './services/api.js';

const initialFilters = {
  search: '',
  minScore: '',
  ecoFriendlyOnly: false
};

function formDataToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

export default function App() {
  const [auth, setAuth] = useState(loadAuth());
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedStep, setSelectedStep] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [working, setWorking] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ethicalTrackerTheme') === 'dark');

  const selectedProduct = useMemo(
    () => products.find((product) => product._id === selectedProductId) || products[0] || null,
    [products, selectedProductId]
  );

  async function loadProducts(nextFilters = filters) {
    setLoadingProducts(true);
    try {
      const data = await api.getProducts(nextFilters);
      setProducts(data);
      if (!data.some((product) => product._id === selectedProductId)) {
        setSelectedProductId(data[0]?._id || '');
      }
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadDashboard() {
    const data = await api.getDashboard();
    setMetrics(data);
  }

  useEffect(() => {
    loadProducts();
    loadDashboard();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadProducts(filters);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters.search, filters.minScore, filters.ecoFriendlyOnly]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('ethicalTrackerTheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    setSelectedStep(selectedProduct?.supplyChain?.[0] || null);
  }, [selectedProduct?._id]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const payload = formDataToObject(event.currentTarget);
      const data = authMode === 'login' ? await api.login(payload) : await api.register(payload);
      saveAuth(data);
      setAuth(data);
      event.currentTarget.reset();
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    clearAuth();
    setAuth(null);
  }

  async function handleCreateProduct(event) {
    event.preventDefault();
    setWorking(true);

    try {
      const payload = formDataToObject(event.currentTarget);
      const created = await api.createProduct({
        ...payload,
        price: Number(payload.price)
      });
      event.currentTarget.reset();
      await loadProducts();
      await loadDashboard();
      setSelectedProductId(created._id);
    } finally {
      setWorking(false);
    }
  }

  async function handleAddStep(event) {
    event.preventDefault();
    const payload = formDataToObject(event.currentTarget);

    if (!payload.productId) return;

    setWorking(true);
    try {
      const updated = await api.addSupplyChainStep(payload.productId, {
        stepName: payload.stepName,
        location: payload.location,
        description: payload.description,
        transportDistance: Number(payload.transportDistance),
        ethicalFlags: {
          fairWages: Boolean(payload.fairWages),
          ecoFriendly: Boolean(payload.ecoFriendly),
          lowCarbon: Boolean(payload.lowCarbon),
          sustainablePractices: Boolean(payload.sustainablePractices)
        }
      });
      event.currentTarget.reset();
      await loadProducts();
      await loadDashboard();
      setSelectedProductId(updated._id);
      setSelectedStep(updated.supplyChain.at(-1));
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="app-shell">
      <Header
        auth={auth}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((value) => !value)}
      />
      <Dashboard metrics={metrics} />
      <div className="workspace-grid">
        <ProductExplorer
          products={products}
          selectedProduct={selectedProduct}
          selectedStep={selectedStep}
          filters={filters}
          onFilterChange={setFilters}
          onSelectProduct={(product) => setSelectedProductId(product._id)}
          onSelectStep={setSelectedStep}
          loading={loadingProducts}
        />
        <SellerConsole
          auth={auth}
          authMode={authMode}
          setAuthMode={setAuthMode}
          authError={authError}
          authLoading={authLoading}
          onAuthSubmit={handleAuthSubmit}
          onProductSubmit={handleCreateProduct}
          onStepSubmit={handleAddStep}
          products={products}
          selectedProduct={selectedProduct}
          onSellerProductChange={setSelectedProductId}
          working={working}
        />
      </div>
    </div>
  );
}

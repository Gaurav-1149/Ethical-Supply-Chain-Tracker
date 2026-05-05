import { PackagePlus } from 'lucide-react';
import { AuthForm, ProductForm, SupplyChainForm } from '../components/Forms.jsx';

export default function SellerConsole({
  auth,
  authMode,
  setAuthMode,
  authError,
  authLoading,
  onAuthSubmit,
  onProductSubmit,
  onStepSubmit,
  products,
  selectedProduct,
  onSellerProductChange,
  working
}) {
  return (
    <aside className="seller-console">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Seller tools</p>
          <h2>Publish transparency</h2>
        </div>
        <PackagePlus size={20} />
      </div>

      {!auth?.user ? (
        <AuthForm
          mode={authMode}
          onModeChange={setAuthMode}
          onSubmit={onAuthSubmit}
          error={authError}
          loading={authLoading}
        />
      ) : auth.user.role !== 'seller' ? (
        <div className="empty-state">Login with a seller account to add products and supply-chain steps.</div>
      ) : (
        <>
          <ProductForm onSubmit={onProductSubmit} disabled={working} />
          <div className="form-panel compact">
            <h3>Choose product</h3>
            <select value={selectedProduct?._id || ''} onChange={(event) => onSellerProductChange(event.target.value)}>
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <SupplyChainForm productId={selectedProduct?._id} onSubmit={onStepSubmit} disabled={working} />
        </>
      )}
    </aside>
  );
}

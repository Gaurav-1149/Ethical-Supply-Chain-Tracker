import { Search, SlidersHorizontal } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import ProductCard from '../components/ProductCard.jsx';
import ScorePill from '../components/ScorePill.jsx';
import SupplyChainTimeline, { StepDetails } from '../components/SupplyChainTimeline.jsx';

export default function ProductExplorer({
  products,
  selectedProduct,
  selectedStep,
  filters,
  onFilterChange,
  onSelectProduct,
  onSelectStep,
  loading
}) {
  const productUrl = selectedProduct ? `${window.location.origin}/products/${selectedProduct._id}` : window.location.origin;

  return (
    <main className="explorer-layout">
      <section className="catalog-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Buyer view</p>
            <h2>Explore products</h2>
          </div>
          <SlidersHorizontal size={20} />
        </div>

        <div className="filters">
          <label className="search-field">
            <Search size={16} />
            <input
              value={filters.search}
              onChange={(event) => onFilterChange({ ...filters, search: event.target.value })}
              placeholder="Search by name or category"
            />
          </label>
          <select
            value={filters.minScore}
            onChange={(event) => onFilterChange({ ...filters, minScore: event.target.value })}
          >
            <option value="">Any score</option>
            <option value="40">Score over 40</option>
            <option value="70">Score over 70</option>
            <option value="85">Score over 85</option>
          </select>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={filters.ecoFriendlyOnly}
              onChange={(event) => onFilterChange({ ...filters, ecoFriendlyOnly: event.target.checked })}
            />
            Eco-friendly only
          </label>
        </div>

        <div className="product-list">
          {loading ? <div className="empty-state">Loading products...</div> : null}
          {!loading && !products.length ? <div className="empty-state">No matching products found.</div> : null}
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              selected={selectedProduct?._id === product._id}
              onSelect={() => onSelectProduct(product)}
            />
          ))}
        </div>
      </section>

      <section className="journey-panel">
        {selectedProduct ? (
          <>
            <div className="product-hero">
              <div>
                <p className="eyebrow">Supply chain journey</p>
                <h2>{selectedProduct.name}</h2>
                <p>
                  Sold by {selectedProduct.seller?.name || 'Verified seller'} in {selectedProduct.category}
                </p>
              </div>
              <div className="hero-actions">
                <ScorePill score={selectedProduct.ethicalScore} band={selectedProduct.scoreBand} />
                <div className="qr-box" title="Product QR code">
                  <QRCodeCanvas value={productUrl} size={74} level="M" includeMargin />
                </div>
              </div>
            </div>

            <SupplyChainTimeline
              steps={selectedProduct.supplyChain}
              selectedStepId={selectedStep?._id}
              onSelectStep={onSelectStep}
            />
            <StepDetails step={selectedStep} />
          </>
        ) : (
          <div className="empty-state large">Choose a product to see its journey.</div>
        )}
      </section>
    </main>
  );
}

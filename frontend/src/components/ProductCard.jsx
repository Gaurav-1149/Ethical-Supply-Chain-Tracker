import { ArrowRight, Leaf } from 'lucide-react';
import ScorePill from './ScorePill.jsx';

export default function ProductCard({ product, selected, onSelect }) {
  const ecoSteps = product.supplyChain?.filter((step) => step.ethicalFlags?.ecoFriendly).length || 0;

  return (
    <button className={`product-card ${selected ? 'selected' : ''}`} type="button" onClick={onSelect}>
      <div className="product-card-top">
        <div>
          <h3>{product.name}</h3>
          <p>{product.category}</p>
        </div>
        <ScorePill score={product.ethicalScore} band={product.scoreBand} />
      </div>
      <div className="product-meta">
        <span>${Number(product.price).toFixed(2)}</span>
        <span>{product.supplyChain?.length || 0} steps</span>
        <span>
          <Leaf size={14} />
          {ecoSteps} eco
        </span>
      </div>
      <div className="card-link">
        Explore journey
        <ArrowRight size={16} />
      </div>
    </button>
  );
}

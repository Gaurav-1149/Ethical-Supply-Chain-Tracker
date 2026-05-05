import { Plus } from 'lucide-react';

export function AuthForm({ mode, onModeChange, onSubmit, error, loading }) {
  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <div className="segmented-control">
        <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => onModeChange('login')}>
          Login
        </button>
        <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => onModeChange('register')}>
          Register
        </button>
      </div>
      {mode === 'register' ? <input name="name" placeholder="Name" required /> : null}
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" minLength="8" required />
      {mode === 'register' ? (
        <select name="role" defaultValue="seller">
          <option value="seller">Seller</option>
          <option value="user">Buyer</option>
        </select>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}
      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? 'Working...' : mode === 'login' ? 'Login' : 'Create account'}
      </button>
    </form>
  );
}

export function ProductForm({ onSubmit, disabled }) {
  return (
    <form className="form-panel compact" onSubmit={onSubmit}>
      <h3>Add product</h3>
      <input name="name" placeholder="Product name" required />
      <input name="price" type="number" step="0.01" min="0" placeholder="Price" required />
      <input name="category" placeholder="Category" required />
      <button className="primary-button" type="submit" disabled={disabled}>
        <Plus size={16} />
        Add product
      </button>
    </form>
  );
}

export function SupplyChainForm({ productId, onSubmit, disabled }) {
  return (
    <form className="form-panel compact" onSubmit={onSubmit}>
      <h3>Add supply step</h3>
      <input type="hidden" name="productId" value={productId || ''} />
      <input name="stepName" placeholder="Step name" required />
      <input name="location" placeholder="Location" required />
      <textarea name="description" placeholder="Description" rows="3" required />
      <input name="transportDistance" type="number" min="0" placeholder="Transport distance in km" required />
      <label className="checkbox-line">
        <input name="fairWages" type="checkbox" />
        Fair wages
      </label>
      <label className="checkbox-line">
        <input name="ecoFriendly" type="checkbox" />
        Eco-friendly
      </label>
      <label className="checkbox-line">
        <input name="lowCarbon" type="checkbox" />
        Low carbon
      </label>
      <label className="checkbox-line">
        <input name="sustainablePractices" type="checkbox" />
        Sustainable practices
      </label>
      <button className="primary-button" type="submit" disabled={disabled || !productId}>
        <Plus size={16} />
        Add step
      </button>
    </form>
  );
}

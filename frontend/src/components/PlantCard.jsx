import { useState } from 'react';
import { formatCurrency } from '../utils/format';

export default function PlantCard({ plant, inCartQty = 0, onAdd, onCareTips }) {
  const [imageFailed, setImageFailed] = useState(false);
  const outOfStock = plant.stock === 0;

  return (
    <article className="plant-card">
      <div className="plant-card-media">
        {plant.image && !imageFailed ? (
          <img
            src={plant.image}
            alt={plant.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="plant-card-fallback" aria-hidden="true">🌿</div>
        )}
        <span className="badge plant-card-category">{plant.category}</span>
      </div>

      <div className="plant-card-body">
        <h3 className="plant-card-name">{plant.name}</h3>
        <p className="plant-card-desc">{plant.description || 'A beautiful addition to your space.'}</p>

        <div className="plant-card-meta">
          <span className="plant-price">{formatCurrency(plant.price)}</span>
          <span className={outOfStock ? 'stock-out' : 'stock-in'}>
            {outOfStock ? 'Out of stock' : `${plant.stock} in stock`}
          </span>
        </div>

        {inCartQty > 0 && <p className="in-cart">✓ {inCartQty} in cart</p>}

        <div className="plant-card-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onAdd(plant)}
            disabled={outOfStock}
          >
            {outOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onCareTips(plant)}>
            🌱 Care
          </button>
        </div>
      </div>
    </article>
  );
}

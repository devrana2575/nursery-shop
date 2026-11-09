import { useState } from 'react';
import { PLANT_CATEGORIES } from '../constants';

const EMPTY = {
  name: '',
  category: 'Indoor',
  price: '',
  stock: '',
  description: '',
  image: '',
  featured: false,
  careTips: { water: '', sunlight: '', fertilizer: '' },
};

export default function PlantForm({
  title,
  subtitle,
  initialValues,
  submitLabel = 'Save plant',
  busy = false,
  error = '',
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...initialValues,
    careTips: { ...EMPTY.careTips, ...(initialValues?.careTips || {}) },
  }));
  const [errors, setErrors] = useState({});

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const setTip = (field, value) =>
    setForm((current) => ({
      ...current,
      careTips: { ...current.careTips, [field]: value },
    }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Plant name is required.';
    if (form.price === '' || Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
      next.price = 'Enter a valid price.';
    }
    if (form.stock === '' || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      next.stock = 'Enter a whole number of 0 or more.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      image: form.image.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      featured: form.featured,
      careTips: {
        water: form.careTips.water.trim(),
        sunlight: form.careTips.sunlight.trim(),
        fertilizer: form.careTips.fertilizer.trim(),
      },
    });
  };

  return (
    <section className="card form-card">
      <div className="form-card-header">
        <div>
          <h1 className="page-heading">{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
      </div>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="field">
            <label className="label" htmlFor="plant-name">Plant name *</label>
            <input
              id="plant-name"
              className="input"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              placeholder="e.g. Monstera"
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="field">
            <label className="label" htmlFor="plant-category">Category *</label>
            <select
              id="plant-category"
              className="select"
              value={form.category}
              onChange={(event) => setField('category', event.target.value)}
            >
              {PLANT_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label className="label" htmlFor="plant-price">Price (₹) *</label>
            <input
              id="plant-price"
              className="input"
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(event) => setField('price', event.target.value)}
              placeholder="e.g. 299"
            />
            {errors.price && <p className="field-error">{errors.price}</p>}
          </div>

          <div className="field">
            <label className="label" htmlFor="plant-stock">Stock *</label>
            <input
              id="plant-stock"
              className="input"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(event) => setField('stock', event.target.value)}
              placeholder="e.g. 20"
            />
            {errors.stock && <p className="field-error">{errors.stock}</p>}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="plant-image">Image URL</label>
          <input
            id="plant-image"
            className="input"
            value={form.image}
            onChange={(event) => setField('image', event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="plant-description">Description</label>
          <textarea
            id="plant-description"
            className="textarea"
            rows={3}
            maxLength={500}
            value={form.description}
            onChange={(event) => setField('description', event.target.value)}
            placeholder="Short description..."
          />
          <p className="hint">{form.description.length}/500 characters</p>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => setField('featured', event.target.checked)}
          />
          <span>Feature this plant on the home page</span>
        </label>

        <fieldset className="care-tips-fieldset">
          <legend>🌱 Care tips</legend>
          <div className="form-row">
            <div className="field">
              <label className="label" htmlFor="care-water">💧 Watering</label>
              <input
                id="care-water"
                className="input"
                value={form.careTips.water}
                onChange={(event) => setTip('water', event.target.value)}
                placeholder="e.g. Once a week"
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="care-sunlight">☀️ Sunlight</label>
              <input
                id="care-sunlight"
                className="input"
                value={form.careTips.sunlight}
                onChange={(event) => setTip('sunlight', event.target.value)}
                placeholder="e.g. 4-5 hours indirect"
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="care-fertilizer">🌾 Fertilizer</label>
              <input
                id="care-fertilizer"
                className="input"
                value={form.careTips.fertilizer}
                onChange={(event) => setTip('fertilizer', event.target.value)}
                placeholder="e.g. Once a month"
              />
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving...' : submitLabel}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

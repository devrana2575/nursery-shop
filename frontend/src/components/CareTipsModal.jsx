import Modal from './Modal';

const TIPS = [
  { key: 'water', icon: '💧', label: 'Watering' },
  { key: 'sunlight', icon: '☀️', label: 'Sunlight' },
  { key: 'fertilizer', icon: '🌾', label: 'Fertilizer' },
];

export default function CareTipsModal({ plant, onClose }) {
  return (
    <Modal
      open={Boolean(plant)}
      title={plant ? `🌱 Care guide — ${plant.name}` : 'Care guide'}
      onClose={onClose}
      labelledBy="care-tips-title"
    >
      <div className="care-tips">
        {TIPS.map((tip) => (
          <div key={tip.key} className="care-tip">
            <span className="care-tip-icon" aria-hidden="true">{tip.icon}</span>
            <div>
              <p className="care-tip-label">{tip.label}</p>
              <p className="care-tip-value">{plant?.careTips?.[tip.key] || 'Not specified'}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

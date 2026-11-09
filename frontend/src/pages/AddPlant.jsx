import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { plantsApi } from '../api/plants';
import PlantForm from '../components/PlantForm';
import { useToast } from '../context/ToastContext';

export default function AddPlant() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (payload) => {
    setBusy(true);
    setError('');
    try {
      await plantsApi.create(payload);
      showToast('Plant added to the catalogue.');
      navigate('/admin');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not add the plant.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <PlantForm
      title="➕ Add a new plant"
      subtitle="New plants appear in the shop immediately."
      submitLabel="Add plant"
      busy={busy}
      error={error}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/admin')}
    />
  );
}

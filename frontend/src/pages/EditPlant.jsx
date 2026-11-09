import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { plantsApi } from '../api/plants';
import ErrorState from '../components/ErrorState';
import PlantForm from '../components/PlantForm';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

export default function EditPlant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loadPlant = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const { data } = await plantsApi.get(id);
      setPlant(data.plant);
    } catch (err) {
      setLoadError(getErrorMessage(err, 'Could not load this plant.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPlant();
  }, [loadPlant]);

  const handleSubmit = async (payload) => {
    setBusy(true);
    setError('');
    try {
      await plantsApi.update(id, payload);
      showToast('Plant updated.');
      navigate('/admin');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update the plant.'));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner label="Loading plant..." />;
  if (loadError) return <ErrorState message={loadError} onRetry={loadPlant} />;

  return (
    <PlantForm
      title={`✏️ Edit ${plant.name}`}
      subtitle="Changes are reflected in the shop right away."
      initialValues={plant}
      submitLabel="Save changes"
      busy={busy}
      error={error}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/admin')}
    />
  );
}

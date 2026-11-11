import { useEffect, useState } from 'react';
import api from '../api';
import { Recycle } from 'lucide-react';

export default function LogContribution() {
  const [points, setPoints] = useState([]);
  const [form, setForm] = useState({ point_id: '', category: 'paper', weight_kg: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/points').then((res) => setPoints(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/contributions', form);
      setMessage(`✅ Logged! You earned ${res.data.pointsAwarded} points.`);
      setForm({ point_id: '', category: 'paper', weight_kg: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging contribution');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-eco-100 flex items-center justify-center">
          <Recycle className="w-6 h-6 text-eco-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log Recycling</h1>
          <p className="text-sm text-gray-500">Record a new contribution and earn points</p>
        </div>
      </div>

      {message && <div className="bg-eco-50 text-eco-700 p-3 rounded-xl">{message}</div>}
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Collection Point</label>
          <select
            value={form.point_id}
            onChange={(e) => setForm({ ...form, point_id: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-eco-500"
            required
          >
            <option value="">Select a point</option>
            {points.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — {p.location}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {['paper', 'plastic', 'metal', 'glass'].map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setForm({ ...form, category: cat })}
                className={`py-3 rounded-xl text-sm font-semibold capitalize border ${
                  form.category === cat
                    ? 'bg-eco-500 text-white border-eco-500'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={form.weight_kg}
            onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-eco-500"
            placeholder="e.g. 1.5"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full">Submit Contribution</button>
      </form>
    </div>
  );
}
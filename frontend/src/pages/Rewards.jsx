import { useEffect, useState } from 'react';
import api from '../api';
import { Gift, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Rewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/rewards').then((res) => setRewards(res.data));
  }, []);

  const redeem = async (id) => {
    setMessage('');
    setError('');
    try {
      await api.post(`/rewards/redeem/${id}`);
      setMessage('🎉 Reward redeemed successfully!');
      api.get('/rewards').then((res) => setRewards(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Redemption failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center">
          <Gift className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Rewards Store</h1>
          <p className="text-sm text-gray-500">
            Balance: <strong>{user?.points ?? 0} pts</strong>
          </p>
        </div>
      </div>

      {message && <div className="bg-eco-50 text-eco-700 p-3 rounded-xl">{message}</div>}
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900">{r.name}</h3>
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">{r.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-eco-700">{r.points_cost} pts</div>
                <div className="text-xs text-gray-400">Stock: {r.stock}</div>
              </div>
              <button
                onClick={() => redeem(r.id)}
                disabled={r.stock <= 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Redeem
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
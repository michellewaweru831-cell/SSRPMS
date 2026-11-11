import { useEffect, useState } from 'react';
import api from '../api';
import { Trophy } from 'lucide-react';

export default function Reports() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/reports/summary').then((res) => setSummary(res.data));
  }, []);

  if (!summary) return <div className="p-8 text-center text-gray-400">Loading reports…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard & Reports</h1>
          <p className="text-sm text-gray-500">Institution-wide recycling performance</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Contributions" value={summary.totals.total_contributions || 0} />
        <Stat label="Total kg" value={summary.totals.total_weight || 0} />
        <Stat label="Active Users" value={summary.userParticipation.active_users || 0} />
      </div>

      <div className="card p-5">
        <h2 className="font-bold text-lg mb-3">By Category</h2>
        <div className="space-y-2">
          {summary.byCategory.length === 0 && (
            <p className="text-sm text-gray-400">No contributions yet.</p>
          )}
          {summary.byCategory.map((c) => (
            <div key={c.category} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="capitalize font-medium text-gray-700">{c.category}</span>
              <span className="text-gray-500 text-sm">{c.count} logs • {c.weight || 0} kg</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-bold text-lg mb-3">By Collection Point</h2>
        <div className="space-y-2">
          {summary.byPoint.map((p) => (
            <div key={p.name} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="font-medium text-gray-700">{p.name}</span>
              <span className="text-gray-500 text-sm">{p.count || 0} logs • {p.weight || 0} kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl font-bold text-eco-700">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
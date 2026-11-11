import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { MapPin } from 'lucide-react';

export default function Schedules() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);

  const load = () => api.get('/schedules').then((res) => setSchedules(res.data));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/schedules/${id}/status`, { status });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-eco-100 flex items-center justify-center">
          <MapPin className="w-6 h-6 text-eco-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collection Schedules</h1>
          <p className="text-sm text-gray-500">Upcoming pickups across campus</p>
        </div>
      </div>

      {schedules.length === 0 ? (
        <div className="card p-8 text-center text-gray-400">No schedules yet.</div>
      ) : (
        <div className="space-y-3">
          {schedules.map((s) => (
            <div key={s.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{s.point_name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(s.scheduled_date).toLocaleDateString()} • {s.scheduled_time}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Collector: {s.collector_name || 'Unassigned'}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                      s.status === 'completed'
                        ? 'bg-eco-100 text-eco-700'
                        : s.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s.status}
                  </span>
                  {user.role === 'collector' && s.status !== 'completed' && (
                    <button
                      onClick={() => updateStatus(s.id, 'completed')}
                      className="mt-2 block w-full bg-eco-600 text-white text-sm font-medium py-2 px-3 rounded-xl"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
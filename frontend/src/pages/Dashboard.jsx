import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  Plus, Gift, Scale, Cloud, Award, Trophy, Recycle,
  BookOpen, Laptop, TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/contributions/my').then((res) => setContributions(res.data)).catch(() => {});
    if (user?.role === 'admin' || user?.role === 'collector') {
      api.get('/reports/summary').then((res) => setSummary(res.data)).catch(() => {});
    }
  }, [user]);

  const totalKg = contributions.reduce((s, c) => s + Number(c.weight_kg), 0);
  const totalPoints = contributions.reduce((s, c) => s + Number(c.points_awarded), 0);
  const co2 = (totalKg * 2).toFixed(1);

  const categoryIcon = (cat) => {
    if (cat === 'paper') return <BookOpen className="w-5 h-5 text-amber-600" />;
    if (cat === 'plastic') return <Recycle className="w-5 h-5 text-blue-600" />;
    if (cat === 'metal') return <Laptop className="w-5 h-5 text-purple-600" />;
    return <Recycle className="w-5 h-5 text-eco-600" />;
  };

  const categoryBg = (cat) => {
    if (cat === 'paper') return 'bg-amber-100';
    if (cat === 'plastic') return 'bg-blue-100';
    if (cat === 'metal') return 'bg-purple-100';
    return 'bg-eco-100';
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-gradient-to-br from-eco-500 to-eco-600 p-6 text-white shadow-lg">
        <div className="inline-block bg-white/20 text-xs font-semibold tracking-wide px-3 py-1 rounded-full mb-3">
          LEVEL 4 ECO-WARRIOR
        </div>
        <h1 className="text-3xl font-bold mb-3">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}! 🌿
        </h1>
        <p className="text-white/90 text-[15px] mb-5 leading-relaxed">
          Your school has saved over 1.2 tons of waste this semester. Keep logging
          your recyclables to climb the campus leaderboard and win prizes!
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/log" className="flex items-center gap-2 bg-white text-eco-700 font-semibold py-3 px-5 rounded-2xl">
            <Plus className="w-5 h-5" /> Log New Item
          </Link>
          <Link to="/rewards" className="flex items-center gap-2 bg-white/20 border border-white/30 text-white font-semibold py-3 px-5 rounded-2xl">
            <Gift className="w-5 h-5" /> Redeem Rewards
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          label="TOTAL RECYCLED"
          value={`${totalKg.toFixed(1)} kg`}
          sub="+12% this week"
          subColor="text-eco-600"
          icon={<Scale className="w-6 h-6 text-eco-600" />}
          iconBg="bg-eco-100"
        />
        <StatCard
          label="CO2 SAVED"
          value={`${co2} kg`}
          sub="🌱 Equivalent to 4 trees"
          subColor="text-eco-600"
          icon={<Cloud className="w-6 h-6 text-eco-600" />}
          iconBg="bg-eco-100"
        />
        <StatCard
          label="POINTS EARNED"
          value={`${(user?.points ?? totalPoints).toLocaleString()} pts`}
          sub="💰 Ready to spend"
          subColor="text-amber-600"
          icon={<Award className="w-6 h-6 text-amber-600" />}
          iconBg="bg-amber-100"
        />
        <StatCard
          label="CAMPUS RANK"
          value="#5"
          sub="🏅 Top 2% students"
          subColor="text-purple-600"
          icon={<Trophy className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900">Your Recent Activity</h2>
          <Link to="/log" className="text-eco-600 font-semibold text-sm">View Log History</Link>
        </div>

        {contributions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No contributions yet. Tap “Log New Item” to start.
          </p>
        ) : (
          <div className="space-y-3">
            {contributions.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${categoryBg(c.category)}`}>
                  {categoryIcon(c.category)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 capitalize">{c.category} Recycling</div>
                  <div className="text-xs text-gray-500">
                    {c.point_name} • {new Date(c.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-eco-600">+{c.points_awarded} pts</div>
                  <div className="text-xs text-gray-400">{c.weight_kg} kg</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {summary && (
        <div className="card p-5">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-eco-600" /> System Overview
          </h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold text-eco-700">{summary.totals.total_contributions || 0}</div>
              <div className="text-xs text-gray-500">Contributions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-eco-700">{summary.totals.total_weight || 0}</div>
              <div className="text-xs text-gray-500">kg Recycled</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-eco-700">{summary.userParticipation.active_users || 0}</div>
              <div className="text-xs text-gray-500">Active Users</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, subColor, icon, iconBg }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-gray-400 tracking-wider mb-1">{label}</div>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <div className={`text-sm mt-1 font-medium ${subColor}`}>{sub}</div>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
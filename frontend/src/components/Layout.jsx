import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu, Leaf, LayoutDashboard, Recycle, Gift,
  MapPin, Trophy, User, Settings, LogOut, X,
} from 'lucide-react';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/log', label: 'Log Recycling', icon: Recycle },
  { to: '/rewards', label: 'Rewards Store', icon: Gift },
  { to: '/schedules', label: 'Campus Bin Map', icon: MapPin },
  { to: '/reports', label: 'Campus Leaderboard', icon: Trophy },
];

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'JD';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#eef4ee]">
      <header className="bg-white sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-eco-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-eco-700">SSRPMS</span>
          </div>

          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
            {initials}
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-72 max-w-[80%] bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-eco-500 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-eco-700 text-lg leading-tight">SSRPMS</div>
                  <div className="text-xs text-gray-500">System Navigation</div>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 pt-5 text-xs font-semibold text-gray-400 tracking-wider">
              MAIN MENU
            </div>
            <nav className="px-2 py-2 flex-1">
              {menuItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium ${
                      isActive ? 'bg-eco-50 text-eco-700' : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="px-5 pt-5 text-xs font-semibold text-gray-400 tracking-wider">
              USER SETTINGS
            </div>
            <nav className="px-2 py-2">
              <NavLink to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-[15px] font-medium">
                <User className="w-5 h-5" /> My Profile
              </NavLink>
              <NavLink to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-[15px] font-medium">
                <Settings className="w-5 h-5" /> App Settings
              </NavLink>
            </nav>

            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-3 rounded-2xl hover:bg-red-100"
              >
                <LogOut className="w-5 h-5" /> Log Out
              </button>
            </div>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} />
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-5 pb-24">
        <Outlet />
      </main>
    </div>
  );
}
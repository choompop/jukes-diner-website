import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Rocket, 
  GraduationCap, 
  Settings2, 
  CalendarDays, 
  UtensilsCrossed, 
  BarChart3, 
  Palette, 
  FileText, 
  LifeBuoy,
  LogOut, 
  ChevronRight,
  Truck,
  Bell,
  HardDrive,
  Kanban
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navGroups = [
    {
      label: 'Main',
      items: [
        { name: 'Command Center', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
        { name: 'Lexi AI (Brain Dump)', path: '/dashboard/brain-dump', icon: <MessageSquare className="h-4 w-4" /> },
      ]
    },
    {
      label: 'Franchise Ops',
      items: [
        { name: 'Getting Started', path: '/dashboard/onboarding', icon: <Rocket className="h-4 w-4" /> },
        { name: 'Training Center', path: '/dashboard/training', icon: <GraduationCap className="h-4 w-4" /> },
        { name: 'Operations', path: '/dashboard/operations', icon: <Settings2 className="h-4 w-4" /> },
        { name: 'Bookings', path: '/dashboard/bookings', icon: <CalendarDays className="h-4 w-4" /> },
      ]
    },
    {
      label: 'Management',
      items: [
        { name: 'Menu Management', path: '/dashboard/menu-mgmt', icon: <UtensilsCrossed className="h-4 w-4" /> },
        { name: 'Financials', path: '/dashboard/financials', icon: <BarChart3 className="h-4 w-4" /> },
        { name: 'Brand & Marketing', path: '/dashboard/marketing', icon: <Palette className="h-4 w-4" /> },
        { name: 'Notion Pipeline', path: '/dashboard/pipeline', icon: <Kanban className="h-4 w-4" /> },
        { name: 'Google Drive', path: '/dashboard/drive', icon: <HardDrive className="h-4 w-4" /> },
      ]
    },
    {
      label: 'Support',
      items: [
        { name: 'Resources', path: '/dashboard/resources', icon: <FileText className="h-4 w-4" /> },
        { name: 'Support', path: '/dashboard/support', icon: <LifeBuoy className="h-4 w-4" /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-diner-black text-white flex flex-col fixed h-full z-30 shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-diner-red" />
            <span className="font-display text-xl tracking-tighter">JUKE'S HQ</span>
          </Link>
          <button className="text-gray-500 hover:text-white transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-diner-red rounded-full" />
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto p-4 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              <p className="px-4 mb-2 text-[10px] font-display text-gray-500 uppercase tracking-widest">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group",
                      location.pathname === item.path 
                        ? "bg-diner-red text-white shadow-lg" 
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium text-xs">{item.name}</span>
                    </div>
                    <ChevronRight className={cn(
                      "h-3 w-3 transition-transform",
                      location.pathname === item.path ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                    )} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-diner-teal flex items-center justify-center font-display text-xs shadow-inner">
              {user?.username[0].toUpperCase()}
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="text-sm font-bold truncate capitalize">{user?.username}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

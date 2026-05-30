import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { cn } from '../lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BedDouble,
  CreditCard,
  Pill,
  FlaskConical,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  Bell,
  ClipboardList,
  UserCog,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'admissions', label: 'IP/Admissions', icon: BedDouble },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
  { id: 'laboratory', label: 'Laboratory', icon: FlaskConical },
  { id: 'forms', label: 'Clinical Forms', icon: ClipboardList },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'staff', label: 'Staff & HR', icon: UserCog },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, activePage, onNavigate }: LayoutProps) {
  const { user, memberships, activeTenant, setActiveTenant, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tenantDropdown, setTenantDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const userRole = activeTenant?.role || '';
  const visibleNavItems = navItems.filter(item => {
    if (['super_admin', 'admin'].includes(userRole)) return true;
    if (item.id === 'settings') return false;
    if (item.id === 'staff' && !['super_admin', 'admin', 'hr'].includes(userRole)) return false;
    if (item.id === 'billing' && !['super_admin', 'admin', 'billing'].includes(userRole)) return false;
    if (item.id === 'inventory' && !['super_admin', 'admin', 'inventory'].includes(userRole)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold tracking-wide truncate">MedCore HMS</h1>
            <p className="text-xs text-slate-400 truncate">{activeTenant?.tenants?.name || 'No Tenant'}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
                <Menu className="w-6 h-6" />
              </button>

              {/* Tenant Switcher */}
              {memberships.length > 1 && (
                <div className="relative">
                  <button
                    onClick={() => setTenantDropdown(!tenantDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                  >
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700 max-w-[150px] truncate">
                      {activeTenant?.tenants?.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {tenantDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                      {memberships.map(m => (
                        <button
                          key={m.tenant_id}
                          onClick={() => { setActiveTenant(m); setTenantDropdown(false); }}
                          className={cn(
                            'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3',
                            m.tenant_id === activeTenant?.tenant_id && 'bg-teal-50 text-teal-700'
                          )}
                        >
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{m.tenants.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{m.role}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {profileDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{userRole.replace('_', ' ')}</p>
                    </div>
                    <button
                      onClick={() => { onNavigate('settings'); setProfileDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

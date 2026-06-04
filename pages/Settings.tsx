import { useState } from 'react';
import { useAuth } from '../lib/auth';
import {
  Building2,
  Users,
  Shield,
  Bell,
  Database,
  CreditCard,
  Save,
  Plus,
  Edit,
  Check,
  X,
  Globe,
  Lock,
  Mail,
  Phone,
  MapPin,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { cn, getRoleBadgeColor } from '../lib/utils';

type SettingsTab = 'organization' | 'users' | 'roles' | 'notifications' | 'billing' | 'system';

export default function Settings() {
  const { activeTenant } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('organization');
  const [saveMessage, setSaveMessage] = useState('');

  const isAdmin = ['super_admin', 'admin'].includes(activeTenant?.role || '');

  const tabs: { id: SettingsTab; label: string; icon: typeof Building2; adminOnly?: boolean }[] = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'users', label: 'Users & Access', icon: Users, adminOnly: true },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield, adminOnly: true },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Subscription', icon: CreditCard, adminOnly: true },
    { id: 'system', label: 'System', icon: Database, adminOnly: true },
  ];

  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);

  function showSaved() {
    setSaveMessage('Settings saved successfully');
    setTimeout(() => setSaveMessage(''), 3000);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your organization and system preferences</p>
      </div>

      {saveMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {saveMessage}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {visibleTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                    activeTab === tab.id
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'organization' && <OrganizationSettings onSave={showSaved} />}
          {activeTab === 'users' && isAdmin && <UsersSettings onSave={showSaved} />}
          {activeTab === 'roles' && isAdmin && <RolesSettings />}
          {activeTab === 'notifications' && <NotificationSettings onSave={showSaved} />}
          {activeTab === 'billing' && isAdmin && <BillingSettings />}
          {activeTab === 'system' && isAdmin && <SystemSettings />}
        </div>
      </div>
    </div>
  );
}

function OrganizationSettings({ onSave }: { onSave: () => void }) {
  const { activeTenant } = useAuth();
  const [name, setName] = useState(activeTenant?.tenants?.name || '');
  const [type, setType] = useState(activeTenant?.tenants?.type || 'hospital');
  const [email, setEmail] = useState('admin@hospital.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [address, setAddress] = useState('123 Medical Center Drive, Healthcare City, HC 12345');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none">
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
              <option value="lab">Laboratory</option>
              <option value="network">Healthcare Network</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Regional Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none">
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Asia/Kolkata">India Standard Time</option>
                <option value="Europe/London">GMT</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
            <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={onSave} className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}

function UsersSettings({ onSave }: { onSave: () => void }) {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('doctor');

  const mockUsers = [
    { id: '1', name: 'Dr. Sarah Chen', email: 'sarah.chen@hospital.com', role: 'doctor', department: 'Cardiology', active: true },
    { id: '2', name: 'Dr. James Wilson', email: 'james.wilson@hospital.com', role: 'admin', department: 'Administration', active: true },
    { id: '3', name: 'Nurse Emily Davis', email: 'emily.davis@hospital.com', role: 'nurse', department: 'Emergency', active: true },
    { id: '4', name: 'Mike Johnson', email: 'mike.j@hospital.com', role: 'pharmacist', department: 'Pharmacy', active: true },
    { id: '5', name: 'Lisa Park', email: 'lisa.park@hospital.com', role: 'lab_tech', department: 'Laboratory', active: true },
    { id: '6', name: 'Tom Brown', email: 'tom.brown@hospital.com', role: 'receptionist', department: 'Front Desk', active: true },
    { id: '7', name: 'Anna White', email: 'anna.white@hospital.com', role: 'billing', department: 'Finance', active: false },
    { id: '8', name: 'Dr. Robert Kim', email: 'robert.kim@hospital.com', role: 'doctor', department: 'Orthopedics', active: true },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Users & Access</h2>
          <button onClick={() => setShowInvite(true)} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Invite User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getRoleBadgeColor(user.role))}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.department}</td>
                  <td className="py-3 px-4">
                    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', user.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', user.active ? 'bg-green-500' : 'bg-gray-400')} />
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                        {user.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInvite(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invite User</h3>
              <button onClick={() => setShowInvite(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="colleague@hospital.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none">
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="lab_tech">Lab Technician</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="billing">Billing</option>
                  <option value="hr">HR</option>
                  <option value="inventory">Inventory</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowInvite(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
              <button onClick={() => { setShowInvite(false); onSave(); }} className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RolesSettings() {
  const roles = [
    { name: 'Super Admin', key: 'super_admin', description: 'Full system access including tenant management', users: 1, permissions: ['all'] },
    { name: 'Admin', key: 'admin', description: 'Organization management, user management, settings', users: 2, permissions: ['manage_users', 'manage_settings', 'view_all_data', 'manage_billing', 'manage_inventory'] },
    { name: 'Doctor', key: 'doctor', description: 'Patient care, prescriptions, clinical forms', users: 8, permissions: ['view_patients', 'manage_appointments', 'prescribe', 'order_labs', 'fill_forms'] },
    { name: 'Nurse', key: 'nurse', description: 'Patient monitoring, vitals, bed management', users: 12, permissions: ['view_patients', 'manage_beds', 'fill_forms', 'update_vitals'] },
    { name: 'Pharmacist', key: 'pharmacist', description: 'Medication management, dispensing', users: 3, permissions: ['manage_medications', 'view_prescriptions', 'dispense'] },
    { name: 'Lab Tech', key: 'lab_tech', description: 'Lab test management, results entry', users: 4, permissions: ['manage_lab_tests', 'update_lab_orders', 'enter_results'] },
    { name: 'Receptionist', key: 'receptionist', description: 'Patient registration, appointments', users: 5, permissions: ['register_patients', 'manage_appointments', 'view_patients'] },
    { name: 'Billing', key: 'billing', description: 'Invoice management, payments', users: 2, permissions: ['manage_invoices', 'view_billing', 'process_payments'] },
    { name: 'HR', key: 'hr', description: 'Staff management, payroll', users: 2, permissions: ['manage_staff', 'view_reports'] },
    { name: 'Inventory', key: 'inventory', description: 'Inventory and supply management', users: 2, permissions: ['manage_inventory', 'view_reports'] },
  ];

  return (
    <div className="space-y-4">
      {roles.map(role => (
        <div key={role.key} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{role.name}</h3>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getRoleBadgeColor(role.key))}>
                  {role.users} user{role.users !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{role.description}</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {role.permissions.map(p => (
              <span key={p} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                {p.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationSettings({ onSave }: { onSave: () => void }) {
  const [settings, setSettings] = useState({
    appointment_reminders: true,
    lab_results: true,
    billing_alerts: true,
    low_stock: true,
    admission_discharge: true,
    staff_updates: false,
    system_maintenance: true,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
  });

  function toggle(key: keyof typeof settings) {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const groups = [
    {
      title: 'Clinical Notifications',
      items: [
        { key: 'appointment_reminders' as const, label: 'Appointment Reminders', desc: 'Get notified about upcoming appointments' },
        { key: 'lab_results' as const, label: 'Lab Results Ready', desc: 'Alert when lab results are available' },
        { key: 'admission_discharge' as const, label: 'Admission/Discharge', desc: 'Notifications for patient admissions and discharges' },
      ],
    },
    {
      title: 'Administrative Notifications',
      items: [
        { key: 'billing_alerts' as const, label: 'Billing Alerts', desc: 'Overdue invoices and payment reminders' },
        { key: 'low_stock' as const, label: 'Low Stock Alerts', desc: 'Alert when inventory or medications are running low' },
        { key: 'staff_updates' as const, label: 'Staff Updates', desc: 'New staff joins, role changes' },
        { key: 'system_maintenance' as const, label: 'System Maintenance', desc: 'Scheduled maintenance notifications' },
      ],
    },
    {
      title: 'Delivery Channels',
      items: [
        { key: 'email_notifications' as const, label: 'Email', desc: 'Receive notifications via email' },
        { key: 'sms_notifications' as const, label: 'SMS', desc: 'Receive notifications via text message' },
        { key: 'push_notifications' as const, label: 'Push Notifications', desc: 'Browser push notifications' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {groups.map(group => (
        <div key={group.title} className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{group.title}</h2>
          <div className="space-y-4">
            {group.items.map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <button onClick={() => toggle(item.key)} className="focus:outline-none">
                  {settings[item.key] ? (
                    <ToggleRight className="w-8 h-8 text-teal-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-300" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <button onClick={onSave} className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>
    </div>
  );
}

function BillingSettings() {
  const plans = [
    { name: 'Basic', price: '$99', period: '/month', features: ['Up to 10 users', '1 department', 'Basic reporting', 'Email support'], current: false },
    { name: 'Professional', price: '$299', period: '/month', features: ['Up to 50 users', '5 departments', 'Advanced reporting', 'Priority support', 'Custom forms'], current: true },
    { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited users', 'Unlimited departments', 'Full analytics', '24/7 support', 'Custom integrations', 'Dedicated DB'], current: false },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Subscription Plan</h2>
        <p className="text-sm text-gray-500 mb-6">Manage your subscription and billing</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.name} className={cn(
              'rounded-xl border-2 p-5',
              plan.current ? 'border-teal-500 bg-teal-50/30' : 'border-gray-200'
            )}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{plan.name}</h3>
                {plan.current && (
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">Current</span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={cn(
                'w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors',
                plan.current
                  ? 'bg-gray-100 text-gray-500 cursor-default'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              )}>
                {plan.current ? 'Current Plan' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h2>
        <div className="space-y-3">
          {[
            { date: 'May 1, 2026', amount: '$299.00', status: 'Paid' },
            { date: 'Apr 1, 2026', amount: '$299.00', status: 'Paid' },
            { date: 'Mar 1, 2026', amount: '$299.00', status: 'Paid' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">Professional Plan</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{item.amount}</p>
                <span className="text-xs text-green-600 font-medium">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SystemSettings() {
  const [autoBackup, setAutoBackup] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Require 2FA for all users</p>
              </div>
            </div>
            <button onClick={() => setTwoFactor(!twoFactor)} className="focus:outline-none">
              {twoFactor ? <ToggleRight className="w-8 h-8 text-teal-600" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
              </div>
            </div>
            <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data & Backup</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Automatic Backups</p>
              <p className="text-xs text-gray-500">Daily database backups at 2:00 AM</p>
            </div>
            <button onClick={() => setAutoBackup(!autoBackup)} className="focus:outline-none">
              {autoBackup ? <ToggleRight className="w-8 h-8 text-teal-600" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Audit Logging</p>
              <p className="text-xs text-gray-500">Track all system actions and data changes</p>
            </div>
            <button onClick={() => setAuditLogging(!auditLogging)} className="focus:outline-none">
              {auditLogging ? <ToggleRight className="w-8 h-8 text-teal-600" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
            </button>
          </div>
          <div className="pt-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">HIPAA</span>
            </div>
            <p className="text-xs text-green-700">Compliant - All requirements met</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">HL7 FHIR</span>
            </div>
            <p className="text-xs text-green-700">Compatible - R4 supported</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Data Encryption</span>
            </div>
            <p className="text-xs text-green-700">AES-256 at rest, TLS in transit</p>
          </div>
        </div>
      </div>
    </div>
  );
}

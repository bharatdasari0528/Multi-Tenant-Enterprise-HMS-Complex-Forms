import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import {
  Users,
  Calendar,
  BedDouble,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Clock,
  Plus,
  Activity,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

interface MetricCard {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  iconBgClass: string;
}

interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

interface BedOccupancy {
  total: number;
  occupied: number;
  available: number;
  maintenance: number;
}

interface Task {
  id: string;
  name: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
}

const metrics: MetricCard[] = [
  {
    label: 'Total Patients',
    value: '2,847',
    change: 12.5,
    changeLabel: 'vs last month',
    icon: Users,
    colorClass: 'text-teal-600',
    bgClass: 'bg-teal-50',
    iconBgClass: 'bg-teal-100',
  },
  {
    label: "Today's Appointments",
    value: '42',
    change: 8.3,
    changeLabel: 'vs yesterday',
    icon: Calendar,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    iconBgClass: 'bg-blue-100',
  },
  {
    label: 'Active Admissions',
    value: '156',
    change: -3.2,
    changeLabel: 'vs last week',
    icon: BedDouble,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50',
    iconBgClass: 'bg-amber-100',
  },
  {
    label: 'Revenue This Month',
    value: formatCurrency(485230),
    change: 18.7,
    changeLabel: 'vs last month',
    icon: CreditCard,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
    iconBgClass: 'bg-emerald-100',
  },
];

const recentAppointments: Appointment[] = [
  {
    id: '1',
    patient: 'Sarah Mitchell',
    doctor: 'Dr. James Chen',
    date: 'May 15, 2026',
    time: '09:00 AM',
    type: 'General Checkup',
    status: 'confirmed',
  },
  {
    id: '2',
    patient: 'Robert Yang',
    doctor: 'Dr. Amira Patel',
    date: 'May 15, 2026',
    time: '09:30 AM',
    type: 'Cardiology',
    status: 'in_progress',
  },
  {
    id: '3',
    patient: 'Maria Gonzalez',
    doctor: 'Dr. Lisa Novak',
    date: 'May 15, 2026',
    time: '10:00 AM',
    type: 'Neurology',
    status: 'scheduled',
  },
  {
    id: '4',
    patient: 'David Thompson',
    doctor: 'Dr. James Chen',
    date: 'May 15, 2026',
    time: '10:30 AM',
    type: 'Orthopedics',
    status: 'cancelled',
  },
  {
    id: '5',
    patient: 'Emily Nakamura',
    doctor: 'Dr. Kwame Asante',
    date: 'May 15, 2026',
    time: '11:00 AM',
    type: 'Pediatrics',
    status: 'confirmed',
  },
];

const bedOccupancy: BedOccupancy = {
  total: 300,
  occupied: 186,
  available: 98,
  maintenance: 16,
};

const quickActions = [
  { label: 'New Patient', icon: Users, color: 'text-teal-600 bg-teal-50 hover:bg-teal-100 border-teal-200' },
  { label: 'Schedule Appointment', icon: Calendar, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200' },
  { label: 'Create Invoice', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
  { label: 'Order Lab Test', icon: Activity, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200' },
  { label: 'Prescribe Medication', icon: Plus, color: 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200' },
  { label: 'View Reports', icon: ArrowRight, color: 'text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200' },
];

const upcomingTasks: Task[] = [
  { id: '1', name: 'Review discharge summary for Rm 204', dueTime: '10:00 AM', priority: 'high' },
  { id: '2', name: 'Sign lab results for Maria Gonzalez', dueTime: '11:30 AM', priority: 'high' },
  { id: '3', name: 'Prepare weekly census report', dueTime: '02:00 PM', priority: 'medium' },
  { id: '4', name: 'Update medication inventory', dueTime: '03:30 PM', priority: 'low' },
  { id: '5', name: 'Staff meeting - department heads', dueTime: '04:00 PM', priority: 'medium' },
];

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    confirmed: 'bg-blue-100 text-blue-700',
    scheduled: 'bg-sky-100 text-sky-700',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}

function formatStatus(status: string) {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getPriorityBadge(priority: 'high' | 'medium' | 'low') {
  const map = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-slate-100 text-slate-600',
  };
  return map[priority];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  const occupiedPercent = Math.round(
    (bedOccupancy.occupied / bedOccupancy.total) * 100
  );
  const availablePercent = Math.round(
    (bedOccupancy.available / bedOccupancy.total) * 100
  );
  const maintenancePercent = Math.round(
    (bedOccupancy.maintenance / bedOccupancy.total) * 100
  );

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Doctor';

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Greeting Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              {greeting()}, {userName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{currentDate}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Activity className="h-4 w-4 text-teal-500" />
            <span>System Operational</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;
          return (
            <div
              key={metric.label}
              className={cn(
                'rounded-xl border border-slate-200 bg-white p-5 sm:p-6',
                'shadow-sm hover:shadow-md transition-shadow duration-200'
              )}
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full',
                    metric.iconBgClass
                  )}
                >
                  <Icon className={cn('h-5 w-5', metric.colorClass)} />
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                    isPositive
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600'
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {isPositive ? '+' : ''}
                  {metric.change}%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {metric.value}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {metric.changeLabel}
              </p>
            </div>
          );
        })}
      </div>

      {/* Row 2: Appointments Table + Bed Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 sm:px-6 py-4">
            <h2 className="text-base font-semibold text-slate-800">
              Recent Appointments
            </h2>
            <button className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Patient
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Doctor
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Date
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Time
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Type
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 sm:px-6 py-3.5 text-sm font-medium text-slate-700">
                      {apt.patient}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-sm text-slate-500">
                      {apt.doctor}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-sm text-slate-500">
                      {apt.date}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-sm text-slate-500">
                      {apt.time}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-sm text-slate-500">
                      {apt.type}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          getStatusBadge(apt.status)
                        )}
                      >
                        {formatStatus(apt.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bed Occupancy */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-6">
            Bed Occupancy
          </h2>

          {/* Visual bar */}
          <div className="mb-6">
            <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
              <div
                className="bg-teal-500 transition-all duration-500"
                style={{ width: `${occupiedPercent}%` }}
              />
              <div
                className="bg-slate-300 transition-all duration-500"
                style={{ width: `${availablePercent}%` }}
              />
              <div
                className="bg-amber-400 transition-all duration-500"
                style={{ width: `${maintenancePercent}%` }}
              />
            </div>
          </div>

          {/* Legend and counts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-teal-500" />
                <span className="text-sm text-slate-600">Occupied</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-slate-800">
                  {bedOccupancy.occupied}
                </span>
                <span className="ml-1.5 text-xs text-slate-400">
                  ({occupiedPercent}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <span className="text-sm text-slate-600">Available</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-slate-800">
                  {bedOccupancy.available}
                </span>
                <span className="ml-1.5 text-xs text-slate-400">
                  ({availablePercent}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="text-sm text-slate-600">Maintenance</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-slate-800">
                  {bedOccupancy.maintenance}
                </span>
                <span className="ml-1.5 text-xs text-slate-400">
                  ({maintenancePercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm font-medium text-slate-500">
              Total Beds
            </span>
            <span className="text-lg font-bold text-slate-800">
              {bedOccupancy.total}
            </span>
          </div>

          {/* Occupancy rate callout */}
          <div
            className={cn(
              'mt-4 flex items-center gap-2 rounded-lg p-3',
              occupiedPercent > 80
                ? 'bg-red-50 text-red-700'
                : occupiedPercent > 60
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
            )}
          >
            {occupiedPercent > 80 ? (
              <AlertCircle className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            )}
            <span className="text-xs font-medium">
              {occupiedPercent > 80
                ? 'High occupancy rate - consider discharge planning'
                : occupiedPercent > 60
                  ? 'Moderate occupancy rate'
                  : 'Healthy occupancy rate'}
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Quick Actions + Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className={cn(
                    'flex flex-col items-center gap-2.5 rounded-lg border p-4 sm:p-5',
                    'transition-all duration-150',
                    action.color
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">
            Upcoming Tasks
          </h2>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 leading-snug">
                    {task.name}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {task.dueTime}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                        getPriorityBadge(task.priority)
                      )}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  UserCog,
  Stethoscope,
  Heart,
  Users,
  Edit,
  ToggleLeft,
  ToggleRight,
  Mail,
  Building2,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { cn, formatDate, getRoleBadgeColor } from '../lib/utils';

// --- Types ---

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
}

// --- Constants ---

const ROLES = [
  'super_admin',
  'admin',
  'doctor',
  'nurse',
  'pharmacist',
  'lab_tech',
  'receptionist',
  'billing',
  'hr',
  'inventory',
] as const;

const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Emergency',
  'ICU',
  'Radiology',
  'Pharmacy',
  'Laboratory',
  'Administration',
] as const;

function formatRole(role: string): string {
  return role
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getAvatarColor(firstName: string): string {
  const colors = [
    'bg-teal-100 text-teal-700',
    'bg-cyan-100 text-cyan-700',
    'bg-sky-100 text-sky-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-orange-100 text-orange-700',
    'bg-slate-100 text-slate-700',
  ];
  const index = firstName.charCodeAt(0) % colors.length;
  return colors[index];
}

function getRoleIcon(role: string) {
  switch (role) {
    case 'super_admin':
      return Shield;
    case 'admin':
      return UserCog;
    case 'doctor':
      return Stethoscope;
    case 'nurse':
      return Heart;
    default:
      return Users;
  }
}

// --- Mock Data ---

const initialStaff: StaffMember[] = [
  {
    id: '1',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@medcore.com',
    role: 'super_admin',
    department: 'Administration',
    status: 'active',
    joinedDate: '2022-01-15',
  },
  {
    id: '2',
    firstName: 'David',
    lastName: 'Mitchell',
    email: 'david.mitchell@medcore.com',
    role: 'admin',
    department: 'Administration',
    status: 'active',
    joinedDate: '2022-03-20',
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@medcore.com',
    role: 'doctor',
    department: 'Cardiology',
    status: 'active',
    joinedDate: '2022-06-10',
  },
  {
    id: '4',
    firstName: 'Michael',
    lastName: 'Rivera',
    email: 'michael.rivera@medcore.com',
    role: 'doctor',
    department: 'Orthopedics',
    status: 'active',
    joinedDate: '2023-01-05',
  },
  {
    id: '5',
    firstName: 'Emily',
    lastName: 'Nakamura',
    email: 'emily.nakamura@medcore.com',
    role: 'nurse',
    department: 'Emergency',
    status: 'active',
    joinedDate: '2023-02-14',
  },
  {
    id: '6',
    firstName: 'James',
    lastName: 'Okafor',
    email: 'james.okafor@medcore.com',
    role: 'nurse',
    department: 'ICU',
    status: 'active',
    joinedDate: '2023-04-22',
  },
  {
    id: '7',
    firstName: 'Lisa',
    lastName: 'Patel',
    email: 'lisa.patel@medcore.com',
    role: 'pharmacist',
    department: 'Pharmacy',
    status: 'active',
    joinedDate: '2023-07-01',
  },
  {
    id: '8',
    firstName: 'Robert',
    lastName: 'Yang',
    email: 'robert.yang@medcore.com',
    role: 'lab_tech',
    department: 'Laboratory',
    status: 'active',
    joinedDate: '2023-08-15',
  },
  {
    id: '9',
    firstName: 'Amanda',
    lastName: 'Foster',
    email: 'amanda.foster@medcore.com',
    role: 'receptionist',
    department: 'General Medicine',
    status: 'active',
    joinedDate: '2023-09-10',
  },
  {
    id: '10',
    firstName: 'Carlos',
    lastName: 'Gonzalez',
    email: 'carlos.gonzalez@medcore.com',
    role: 'billing',
    department: 'Administration',
    status: 'active',
    joinedDate: '2024-01-20',
  },
  {
    id: '11',
    firstName: 'Maria',
    lastName: 'Thompson',
    email: 'maria.thompson@medcore.com',
    role: 'hr',
    department: 'Administration',
    status: 'inactive',
    joinedDate: '2022-11-03',
  },
  {
    id: '12',
    firstName: 'Kevin',
    lastName: 'Wright',
    email: 'kevin.wright@medcore.com',
    role: 'inventory',
    department: 'General Medicine',
    status: 'active',
    joinedDate: '2024-03-12',
  },
  {
    id: '13',
    firstName: 'Rachel',
    lastName: 'Kim',
    email: 'rachel.kim@medcore.com',
    role: 'doctor',
    department: 'Pediatrics',
    status: 'active',
    joinedDate: '2024-02-28',
  },
  {
    id: '14',
    firstName: 'Thomas',
    lastName: 'Brooks',
    email: 'thomas.brooks@medcore.com',
    role: 'nurse',
    department: 'Radiology',
    status: 'inactive',
    joinedDate: '2023-05-17',
  },
  {
    id: '15',
    firstName: 'Anita',
    lastName: 'Dasgupta',
    email: 'anita.dasgupta@medcore.com',
    role: 'doctor',
    department: 'General Medicine',
    status: 'active',
    joinedDate: '2024-06-01',
  },
];

const emptyFormData: StaffFormData = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'doctor',
  department: 'General Medicine',
  status: 'active',
};

// --- Component ---

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<StaffFormData>(emptyFormData);

  // Filtered staff
  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      searchQuery === '' ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || s.role === roleFilter;
    const matchesDept = departmentFilter === 'all' || s.department === departmentFilter;
    return matchesSearch && matchesRole && matchesDept;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / pageSize));
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Stats
  const totalStaffCount = staff.length;
  const doctorsCount = staff.filter((s) => s.role === 'doctor').length;
  const nursesCount = staff.filter((s) => s.role === 'nurse').length;
  const otherStaffCount = staff.filter(
    (s) => s.role !== 'doctor' && s.role !== 'nurse'
  ).length;

  // Handlers
  const handleAddStaff = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) return;
    const newStaff: StaffMember = {
      id: String(Date.now()),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setStaff([newStaff, ...staff]);
    setFormData(emptyFormData);
    setShowAddModal(false);
    setCurrentPage(1);
  };

  const handleEditStaff = () => {
    if (!editingStaff || !formData.firstName || !formData.lastName || !formData.email) return;
    setStaff(
      staff.map((s) =>
        s.id === editingStaff.id
          ? {
              ...s,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              role: formData.role,
              department: formData.department,
              status: formData.status,
            }
          : s
      )
    );
    setEditingStaff(null);
    setShowEditModal(false);
    setFormData(emptyFormData);
  };

  const handleToggleStatus = (id: string) => {
    setStaff(
      staff.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'active' ? ('inactive' as const) : ('active' as const) }
          : s
      )
    );
  };

  const openEditModal = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role,
      department: member.department,
      status: member.status,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData(emptyFormData);
    setEditingStaff(null);
  };

  const stats = [
    {
      label: 'Total Staff',
      value: String(totalStaffCount),
      icon: Users,
      colorClass: 'text-teal-600',
      bgClass: 'bg-teal-50',
      iconBgClass: 'bg-teal-100',
    },
    {
      label: 'Doctors',
      value: String(doctorsCount),
      icon: Stethoscope,
      colorClass: 'text-sky-600',
      bgClass: 'bg-sky-50',
      iconBgClass: 'bg-sky-100',
    },
    {
      label: 'Nurses',
      value: String(nursesCount),
      icon: Heart,
      colorClass: 'text-rose-600',
      bgClass: 'bg-rose-50',
      iconBgClass: 'bg-rose-100',
    },
    {
      label: 'Other Staff',
      value: String(otherStaffCount),
      icon: UserCog,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50',
      iconBgClass: 'bg-amber-100',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Staff & HR Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage staff members, roles, and departments
          </p>
        </div>
        <button
          onClick={() => {
            setFormData(emptyFormData);
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full',
                    stat.iconBgClass
                  )}
                >
                  <Icon className={cn('h-5 w-5', stat.colorClass)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {formatRole(role)}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Name
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Role
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Department
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Joined Date
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Users className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-2 text-sm font-medium text-slate-500">No staff members found</p>
                    <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                paginatedStaff.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Name with Avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold shrink-0',
                            getAvatarColor(member.firstName)
                          )}
                        >
                          {getInitials(member.firstName, member.lastName)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {member.firstName} {member.lastName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                          getRoleBadgeColor(member.role)
                        )}
                      >
                        {(() => {
                          const RoleIcon = getRoleIcon(member.role);
                          return <RoleIcon className="h-3 w-3" />;
                        })()}
                        {formatRole(member.role)}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{member.department}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                          member.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                          )}
                        />
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">
                      {formatDate(member.joinedDate)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(member)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(member.id)}
                          className={cn(
                            'rounded-md p-1.5 transition-colors',
                            member.status === 'active'
                              ? 'text-emerald-500 hover:bg-amber-50 hover:text-amber-600'
                              : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                          )}
                          title={member.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {member.status === 'active' ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="border-t border-slate-100 bg-slate-50/30 px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing {paginatedStaff.length} of {filteredStaff.length} staff members
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  currentPage === 1
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors',
                    page === currentPage
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  currentPage === totalPages
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ====================== */}
      {/* Add Staff Modal        */}
      {/* ====================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-8 pb-8">
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Add Staff Member</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Fill in the details to add a new staff member
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="email@medcore.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {formatRole(role)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Toggle */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      status: formData.status === 'active' ? 'inactive' : 'active',
                    })
                  }
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 w-full transition-colors hover:bg-slate-100"
                >
                  {formData.status === 'active' ? (
                    <ToggleRight className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-slate-400" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      formData.status === 'active' ? 'text-emerald-700' : 'text-slate-500'
                    )}
                  >
                    {formData.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                disabled={!formData.firstName || !formData.lastName || !formData.email}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                  !formData.firstName || !formData.lastName || !formData.email
                    ? 'bg-teal-300 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Staff
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* Edit Staff Modal       */}
      {/* ====================== */}
      {showEditModal && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-8 pb-8">
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Edit Staff Member</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Update details for {editingStaff.firstName} {editingStaff.lastName}
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowEditModal(false);
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="email@medcore.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {formatRole(role)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Toggle */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      status: formData.status === 'active' ? 'inactive' : 'active',
                    })
                  }
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 w-full transition-colors hover:bg-slate-100"
                >
                  {formData.status === 'active' ? (
                    <ToggleRight className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-slate-400" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      formData.status === 'active' ? 'text-emerald-700' : 'text-slate-500'
                    )}
                  >
                    {formData.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => {
                  resetForm();
                  setShowEditModal(false);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditStaff}
                disabled={!formData.firstName || !formData.lastName || !formData.email}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                  !formData.firstName || !formData.lastName || !formData.email
                    ? 'bg-teal-300 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Save Changes
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

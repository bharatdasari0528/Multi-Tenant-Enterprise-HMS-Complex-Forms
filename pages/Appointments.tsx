import React, { useState } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle2,
  XCircle,
  Play,
  Eye,
  Edit,
  List,
  CalendarDays,
  AlertTriangle,
} from 'lucide-react';
import { cn, formatDate, getStatusColor } from '../lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
type AppointmentType = 'Consultation' | 'Follow-up' | 'Emergency' | 'Procedure';
type ViewMode = 'list' | 'calendar';
type DateFilter = 'Today' | 'This Week' | 'This Month' | 'Custom';

interface Appointment {
  id: string;
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  patientPhone: string;
  patientEmail: string;
  patientBloodGroup: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  startTime: string;
  endTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes: string;
  createdAt: string;
  statusTimeline: { status: AppointmentStatus; timestamp: string; note?: string }[];
}

interface NewAppointmentForm {
  patientSearch: string;
  selectedPatientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: AppointmentType | '';
  reason: string;
  notes: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockDoctors = [
  { id: 'd1', name: 'Dr. Sarah Mitchell', specialty: 'Internal Medicine' },
  { id: 'd2', name: 'Dr. Robert Yang', specialty: 'Cardiology' },
  { id: 'd3', name: 'Dr. Maria Gonzalez', specialty: 'Pediatrics' },
  { id: 'd4', name: 'Dr. James Chen', specialty: 'Neurology' },
  { id: 'd5', name: 'Dr. Amira Patel', specialty: 'Oncology' },
  { id: 'd6', name: 'Dr. Kwame Asante', specialty: 'Emergency Medicine' },
  { id: 'd7', name: 'Dr. Lisa Novak', specialty: 'Dermatology' },
  { id: 'd8', name: 'Dr. Ahmed Hassan', specialty: 'Orthopedics' },
];

const mockPatients = [
  { id: 'p1', firstName: 'Emily', lastName: 'Nakamura', phone: '(555) 678-9012', email: 'emily.nakamura@email.com', bloodGroup: 'O+' },
  { id: 'p2', firstName: 'Robert', lastName: 'Yang', phone: '(555) 345-6789', email: 'robert.yang@email.com', bloodGroup: 'O-' },
  { id: 'p3', firstName: 'Maria', lastName: 'Gonzalez', phone: '(555) 456-7890', email: 'maria.gonzalez@email.com', bloodGroup: 'B+' },
  { id: 'p4', firstName: 'David', lastName: 'Thompson', phone: '(555) 567-8901', email: 'david.thompson@email.com', bloodGroup: 'AB+' },
  { id: 'p5', firstName: 'Sarah', lastName: 'Mitchell', phone: '(555) 234-5678', email: 'sarah.mitchell@email.com', bloodGroup: 'A+' },
  { id: 'p6', firstName: 'James', lastName: 'Chen', phone: '(555) 789-0123', email: 'james.chen@email.com', bloodGroup: 'A-' },
  { id: 'p7', firstName: 'Patricia', lastName: 'Okafor', phone: '(555) 890-1234', email: 'patricia.okafor@email.com', bloodGroup: 'B-' },
  { id: 'p8', firstName: 'Lisa', lastName: 'Novak', phone: '(555) 012-3456', email: 'lisa.novak@email.com', bloodGroup: 'O+' },
  { id: 'p9', firstName: 'Ahmed', lastName: 'Hassan', phone: '(555) 123-4567', email: 'ahmed.hassan@email.com', bloodGroup: 'A+' },
  { id: 'p10', firstName: 'William', lastName: 'Petrov', phone: '(555) 901-2345', email: 'william.petrov@email.com', bloodGroup: 'AB-' },
];

const today = new Date().toISOString().split('T')[0];

const mockAppointments: Appointment[] = [
  {
    id: 'APT-001',
    patientId: 'p1',
    patientFirstName: 'Emily',
    patientLastName: 'Nakamura',
    patientPhone: '(555) 678-9012',
    patientEmail: 'emily.nakamura@email.com',
    patientBloodGroup: 'O+',
    doctorId: 'd1',
    doctorName: 'Dr. Sarah Mitchell',
    doctorSpecialty: 'Internal Medicine',
    date: today,
    startTime: '09:00',
    endTime: '09:30',
    type: 'Consultation',
    status: 'completed',
    reason: 'Annual physical examination and routine blood work review.',
    notes: 'Patient reports feeling well. Blood pressure 118/76. All labs within normal limits.',
    createdAt: '2026-05-10',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-10T08:00:00', note: 'Appointment created' },
      { status: 'confirmed', timestamp: '2026-05-12T10:00:00', note: 'Patient confirmed attendance' },
      { status: 'in_progress', timestamp: '2026-05-15T09:00:00', note: 'Appointment started' },
      { status: 'completed', timestamp: '2026-05-15T09:25:00', note: 'Consultation completed' },
    ],
  },
  {
    id: 'APT-002',
    patientId: 'p2',
    patientFirstName: 'Robert',
    patientLastName: 'Yang',
    patientPhone: '(555) 345-6789',
    patientEmail: 'robert.yang@email.com',
    patientBloodGroup: 'O-',
    doctorId: 'd2',
    doctorName: 'Dr. Robert Yang',
    doctorSpecialty: 'Cardiology',
    date: today,
    startTime: '09:30',
    endTime: '10:15',
    type: 'Follow-up',
    status: 'in_progress',
    reason: 'Post-cardiac stent follow-up. Review echocardiogram results.',
    notes: 'Echocardiogram shows improved ejection fraction. Continue current medication regimen.',
    createdAt: '2026-05-08',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-08T14:00:00', note: 'Appointment created' },
      { status: 'confirmed', timestamp: '2026-05-09T09:00:00', note: 'Auto-confirmed for follow-up' },
      { status: 'in_progress', timestamp: '2026-05-15T09:30:00', note: 'Appointment started' },
    ],
  },
  {
    id: 'APT-003',
    patientId: 'p3',
    patientFirstName: 'Maria',
    patientLastName: 'Gonzalez',
    patientPhone: '(555) 456-7890',
    patientEmail: 'maria.gonzalez@email.com',
    patientBloodGroup: 'B+',
    doctorId: 'd4',
    doctorName: 'Dr. James Chen',
    doctorSpecialty: 'Neurology',
    date: today,
    startTime: '10:30',
    endTime: '11:00',
    type: 'Consultation',
    status: 'confirmed',
    reason: 'Recurring migraine evaluation. Current medication not providing adequate relief.',
    notes: '',
    createdAt: '2026-05-11',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-11T11:00:00', note: 'Appointment created' },
      { status: 'confirmed', timestamp: '2026-05-13T08:00:00', note: 'Patient confirmed via portal' },
    ],
  },
  {
    id: 'APT-004',
    patientId: 'p5',
    patientFirstName: 'Sarah',
    patientLastName: 'Mitchell',
    patientPhone: '(555) 234-5678',
    patientEmail: 'sarah.mitchell@email.com',
    patientBloodGroup: 'A+',
    doctorId: 'd1',
    doctorName: 'Dr. Sarah Mitchell',
    doctorSpecialty: 'Internal Medicine',
    date: today,
    startTime: '11:00',
    endTime: '11:30',
    type: 'Follow-up',
    status: 'scheduled',
    reason: 'Hypertension management review. Check Lisinopril effectiveness.',
    notes: '',
    createdAt: '2026-05-12',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-12T15:00:00', note: 'Appointment created' },
    ],
  },
  {
    id: 'APT-005',
    patientId: 'p6',
    patientFirstName: 'James',
    patientLastName: 'Chen',
    patientPhone: '(555) 789-0123',
    patientEmail: 'james.chen@email.com',
    patientBloodGroup: 'A-',
    doctorId: 'd2',
    doctorName: 'Dr. Robert Yang',
    doctorSpecialty: 'Cardiology',
    date: today,
    startTime: '13:00',
    endTime: '13:45',
    type: 'Procedure',
    status: 'scheduled',
    reason: 'Pacemaker interrogation and programming adjustment.',
    notes: '',
    createdAt: '2026-05-09',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-09T10:00:00', note: 'Appointment created' },
    ],
  },
  {
    id: 'APT-006',
    patientId: 'p7',
    patientFirstName: 'Patricia',
    patientLastName: 'Okafor',
    patientPhone: '(555) 890-1234',
    patientEmail: 'patricia.okafor@email.com',
    patientBloodGroup: 'B-',
    doctorId: 'd5',
    doctorName: 'Dr. Amira Patel',
    doctorSpecialty: 'Oncology',
    date: today,
    startTime: '14:00',
    endTime: '14:30',
    type: 'Follow-up',
    status: 'confirmed',
    reason: 'Fibromyalgia management review. Assess Pregabalin effectiveness.',
    notes: '',
    createdAt: '2026-05-10',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-10T09:00:00', note: 'Appointment created' },
      { status: 'confirmed', timestamp: '2026-05-12T14:00:00', note: 'Patient confirmed via phone' },
    ],
  },
  {
    id: 'APT-007',
    patientId: 'p4',
    patientFirstName: 'David',
    patientLastName: 'Thompson',
    patientPhone: '(555) 567-8901',
    patientEmail: 'david.thompson@email.com',
    patientBloodGroup: 'AB+',
    doctorId: 'd8',
    doctorName: 'Dr. Ahmed Hassan',
    doctorSpecialty: 'Orthopedics',
    date: today,
    startTime: '08:30',
    endTime: '09:00',
    type: 'Emergency',
    status: 'completed',
    reason: 'Acute lower back pain. Patient reports fall incident yesterday.',
    notes: 'X-ray shows no fracture. Muscle strain diagnosed. Prescribed rest and NSAIDs.',
    createdAt: '2026-05-15',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-15T07:00:00', note: 'Emergency appointment created' },
      { status: 'confirmed', timestamp: '2026-05-15T07:15:00', note: 'Auto-confirmed for emergency' },
      { status: 'in_progress', timestamp: '2026-05-15T08:30:00', note: 'Appointment started' },
      { status: 'completed', timestamp: '2026-05-15T08:55:00', note: 'Consultation completed' },
    ],
  },
  {
    id: 'APT-008',
    patientId: 'p8',
    patientFirstName: 'Lisa',
    patientLastName: 'Novak',
    patientPhone: '(555) 012-3456',
    patientEmail: 'lisa.novak@email.com',
    patientBloodGroup: 'O+',
    doctorId: 'd7',
    doctorName: 'Dr. Lisa Novak',
    doctorSpecialty: 'Dermatology',
    date: today,
    startTime: '15:00',
    endTime: '15:30',
    type: 'Consultation',
    status: 'cancelled',
    reason: 'Skin rash evaluation on forearms. Onset approximately 2 weeks ago.',
    notes: 'Cancelled by patient due to scheduling conflict. Rescheduled for next week.',
    createdAt: '2026-05-07',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-07T10:00:00', note: 'Appointment created' },
      { status: 'confirmed', timestamp: '2026-05-09T11:00:00', note: 'Patient confirmed' },
      { status: 'cancelled', timestamp: '2026-05-14T16:00:00', note: 'Cancelled by patient' },
    ],
  },
  {
    id: 'APT-009',
    patientId: 'p9',
    patientFirstName: 'Ahmed',
    patientLastName: 'Hassan',
    patientPhone: '(555) 123-4567',
    patientEmail: 'ahmed.hassan@email.com',
    patientBloodGroup: 'A+',
    doctorId: 'd1',
    doctorName: 'Dr. Sarah Mitchell',
    doctorSpecialty: 'Internal Medicine',
    date: today,
    startTime: '16:00',
    endTime: '16:30',
    type: 'Follow-up',
    status: 'scheduled',
    reason: 'Diabetes management. Review HbA1c results and insulin pump settings.',
    notes: '',
    createdAt: '2026-05-13',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-13T12:00:00', note: 'Appointment created' },
    ],
  },
  {
    id: 'APT-010',
    patientId: 'p10',
    patientFirstName: 'William',
    patientLastName: 'Petrov',
    patientPhone: '(555) 901-2345',
    patientEmail: 'william.petrov@email.com',
    patientBloodGroup: 'AB-',
    doctorId: 'd2',
    doctorName: 'Dr. Robert Yang',
    doctorSpecialty: 'Cardiology',
    date: today,
    startTime: '11:30',
    endTime: '12:00',
    type: 'Procedure',
    status: 'completed',
    reason: 'Echocardiogram and stress test.',
    notes: 'Results show stable cardiac function. No new concerns. Follow up in 6 months.',
    createdAt: '2026-05-05',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-05T09:00:00', note: 'Appointment created' },
      { status: 'confirmed', timestamp: '2026-05-07T10:00:00', note: 'Patient confirmed' },
      { status: 'in_progress', timestamp: '2026-05-15T11:30:00', note: 'Procedure started' },
      { status: 'completed', timestamp: '2026-05-15T11:55:00', note: 'Procedure completed successfully' },
    ],
  },
  {
    id: 'APT-011',
    patientId: 'p1',
    patientFirstName: 'Emily',
    patientLastName: 'Nakamura',
    patientPhone: '(555) 678-9012',
    patientEmail: 'emily.nakamura@email.com',
    patientBloodGroup: 'O+',
    doctorId: 'd6',
    doctorName: 'Dr. Kwame Asante',
    doctorSpecialty: 'Emergency Medicine',
    date: today,
    startTime: '07:30',
    endTime: '08:00',
    type: 'Emergency',
    status: 'completed',
    reason: 'Anxiety episode with chest tightness. Required urgent evaluation.',
    notes: 'ECG normal. Anxiety-related. Referred to psychiatry for follow-up.',
    createdAt: '2026-05-15',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-15T07:00:00', note: 'Emergency walk-in' },
      { status: 'confirmed', timestamp: '2026-05-15T07:05:00', note: 'Auto-confirmed' },
      { status: 'in_progress', timestamp: '2026-05-15T07:30:00', note: 'Evaluation started' },
      { status: 'completed', timestamp: '2026-05-15T07:50:00', note: 'Discharged with referral' },
    ],
  },
  {
    id: 'APT-012',
    patientId: 'p8',
    patientFirstName: 'Lisa',
    patientLastName: 'Novak',
    patientPhone: '(555) 012-3456',
    patientEmail: 'lisa.novak@email.com',
    patientBloodGroup: 'O+',
    doctorId: 'd3',
    doctorName: 'Dr. Maria Gonzalez',
    doctorSpecialty: 'Pediatrics',
    date: today,
    startTime: '14:30',
    endTime: '15:00',
    type: 'Consultation',
    status: 'scheduled',
    reason: 'Rheumatoid arthritis flare-up assessment. Joint pain in hands bilaterally.',
    notes: '',
    createdAt: '2026-05-14',
    statusTimeline: [
      { status: 'scheduled', timestamp: '2026-05-14T11:00:00', note: 'Appointment created' },
    ],
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────

const typeOptions: AppointmentType[] = ['Consultation', 'Follow-up', 'Emergency', 'Procedure'];
const statusOptions: ('All' | AppointmentStatus)[] = ['All', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'];
const dateFilterOptions: DateFilter[] = ['Today', 'This Week', 'This Month', 'Custom'];

const emptyForm: NewAppointmentForm = {
  patientSearch: '',
  selectedPatientId: '',
  doctorId: '',
  date: today,
  startTime: '09:00',
  endTime: '09:30',
  type: '',
  reason: '',
  notes: '',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatStatus(status: string): string {
  return status
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

function getAvatarColor(firstName: string): string {
  const colors = [
    'bg-teal-100 text-teal-700',
    'bg-cyan-100 text-cyan-700',
    'bg-sky-100 text-sky-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-slate-100 text-slate-700',
    'bg-orange-100 text-orange-700',
  ];
  let hash = 0;
  for (let i = 0; i < firstName.length; i++) hash = firstName.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getTypeBadgeColor(type: string): string {
  const map: Record<string, string> = {
    Consultation: 'bg-teal-50 text-teal-700 border border-teal-200',
    'Follow-up': 'bg-sky-50 text-sky-700 border border-sky-200',
    Emergency: 'bg-red-50 text-red-700 border border-red-200',
    Procedure: 'bg-amber-50 text-amber-700 border border-amber-200',
  };
  return map[type] || 'bg-slate-50 text-slate-700 border border-slate-200';
}

function getStatusIcon(status: AppointmentStatus) {
  switch (status) {
    case 'scheduled':
      return Calendar;
    case 'confirmed':
      return CheckCircle2;
    case 'in_progress':
      return Play;
    case 'completed':
      return CheckCircle2;
    case 'cancelled':
      return XCircle;
  }
}

function getNextActions(status: AppointmentStatus): { label: string; action: AppointmentStatus; color: string }[] {
  switch (status) {
    case 'scheduled':
      return [{ label: 'Confirm', action: 'confirmed' as AppointmentStatus, color: 'bg-teal-600 hover:bg-teal-700 text-white' }];
    case 'confirmed':
      return [{ label: 'Start', action: 'in_progress' as AppointmentStatus, color: 'bg-teal-600 hover:bg-teal-700 text-white' }];
    case 'in_progress':
      return [{ label: 'Complete', action: 'completed' as AppointmentStatus, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' }];
    case 'completed':
      return [];
    case 'cancelled':
      return [];
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Appointments() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState(today);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('Today');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newForm, setNewForm] = useState<NewAppointmentForm>({ ...emptyForm });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof NewAppointmentForm, string>>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);

  const pageSize = 8;

  // ── Stats ──

  const stats = {
    today: mockAppointments.filter((a) => a.date === today).length,
    completed: mockAppointments.filter((a) => a.date === today && a.status === 'completed').length,
    inProgress: mockAppointments.filter((a) => a.date === today && a.status === 'in_progress').length,
    cancelled: mockAppointments.filter((a) => a.date === today && a.status === 'cancelled').length,
  };

  // ── Filtering ──

  const filteredAppointments = mockAppointments.filter((a) => {
    const matchesSearch =
      searchQuery === '' ||
      `${a.patientFirstName} ${a.patientLastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'All' || a.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;

    let matchesDate = true;
    if (dateFilter === 'Today') {
      matchesDate = a.date === today;
    } else if (dateFilter === 'This Week') {
      const d = new Date(today);
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const aDate = new Date(a.date);
      matchesDate = aDate >= startOfWeek && aDate <= endOfWeek;
    } else if (dateFilter === 'This Month') {
      const d = new Date(today);
      matchesDate = a.date.startsWith(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / pageSize));
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ── Form handlers ──

  function validateForm(): boolean {
    const errors: Partial<Record<keyof NewAppointmentForm, string>> = {};
    if (!newForm.selectedPatientId) errors.selectedPatientId = 'Patient is required';
    if (!newForm.doctorId) errors.doctorId = 'Doctor is required';
    if (!newForm.date) errors.date = 'Date is required';
    if (!newForm.startTime) errors.startTime = 'Start time is required';
    if (!newForm.endTime) errors.endTime = 'End time is required';
    if (!newForm.type) errors.type = 'Appointment type is required';
    if (!newForm.reason.trim()) errors.reason = 'Reason is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleScheduleAppointment() {
    if (!validateForm()) return;
    setShowNewModal(false);
    setNewForm({ ...emptyForm });
    setFormErrors({});
  }

  function handleCancelNewAppointment() {
    setShowNewModal(false);
    setNewForm({ ...emptyForm });
    setFormErrors({});
  }

  function openDetailPanel(apt: Appointment) {
    setSelectedAppointment(apt);
    setShowDetailPanel(true);
  }

  function closeDetailPanel() {
    setShowDetailPanel(false);
    setSelectedAppointment(null);
  }

  function handleStatusChange(apt: Appointment, newStatus: AppointmentStatus) {
    // In production, this would update via Supabase
    apt.status = newStatus;
    apt.statusTimeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: `Status changed to ${formatStatus(newStatus)}`,
    });
    // Force re-render
    setSelectedAppointment({ ...apt });
  }

  function handleCancelAppointment(apt: Appointment) {
    apt.status = 'cancelled';
    apt.statusTimeline.push({
      status: 'cancelled',
      timestamp: new Date().toISOString(),
      note: 'Appointment cancelled',
    });
    setSelectedAppointment({ ...apt });
  }

  // ── Calendar helper ──

  function getCalendarDays() {
    const d = new Date(selectedDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { date: number; month: 'prev' | 'current' | 'next'; fullDate: string }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      days.push({ date: day, month: 'prev', fullDate: `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}` });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, month: 'current', fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}` });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      days.push({ date: i, month: 'next', fullDate: `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}` });
    }

    return days;
  }

  // ── Render: New Appointment Modal ──

  const renderNewAppointmentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={handleCancelNewAppointment}
      />
      <div className="relative z-10 mx-4 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">New Appointment</h2>
          <button
            onClick={handleCancelNewAppointment}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Patient Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Patient <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={newForm.patientSearch}
                onChange={(e) => {
                  setNewForm({ ...newForm, patientSearch: e.target.value });
                  setPatientDropdownOpen(true);
                }}
                onFocus={() => setPatientDropdownOpen(true)}
                className={cn(
                  'w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors',
                  formErrors.selectedPatientId
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
                )}
                placeholder="Search patient by name..."
              />
            </div>
            {formErrors.selectedPatientId && (
              <p className="mt-1 text-xs text-red-600">{formErrors.selectedPatientId}</p>
            )}
            {newForm.selectedPatientId && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-teal-50 border border-teal-200 px-3 py-2">
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold', getAvatarColor(
                  mockPatients.find((p) => p.id === newForm.selectedPatientId)?.firstName || ''
                ))}>
                  {getInitials(
                    mockPatients.find((p) => p.id === newForm.selectedPatientId)?.firstName || '',
                    mockPatients.find((p) => p.id === newForm.selectedPatientId)?.lastName || ''
                  )}
                </div>
                <span className="text-sm font-medium text-teal-800">
                  {mockPatients.find((p) => p.id === newForm.selectedPatientId)?.firstName}{' '}
                  {mockPatients.find((p) => p.id === newForm.selectedPatientId)?.lastName}
                </span>
                <button
                  onClick={() => setNewForm({ ...newForm, selectedPatientId: '', patientSearch: '' })}
                  className="ml-auto text-teal-400 hover:text-teal-600"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            )}
            {patientDropdownOpen && !newForm.selectedPatientId && (
              <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                {mockPatients
                  .filter(
                    (p) =>
                      newForm.patientSearch === '' ||
                      `${p.firstName} ${p.lastName}`.toLowerCase().includes(newForm.patientSearch.toLowerCase())
                  )
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setNewForm({ ...newForm, selectedPatientId: p.id, patientSearch: `${p.firstName} ${p.lastName}` });
                        setPatientDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-teal-50 transition-colors"
                    >
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold', getAvatarColor(p.firstName))}>
                        {getInitials(p.firstName, p.lastName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{p.firstName} {p.lastName}</p>
                        <p className="text-xs text-slate-400">{p.phone}</p>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Doctor Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Doctor <span className="text-red-500">*</span>
            </label>
            <select
              value={newForm.doctorId}
              onChange={(e) => setNewForm({ ...newForm, doctorId: e.target.value })}
              className={cn(
                'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-colors appearance-none cursor-pointer',
                formErrors.doctorId
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
              )}
            >
              <option value="">Select doctor</option>
              {mockDoctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} - {d.specialty}
                </option>
              ))}
            </select>
            {formErrors.doctorId && (
              <p className="mt-1 text-xs text-red-600">{formErrors.doctorId}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={newForm.date}
                onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                className={cn(
                  'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-colors',
                  formErrors.date
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
                )}
              />
              {formErrors.date && (
                <p className="mt-1 text-xs text-red-600">{formErrors.date}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={newForm.startTime}
                onChange={(e) => setNewForm({ ...newForm, startTime: e.target.value })}
                className={cn(
                  'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-colors',
                  formErrors.startTime
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
                )}
              />
              {formErrors.startTime && (
                <p className="mt-1 text-xs text-red-600">{formErrors.startTime}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={newForm.endTime}
                onChange={(e) => setNewForm({ ...newForm, endTime: e.target.value })}
                className={cn(
                  'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-colors',
                  formErrors.endTime
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
                )}
              />
              {formErrors.endTime && (
                <p className="mt-1 text-xs text-red-600">{formErrors.endTime}</p>
              )}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={newForm.type}
              onChange={(e) => setNewForm({ ...newForm, type: e.target.value as AppointmentType })}
              className={cn(
                'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-colors appearance-none cursor-pointer',
                formErrors.type
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
              )}
            >
              <option value="">Select appointment type</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {formErrors.type && (
              <p className="mt-1 text-xs text-red-600">{formErrors.type}</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newForm.reason}
              onChange={(e) => setNewForm({ ...newForm, reason: e.target.value })}
              rows={3}
              className={cn(
                'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors resize-none',
                formErrors.reason
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
              )}
              placeholder="Describe the reason for this appointment..."
            />
            {formErrors.reason && (
              <p className="mt-1 text-xs text-red-600">{formErrors.reason}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Notes
            </label>
            <textarea
              value={newForm.notes}
              onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors resize-none"
              placeholder="Additional notes (optional)..."
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50/50">
          <button
            onClick={handleCancelNewAppointment}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleScheduleAppointment}
            className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
          >
            Schedule Appointment
          </button>
        </div>
      </div>
    </div>
  );

  // ── Render: Appointment Detail Panel ──

  const renderDetailPanel = () => {
    if (!selectedAppointment) return null;
    const apt = selectedAppointment;
    const nextActions = getNextActions(apt.status);
    const doctor = mockDoctors.find((d) => d.id === apt.doctorId);

    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={closeDetailPanel}
        />
        <div className="relative z-10 w-full max-w-lg h-full bg-white shadow-2xl border-l border-slate-200 overflow-y-auto animate-slide-in">
          {/* Panel Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Appointment Details</h2>
                <p className="text-sm text-slate-500 mt-0.5">{apt.id}</p>
              </div>
              <button
                onClick={closeDetailPanel}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold',
                  getStatusColor(apt.status)
                )}
              >
                {React.createElement(getStatusIcon(apt.status), { className: 'h-3.5 w-3.5' })}
                {formatStatus(apt.status)}
              </span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border',
                  getTypeBadgeColor(apt.type)
                )}
              >
                {apt.type}
              </span>
            </div>

            {/* Patient Info */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Patient Information</h3>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold',
                    getAvatarColor(apt.patientFirstName)
                  )}
                >
                  {getInitials(apt.patientFirstName, apt.patientLastName)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {apt.patientFirstName} {apt.patientLastName}
                  </p>
                  <p className="text-xs text-slate-500">{apt.patientId.toUpperCase()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="font-medium text-slate-700">{apt.patientPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Blood Group</p>
                  <p className="font-medium text-slate-700">{apt.patientBloodGroup}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="font-medium text-slate-700">{apt.patientEmail}</p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Appointment Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                    <User className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Doctor</p>
                    <p className="text-sm font-medium text-slate-700">{apt.doctorName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                    <Calendar className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="text-sm font-medium text-slate-700">{formatDate(apt.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                    <Clock className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Time</p>
                    <p className="text-sm font-medium text-slate-700">
                      {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                    </p>
                  </div>
                </div>
                {doctor && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                      <AlertTriangle className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Specialty</p>
                      <p className="text-sm font-medium text-slate-700">{doctor.specialty}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Reason</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{apt.reason}</p>
            </div>

            {/* Notes */}
            {apt.notes && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Notes</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{apt.notes}</p>
              </div>
            )}

            {/* Status Timeline */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Status Timeline</h3>
              <div className="relative space-y-0">
                {apt.statusTimeline.map((entry, i) => {
                  const isLast = i === apt.statusTimeline.length - 1;
                  const Icon = getStatusIcon(entry.status);
                  return (
                    <div key={i} className="flex gap-3 relative">
                      {/* Vertical line */}
                      {!isLast && (
                        <div className="absolute left-[11px] top-6 w-0.5 h-full bg-slate-200" />
                      )}
                      {/* Icon */}
                      <div
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full shrink-0 z-10',
                          isLast ? 'bg-teal-100' : 'bg-slate-100'
                        )}
                      >
                        <Icon className={cn('h-3 w-3', isLast ? 'text-teal-600' : 'text-slate-400')} />
                      </div>
                      {/* Content */}
                      <div className="pb-4">
                        <p className={cn('text-sm font-medium', isLast ? 'text-slate-800' : 'text-slate-600')}>
                          {formatStatus(entry.status)}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(entry.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {entry.note && (
                          <p className="text-xs text-slate-500 mt-1">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            {apt.status !== 'completed' && apt.status !== 'cancelled' && (
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  {nextActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleStatusChange(apt, action.action)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm',
                        action.color
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                  <button
                    onClick={() => handleCancelAppointment(apt)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Render: Calendar View ──

  const renderCalendarView = () => {
    const days = getCalendarDays();
    const d = new Date(selectedDate);
    const monthName = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setSelectedDate(newDate.toISOString().split('T')[0]);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-base font-semibold text-slate-800">{monthName}</h3>
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setSelectedDate(newDate.toISOString().split('T')[0]);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {dayNames.map((day) => (
            <div key={day} className="px-2 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((dayInfo, i) => {
            const dayAppointments = mockAppointments.filter((a) => a.date === dayInfo.fullDate);
            const isToday = dayInfo.fullDate === today;
            const isCurrentMonth = dayInfo.month === 'current';

            return (
              <div
                key={i}
                className={cn(
                  'min-h-[100px] border-b border-r border-slate-100 p-1.5 transition-colors',
                  !isCurrentMonth && 'bg-slate-50/50',
                  isCurrentMonth && 'bg-white',
                  isToday && 'bg-teal-50/30'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                      isToday
                        ? 'bg-teal-600 text-white'
                        : isCurrentMonth
                        ? 'text-slate-700'
                        : 'text-slate-300'
                    )}
                  >
                    {dayInfo.date}
                  </span>
                  {dayAppointments.length > 0 && (
                    <span className="text-[10px] font-semibold text-teal-600">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5">
                  {dayAppointments.slice(0, 3).map((apt) => (
                    <button
                      key={apt.id}
                      onClick={() => openDetailPanel(apt)}
                      className={cn(
                        'w-full text-left rounded px-1.5 py-0.5 text-[10px] font-medium truncate transition-colors',
                        apt.status === 'completed' && 'bg-emerald-50 text-emerald-700',
                        apt.status === 'in_progress' && 'bg-amber-50 text-amber-700',
                        apt.status === 'confirmed' && 'bg-teal-50 text-teal-700',
                        apt.status === 'scheduled' && 'bg-blue-50 text-blue-700',
                        apt.status === 'cancelled' && 'bg-red-50 text-red-500 line-through'
                      )}
                    >
                      {formatTime(apt.startTime)} {apt.patientLastName}
                    </button>
                  ))}
                  {dayAppointments.length > 3 && (
                    <p className="text-[10px] text-slate-400 pl-1.5">
                      +{dayAppointments.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Main Render ──

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage and schedule patient appointments
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Picker */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <Calendar className="h-4 w-4 text-teal-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-0 bg-transparent text-sm font-medium text-slate-700 focus:outline-none focus:ring-0 p-0"
              />
            </div>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors',
                  viewMode === 'list'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <List className="h-4 w-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors border-l border-slate-200',
                  viewMode === 'calendar'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <CalendarDays className="h-4 w-4" />
                Calendar
              </button>
            </div>

            {/* New Appointment Button */}
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Appointment
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Today's Appointments",
              value: stats.today,
              icon: Calendar,
              color: 'text-teal-600',
              iconBg: 'bg-teal-100',
            },
            {
              label: 'Completed',
              value: stats.completed,
              icon: CheckCircle2,
              color: 'text-emerald-600',
              iconBg: 'bg-emerald-100',
            },
            {
              label: 'In Progress',
              value: stats.inProgress,
              icon: Play,
              color: 'text-amber-600',
              iconBg: 'bg-amber-100',
            },
            {
              label: 'Cancelled',
              value: stats.cancelled,
              icon: XCircle,
              color: 'text-red-600',
              iconBg: 'bg-red-100',
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={cn(
                  'rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
                  'hover:shadow-md transition-shadow duration-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', stat.iconBg)}>
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Filter Bar ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient, doctor, or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors shadow-sm"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value as DateFilter);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors shadow-sm cursor-pointer"
            >
              {dateFilterOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors shadow-sm cursor-pointer"
            >
              <option value="All">All Types</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors shadow-sm cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {statusOptions.filter((s) => s !== 'All').map((s) => (
                <option key={s} value={s}>{formatStatus(s)}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* ── List View ── */}
        {viewMode === 'list' && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Patient
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Doctor
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Date
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Time
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Type
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedAppointments.length > 0 ? (
                    paginatedAppointments.map((apt) => (
                      <tr
                        key={apt.id}
                        className="hover:bg-teal-50/30 cursor-pointer transition-colors"
                        onClick={() => openDetailPanel(apt)}
                      >
                        {/* Patient */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shrink-0',
                                getAvatarColor(apt.patientFirstName)
                              )}
                            >
                              {getInitials(apt.patientFirstName, apt.patientLastName)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-700 truncate">
                                {apt.patientFirstName} {apt.patientLastName}
                              </p>
                              <p className="text-xs text-slate-400 truncate">{apt.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Doctor */}
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-medium text-slate-700">{apt.doctorName}</p>
                          <p className="text-xs text-slate-400">{apt.doctorSpecialty}</p>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-3.5 text-sm text-slate-600">
                          {formatDate(apt.date)}
                        </td>

                        {/* Time */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                            </span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                              getTypeBadgeColor(apt.type)
                            )}
                          >
                            {apt.type === 'Emergency' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {apt.type}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                              getStatusColor(apt.status)
                            )}
                          >
                            {React.createElement(getStatusIcon(apt.status), { className: 'h-3 w-3' })}
                            {formatStatus(apt.status)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetailPanel(apt);
                              }}
                              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-teal-600 hover:bg-teal-50 transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelAppointment(apt);
                              }}
                              disabled={apt.status === 'completed' || apt.status === 'cancelled'}
                              className={cn(
                                'inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                                apt.status === 'completed' || apt.status === 'cancelled'
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-red-600 hover:bg-red-50'
                              )}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Calendar className="h-10 w-10 text-slate-300 mb-3" />
                          <p className="text-sm font-medium text-slate-500">No appointments found</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredAppointments.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 bg-slate-50/30">
                <p className="text-xs text-slate-500">
                  Showing {(currentPage - 1) * pageSize + 1}&ndash;
                  {Math.min(currentPage * pageSize, filteredAppointments.length)} of{' '}
                  {filteredAppointments.length} appointments
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors',
                      currentPage === 1
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium transition-colors',
                        page === currentPage
                          ? 'border-teal-300 bg-teal-50 text-teal-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors',
                      currentPage === totalPages
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    )}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Calendar View ── */}
        {viewMode === 'calendar' && renderCalendarView()}
      </div>

      {/* ── Modals & Panels ── */}
      {showNewModal && renderNewAppointmentModal()}
      {showDetailPanel && renderDetailPanel()}
    </div>
  );
}

import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  CreditCard,
  DollarSign,
  FileText,
  Send,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Receipt,
  Calendar,
  User,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../lib/utils';

// --- Types ---

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  admissionId?: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdAt: string;
  notes: string;
  payments: Payment[];
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
}

// --- Mock Data ---

const mockPatients = [
  { id: 'P-2026-0001', name: 'Sarah Mitchell' },
  { id: 'P-2026-0002', name: 'Robert Yang' },
  { id: 'P-2026-0003', name: 'Maria Gonzalez' },
  { id: 'P-2026-0004', name: 'David Thompson' },
  { id: 'P-2026-0005', name: 'Emily Nakamura' },
  { id: 'P-2026-0006', name: 'James Okafor' },
  { id: 'P-2026-0007', name: 'Lisa Chen' },
  { id: 'P-2026-0008', name: 'Michael Rivera' },
];

const mockAdmissions = [
  { id: 'ADM-2026-001', patientId: 'P-2026-0001', label: 'ADM-2026-001 - Sarah Mitchell (General Ward, Rm 204)' },
  { id: 'ADM-2026-002', patientId: 'P-2026-0003', label: 'ADM-2026-002 - Maria Gonzalez (ICU, Rm 112)' },
  { id: 'ADM-2026-003', patientId: 'P-2026-0006', label: 'ADM-2026-003 - James Okafor (Cardiology, Rm 315)' },
];

const initialInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2026-0001',
    patientId: 'P-2026-0001',
    patientName: 'Sarah Mitchell',
    admissionId: 'ADM-2026-001',
    items: [
      { id: 'li1', description: 'General Consultation', quantity: 1, unitPrice: 150 },
      { id: 'li2', description: 'Blood Panel - CBC', quantity: 1, unitPrice: 85 },
      { id: 'li3', description: 'Chest X-Ray', quantity: 1, unitPrice: 220 },
    ],
    subtotal: 455,
    tax: 36.4,
    taxRate: 8,
    discount: 0,
    total: 491.4,
    status: 'paid',
    dueDate: '2026-04-30',
    createdAt: '2026-04-15',
    notes: 'Regular checkup and diagnostics.',
    payments: [
      { id: 'pay1', amount: 491.4, date: '2026-04-28', method: 'Insurance', reference: 'INS-98231' },
    ],
  },
  {
    id: '2',
    invoiceNumber: 'INV-2026-0002',
    patientId: 'P-2026-0003',
    patientName: 'Maria Gonzalez',
    admissionId: 'ADM-2026-002',
    items: [
      { id: 'li4', description: 'ICU Room Charge (3 days)', quantity: 3, unitPrice: 1200 },
      { id: 'li5', description: 'Cardiac Monitor Usage', quantity: 1, unitPrice: 450 },
      { id: 'li6', description: 'IV Fluids & Medication', quantity: 5, unitPrice: 32 },
      { id: 'li7', description: 'Physician Daily Visit', quantity: 3, unitPrice: 280 },
    ],
    subtotal: 5290,
    tax: 423.2,
    taxRate: 8,
    discount: 200,
    total: 5513.2,
    status: 'partially_paid',
    dueDate: '2026-05-20',
    createdAt: '2026-05-10',
    notes: 'ICU admission for cardiac monitoring.',
    payments: [
      { id: 'pay2', amount: 3000, date: '2026-05-12', method: 'Insurance', reference: 'INS-77412' },
    ],
  },
  {
    id: '3',
    invoiceNumber: 'INV-2026-0003',
    patientId: 'P-2026-0002',
    patientName: 'Robert Yang',
    items: [
      { id: 'li8', description: 'Cardiology Consultation', quantity: 1, unitPrice: 250 },
      { id: 'li9', description: 'ECG Test', quantity: 1, unitPrice: 180 },
      { id: 'li10', description: 'Echocardiogram', quantity: 1, unitPrice: 650 },
    ],
    subtotal: 1080,
    tax: 86.4,
    taxRate: 8,
    discount: 0,
    total: 1166.4,
    status: 'sent',
    dueDate: '2026-06-01',
    createdAt: '2026-05-08',
    notes: '',
    payments: [],
  },
  {
    id: '4',
    invoiceNumber: 'INV-2026-0004',
    patientId: 'P-2026-0004',
    patientName: 'David Thompson',
    items: [
      { id: 'li11', description: 'Orthopedic Consultation', quantity: 1, unitPrice: 200 },
      { id: 'li12', description: 'MRI Scan - Knee', quantity: 1, unitPrice: 1200 },
      { id: 'li13', description: 'Physical Therapy Session', quantity: 2, unitPrice: 150 },
    ],
    subtotal: 1700,
    tax: 136,
    taxRate: 8,
    discount: 50,
    total: 1786,
    status: 'overdue',
    dueDate: '2026-05-01',
    createdAt: '2026-04-10',
    notes: 'Follow-up for knee injury.',
    payments: [],
  },
  {
    id: '5',
    invoiceNumber: 'INV-2026-0005',
    patientId: 'P-2026-0005',
    patientName: 'Emily Nakamura',
    items: [
      { id: 'li14', description: 'Pediatric Consultation', quantity: 1, unitPrice: 120 },
      { id: 'li15', description: 'Vaccination - DTaP', quantity: 1, unitPrice: 45 },
    ],
    subtotal: 165,
    tax: 13.2,
    taxRate: 8,
    discount: 0,
    total: 178.2,
    status: 'draft',
    dueDate: '2026-06-15',
    createdAt: '2026-05-15',
    notes: 'Well-child visit and immunization.',
    payments: [],
  },
  {
    id: '6',
    invoiceNumber: 'INV-2026-0006',
    patientId: 'P-2026-0006',
    patientName: 'James Okafor',
    admissionId: 'ADM-2026-003',
    items: [
      { id: 'li16', description: 'Cardiology Ward (5 days)', quantity: 5, unitPrice: 800 },
      { id: 'li17', description: 'Stress Test', quantity: 1, unitPrice: 350 },
      { id: 'li18', description: 'Medication - Beta Blockers', quantity: 1, unitPrice: 120 },
      { id: 'li19', description: 'Physician Daily Visit', quantity: 5, unitPrice: 280 },
    ],
    subtotal: 5870,
    tax: 469.6,
    taxRate: 8,
    discount: 500,
    total: 5839.6,
    status: 'paid',
    dueDate: '2026-05-30',
    createdAt: '2026-05-01',
    notes: 'Post-surgical cardiac recovery.',
    payments: [
      { id: 'pay3', amount: 4000, date: '2026-05-10', method: 'Insurance', reference: 'INS-55234' },
      { id: 'pay4', amount: 1839.6, date: '2026-05-14', method: 'Credit Card', reference: 'CC-88912' },
    ],
  },
  {
    id: '7',
    invoiceNumber: 'INV-2026-0007',
    patientId: 'P-2026-0007',
    patientName: 'Lisa Chen',
    items: [
      { id: 'li20', description: 'Dermatology Consultation', quantity: 1, unitPrice: 175 },
      { id: 'li21', description: 'Skin Biopsy', quantity: 1, unitPrice: 320 },
      { id: 'li22', description: 'Pathology Lab Work', quantity: 1, unitPrice: 190 },
    ],
    subtotal: 685,
    tax: 54.8,
    taxRate: 8,
    discount: 0,
    total: 739.8,
    status: 'cancelled',
    dueDate: '2026-06-10',
    createdAt: '2026-05-05',
    notes: 'Cancelled by patient request.',
    payments: [],
  },
  {
    id: '8',
    invoiceNumber: 'INV-2026-0008',
    patientId: 'P-2026-0008',
    patientName: 'Michael Rivera',
    items: [
      { id: 'li23', description: 'Emergency Room Visit', quantity: 1, unitPrice: 500 },
      { id: 'li24', description: 'CT Scan - Abdomen', quantity: 1, unitPrice: 950 },
      { id: 'li25', description: 'IV Medication & Fluids', quantity: 2, unitPrice: 75 },
    ],
    subtotal: 1600,
    tax: 128,
    taxRate: 8,
    discount: 0,
    total: 1728,
    status: 'overdue',
    dueDate: '2026-04-25',
    createdAt: '2026-04-01',
    notes: 'Emergency admission for abdominal pain.',
    payments: [],
  },
];

// --- Helpers ---

function formatStatus(status: string) {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getBillingStatusColor(status: string) {
  const map: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-sky-100 text-sky-700',
    paid: 'bg-emerald-100 text-emerald-700',
    partially_paid: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-600',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}

function getStatusDot(status: string) {
  const map: Record<string, string> = {
    draft: 'bg-slate-400',
    sent: 'bg-sky-400',
    paid: 'bg-emerald-400',
    partially_paid: 'bg-amber-400',
    overdue: 'bg-red-400',
    cancelled: 'bg-gray-400',
  };
  return map[status] || 'bg-gray-400';
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// --- Component ---

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('this_month');
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New invoice form state
  const [newPatientId, setNewPatientId] = useState('');
  const [newPatientSearch, setNewPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [newAdmissionId, setNewAdmissionId] = useState('');
  const [newLineItems, setNewLineItems] = useState<LineItem[]>([
    { id: generateId(), description: '', quantity: 1, unitPrice: 0 },
  ]);
  const [newTaxRate, setNewTaxRate] = useState(8);
  const [newDiscount, setNewDiscount] = useState(0);
  const [newDueDate, setNewDueDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      searchQuery === '' ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);
  const pendingPayments = invoices
    .filter((i) => i.status === 'sent' || i.status === 'partially_paid')
    .reduce((sum, i) => sum + i.total - i.payments.reduce((s, p) => s + p.amount, 0), 0);
  const paidThisMonth = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.payments.reduce((s, p) => s + p.amount, 0), 0);
  const overdueCount = invoices.filter((i) => i.status === 'overdue').length;

  // New invoice calculations
  const newSubtotal = newLineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const newTax = newSubtotal * (newTaxRate / 100);
  const newTotal = newSubtotal + newTax - newDiscount;

  const handleAddLineItem = () => {
    setNewLineItems([...newLineItems, { id: generateId(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveLineItem = (id: string) => {
    if (newLineItems.length <= 1) return;
    setNewLineItems(newLineItems.filter((item) => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setNewLineItems(
      newLineItems.map((item) => {
        if (item.id !== id) return item;
        if (field === 'quantity' || field === 'unitPrice') {
          return { ...item, [field]: Number(value) || 0 };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const handleCreateInvoice = () => {
    if (!newPatientId || newLineItems.every((li) => !li.description)) return;
    const patient = mockPatients.find((p) => p.id === newPatientId);
    const invoiceCount = invoices.length + 1;
    const invoiceNumber = `INV-2026-${String(invoiceCount).padStart(4, '0')}`;
    const newInvoice: Invoice = {
      id: generateId(),
      invoiceNumber,
      patientId: newPatientId,
      patientName: patient?.name || 'Unknown',
      admissionId: newAdmissionId || undefined,
      items: newLineItems.map((li) => ({ ...li })),
      subtotal: newSubtotal,
      tax: newTax,
      taxRate: newTaxRate,
      discount: newDiscount,
      total: newTotal,
      status: 'draft',
      dueDate: newDueDate,
      createdAt: new Date().toISOString().split('T')[0],
      notes: newNotes,
      payments: [],
    };
    setInvoices([newInvoice, ...invoices]);
    resetNewInvoiceForm();
    setShowNewInvoiceModal(false);
  };

  const resetNewInvoiceForm = () => {
    setNewPatientId('');
    setNewPatientSearch('');
    setShowPatientDropdown(false);
    setNewAdmissionId('');
    setNewLineItems([{ id: generateId(), description: '', quantity: 1, unitPrice: 0 }]);
    setNewTaxRate(8);
    setNewDiscount(0);
    setNewDueDate('');
    setNewNotes('');
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    setInvoices(
      invoices.map((i) =>
        i.id === invoice.id
          ? {
              ...i,
              status: 'paid' as const,
              payments: [
                ...i.payments,
                { id: generateId(), amount: i.total - i.payments.reduce((s, p) => s + p.amount, 0), date: new Date().toISOString().split('T')[0], method: 'Manual', reference: 'MANUAL-' + generateId() },
              ],
            }
          : i
      )
    );
    setSelectedInvoice(null);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    setInvoices(
      invoices.map((i) => (i.id === invoice.id ? { ...i, status: 'sent' as const } : i))
    );
    setSelectedInvoice(null);
  };

  const filteredPatients = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(newPatientSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(newPatientSearch.toLowerCase())
  );

  const patientAdmissions = newAdmissionId
    ? mockAdmissions.filter((a) => a.patientId === newPatientId)
    : newPatientId
    ? mockAdmissions.filter((a) => a.patientId === newPatientId)
    : [];

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      colorClass: 'text-teal-600',
      bgClass: 'bg-teal-50',
      iconBgClass: 'bg-teal-100',
    },
    {
      label: 'Pending Payments',
      value: formatCurrency(pendingPayments),
      icon: CreditCard,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50',
      iconBgClass: 'bg-amber-100',
    },
    {
      label: 'Paid This Month',
      value: formatCurrency(paidThisMonth),
      icon: CheckCircle2,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50',
      iconBgClass: 'bg-emerald-100',
    },
    {
      label: 'Overdue Invoices',
      value: String(overdueCount),
      icon: AlertCircle,
      colorClass: overdueCount > 0 ? 'text-red-600' : 'text-slate-600',
      bgClass: overdueCount > 0 ? 'bg-red-50' : 'bg-slate-50',
      iconBgClass: overdueCount > 0 ? 'bg-red-100' : 'bg-slate-100',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Billing & Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage invoices, track payments, and monitor revenue
          </p>
        </div>
        <button
          onClick={() => setShowNewInvoiceModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          New Invoice
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
              placeholder="Search by invoice number or patient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
            >
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Invoice #
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Patient
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Items
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Subtotal
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Tax
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Due Date
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center">
                    <FileText className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-2 text-sm font-medium text-slate-500">No invoices found</p>
                    <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <td className="px-5 py-3.5 text-sm font-semibold text-teal-700 whitespace-nowrap">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700 shrink-0">
                          {invoice.patientName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                          {invoice.patientName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center text-sm text-slate-500">
                      {invoice.items.length}
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-slate-600 whitespace-nowrap">
                      {formatCurrency(invoice.subtotal)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-slate-500 whitespace-nowrap">
                      {formatCurrency(invoice.tax)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-800 whitespace-nowrap">
                      {formatCurrency(invoice.total)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                          getBillingStatusColor(invoice.status)
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', getStatusDot(invoice.status))} />
                        {formatStatus(invoice.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-5 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                          title="View Invoice"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Table Footer */}
        <div className="border-t border-slate-100 bg-slate-50/30 px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </p>
          <p className="text-xs font-medium text-slate-500">
            Total: {formatCurrency(filteredInvoices.reduce((sum, i) => sum + i.total, 0))}
          </p>
        </div>
      </div>

      {/* ====================== */}
      {/* New Invoice Modal      */}
      {/* ====================== */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-8 pb-8">
          <div
            className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Create New Invoice</h2>
                <p className="mt-0.5 text-xs text-slate-400">Fill in the details to generate a new invoice</p>
              </div>
              <button
                onClick={() => { resetNewInvoiceForm(); setShowNewInvoiceModal(false); }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Patient Select */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Patient <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search patients by name or ID..."
                    value={newPatientSearch}
                    onChange={(e) => {
                      setNewPatientSearch(e.target.value);
                      setShowPatientDropdown(true);
                    }}
                    onFocus={() => setShowPatientDropdown(true)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                  {newPatientId && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-teal-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Selected: {mockPatients.find((p) => p.id === newPatientId)?.name} ({newPatientId})
                    </div>
                  )}
                  {showPatientDropdown && filteredPatients.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-48 overflow-y-auto">
                      {filteredPatients.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => {
                            setNewPatientId(patient.id);
                            setNewPatientSearch(patient.name);
                            setShowPatientDropdown(false);
                            setNewAdmissionId('');
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 transition-colors"
                        >
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">{patient.name}</span>
                          <span className="ml-auto text-xs text-slate-400">{patient.id}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Admission Link */}
              {newPatientId && patientAdmissions.length > 0 && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Link to Admission <span className="text-xs text-slate-400">(optional)</span>
                  </label>
                  <select
                    value={newAdmissionId}
                    onChange={(e) => setNewAdmissionId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">No linked admission</option>
                    {patientAdmissions.map((adm) => (
                      <option key={adm.id} value={adm.id}>
                        {adm.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700">
                    Line Items <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Item
                  </button>
                </div>
                <div className="space-y-2.5">
                  {/* Header row */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-2 px-1">
                    <span className="col-span-5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Description</span>
                    <span className="col-span-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 text-center">Qty</span>
                    <span className="col-span-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 text-center">Unit Price</span>
                    <span className="col-span-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 text-right">Amount</span>
                    <span className="col-span-1"></span>
                  </div>
                  {newLineItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center rounded-lg border border-slate-100 bg-slate-50/50 p-3"
                    >
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                          className="w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                          className="w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-sm text-slate-700 text-center focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.unitPrice}
                          onChange={(e) => handleLineItemChange(item.id, 'unitPrice', e.target.value)}
                          className="w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-sm text-slate-700 text-center focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2 text-right">
                        <span className="text-sm font-semibold text-slate-700">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </span>
                      </div>
                      <div className="sm:col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          disabled={newLineItems.length <= 1}
                          className={cn(
                            'rounded-md p-1.5 transition-colors',
                            newLineItems.length <= 1
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-400 hover:bg-red-50 hover:text-red-500'
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-700">{formatCurrency(newSubtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Tax</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={newTaxRate}
                        onChange={(e) => setNewTaxRate(Number(e.target.value) || 0)}
                        className="w-16 rounded-md border border-slate-200 bg-white py-1 px-2 text-xs text-slate-700 text-center focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-100"
                      />
                      <span className="text-xs text-slate-400">%</span>
                    </div>
                    <span className="font-medium text-slate-700">{formatCurrency(newTax)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Discount</span>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={newDiscount}
                          onChange={(e) => setNewDiscount(Number(e.target.value) || 0)}
                          className="w-20 rounded-md border border-slate-200 bg-white py-1 pl-5 pr-2 text-xs text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-100"
                        />
                      </div>
                    </div>
                    <span className="font-medium text-red-600">-{formatCurrency(newDiscount)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2.5 flex items-center justify-between">
                    <span className="text-base font-bold text-slate-800">Total</span>
                    <span className="text-lg font-bold text-teal-700">{formatCurrency(newTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes <span className="text-xs text-slate-400">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Add any additional notes or comments..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => { resetNewInvoiceForm(); setShowNewInvoiceModal(false); }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                disabled={!newPatientId || newLineItems.every((li) => !li.description)}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                  !newPatientId || newLineItems.every((li) => !li.description)
                    ? 'bg-teal-300 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Create Invoice
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* Invoice Detail Modal   */}
      {/* ====================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-8 pb-8">
          <div
            className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-800">Invoice Details</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Invoice Content */}
            <div className="px-6 py-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 rounded-xl border border-slate-100 bg-gradient-to-br from-teal-50 to-slate-50 p-5">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600">
                      <Receipt className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-teal-800">MedCore HMS</span>
                  </div>
                  <p className="text-xs text-slate-500">123 Healthcare Blvd, Suite 400</p>
                  <p className="text-xs text-slate-500">New York, NY 10001</p>
                  <p className="text-xs text-slate-500">Tax ID: 12-3456789</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold text-slate-800">{selectedInvoice.invoiceNumber}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Issued: {formatDate(selectedInvoice.createdAt)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Due: {formatDate(selectedInvoice.dueDate)}
                  </p>
                  <div className="mt-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                        getBillingStatusColor(selectedInvoice.status)
                      )}
                    >
                      <span className={cn('h-1.5 w-1.5 rounded-full', getStatusDot(selectedInvoice.status))} />
                      {formatStatus(selectedInvoice.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Bill To
                </h4>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
                    {selectedInvoice.patientName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{selectedInvoice.patientName}</p>
                    <p className="text-xs text-slate-500">{selectedInvoice.patientId}</p>
                    {selectedInvoice.admissionId && (
                      <p className="text-xs text-teal-600">Admission: {selectedInvoice.admissionId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                  Items
                </h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Description</th>
                        <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">Qty</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">Unit Price</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2.5 text-sm text-slate-700">{item.description}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600 text-center">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600 text-right">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-4 py-2.5 text-sm font-medium text-slate-800 text-right">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-3 flex justify-end">
                  <div className="w-full sm:w-72 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-medium text-slate-700">{formatCurrency(selectedInvoice.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Tax ({selectedInvoice.taxRate}%)</span>
                      <span className="font-medium text-slate-700">{formatCurrency(selectedInvoice.tax)}</span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Discount</span>
                        <span className="font-medium text-red-600">-{formatCurrency(selectedInvoice.discount)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                      <span className="text-base font-bold text-slate-800">Total</span>
                      <span className="text-lg font-bold text-teal-700">{formatCurrency(selectedInvoice.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status & History */}
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                  Payment History
                </h4>
                {selectedInvoice.payments.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <CreditCard className="h-4 w-4" />
                    No payments recorded
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedInvoice.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between rounded-md border border-slate-100 bg-white p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {payment.method} - {payment.reference}
                          </p>
                        </div>
                        <span className="text-xs text-slate-500">{formatDate(payment.date)}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Remaining Balance</span>
                      <span className="text-sm font-bold text-slate-800">
                        {formatCurrency(
                          selectedInvoice.total -
                            selectedInvoice.payments.reduce((s, p) => s + p.amount, 0)
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                    Notes
                  </h4>
                  <p className="text-sm text-slate-600">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer - Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
              {selectedInvoice.status === 'draft' && (
                <button
                  onClick={() => handleSendInvoice(selectedInvoice)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send
                </button>
              )}
              {(selectedInvoice.status === 'sent' ||
                selectedInvoice.status === 'partially_paid' ||
                selectedInvoice.status === 'overdue') && (
                <button
                  onClick={() => handleMarkAsPaid(selectedInvoice)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark as Paid
                </button>
              )}
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

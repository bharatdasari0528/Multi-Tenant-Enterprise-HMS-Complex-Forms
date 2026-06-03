import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  FlaskConical,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  User,
  TestTube,
  Activity,
  FileText,
} from 'lucide-react';
import { cn, formatCurrency, formatDateTime } from '../lib/utils';

// --- Types ---

type LabOrderStatus = 'ordered' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
type CatalogStatus = 'active' | 'inactive';
type ResultStatus = 'Normal' | 'Abnormal' | 'Critical';

interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  testCode: string;
  orderedBy: string;
  orderedAt: string;
  status: LabOrderStatus;
  completedAt: string | null;
  results: LabResult[] | null;
  notes: string;
}

interface LabResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: ResultStatus;
}

interface TestCatalogItem {
  id: string;
  name: string;
  code: string;
  category: string;
  sampleType: string;
  price: number;
  turnaroundHours: number;
  status: CatalogStatus;
}

// --- Mock Data ---

const mockLabResults: Record<string, LabResult[]> = {
  'LB-2026-001': [
    { parameter: 'WBC', value: '11.2', unit: 'x10^3/uL', referenceRange: '4.5 - 11.0', status: 'Abnormal' },
    { parameter: 'RBC', value: '4.8', unit: 'x10^6/uL', referenceRange: '4.5 - 5.5', status: 'Normal' },
    { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.5 - 17.5', status: 'Normal' },
    { parameter: 'Hematocrit', value: '42.5', unit: '%', referenceRange: '38.0 - 50.0', status: 'Normal' },
    { parameter: 'Platelets', value: '295', unit: 'x10^3/uL', referenceRange: '150 - 400', status: 'Normal' },
  ],
  'LB-2026-003': [
    { parameter: 'Glucose', value: '245', unit: 'mg/dL', referenceRange: '70 - 100', status: 'Critical' },
    { parameter: 'HbA1c', value: '8.9', unit: '%', referenceRange: '4.0 - 6.0', status: 'Abnormal' },
    { parameter: 'BUN', value: '18', unit: 'mg/dL', referenceRange: '7 - 20', status: 'Normal' },
    { parameter: 'Creatinine', value: '1.0', unit: 'mg/dL', referenceRange: '0.6 - 1.2', status: 'Normal' },
    { parameter: 'Total Cholesterol', value: '220', unit: 'mg/dL', referenceRange: '< 200', status: 'Abnormal' },
  ],
  'LB-2026-005': [
    { parameter: 'TSH', value: '0.3', unit: 'mIU/L', referenceRange: '0.4 - 4.0', status: 'Abnormal' },
    { parameter: 'Free T4', value: '2.8', unit: 'ng/dL', referenceRange: '0.8 - 1.8', status: 'Critical' },
    { parameter: 'Free T3', value: '5.5', unit: 'pg/mL', referenceRange: '2.3 - 4.2', status: 'Abnormal' },
  ],
  'LB-2026-008': [
    { parameter: 'CRP', value: '48.5', unit: 'mg/L', referenceRange: '0 - 10', status: 'Critical' },
    { parameter: 'ESR', value: '55', unit: 'mm/hr', referenceRange: '0 - 20', status: 'Abnormal' },
    { parameter: 'Rheumatoid Factor', value: '15', unit: 'IU/mL', referenceRange: '0 - 20', status: 'Normal' },
    { parameter: 'ANA', value: 'Negative', unit: '', referenceRange: 'Negative', status: 'Normal' },
  ],
  'LB-2026-010': [
    { parameter: 'Hemoglobin', value: '7.1', unit: 'g/dL', referenceRange: '13.5 - 17.5', status: 'Critical' },
    { parameter: 'Ferritin', value: '8', unit: 'ng/mL', referenceRange: '20 - 200', status: 'Critical' },
    { parameter: 'MCV', value: '72', unit: 'fL', referenceRange: '80 - 100', status: 'Abnormal' },
    { parameter: 'TIBC', value: '520', unit: 'ug/dL', referenceRange: '250 - 370', status: 'Abnormal' },
    { parameter: 'Serum Iron', value: '25', unit: 'ug/dL', referenceRange: '60 - 170', status: 'Critical' },
  ],
};

const initialLabOrders: LabOrder[] = [
  {
    id: 'LB-2026-001',
    patientId: 'P-2026-0001',
    patientName: 'Sarah Mitchell',
    testName: 'Complete Blood Count',
    testCode: 'CBC-01',
    orderedBy: 'Dr. James Wilson',
    orderedAt: '2026-05-15T08:30:00',
    status: 'completed',
    completedAt: '2026-05-15T11:45:00',
    results: mockLabResults['LB-2026-001'],
    notes: 'Routine pre-operative workup',
  },
  {
    id: 'LB-2026-002',
    patientId: 'P-2026-0002',
    patientName: 'Robert Yang',
    testName: 'Lipid Panel',
    testCode: 'LIP-01',
    orderedBy: 'Dr. Emily Carter',
    orderedAt: '2026-05-15T09:15:00',
    status: 'processing',
    completedAt: null,
    results: null,
    notes: 'Fasting sample collected at 7:00 AM',
  },
  {
    id: 'LB-2026-003',
    patientId: 'P-2026-0005',
    patientName: 'Emily Nakamura',
    testName: 'Comprehensive Metabolic Panel',
    testCode: 'CMP-01',
    orderedBy: 'Dr. Sarah Kim',
    orderedAt: '2026-05-14T14:20:00',
    status: 'completed',
    completedAt: '2026-05-14T17:30:00',
    results: mockLabResults['LB-2026-003'],
    notes: 'Diabetes follow-up. Fasting sample required.',
  },
  {
    id: 'LB-2026-004',
    patientId: 'P-2026-0003',
    patientName: 'Maria Gonzalez',
    testName: 'Cardiac Enzymes Panel',
    testCode: 'CEP-01',
    orderedBy: 'Dr. James Wilson',
    orderedAt: '2026-05-15T06:45:00',
    status: 'sample_collected',
    completedAt: null,
    results: null,
    notes: 'Urgent - chest pain evaluation',
  },
  {
    id: 'LB-2026-005',
    patientId: 'P-2026-0007',
    patientName: 'Lisa Chen',
    testName: 'Thyroid Function Panel',
    testCode: 'TFP-01',
    orderedBy: 'Dr. Michael Brown',
    orderedAt: '2026-05-13T10:00:00',
    status: 'completed',
    completedAt: '2026-05-14T09:20:00',
    results: mockLabResults['LB-2026-005'],
    notes: 'Suspected hyperthyroidism',
  },
  {
    id: 'LB-2026-006',
    patientId: 'P-2026-0004',
    patientName: 'David Thompson',
    testName: 'Urinalysis',
    testCode: 'UA-01',
    orderedBy: 'Dr. Lisa Patel',
    orderedAt: '2026-05-15T07:30:00',
    status: 'ordered',
    completedAt: null,
    results: null,
    notes: 'Routine check - post knee surgery',
  },
  {
    id: 'LB-2026-007',
    patientId: 'P-2026-0006',
    patientName: 'James Okafor',
    testName: 'HbA1c',
    testCode: 'HBA1C-01',
    orderedBy: 'Dr. Sarah Kim',
    orderedAt: '2026-05-15T10:45:00',
    status: 'ordered',
    completedAt: null,
    results: null,
    notes: 'Diabetes management - quarterly check',
  },
  {
    id: 'LB-2026-008',
    patientId: 'P-2026-0009',
    patientName: 'Anna Kowalski',
    testName: 'Inflammatory Markers Panel',
    testCode: 'IMP-01',
    orderedBy: 'Dr. Emily Carter',
    orderedAt: '2026-05-12T11:00:00',
    status: 'completed',
    completedAt: '2026-05-13T14:15:00',
    results: mockLabResults['LB-2026-008'],
    notes: 'Autoimmune workup for joint pain',
  },
  {
    id: 'LB-2026-009',
    patientId: 'P-2026-0010',
    patientName: 'Thomas Wright',
    testName: 'Liver Function Panel',
    testCode: 'LFP-01',
    orderedBy: 'Dr. James Wilson',
    orderedAt: '2026-05-15T11:30:00',
    status: 'sample_collected',
    completedAt: null,
    results: null,
    notes: 'Pre-treatment baseline for new medication',
  },
  {
    id: 'LB-2026-010',
    patientId: 'P-2026-0011',
    patientName: 'Priya Sharma',
    testName: 'Iron Studies',
    testCode: 'IS-01',
    orderedBy: 'Dr. Lisa Patel',
    orderedAt: '2026-05-14T09:00:00',
    status: 'completed',
    completedAt: '2026-05-15T10:00:00',
    results: mockLabResults['LB-2026-010'],
    notes: 'Severe fatigue and pallor - check for anemia',
  },
  {
    id: 'LB-2026-011',
    patientId: 'P-2026-0008',
    patientName: 'Michael Rivera',
    testName: 'Blood Culture',
    testCode: 'BC-01',
    orderedBy: 'Dr. Michael Brown',
    orderedAt: '2026-05-14T16:00:00',
    status: 'processing',
    completedAt: null,
    results: null,
    notes: 'Fever of unknown origin - 48hr culture',
  },
  {
    id: 'LB-2026-012',
    patientId: 'P-2026-0012',
    patientName: 'Carol Bennett',
    testName: 'COVID-19 PCR',
    testCode: 'CVD-01',
    orderedBy: 'Dr. Emily Carter',
    orderedAt: '2026-05-15T13:00:00',
    status: 'cancelled',
    completedAt: null,
    results: null,
    notes: 'Cancelled - patient declined testing',
  },
];

const initialTestCatalog: TestCatalogItem[] = [
  { id: 'tc1', name: 'Complete Blood Count', code: 'CBC-01', category: 'Hematology', sampleType: 'Whole Blood', price: 45.0, turnaroundHours: 2, status: 'active' },
  { id: 'tc2', name: 'Lipid Panel', code: 'LIP-01', category: 'Biochemistry', sampleType: 'Serum', price: 55.0, turnaroundHours: 4, status: 'active' },
  { id: 'tc3', name: 'Comprehensive Metabolic Panel', code: 'CMP-01', category: 'Biochemistry', sampleType: 'Serum', price: 85.0, turnaroundHours: 3, status: 'active' },
  { id: 'tc4', name: 'Cardiac Enzymes Panel', code: 'CEP-01', category: 'Biochemistry', sampleType: 'Serum', price: 95.0, turnaroundHours: 1, status: 'active' },
  { id: 'tc5', name: 'Thyroid Function Panel', code: 'TFP-01', category: 'Biochemistry', sampleType: 'Serum', price: 120.0, turnaroundHours: 6, status: 'active' },
  { id: 'tc6', name: 'Urinalysis', code: 'UA-01', category: 'Biochemistry', sampleType: 'Urine', price: 30.0, turnaroundHours: 1, status: 'active' },
  { id: 'tc7', name: 'HbA1c', code: 'HBA1C-01', category: 'Biochemistry', sampleType: 'Whole Blood', price: 40.0, turnaroundHours: 2, status: 'active' },
  { id: 'tc8', name: 'Inflammatory Markers Panel', code: 'IMP-01', category: 'Biochemistry', sampleType: 'Serum', price: 75.0, turnaroundHours: 3, status: 'active' },
  { id: 'tc9', name: 'Liver Function Panel', code: 'LFP-01', category: 'Biochemistry', sampleType: 'Serum', price: 65.0, turnaroundHours: 3, status: 'active' },
  { id: 'tc10', name: 'Iron Studies', code: 'IS-01', category: 'Hematology', sampleType: 'Serum', price: 70.0, turnaroundHours: 4, status: 'active' },
  { id: 'tc11', name: 'Blood Culture', code: 'BC-01', category: 'Microbiology', sampleType: 'Whole Blood', price: 150.0, turnaroundHours: 48, status: 'active' },
  { id: 'tc12', name: 'COVID-19 PCR', code: 'CVD-01', category: 'Microbiology', sampleType: 'Nasopharyngeal Swab', price: 85.0, turnaroundHours: 24, status: 'active' },
  { id: 'tc13', name: 'Tissue Biopsy Analysis', code: 'TBA-01', category: 'Pathology', sampleType: 'Tissue', price: 250.0, turnaroundHours: 72, status: 'active' },
  { id: 'tc14', name: 'Pap Smear', code: 'PS-01', category: 'Pathology', sampleType: 'Cervical Cells', price: 65.0, turnaroundHours: 48, status: 'active' },
  { id: 'tc15', name: 'Chest X-Ray', code: 'CXR-01', category: 'Imaging', sampleType: 'N/A', price: 120.0, turnaroundHours: 1, status: 'active' },
  { id: 'tc16', name: 'HIV Antibody Test', code: 'HIV-01', category: 'Serology', sampleType: 'Serum', price: 55.0, turnaroundHours: 4, status: 'active' },
  { id: 'tc17', name: 'Hepatitis B Panel', code: 'HBP-01', category: 'Serology', sampleType: 'Serum', price: 95.0, turnaroundHours: 6, status: 'active' },
  { id: 'tc18', name: 'Coagulation Panel', code: 'CP-01', category: 'Hematology', sampleType: 'Citrate Plasma', price: 80.0, turnaroundHours: 2, status: 'active' },
  { id: 'tc19', name: 'D-Dimer', code: 'DD-01', category: 'Hematology', sampleType: 'Citrate Plasma', price: 60.0, turnaroundHours: 2, status: 'inactive' },
  { id: 'tc20', name: 'Urine Culture', code: 'UC-01', category: 'Microbiology', sampleType: 'Urine', price: 75.0, turnaroundHours: 48, status: 'active' },
];

const MOCK_PATIENTS = [
  { id: 'P-2026-0001', name: 'Sarah Mitchell' },
  { id: 'P-2026-0002', name: 'Robert Yang' },
  { id: 'P-2026-0003', name: 'Maria Gonzalez' },
  { id: 'P-2026-0004', name: 'David Thompson' },
  { id: 'P-2026-0005', name: 'Emily Nakamura' },
  { id: 'P-2026-0006', name: 'James Okafor' },
  { id: 'P-2026-0007', name: 'Lisa Chen' },
  { id: 'P-2026-0008', name: 'Michael Rivera' },
  { id: 'P-2026-0009', name: 'Anna Kowalski' },
  { id: 'P-2026-0010', name: 'Thomas Wright' },
  { id: 'P-2026-0011', name: 'Priya Sharma' },
  { id: 'P-2026-0012', name: 'Carol Bennett' },
];

const MOCK_DOCTORS = [
  'Dr. James Wilson',
  'Dr. Emily Carter',
  'Dr. Michael Brown',
  'Dr. Sarah Kim',
  'Dr. Lisa Patel',
];

// --- Constants ---

const ORDER_STATUS_OPTIONS: LabOrderStatus[] = ['ordered', 'sample_collected', 'processing', 'completed', 'cancelled'];
const ORDER_STATUS_LABELS: Record<string, string> = {
  ordered: 'Ordered',
  sample_collected: 'Sample Collected',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const CATEGORIES = ['All', 'Hematology', 'Biochemistry', 'Microbiology', 'Pathology', 'Imaging', 'Serology'];
const SAMPLE_TYPES = ['Whole Blood', 'Serum', 'Plasma', 'Urine', 'Cervical Cells', 'Tissue', 'Nasopharyngeal Swab', 'Citrate Plasma', 'N/A'];
const CATALOG_STATUS_OPTIONS = ['All', 'Active', 'Inactive'];

// --- Helpers ---

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function getLabOrderStatusColor(status: string) {
  const map: Record<string, string> = {
    ordered: 'bg-blue-100 text-blue-800',
    sample_collected: 'bg-cyan-100 text-cyan-800',
    processing: 'bg-amber-100 text-amber-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
}

function getCatalogStatusColor(status: string) {
  const map: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800',
    inactive: 'bg-slate-100 text-slate-600',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
}

function getResultStatusColor(status: ResultStatus) {
  const map: Record<ResultStatus, string> = {
    Normal: 'bg-emerald-100 text-emerald-800',
    Abnormal: 'bg-amber-100 text-amber-800',
    Critical: 'bg-red-100 text-red-800',
  };
  return map[status];
}

function getResultRowHighlight(status: ResultStatus) {
  if (status === 'Critical') return 'bg-red-50/70';
  if (status === 'Abnormal') return 'bg-amber-50/70';
  return '';
}

function getNextStatus(current: LabOrderStatus): LabOrderStatus | null {
  const flow: LabOrderStatus[] = ['ordered', 'sample_collected', 'processing', 'completed'];
  const idx = flow.indexOf(current);
  if (idx === -1 || idx === flow.length - 1) return null;
  return flow[idx + 1];
}

// --- Component ---

export default function Laboratory() {
  const [labOrders, setLabOrders] = useState<LabOrder[]>(initialLabOrders);
  const [testCatalog, setTestCatalog] = useState<TestCatalogItem[]>(initialTestCatalog);
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog'>('orders');

  // Lab Orders filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Test Catalog filters
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('All');
  const [catalogStatusFilter, setCatalogStatusFilter] = useState('All');

  // Modals
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [editingTest, setEditingTest] = useState<TestCatalogItem | null>(null);

  // Add Test form state
  const [testFormName, setTestFormName] = useState('');
  const [testFormCode, setTestFormCode] = useState('');
  const [testFormCategory, setTestFormCategory] = useState('Hematology');
  const [testFormSampleType, setTestFormSampleType] = useState('Whole Blood');
  const [testFormPrice, setTestFormPrice] = useState(0);
  const [testFormTurnaround, setTestFormTurnaround] = useState(1);
  const [testFormStatus, setTestFormStatus] = useState<CatalogStatus>('active');

  // New Lab Order form state
  const [orderFormPatientSearch, setOrderFormPatientSearch] = useState('');
  const [orderFormPatientId, setOrderFormPatientId] = useState('');
  const [orderFormTestId, setOrderFormTestId] = useState('');
  const [orderFormDoctor, setOrderFormDoctor] = useState('');
  const [orderFormNotes, setOrderFormNotes] = useState('');

  // Pagination
  const [orderPage, setOrderPage] = useState(1);
  const [catalogPage, setCatalogPage] = useState(1);
  const orderPageSize = 8;
  const catalogPageSize = 8;

  // --- Computed Stats ---
  const totalTests = testCatalog.length;
  const ordersToday = labOrders.filter(
    (o) => o.orderedAt.startsWith('2026-05-15')
  ).length;
  const pendingResults = labOrders.filter(
    (o) => o.status === 'ordered' || o.status === 'sample_collected' || o.status === 'processing'
  ).length;
  const completedToday = labOrders.filter(
    (o) => o.status === 'completed' && o.completedAt && o.completedAt.startsWith('2026-05-15')
  ).length;

  // --- Filtered Lab Orders ---
  const filteredOrders = labOrders.filter((o) => {
    const matchesSearch =
      orderSearch === '' ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.patientName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.testName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.orderedBy.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus =
      orderStatusFilter === 'All' || o.status === orderStatusFilter.toLowerCase().replace(' ', '_');
    return matchesSearch && matchesStatus;
  });

  const orderTotalPages = Math.ceil(filteredOrders.length / orderPageSize);
  const paginatedOrders = filteredOrders.slice((orderPage - 1) * orderPageSize, orderPage * orderPageSize);

  // --- Filtered Test Catalog ---
  const filteredCatalog = testCatalog.filter((t) => {
    const matchesSearch =
      catalogSearch === '' ||
      t.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      t.code.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCategory =
      catalogCategoryFilter === 'All' || t.category === catalogCategoryFilter;
    const matchesStatus =
      catalogStatusFilter === 'All' || t.status === catalogStatusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const catalogTotalPages = Math.ceil(filteredCatalog.length / catalogPageSize);
  const paginatedCatalog = filteredCatalog.slice((catalogPage - 1) * catalogPageSize, catalogPage * catalogPageSize);

  // --- Form Handlers ---
  const resetTestForm = () => {
    setTestFormName('');
    setTestFormCode('');
    setTestFormCategory('Hematology');
    setTestFormSampleType('Whole Blood');
    setTestFormPrice(0);
    setTestFormTurnaround(1);
    setTestFormStatus('active');
    setEditingTest(null);
  };

  const resetOrderForm = () => {
    setOrderFormPatientSearch('');
    setOrderFormPatientId('');
    setOrderFormTestId('');
    setOrderFormDoctor('');
    setOrderFormNotes('');
  };

  const openAddTestModal = () => {
    resetTestForm();
    setShowAddTestModal(true);
  };

  const openEditTestModal = (test: TestCatalogItem) => {
    setEditingTest(test);
    setTestFormName(test.name);
    setTestFormCode(test.code);
    setTestFormCategory(test.category);
    setTestFormSampleType(test.sampleType);
    setTestFormPrice(test.price);
    setTestFormTurnaround(test.turnaroundHours);
    setTestFormStatus(test.status);
    setShowAddTestModal(true);
  };

  const handleSaveTest = () => {
    if (!testFormName || !testFormCode) return;

    if (editingTest) {
      setTestCatalog(
        testCatalog.map((t) =>
          t.id === editingTest.id
            ? {
                ...t,
                name: testFormName,
                code: testFormCode,
                category: testFormCategory,
                sampleType: testFormSampleType,
                price: testFormPrice,
                turnaroundHours: testFormTurnaround,
                status: testFormStatus,
              }
            : t
        )
      );
    } else {
      const newTest: TestCatalogItem = {
        id: generateId(),
        name: testFormName,
        code: testFormCode,
        category: testFormCategory,
        sampleType: testFormSampleType,
        price: testFormPrice,
        turnaroundHours: testFormTurnaround,
        status: testFormStatus,
      };
      setTestCatalog([newTest, ...testCatalog]);
    }
    setShowAddTestModal(false);
    resetTestForm();
  };

  const handleToggleTestStatus = (test: TestCatalogItem) => {
    setTestCatalog(
      testCatalog.map((t) =>
        t.id === test.id
          ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' }
          : t
      )
    );
  };

  const handleUpdateOrderStatus = (orderId: string) => {
    setLabOrders(
      labOrders.map((o) => {
        if (o.id !== orderId) return o;
        const next = getNextStatus(o.status);
        if (!next) return o;
        return {
          ...o,
          status: next,
          completedAt: next === 'completed' ? new Date().toISOString() : null,
        };
      })
    );
  };

  const handleSubmitOrder = () => {
    if (!orderFormPatientId || !orderFormTestId || !orderFormDoctor) return;

    const patient = MOCK_PATIENTS.find((p) => p.id === orderFormPatientId);
    const test = testCatalog.find((t) => t.id === orderFormTestId);
    if (!patient || !test) return;

    const newOrder: LabOrder = {
      id: `LB-2026-${String(labOrders.length + 1).padStart(3, '0')}`,
      patientId: patient.id,
      patientName: patient.name,
      testName: test.name,
      testCode: test.code,
      orderedBy: orderFormDoctor,
      orderedAt: new Date().toISOString(),
      status: 'ordered',
      completedAt: null,
      results: null,
      notes: orderFormNotes,
    };

    setLabOrders([newOrder, ...labOrders]);
    setShowNewOrderModal(false);
    resetOrderForm();
  };

  const handleViewResults = (order: LabOrder) => {
    setSelectedOrder(order);
    setShowResultsModal(true);
  };

  const openNewOrderModal = () => {
    resetOrderForm();
    setShowNewOrderModal(true);
  };

  // --- Stats ---
  const stats = [
    {
      label: 'Total Tests',
      value: String(totalTests),
      icon: TestTube,
      colorClass: 'text-teal-600',
      iconBgClass: 'bg-teal-100',
    },
    {
      label: 'Orders Today',
      value: String(ordersToday),
      icon: FlaskConical,
      colorClass: 'text-cyan-600',
      iconBgClass: 'bg-cyan-100',
    },
    {
      label: 'Pending Results',
      value: String(pendingResults),
      icon: Clock,
      colorClass: pendingResults > 0 ? 'text-amber-600' : 'text-slate-500',
      iconBgClass: pendingResults > 0 ? 'bg-amber-100' : 'bg-slate-100',
    },
    {
      label: 'Completed Today',
      value: String(completedToday),
      icon: CheckCircle2,
      colorClass: completedToday > 0 ? 'text-emerald-600' : 'text-slate-500',
      iconBgClass: completedToday > 0 ? 'bg-emerald-100' : 'bg-slate-100',
    },
  ];

  // Filtered patients for order form
  const filteredPatients = MOCK_PATIENTS.filter((p) =>
    orderFormPatientSearch === '' ||
    p.name.toLowerCase().includes(orderFormPatientSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(orderFormPatientSearch.toLowerCase())
  );

  const activeCatalogTests = testCatalog.filter((t) => t.status === 'active');

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Laboratory</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage lab orders, test catalog, and view results
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openNewOrderModal}
            className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-700 shadow-sm hover:bg-teal-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <FileText className="h-4 w-4" />
            New Lab Order
          </button>
          <button
            onClick={openAddTestModal}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add Test
          </button>
        </div>
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

      {/* Tab Layout */}
      <div className="mb-4 border-b border-slate-200">
        <nav className="flex gap-6">
          <button
            onClick={() => { setActiveTab('orders'); setOrderPage(1); }}
            className={cn(
              'pb-3 text-sm font-semibold transition-colors border-b-2',
              activeTab === 'orders'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            )}
          >
            <span className="inline-flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Lab Orders
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('catalog'); setCatalogPage(1); }}
            className={cn(
              'pb-3 text-sm font-semibold transition-colors border-b-2',
              activeTab === 'catalog'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            )}
          >
            <span className="inline-flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test Catalog
            </span>
          </button>
        </nav>
      </div>

      {/* ====================== */}
      {/* Lab Orders Tab         */}
      {/* ====================== */}
      {activeTab === 'orders' && (
        <>
          {/* Filter Bar */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by order ID, patient, test, or doctor..."
                  value={orderSearch}
                  onChange={(e) => { setOrderSearch(e.target.value); setOrderPage(1); }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => { setOrderStatusFilter(e.target.value); setOrderPage(1); }}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  {ORDER_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={ORDER_STATUS_LABELS[s]}>{ORDER_STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lab Orders Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Order ID
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Patient
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Test Name
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Ordered By
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Ordered At
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Completed At
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center">
                        <FlaskConical className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-2 text-sm font-medium text-slate-500">No lab orders found</p>
                        <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={cn(
                          'hover:bg-slate-50/50 transition-colors',
                          order.status === 'cancelled' ? 'bg-red-50/30' : ''
                        )}
                      >
                        <td className="px-4 py-3.5 text-sm font-semibold text-teal-700 whitespace-nowrap">
                          {order.id}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700 shrink-0">
                              {order.patientName.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-700 whitespace-nowrap block">
                                {order.patientName}
                              </span>
                              <span className="text-xs text-slate-400">{order.patientId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div>
                            <span className="text-sm font-medium text-slate-700 block">{order.testName}</span>
                            <span className="text-xs text-slate-400">{order.testCode}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                          {order.orderedBy}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {formatDateTime(order.orderedAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                              getLabOrderStatusColor(order.status)
                            )}
                          >
                            {order.status === 'processing' && <Activity className="h-3 w-3" />}
                            {order.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                            {order.status === 'cancelled' && <AlertCircle className="h-3 w-3" />}
                            {ORDER_STATUS_LABELS[order.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-500 whitespace-nowrap">
                          {order.completedAt ? formatDateTime(order.completedAt) : '--'}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {order.status === 'completed' && order.results && (
                              <button
                                onClick={() => handleViewResults(order)}
                                className="rounded-md p-1.5 text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                                title="View Results"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            {getNextStatus(order.status) && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id)}
                                className="rounded-md p-1.5 text-slate-400 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                                title={`Update to ${ORDER_STATUS_LABELS[getNextStatus(order.status)!]}`}
                              >
                                <Activity className="h-4 w-4" />
                              </button>
                            )}
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
                Showing {paginatedOrders.length} of {filteredOrders.length} lab orders
              </p>
              {orderTotalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOrderPage(Math.max(1, orderPage - 1))}
                    disabled={orderPage === 1}
                    className={cn(
                      'rounded-md p-1.5 transition-colors',
                      orderPage === 1
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: orderTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setOrderPage(page)}
                      className={cn(
                        'h-8 w-8 rounded-md text-xs font-semibold transition-colors',
                        page === orderPage
                          ? 'bg-teal-600 text-white'
                          : 'text-slate-500 hover:bg-slate-100'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setOrderPage(Math.min(orderTotalPages, orderPage + 1))}
                    disabled={orderPage === orderTotalPages}
                    className={cn(
                      'rounded-md p-1.5 transition-colors',
                      orderPage === orderTotalPages
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
        </>
      )}

      {/* ====================== */}
      {/* Test Catalog Tab       */}
      {/* ====================== */}
      {activeTab === 'catalog' && (
        <>
          {/* Filter Bar */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by test name or code..."
                  value={catalogSearch}
                  onChange={(e) => { setCatalogSearch(e.target.value); setCatalogPage(1); }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  value={catalogCategoryFilter}
                  onChange={(e) => { setCatalogCategoryFilter(e.target.value); setCatalogPage(1); }}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={catalogStatusFilter}
                  onChange={(e) => { setCatalogStatusFilter(e.target.value); setCatalogPage(1); }}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                >
                  {CATALOG_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Test Catalog Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Test Name
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Code
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Category
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Sample Type
                    </th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Price
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Turnaround (hrs)
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCatalog.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center">
                        <TestTube className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-2 text-sm font-medium text-slate-500">No tests found</p>
                        <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedCatalog.map((test) => (
                      <tr
                        key={test.id}
                        className={cn(
                          'hover:bg-slate-50/50 transition-colors',
                          test.status === 'inactive' ? 'bg-slate-50/40' : ''
                        )}
                      >
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-800 whitespace-nowrap">
                          {test.name}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            {test.code}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
                            {test.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                          {test.sampleType}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-800 text-right whitespace-nowrap font-medium">
                          {formatCurrency(test.price)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-sm text-slate-700">{test.turnaroundHours}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                              getCatalogStatusColor(test.status)
                            )}
                          >
                            {test.status === 'active' && <CheckCircle2 className="h-3 w-3" />}
                            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditTestModal(test)}
                              className="rounded-md p-1.5 text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                              title="Edit Test"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleToggleTestStatus(test)}
                              className={cn(
                                'rounded-md p-1.5 transition-colors',
                                test.status === 'active'
                                  ? 'text-slate-400 hover:bg-red-50 hover:text-red-600'
                                  : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                              )}
                              title={test.status === 'active' ? 'Deactivate Test' : 'Activate Test'}
                            >
                              <Activity className="h-4 w-4" />
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
                Showing {paginatedCatalog.length} of {filteredCatalog.length} tests
              </p>
              {catalogTotalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCatalogPage(Math.max(1, catalogPage - 1))}
                    disabled={catalogPage === 1}
                    className={cn(
                      'rounded-md p-1.5 transition-colors',
                      catalogPage === 1
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: catalogTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCatalogPage(page)}
                      className={cn(
                        'h-8 w-8 rounded-md text-xs font-semibold transition-colors',
                        page === catalogPage
                          ? 'bg-teal-600 text-white'
                          : 'text-slate-500 hover:bg-slate-100'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCatalogPage(Math.min(catalogTotalPages, catalogPage + 1))}
                    disabled={catalogPage === catalogTotalPages}
                    className={cn(
                      'rounded-md p-1.5 transition-colors',
                      catalogPage === catalogTotalPages
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
        </>
      )}

      {/* ====================== */}
      {/* Add Test Modal         */}
      {/* ====================== */}
      {showAddTestModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-8 pb-8">
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingTest ? 'Edit Test' : 'Add Test'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {editingTest ? 'Update test catalog entry' : 'Add a new test to the catalog'}
                </p>
              </div>
              <button
                onClick={() => { resetTestForm(); setShowAddTestModal(false); }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Row: Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Complete Blood Count"
                    value={testFormName}
                    onChange={(e) => setTestFormName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CBC-01"
                    value={testFormCode}
                    onChange={(e) => setTestFormCode(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Row: Category & Sample Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={testFormCategory}
                    onChange={(e) => setTestFormCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Sample Type</label>
                  <select
                    value={testFormSampleType}
                    onChange={(e) => setTestFormSampleType(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                  >
                    {SAMPLE_TYPES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Row: Price & Turnaround */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Price ($)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={testFormPrice}
                    onChange={(e) => setTestFormPrice(Number(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Turnaround (hours)</label>
                  <input
                    type="number"
                    min={1}
                    value={testFormTurnaround}
                    onChange={(e) => setTestFormTurnaround(Number(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                <select
                  value={testFormStatus}
                  onChange={(e) => setTestFormStatus(e.target.value as CatalogStatus)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => { resetTestForm(); setShowAddTestModal(false); }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTest}
                disabled={!testFormName || !testFormCode}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                  !testFormName || !testFormCode
                    ? 'bg-teal-300 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  {editingTest ? 'Save Changes' : 'Add Test'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* New Lab Order Modal    */}
      {/* ====================== */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-8 pb-8">
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">New Lab Order</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Create a new laboratory test order for a patient
                </p>
              </div>
              <button
                onClick={() => { resetOrderForm(); setShowNewOrderModal(false); }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Patient Search/Select */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Patient <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by patient name or ID..."
                    value={orderFormPatientSearch}
                    onChange={(e) => setOrderFormPatientSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                {orderFormPatientId && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-teal-50 border border-teal-200 px-3 py-1.5">
                    <User className="h-4 w-4 text-teal-600" />
                    <span className="text-sm font-medium text-teal-800">
                      {MOCK_PATIENTS.find((p) => p.id === orderFormPatientId)?.name}
                    </span>
                    <span className="text-xs text-teal-600">({orderFormPatientId})</span>
                    <button
                      onClick={() => setOrderFormPatientId('')}
                      className="ml-1 text-teal-400 hover:text-teal-700"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {!orderFormPatientId && (
                  <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white">
                    {filteredPatients.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-slate-400">No patients found</p>
                    ) : (
                      filteredPatients.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => {
                            setOrderFormPatientId(patient.id);
                            setOrderFormPatientSearch('');
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left hover:bg-teal-50 transition-colors border-b border-slate-50 last:border-0"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 shrink-0">
                            {patient.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-700">{patient.name}</span>
                            <span className="ml-2 text-xs text-slate-400">{patient.id}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Test Selection */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Test <span className="text-red-500">*</span>
                </label>
                <select
                  value={orderFormTestId}
                  onChange={(e) => setOrderFormTestId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select a test...</option>
                  {activeCatalogTests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.name} ({test.code}) - {formatCurrency(test.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordering Doctor */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Ordering Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  value={orderFormDoctor}
                  onChange={(e) => setOrderFormDoctor(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select a doctor...</option>
                  {MOCK_DOCTORS.map((doc) => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Additional notes or instructions for the lab..."
                  value={orderFormNotes}
                  onChange={(e) => setOrderFormNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => { resetOrderForm(); setShowNewOrderModal(false); }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitOrder}
                disabled={!orderFormPatientId || !orderFormTestId || !orderFormDoctor}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                  !orderFormPatientId || !orderFormTestId || !orderFormDoctor
                    ? 'bg-teal-300 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" />
                  Submit Order
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* Results Modal          */}
      {/* ====================== */}
      {showResultsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-8 pb-8">
          <div
            className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Lab Results</h2>
                <p className="mt-0.5 text-xs text-slate-400">{selectedOrder.id} - {selectedOrder.testName}</p>
              </div>
              <button
                onClick={() => { setSelectedOrder(null); setShowResultsModal(false); }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Test & Patient Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                    Test Information
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <TestTube className="h-4 w-4 text-teal-600" />
                      <span className="text-sm font-semibold text-slate-800">{selectedOrder.testName}</span>
                    </div>
                    <p className="text-xs text-slate-500 ml-6">Code: {selectedOrder.testCode}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        Completed: {selectedOrder.completedAt ? formatDateTime(selectedOrder.completedAt) : '--'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                    Patient Information
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700 shrink-0">
                      {selectedOrder.patientName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{selectedOrder.patientName}</p>
                      <p className="text-xs text-slate-500">{selectedOrder.patientId}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Ordered by: {selectedOrder.orderedBy}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              {selectedOrder.results && selectedOrder.results.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                    Test Results
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Parameter</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Value</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Unit</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Reference Range</th>
                          <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedOrder.results.map((result, idx) => (
                          <tr
                            key={idx}
                            className={cn(
                              'hover:bg-slate-50/50 transition-colors',
                              getResultRowHighlight(result.status)
                            )}
                          >
                            <td className="px-4 py-3 text-sm font-medium text-slate-800 whitespace-nowrap">
                              {result.parameter}
                            </td>
                            <td className={cn(
                              'px-4 py-3 text-sm font-semibold whitespace-nowrap',
                              result.status === 'Critical' ? 'text-red-700' :
                              result.status === 'Abnormal' ? 'text-amber-700' :
                              'text-slate-800'
                            )}>
                              {result.value}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                              {result.unit}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                              {result.referenceRange}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                                  getResultStatusColor(result.status)
                                )}
                              >
                                {result.status === 'Critical' && <AlertCircle className="h-3 w-3" />}
                                {result.status === 'Abnormal' && <Activity className="h-3 w-3" />}
                                {result.status === 'Normal' && <CheckCircle2 className="h-3 w-3" />}
                                {result.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                    Notes
                  </h4>
                  <p className="text-sm text-slate-600">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => { setSelectedOrder(null); setShowResultsModal(false); }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

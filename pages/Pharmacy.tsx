import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Pill,
  AlertTriangle,
  Package,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  ShoppingCart,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../lib/utils';

// --- Types ---

interface Medication {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  unitPrice: number;
  stock: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
  status: 'available' | 'out_of_stock' | 'discontinued';
}

interface PrescriptionMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medications: PrescriptionMedication[];
  notes: string;
  status: 'active' | 'completed' | 'cancelled';
}

// --- Mock Data ---

const initialMedications: Medication[] = [
  {
    id: '1',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '500mg',
    manufacturer: 'PharmaCorp Inc.',
    unitPrice: 12.5,
    stock: 450,
    reorderLevel: 100,
    batchNumber: 'BTH-2026-0041',
    expiryDate: '2027-03-15',
    status: 'available',
  },
  {
    id: '2',
    name: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    category: 'Pain Relief',
    dosageForm: 'Tablet',
    strength: '400mg',
    manufacturer: 'MediRelief Ltd.',
    unitPrice: 8.75,
    stock: 320,
    reorderLevel: 80,
    batchNumber: 'BTH-2026-0056',
    expiryDate: '2027-06-20',
    status: 'available',
  },
  {
    id: '3',
    name: 'Metformin 500mg',
    genericName: 'Metformin HCl',
    category: 'Diabetes',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'GlucoHealth Pharma',
    unitPrice: 15.0,
    stock: 55,
    reorderLevel: 100,
    batchNumber: 'BTH-2026-0062',
    expiryDate: '2027-09-30',
    status: 'available',
  },
  {
    id: '4',
    name: 'Lisinopril 10mg',
    genericName: 'Lisinopril',
    category: 'Cardiac',
    dosageForm: 'Tablet',
    strength: '10mg',
    manufacturer: 'CardioMed Labs',
    unitPrice: 22.0,
    stock: 0,
    reorderLevel: 60,
    batchNumber: 'BTH-2025-0118',
    expiryDate: '2026-02-10',
    status: 'out_of_stock',
  },
  {
    id: '5',
    name: 'Salbutamol Inhaler',
    genericName: 'Salbutamol Sulfate',
    category: 'Respiratory',
    dosageForm: 'Inhaler',
    strength: '100mcg/dose',
    manufacturer: 'BreatheEasy Inc.',
    unitPrice: 35.0,
    stock: 28,
    reorderLevel: 50,
    batchNumber: 'BTH-2026-0078',
    expiryDate: '2027-12-01',
    status: 'available',
  },
  {
    id: '6',
    name: 'Aspirin 75mg',
    genericName: 'Acetylsalicylic Acid',
    category: 'Pain Relief',
    dosageForm: 'Tablet',
    strength: '75mg',
    manufacturer: 'MediRelief Ltd.',
    unitPrice: 5.25,
    stock: 890,
    reorderLevel: 200,
    batchNumber: 'BTH-2026-0089',
    expiryDate: '2028-01-15',
    status: 'available',
  },
  {
    id: '7',
    name: 'Atorvastatin 20mg',
    genericName: 'Atorvastatin Calcium',
    category: 'Cardiac',
    dosageForm: 'Tablet',
    strength: '20mg',
    manufacturer: 'CardioMed Labs',
    unitPrice: 28.5,
    stock: 40,
    reorderLevel: 80,
    batchNumber: 'BTH-2026-0095',
    expiryDate: '2027-08-22',
    status: 'available',
  },
  {
    id: '8',
    name: 'Ceftriaxone 1g',
    genericName: 'Ceftriaxone Sodium',
    category: 'Antibiotics',
    dosageForm: 'Injection',
    strength: '1g',
    manufacturer: 'PharmaCorp Inc.',
    unitPrice: 45.0,
    stock: 0,
    reorderLevel: 40,
    batchNumber: 'BTH-2025-0135',
    expiryDate: '2026-01-05',
    status: 'out_of_stock',
  },
  {
    id: '9',
    name: 'Vitamin D3 1000IU',
    genericName: 'Cholecalciferol',
    category: 'Vitamins',
    dosageForm: 'Capsule',
    strength: '1000IU',
    manufacturer: 'VitaHealth Corp.',
    unitPrice: 9.0,
    stock: 620,
    reorderLevel: 150,
    batchNumber: 'BTH-2026-0102',
    expiryDate: '2028-06-30',
    status: 'available',
  },
  {
    id: '10',
    name: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    category: 'Pain Relief',
    dosageForm: 'Capsule',
    strength: '20mg',
    manufacturer: 'GastroPharm Ltd.',
    unitPrice: 11.0,
    stock: 30,
    reorderLevel: 80,
    batchNumber: 'BTH-2026-0110',
    expiryDate: '2027-04-18',
    status: 'available',
  },
  {
    id: '11',
    name: 'Insulin Glargine',
    genericName: 'Insulin Glargine',
    category: 'Diabetes',
    dosageForm: 'Injection',
    strength: '100IU/mL',
    manufacturer: 'GlucoHealth Pharma',
    unitPrice: 85.0,
    stock: 15,
    reorderLevel: 30,
    batchNumber: 'BTH-2026-0118',
    expiryDate: '2027-01-20',
    status: 'available',
  },
  {
    id: '12',
    name: 'Chlorpheniramine 4mg',
    genericName: 'Chlorpheniramine Maleate',
    category: 'Respiratory',
    dosageForm: 'Tablet',
    strength: '4mg',
    manufacturer: 'BreatheEasy Inc.',
    unitPrice: 6.5,
    stock: 300,
    reorderLevel: 100,
    batchNumber: 'BTH-2026-0125',
    expiryDate: '2027-11-10',
    status: 'available',
  },
  {
    id: '13',
    name: 'Amlodipine 5mg',
    genericName: 'Amlodipine Besylate',
    category: 'Cardiac',
    dosageForm: 'Tablet',
    strength: '5mg',
    manufacturer: 'CardioMed Labs',
    unitPrice: 18.0,
    stock: 200,
    reorderLevel: 70,
    batchNumber: 'BTH-2026-0131',
    expiryDate: '2027-10-05',
    status: 'available',
  },
  {
    id: '14',
    name: 'Azithromycin 250mg',
    genericName: 'Azithromycin',
    category: 'Antibiotics',
    dosageForm: 'Tablet',
    strength: '250mg',
    manufacturer: 'PharmaCorp Inc.',
    unitPrice: 32.0,
    stock: 0,
    reorderLevel: 50,
    batchNumber: 'BTH-2025-0140',
    expiryDate: '2025-12-01',
    status: 'discontinued',
  },
  {
    id: '15',
    name: 'Vitamin B12 500mcg',
    genericName: 'Cyanocobalamin',
    category: 'Vitamins',
    dosageForm: 'Tablet',
    strength: '500mcg',
    manufacturer: 'VitaHealth Corp.',
    unitPrice: 7.5,
    stock: 480,
    reorderLevel: 120,
    batchNumber: 'BTH-2026-0148',
    expiryDate: '2028-03-25',
    status: 'available',
  },
];

const initialPrescriptions: Prescription[] = [
  {
    id: 'RX-2026-001',
    patientId: 'P-2026-0001',
    patientName: 'Sarah Mitchell',
    doctorId: 'D-2026-003',
    doctorName: 'Dr. Emily Carter',
    date: '2026-05-14',
    medications: [
      { name: 'Amoxicillin 500mg', dosage: '500mg', frequency: '3 times daily', duration: '7 days', instructions: 'Take after meals with water' },
      { name: 'Ibuprofen 400mg', dosage: '400mg', frequency: 'As needed', duration: '5 days', instructions: 'Take with food. Do not exceed 3 doses per day' },
    ],
    notes: 'Patient presenting with upper respiratory infection. Monitor for allergic reaction.',
    status: 'active',
  },
  {
    id: 'RX-2026-002',
    patientId: 'P-2026-0003',
    patientName: 'Maria Gonzalez',
    doctorId: 'D-2026-001',
    doctorName: 'Dr. James Wilson',
    date: '2026-05-12',
    medications: [
      { name: 'Lisinopril 10mg', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning. Monitor blood pressure regularly' },
      { name: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'Once daily at bedtime', duration: '30 days', instructions: 'Avoid grapefruit juice' },
      { name: 'Aspirin 75mg', dosage: '75mg', frequency: 'Once daily', duration: 'Ongoing', instructions: 'Take with food' },
    ],
    notes: 'Post-cardiac event medication regimen. Follow up in 2 weeks.',
    status: 'active',
  },
  {
    id: 'RX-2026-003',
    patientId: 'P-2026-0005',
    patientName: 'Emily Nakamura',
    doctorId: 'D-2026-004',
    doctorName: 'Dr. Sarah Kim',
    date: '2026-05-10',
    medications: [
      { name: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '90 days', instructions: 'Take with meals. Stay hydrated' },
      { name: 'Vitamin D3 1000IU', dosage: '1000IU', frequency: 'Once daily', duration: '90 days', instructions: 'Take with fatty meal for better absorption' },
    ],
    notes: 'Type 2 diabetes management. Diet and exercise plan recommended.',
    status: 'active',
  },
  {
    id: 'RX-2026-004',
    patientId: 'P-2026-0002',
    patientName: 'Robert Yang',
    doctorId: 'D-2026-001',
    doctorName: 'Dr. James Wilson',
    date: '2026-05-05',
    medications: [
      { name: 'Amlodipine 5mg', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning' },
    ],
    notes: 'Mild hypertension. Lifestyle modifications also recommended.',
    status: 'completed',
  },
  {
    id: 'RX-2026-005',
    patientId: 'P-2026-0006',
    patientName: 'James Okafor',
    doctorId: 'D-2026-002',
    doctorName: 'Dr. Michael Brown',
    date: '2026-05-08',
    medications: [
      { name: 'Insulin Glargine', dosage: '20IU', frequency: 'Once daily at bedtime', duration: '30 days', instructions: 'Subcutaneous injection. Rotate injection sites' },
      { name: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', instructions: 'Take with meals' },
    ],
    notes: 'Insulin-dependent diabetes. Blood glucose monitoring 4x daily.',
    status: 'active',
  },
  {
    id: 'RX-2026-006',
    patientId: 'P-2026-0004',
    patientName: 'David Thompson',
    doctorId: 'D-2026-005',
    doctorName: 'Dr. Lisa Patel',
    date: '2026-04-28',
    medications: [
      { name: 'Ibuprofen 400mg', dosage: '400mg', frequency: '3 times daily', duration: '10 days', instructions: 'Take with food' },
      { name: 'Omeprazole 20mg', dosage: '20mg', frequency: 'Once daily', duration: '14 days', instructions: 'Take 30 min before breakfast' },
    ],
    notes: 'Knee inflammation post-injury. Pain management schedule.',
    status: 'completed',
  },
  {
    id: 'RX-2026-007',
    patientId: 'P-2026-0008',
    patientName: 'Michael Rivera',
    doctorId: 'D-2026-003',
    doctorName: 'Dr. Emily Carter',
    date: '2026-04-15',
    medications: [
      { name: 'Azithromycin 250mg', dosage: '250mg', frequency: 'Once daily', duration: '5 days', instructions: 'Take on empty stomach' },
    ],
    notes: 'Patient cancelled follow-up. Prescription cancelled.',
    status: 'cancelled',
  },
  {
    id: 'RX-2026-008',
    patientId: 'P-2026-0007',
    patientName: 'Lisa Chen',
    doctorId: 'D-2026-004',
    doctorName: 'Dr. Sarah Kim',
    date: '2026-05-13',
    medications: [
      { name: 'Salbutamol Inhaler', dosage: '2 puffs', frequency: 'As needed', duration: 'Ongoing', instructions: 'Use with spacer. Maximum 8 puffs per day' },
      { name: 'Chlorpheniramine 4mg', dosage: '4mg', frequency: '3 times daily', duration: '7 days', instructions: 'May cause drowsiness. Avoid driving' },
    ],
    notes: 'Allergic rhinitis with mild asthma. Peak flow monitoring advised.',
    status: 'active',
  },
];

// --- Helpers ---

function formatMedStatus(status: string) {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getMedStatusColor(status: string) {
  const map: Record<string, string> = {
    available: 'bg-green-100 text-green-800',
    out_of_stock: 'bg-red-100 text-red-800',
    discontinued: 'bg-slate-100 text-slate-600',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}

function getRxStatusColor(status: string) {
  const map: Record<string, string> = {
    active: 'bg-teal-100 text-teal-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

const CATEGORIES = ['All', 'Antibiotics', 'Pain Relief', 'Cardiac', 'Diabetes', 'Respiratory', 'Vitamins'];
const MED_STATUS_OPTIONS = ['All', 'Available', 'Out of Stock', 'Discontinued'];
const RX_STATUS_OPTIONS = ['All', 'Active', 'Completed', 'Cancelled'];
const DOSAGE_FORMS = ['Tablet', 'Capsule', 'Injection', 'Inhaler', 'Syrup', 'Cream', 'Drops', 'Suppository'];

// --- Component ---

export default function Pharmacy() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [prescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [activeTab, setActiveTab] = useState<'medications' | 'prescriptions'>('medications');

  // Medication filters
  const [medSearch, setMedSearch] = useState('');
  const [medCategoryFilter, setMedCategoryFilter] = useState('All');
  const [medStatusFilter, setMedStatusFilter] = useState('All');

  // Prescription filters
  const [rxSearch, setRxSearch] = useState('');
  const [rxStatusFilter, setRxStatusFilter] = useState('All');

  // Modals
  const [showMedModal, setShowMedModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  // Medication form state
  const [formName, setFormName] = useState('');
  const [formGenericName, setFormGenericName] = useState('');
  const [formCategory, setFormCategory] = useState('Antibiotics');
  const [formDosageForm, setFormDosageForm] = useState('Tablet');
  const [formStrength, setFormStrength] = useState('');
  const [formManufacturer, setFormManufacturer] = useState('');
  const [formUnitPrice, setFormUnitPrice] = useState(0);
  const [formStock, setFormStock] = useState(0);
  const [formReorderLevel, setFormReorderLevel] = useState(0);
  const [formBatchNumber, setFormBatchNumber] = useState('');
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formStatus, setFormStatus] = useState<'available' | 'out_of_stock' | 'discontinued'>('available');

  // Medication pagination
  const [medPage, setMedPage] = useState(1);
  const medPageSize = 8;

  // Prescription pagination
  const [rxPage, setRxPage] = useState(1);
  const rxPageSize = 6;

  // --- Computed Stats ---
  const totalMedications = medications.length;
  const inStock = medications.filter((m) => m.stock > m.reorderLevel).length;
  const lowStock = medications.filter((m) => m.stock > 0 && m.stock <= m.reorderLevel).length;
  const outOfStock = medications.filter((m) => m.stock === 0).length;

  // --- Filtered Medications ---
  const filteredMeds = medications.filter((m) => {
    const matchesSearch =
      medSearch === '' ||
      m.name.toLowerCase().includes(medSearch.toLowerCase()) ||
      m.genericName.toLowerCase().includes(medSearch.toLowerCase());
    const matchesCategory = medCategoryFilter === 'All' || m.category === medCategoryFilter;
    const matchesStatus =
      medStatusFilter === 'All' ||
      m.status === medStatusFilter.toLowerCase().replace(' ', '_');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const medTotalPages = Math.ceil(filteredMeds.length / medPageSize);
  const paginatedMeds = filteredMeds.slice((medPage - 1) * medPageSize, medPage * medPageSize);

  // --- Filtered Prescriptions ---
  const filteredRx = prescriptions.filter((rx) => {
    const matchesSearch =
      rxSearch === '' ||
      rx.patientName.toLowerCase().includes(rxSearch.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(rxSearch.toLowerCase()) ||
      rx.id.toLowerCase().includes(rxSearch.toLowerCase());
    const matchesStatus = rxStatusFilter === 'All' || rx.status === rxStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const rxTotalPages = Math.ceil(filteredRx.length / rxPageSize);
  const paginatedRx = filteredRx.slice((rxPage - 1) * rxPageSize, rxPage * rxPageSize);

  // --- Form Handlers ---
  const resetMedForm = () => {
    setFormName('');
    setFormGenericName('');
    setFormCategory('Antibiotics');
    setFormDosageForm('Tablet');
    setFormStrength('');
    setFormManufacturer('');
    setFormUnitPrice(0);
    setFormStock(0);
    setFormReorderLevel(0);
    setFormBatchNumber('');
    setFormExpiryDate('');
    setFormStatus('available');
    setEditingMed(null);
  };

  const openAddMedModal = () => {
    resetMedForm();
    setShowMedModal(true);
  };

  const openEditMedModal = (med: Medication) => {
    setEditingMed(med);
    setFormName(med.name);
    setFormGenericName(med.genericName);
    setFormCategory(med.category);
    setFormDosageForm(med.dosageForm);
    setFormStrength(med.strength);
    setFormManufacturer(med.manufacturer);
    setFormUnitPrice(med.unitPrice);
    setFormStock(med.stock);
    setFormReorderLevel(med.reorderLevel);
    setFormBatchNumber(med.batchNumber);
    setFormExpiryDate(med.expiryDate);
    setFormStatus(med.status);
    setShowMedModal(true);
  };

  const handleSaveMed = () => {
    if (!formName || !formGenericName || !formStrength) return;

    if (editingMed) {
      setMedications(
        medications.map((m) =>
          m.id === editingMed.id
            ? {
                ...m,
                name: formName,
                genericName: formGenericName,
                category: formCategory,
                dosageForm: formDosageForm,
                strength: formStrength,
                manufacturer: formManufacturer,
                unitPrice: formUnitPrice,
                stock: formStock,
                reorderLevel: formReorderLevel,
                batchNumber: formBatchNumber,
                expiryDate: formExpiryDate,
                status: formStatus,
              }
            : m
        )
      );
    } else {
      const newMed: Medication = {
        id: generateId(),
        name: formName,
        genericName: formGenericName,
        category: formCategory,
        dosageForm: formDosageForm,
        strength: formStrength,
        manufacturer: formManufacturer,
        unitPrice: formUnitPrice,
        stock: formStock,
        reorderLevel: formReorderLevel,
        batchNumber: formBatchNumber,
        expiryDate: formExpiryDate,
        status: formStatus,
      };
      setMedications([newMed, ...medications]);
    }
    setShowMedModal(false);
    resetMedForm();
  };

  const handleRestock = (med: Medication) => {
    const newStock = med.stock + 100;
    setMedications(
      medications.map((m) =>
        m.id === med.id
          ? {
              ...m,
              stock: newStock,
              status: newStock > m.reorderLevel ? 'available' : m.status,
            }
          : m
      )
    );
  };

  // --- Stats ---
  const stats = [
    {
      label: 'Total Medications',
      value: String(totalMedications),
      icon: Pill,
      colorClass: 'text-teal-600',
      iconBgClass: 'bg-teal-100',
    },
    {
      label: 'In Stock',
      value: String(inStock),
      icon: Package,
      colorClass: 'text-emerald-600',
      iconBgClass: 'bg-emerald-100',
    },
    {
      label: 'Low Stock',
      value: String(lowStock),
      icon: AlertTriangle,
      colorClass: lowStock > 0 ? 'text-amber-600' : 'text-slate-500',
      iconBgClass: lowStock > 0 ? 'bg-amber-100' : 'bg-slate-100',
    },
    {
      label: 'Out of Stock',
      value: String(outOfStock),
      icon: ShoppingCart,
      colorClass: outOfStock > 0 ? 'text-red-600' : 'text-slate-500',
      iconBgClass: outOfStock > 0 ? 'bg-red-100' : 'bg-slate-100',
    },
  ];

  const getRowBackground = (med: Medication) => {
    if (med.stock === 0) return 'bg-red-50/60';
    if (med.stock > 0 && med.stock <= med.reorderLevel) return 'bg-amber-50/60';
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Pharmacy</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage medications, track inventory, and process prescriptions
          </p>
        </div>
        <button
          onClick={openAddMedModal}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add Medication
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

      {/* Tab Layout */}
      <div className="mb-4 border-b border-slate-200">
        <nav className="flex gap-6">
          <button
            onClick={() => { setActiveTab('medications'); setMedPage(1); }}
            className={cn(
              'pb-3 text-sm font-semibold transition-colors border-b-2',
              activeTab === 'medications'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            )}
          >
            <span className="inline-flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medications
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('prescriptions'); setRxPage(1); }}
            className={cn(
              'pb-3 text-sm font-semibold transition-colors border-b-2',
              activeTab === 'prescriptions'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            )}
          >
            <span className="inline-flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Prescriptions
            </span>
          </button>
        </nav>
      </div>

      {/* ====================== */}
      {/* Medications Tab        */}
      {/* ====================== */}
      {activeTab === 'medications' && (
        <>
          {/* Filter Bar */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by medication or generic name..."
                  value={medSearch}
                  onChange={(e) => { setMedSearch(e.target.value); setMedPage(1); }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  value={medCategoryFilter}
                  onChange={(e) => { setMedCategoryFilter(e.target.value); setMedPage(1); }}
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
                  value={medStatusFilter}
                  onChange={(e) => { setMedStatusFilter(e.target.value); setMedPage(1); }}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                >
                  {MED_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Medications Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Name
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Generic Name
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Category
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Dosage Form
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Strength
                    </th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Unit Price
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Stock
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Reorder Lvl
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
                  {paginatedMeds.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-5 py-12 text-center">
                        <Pill className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-2 text-sm font-medium text-slate-500">No medications found</p>
                        <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedMeds.map((med) => (
                      <tr
                        key={med.id}
                        className={cn(
                          'hover:bg-slate-50/50 transition-colors',
                          getRowBackground(med)
                        )}
                      >
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-800 whitespace-nowrap">
                          {med.name}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                          {med.genericName}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            {med.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                          {med.dosageForm}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                          {med.strength}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-800 text-right whitespace-nowrap font-medium">
                          {formatCurrency(med.unitPrice)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={cn(
                              'text-sm font-semibold',
                              med.stock === 0
                                ? 'text-red-600'
                                : med.stock <= med.reorderLevel
                                  ? 'text-amber-600'
                                  : 'text-slate-800'
                            )}
                          >
                            {med.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center text-sm text-slate-500">
                          {med.reorderLevel}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                              getMedStatusColor(med.status)
                            )}
                          >
                            {med.status === 'out_of_stock' && (
                              <ShoppingCart className="h-3 w-3" />
                            )}
                            {med.stock > 0 && med.stock <= med.reorderLevel && (
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                            )}
                            {formatMedStatus(med.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditMedModal(med)}
                              className="rounded-md p-1.5 text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                              title="Edit Medication"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRestock(med)}
                              className="rounded-md p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                              title="Restock (+100)"
                            >
                              <ShoppingCart className="h-4 w-4" />
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
                Showing {paginatedMeds.length} of {filteredMeds.length} medications
              </p>
              {medTotalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMedPage(Math.max(1, medPage - 1))}
                    disabled={medPage === 1}
                    className={cn(
                      'rounded-md p-1.5 transition-colors',
                      medPage === 1
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: medTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setMedPage(page)}
                      className={cn(
                        'h-8 w-8 rounded-md text-xs font-semibold transition-colors',
                        page === medPage
                          ? 'bg-teal-600 text-white'
                          : 'text-slate-500 hover:bg-slate-100'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setMedPage(Math.min(medTotalPages, medPage + 1))}
                    disabled={medPage === medTotalPages}
                    className={cn(
                      'rounded-md p-1.5 transition-colors',
                      medPage === medTotalPages
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
      {/* Prescriptions Tab      */}
      {/* ====================== */}
      {activeTab === 'prescriptions' && (
        <>
          {/* Filter Bar */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by patient, doctor, or prescription ID..."
                  value={rxSearch}
                  onChange={(e) => { setRxSearch(e.target.value); setRxPage(1); }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  value={rxStatusFilter}
                  onChange={(e) => { setRxStatusFilter(e.target.value); setRxPage(1); }}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                >
                  {RX_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Prescriptions Table */}
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
                    <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Medications
                    </th>
                    <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRx.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center">
                        <FileText className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-2 text-sm font-medium text-slate-500">No prescriptions found</p>
                        <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedRx.map((rx) => (
                      <tr
                        key={rx.id}
                        className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedRx(rx)}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700 shrink-0">
                              {rx.patientName.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-700 whitespace-nowrap block">
                                {rx.patientName}
                              </span>
                              <span className="text-xs text-slate-400">{rx.patientId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 shrink-0">
                              {rx.doctorName.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                            </div>
                            <span className="text-sm text-slate-700 whitespace-nowrap">{rx.doctorName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600 whitespace-nowrap">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {formatDate(rx.date)}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="inline-flex items-center justify-center h-7 min-w-[28px] rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-700">
                            {rx.medications.length}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                              getRxStatusColor(rx.status)
                            )}
                          >
                            {rx.status === 'active' && <Clock className="h-3 w-3" />}
                            {rx.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedRx(rx)}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                            title="View Prescription"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
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
                Showing {paginatedRx.length} of {filteredRx.length} prescriptions
              </p>
              {rxTotalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRxPage(Math.max(1, rxPage - 1))}
                    disabled={rxPage === 1}
                    className={cn(
                      'rounded-md p-1.5 transition-colors',
                      rxPage === 1
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: rxTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setRxPage(page)}
                      className={cn(
                        'h-8 w-8 rounded-md text-xs font-semibold transition-colors',
                        page === rxPage
                          ? 'bg-teal-600 text-white'
                          : 'text-slate-500 hover:bg-slate-100'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setRxPage(Math.min(rxTotalPages, rxPage + 1))}
                    disabled={rxPage === rxTotalPages}
                    className={cn(
                      'rounded-md p-1.5 transition-colors',
                      rxPage === rxTotalPages
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
      {/* Add/Edit Medication Modal */}
      {/* ====================== */}
      {showMedModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-8 pb-8">
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingMed ? 'Edit Medication' : 'Add Medication'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {editingMed ? 'Update medication details and inventory' : 'Enter details for the new medication'}
                </p>
              </div>
              <button
                onClick={() => { resetMedForm(); setShowMedModal(false); }}
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
              {/* Row: Name & Generic Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Amoxicillin 500mg"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Generic Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Amoxicillin"
                    value={formGenericName}
                    onChange={(e) => setFormGenericName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Row: Category & Dosage Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Dosage Form</label>
                  <select
                    value={formDosageForm}
                    onChange={(e) => setFormDosageForm(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                  >
                    {DOSAGE_FORMS.map((df) => (
                      <option key={df} value={df}>{df}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row: Strength & Manufacturer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Strength <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 500mg"
                    value={formStrength}
                    onChange={(e) => setFormStrength(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Manufacturer</label>
                  <input
                    type="text"
                    placeholder="e.g., PharmaCorp Inc."
                    value={formManufacturer}
                    onChange={(e) => setFormManufacturer(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Row: Unit Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Unit Price ($)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={formUnitPrice}
                    onChange={(e) => setFormUnitPrice(Number(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Reorder Level</label>
                  <input
                    type="number"
                    min={0}
                    value={formReorderLevel}
                    onChange={(e) => setFormReorderLevel(Number(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Row: Batch Number & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Batch Number</label>
                  <input
                    type="text"
                    placeholder="e.g., BTH-2026-0001"
                    value={formBatchNumber}
                    onChange={(e) => setFormBatchNumber(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Expiry Date</label>
                  <input
                    type="date"
                    value={formExpiryDate}
                    onChange={(e) => setFormExpiryDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'available' | 'out_of_stock' | 'discontinued')}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                >
                  <option value="available">Available</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => { resetMedForm(); setShowMedModal(false); }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMed}
                disabled={!formName || !formGenericName || !formStrength}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                  !formName || !formGenericName || !formStrength
                    ? 'bg-teal-300 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  {editingMed ? 'Save Changes' : 'Add Medication'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* Prescription Detail Modal */}
      {/* ====================== */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-8 pb-8">
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Prescription Details</h2>
                <p className="mt-0.5 text-xs text-slate-400">{selectedRx.id}</p>
              </div>
              <button
                onClick={() => setSelectedRx(null)}
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
              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                    Patient
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700 shrink-0">
                      {selectedRx.patientName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{selectedRx.patientName}</p>
                      <p className="text-xs text-slate-500">{selectedRx.patientId}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                    Prescribing Doctor
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 shrink-0">
                      {selectedRx.doctorName.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{selectedRx.doctorName}</p>
                      <p className="text-xs text-slate-500">{selectedRx.doctorId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Status */}
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-gradient-to-br from-teal-50 to-slate-50 p-4">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4.5 w-4.5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Date Prescribed</p>
                    <p className="text-sm font-semibold text-slate-800">{formatDate(selectedRx.date)}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize',
                    getRxStatusColor(selectedRx.status)
                  )}
                >
                  {selectedRx.status === 'active' && <Clock className="h-3.5 w-3.5" />}
                  {selectedRx.status}
                </span>
              </div>

              {/* Medications Table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                  Prescribed Medications
                </h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Name</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Dosage</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Frequency</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Duration</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRx.medications.map((med, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2.5 text-sm font-medium text-slate-800 whitespace-nowrap">
                            {med.name}
                          </td>
                          <td className="px-4 py-2.5 text-sm text-slate-600 whitespace-nowrap">{med.dosage}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600 whitespace-nowrap">{med.frequency}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600 whitespace-nowrap">{med.duration}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-500">{med.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              {selectedRx.notes && (
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                    Notes
                  </h4>
                  <p className="text-sm text-slate-600">{selectedRx.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer - Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
              {selectedRx.status === 'active' && (
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Dispense
                </button>
              )}
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                Print
              </button>
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition-colors"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

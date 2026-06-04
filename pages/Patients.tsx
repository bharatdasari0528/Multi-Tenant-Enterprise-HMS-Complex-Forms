import { useState } from 'react';
import { useAuth } from '../lib/auth';
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  Droplets,
  Calendar,
  FileText,
  Activity,
  Edit,
  BedDouble,
  X,
  ArrowLeft,
  Heart,
  AlertCircle,
  Shield,
  ClipboardList,
} from 'lucide-react';
import { cn, formatDate, getInitials } from '../lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  bloodGroup: string;
  status: 'active' | 'admitted' | 'discharged' | 'deceased';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  medicalHistory: string;
  allergies: string[];
  currentMedications: string[];
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  createdAt: string;
  lastVisit: string;
}

interface NewPatientForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  medicalHistory: string;
  allergies: string;
  currentMedications: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockPatients: Patient[] = [
  {
    id: '1',
    patientId: 'P-2026-0001',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    dateOfBirth: '1985-03-14',
    gender: 'Female',
    phone: '(555) 234-5678',
    email: 'sarah.mitchell@email.com',
    bloodGroup: 'A+',
    status: 'active',
    address: { street: '142 Oak Lane', city: 'Springfield', state: 'IL', zip: '62704' },
    emergencyContact: { name: 'James Mitchell', phone: '(555) 234-5679', relation: 'Spouse' },
    medicalHistory: 'Hypertension diagnosed 2019. Appendectomy in 2015. Seasonal allergies.',
    allergies: ['Penicillin', 'Sulfa drugs'],
    currentMedications: ['Lisinopril 10mg', 'Cetirizine 10mg'],
    insurance: { provider: 'BlueCross BlueShield', policyNumber: 'BC-882341', groupNumber: 'GRP-4421' },
    createdAt: '2024-01-15',
    lastVisit: '2026-05-10',
  },
  {
    id: '2',
    patientId: 'P-2026-0002',
    firstName: 'Robert',
    lastName: 'Yang',
    dateOfBirth: '1972-08-22',
    gender: 'Male',
    phone: '(555) 345-6789',
    email: 'robert.yang@email.com',
    bloodGroup: 'O-',
    status: 'admitted',
    address: { street: '890 Maple Drive', city: 'Springfield', state: 'IL', zip: '62701' },
    emergencyContact: { name: 'Linda Yang', phone: '(555) 345-6790', relation: 'Wife' },
    medicalHistory: 'Type 2 Diabetes since 2018. Cardiac stent placement 2023. Mild COPD.',
    allergies: ['Latex'],
    currentMedications: ['Metformin 500mg', 'Metoprolol 25mg', 'Aspirin 81mg'],
    insurance: { provider: 'Aetna', policyNumber: 'AE-551287', groupNumber: 'GRP-7890' },
    createdAt: '2023-06-20',
    lastVisit: '2026-05-14',
  },
  {
    id: '3',
    patientId: 'P-2026-0003',
    firstName: 'Maria',
    lastName: 'Gonzalez',
    dateOfBirth: '1990-11-05',
    gender: 'Female',
    phone: '(555) 456-7890',
    email: 'maria.gonzalez@email.com',
    bloodGroup: 'B+',
    status: 'active',
    address: { street: '567 Cedar Court', city: 'Springfield', state: 'IL', zip: '62702' },
    emergencyContact: { name: 'Carlos Gonzalez', phone: '(555) 456-7891', relation: 'Father' },
    medicalHistory: 'Asthma since childhood. Migraine disorder. ACL repair 2021.',
    allergies: ['Aspirin', 'Codeine'],
    currentMedications: ['Albuterol inhaler PRN', 'Sumatriptan 50mg PRN'],
    insurance: { provider: 'UnitedHealthcare', policyNumber: 'UH-223456', groupNumber: 'GRP-1156' },
    createdAt: '2023-09-10',
    lastVisit: '2026-05-08',
  },
  {
    id: '4',
    patientId: 'P-2026-0004',
    firstName: 'David',
    lastName: 'Thompson',
    dateOfBirth: '1968-02-17',
    gender: 'Male',
    phone: '(555) 567-8901',
    email: 'david.thompson@email.com',
    bloodGroup: 'AB+',
    status: 'discharged',
    address: { street: '321 Pine Street', city: 'Springfield', state: 'IL', zip: '62703' },
    emergencyContact: { name: 'Karen Thompson', phone: '(555) 567-8902', relation: 'Daughter' },
    medicalHistory: 'Chronic kidney disease Stage 3. Hip replacement 2022. Hyperlipidemia.',
    allergies: ['Iodine contrast'],
    currentMedications: ['Atorvastatin 40mg', 'Losartan 50mg'],
    insurance: { provider: 'Cigna', policyNumber: 'CG-991234', groupNumber: 'GRP-3387' },
    createdAt: '2022-04-05',
    lastVisit: '2026-04-28',
  },
  {
    id: '5',
    patientId: 'P-2026-0005',
    firstName: 'Emily',
    lastName: 'Nakamura',
    dateOfBirth: '1995-07-30',
    gender: 'Female',
    phone: '(555) 678-9012',
    email: 'emily.nakamura@email.com',
    bloodGroup: 'O+',
    status: 'active',
    address: { street: '789 Birch Avenue', city: 'Springfield', state: 'IL', zip: '62705' },
    emergencyContact: { name: 'Kenji Nakamura', phone: '(555) 678-9013', relation: 'Brother' },
    medicalHistory: 'Anxiety disorder. Iron deficiency anemia. No surgical history.',
    allergies: [],
    currentMedications: ['Sertraline 50mg', 'Ferrous sulfate 325mg'],
    insurance: { provider: 'Kaiser Permanente', policyNumber: 'KP-445678', groupNumber: 'GRP-2290' },
    createdAt: '2024-03-18',
    lastVisit: '2026-05-12',
  },
  {
    id: '6',
    patientId: 'P-2026-0006',
    firstName: 'James',
    lastName: 'Chen',
    dateOfBirth: '1955-12-08',
    gender: 'Male',
    phone: '(555) 789-0123',
    email: 'james.chen@email.com',
    bloodGroup: 'A-',
    status: 'admitted',
    address: { street: '456 Elm Boulevard', city: 'Springfield', state: 'IL', zip: '62706' },
    emergencyContact: { name: 'Mei Chen', phone: '(555) 789-0124', relation: 'Wife' },
    medicalHistory: 'Coronary artery disease. Pacemaker insertion 2020. GERD. BPH.',
    allergies: ['NSAIDs', 'Shellfish'],
    currentMedications: ['Clopidogrel 75mg', 'Omeprazole 20mg', 'Tamsulosin 0.4mg'],
    insurance: { provider: 'Medicare', policyNumber: 'MC-778901', groupNumber: 'GRP-0055' },
    createdAt: '2022-01-10',
    lastVisit: '2026-05-14',
  },
  {
    id: '7',
    patientId: 'P-2026-0007',
    firstName: 'Patricia',
    lastName: 'Okafor',
    dateOfBirth: '1980-04-23',
    gender: 'Female',
    phone: '(555) 890-1234',
    email: 'patricia.okafor@email.com',
    bloodGroup: 'B-',
    status: 'active',
    address: { street: '123 Walnut Road', city: 'Springfield', state: 'IL', zip: '62707' },
    emergencyContact: { name: 'Chidi Okafor', phone: '(555) 890-1235', relation: 'Husband' },
    medicalHistory: 'Sickle cell trait. Fibromyalgia. Cesarean delivery 2018.',
    allergies: ['Morphine'],
    currentMedications: ['Pregabalin 75mg', 'Prenatal vitamins'],
    insurance: { provider: 'Humana', policyNumber: 'HU-334567', groupNumber: 'GRP-6612' },
    createdAt: '2024-07-22',
    lastVisit: '2026-05-06',
  },
  {
    id: '8',
    patientId: 'P-2026-0008',
    firstName: 'William',
    lastName: 'Petrov',
    dateOfBirth: '1945-09-11',
    gender: 'Male',
    phone: '(555) 901-2345',
    email: 'william.petrov@email.com',
    bloodGroup: 'AB-',
    status: 'deceased',
    address: { street: '654 Spruce Way', city: 'Springfield', state: 'IL', zip: '62708' },
    emergencyContact: { name: 'Anna Petrov', phone: '(555) 901-2346', relation: 'Daughter' },
    medicalHistory: 'Congestive heart failure. Atrial fibrillation. Stroke 2024. Prostate cancer.',
    allergies: ['Warfarin', 'Radiocontrast media'],
    currentMedications: [],
    insurance: { provider: 'Medicare', policyNumber: 'MC-112233', groupNumber: 'GRP-0044' },
    createdAt: '2021-11-30',
    lastVisit: '2026-03-15',
  },
  {
    id: '9',
    patientId: 'P-2026-0009',
    firstName: 'Lisa',
    lastName: 'Novak',
    dateOfBirth: '1988-06-19',
    gender: 'Female',
    phone: '(555) 012-3456',
    email: 'lisa.novak@email.com',
    bloodGroup: 'O+',
    status: 'active',
    address: { street: '987 Willow Lane', city: 'Springfield', state: 'IL', zip: '62709' },
    emergencyContact: { name: 'Mark Novak', phone: '(555) 012-3457', relation: 'Husband' },
    medicalHistory: 'Rheumatoid arthritis. Hypothyroidism. Cholecystectomy 2019.',
    allergies: ['Sulfonamides'],
    currentMedications: ['Methotrexate 15mg weekly', 'Levothyroxine 75mcg', 'Folic acid 1mg'],
    insurance: { provider: 'Anthem', policyNumber: 'AN-667890', groupNumber: 'GRP-5534' },
    createdAt: '2023-02-14',
    lastVisit: '2026-05-11',
  },
  {
    id: '10',
    patientId: 'P-2026-0010',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    dateOfBirth: '1975-01-28',
    gender: 'Male',
    phone: '(555) 123-4567',
    email: 'ahmed.hassan@email.com',
    bloodGroup: 'A+',
    status: 'active',
    address: { street: '321 Ash Street', city: 'Springfield', state: 'IL', zip: '62710' },
    emergencyContact: { name: 'Fatima Hassan', phone: '(555) 123-4568', relation: 'Wife' },
    medicalHistory: 'Type 1 Diabetes since 2005. Diabetic retinopathy. Insulin pump user.',
    allergies: ['Tape adhesive'],
    currentMedications: ['Insulin glargine 20 units', 'Insulin lispro per pump', 'Lisinopril 10mg'],
    insurance: { provider: 'BlueCross BlueShield', policyNumber: 'BC-445566', groupNumber: 'GRP-8821' },
    createdAt: '2024-11-01',
    lastVisit: '2026-05-13',
  },
];

const mockVitals = [
  { label: 'Blood Pressure', value: '122/78 mmHg', status: 'normal', icon: Heart },
  { label: 'Heart Rate', value: '72 bpm', status: 'normal', icon: Activity },
  { label: 'Temperature', value: '98.6 F', status: 'normal', icon: Activity },
  { label: 'SpO2', value: '98%', status: 'normal', icon: Droplets },
  { label: 'Weight', value: '165 lbs', status: 'normal', icon: User },
  { label: 'BMI', value: '24.2', status: 'normal', icon: User },
];

const mockRecentVisits = [
  { date: 'May 10, 2026', type: 'General Checkup', doctor: 'Dr. James Chen', notes: 'Routine follow-up. Blood pressure well controlled.' },
  { date: 'Apr 22, 2026', type: 'Lab Work', doctor: 'Dr. Amira Patel', notes: 'Annual metabolic panel. Results within normal limits.' },
  { date: 'Mar 15, 2026', type: 'Cardiology', doctor: 'Dr. Lisa Novak', notes: 'Echocardiogram normal. Continue current medications.' },
  { date: 'Feb 08, 2026', type: 'Urgent Care', doctor: 'Dr. Kwame Asante', notes: 'Presented with chest tightness. ECG normal. Follow-up in 2 weeks.' },
];

const mockActiveMedications = [
  { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: 'Jan 2020', prescriber: 'Dr. James Chen' },
  { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily as needed', startDate: 'Mar 2021', prescriber: 'Dr. Amira Patel' },
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genderOptions = ['Male', 'Female', 'Other'];
const filterOptions = ['All', 'Active', 'Admitted', 'Discharged', 'Deceased'] as const;
const detailTabs = ['Overview', 'Appointments', 'Admissions', 'Prescriptions', 'Lab Orders', 'Billing', 'Clinical Forms'] as const;
const formTabs = ['Personal Info', 'Contact & Address', 'Medical Info', 'Insurance'] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getPatientStatusBadge(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    admitted: 'bg-blue-100 text-blue-700',
    discharged: 'bg-slate-100 text-slate-600',
    deceased: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
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

const emptyForm: NewPatientForm = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  phone: '',
  email: '',
  addressStreet: '',
  addressCity: '',
  addressState: '',
  addressZip: '',
  emergencyName: '',
  emergencyPhone: '',
  emergencyRelation: '',
  medicalHistory: '',
  allergies: '',
  currentMedications: '',
  insuranceProvider: '',
  policyNumber: '',
  groupNumber: '',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Patients() {
  const { user: _user } = useAuth();
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [formTab, setFormTab] = useState<number>(0);
  const [detailTab, setDetailTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [newPatientForm, setNewPatientForm] = useState<NewPatientForm>({ ...emptyForm });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof NewPatientForm, string>>>({});

  const pageSize = 8;

  // ── Filtered & paginated patients ──

  const filteredPatients = mockPatients.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);

    const matchesFilter =
      statusFilter === 'All' ||
      p.status === statusFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ── Stats ──

  const stats = {
    total: mockPatients.length,
    active: mockPatients.filter((p) => p.status === 'active').length,
    admitted: mockPatients.filter((p) => p.status === 'admitted').length,
    newThisMonth: 3,
  };

  // ── Form validation ──

  function validateForm(): boolean {
    const errors: Partial<Record<keyof NewPatientForm, string>> = {};
    if (!newPatientForm.firstName.trim()) errors.firstName = 'First name is required';
    if (!newPatientForm.lastName.trim()) errors.lastName = 'Last name is required';
    if (!newPatientForm.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!newPatientForm.gender) errors.gender = 'Gender is required';
    if (!newPatientForm.phone.trim()) errors.phone = 'Phone number is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSavePatient() {
    if (!validateForm()) return;
    // In production, this would insert into Supabase
    setShowNewPatientModal(false);
    setNewPatientForm({ ...emptyForm });
    setFormErrors({});
    setFormTab(0);
  }

  function handleCancelNewPatient() {
    setShowNewPatientModal(false);
    setNewPatientForm({ ...emptyForm });
    setFormErrors({});
    setFormTab(0);
  }

  function openPatientDetail(patient: Patient) {
    setSelectedPatient(patient);
    setView('detail');
    setDetailTab(0);
  }

  function backToList() {
    setView('list');
    setSelectedPatient(null);
  }

  // ── Render: Patient Detail View ──

  if (view === 'detail' && selectedPatient) {
    const p = selectedPatient;
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={backToList}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to List
                </button>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold',
                      getAvatarColor(p.firstName)
                    )}
                  >
                    {getInitials(p.firstName, p.lastName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-xl font-bold text-slate-800">
                        {p.firstName} {p.lastName}
                      </h1>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                          getPatientStatusBadge(p.status)
                        )}
                      >
                        {formatStatus(p.status)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {p.patientId} &middot; {calculateAge(p.dateOfBirth)} yrs &middot; {p.gender} &middot; {p.bloodGroup}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3.5 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100 transition-colors shadow-sm">
                  <BedDouble className="h-4 w-4" />
                  Admit
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                  <FileText className="h-4 w-4" />
                  Discharge
                </button>
              </div>
            </div>
          </div>

          {/* Detail Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1 overflow-x-auto -mb-px" aria-label="Tabs">
              {detailTabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(i)}
                  className={cn(
                    'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                    detailTab === i
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {detailTab === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Info Card */}
              <div className="lg:col-span-1 space-y-5">
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4">
                    Patient Information
                  </h3>
                  <div className="space-y-3.5">
                    {[
                      { icon: User, label: 'Full Name', value: `${p.firstName} ${p.lastName}` },
                      { icon: Calendar, label: 'Date of Birth', value: formatDate(p.dateOfBirth) },
                      { icon: User, label: 'Gender', value: p.gender },
                      { icon: Droplets, label: 'Blood Group', value: p.bloodGroup },
                      { icon: Phone, label: 'Phone', value: p.phone },
                      { icon: Mail, label: 'Email', value: p.email },
                      { icon: MapPin, label: 'Address', value: `${p.address.street}, ${p.address.city}, ${p.address.state} ${p.address.zip}` },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-start gap-3">
                          <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-400">{item.label}</p>
                            <p className="text-sm font-medium text-slate-700">{item.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4">
                    Emergency Contact
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400">Name</p>
                      <p className="text-sm font-medium text-slate-700">{p.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="text-sm font-medium text-slate-700">{p.emergencyContact.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Relationship</p>
                      <p className="text-sm font-medium text-slate-700">{p.emergencyContact.relation}</p>
                    </div>
                  </div>
                </div>

                {/* Insurance */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-teal-500" />
                    Insurance
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400">Provider</p>
                      <p className="text-sm font-medium text-slate-700">{p.insurance.provider}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Policy Number</p>
                      <p className="text-sm font-medium text-slate-700">{p.insurance.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Group Number</p>
                      <p className="text-sm font-medium text-slate-700">{p.insurance.groupNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: Vitals + Visits + Medications */}
              <div className="lg:col-span-2 space-y-6">
                {/* Vitals Summary */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-teal-500" />
                    Latest Vitals
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mockVitals.map((vital) => {
                      const Icon = vital.icon;
                      return (
                        <div
                          key={vital.label}
                          className="rounded-lg border border-slate-100 bg-slate-50/50 p-3.5 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <Icon className="h-3.5 w-3.5 text-teal-500" />
                            <span className="text-xs text-slate-500">{vital.label}</span>
                          </div>
                          <p className="text-base font-semibold text-slate-800">{vital.value}</p>
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Normal
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Allergies & Medical History */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Allergies
                    </h3>
                    {p.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {p.allergies.map((allergy) => (
                          <span
                            key={allergy}
                            className="inline-flex items-center rounded-full bg-red-50 border border-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No known allergies</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-teal-500" />
                      Medical History
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{p.medicalHistory}</p>
                  </div>
                </div>

                {/* Active Medications */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-teal-500" />
                    Active Medications
                  </h3>
                  {p.currentMedications.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="pb-2 text-left text-xs font-semibold text-slate-400">Medication</th>
                            <th className="pb-2 text-left text-xs font-semibold text-slate-400">Dosage</th>
                            <th className="pb-2 text-left text-xs font-semibold text-slate-400">Frequency</th>
                            <th className="pb-2 text-left text-xs font-semibold text-slate-400">Since</th>
                            <th className="pb-2 text-left text-xs font-semibold text-slate-400">Prescriber</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {mockActiveMedications.map((med, i) => (
                            <tr key={i}>
                              <td className="py-2.5 text-sm font-medium text-slate-700">{med.name}</td>
                              <td className="py-2.5 text-sm text-slate-500">{med.dosage}</td>
                              <td className="py-2.5 text-sm text-slate-500">{med.frequency}</td>
                              <td className="py-2.5 text-sm text-slate-500">{med.startDate}</td>
                              <td className="py-2.5 text-sm text-slate-500">{med.prescriber}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No active medications</p>
                  )}
                </div>

                {/* Recent Visits */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-teal-500" />
                    Recent Visits
                  </h3>
                  <div className="space-y-3">
                    {mockRecentVisits.map((visit, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-slate-100 p-4 hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-700">{visit.type}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{visit.doctor}</p>
                          </div>
                          <span className="text-xs text-slate-400">{visit.date}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500 leading-relaxed">{visit.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {detailTab !== 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <ClipboardList className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-700">{detailTabs[detailTab]}</h3>
              <p className="mt-1 text-sm text-slate-400">
                {detailTabs[detailTab]} records will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Render: Patient List View ──

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Patient Management</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage and view all patient records across the hospital
            </p>
          </div>
          <button
            onClick={() => setShowNewPatientModal(true)}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Patient
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Patients', value: stats.total, icon: User, color: 'text-teal-600', bg: 'bg-teal-50', iconBg: 'bg-teal-100' },
            { label: 'Active', value: stats.active, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100' },
            { label: 'Admitted', value: stats.admitted, icon: BedDouble, color: 'text-blue-600', bg: 'bg-blue-50', iconBg: 'bg-blue-100' },
            { label: 'New This Month', value: stats.newThisMonth, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', iconBg: 'bg-amber-100' },
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

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients by name, ID, or phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors shadow-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors shadow-sm cursor-pointer"
            >
              {filterOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* Patients Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Patient ID
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Name
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Age / Gender
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Phone
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Blood Group
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
                {paginatedPatients.length > 0 ? (
                  paginatedPatients.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => openPatientDetail(p)}
                      className="hover:bg-teal-50/30 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm font-mono text-slate-500">
                        {p.patientId}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shrink-0',
                              getAvatarColor(p.firstName)
                            )}
                          >
                            {getInitials(p.firstName, p.lastName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">
                              {p.firstName} {p.lastName}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">
                        {calculateAge(p.dateOfBirth)} / {p.gender.charAt(0)}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">
                        {p.phone}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                          <Droplets className="h-3.5 w-3.5 text-red-400" />
                          {p.bloodGroup}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                            getPatientStatusBadge(p.status)
                          )}
                        >
                          {formatStatus(p.status)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPatientDetail(p);
                          }}
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-teal-600 hover:bg-teal-50 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Search className="h-10 w-10 text-slate-300 mb-3" />
                        <p className="text-sm font-medium text-slate-500">No patients found</p>
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
          {filteredPatients.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 bg-slate-50/30">
              <p className="text-xs text-slate-500">
                Showing {(currentPage - 1) * pageSize + 1}&ndash;
                {Math.min(currentPage * pageSize, filteredPatients.length)} of{' '}
                {filteredPatients.length} patients
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
      </div>

      {/* ── New Patient Modal ── */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={handleCancelNewPatient}
          />

          {/* Modal */}
          <div className="relative z-10 mx-4 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">New Patient Registration</h2>
              <button
                onClick={handleCancelNewPatient}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Tabs */}
            <div className="border-b border-slate-100 px-6 bg-white">
              <nav className="flex gap-1 -mb-px overflow-x-auto">
                {formTabs.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setFormTab(i)}
                    className={cn(
                      'whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                      formTab === i
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Personal Info */}
              {formTab === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newPatientForm.firstName}
                        onChange={(e) => setNewPatientForm({ ...newPatientForm, firstName: e.target.value })}
                        className={cn(
                          'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors',
                          formErrors.firstName
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
                        )}
                        placeholder="Enter first name"
                      />
                      {formErrors.firstName && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newPatientForm.lastName}
                        onChange={(e) => setNewPatientForm({ ...newPatientForm, lastName: e.target.value })}
                        className={cn(
                          'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors',
                          formErrors.lastName
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
                        )}
                        placeholder="Enter last name"
                      />
                      {formErrors.lastName && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newPatientForm.dateOfBirth}
                        onChange={(e) => setNewPatientForm({ ...newPatientForm, dateOfBirth: e.target.value })}
                        className={cn(
                          'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-colors',
                          formErrors.dateOfBirth
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
                        )}
                      />
                      {formErrors.dateOfBirth && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.dateOfBirth}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newPatientForm.gender}
                        onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}
                        className={cn(
                          'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-colors appearance-none cursor-pointer',
                          formErrors.gender
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
                        )}
                      >
                        <option value="">Select gender</option>
                        {genderOptions.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      {formErrors.gender && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.gender}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Blood Group
                    </label>
                    <select
                      value={newPatientForm.bloodGroup}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, bloodGroup: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select blood group</option>
                      {bloodGroups.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Contact & Address */}
              {formTab === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={newPatientForm.phone}
                        onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                        className={cn(
                          'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors',
                          formErrors.phone
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
                        )}
                        placeholder="(555) 000-0000"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newPatientForm.email}
                        onChange={(e) => setNewPatientForm({ ...newPatientForm, email: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                        placeholder="patient@email.com"
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 mb-3">Address</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={newPatientForm.addressStreet}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, addressStreet: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                          <input
                            type="text"
                            value={newPatientForm.addressCity}
                            onChange={(e) => setNewPatientForm({ ...newPatientForm, addressCity: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                          <input
                            type="text"
                            value={newPatientForm.addressState}
                            onChange={(e) => setNewPatientForm({ ...newPatientForm, addressState: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                            placeholder="IL"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">ZIP Code</label>
                          <input
                            type="text"
                            value={newPatientForm.addressZip}
                            onChange={(e) => setNewPatientForm({ ...newPatientForm, addressZip: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                            placeholder="62701"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 mb-3">Emergency Contact</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                        <input
                          type="text"
                          value={newPatientForm.emergencyName}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, emergencyName: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                          placeholder="Contact name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                        <input
                          type="tel"
                          value={newPatientForm.emergencyPhone}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, emergencyPhone: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                          placeholder="(555) 000-0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Relationship</label>
                        <input
                          type="text"
                          value={newPatientForm.emergencyRelation}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, emergencyRelation: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                          placeholder="Spouse, Parent, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Info */}
              {formTab === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Medical History
                    </label>
                    <textarea
                      value={newPatientForm.medicalHistory}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, medicalHistory: e.target.value })}
                      rows={4}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors resize-none"
                      placeholder="Describe relevant medical history, past surgeries, chronic conditions..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Allergies
                    </label>
                    <input
                      type="text"
                      value={newPatientForm.allergies}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, allergies: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                      placeholder="Comma-separated (e.g., Penicillin, Latex, Sulfa drugs)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Current Medications
                    </label>
                    <input
                      type="text"
                      value={newPatientForm.currentMedications}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, currentMedications: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                      placeholder="Comma-separated (e.g., Lisinopril 10mg, Aspirin 81mg)"
                    />
                  </div>
                </div>
              )}

              {/* Insurance */}
              {formTab === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      value={newPatientForm.insuranceProvider}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, insuranceProvider: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                      placeholder="e.g., BlueCross BlueShield"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Policy Number
                      </label>
                      <input
                        type="text"
                        value={newPatientForm.policyNumber}
                        onChange={(e) => setNewPatientForm({ ...newPatientForm, policyNumber: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                        placeholder="e.g., BC-882341"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Group Number
                      </label>
                      <input
                        type="text"
                        value={newPatientForm.groupNumber}
                        onChange={(e) => setNewPatientForm({ ...newPatientForm, groupNumber: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-colors"
                        placeholder="e.g., GRP-4421"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50/50">
              <button
                onClick={handleCancelNewPatient}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePatient}
                className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
              >
                Save Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
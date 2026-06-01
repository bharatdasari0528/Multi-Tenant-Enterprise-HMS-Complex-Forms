import { useState } from 'react';
import {
  Search,
  Plus,
  BedDouble,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MapPin,
  Building2,
  Activity,
  LogOut,
} from 'lucide-react';
import { cn, formatDate, formatDateTime, getStatusColor } from '../lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  bedId: string;
  bedNumber: string;
  wardName: string;
  admittingDoctor: string;
  admissionDate: string;
  diagnosis: string;
  status: 'admitted' | 'discharged' | 'transferred';
  admissionType: 'emergency' | 'planned' | 'transfer';
  daysAdmitted: number;
  notes: string;
}

interface Bed {
  id: string;
  bedNumber: string;
  wardName: string;
  floor: string;
  status: 'available' | 'occupied' | 'maintenance';
  patientName?: string;
  patientId?: string;
  admissionId?: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockAdmissions: Admission[] = [
  {
    id: 'ADM-001',
    patientId: 'P-2026-0002',
    patientName: 'Robert Yang',
    bedId: 'B-ICU-03',
    bedNumber: 'ICU-03',
    wardName: 'ICU',
    admittingDoctor: 'Dr. Sarah Mitchell',
    admissionDate: '2026-05-14T08:30:00',
    diagnosis: 'Acute myocardial infarction, Type 2 Diabetes exacerbation',
    status: 'admitted',
    admissionType: 'emergency',
    daysAdmitted: 1,
    notes: 'Presented with chest pain. Troponin elevated. Stent placement scheduled.',
  },
  {
    id: 'ADM-002',
    patientId: 'P-2026-0006',
    patientName: 'James Chen',
    bedId: 'B-CW2-12',
    bedNumber: 'CW-212',
    wardName: 'Cardiology Ward',
    admittingDoctor: 'Dr. Lisa Novak',
    admissionDate: '2026-05-12T14:00:00',
    diagnosis: 'Congestive heart failure exacerbation, Pacemaker malfunction',
    status: 'admitted',
    admissionType: 'planned',
    daysAdmitted: 3,
    notes: 'Scheduled pacemaker replacement. Stable on current medications.',
  },
  {
    id: 'ADM-003',
    patientId: 'P-2026-0004',
    patientName: 'David Thompson',
    bedId: 'B-NW1-07',
    bedNumber: 'NW-107',
    wardName: 'Nephrology Ward',
    admittingDoctor: 'Dr. Kwame Asante',
    admissionDate: '2026-04-28T09:15:00',
    diagnosis: 'Chronic kidney disease Stage 3, Hyperlipidemia',
    status: 'discharged',
    admissionType: 'planned',
    daysAdmitted: 16,
    notes: 'Recovered well. Discharged with follow-up in 2 weeks.',
  },
  {
    id: 'ADM-004',
    patientId: 'P-2026-0009',
    patientName: 'Lisa Novak',
    bedId: 'B-OW1-04',
    bedNumber: 'OW-104',
    wardName: 'Orthopedic Ward',
    admittingDoctor: 'Dr. Amira Patel',
    admissionDate: '2026-05-13T16:45:00',
    diagnosis: 'Rheumatoid arthritis flare, right knee effusion',
    status: 'admitted',
    admissionType: 'emergency',
    daysAdmitted: 2,
    notes: 'Intra-articular injection administered. PT consult pending.',
  },
  {
    id: 'ADM-005',
    patientId: 'P-2026-0010',
    patientName: 'Ahmed Hassan',
    bedId: 'B-ICU-01',
    bedNumber: 'ICU-01',
    wardName: 'ICU',
    admittingDoctor: 'Dr. Sarah Mitchell',
    admissionDate: '2026-05-15T02:00:00',
    diagnosis: 'Diabetic ketoacidosis, Insulin pump failure',
    status: 'admitted',
    admissionType: 'emergency',
    daysAdmitted: 0,
    notes: 'Insulin pump replaced. DKA protocol initiated. Close monitoring.',
  },
  {
    id: 'ADM-006',
    patientId: 'P-2026-0003',
    patientName: 'Maria Gonzalez',
    bedId: 'B-SW2-09',
    bedNumber: 'SW-209',
    wardName: 'Surgical Ward',
    admittingDoctor: 'Dr. James Chen',
    admissionDate: '2026-05-10T11:30:00',
    diagnosis: 'ACL reconstruction, right knee',
    status: 'transferred',
    admissionType: 'planned',
    daysAdmitted: 5,
    notes: 'Transferred to rehabilitation facility for post-surgical recovery.',
  },
  {
    id: 'ADM-007',
    patientId: 'P-2026-0007',
    patientName: 'Patricia Okafor',
    bedId: 'B-MW1-02',
    bedNumber: 'MW-102',
    wardName: 'Maternity Ward',
    admittingDoctor: 'Dr. Amira Patel',
    admissionDate: '2026-05-14T06:00:00',
    diagnosis: 'Preterm labor monitoring, 34 weeks gestation',
    status: 'admitted',
    admissionType: 'emergency',
    daysAdmitted: 1,
    notes: 'Tocolytics administered. Fetal monitoring continuous. Stable.',
  },
  {
    id: 'ADM-008',
    patientId: 'P-2026-0005',
    patientName: 'Emily Nakamura',
    bedId: 'B-PW1-11',
    bedNumber: 'PW-111',
    wardName: 'Psychiatric Ward',
    admittingDoctor: 'Dr. Lisa Novak',
    admissionDate: '2026-05-11T10:00:00',
    diagnosis: 'Severe anxiety episode, Iron deficiency anemia',
    status: 'admitted',
    admissionType: 'planned',
    daysAdmitted: 4,
    notes: 'Medication adjustment in progress. Anemia workup ongoing.',
  },
  {
    id: 'ADM-009',
    patientId: 'P-2026-0001',
    patientName: 'Sarah Mitchell',
    bedId: 'B-GW2-06',
    bedNumber: 'GW-206',
    wardName: 'General Ward',
    admittingDoctor: 'Dr. Kwame Asante',
    admissionDate: '2026-05-09T08:00:00',
    diagnosis: 'Hypertensive urgency, Appendectomy follow-up',
    status: 'discharged',
    admissionType: 'emergency',
    daysAdmitted: 6,
    notes: 'Blood pressure controlled. Discharged on adjusted medication regimen.',
  },
  {
    id: 'ADM-010',
    patientId: 'P-2026-0008',
    patientName: 'William Petrov',
    bedId: 'B-CW2-03',
    bedNumber: 'CW-203',
    wardName: 'Cardiology Ward',
    admittingDoctor: 'Dr. James Chen',
    admissionDate: '2026-03-10T14:30:00',
    diagnosis: 'Atrial fibrillation, Congestive heart failure',
    status: 'discharged',
    admissionType: 'transfer',
    daysAdmitted: 5,
    notes: 'Transferred from ER. Rate control achieved. Discharged withHolter monitor.',
  },
];

const mockBeds: Bed[] = [
  // ICU - Floor 3
  { id: 'B-ICU-01', bedNumber: 'ICU-01', wardName: 'ICU', floor: '3rd Floor', status: 'occupied', patientName: 'Ahmed Hassan', patientId: 'P-2026-0010', admissionId: 'ADM-005' },
  { id: 'B-ICU-02', bedNumber: 'ICU-02', wardName: 'ICU', floor: '3rd Floor', status: 'available' },
  { id: 'B-ICU-03', bedNumber: 'ICU-03', wardName: 'ICU', floor: '3rd Floor', status: 'occupied', patientName: 'Robert Yang', patientId: 'P-2026-0002', admissionId: 'ADM-001' },
  { id: 'B-ICU-04', bedNumber: 'ICU-04', wardName: 'ICU', floor: '3rd Floor', status: 'maintenance' },
  { id: 'B-ICU-05', bedNumber: 'ICU-05', wardName: 'ICU', floor: '3rd Floor', status: 'available' },
  { id: 'B-ICU-06', bedNumber: 'ICU-06', wardName: 'ICU', floor: '3rd Floor', status: 'available' },
  // Cardiology Ward - Floor 2
  { id: 'B-CW2-01', bedNumber: 'CW-201', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-CW2-02', bedNumber: 'CW-202', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-CW2-03', bedNumber: 'CW-203', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-CW2-04', bedNumber: 'CW-204', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'maintenance' },
  { id: 'B-CW2-05', bedNumber: 'CW-205', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-CW2-06', bedNumber: 'CW-206', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-CW2-07', bedNumber: 'CW-207', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-CW2-08', bedNumber: 'CW-208', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-CW2-09', bedNumber: 'CW-209', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-CW2-10', bedNumber: 'CW-210', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-CW2-11', bedNumber: 'CW-211', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-CW2-12', bedNumber: 'CW-212', wardName: 'Cardiology Ward', floor: '2nd Floor', status: 'occupied', patientName: 'James Chen', patientId: 'P-2026-0006', admissionId: 'ADM-002' },
  // General Ward - Floor 1
  { id: 'B-GW1-01', bedNumber: 'GW-101', wardName: 'General Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-GW1-02', bedNumber: 'GW-102', wardName: 'General Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-GW1-03', bedNumber: 'GW-103', wardName: 'General Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-GW1-04', bedNumber: 'GW-104', wardName: 'General Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-GW1-05', bedNumber: 'GW-105', wardName: 'General Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-GW1-06', bedNumber: 'GW-106', wardName: 'General Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-GW1-07', bedNumber: 'GW-107', wardName: 'General Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-GW1-08', bedNumber: 'GW-108', wardName: 'General Ward', floor: '1st Floor', status: 'maintenance' },
  // General Ward - Floor 2
  { id: 'B-GW2-01', bedNumber: 'GW-201', wardName: 'General Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-GW2-02', bedNumber: 'GW-202', wardName: 'General Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-GW2-03', bedNumber: 'GW-203', wardName: 'General Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-GW2-04', bedNumber: 'GW-204', wardName: 'General Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-GW2-05', bedNumber: 'GW-205', wardName: 'General Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-GW2-06', bedNumber: 'GW-206', wardName: 'General Ward', floor: '2nd Floor', status: 'available' },
  // Surgical Ward - Floor 1
  { id: 'B-SW1-01', bedNumber: 'SW-101', wardName: 'Surgical Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-SW1-02', bedNumber: 'SW-102', wardName: 'Surgical Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-SW1-03', bedNumber: 'SW-103', wardName: 'Surgical Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-SW1-04', bedNumber: 'SW-104', wardName: 'Surgical Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-SW1-05', bedNumber: 'SW-105', wardName: 'Surgical Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-SW1-06', bedNumber: 'SW-106', wardName: 'Surgical Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-SW1-07', bedNumber: 'SW-107', wardName: 'Surgical Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-SW1-08', bedNumber: 'SW-108', wardName: 'Surgical Ward', floor: '1st Floor', status: 'available' },
  // Surgical Ward - Floor 2
  { id: 'B-SW2-01', bedNumber: 'SW-201', wardName: 'Surgical Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-SW2-02', bedNumber: 'SW-202', wardName: 'Surgical Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-SW2-03', bedNumber: 'SW-203', wardName: 'Surgical Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-SW2-04', bedNumber: 'SW-204', wardName: 'Surgical Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-SW2-05', bedNumber: 'SW-205', wardName: 'Surgical Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-SW2-06', bedNumber: 'SW-206', wardName: 'Surgical Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-SW2-07', bedNumber: 'SW-207', wardName: 'Surgical Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-SW2-08', bedNumber: 'SW-208', wardName: 'Surgical Ward', floor: '2nd Floor', status: 'available' },
  { id: 'B-SW2-09', bedNumber: 'SW-209', wardName: 'Surgical Ward', floor: '2nd Floor', status: 'available' },
  // Orthopedic Ward - Floor 1
  { id: 'B-OW1-01', bedNumber: 'OW-101', wardName: 'Orthopedic Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-OW1-02', bedNumber: 'OW-102', wardName: 'Orthopedic Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-OW1-03', bedNumber: 'OW-103', wardName: 'Orthopedic Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-OW1-04', bedNumber: 'OW-104', wardName: 'Orthopedic Ward', floor: '1st Floor', status: 'occupied', patientName: 'Lisa Novak', patientId: 'P-2026-0009', admissionId: 'ADM-004' },
  { id: 'B-OW1-05', bedNumber: 'OW-105', wardName: 'Orthopedic Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-OW1-06', bedNumber: 'OW-106', wardName: 'Orthopedic Ward', floor: '1st Floor', status: 'available' },
  // Nephrology Ward - Floor 1
  { id: 'B-NW1-01', bedNumber: 'NW-101', wardName: 'Nephrology Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-NW1-02', bedNumber: 'NW-102', wardName: 'Nephrology Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-NW1-03', bedNumber: 'NW-103', wardName: 'Nephrology Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-NW1-04', bedNumber: 'NW-104', wardName: 'Nephrology Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-NW1-05', bedNumber: 'NW-105', wardName: 'Nephrology Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-NW1-06', bedNumber: 'NW-106', wardName: 'Nephrology Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-NW1-07', bedNumber: 'NW-107', wardName: 'Nephrology Ward', floor: '1st Floor', status: 'available' },
  // Maternity Ward - Floor 1
  { id: 'B-MW1-01', bedNumber: 'MW-101', wardName: 'Maternity Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-MW1-02', bedNumber: 'MW-102', wardName: 'Maternity Ward', floor: '1st Floor', status: 'occupied', patientName: 'Patricia Okafor', patientId: 'P-2026-0007', admissionId: 'ADM-007' },
  { id: 'B-MW1-03', bedNumber: 'MW-103', wardName: 'Maternity Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-MW1-04', bedNumber: 'MW-104', wardName: 'Maternity Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-MW1-05', bedNumber: 'MW-105', wardName: 'Maternity Ward', floor: '1st Floor', status: 'available' },
  // Psychiatric Ward - Floor 1
  { id: 'B-PW1-01', bedNumber: 'PW-101', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-PW1-02', bedNumber: 'PW-102', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-PW1-03', bedNumber: 'PW-103', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-PW1-04', bedNumber: 'PW-104', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-PW1-05', bedNumber: 'PW-105', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-PW1-06', bedNumber: 'PW-106', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-PW1-07', bedNumber: 'PW-107', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-PW1-08', bedNumber: 'PW-108', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-PW1-09', bedNumber: 'PW-109', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-PW1-10', bedNumber: 'PW-110', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'available' },
  { id: 'B-PW1-11', bedNumber: 'PW-111', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'occupied', patientName: 'Emily Nakamura', patientId: 'P-2026-0005', admissionId: 'ADM-008' },
  { id: 'B-PW1-12', bedNumber: 'PW-112', wardName: 'Psychiatric Ward', floor: '1st Floor', status: 'available' },
];

const mockDoctors = [
  'Dr. Sarah Mitchell',
  'Dr. Robert Yang',
  'Dr. Amira Patel',
  'Dr. Kwame Asante',
  'Dr. Lisa Novak',
  'Dr. James Chen',
];

const mockPatientsForAdmission = [
  { id: 'P-2026-0001', name: 'Sarah Mitchell' },
  { id: 'P-2026-0003', name: 'Maria Gonzalez' },
  { id: 'P-2026-0005', name: 'Emily Nakamura' },
  { id: 'P-2026-0009', name: 'Lisa Novak' },
  { id: 'P-2026-0010', name: 'Ahmed Hassan' },
];

const statusFilterOptions = ['All', 'Admitted', 'Discharged', 'Transferred'] as const;
const admissionTypeOptions = ['All', 'Emergency', 'Planned', 'Transfer'] as const;
const floorOptions = ['All Floors', '1st Floor', '2nd Floor', '3rd Floor'];
const wardOptions = ['All Wards', 'ICU', 'Cardiology Ward', 'General Ward', 'Surgical Ward', 'Orthopedic Ward', 'Nephrology Ward', 'Maternity Ward', 'Psychiatric Ward'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getBedStatusColor(status: string): string {
  const map: Record<string, string> = {
    available: 'bg-emerald-500',
    occupied: 'bg-red-500',
    maintenance: 'bg-amber-500',
  };
  return map[status] || 'bg-gray-500';
}

function getBedStatusBorder(status: string): string {
  const map: Record<string, string> = {
    available: 'border-emerald-200 bg-emerald-50/50',
    occupied: 'border-red-200 bg-red-50/50',
    maintenance: 'border-amber-200 bg-amber-50/50',
  };
  return map[status] || 'border-gray-200';
}

function getBedStatusIcon(status: string) {
  switch (status) {
    case 'available':
      return CheckCircle2;
    case 'occupied':
      return User;
    case 'maintenance':
      return AlertTriangle;
    default:
      return BedDouble;
  }
}

function getAdmissionTypeBadge(type: string): string {
  const map: Record<string, string> = {
    emergency: 'bg-red-100 text-red-800',
    planned: 'bg-teal-100 text-teal-800',
    transfer: 'bg-cyan-100 text-cyan-800',
  };
  return map[type] || 'bg-gray-100 text-gray-800';
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Admissions() {
  const [activeTab, setActiveTab] = useState<'admissions' | 'bedmap'>('admissions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [admissionTypeFilter, setAdmissionTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewAdmissionModal, setShowNewAdmissionModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [bedFloorFilter, setBedFloorFilter] = useState('All Floors');
  const [bedWardFilter, setBedWardFilter] = useState('All Wards');

  // New admission form state
  const [newPatientId, setNewPatientId] = useState('');
  const [newBedId, setNewBedId] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newAdmissionType, setNewAdmissionType] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Discharge form state
  const [dischargeNotes, setDischargeNotes] = useState('');
  const [dischargeDate, setDischargeDate] = useState(new Date().toISOString().split('T')[0]);

  const pageSize = 8;

  // ── Filtered admissions ──

  const filteredAdmissions = mockAdmissions.filter((a) => {
    const matchesSearch =
      searchQuery === '' ||
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.admittingDoctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      a.status === statusFilter.toLowerCase();

    const matchesType =
      admissionTypeFilter === 'All' ||
      a.admissionType === admissionTypeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAdmissions.length / pageSize));
  const paginatedAdmissions = filteredAdmissions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ── Stats ──

  const totalBeds = mockBeds.length;
  const availableBeds = mockBeds.filter((b) => b.status === 'available').length;
  const occupiedBeds = mockBeds.filter((b) => b.status === 'occupied').length;
  const maintenanceBeds = mockBeds.filter((b) => b.status === 'maintenance').length;

  // ── Filtered beds ──

  const filteredBeds = mockBeds.filter((b) => {
    const matchesFloor = bedFloorFilter === 'All Floors' || b.floor === bedFloorFilter;
    const matchesWard = bedWardFilter === 'All Wards' || b.wardName === bedWardFilter;
    return matchesFloor && matchesWard;
  });

  // Group beds by ward for visual layout
  const bedsByWard = filteredBeds.reduce<Record<string, Bed[]>>((acc, bed) => {
    if (!acc[bed.wardName]) acc[bed.wardName] = [];
    acc[bed.wardName].push(bed);
    return acc;
  }, {});

  // Available beds for new admission
  const availableBedsForAdmission = mockBeds.filter((b) => b.status === 'available');

  // ── Handlers ──

  function handleOpenDischarge(admission: Admission) {
    setSelectedAdmission(admission);
    setDischargeNotes('');
    setDischargeDate(new Date().toISOString().split('T')[0]);
    setShowDischargeModal(true);
  }

  function handleDischarge() {
    setShowDischargeModal(false);
    setSelectedAdmission(null);
  }

  function handleNewAdmission() {
    setShowNewAdmissionModal(false);
    setNewPatientId('');
    setNewBedId('');
    setNewDoctor('');
    setNewAdmissionType('');
    setNewDiagnosis('');
    setNewNotes('');
  }

  function handleBedClick(bed: Bed) {
    setSelectedBed(bed);
  }

  // ── Render ──

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">IP Admissions & Bed Management</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage inpatient admissions, bed assignments, and ward occupancy
            </p>
          </div>
          <button
            onClick={() => setShowNewAdmissionModal(true)}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Admission
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Beds', value: totalBeds, icon: BedDouble, color: 'text-teal-600', bg: 'bg-teal-50', iconBg: 'bg-teal-100' },
            { label: 'Available', value: availableBeds, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100' },
            { label: 'Occupied', value: occupiedBeds, icon: User, color: 'text-red-600', bg: 'bg-red-50', iconBg: 'bg-red-100' },
            { label: 'Under Maintenance', value: maintenanceBeds, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', iconBg: 'bg-amber-100' },
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

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-6">
          <nav className="flex gap-1 -mb-px" aria-label="Tabs">
            {(['admissions', 'bedmap'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium transition-colors',
                  activeTab === tab
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                )}
              >
                {tab === 'admissions' ? 'Admissions' : 'Bed Map'}
              </button>
            ))}
          </nav>
        </div>

        {/* ── Admissions Tab ── */}
        {activeTab === 'admissions' && (
          <>
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by patient, doctor, diagnosis, or ID..."
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
                  {statusFilterOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt === 'All' ? 'All Statuses' : opt}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
              </div>
              <div className="relative">
                <ArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={admissionTypeFilter}
                  onChange={(e) => {
                    setAdmissionTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors shadow-sm cursor-pointer"
                >
                  {admissionTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt === 'All' ? 'All Types' : opt}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* Admissions Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Patient
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Bed / Ward
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Admitting Doctor
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Admission Date
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Diagnosis
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Days
                      </th>
                      <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedAdmissions.length > 0 ? (
                      paginatedAdmissions.map((a) => (
                        <tr
                          key={a.id}
                          className="hover:bg-teal-50/30 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold shrink-0">
                                {a.patientName.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-700 truncate">
                                  {a.patientName}
                                </p>
                                <p className="text-xs text-slate-400 truncate">{a.patientId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <BedDouble className="h-3.5 w-3.5 text-teal-500" />
                              <span className="text-sm font-medium text-slate-700">{a.bedNumber}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{a.wardName}</p>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-slate-600">
                            {a.admittingDoctor}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-slate-500">
                            {formatDate(a.admissionDate)}
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-sm text-slate-600 max-w-[200px] truncate" title={a.diagnosis}>
                              {a.diagnosis}
                            </p>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex flex-col gap-1">
                              <span
                                className={cn(
                                  'inline-flex items-center w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold',
                                  getStatusColor(a.status)
                                )}
                              >
                                {formatStatus(a.status)}
                              </span>
                              <span
                                className={cn(
                                  'inline-flex items-center w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold',
                                  getAdmissionTypeBadge(a.admissionType)
                                )}
                              >
                                {formatStatus(a.admissionType)}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm font-medium text-slate-700">
                            {a.daysAdmitted}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {a.status === 'admitted' && (
                              <button
                                onClick={() => handleOpenDischarge(a)}
                                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <LogOut className="h-3.5 w-3.5" />
                                Discharge
                              </button>
                            )}
                            {a.status !== 'admitted' && (
                              <span className="text-xs text-slate-400">--</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-5 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <Search className="h-10 w-10 text-slate-300 mb-3" />
                            <p className="text-sm font-medium text-slate-500">No admissions found</p>
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
              {filteredAdmissions.length > 0 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 bg-slate-50/30">
                  <p className="text-xs text-slate-500">
                    Showing {(currentPage - 1) * pageSize + 1}&ndash;
                    {Math.min(currentPage * pageSize, filteredAdmissions.length)} of{' '}
                    {filteredAdmissions.length} admissions
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
          </>
        )}

        {/* ── Bed Map Tab ── */}
        {activeTab === 'bedmap' && (
          <>
            {/* Bed Map Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={bedFloorFilter}
                  onChange={(e) => setBedFloorFilter(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors shadow-sm cursor-pointer"
                >
                  {floorOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={bedWardFilter}
                  onChange={(e) => setBedWardFilter(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors shadow-sm cursor-pointer"
                >
                  {wardOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
              </div>

              {/* Legend */}
              <div className="flex items-center gap-5 sm:ml-auto">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-500">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-xs text-slate-500">Occupied</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-500">Maintenance</span>
                </div>
              </div>
            </div>

            {/* Bed Map Visual Layout */}
            <div className="space-y-6">
              {Object.entries(bedsByWard).length > 0 ? (
                Object.entries(bedsByWard).map(([wardName, beds]) => {
                  const wardFloor = beds[0]?.floor || '';
                  return (
                    <div key={wardName} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      {/* Ward Header */}
                      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/80 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-teal-500" />
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800">{wardName}</h3>
                            <p className="text-xs text-slate-400">{wardFloor}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-emerald-600 font-medium">
                            {beds.filter((b) => b.status === 'available').length} available
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-red-600 font-medium">
                            {beds.filter((b) => b.status === 'occupied').length} occupied
                          </span>
                          {beds.filter((b) => b.status === 'maintenance').length > 0 && (
                            <>
                              <span className="text-slate-300">|</span>
                              <span className="text-amber-600 font-medium">
                                {beds.filter((b) => b.status === 'maintenance').length} maintenance
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Bed Grid */}
                      <div className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {beds.map((bed) => {
                            const StatusIcon = getBedStatusIcon(bed.status);
                            return (
                              <button
                                key={bed.id}
                                onClick={() => handleBedClick(bed)}
                                className={cn(
                                  'relative rounded-lg border p-3 text-left transition-all duration-200 hover:shadow-md',
                                  getBedStatusBorder(bed.status),
                                  selectedBed?.id === bed.id ? 'ring-2 ring-teal-400 ring-offset-1' : ''
                                )}
                              >
                                {/* Status Indicator */}
                                <div className="flex items-center justify-between mb-2">
                                  <span className={cn('h-2 w-2 rounded-full', getBedStatusColor(bed.status))} />
                                  <StatusIcon className={cn(
                                    'h-3.5 w-3.5',
                                    bed.status === 'available' ? 'text-emerald-500' :
                                    bed.status === 'occupied' ? 'text-red-500' :
                                    'text-amber-500'
                                  )} />
                                </div>

                                {/* Bed Number */}
                                <p className="text-sm font-bold text-slate-800 mb-0.5">{bed.bedNumber}</p>

                                {/* Patient Info or Status */}
                                {bed.status === 'occupied' && bed.patientName ? (
                                  <p className="text-xs text-slate-600 truncate" title={bed.patientName}>
                                    {bed.patientName}
                                  </p>
                                ) : bed.status === 'maintenance' ? (
                                  <p className="text-xs text-amber-600">Under repair</p>
                                ) : (
                                  <p className="text-xs text-emerald-600">Ready</p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                    <BedDouble className="h-7 w-7 text-slate-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-700">No beds found</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Try adjusting your floor or ward filter
                  </p>
                </div>
              )}
            </div>

            {/* Bed Detail Panel */}
            {selectedBed && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-slate-800">Bed Details</h3>
                  <button
                    onClick={() => setSelectedBed(null)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Bed Number</p>
                    <p className="text-sm font-semibold text-slate-700">{selectedBed.bedNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Ward</p>
                    <p className="text-sm font-semibold text-slate-700">{selectedBed.wardName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Floor</p>
                    <p className="text-sm font-semibold text-slate-700">{selectedBed.floor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Status</p>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        getStatusColor(selectedBed.status)
                      )}
                    >
                      {formatStatus(selectedBed.status)}
                    </span>
                  </div>
                  {selectedBed.patientName && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Patient</p>
                      <p className="text-sm font-semibold text-slate-700">{selectedBed.patientName}</p>
                    </div>
                  )}
                  {selectedBed.patientId && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Patient ID</p>
                      <p className="text-sm font-semibold text-slate-700">{selectedBed.patientId}</p>
                    </div>
                  )}
                </div>
                {selectedBed.status === 'available' && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowNewAdmissionModal(true);
                        setNewBedId(selectedBed.id);
                        setSelectedBed(null);
                      }}
                      className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Assign Patient to This Bed
                    </button>
                  </div>
                )}
                {selectedBed.status === 'occupied' && selectedBed.admissionId && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        const admission = mockAdmissions.find(
                          (a) => a.id === selectedBed.admissionId && a.status === 'admitted'
                        );
                        if (admission) handleOpenDischarge(admission);
                        setSelectedBed(null);
                      }}
                      className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Discharge Patient
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── New Admission Modal ── */}
      {showNewAdmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => {
              setShowNewAdmissionModal(false);
              setNewPatientId('');
              setNewBedId('');
              setNewDoctor('');
              setNewAdmissionType('');
              setNewDiagnosis('');
              setNewNotes('');
            }}
          />
          <div className="relative z-10 mx-4 w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                  <BedDouble className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">New Admission</h2>
                  <p className="text-xs text-slate-500">Admit a patient to an inpatient bed</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNewAdmissionModal(false);
                  setNewPatientId('');
                  setNewBedId('');
                  setNewDoctor('');
                  setNewAdmissionType('');
                  setNewDiagnosis('');
                  setNewNotes('');
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Patient <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={newPatientId}
                    onChange={(e) => setNewPatientId(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors cursor-pointer"
                  >
                    <option value="">Select a patient...</option>
                    {mockPatientsForAdmission.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Bed Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Bed Assignment <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={newBedId}
                    onChange={(e) => setNewBedId(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors cursor-pointer"
                  >
                    <option value="">Select an available bed...</option>
                    {availableBedsForAdmission.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bedNumber} - {b.wardName} ({b.floor})
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Admitting Doctor */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Admitting Doctor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors cursor-pointer"
                  >
                    <option value="">Select a doctor...</option>
                    {mockDoctors.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Admission Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Admission Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={newAdmissionType}
                    onChange={(e) => setNewAdmissionType(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors cursor-pointer"
                  >
                    <option value="">Select admission type...</option>
                    <option value="emergency">Emergency</option>
                    <option value="planned">Planned</option>
                    <option value="transfer">Transfer</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors resize-none"
                  placeholder="Enter primary diagnosis and any relevant clinical details..."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Additional Notes
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors resize-none"
                  placeholder="Any additional notes, observations, or instructions..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50/50">
              <button
                onClick={() => {
                  setShowNewAdmissionModal(false);
                  setNewPatientId('');
                  setNewBedId('');
                  setNewDoctor('');
                  setNewAdmissionType('');
                  setNewDiagnosis('');
                  setNewNotes('');
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleNewAdmission}
                className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
              >
                Admit Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Discharge Modal ── */}
      {showDischargeModal && selectedAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => {
              setShowDischargeModal(false);
              setSelectedAdmission(null);
            }}
          />
          <div className="relative z-10 mx-4 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Discharge Patient</h2>
                  <p className="text-xs text-slate-500">Process discharge for the selected admission</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDischargeModal(false);
                  setSelectedAdmission(null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Admission Summary */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Admission Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Patient</p>
                    <p className="text-sm font-medium text-slate-700">{selectedAdmission.patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Patient ID</p>
                    <p className="text-sm font-medium text-slate-700">{selectedAdmission.patientId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Bed</p>
                    <p className="text-sm font-medium text-slate-700">{selectedAdmission.bedNumber} - {selectedAdmission.wardName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Doctor</p>
                    <p className="text-sm font-medium text-slate-700">{selectedAdmission.admittingDoctor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Admission Date</p>
                    <p className="text-sm font-medium text-slate-700">{formatDateTime(selectedAdmission.admissionDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Days Admitted</p>
                    <p className="text-sm font-medium text-slate-700">{selectedAdmission.daysAdmitted}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400">Diagnosis</p>
                    <p className="text-sm font-medium text-slate-700">{selectedAdmission.diagnosis}</p>
                  </div>
                </div>
              </div>

              {/* Discharge Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Discharge Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dischargeDate}
                  onChange={(e) => setDischargeDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>

              {/* Discharge Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Discharge Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors resize-none"
                  placeholder="Include discharge instructions, medications, follow-up schedule, and any other relevant notes..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50/50">
              <button
                onClick={() => {
                  setShowDischargeModal(false);
                  setSelectedAdmission(null);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDischarge}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
              >
                Discharge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

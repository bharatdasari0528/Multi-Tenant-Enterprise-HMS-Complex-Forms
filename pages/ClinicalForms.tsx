import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  FileText,
  ClipboardList,
  GripVertical,
  Type,
  AlignLeft,
  Hash,
  Calendar,
  List,
  CheckSquare,
  CircleDot,
  Heading,
  Table2,
  ChevronUp,
  ChevronDown,
  Trash2,
  Edit,
  Copy,
  Eye,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  ArrowRight,
} from 'lucide-react';
import { cn, formatDate, getStatusColor } from '../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category = 'Clinical' | 'Nursing' | 'Surgery' | 'Lab' | 'Insurance' | 'Intake';
type SubmissionStatus = 'Draft' | 'Submitted' | 'Reviewed' | 'Approved';
type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'section_header'
  | 'table_grid';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder: string;
  options: string[];
  validation: { min?: number; max?: number; pattern?: string };
}

interface FormTemplate {
  id: string;
  name: string;
  category: Category;
  version: string;
  active: boolean;
  fields: FormField[];
  createdAt: string;
}

interface Submission {
  id: string;
  templateId: string;
  templateName: string;
  category: Category;
  patient: string;
  patientId: string;
  status: SubmissionStatus;
  submittedBy: string;
  createdAt: string;
  data: Record<string, string | string[]>;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const CATEGORIES: Category[] = ['Clinical', 'Nursing', 'Surgery', 'Lab', 'Insurance', 'Intake'];

const FIELD_TYPE_CONFIG: { type: FieldType; label: string; icon: React.ElementType }[] = [
  { type: 'text', label: 'Text Input', icon: Type },
  { type: 'textarea', label: 'Text Area', icon: AlignLeft },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'dropdown', label: 'Dropdown', icon: List },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'radio', label: 'Radio Group', icon: CircleDot },
  { type: 'section_header', label: 'Section Header', icon: Heading },
  { type: 'table_grid', label: 'Table / Grid', icon: Table2 },
];

const mockTemplates: FormTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Initial Patient Assessment',
    category: 'Clinical',
    version: '2.1',
    active: true,
    createdAt: '2025-11-03',
    fields: [
      { id: 'f1', type: 'text', label: 'Chief Complaint', required: true, placeholder: 'Enter chief complaint', options: [], validation: {} },
      { id: 'f2', type: 'date', label: 'Onset Date', required: false, placeholder: '', options: [], validation: {} },
      { id: 'f3', type: 'dropdown', label: 'Severity', required: true, placeholder: 'Select severity', options: ['Mild', 'Moderate', 'Severe'], validation: {} },
      { id: 'f4', type: 'textarea', label: 'History of Present Illness', required: true, placeholder: 'Describe in detail...', options: [], validation: {} },
      { id: 'f5', type: 'checkbox', label: 'Allergies Present', required: false, placeholder: '', options: [], validation: {} },
    ],
  },
  {
    id: 'tpl-002',
    name: 'Pre-Operative Checklist',
    category: 'Surgery',
    version: '1.4',
    active: true,
    createdAt: '2025-09-18',
    fields: [
      { id: 'f1', type: 'text', label: 'Procedure Name', required: true, placeholder: 'Enter procedure', options: [], validation: {} },
      { id: 'f2', type: 'dropdown', label: 'Anesthesia Type', required: true, placeholder: 'Select type', options: ['General', 'Regional', 'Local', 'MAC'], validation: {} },
      { id: 'f3', type: 'checkbox', label: 'Consent Form Signed', required: true, placeholder: '', options: [], validation: {} },
      { id: 'f4', type: 'checkbox', label: 'NPO Verified', required: true, placeholder: '', options: [], validation: {} },
    ],
  },
  {
    id: 'tpl-003',
    name: 'Nursing Care Plan',
    category: 'Nursing',
    version: '3.0',
    active: true,
    createdAt: '2025-07-22',
    fields: [
      { id: 'f1', type: 'section_header', label: 'Patient Assessment', required: false, placeholder: '', options: [], validation: {} },
      { id: 'f2', type: 'textarea', label: 'Nursing Diagnosis', required: true, placeholder: 'Enter diagnosis', options: [], validation: {} },
      { id: 'f3', type: 'textarea', label: 'Interventions', required: true, placeholder: 'List interventions', options: [], validation: {} },
      { id: 'f4', type: 'dropdown', label: 'Outcome', required: false, placeholder: 'Select outcome', options: ['Met', 'Partially Met', 'Not Met'], validation: {} },
    ],
  },
  {
    id: 'tpl-004',
    name: 'Lab Requisition Form',
    category: 'Lab',
    version: '1.2',
    active: true,
    createdAt: '2025-10-05',
    fields: [
      { id: 'f1', type: 'dropdown', label: 'Test Category', required: true, placeholder: 'Select category', options: ['Hematology', 'Chemistry', 'Microbiology', 'Pathology'], validation: {} },
      { id: 'f2', type: 'text', label: 'Ordered By', required: true, placeholder: 'Physician name', options: [], validation: {} },
      { id: 'f3', type: 'textarea', label: 'Clinical Notes', required: false, placeholder: 'Additional notes', options: [], validation: {} },
    ],
  },
  {
    id: 'tpl-005',
    name: 'Insurance Verification',
    category: 'Insurance',
    version: '1.0',
    active: false,
    createdAt: '2025-08-14',
    fields: [
      { id: 'f1', type: 'text', label: 'Insurance Provider', required: true, placeholder: 'Provider name', options: [], validation: {} },
      { id: 'f2', type: 'text', label: 'Policy Number', required: true, placeholder: 'XXX-XXXXXX', options: [], validation: { pattern: '[A-Z]{3}-[0-9]{6}' } },
      { id: 'f3', type: 'date', label: 'Effective Date', required: true, placeholder: '', options: [], validation: {} },
      { id: 'f4', type: 'checkbox', label: 'Pre-authorization Required', required: false, placeholder: '', options: [], validation: {} },
    ],
  },
  {
    id: 'tpl-006',
    name: 'Patient Intake Form',
    category: 'Intake',
    version: '2.3',
    active: true,
    createdAt: '2025-06-01',
    fields: [
      { id: 'f1', type: 'text', label: 'Full Name', required: true, placeholder: 'First Last', options: [], validation: {} },
      { id: 'f2', type: 'date', label: 'Date of Birth', required: true, placeholder: '', options: [], validation: {} },
      { id: 'f3', type: 'radio', label: 'Gender', required: true, placeholder: '', options: ['Male', 'Female', 'Other'], validation: {} },
      { id: 'f4', type: 'text', label: 'Emergency Contact', required: true, placeholder: 'Name and phone', options: [], validation: {} },
      { id: 'f5', type: 'textarea', label: 'Current Medications', required: false, placeholder: 'List all medications', options: [], validation: {} },
      { id: 'f6', type: 'section_header', label: 'Medical History', required: false, placeholder: '', options: [], validation: {} },
      { id: 'f7', type: 'checkbox', label: 'Diabetes', required: false, placeholder: '', options: [], validation: {} },
      { id: 'f8', type: 'checkbox', label: 'Hypertension', required: false, placeholder: '', options: [], validation: {} },
    ],
  },
  {
    id: 'tpl-007',
    name: 'Discharge Summary',
    category: 'Clinical',
    version: '1.8',
    active: true,
    createdAt: '2025-12-10',
    fields: [
      { id: 'f1', type: 'text', label: 'Admitting Diagnosis', required: true, placeholder: 'Primary diagnosis', options: [], validation: {} },
      { id: 'f2', type: 'textarea', label: 'Hospital Course', required: true, placeholder: 'Summary of treatment', options: [], validation: {} },
      { id: 'f3', type: 'textarea', label: 'Discharge Instructions', required: true, placeholder: 'Follow-up instructions', options: [], validation: {} },
      { id: 'f4', type: 'dropdown', label: 'Discharge Disposition', required: true, placeholder: 'Select', options: ['Home', 'Rehab', 'SNF', 'AMA'], validation: {} },
    ],
  },
  {
    id: 'tpl-008',
    name: 'Surgical Consent Form',
    category: 'Surgery',
    version: '1.1',
    active: false,
    createdAt: '2025-04-28',
    fields: [
      { id: 'f1', type: 'text', label: 'Procedure', required: true, placeholder: 'Surgical procedure name', options: [], validation: {} },
      { id: 'f2', type: 'textarea', label: 'Risks Discussed', required: true, placeholder: 'List risks discussed', options: [], validation: {} },
      { id: 'f3', type: 'checkbox', label: 'Patient Understands Risks', required: true, placeholder: '', options: [], validation: {} },
    ],
  },
];

const mockSubmissions: Submission[] = [
  {
    id: 'SUB-2026-0141',
    templateId: 'tpl-001',
    templateName: 'Initial Patient Assessment',
    category: 'Clinical',
    patient: 'Margaret Chen',
    patientId: 'P-2026-0087',
    status: 'Approved',
    submittedBy: 'Dr. Sarah Kim',
    createdAt: '2026-05-12',
    data: { 'Chief Complaint': 'Chest pain on exertion', 'Onset Date': '2026-05-10', 'Severity': 'Moderate', 'History of Present Illness': 'Patient reports intermittent chest pain for 3 days, worse with activity. No radiation. Denies shortness of breath.', 'Allergies Present': 'Yes' },
  },
  {
    id: 'SUB-2026-0138',
    templateId: 'tpl-002',
    templateName: 'Pre-Operative Checklist',
    category: 'Surgery',
    patient: 'James Rodriguez',
    patientId: 'P-2026-0112',
    status: 'Reviewed',
    submittedBy: 'RN. Lisa Park',
    createdAt: '2026-05-13',
    data: { 'Procedure Name': 'Laparoscopic Cholecystectomy', 'Anesthesia Type': 'General', 'Consent Form Signed': 'Yes', 'NPO Verified': 'Yes' },
  },
  {
    id: 'SUB-2026-0135',
    templateId: 'tpl-006',
    templateName: 'Patient Intake Form',
    category: 'Intake',
    patient: 'Aisha Patel',
    patientId: 'P-2026-0145',
    status: 'Submitted',
    submittedBy: 'Reception',
    createdAt: '2026-05-14',
    data: { 'Full Name': 'Aisha Patel', 'Date of Birth': '1988-03-15', 'Gender': 'Female', 'Emergency Contact': 'Raj Patel (555-0142)', 'Current Medications': 'Metformin 500mg, Lisinopril 10mg', 'Diabetes': 'Yes', 'Hypertension': 'Yes' },
  },
  {
    id: 'SUB-2026-0132',
    templateId: 'tpl-004',
    templateName: 'Lab Requisition Form',
    category: 'Lab',
    patient: 'Robert Williams',
    patientId: 'P-2026-0098',
    status: 'Approved',
    submittedBy: 'Dr. Michael Torres',
    createdAt: '2026-05-11',
    data: { 'Test Category': 'Hematology', 'Ordered By': 'Dr. Michael Torres', 'Clinical Notes': 'F/U CBC for anemia workup' },
  },
  {
    id: 'SUB-2026-0129',
    templateId: 'tpl-003',
    templateName: 'Nursing Care Plan',
    category: 'Nursing',
    patient: 'Helen Morrison',
    patientId: 'P-2026-0076',
    status: 'Draft',
    submittedBy: 'RN. Karen White',
    createdAt: '2026-05-14',
    data: { 'Nursing Diagnosis': 'Impaired physical mobility r/t recent hip surgery', 'Interventions': 'Assist with ROM exercises twice daily, evaluate pain management', 'Outcome': 'Partially Met' },
  },
  {
    id: 'SUB-2026-0126',
    templateId: 'tpl-007',
    templateName: 'Discharge Summary',
    category: 'Clinical',
    patient: 'David Nakamura',
    patientId: 'P-2026-0054',
    status: 'Approved',
    submittedBy: 'Dr. Emily Chang',
    createdAt: '2026-05-10',
    data: { 'Admitting Diagnosis': 'Acute Appendicitis', 'Hospital Course': 'Laparoscopic appendectomy performed on admission. Uncomplicated post-op course.', 'Discharge Instructions': 'Keep incision dry, follow up in 7 days, return for fever >101F', 'Discharge Disposition': 'Home' },
  },
  {
    id: 'SUB-2026-0123',
    templateId: 'tpl-005',
    templateName: 'Insurance Verification',
    category: 'Insurance',
    patient: 'Susan O\'Brien',
    patientId: 'P-2026-0130',
    status: 'Submitted',
    submittedBy: 'Billing Dept',
    createdAt: '2026-05-09',
    data: { 'Insurance Provider': 'BlueCross BlueShield', 'Policy Number': 'BCI-938472', 'Effective Date': '2026-01-01', 'Pre-authorization Required': 'Yes' },
  },
  {
    id: 'SUB-2026-0120',
    templateId: 'tpl-001',
    templateName: 'Initial Patient Assessment',
    category: 'Clinical',
    patient: 'Thomas Green',
    patientId: 'P-2026-0156',
    status: 'Draft',
    submittedBy: 'Dr. Sarah Kim',
    createdAt: '2026-05-15',
    data: { 'Chief Complaint': 'Persistent headache', 'Severity': 'Mild', 'History of Present Illness': 'Recurring tension headaches for 2 weeks, worse in morning.' },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const categoryColor: Record<Category, string> = {
  Clinical: 'bg-teal-100 text-teal-800',
  Nursing: 'bg-cyan-100 text-cyan-800',
  Surgery: 'bg-orange-100 text-orange-800',
  Lab: 'bg-sky-100 text-sky-800',
  Insurance: 'bg-amber-100 text-amber-800',
  Intake: 'bg-slate-100 text-slate-800',
};

let fieldIdCounter = 100;
function newFieldId() {
  return `bf-${++fieldIdCounter}`;
}

function createDefaultField(type: FieldType): FormField {
  return {
    id: newFieldId(),
    type,
    label: FIELD_TYPE_CONFIG.find((f) => f.type === type)?.label ?? 'Field',
    required: false,
    placeholder: type === 'section_header' || type === 'checkbox' ? '' : 'Enter value...',
    options: type === 'dropdown' || type === 'radio' ? ['Option 1', 'Option 2'] : [],
    validation: {},
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type TabId = 'templates' | 'submissions' | 'builder';

export default function ClinicalForms() {
  // Tab
  const [activeTab, setActiveTab] = useState<TabId>('templates');

  // --- Templates state ---
  const [templates, setTemplates] = useState<FormTemplate[]>(mockTemplates);
  const [tplSearch, setTplSearch] = useState('');
  const [tplCategory, setTplCategory] = useState<'All' | Category>('All');

  // --- Submissions state ---
  const [submissions] = useState<Submission[]>(mockSubmissions);
  const [subSearch, setSubSearch] = useState('');
  const [subTemplate, setSubTemplate] = useState<string>('All');
  const [subStatus, setSubStatus] = useState<'All' | SubmissionStatus>('All');

  // --- Modals ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // --- Form Builder state ---
  const [builderFields, setBuilderFields] = useState<FormField[]>([]);
  const [builderName, setBuilderName] = useState('');
  const [builderCategory, setBuilderCategory] = useState<Category>('Clinical');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // --- Create template form ---
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Clinical');

  // Derived
  const selectedField = builderFields.find((f) => f.id === selectedFieldId) ?? null;

  // ---- Filtered templates ----
  const filteredTemplates = templates.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(tplSearch.toLowerCase());
    const matchCat = tplCategory === 'All' || t.category === tplCategory;
    return matchSearch && matchCat;
  });

  // ---- Filtered submissions ----
  const filteredSubmissions = submissions.filter((s) => {
    const matchSearch =
      s.patient.toLowerCase().includes(subSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(subSearch.toLowerCase());
    const matchTemplate = subTemplate === 'All' || s.templateId === subTemplate;
    const matchStatus = subStatus === 'All' || s.status === subStatus;
    return matchSearch && matchTemplate && matchStatus;
  });

  // ---- Handlers ----
  const toggleTemplateActive = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
    );
  };

  const duplicateTemplate = (tpl: FormTemplate) => {
    const newTpl: FormTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      name: `${tpl.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      version: '1.0',
    };
    setTemplates((prev) => [...prev, newTpl]);
  };

  const openCreateAndEdit = () => {
    setBuilderName(newName);
    setBuilderCategory(newCategory);
    setBuilderFields([]);
    setSelectedFieldId(null);
    setShowCreateModal(false);
    setActiveTab('builder');
  };

  const addField = (type: FieldType) => {
    const field = createDefaultField(type);
    setBuilderFields((prev) => [...prev, field]);
    setSelectedFieldId(field.id);
  };

  const removeField = (id: string) => {
    setBuilderFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    setBuilderFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx < 0) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return arr;
    });
  };

  const updateField = (id: string, patch: Partial<FormField>) => {
    setBuilderFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );
  };

  const saveBuilderTemplate = () => {
    const newTpl: FormTemplate = {
      id: `tpl-${Date.now()}`,
      name: builderName || 'Untitled Template',
      category: builderCategory,
      version: '1.0',
      active: true,
      fields: builderFields,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTemplates((prev) => [...prev, newTpl]);
    setBuilderFields([]);
    setBuilderName('');
    setSelectedFieldId(null);
    setActiveTab('templates');
  };

  const openSubmissionDetail = (sub: Submission) => {
    setSelectedSubmission(sub);
    setShowSubmissionModal(true);
  };

  const viewTemplateSubmissions = (tplId: string) => {
    setSubTemplate(tplId);
    setActiveTab('submissions');
  };

  // =====================================================================
  // RENDER
  // =====================================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ---- Header ---- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Clinical Forms</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage form templates, track submissions, and build new clinical forms
              </p>
            </div>
            <button
              onClick={() => { setNewName(''); setNewCategory('Clinical'); setShowCreateModal(true); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ---- Tabs ---- */}
        <div className="border-b border-slate-200 mb-6">
          <nav className="flex gap-6 -mb-px" aria-label="Tabs">
            {([
              { id: 'templates' as TabId, label: 'Form Templates', icon: FileText },
              { id: 'submissions' as TabId, label: 'Submissions', icon: ClipboardList },
              { id: 'builder' as TabId, label: 'Form Builder', icon: GripVertical },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ---- TEMPLATES TAB ---- */}
        {activeTab === 'templates' && (
          <section>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={tplSearch}
                  onChange={(e) => setTplSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={tplCategory}
                  onChange={(e) => setTplCategory(e.target.value as typeof tplCategory)}
                  className="py-2.5 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Template Cards Grid */}
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No templates found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => viewTemplateSubmissions(tpl.id)}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', categoryColor[tpl.category])}>
                        {tpl.category}
                      </span>
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                          tpl.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {tpl.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors leading-snug">
                      {tpl.name}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <span>v{tpl.version}</span>
                      <span>{tpl.fields.length} fields</span>
                      <span>{formatDate(tpl.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1 border-t border-slate-100 pt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {/* edit: navigate to builder */}}
                        className="p-1.5 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateTemplate(tpl)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleTemplateActive(tpl.id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                        title={tpl.active ? 'Deactivate' : 'Activate'}
                      >
                        {tpl.active ? (
                          <ToggleRight className="w-4 h-4 text-teal-500" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ---- SUBMISSIONS TAB ---- */}
        {activeTab === 'submissions' && (
          <section>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by patient or ID..."
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={subTemplate}
                  onChange={(e) => setSubTemplate(e.target.value)}
                  className="py-2.5 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="All">All Templates</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <select
                value={subStatus}
                onChange={(e) => setSubStatus(e.target.value as typeof subStatus)}
                className="py-2.5 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="All">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Approved">Approved</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Submission ID</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Template</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Patient</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Submitted By</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Created</th>
                      <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">
                          <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          No submissions found
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub) => (
                        <tr
                          key={sub.id}
                          className="hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => openSubmissionDetail(sub)}
                        >
                          <td className="px-4 py-3 font-mono text-xs text-slate-700">{sub.id}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">{sub.templateName}</div>
                            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium mt-0.5', categoryColor[sub.category])}>
                              {sub.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{sub.patient}</td>
                          <td className="px-4 py-3">
                            <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(sub.status.toLowerCase()))}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{sub.submittedBy}</td>
                          <td className="px-4 py-3 text-slate-500">{formatDate(sub.createdAt)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); openSubmissionDetail(sub); }}
                              className="p-1.5 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ---- FORM BUILDER TAB ---- */}
        {activeTab === 'builder' && (
          <section>
            {/* Builder Top Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="text"
                  placeholder="Template Name"
                  value={builderName}
                  onChange={(e) => setBuilderName(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <select
                  value={builderCategory}
                  onChange={(e) => setBuilderCategory(e.target.value as Category)}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={saveBuilderTemplate}
                disabled={builderFields.length === 0 || !builderName.trim()}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                  builderFields.length > 0 && builderName.trim()
                    ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                )}
              >
                <Save className="w-4 h-4" />
                Save Template
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* ---- Left: Field Palette ---- */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Field Types</h3>
                  <div className="space-y-1.5">
                    {FIELD_TYPE_CONFIG.map((ft) => (
                      <button
                        key={ft.type}
                        onClick={() => addField(ft.type)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors text-left"
                      >
                        <ft.icon className="w-4 h-4 flex-shrink-0 text-slate-400" />
                        <span>{ft.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ---- Center: Canvas ---- */}
              <div className="lg:col-span-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 min-h-[500px]">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                    Form Preview
                  </h3>

                  {builderFields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <GripVertical className="w-10 h-10 mb-3 opacity-50" />
                      <p className="text-sm">Add fields from the palette to start building</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {builderFields.map((field, idx) => (
                        <div
                          key={field.id}
                          onClick={() => setSelectedFieldId(field.id)}
                          className={cn(
                            'relative border rounded-lg p-4 transition-all cursor-pointer group',
                            selectedFieldId === field.id
                              ? 'border-teal-400 bg-teal-50/50 ring-1 ring-teal-400'
                              : 'border-slate-200 hover:border-slate-300 bg-white',
                          )}
                        >
                          {/* Row controls */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); moveField(field.id, 'up'); }}
                              disabled={idx === 0}
                              className={cn('p-1 rounded', idx === 0 ? 'text-slate-200' : 'text-slate-400 hover:text-teal-600 hover:bg-teal-100')}
                              title="Move up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); moveField(field.id, 'down'); }}
                              disabled={idx === builderFields.length - 1}
                              className={cn('p-1 rounded', idx === builderFields.length - 1 ? 'text-slate-200' : 'text-slate-400 hover:text-teal-600 hover:bg-teal-100')}
                              title="Move down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Field rendering */}
                          {field.type === 'section_header' ? (
                            <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2">
                              {field.label}
                            </h4>
                          ) : (
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-0.5">*</span>}
                              </label>
                              {field.type === 'text' && (
                                <input
                                  type="text"
                                  placeholder={field.placeholder}
                                  disabled
                                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 text-slate-400"
                                />
                              )}
                              {field.type === 'textarea' && (
                                <textarea
                                  placeholder={field.placeholder}
                                  disabled
                                  rows={2}
                                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 text-slate-400 resize-none"
                                />
                              )}
                              {field.type === 'number' && (
                                <input
                                  type="number"
                                  placeholder={field.placeholder}
                                  disabled
                                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 text-slate-400"
                                />
                              )}
                              {field.type === 'date' && (
                                <input
                                  type="date"
                                  disabled
                                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 text-slate-400"
                                />
                              )}
                              {field.type === 'dropdown' && (
                                <select disabled className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 text-slate-400">
                                  <option>{field.placeholder || 'Select...'}</option>
                                  {field.options.map((o, i) => <option key={i}>{o}</option>)}
                                </select>
                              )}
                              {field.type === 'checkbox' && (
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" disabled className="w-4 h-4 rounded border-slate-300 text-teal-600" />
                                  <span className="text-sm text-slate-400">{field.label}</span>
                                </div>
                              )}
                              {field.type === 'radio' && (
                                <div className="flex gap-4">
                                  {field.options.map((o, i) => (
                                    <label key={i} className="flex items-center gap-1.5 text-sm text-slate-400">
                                      <input type="radio" disabled name={field.id} className="w-3.5 h-3.5 border-slate-300 text-teal-600" />
                                      {o}
                                    </label>
                                  ))}
                                </div>
                              )}
                              {field.type === 'table_grid' && (
                                <div className="border border-dashed border-slate-300 rounded-md p-4 text-center text-xs text-slate-400">
                                  Table / Grid ({field.options.length || 2} columns)
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ---- Right: Properties Panel ---- */}
              <div className="lg:col-span-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                    Field Properties
                  </h3>

                  {selectedField ? (
                    <div className="space-y-4">
                      {/* Field Type indicator */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-md px-3 py-2">
                        {(() => {
                          const cfg = FIELD_TYPE_CONFIG.find((c) => c.type === selectedField.type);
                          if (!cfg) return null;
                          const Icon = cfg.icon;
                          return (
                            <>
                              <Icon className="w-3.5 h-3.5" />
                              <span>{cfg.label}</span>
                            </>
                          );
                        })()}
                      </div>

                      {/* Label */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Label</label>
                        <input
                          type="text"
                          value={selectedField.label}
                          onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      {/* Required toggle */}
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-700">Required</label>
                        <button
                          onClick={() => updateField(selectedField.id, { required: !selectedField.required })}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            selectedField.required ? 'bg-teal-500' : 'bg-slate-200',
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow',
                              selectedField.required ? 'translate-x-6' : 'translate-x-1',
                            )}
                          />
                        </button>
                      </div>

                      {/* Placeholder (not for checkbox, section_header, table_grid) */}
                      {!['checkbox', 'section_header', 'table_grid'].includes(selectedField.type) && (
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Placeholder</label>
                          <input
                            type="text"
                            value={selectedField.placeholder}
                            onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                      )}

                      {/* Options (for dropdown / radio) */}
                      {(selectedField.type === 'dropdown' || selectedField.type === 'radio') && (
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Options</label>
                          <div className="space-y-2">
                            {selectedField.options.map((opt, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const newOpts = [...selectedField.options];
                                    newOpts[idx] = e.target.value;
                                    updateField(selectedField.id, { options: newOpts });
                                  }}
                                  className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                                <button
                                  onClick={() => {
                                    const newOpts = selectedField.options.filter((_, i) => i !== idx);
                                    updateField(selectedField.id, { options: newOpts });
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() =>
                                updateField(selectedField.id, {
                                  options: [...selectedField.options, `Option ${selectedField.options.length + 1}`],
                                })
                              }
                              className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Add Option
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Validation (for number and text) */}
                      {(selectedField.type === 'number' || selectedField.type === 'text') && (
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-2">Validation</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-0.5">Min</label>
                              <input
                                type="number"
                                value={selectedField.validation.min ?? ''}
                                onChange={(e) =>
                                  updateField(selectedField.id, {
                                    validation: { ...selectedField.validation, min: e.target.value ? Number(e.target.value) : undefined },
                                  })
                                }
                                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-0.5">Max</label>
                              <input
                                type="number"
                                value={selectedField.validation.max ?? ''}
                                onChange={(e) =>
                                  updateField(selectedField.id, {
                                    validation: { ...selectedField.validation, max: e.target.value ? Number(e.target.value) : undefined },
                                  })
                                }
                                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              />
                            </div>
                          </div>
                          {selectedField.type === 'text' && (
                            <div className="mt-2">
                              <label className="block text-[10px] text-slate-500 mb-0.5">Pattern (regex)</label>
                              <input
                                type="text"
                                value={selectedField.validation.pattern ?? ''}
                                onChange={(e) =>
                                  updateField(selectedField.id, {
                                    validation: { ...selectedField.validation, pattern: e.target.value || undefined },
                                  })
                                }
                                placeholder="e.g. [A-Z]{3}-[0-9]{6}"
                                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <Edit className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm text-center">Select a field on the canvas to edit its properties</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ---- Create Template Modal ---- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Create Template</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Physical Therapy Assessment"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Category)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={openCreateAndEdit}
                disabled={!newName.trim()}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  newName.trim()
                    ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
                    : 'bg-teal-300 text-white cursor-not-allowed',
                )}
              >
                Create &amp; Edit
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- View Submission Modal ---- */}
      {showSubmissionModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setShowSubmissionModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between rounded-t-xl">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{selectedSubmission.templateName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', categoryColor[selectedSubmission.category])}>
                    {selectedSubmission.category}
                  </span>
                  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(selectedSubmission.status.toLowerCase()))}>
                    {selectedSubmission.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient info */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-500">Patient</span>
                  <p className="font-medium text-slate-900">{selectedSubmission.patient}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Patient ID</span>
                  <p className="font-mono text-slate-700">{selectedSubmission.patientId}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Submitted By</span>
                  <p className="text-slate-700">{selectedSubmission.submittedBy}</p>
                </div>
              </div>
            </div>

            {/* Form data */}
            <div className="px-6 py-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Form Data</h3>
              <div className="space-y-4">
                {Object.entries(selectedSubmission.data).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-4">
                    <label className="text-sm font-medium text-slate-600 self-start">{key}</label>
                    <div className="col-span-2 text-sm text-slate-900 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review actions */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
              {selectedSubmission.status !== 'Approved' && (
                <>
                  <button
                    onClick={() => setShowSubmissionModal(false)}
                    className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    Request Changes
                  </button>
                  <button
                    onClick={() => setShowSubmissionModal(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

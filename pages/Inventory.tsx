import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Package,
  AlertTriangle,
  ShoppingCart,
  Edit,
  ChevronLeft,
  ChevronRight,
  Warehouse,
  Tag,
  MapPin,
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

// --- Types ---

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  quantity: number;
  reorderLevel: number;
  supplier: string;
  location: string;
  status: 'active' | 'low_stock' | 'out_of_stock';
}

// --- Mock Data ---

const initialItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Surgical Gloves (Box of 100)',
    sku: 'INV-MS-001',
    category: 'Medical Supplies',
    unitPrice: 12.5,
    quantity: 450,
    reorderLevel: 100,
    supplier: 'MedSupply Corp.',
    location: 'Warehouse A - Shelf 3',
    status: 'active',
  },
  {
    id: '2',
    name: ' Disposable Syringes 5mL (Box of 100)',
    sku: 'INV-MS-002',
    category: 'Medical Supplies',
    unitPrice: 18.75,
    quantity: 320,
    reorderLevel: 80,
    supplier: 'MedSupply Corp.',
    location: 'Warehouse A - Shelf 5',
    status: 'active',
  },
  {
    id: '3',
    name: 'Patient Monitor (Vital Signs)',
    sku: 'INV-EQ-001',
    category: 'Equipment',
    unitPrice: 2850.0,
    quantity: 8,
    reorderLevel: 3,
    supplier: 'HealthTech Systems',
    location: 'Bldg 2 - Equipment Rm',
    status: 'active',
  },
  {
    id: '4',
    name: 'IV Infusion Set',
    sku: 'INV-MS-003',
    category: 'Medical Supplies',
    unitPrice: 3.25,
    quantity: 55,
    reorderLevel: 100,
    supplier: 'MedLine Distributors',
    location: 'Warehouse A - Shelf 7',
    status: 'low_stock',
  },
  {
    id: '5',
    name: 'Amoxicillin 500mg (Box of 50)',
    sku: 'INV-MD-001',
    category: 'Medications',
    unitPrice: 42.0,
    quantity: 0,
    reorderLevel: 40,
    supplier: 'PharmaCare Inc.',
    location: 'Pharmacy - Cabinet B',
    status: 'out_of_stock',
  },
  {
    id: '6',
    name: 'N95 Respirator Masks (Box of 20)',
    sku: 'INV-PE-001',
    category: 'PPE',
    unitPrice: 28.5,
    quantity: 15,
    reorderLevel: 50,
    supplier: 'SafeGuard Medical',
    location: 'Warehouse B - Shelf 1',
    status: 'low_stock',
  },
  {
    id: '7',
    name: 'Sterile Gauze Pads 4x4 (Box of 200)',
    sku: 'INV-MS-004',
    category: 'Medical Supplies',
    unitPrice: 15.0,
    quantity: 280,
    reorderLevel: 60,
    supplier: 'MedLine Distributors',
    location: 'Warehouse A - Shelf 4',
    status: 'active',
  },
  {
    id: '8',
    name: 'Defibrillator (AED)',
    sku: 'INV-EQ-002',
    category: 'Equipment',
    unitPrice: 1500.0,
    quantity: 4,
    reorderLevel: 2,
    supplier: 'HealthTech Systems',
    location: 'Bldg 1 - Nurse Station',
    status: 'active',
  },
  {
    id: '9',
    name: 'Lisinopril 10mg (Box of 100)',
    sku: 'INV-MD-002',
    category: 'Medications',
    unitPrice: 65.0,
    quantity: 0,
    reorderLevel: 30,
    supplier: 'PharmaCare Inc.',
    location: 'Pharmacy - Cabinet A',
    status: 'out_of_stock',
  },
  {
    id: '10',
    name: 'Print Paper A4 (Ream of 500)',
    sku: 'INV-OS-001',
    category: 'Office Supplies',
    unitPrice: 8.5,
    quantity: 120,
    reorderLevel: 40,
    supplier: 'OfficePro Supplies',
    location: 'Admin Bldg - Store Rm',
    status: 'active',
  },
  {
    id: '11',
    name: 'Hospital Gown (Pack of 50)',
    sku: 'INV-LN-001',
    category: 'Linen',
    unitPrice: 75.0,
    quantity: 30,
    reorderLevel: 40,
    supplier: 'CleanTextile Co.',
    location: 'Laundry Rm - Bin 2',
    status: 'low_stock',
  },
  {
    id: '12',
    name: 'Enteral Nutrition Formula (Case of 24)',
    sku: 'INV-FN-001',
    category: 'Food & Nutrition',
    unitPrice: 54.0,
    quantity: 90,
    reorderLevel: 30,
    supplier: 'NutriCare Foods',
    location: 'Kitchen - Cold Storage',
    status: 'active',
  },
  {
    id: '13',
    name: 'Surgical Mask (Box of 50)',
    sku: 'INV-PE-002',
    category: 'PPE',
    unitPrice: 14.0,
    quantity: 200,
    reorderLevel: 60,
    supplier: 'SafeGuard Medical',
    location: 'Warehouse B - Shelf 2',
    status: 'active',
  },
  {
    id: '14',
    name: 'Blood Glucose Test Strips (Box of 50)',
    sku: 'INV-EQ-003',
    category: 'Equipment',
    unitPrice: 32.0,
    quantity: 25,
    reorderLevel: 40,
    supplier: 'HealthTech Systems',
    location: 'Lab - Cabinet C',
    status: 'low_stock',
  },
  {
    id: '15',
    name: 'Bed Sheets (Pack of 25)',
    sku: 'INV-LN-002',
    category: 'Linen',
    unitPrice: 120.0,
    quantity: 85,
    reorderLevel: 30,
    supplier: 'CleanTextile Co.',
    location: 'Laundry Rm - Bin 4',
    status: 'active',
  },
  {
    id: '16',
    name: 'Hand Sanitizer 500mL (Case of 12)',
    sku: 'INV-MS-005',
    category: 'Medical Supplies',
    unitPrice: 36.0,
    quantity: 0,
    reorderLevel: 20,
    supplier: 'MedLine Distributors',
    location: 'Warehouse A - Shelf 1',
    status: 'out_of_stock',
  },
  {
    id: '17',
    name: 'Face Shield (Pack of 10)',
    sku: 'INV-PE-003',
    category: 'PPE',
    unitPrice: 22.0,
    quantity: 65,
    reorderLevel: 25,
    supplier: 'SafeGuard Medical',
    location: 'Warehouse B - Shelf 3',
    status: 'active',
  },
  {
    id: '18',
    name: 'Ibuprofen 400mg (Box of 100)',
    sku: 'INV-MD-003',
    category: 'Medications',
    unitPrice: 38.0,
    quantity: 18,
    reorderLevel: 35,
    supplier: 'PharmaCare Inc.',
    location: 'Pharmacy - Cabinet B',
    status: 'low_stock',
  },
  {
    id: '19',
    name: 'Toner Cartridge (HP LaserJet)',
    sku: 'INV-OS-002',
    category: 'Office Supplies',
    unitPrice: 89.0,
    quantity: 12,
    reorderLevel: 5,
    supplier: 'OfficePro Supplies',
    location: 'Admin Bldg - Store Rm',
    status: 'active',
  },
  {
    id: '20',
    name: 'Specialty Diet Meal Trays (Case of 24)',
    sku: 'INV-FN-002',
    category: 'Food & Nutrition',
    unitPrice: 48.0,
    quantity: 40,
    reorderLevel: 20,
    supplier: 'NutriCare Foods',
    location: 'Kitchen - Dry Storage',
    status: 'active',
  },
];

// --- Constants ---

const CATEGORIES = [
  'All',
  'Medical Supplies',
  'Equipment',
  'Medications',
  'PPE',
  'Office Supplies',
  'Linen',
  'Food & Nutrition',
];

const STATUS_OPTIONS = ['All', 'Active', 'Low Stock', 'Out of Stock'];

const ITEM_CATEGORIES = CATEGORIES.filter((c) => c !== 'All');

const ITEM_STATUSES: InventoryItem['status'][] = ['active', 'low_stock', 'out_of_stock'];

// --- Helper ---

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function formatInvStatus(status: string) {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getInvStatusColor(status: string) {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    low_stock: 'bg-amber-100 text-amber-800',
    out_of_stock: 'bg-red-100 text-red-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
}

// --- Component ---

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);

  // Item form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Medical Supplies');
  const [formSku, setFormSku] = useState('');
  const [formUnitPrice, setFormUnitPrice] = useState(0);
  const [formQuantity, setFormQuantity] = useState(0);
  const [formReorderLevel, setFormReorderLevel] = useState(0);
  const [formSupplier, setFormSupplier] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formStatus, setFormStatus] = useState<InventoryItem['status']>('active');

  // Restock form state
  const [restockQty, setRestockQty] = useState(0);
  const [restockNotes, setRestockNotes] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // --- Computed Stats ---
  const totalItems = items.length;
  const inStock = items.filter((i) => i.status === 'active').length;
  const lowStock = items.filter((i) => i.status === 'low_stock').length;
  const outOfStock = items.filter((i) => i.status === 'out_of_stock').length;

  // --- Filtered Items ---
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      search === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      item.status === statusFilter.toLowerCase().replace(' ', '_');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  // --- Form Handlers ---
  const resetItemForm = () => {
    setFormName('');
    setFormCategory('Medical Supplies');
    setFormSku('');
    setFormUnitPrice(0);
    setFormQuantity(0);
    setFormReorderLevel(0);
    setFormSupplier('');
    setFormLocation('');
    setFormStatus('active');
    setEditingItem(null);
  };

  const openAddItemModal = () => {
    resetItemForm();
    setShowItemModal(true);
  };

  const openEditItemModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormSku(item.sku);
    setFormUnitPrice(item.unitPrice);
    setFormQuantity(item.quantity);
    setFormReorderLevel(item.reorderLevel);
    setFormSupplier(item.supplier);
    setFormLocation(item.location);
    setFormStatus(item.status);
    setShowItemModal(true);
  };

  const handleSaveItem = () => {
    if (!formName || !formSku) return;

    const computedStatus: InventoryItem['status'] =
      formQuantity === 0
        ? 'out_of_stock'
        : formQuantity <= formReorderLevel
          ? 'low_stock'
          : 'active';

    if (editingItem) {
      setItems(
        items.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                name: formName,
                category: formCategory,
                sku: formSku,
                unitPrice: formUnitPrice,
                quantity: formQuantity,
                reorderLevel: formReorderLevel,
                supplier: formSupplier,
                location: formLocation,
                status: formStatus === 'active' && computedStatus !== 'active' ? computedStatus : formStatus,
              }
            : i
        )
      );
    } else {
      const newItem: InventoryItem = {
        id: generateId(),
        name: formName,
        category: formCategory,
        sku: formSku,
        unitPrice: formUnitPrice,
        quantity: formQuantity,
        reorderLevel: formReorderLevel,
        supplier: formSupplier,
        location: formLocation,
        status: computedStatus,
      };
      setItems([newItem, ...items]);
    }
    setShowItemModal(false);
    resetItemForm();
  };

  const openRestockModal = (item: InventoryItem) => {
    setRestockItem(item);
    setRestockQty(0);
    setRestockNotes('');
    setShowRestockModal(true);
  };

  const handleRestock = () => {
    if (!restockItem || restockQty <= 0) return;
    const newQuantity = restockItem.quantity + restockQty;
    const newStatus: InventoryItem['status'] =
      newQuantity > restockItem.reorderLevel ? 'active' : 'low_stock';

    setItems(
      items.map((i) =>
        i.id === restockItem.id
          ? { ...i, quantity: newQuantity, status: newStatus }
          : i
      )
    );
    setShowRestockModal(false);
    setRestockItem(null);
  };

  // --- Stats Config ---
  const stats = [
    {
      label: 'Total Items',
      value: String(totalItems),
      icon: Package,
      colorClass: 'text-teal-600',
      iconBgClass: 'bg-teal-100',
    },
    {
      label: 'In Stock',
      value: String(inStock),
      icon: Warehouse,
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

  const getRowBackground = (item: InventoryItem) => {
    if (item.status === 'out_of_stock') return 'bg-red-50/60';
    if (item.status === 'low_stock') return 'bg-amber-50/60';
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Inventory Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track hospital supplies, equipment, and stock levels
          </p>
        </div>
        <button
          onClick={openAddItemModal}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add Item
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
              placeholder="Search by name, SKU, or supplier..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
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
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Item Name
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  SKU
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Category
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Unit Price
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Quantity
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Reorder Lvl
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Supplier
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Location
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
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center">
                    <Package className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-2 text-sm font-medium text-slate-500">No inventory items found</p>
                    <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className={cn(
                      'hover:bg-slate-50/50 transition-colors',
                      getRowBackground(item)
                    )}
                  >
                    <td className="px-4 py-3.5 text-sm font-semibold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                          item.status === 'out_of_stock' ? 'bg-red-100' : item.status === 'low_stock' ? 'bg-amber-100' : 'bg-teal-50'
                        )}>
                          <Package className={cn(
                            'h-4 w-4',
                            item.status === 'out_of_stock' ? 'text-red-500' : item.status === 'low_stock' ? 'text-amber-500' : 'text-teal-600'
                          )} />
                        </div>
                        <span className="truncate max-w-[200px]">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-600">
                        <Tag className="h-3 w-3 text-slate-400" />
                        {item.sku}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-800 text-right whitespace-nowrap font-medium">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          item.quantity === 0
                            ? 'text-red-600'
                            : item.quantity <= item.reorderLevel
                              ? 'text-amber-600'
                              : 'text-slate-800'
                        )}
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-sm text-slate-500">
                      {item.reorderLevel}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                      {item.supplier}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {item.location}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                          getInvStatusColor(item.status)
                        )}
                      >
                        {item.status === 'out_of_stock' && (
                          <ShoppingCart className="h-3 w-3" />
                        )}
                        {item.status === 'low_stock' && (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {formatInvStatus(item.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditItemModal(item)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          title="Edit Item"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openRestockModal(item)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          title="Restock"
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
            Showing {paginatedItems.length} of {filteredItems.length} items
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  page === 1
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'h-8 w-8 rounded-md text-xs font-semibold transition-colors',
                    p === page
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  page === totalPages
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
      {/* Add/Edit Item Modal    */}
      {/* ====================== */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-8 pb-8">
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingItem ? 'Edit Item' : 'Add Item'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {editingItem ? 'Update inventory item details' : 'Enter details for the new inventory item'}
                </p>
              </div>
              <button
                onClick={() => { resetItemForm(); setShowItemModal(false); }}
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
              {/* Row: Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Surgical Gloves (Box of 100)"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., INV-MS-001"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>

              {/* Row: Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                  >
                    {ITEM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as InventoryItem['status'])}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors appearance-none cursor-pointer"
                  >
                    {ITEM_STATUSES.map((s) => (
                      <option key={s} value={s}>{formatInvStatus(s)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Row: Unit Price, Quantity, Reorder Level */}
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
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value) || 0)}
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

              {/* Row: Supplier & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Supplier</label>
                  <input
                    type="text"
                    placeholder="e.g., MedSupply Corp."
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Warehouse A - Shelf 3"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => { resetItemForm(); setShowItemModal(false); }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                disabled={!formName || !formSku}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                  !formName || !formSku
                    ? 'bg-teal-300 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* Restock Modal          */}
      {/* ====================== */}
      {showRestockModal && restockItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-8 pb-8">
          <div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Restock Item</h2>
                <p className="mt-0.5 text-xs text-slate-400">Add quantity to existing inventory</p>
              </div>
              <button
                onClick={() => { setShowRestockModal(false); setRestockItem(null); }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Current Item Info */}
              <div className="rounded-lg border border-slate-100 bg-gradient-to-br from-teal-50 to-slate-50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
                    restockItem.status === 'out_of_stock' ? 'bg-red-100' : restockItem.status === 'low_stock' ? 'bg-amber-100' : 'bg-teal-100'
                  )}>
                    <Package className={cn(
                      'h-5 w-5',
                      restockItem.status === 'out_of_stock' ? 'text-red-600' : restockItem.status === 'low_stock' ? 'text-amber-600' : 'text-teal-600'
                    )} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{restockItem.name}</p>
                    <p className="text-xs text-slate-500">{restockItem.sku}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-white/70 px-3 py-2">
                    <p className="text-xs text-slate-500">Current Qty</p>
                    <p className={cn(
                      'text-lg font-bold',
                      restockItem.quantity === 0 ? 'text-red-600' : restockItem.quantity <= restockItem.reorderLevel ? 'text-amber-600' : 'text-slate-800'
                    )}>
                      {restockItem.quantity}
                    </p>
                  </div>
                  <div className="rounded-md bg-white/70 px-3 py-2">
                    <p className="text-xs text-slate-500">Reorder Level</p>
                    <p className="text-lg font-bold text-slate-800">{restockItem.reorderLevel}</p>
                  </div>
                </div>
              </div>

              {/* Quantity to Add */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  min={1}
                  value={restockQty || ''}
                  onChange={(e) => setRestockQty(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                  placeholder="Enter quantity to add"
                />
              </div>

              {/* New Total Preview */}
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-600">New Total</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {restockItem.quantity + (restockQty > 0 ? restockQty : 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-emerald-600">Status After Restock</p>
                    <p className="text-sm font-semibold">
                      {(restockItem.quantity + (restockQty > 0 ? restockQty : 0)) > restockItem.reorderLevel
                        ? <span className="text-green-700">In Stock</span>
                        : (restockItem.quantity + (restockQty > 0 ? restockQty : 0)) === 0
                          ? <span className="text-red-600">Out of Stock</span>
                          : <span className="text-amber-600">Low Stock</span>
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  value={restockNotes}
                  onChange={(e) => setRestockNotes(e.target.value)}
                  rows={3}
                  placeholder="Optional notes about this restock..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => { setShowRestockModal(false); setRestockItem(null); }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestock}
                disabled={restockQty <= 0}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                  restockQty <= 0
                    ? 'bg-emerald-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Restock
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

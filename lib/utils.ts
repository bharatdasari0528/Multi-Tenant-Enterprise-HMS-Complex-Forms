export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function generatePatientId(count: number) {
  const year = new Date().getFullYear();
  return `P-${year}-${String(count).padStart(4, '0')}`;
}

export function generateInvoiceNumber(count: number) {
  const year = new Date().getFullYear();
  return `INV-${year}-${String(count).padStart(4, '0')}`;
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getRoleBadgeColor(role: string) {
  const colors: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-800',
    admin: 'bg-orange-100 text-orange-800',
    doctor: 'bg-blue-100 text-blue-800',
    nurse: 'bg-teal-100 text-teal-800',
    pharmacist: 'bg-emerald-100 text-emerald-800',
    lab_tech: 'bg-cyan-100 text-cyan-800',
    receptionist: 'bg-amber-100 text-amber-800',
    billing: 'bg-yellow-100 text-yellow-800',
    hr: 'bg-pink-100 text-pink-800',
    inventory: 'bg-slate-100 text-slate-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    available: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    paid: 'bg-green-100 text-green-800',
    admitted: 'bg-blue-100 text-blue-800',
    scheduled: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    partially_paid: 'bg-yellow-100 text-yellow-800',
    sample_collected: 'bg-cyan-100 text-cyan-800',
    ordered: 'bg-blue-100 text-blue-800',
    submitted: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-teal-100 text-teal-800',
    approved: 'bg-green-100 text-green-800',
    discharged: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-red-100 text-red-800',
    overdue: 'bg-red-100 text-red-800',
    out_of_stock: 'bg-red-100 text-red-800',
    discontinued: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
    occupied: 'bg-red-100 text-red-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    reserved: 'bg-purple-100 text-purple-800',
    transferred: 'bg-indigo-100 text-indigo-800',
    emergency: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

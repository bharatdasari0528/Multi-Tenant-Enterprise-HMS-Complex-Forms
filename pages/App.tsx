import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { LoginPage, RegisterPage } from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Admissions from './pages/Admissions';
import Billing from './pages/Billing';
import Pharmacy from './pages/Pharmacy';
import Laboratory from './pages/Laboratory';
import ClinicalForms from './pages/ClinicalForms';
import Inventory from './pages/Inventory';
import Staff from './pages/Staff';
import Settings from './pages/Settings';

function AppContent() {
  const { user, loading, activeTenant, signOut } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading MedCore HMS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authPage === 'register') {
      return <RegisterPage onSwitch={() => setAuthPage('login')} />;
    }
    return <LoginPage onSwitch={() => setAuthPage('register')} />;
  }

  if (!activeTenant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Organization Assigned</h2>
          <p className="text-gray-600 mb-6">Your account is not linked to any healthcare organization. Please contact your administrator to get access.</p>
          <button
            onClick={signOut}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  function renderPage() {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'patients': return <Patients />;
      case 'appointments': return <Appointments />;
      case 'admissions': return <Admissions />;
      case 'billing': return <Billing />;
      case 'pharmacy': return <Pharmacy />;
      case 'laboratory': return <Laboratory />;
      case 'forms': return <ClinicalForms />;
      case 'inventory': return <Inventory />;
      case 'staff': return <Staff />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  }

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

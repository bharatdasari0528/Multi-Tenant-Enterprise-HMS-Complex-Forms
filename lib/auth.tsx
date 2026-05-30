import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

interface TenantMembership {
  tenant_id: string;
  role: string;
  department: string | null;
  is_active: boolean;
  tenants: {
    id: string;
    name: string;
    slug: string;
    type: string;
    status: string;
    logo_url: string | null;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  memberships: TenantMembership[];
  activeTenant: TenantMembership | null;
  setActiveTenant: (membership: TenantMembership) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState<TenantMembership[]>([]);
  const [activeTenant, setActiveTenant] = useState<TenantMembership | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadMemberships(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadMemberships(session.user.id);
      } else {
        setMemberships([]);
        setActiveTenant(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadMemberships(userId: string) {
    const { data } = await supabase
      .from('tenant_users')
      .select('tenant_id, role, department, is_active, tenants(id, name, slug, type, status, logo_url)')
      .eq('user_id', userId)
      .eq('is_active', true);

    const typed = (data || []) as unknown as TenantMembership[];
    setMemberships(typed);

    const savedTenantId = localStorage.getItem('activeTenantId');
    const existing = typed.find(m => m.tenant_id === savedTenantId);
    setActiveTenant(existing || typed[0] || null);
    setLoading(false);
  }

  function handleSetActiveTenant(membership: TenantMembership) {
    setActiveTenant(membership);
    localStorage.setItem('activeTenantId', membership.tenant_id);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setMemberships([]);
    setActiveTenant(null);
    localStorage.removeItem('activeTenantId');
  }

  return (
    <AuthContext.Provider value={{ user, loading, memberships, activeTenant, setActiveTenant: handleSetActiveTenant, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

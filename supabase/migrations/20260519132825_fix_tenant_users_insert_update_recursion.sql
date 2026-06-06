/*
  # Fix remaining recursion risks in tenant_users policies

  ## Problem
  The INSERT and UPDATE policies on tenant_users still have subqueries
  that reference tenant_users itself, which can cause infinite recursion.

  ## Solution
  Create a helper function to check if the current user is a tenant admin,
  then use it in the INSERT and UPDATE policies.

  ## Security
  - Both helper functions are SECURITY DEFINER to bypass RLS
  - They only return booleans, not data
*/

-- Create helper function to check if user is tenant admin
CREATE OR REPLACE FUNCTION is_tenant_admin(check_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_users
    WHERE tenant_users.tenant_id = check_tenant_id
    AND tenant_users.user_id = auth.uid()
    AND tenant_users.is_active = true
    AND tenant_users.role IN ('super_admin', 'admin')
  );
$$;

-- Fix INSERT policy
DROP POLICY IF EXISTS "Tenant admins can insert members" ON tenant_users;
CREATE POLICY "Tenant admins can insert members"
  ON tenant_users FOR INSERT
  TO authenticated
  WITH CHECK (is_tenant_admin(tenant_id));

-- Fix UPDATE policy
DROP POLICY IF EXISTS "Tenant admins can update members" ON tenant_users;
CREATE POLICY "Tenant admins can update members"
  ON tenant_users FOR UPDATE
  TO authenticated
  USING (is_tenant_member(tenant_id))
  WITH CHECK (is_tenant_admin(tenant_id));

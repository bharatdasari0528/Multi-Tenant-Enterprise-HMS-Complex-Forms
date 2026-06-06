/*
  # Fix infinite recursion in tenant_users RLS policies

  ## Problem
  The "Users can view members of own tenant" SELECT policy on tenant_users
  references tenant_users in its subquery, causing infinite recursion when
  PostgreSQL evaluates the RLS policy.

  ## Solution
  - Drop the recursive "Users can view members of own tenant" policy
  - Keep the simple "Users can view own memberships" policy (user_id = auth.uid())
  - Add a SECURITY DEFINER helper function that safely checks tenant membership
    without triggering RLS recursion
  - Add a new policy using the helper function for viewing other members

  ## Security
  - The helper function is SECURITY DEFINER, so it bypasses RLS when querying tenant_users
  - It only returns a boolean (member or not), not actual data
  - This is the recommended Supabase pattern for avoiding RLS recursion
*/

-- Create a security definer function to check tenant membership
CREATE OR REPLACE FUNCTION is_tenant_member(check_tenant_id uuid)
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
  );
$$;

-- Drop the recursive policy
DROP POLICY IF EXISTS "Users can view members of own tenant" ON tenant_users;

-- Add a new policy using the helper function (no recursion)
CREATE POLICY "Users can view members of own tenant"
  ON tenant_users FOR SELECT
  TO authenticated
  USING (is_tenant_member(tenant_id));

-- Also fix INSERT and UPDATE policies to use the helper function
DROP POLICY IF EXISTS "Tenant admins can insert members" ON tenant_users;
DROP POLICY IF EXISTS "Tenant admins can update members" ON tenant_users;

CREATE POLICY "Tenant admins can insert members"
  ON tenant_users FOR INSERT
  TO authenticated
  WITH CHECK (
    is_tenant_member(tenant_id)
    AND (
      SELECT role FROM tenant_users
      WHERE tenant_users.tenant_id = tenant_users.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.is_active = true
      LIMIT 1
    ) IN ('super_admin', 'admin')
  );

CREATE POLICY "Tenant admins can update members"
  ON tenant_users FOR UPDATE
  TO authenticated
  USING (is_tenant_member(tenant_id))
  WITH CHECK (is_tenant_member(tenant_id));

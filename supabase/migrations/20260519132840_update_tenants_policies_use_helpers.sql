/*
  # Update tenants policies to use helper functions

  ## Changes
  - Replace inline subqueries on tenant_users with the is_tenant_member()
    and is_tenant_admin() SECURITY DEFINER helper functions
  - This ensures consistency and avoids any potential recursion edge cases
*/

DROP POLICY IF EXISTS "Tenant members can view own tenant" ON tenants;
DROP POLICY IF EXISTS "Tenant admins can update own tenant" ON tenants;

CREATE POLICY "Tenant members can view own tenant"
  ON tenants FOR SELECT
  TO authenticated
  USING (is_tenant_member(id));

CREATE POLICY "Tenant admins can update own tenant"
  ON tenants FOR UPDATE
  TO authenticated
  USING (is_tenant_admin(id))
  WITH CHECK (is_tenant_admin(id));

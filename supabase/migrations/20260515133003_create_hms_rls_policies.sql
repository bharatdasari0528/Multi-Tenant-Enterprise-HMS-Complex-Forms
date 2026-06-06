/*
  # HMS RLS Policies

  Enables Row Level Security on all tables and creates restrictive policies.
  All policies require authentication and tenant membership verification.
*/

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- TENANTS policies
CREATE POLICY "Tenant members can view own tenant"
  ON tenants FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = tenants.id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant admins can update own tenant"
  ON tenants FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = tenants.id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = tenants.id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin')));

-- TENANT_USERS policies
CREATE POLICY "Users can view own memberships"
  ON tenant_users FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view members of own tenant"
  ON tenant_users FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id AND tu.user_id = auth.uid() AND tu.is_active = true));

CREATE POLICY "Tenant admins can insert members"
  ON tenant_users FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id AND tu.user_id = auth.uid() AND tu.is_active = true AND tu.role IN ('super_admin', 'admin')));

CREATE POLICY "Tenant admins can update members"
  ON tenant_users FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id AND tu.user_id = auth.uid() AND tu.is_active = true AND tu.role IN ('super_admin', 'admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id AND tu.user_id = auth.uid() AND tu.is_active = true AND tu.role IN ('super_admin', 'admin')));

-- DEPARTMENTS policies
CREATE POLICY "Tenant members can view departments"
  ON departments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = departments.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant admins can insert departments"
  ON departments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = departments.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin')));

CREATE POLICY "Tenant admins can update departments"
  ON departments FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = departments.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = departments.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin')));

-- PATIENTS policies
CREATE POLICY "Tenant members can view patients"
  ON patients FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = patients.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant clinical staff can insert patients"
  ON patients FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = patients.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')));

CREATE POLICY "Tenant clinical staff can update patients"
  ON patients FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = patients.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = patients.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')));

-- BEDS policies
CREATE POLICY "Tenant members can view beds"
  ON beds FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = beds.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant staff can insert beds"
  ON beds FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = beds.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'nurse')));

CREATE POLICY "Tenant staff can update beds"
  ON beds FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = beds.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'nurse')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = beds.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'nurse')));

-- APPOINTMENTS policies
CREATE POLICY "Tenant members can view appointments"
  ON appointments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = appointments.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant staff can create appointments"
  ON appointments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = appointments.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')));

CREATE POLICY "Tenant staff can update appointments"
  ON appointments FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = appointments.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = appointments.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')));

CREATE POLICY "Tenant admins can delete appointments"
  ON appointments FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = appointments.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin')));

-- ADMISSIONS policies
CREATE POLICY "Tenant members can view admissions"
  ON admissions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = admissions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant clinical staff can create admissions"
  ON admissions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = admissions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor', 'nurse')));

CREATE POLICY "Tenant clinical staff can update admissions"
  ON admissions FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = admissions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor', 'nurse')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = admissions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor', 'nurse')));

-- BILLING INVOICES policies
CREATE POLICY "Tenant members can view invoices"
  ON billing_invoices FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = billing_invoices.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant billing staff can create invoices"
  ON billing_invoices FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = billing_invoices.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'billing')));

CREATE POLICY "Tenant billing staff can update invoices"
  ON billing_invoices FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = billing_invoices.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'billing')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = billing_invoices.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'billing')));

-- MEDICATIONS policies
CREATE POLICY "Tenant members can view medications"
  ON medications FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = medications.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant pharmacy staff can insert medications"
  ON medications FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = medications.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'pharmacist')));

CREATE POLICY "Tenant pharmacy staff can update medications"
  ON medications FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = medications.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'pharmacist')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = medications.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'pharmacist')));

-- PRESCRIPTIONS policies
CREATE POLICY "Tenant members can view prescriptions"
  ON prescriptions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = prescriptions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant doctors can create prescriptions"
  ON prescriptions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = prescriptions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor')));

CREATE POLICY "Tenant doctors can update prescriptions"
  ON prescriptions FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = prescriptions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = prescriptions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor')));

-- LAB TESTS policies
CREATE POLICY "Tenant members can view lab tests"
  ON lab_tests FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = lab_tests.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant lab staff can insert lab tests"
  ON lab_tests FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = lab_tests.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'lab_tech')));

CREATE POLICY "Tenant lab staff can update lab tests"
  ON lab_tests FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = lab_tests.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'lab_tech')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = lab_tests.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'lab_tech')));

-- LAB ORDERS policies
CREATE POLICY "Tenant members can view lab orders"
  ON lab_orders FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = lab_orders.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant clinical staff can create lab orders"
  ON lab_orders FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = lab_orders.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'doctor', 'lab_tech')));

CREATE POLICY "Tenant lab staff can update lab orders"
  ON lab_orders FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = lab_orders.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'lab_tech')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = lab_orders.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'lab_tech')));

-- FORM TEMPLATES policies
CREATE POLICY "Tenant members can view form templates"
  ON form_templates FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = form_templates.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant admins can create form templates"
  ON form_templates FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = form_templates.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin')));

CREATE POLICY "Tenant admins can update form templates"
  ON form_templates FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = form_templates.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = form_templates.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin')));

-- FORM SUBMISSIONS policies
CREATE POLICY "Tenant members can view form submissions"
  ON form_submissions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = form_submissions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant members can create form submissions"
  ON form_submissions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = form_submissions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant members can update form submissions"
  ON form_submissions FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = form_submissions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = form_submissions.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

-- INVENTORY ITEMS policies
CREATE POLICY "Tenant members can view inventory"
  ON inventory_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = inventory_items.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true));

CREATE POLICY "Tenant inventory staff can insert items"
  ON inventory_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = inventory_items.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'inventory')));

CREATE POLICY "Tenant inventory staff can update items"
  ON inventory_items FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = inventory_items.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'inventory')))
  WITH CHECK (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = inventory_items.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin', 'inventory')));

-- AUDIT LOGS policies
CREATE POLICY "Tenant admins can view audit logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = audit_logs.tenant_id AND tenant_users.user_id = auth.uid() AND tenant_users.is_active = true AND tenant_users.role IN ('super_admin', 'admin')));

-- NOTIFICATIONS policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

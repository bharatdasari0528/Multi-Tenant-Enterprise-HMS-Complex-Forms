/*
  # Seed Data and Auto-Provisioning

  ## Changes
  1. Seed departments for Apollo Hospitals
  2. Seed beds across departments
  3. Create a database trigger that auto-creates a tenant and links
     new users when they sign up, so they never see "No Organization Assigned"

  ## Security
  - The trigger function runs as SECURITY DEFINER (system-level)
  - It only creates a tenant and membership for brand new users
  - Default role is 'super_admin' for the first user of a new tenant
*/

-- Seed departments
INSERT INTO departments (tenant_id, name, code, status) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'General Medicine', 'GM', 'active'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Cardiology', 'CAR', 'active'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Orthopedics', 'ORT', 'active'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Pediatrics', 'PED', 'active'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Emergency', 'EMR', 'active'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ICU', 'ICU', 'active'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Pharmacy', 'PHA', 'active'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Laboratory', 'LAB', 'active'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Radiology', 'RAD', 'active'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Administration', 'ADM', 'active')
ON CONFLICT DO NOTHING;

-- Seed beds
DO $$
DECLARE
  v_tenant_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  dept_rec record;
BEGIN
  FOR dept_rec IN SELECT id FROM departments WHERE departments.tenant_id = v_tenant_id AND name = 'General Medicine' LOOP
    INSERT INTO beds (tenant_id, department_id, ward_name, bed_number, floor, status) VALUES
      (v_tenant_id, dept_rec.id, 'Ward A', 'A-101', 1, 'available'),
      (v_tenant_id, dept_rec.id, 'Ward A', 'A-102', 1, 'available'),
      (v_tenant_id, dept_rec.id, 'Ward A', 'A-103', 1, 'occupied'),
      (v_tenant_id, dept_rec.id, 'Ward A', 'A-104', 1, 'available'),
      (v_tenant_id, dept_rec.id, 'Ward A', 'A-105', 1, 'available')
    ON CONFLICT DO NOTHING;
  END LOOP;

  FOR dept_rec IN SELECT id FROM departments WHERE departments.tenant_id = v_tenant_id AND name = 'Cardiology' LOOP
    INSERT INTO beds (tenant_id, department_id, ward_name, bed_number, floor, status) VALUES
      (v_tenant_id, dept_rec.id, 'Ward B', 'B-201', 2, 'occupied'),
      (v_tenant_id, dept_rec.id, 'Ward B', 'B-202', 2, 'available'),
      (v_tenant_id, dept_rec.id, 'Ward B', 'B-203', 2, 'maintenance')
    ON CONFLICT DO NOTHING;
  END LOOP;

  FOR dept_rec IN SELECT id FROM departments WHERE departments.tenant_id = v_tenant_id AND name = 'Orthopedics' LOOP
    INSERT INTO beds (tenant_id, department_id, ward_name, bed_number, floor, status) VALUES
      (v_tenant_id, dept_rec.id, 'Ward C', 'C-301', 3, 'available'),
      (v_tenant_id, dept_rec.id, 'Ward C', 'C-302', 3, 'occupied')
    ON CONFLICT DO NOTHING;
  END LOOP;

  FOR dept_rec IN SELECT id FROM departments WHERE departments.tenant_id = v_tenant_id AND name = 'Pediatrics' LOOP
    INSERT INTO beds (tenant_id, department_id, ward_name, bed_number, floor, status) VALUES
      (v_tenant_id, dept_rec.id, 'Ward D', 'D-401', 4, 'available'),
      (v_tenant_id, dept_rec.id, 'Ward D', 'D-402', 4, 'available')
    ON CONFLICT DO NOTHING;
  END LOOP;

  FOR dept_rec IN SELECT id FROM departments WHERE departments.tenant_id = v_tenant_id AND name = 'Emergency' LOOP
    INSERT INTO beds (tenant_id, department_id, ward_name, bed_number, floor, status) VALUES
      (v_tenant_id, dept_rec.id, 'ER', 'ER-01', 1, 'occupied'),
      (v_tenant_id, dept_rec.id, 'ER', 'ER-02', 1, 'occupied'),
      (v_tenant_id, dept_rec.id, 'ER', 'ER-03', 1, 'available')
    ON CONFLICT DO NOTHING;
  END LOOP;

  FOR dept_rec IN SELECT id FROM departments WHERE departments.tenant_id = v_tenant_id AND name = 'ICU' LOOP
    INSERT INTO beds (tenant_id, department_id, ward_name, bed_number, floor, status) VALUES
      (v_tenant_id, dept_rec.id, 'ICU', 'ICU-01', 2, 'occupied'),
      (v_tenant_id, dept_rec.id, 'ICU', 'ICU-02', 2, 'available'),
      (v_tenant_id, dept_rec.id, 'ICU', 'ICU-03', 2, 'maintenance'),
      (v_tenant_id, dept_rec.id, 'ICU', 'ICU-04', 2, 'available'),
      (v_tenant_id, dept_rec.id, 'ICU', 'ICU-05', 2, 'occupied')
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Auto-provisioning trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_tenant_id uuid;
  user_email text;
  tenant_name text;
  tenant_slug text;
BEGIN
  user_email := NEW.email;

  -- Check if user already has a tenant
  IF EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.user_id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- Create a personal tenant for the new user
  tenant_name := COALESCE(split_part(user_email, '@', 1), 'My Hospital');
  tenant_slug := lower(replace(replace(replace(tenant_name, '.', '-'), '_', '-'), ' ', '-')) || '-' || substr(NEW.id::text, 1, 8);

  INSERT INTO tenants (name, slug, type, status, subscription_plan, max_users)
  VALUES (tenant_name, tenant_slug, 'hospital', 'active', 'basic', 10)
  RETURNING id INTO new_tenant_id;

  -- Link user to the new tenant as super_admin
  INSERT INTO tenant_users (tenant_id, user_id, role, department, is_active)
  VALUES (new_tenant_id, NEW.id, 'super_admin', 'Administration', true);

  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

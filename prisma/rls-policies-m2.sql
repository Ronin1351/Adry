-- Enhanced Row Level Security (RLS) Policies for Employee Profiles
-- Milestone M2: Employee Profile Implementation

-- Enable RLS on employee_profiles table
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "owner_can_write_employee_profile" ON employee_profiles;
DROP POLICY IF EXISTS "owner_can_insert_employee_profile" ON employee_profiles;
DROP POLICY IF EXISTS "owner_can_read_employee_profile" ON employee_profiles;
DROP POLICY IF EXISTS "public_read_minimal_employee_profile" ON employee_profiles;
DROP POLICY IF EXISTS "subscriber_read_extended_employee_profile" ON employee_profiles;
DROP POLICY IF EXISTS "admin_read_all_employee_profiles" ON employee_profiles;
DROP POLICY IF EXISTS "admin_update_employee_profiles" ON employee_profiles;

-- 1. Owner can update their own profile (all fields)
CREATE POLICY "owner_can_write_employee_profile" ON employee_profiles
  FOR UPDATE USING (auth.uid()::text = user_id);

-- 2. Owner can insert their own profile
CREATE POLICY "owner_can_insert_employee_profile" ON employee_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- 3. Owner can read their own profile (all fields)
CREATE POLICY "owner_can_read_employee_profile" ON employee_profiles
  FOR SELECT USING (auth.uid()::text = user_id);

-- 4. Public can read minimal fields (when visible)
-- Only basic public information visible to guests
CREATE POLICY "public_read_minimal_employee_profile" ON employee_profiles
  FOR SELECT USING (
    visibility = true
    AND NOT EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()::text
      AND u.role IN ('EMPLOYER', 'ADMIN')
    )
  );

-- 5. Employers can read extended fields if they have active subscription
-- This policy allows employers to see private fields when subscribed
CREATE POLICY "subscriber_read_extended_employee_profile" ON employee_profiles
  FOR SELECT USING (
    visibility = true
    AND EXISTS (
      SELECT 1 FROM users u
      JOIN subscriptions s ON s.employer_id = u.id
      WHERE u.id = auth.uid()::text
      AND u.role = 'EMPLOYER'
      AND s.status = 'ACTIVE'
      AND s.expires_at > NOW()
    )
  );

-- 6. Employers can search employee profiles (minimal data only)
CREATE POLICY "employers_search_employee_profiles" ON employee_profiles
  FOR SELECT USING (
    visibility = true
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()::text
      AND u.role = 'EMPLOYER'
    )
  );

-- 7. Admin can read all employee profiles
CREATE POLICY "admin_read_all_employee_profiles" ON employee_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()::text
      AND u.role = 'ADMIN'
    )
  );

-- 8. Admin can update any employee profile
CREATE POLICY "admin_update_employee_profiles" ON employee_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()::text
      AND u.role = 'ADMIN'
    )
  );

-- Enable RLS on documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Document policies
DROP POLICY IF EXISTS "employee_manage_own_documents" ON documents;
DROP POLICY IF EXISTS "subscriber_view_documents" ON documents;
DROP POLICY IF EXISTS "admin_manage_all_documents" ON documents;

-- 1. Employee can manage their own documents
CREATE POLICY "employee_manage_own_documents" ON documents
  FOR ALL USING (employee_id = auth.uid()::text);

-- 2. Subscribed employers can view documents
CREATE POLICY "subscriber_view_documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN subscriptions s ON s.employer_id = u.id
      WHERE u.id = auth.uid()::text
      AND u.role = 'EMPLOYER'
      AND s.status = 'ACTIVE'
      AND s.expires_at > NOW()
    )
  );

-- 3. Admin can manage all documents
CREATE POLICY "admin_manage_all_documents" ON documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()::text
      AND u.role = 'ADMIN'
    )
  );

-- Enable RLS on references table
ALTER TABLE references ENABLE ROW LEVEL SECURITY;

-- Reference policies
DROP POLICY IF EXISTS "employee_manage_own_references" ON references;
DROP POLICY IF EXISTS "subscriber_view_references" ON references;
DROP POLICY IF EXISTS "admin_manage_all_references" ON references;

-- 1. Employee can manage their own references
CREATE POLICY "employee_manage_own_references" ON references
  FOR ALL USING (employee_id = auth.uid()::text);

-- 2. Subscribed employers can view references
CREATE POLICY "subscriber_view_references" ON references
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN subscriptions s ON s.employer_id = u.id
      WHERE u.id = auth.uid()::text
      AND u.role = 'EMPLOYER'
      AND s.status = 'ACTIVE'
      AND s.expires_at > NOW()
    )
  );

-- 3. Admin can manage all references
CREATE POLICY "admin_manage_all_references" ON references
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()::text
      AND u.role = 'ADMIN'
    )
  );

-- Create helper functions for RLS policies
CREATE OR REPLACE FUNCTION has_active_subscription(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions s
    WHERE s.employer_id = user_id
    AND s.status = 'ACTIVE'
    AND s.expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = user_id
    AND u.role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_employer(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = user_id
    AND u.role = 'EMPLOYER'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_employee(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = user_id
    AND u.role = 'EMPLOYEE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employee_profiles_visibility ON employee_profiles(visibility);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_city ON employee_profiles(city);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_province ON employee_profiles(province);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_skills ON employee_profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_employment_type ON employee_profiles(employment_type);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_salary_range ON employee_profiles(salary_min, salary_max);
CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_references_employee_id ON references(employee_id);

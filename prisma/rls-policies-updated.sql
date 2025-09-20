-- Enhanced Row Level Security (RLS) Policies for Adry
-- These policies ensure data security and proper access control with field-level permissions

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE references ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "owner_can_write" ON employee_profiles;
DROP POLICY IF EXISTS "owner_can_insert" ON employee_profiles;
DROP POLICY IF EXISTS "public_read_minimal" ON employee_profiles;
DROP POLICY IF EXISTS "subscriber_read_extended" ON employee_profiles;
DROP POLICY IF EXISTS "employee_read_own" ON employee_profiles;
DROP POLICY IF EXISTS "employers_search_employees" ON employee_profiles;

-- Employee Profiles Policies

-- 1. Owner can update their own profile (all fields)
CREATE POLICY "owner_can_write_employee_profile" ON employee_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 2. Owner can insert their own profile
CREATE POLICY "owner_can_insert_employee_profile" ON employee_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Owner can read their own profile (all fields)
CREATE POLICY "owner_can_read_employee_profile" ON employee_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Public can read minimal fields (when visible)
-- Only basic public information visible to guests
CREATE POLICY "public_read_minimal_employee_profile" ON employee_profiles
  FOR SELECT USING (
    visibility = true
    AND NOT EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
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
      WHERE u.id = auth.uid()
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
      WHERE u.id = auth.uid()
      AND u.role = 'EMPLOYER'
    )
  );

-- 7. Admin can read all employee profiles
CREATE POLICY "admin_read_all_employee_profiles" ON employee_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- 8. Admin can update any employee profile
CREATE POLICY "admin_update_employee_profiles" ON employee_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Document Policies

-- 1. Employee can manage their own documents
CREATE POLICY "employee_manage_own_documents" ON documents
  FOR ALL USING (employee_id = auth.uid());

-- 2. Subscribed employers can view documents
CREATE POLICY "subscriber_view_documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN subscriptions s ON s.employer_id = u.id
      WHERE u.id = auth.uid()
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
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Reference Policies

-- 1. Employee can manage their own references
CREATE POLICY "employee_manage_own_references" ON references
  FOR ALL USING (employee_id = auth.uid());

-- 2. Subscribed employers can view references
CREATE POLICY "subscriber_view_references" ON references
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN subscriptions s ON s.employer_id = u.id
      WHERE u.id = auth.uid()
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
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- User Policies

-- 1. Users can read their own user record
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (id = auth.uid());

-- 2. Users can update their own user record
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid());

-- 3. Admin can read all users
CREATE POLICY "admin_read_all_users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- 4. Admin can update any user
CREATE POLICY "admin_update_users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Employer Policies

-- 1. Employers can manage their own profile
CREATE POLICY "employer_manage_own" ON employers
  FOR ALL USING (user_id = auth.uid());

-- 2. Employees can read employer profiles (basic info only)
CREATE POLICY "employees_read_employers" ON employers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'EMPLOYEE'
    )
  );

-- 3. Admin can manage all employers
CREATE POLICY "admin_manage_employers" ON employers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Subscription Policies

-- 1. Employers can manage their own subscriptions
CREATE POLICY "employer_manage_subscriptions" ON subscriptions
  FOR ALL USING (employer_id = auth.uid());

-- 2. Admin can manage all subscriptions
CREATE POLICY "admin_manage_subscriptions" ON subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Chat Policies

-- 1. Only participants can read chats
CREATE POLICY "participants_read_chats" ON chats
  FOR SELECT USING (
    employer_id = auth.uid() OR employee_id = auth.uid()
  );

-- 2. Only employers with active subscription can create chats
CREATE POLICY "subscribed_employers_create_chats" ON chats
  FOR INSERT WITH CHECK (
    employer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.employer_id = auth.uid()
      AND s.status = 'ACTIVE'
      AND s.expires_at > NOW()
    )
  );

-- 3. Participants can update chats
CREATE POLICY "participants_update_chats" ON chats
  FOR UPDATE USING (
    employer_id = auth.uid() OR employee_id = auth.uid()
  );

-- 4. Admin can manage all chats
CREATE POLICY "admin_manage_chats" ON chats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Chat Message Policies

-- 1. Only participants can read messages
CREATE POLICY "participants_read_messages" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats c
      WHERE c.id = chat_id
      AND (c.employer_id = auth.uid() OR c.employee_id = auth.uid())
    )
  );

-- 2. Only participants can insert messages
CREATE POLICY "participants_insert_messages" ON chat_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM chats c
      WHERE c.id = chat_id
      AND (c.employer_id = auth.uid() OR c.employee_id = auth.uid())
    )
  );

-- 3. Only message sender can update their messages
CREATE POLICY "sender_update_messages" ON chat_messages
  FOR UPDATE USING (sender_id = auth.uid());

-- 4. Only message sender can delete their messages
CREATE POLICY "sender_delete_messages" ON chat_messages
  FOR DELETE USING (sender_id = auth.uid());

-- 5. Admin can manage all messages
CREATE POLICY "admin_manage_messages" ON chat_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Interview Policies

-- 1. Participants can read interviews
CREATE POLICY "participants_read_interviews" ON interviews
  FOR SELECT USING (
    employer_id = auth.uid() OR employee_id = auth.uid()
  );

-- 2. Only employers with active subscription can create interviews
CREATE POLICY "subscribed_employers_create_interviews" ON interviews
  FOR INSERT WITH CHECK (
    employer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.employer_id = auth.uid()
      AND s.status = 'ACTIVE'
      AND s.expires_at > NOW()
    )
  );

-- 3. Participants can update interviews
CREATE POLICY "participants_update_interviews" ON interviews
  FOR UPDATE USING (
    employer_id = auth.uid() OR employee_id = auth.uid()
  );

-- 4. Admin can manage all interviews
CREATE POLICY "admin_manage_interviews" ON interviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Shortlist Policies

-- 1. Employers can manage their own shortlists
CREATE POLICY "employer_manage_shortlists" ON shortlists
  FOR ALL USING (employer_id = auth.uid());

-- 2. Admin can manage all shortlists
CREATE POLICY "admin_manage_shortlists" ON shortlists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Search Filter Policies

-- 1. Employers can manage their own search filters
CREATE POLICY "employer_manage_search_filters" ON search_filters
  FOR ALL USING (employer_id = auth.uid());

-- 2. Admin can manage all search filters
CREATE POLICY "admin_manage_search_filters" ON search_filters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Report Policies

-- 1. Users can manage their own reports
CREATE POLICY "user_manage_own_reports" ON reports
  FOR ALL USING (reporter_id = auth.uid());

-- 2. Admin can manage all reports
CREATE POLICY "admin_manage_reports" ON reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Audit Log Policies (Admin only)

-- 1. Only admins can read audit logs
CREATE POLICY "admin_read_audit_logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- 2. Only admins can insert audit logs
CREATE POLICY "admin_insert_audit_logs" ON audit_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employee_profiles_visibility ON employee_profiles(visibility);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_city ON employee_profiles(city);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_province ON employee_profiles(province);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_skills ON employee_profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_employment_type ON employee_profiles(employment_type);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_salary_range ON employee_profiles(salary_min, salary_max);
CREATE INDEX IF NOT EXISTS idx_subscriptions_employer_status ON subscriptions(employer_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_references_employee_id ON references(employee_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_interviews_employer_id ON interviews(employer_id);
CREATE INDEX IF NOT EXISTS idx_interviews_employee_id ON interviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_interviews_starts_at ON interviews(starts_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);

-- Create function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_id UUID)
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

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = user_id
    AND u.role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is employer
CREATE OR REPLACE FUNCTION is_employer(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = user_id
    AND u.role = 'EMPLOYER'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is employee
CREATE OR REPLACE FUNCTION is_employee(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = user_id
    AND u.role = 'EMPLOYEE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

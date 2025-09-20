-- Row Level Security (RLS) Policies for Adry
-- These policies ensure data security and proper access control

-- Enable RLS on tables
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Employee Profiles Policies

-- 1. Owner can update their own profile
CREATE POLICY "owner_can_write" ON employee_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 2. Owner can insert their own profile
CREATE POLICY "owner_can_insert" ON employee_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Public can read minimal fields (when visible)
CREATE POLICY "public_read_minimal" ON employee_profiles
  FOR SELECT USING (
    visibility = true
  );

-- 4. Subscribers can read extended fields
CREATE POLICY "subscriber_read_extended" ON employee_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM subscriptions s
      JOIN users u ON u.id = s.employer_id
      WHERE u.id = auth.uid()
      AND s.status = 'ACTIVE'
      AND s.expires_at > NOW()
    )
  );

-- 5. Employee can read their own profile
CREATE POLICY "employee_read_own" ON employee_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Chat Messages Policies

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

-- Chats Policies

-- 1. Only participants can read chats
CREATE POLICY "participants_read_chats" ON chats
  FOR SELECT USING (
    employer_id = auth.uid() OR employee_id = auth.uid()
  );

-- 2. Only employers can create chats (with active subscription)
CREATE POLICY "employers_create_chats" ON chats
  FOR INSERT WITH CHECK (
    employer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.employer_id = auth.uid()
      AND s.status = 'ACTIVE'
      AND s.expires_at > NOW()
    )
  );

-- 3. Only participants can update chats
CREATE POLICY "participants_update_chats" ON chats
  FOR UPDATE USING (
    employer_id = auth.uid() OR employee_id = auth.uid()
  );

-- Subscriptions Policies

-- 1. Employers can read their own subscriptions
CREATE POLICY "employer_read_subscriptions" ON subscriptions
  FOR SELECT USING (employer_id = auth.uid());

-- 2. Employers can insert their own subscriptions
CREATE POLICY "employer_insert_subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (employer_id = auth.uid());

-- 3. Employers can update their own subscriptions
CREATE POLICY "employer_update_subscriptions" ON subscriptions
  FOR UPDATE USING (employer_id = auth.uid());

-- 4. Admins can read all subscriptions
CREATE POLICY "admin_read_all_subscriptions" ON subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Additional Security Policies

-- 1. Users can only read their own user record
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (id = auth.uid());

-- 2. Users can update their own user record
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid());

-- 3. Admins can read all users
CREATE POLICY "admin_read_all_users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- 4. Employers can read employee profiles for search (minimal data)
CREATE POLICY "employers_search_employees" ON employee_profiles
  FOR SELECT USING (
    visibility = true
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'EMPLOYER'
    )
  );

-- 5. Employees can read employer profiles (basic info only)
CREATE POLICY "employees_read_employers" ON employers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'EMPLOYEE'
    )
  );

-- 6. Interview policies
CREATE POLICY "interview_participants_read" ON interviews
  FOR SELECT USING (
    employer_id = auth.uid() OR employee_id = auth.uid()
  );

CREATE POLICY "interview_participants_insert" ON interviews
  FOR INSERT WITH CHECK (
    employer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.employer_id = auth.uid()
      AND s.status = 'ACTIVE'
      AND s.expires_at > NOW()
    )
  );

CREATE POLICY "interview_participants_update" ON interviews
  FOR UPDATE USING (
    employer_id = auth.uid() OR employee_id = auth.uid()
  );

-- 7. Shortlist policies
CREATE POLICY "employer_shortlist_own" ON shortlists
  FOR ALL USING (employer_id = auth.uid());

-- 8. Search filter policies
CREATE POLICY "employer_filters_own" ON search_filters
  FOR ALL USING (employer_id = auth.uid());

-- 9. Document policies
CREATE POLICY "employee_documents_own" ON documents
  FOR ALL USING (employee_id = auth.uid());

-- 10. Report policies
CREATE POLICY "reporter_reports_own" ON reports
  FOR ALL USING (reporter_id = auth.uid());

CREATE POLICY "admin_reports_all" ON reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- 11. Audit log policies (admin only)
CREATE POLICY "admin_audit_logs" ON audit_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'ADMIN'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_employee_profiles_visibility ON employee_profiles(visibility);
CREATE INDEX idx_employee_profiles_location ON employee_profiles(location);
CREATE INDEX idx_employee_profiles_skills ON employee_profiles USING GIN(skills);
CREATE INDEX idx_subscriptions_employer_status ON subscriptions(employer_id, status);
CREATE INDEX idx_subscriptions_expires_at ON subscriptions(expires_at);
CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_interviews_employer_id ON interviews(employer_id);
CREATE INDEX idx_interviews_employee_id ON interviews(employee_id);
CREATE INDEX idx_interviews_starts_at ON interviews(starts_at);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);

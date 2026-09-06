-- ============================================
-- ProgressBridge Database Schema
-- Member 6 - Database Setup
-- PostgreSQL / Supabase
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;


-- ============================================
-- 1. USERS
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (
        role IN ('FIELD_ENGINEER', 'EXECUTIVE_ENGINEER')
    ),
    employee_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- 2. PROJECTS
-- ============================================

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    boundary_radius_m DOUBLE PRECISION DEFAULT 500,
    planned_progress DOUBLE PRECISION DEFAULT 0,
    actual_progress DOUBLE PRECISION DEFAULT 0,
    status TEXT DEFAULT 'On Track'
        CHECK (status IN ('On Track', 'Delayed', 'At Risk')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- 3. ACTIVITIES
-- ============================================

CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    activity_code TEXT NOT NULL,
    activity_name TEXT NOT NULL,
    description TEXT,
    discipline TEXT NOT NULL
        CHECK (
            discipline IN (
                'Civil',
                'Water Supply',
                'Mechanical',
                'Electrical',
                'Survey'
            )
        ),
    planned_start DATE,
    planned_finish DATE,
    planned_progress DOUBLE PRECISION DEFAULT 0,
    actual_progress DOUBLE PRECISION DEFAULT 0,
    status TEXT DEFAULT 'On Track'
        CHECK (status IN ('On Track', 'Delayed', 'At Risk')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- 4. REPORTS
-- ============================================

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,

    report_date DATE NOT NULL,
    claimed_progress DOUBLE PRECISION NOT NULL,
    narrative TEXT,

    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,

    photo_timestamp TIMESTAMPTZ,
    device_signature TEXT,

    ai_confidence DOUBLE PRECISION,
    ai_recommended_activity UUID REFERENCES activities(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- 5. VERIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    officer_id UUID REFERENCES users(id) ON DELETE SET NULL,

    decision TEXT NOT NULL
        CHECK (decision IN ('APPROVED', 'REJECTED', 'PENDING')),

    officer_feedback TEXT,
    sanction_order TEXT,

    verified_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- 6. AUDIT LEDGER
-- ============================================

CREATE TABLE IF NOT EXISTS audit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
    officer_emp_id TEXT,

    decision TEXT NOT NULL,

    previous_hash TEXT,
    current_hash TEXT NOT NULL,

    timestamp TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- SPATIAL DATA
-- ============================================

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS boundary_point
geometry(Point, 4326);

ALTER TABLE reports
ADD COLUMN IF NOT EXISTS report_point
geometry(Point, 4326);


-- ============================================
-- SPATIAL INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_projects_boundary_point
ON projects USING GIST (boundary_point);

CREATE INDEX IF NOT EXISTS idx_reports_report_point
ON reports USING GIST (report_point);


-- ============================================
-- NORMAL INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_activities_project_id
ON activities(project_id);

CREATE INDEX IF NOT EXISTS idx_reports_project_id
ON reports(project_id);

CREATE INDEX IF NOT EXISTS idx_reports_activity_id
ON reports(activity_id);

CREATE INDEX IF NOT EXISTS idx_verifications_report_id
ON verifications(report_id);

CREATE INDEX IF NOT EXISTS idx_audit_report_id
ON audit_ledger(report_id);


-- ============================================
-- END OF SCHEMA
-- ============================================

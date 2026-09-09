# 🚧 ProgressBridge

### Infrastructure Monitoring & Management Portal

> **ProgressBridge** is a web-based infrastructure monitoring and management platform designed to improve how government infrastructure projects are tracked, verified, and monitored.

[![Smart India Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-blue?style=for-the-badge)](https://www.sih.gov.in/)
[![Status](https://img.shields.io/badge/Status-Working%20Prototype-success?style=for-the-badge)]()
[![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-orange?style=for-the-badge)]()
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge)]()
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20PostGIS-336791?style=for-the-badge)]()
[![AI](https://img.shields.io/badge/AI-Semantic%20Matching-purple?style=for-the-badge)]()

---

## 🌐 Live Demo

### 👉 [Open ProgressBridge](https://itsvidhi07.github.io/ProgressBridge/)

ProgressBridge is deployed as an interactive **SIH 2026 prototype**.

The current demo includes:

* Dashboard
* Project monitoring
* Schedule of Works
* Field Report submission
* Verification Desk
* Audit Log
* AI-Assisted Activity Matching
* Role-based demo access

### 🔐 Demo Access

The deployed prototype provides demo accounts for exploring different user roles.

| Role               | Demo Employee ID |
| ------------------ | ---------------- |
| Executive Engineer | `PB-EE-104`      |
| Field Engineer     | `PB-FE-218`      |

**Demo password:** `demo`

> **Note:** The deployed GitHub Pages version is a prototype demonstration. Production deployment would connect the frontend to the complete backend authentication, database, and security infrastructure.

---

# 🎯 Problem Statement

Infrastructure projects involve multiple stakeholders, including field engineers, project officers, contractors, and senior authorities.

A major challenge is that reported progress may not always provide enough evidence to determine whether the actual work matches the planned schedule.

Information such as:

* Planned activities
* Field reports
* Photos
* Location information
* Work schedules
* Verification records
* Project status

can become difficult to track when handled separately.

### The key question is:

> **If a project reports that it is 60% complete, how can authorities efficiently verify that the reported progress is actually supported by field-level evidence?**

ProgressBridge addresses this gap by connecting **field reporting, schedule matching, verification, and project monitoring** in a single platform.

---

# 💡 Our Solution

ProgressBridge creates a centralized workflow where field-level updates can move through validation and verification before becoming part of the official project progress view.

### Core idea

**Plan → Report → Validate → Match → Verify → Approve → Monitor**

This creates a traceable bridge between what was **planned**, what was **reported**, and what was **verified**.

---

# 🔄 System Workflow

```text
                    PROJECT PLAN
                         │
                         ▼
                Schedule of Works
                         │
                         ▼
                  Field Engineer
                         │
                         ▼
                  Field Report
                  + Photos/Data
                         │
                         ▼
             Location & Data Validation
                         │
                         ▼
             AI Activity Matching
                         │
                         ▼
                 Verification Desk
                    │         │
                  Approve    Reject
                    │         │
                    └────┬────┘
                         ▼
                    Audit Record
                         │
                         ▼
                 Project Dashboard
                         │
                         ▼
                   Reports & Insights
```

---

# ✨ Key Features

## 📊 1. Project Dashboard

Provides a centralized overview of project activity and progress.

The dashboard is designed to help decision-makers quickly understand:

* Project status
* Work progress
* Pending verification
* Schedule information
* Field updates
* Important project indicators

---

## 🏗️ 2. Project & Infrastructure Monitoring

ProgressBridge organizes infrastructure-related information into a single monitoring environment.

It can be used to track:

* Projects
* Infrastructure assets
* Operational status
* Maintenance requirements
* Project activities

---

## 📅 3. Schedule of Works

The Schedule of Works connects planned activities with actual field progress.

It helps answer:

> **What was supposed to happen, and what has actually been reported?**

Activities can be monitored based on their:

* Planned status
* Current status
* Progress
* Timeline
* Verification state

---

## 📍 4. Field Progress Reporting

Field engineers can submit updates from the project site.

A field report can contain information such as:

* Activity details
* Progress information
* Field observations
* Supporting evidence
* Location/telemetry information

This creates a structured source of field-level project data.

---

## 🤖 5. AI-Assisted Activity Matching

ProgressBridge includes an AI/NLP layer designed to match field-report descriptions with relevant planned project activities.

### How it works

```text
Field Report
     │
     ▼
Text Processing
     │
     ▼
Sentence Embedding
     │
     ▼
Semantic Similarity
     │
     ▼
Relevant Project Activity
```

The prototype uses:

**Sentence Transformers → `all-MiniLM-L6-v2` → Cosine Similarity**

Instead of relying only on exact keywords, semantic similarity helps identify activities that are conceptually related to the submitted field description.

---

## 🔎 6. Verification Desk

The Verification Desk provides a review layer between field submissions and approved project progress.

A reviewer can examine submitted information and determine whether it should be:

* Approved
* Rejected
* Investigated further

This helps prevent unverified field information from directly becoming official project progress.

---

## 🔐 7. Role-Based Access

The system is designed around different government/project roles.

Example roles include:

* Executive Engineer
* Field Engineer

Different roles can be provided with different capabilities according to their responsibilities.

The prototype demonstrates role-aware access while the production version can connect this to secure backend authentication and authorization.

---

## 🧾 8. Audit Trail

Important project actions can be recorded as audit events.

This provides a traceable history of actions such as:

* Field submission
* Verification
* Approval
* Rejection
* Status changes

The audit layer is intended to improve accountability and make project decisions easier to trace.

---

## 📑 9. Reports

ProgressBridge provides structured project information that can be used for monitoring and reporting.

The reporting layer can help authorities understand:

* Project progress
* Activity status
* Verification status
* Field updates
* Historical records

---

# 🧠 Technical Architecture

```text
┌─────────────────────────────────────────────┐
│                  USER LAYER                 │
│                                             │
│ Field Engineer │ Executive Engineer │ Admin │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                 FRONTEND                    │
│                                             │
│ HTML5 │ CSS3 │ JavaScript                   │
│ Dashboard │ Projects │ Reports              │
│ Schedule │ Field Reports │ Verification     │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                FASTAPI API                  │
│                                             │
│ Authentication │ CRUD │ Validation          │
│ Project APIs │ Reports │ Verification       │
└──────────────┬─────────────────┬────────────┘
               │                 │
               ▼                 ▼
┌──────────────────────┐   ┌──────────────────┐
│      DATABASE        │   │    AI ENGINE     │
│                      │   │                  │
│ PostgreSQL           │   │ Sentence         │
│ PostGIS              │   │ Transformers     │
│ Project Data         │   │ Embeddings       │
│ Field Reports        │   │ Cosine Similarity│
│ Audit Records        │   │ Activity Match   │
└──────────────────────┘   └──────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│           VERIFICATION & MONITORING         │
│                                             │
│ Approval │ Audit Trail │ Dashboard │ Reports│
└─────────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Python
* FastAPI

### Database

* PostgreSQL
* PostGIS

### AI / NLP

* Sentence Transformers
* `all-MiniLM-L6-v2`
* Cosine Similarity

### Security

* Authentication
* Role-based access control
* Environment-based secrets
* Audit logging

### Development & Deployment

* Visual Studio Code
* Git
* GitHub
* GitHub Actions
* GitHub Pages
* Backend deployment compatible with services such as Render

---

# 📁 Project Structure

```text
ProgressBridge/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── dashboard.js
│   │   ├── reports.js
│   │   ├── schedule.js
│   │   └── verification.js
│   │
│   └── index.html
│
├── backend/
│   ├── __init__.py
│   ├── ai_engine.py
│   ├── create_tables.py
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── security.py
│   ├── seed_data.py
│   ├── telemetry.py
│   ├── test_db.py
│   └── test_security_telemetry.py
│
├── database/
│   └── schema.sql
│
├── README.md
└── .gitignore
```

---

# 🔗 Data Flow

ProgressBridge connects the major system components through a structured data flow:

```text
Field Engineer
      │
      ▼
Field Report
      │
      ├──────────────► Location / Telemetry
      │
      ▼
Backend API
      │
      ├──────────────► Database
      │
      └──────────────► AI Matching
                              │
                              ▼
                       Activity Match
                              │
                              ▼
                     Verification Desk
                              │
                       ┌──────┴──────┐
                       ▼             ▼
                    Approved      Rejected
                       │
                       ▼
                  Audit Record
                       │
                       ▼
              Dashboard / Reports
```

---

# 🔐 Security & Reliability

Security is considered as part of the system architecture.

The backend contains dedicated security and telemetry components and supports a structure for:

* Authentication
* Role-based authorization
* Secure configuration
* Environment variables
* Audit records
* Validation
* Backend testing

### Important rule

**Secrets and credentials should never be committed to GitHub.**

Production deployment should use environment variables or a secure secret-management system.

---

# 🧪 Testing

The backend repository contains tests covering database and security/telemetry functionality.

Current testing files include:

```text
backend/test_db.py
backend/test_security_telemetry.py
```

The project can be extended with:

* API testing
* Frontend testing
* Integration testing
* End-to-end testing
* Performance testing

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/ItsVidhi07/ProgressBridge.git
```

## 2. Enter the project

```bash
cd ProgressBridge
```

## 3. Frontend

The frontend can be opened using a local development server such as VS Code Live Server.

Main entry point:

```text
frontend/index.html
```

## 4. Backend

Create and activate a Python virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

> Backend dependency configuration may evolve as the prototype continues to develop.

---

# 🌐 Deployment

## Frontend

The current demonstration frontend is deployed using **GitHub Pages**.

### Live:

**https://itsvidhi07.github.io/ProgressBridge/**

## Backend

The backend is structured as a FastAPI application and can be deployed using a cloud service such as Render.

A production deployment should configure:

```text
DATABASE_URL
SUPABASE_URL
SUPABASE_KEY
JWT_SECRET
```

using secure environment variables.

---

# ⚙️ CI/CD

The repository includes a GitHub Actions workflow:

```text
.github/workflows/deploy.yml
```

The workflow provides automated code-quality checking for the project.

This creates a foundation for a more complete CI/CD pipeline as the application moves toward production.

---

# 🏆 Smart India Hackathon 2026

ProgressBridge is being developed as a **Smart India Hackathon 2026** prototype.

### Focus

**Infrastructure Monitoring & Management**

### Core innovation

ProgressBridge connects:

> **Planned Work + Field Evidence + AI Matching + Verification + Auditability**

Instead of treating project progress as a simple manually entered percentage, the platform is designed to create a more evidence-driven monitoring workflow.

---

# 🎯 Expected Impact

ProgressBridge aims to help infrastructure authorities:

* Get a centralized view of project progress
* Connect planned work with field updates
* Reduce manual verification effort
* Identify mismatches between reports and planned activities
* Improve accountability
* Maintain traceable verification records
* Support faster project-level decision making

---

# 🔮 Future Scope

The platform can be extended with:

* 📡 Real-time IoT infrastructure telemetry
* 📱 Dedicated mobile field application
* 📸 Automated image-based progress verification
* 🗺️ GIS-based project visualization
* 🔔 Automated alerts and notifications
* 📈 Advanced project analytics
* 🧠 More advanced AI-based anomaly detection
* 📄 Automated government reports
* 🔗 Integration with government digital platforms
* ☁️ Scalable cloud infrastructure
* 🔐 Stronger production-grade security
* 📊 Predictive project-delay analysis

---

# 👥 Team

ProgressBridge is a collaborative student project developed for **Smart India Hackathon 2026**.

The project combines work across:

* Frontend Development
* Backend Development
* Database Engineering
* AI / NLP
* Security
* Telemetry
* Testing
* Deployment

---

# 📌 Project Status

### 🟢 Working Prototype

The current version includes an interactive deployed prototype together with the project's frontend, backend, database foundation, AI engine, security, telemetry, and testing components.

Some components are prototype implementations intended for demonstration and can be further hardened for production use.

---

# 📚 Repository

### GitHub

https://github.com/ItsVidhi07/ProgressBridge

### Live Demo

https://itsvidhi07.github.io/ProgressBridge/

---

# 📄 License

This project is currently developed for **academic and Smart India Hackathon 2026 purposes**.

A formal open-source license may be added if the project is released for public use.

---

<div align="center">

### 🚧 ProgressBridge

**From planned progress to verified progress.**

Built for **Smart India Hackathon 2026 🇮🇳**

</div>

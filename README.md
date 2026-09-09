ProgressBridge 🚧

Infrastructure Monitoring & Management Portal

ProgressBridge is a web-based infrastructure monitoring and management portal developed as a student team project for Smart India Hackathon 2026.

The project brings together infrastructure information such as projects, assets, maintenance activities, schedules, field updates, reports, and verification workflows into a single interface.

The current repository contains a working frontend prototype together with backend, database, AI, security, telemetry, testing, and deployment-related components that are being developed and integrated progressively.

---

🎯 Problem Statement

Infrastructure projects generate a large amount of information during planning and execution.

Project details, maintenance activities, schedules, field updates, and verification records can become difficult to manage when they are handled separately.

This can make it difficult to:

- Understand project status quickly
- Track planned activities
- Connect field updates with scheduled work
- Review reported progress
- Identify activities that require attention
- Maintain organized project records

The question ProgressBridge addresses

«How can infrastructure project information and field-level progress be organized in one system so that reported work can be reviewed and monitored more effectively?»

---

💡 Our Approach

ProgressBridge provides a centralized interface for infrastructure and project monitoring.

The intended workflow is:

Project / Activity Planning
          ↓
   Schedule of Works
          ↓
    Field Progress
          ↓
      Verification
          ↓
   Project Monitoring
          ↓
      Reports

The repository also contains backend components for AI-assisted activity matching, security, telemetry, database operations, and related services.

---

🚀 Main Features

📊 Dashboard

Provides a central view of project and infrastructure information, including progress and status-related information.

🏗️ Infrastructure & Asset Monitoring

Provides interfaces for organizing infrastructure and asset-related information and monitoring their status.

🔧 Maintenance Management

Provides a structured area for maintenance-related activities and information.

📅 Schedule of Works

Displays planned project activities and their progress/status information in a structured format.

📝 Field Progress

Provides a workflow for recording field-level progress against project activities.

🔎 Verification

Provides a verification interface for reviewing submitted progress information and recording verification decisions.

📑 Reports

Provides structured views of project and progress information.

🤖 AI-Assisted Activity Matching

The repository contains an AI matching module designed to compare field-report descriptions with relevant project activities using semantic similarity.

The backend AI module uses Sentence Transformers and the "all-MiniLM-L6-v2" model, together with similarity and rule-based scoring.

This module is part of the backend implementation and is being integrated progressively with the overall application workflow.

📍 Telemetry

The repository contains a backend telemetry module intended to support field/telemetry-related information.

The current implementation should be considered a prototype component rather than a claim of live infrastructure-device integration.

🔐 Security

The backend contains security-related components for application authentication/authorization functionality.

Production-scale security hardening and complete end-to-end authentication integration remain part of ongoing development.

---

🔄 Intended Verification Workflow

ProgressBridge is designed around the following workflow:

Field Progress
      │
      ▼
Activity Identification
      │
      ▼
Verification Desk
      │
      ▼
Approve / Reject
      │
      ▼
Project Monitoring
      │
      ▼
Reports

The repository also contains AI, telemetry, security, and database components that can extend this workflow as integration progresses.

---

🏗️ System Architecture

                    FIELD USER
                        │
                        ▼
                   FRONTEND
                        │
                        ▼
                FASTAPI BACKEND
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       DATABASE     AI MODULE     TELEMETRY
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                   VERIFICATION
                        │
                        ▼
                 DASHBOARD / REPORTS

The architecture is modular so that individual components can be developed and integrated independently.

---

🛠️ Technology Stack

Frontend

- HTML5
- CSS3
- JavaScript

Backend

- Python
- FastAPI

Database

- PostgreSQL
- PostGIS

AI / NLP

- Sentence Transformers
- "all-MiniLM-L6-v2"
- Semantic similarity
- Cosine similarity

Security & Application Services

- Python-based security components
- Authentication/authorization components

Development

- Visual Studio Code
- Git
- GitHub

CI

- GitHub Actions
- Ruff-based Python code checks

Deployment

- GitHub Pages for the frontend prototype
- Backend deployment configuration/documentation for cloud deployment

---

📁 Repository Structure

ProgressBridge/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── dashboard.js
│       ├── reports.js
│       ├── schedule.js
│       └── verification.js
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
│   ├── requirements.txt
│   ├── test_db.py
│   └── test_security_telemetry.py
│
├── database/
│   └── schema.sql
│
├── .github/
│   └── workflows/
│
├── README.md
└── .gitignore

The repository structure may evolve as development continues.

---

📌 Current Implementation Status

✅ Present in the Repository

Component| Status
GitHub repository| ✅
Frontend application| ✅
Dashboard interface| ✅
Application navigation| ✅
Schedule of Works module| ✅
Reports module| ✅
Verification interface/workflow| ✅
Python backend structure| ✅
FastAPI backend components| ✅
Database schema| ✅
Database models/schemas| ✅
CRUD layer| ✅
Seed/demo data| ✅
AI activity-matching module| ✅
Security module| ✅
Telemetry module| ✅
Backend tests| ✅
GitHub Actions workflow| ✅

🔄 Integration / Development

Component| Status
Complete frontend ↔ backend integration| 🔄 In development
Complete database API integration| 🔄 In development
End-to-end AI integration with verification workflow| 🔄 In development
Complete authentication flow| 🔄 In development
Live telemetry/device integration| 🔄 Not yet demonstrated
Production backend deployment| 🔄 In development
End-to-end production testing| 🔄 In development

🔮 Possible Future Extensions

- Real-time infrastructure/device telemetry
- Advanced geospatial visualization
- Automated field-image validation
- Advanced anomaly detection
- Automated notifications
- Mobile-focused field reporting
- Advanced project analytics
- Production-scale deployment
- Additional security hardening

---

🧪 Prototype Status

Current Stage: Working Prototype — Active Development

The deployed frontend demonstrates the current user-facing ProgressBridge prototype.

The GitHub repository additionally contains backend and supporting modules for database operations, AI-assisted activity matching, security, telemetry, and testing.

These components are being integrated progressively rather than being presented as a fully production-deployed system.

---

🌐 Live Demo

ProgressBridge:
https://itsvidhi07.github.io/ProgressBridge/

---

💻 Getting Started

1. Clone the repository

git clone https://github.com/ItsVidhi07/ProgressBridge.git

2. Open the project

cd ProgressBridge

Open the project in Visual Studio Code.

3. Run the frontend

The current frontend can be opened using the VS Code Live Server extension or another local development server.

Main entry point:

frontend/index.html

Backend setup depends on the current development environment and required database configuration.

---

🔀 Development Workflow

The project is developed collaboratively using Git and GitHub.

Team members can work on separate feature branches and merge completed work into "main".

main
 │
 ├── feature/frontend
 ├── feature/verification
 ├── feature/backend
 ├── feature/database
 └── feature/ai

Example:

git checkout main
git pull origin main

git checkout -b feature/your-feature

git add <files>
git commit -m "describe your change"

git push -u origin feature/your-feature

Changes can then be reviewed through a Pull Request before being merged into "main".

---

📝 Commit Convention

Simple prefixes are used to make project history easier to understand:

feat: add dashboard cards
fix: resolve navigation issue
style: improve responsive layout
refactor: organize frontend structure
docs: update project documentation

Commit messages should describe what changed.

---

⚙️ CI

GitHub Actions is configured under:

.github/workflows/

The repository includes an automated Python code-checking workflow using Ruff.

---

🔐 Environment Variables

Sensitive configuration should be provided through environment variables rather than committed to GitHub.

Examples include:

DATABASE_URL
SUPABASE_URL
SUPABASE_KEY
JWT_SECRET

«Never commit passwords, API keys, database credentials, or other secrets to the repository.»

---

📸 Preview

Screenshots of the current prototype can be added here to make the repository easier to understand.

Recommended screenshots:

1. Dashboard
2. Schedule of Works
3. Verification Desk

Example:

## 📸 Preview

### Dashboard
![ProgressBridge Dashboard](screenshots/dashboard.png)

### Schedule of Works
![Schedule of Works](screenshots/schedule.png)

### Verification Desk
![Verification Desk](screenshots/verification.png)

---

👥 Team

ProgressBridge is being developed collaboratively by a student team.

Areas of contribution include:

- Frontend development
- Backend development
- Database design
- AI / NLP
- Security
- Telemetry
- Testing
- Deployment

---

🏆 Project Goal

ProgressBridge aims to demonstrate how frontend development, backend APIs, databases, AI-assisted matching, security, telemetry, and verification workflows can be combined to address an infrastructure-management problem.

The project focuses on a simple principle:

«Connect what is planned, what is reported, and what is reviewed.»

---

📄 License

This project is currently being developed for academic and educational purposes.

A formal open-source license may be added if the project is released for public use.

---

🚧 Smart India Hackathon 2026

ProgressBridge — From Planned Progress to Verified Progress.
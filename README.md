# ProgressBridge

### Infrastructure Monitoring & Management Portal

ProgressBridge is a web-based infrastructure monitoring and management portal built as a student team project.

The idea is simple: infrastructure-related information can become difficult to manage when assets, maintenance activities, schedules, field updates, and verification records are handled separately. ProgressBridge brings these parts together in one place so users can get a clearer picture of what is happening and what needs attention.

The project is being developed step by step, starting with the frontend and database foundation and gradually adding backend services, telemetry, verification, AI-assisted matching, and audit features.

---

## What Problem Are We Trying to Solve?

Infrastructure projects generate a large amount of information during day-to-day operation.

Asset details, maintenance work, field reports, schedules, and verification records may be stored in different places. This can make it difficult to get a quick overview of project progress and identify what needs attention.

ProgressBridge aims to bring this information into a single system with a clear and practical interface.

---

## Main Features

### 📊 Dashboard

A central overview of infrastructure and project information, including key metrics, status indicators, and items that may need attention.

### 🏗️ Infrastructure & Asset Monitoring

Track infrastructure assets and their current status to help identify maintenance requirements and follow-up work.

### 🔧 Maintenance Management

Keep maintenance activities and related information organized in one place.

### 📅 Schedule of Works

View planned activities in a structured schedule and track their progress and status.

### 📍 Field Progress & Telemetry

The planned system will use location data and field information to help validate reported progress.

### 🔎 Verification

Provide a verification interface where submitted field information can be reviewed and discrepancies can be identified before approval.

### 🤖 AI-Assisted Activity Matching

The planned AI module will compare field-report descriptions with relevant project activities using semantic similarity.

### 🔐 Audit Trail

Important verification and approval actions are planned to be recorded using a tamper-evident audit mechanism.

### 📑 Reports

Provide structured views of project information, progress, and other useful records.

---

## Preview

A project screenshot will be added here once the frontend reaches a stable version.

The goal is to keep the interface simple enough to understand quickly while still providing the information needed for day-to-day monitoring.

---

## Planned System Workflow

The overall system is being designed around the following workflow:

```text
Field Report
     │
     ▼
Location & Photo Validation
     │
     ▼
AI-Assisted Activity Matching
     │
     ▼
Verification Desk
     │
     ▼
Approval / Rejection
     │
     ▼
Audit Record
     │
     ▼
Dashboard & Reports
```

This workflow is intended to connect field-level information with verification and project-level monitoring.

---

## Project Structure

```text
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
│   ├── main.py
│   ├── database.py
│   ├── ai_engine.py
│   ├── security.py
│   ├── telemetry.py
│   ├── requirements.txt
│   └── .env.example
│
├── database/
│   └── schema.sql
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── README.md
└── .gitignore
```

> Some modules are still being developed, so the project structure may change as development continues.

---

## Tech Stack

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
* Cosine similarity

### Development & Deployment

* Visual Studio Code
* Git
* GitHub
* GitHub Actions
* Render / other deployment services as development progresses

---

## How It Is Expected to Work

The planned architecture connects the different parts of the system as follows:

```text
Field Engineer
      │
      ▼
   Frontend
      │
      ▼
 FastAPI Backend
      │
 ┌────┴─────────────┐
 ▼                  ▼
Database       AI Matching
 │                  │
 └────────┬─────────┘
          ▼
     Verification
          │
          ▼
   Dashboard / Reports
```

This architecture will be refined as the backend and AI modules are implemented.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ItsVidhi07/ProgressBridge.git
```

### 2. Open the project

```bash
cd ProgressBridge
```

Open the project folder in Visual Studio Code.

### 3. Run the frontend

The current frontend can be opened using the VS Code Live Server extension or another local development server.

The main entry point is:

```text
frontend/index.html
```

Backend setup instructions will be added as backend development progresses.

---

## Development Workflow

ProgressBridge is being developed collaboratively using Git and GitHub.

Each team member works on their assigned part of the project using a separate feature branch. Changes are then pushed to GitHub through Pull Requests before being merged into `main`.

### Start new work

First, make sure your local `main` branch is up to date:

```bash
git checkout main
git pull origin main
```

Create a branch for your work:

```bash
git checkout -b feature/your-feature
```

### Save your changes

Stage only the files you worked on:

```bash
git add <files>
```

Commit the changes:

```bash
git commit -m "describe your change"
```

Push your branch:

```bash
git push -u origin feature/your-feature
```

Then open a Pull Request on GitHub.

After review, the changes can be merged into `main`.

### Example

```text
main
  │
  ├── feature/member1-frontend
  │
  ├── feature/member2-verification
  │
  ├── feature/member3-backend
  │
  └── feature/member6-database
```

This keeps individual work separated and helps reduce accidental conflicts between team members.

---

## Commit Style

We are using simple commit prefixes to make the project history easier to understand.

```text
feat: add dashboard cards
fix: resolve navigation issue
style: improve responsive layout
refactor: organize frontend structure
docs: update project documentation
```

Commit messages should describe **what changed**, rather than who made the change.

---

## Current Status

### 🚧 In Development

ProgressBridge is currently being developed as a working prototype.

### Completed / In Progress

* [x] GitHub repository setup
* [x] Database foundation
* [x] Frontend project structure
* [x] Initial dashboard interface
* [x] Basic application navigation
* [ ] Schedule of Works module
* [ ] Reports module
* [ ] Verification workflow
* [ ] Field telemetry
* [ ] FastAPI backend
* [ ] Database API integration
* [ ] AI-assisted activity matching
* [ ] Authentication and role-based access
* [ ] Audit ledger
* [ ] Deployment

This checklist will be updated as features are implemented.

---

## Future Improvements

Some features we plan to explore as development continues:

* Real-time infrastructure updates
* Advanced filtering and search
* Better project progress visualization
* Automated notifications
* Mobile-friendly field reporting
* Improved verification workflows
* Role-specific dashboards
* Detailed project reports
* CI/CD and deployment
* Performance and security improvements

---

## Team

ProgressBridge is being developed collaboratively by a student team.

Different members are responsible for areas such as:

* Frontend development
* Backend development
* Database design
* AI/NLP
* Security and telemetry
* Testing and deployment

The project is maintained collaboratively using Git and GitHub.

---

## Project Goal

The goal of ProgressBridge is not to create an unnecessarily complicated monitoring system.

We want to build a practical application that demonstrates how frontend development, databases, APIs, AI, security, and deployment can work together to address a real infrastructure-management problem.

As development continues, the focus will be on making the system useful, understandable, and technically well-structured.

---

## License

This project is currently being developed for academic and educational purposes.

A formal open-source license may be added later if the project is released for public use.

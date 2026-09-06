# ProgressBridge

### Infrastructure Monitoring & Management Portal

ProgressBridge is a web-based portal designed to make infrastructure monitoring easier to manage from one place.

Instead of keeping track of assets, maintenance activities, schedules, and verification work separately, ProgressBridge brings the important information together in a single dashboard.

The project focuses on giving users a clear view of the current state of infrastructure and helping them keep track of what needs attention.

---

## What it does

ProgressBridge provides a central interface for:

* Monitoring infrastructure and asset status
* Viewing important operational information through a dashboard
* Keeping track of maintenance activities
* Managing maintenance schedules
* Recording and reviewing verification information
* Identifying items that may require attention

The goal is to keep the interface simple enough to understand quickly while still providing the information needed for day-to-day monitoring.

---

## Main Features

### Dashboard

A central overview of the system with key information, status indicators, and important metrics.

### Asset & Infrastructure Monitoring

View the current status of infrastructure assets and identify areas that may require maintenance or follow-up.

### Maintenance Management

Keep track of maintenance-related information and activities.

### Schedule Management

Organize upcoming maintenance and related tasks in a structured way.

### Verification

Maintain verification-related records and status information.

### Reports

Provide a structured way to view relevant system information and reports.

---

## Project Structure

```text
ProgressBridge/
│
├── index.html
├── style.css
│
├── app.js
├── dashboard.js
├── reports.js
├── schedule.js
└── verification.js
```

### Frontend Files

| File              | Purpose                            |
| ----------------- | ---------------------------------- |
| `index.html`      | Main structure and interface       |
| `style.css`       | Styling and responsive UI          |
| `app.js`          | Main application logic             |
| `dashboard.js`    | Dashboard functionality            |
| `reports.js`      | Reports-related functionality      |
| `schedule.js`     | Schedule-related functionality     |
| `verification.js` | Verification-related functionality |

Some modules may initially contain placeholder code and will be developed as the project progresses.

---

## Tech Stack

**Frontend**

* HTML5
* CSS3
* JavaScript

**Development**

* Visual Studio Code
* Git
* GitHub

Additional technologies will be added as the backend and other parts of the system are developed.

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Open the project

Open the project folder in Visual Studio Code.

### 3. Run the frontend

Open `index.html` in a browser, or use a local development server such as the VS Code Live Server extension.

---

## Development Workflow

The project is being developed collaboratively using Git and GitHub.

Each team member works on their assigned part of the project and changes are pushed to the shared repository.

Before starting new work:

```bash
git pull
```

After making changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

As the project grows, feature branches and pull requests can be used to keep changes organized and reduce conflicts.

---

## Current Status

**Frontend foundation:** In progress

The initial frontend structure and dashboard interface are being developed. Backend integration, data handling, and additional modules will be added as development continues.

---

## Future Improvements

Planned improvements include:

* Backend integration
* Database connectivity
* User authentication
* Live infrastructure data
* Improved reporting
* Role-based access
* Better filtering and search
* Responsive design improvements
* Notifications for important maintenance events

---

## Team

ProgressBridge is a collaborative student project developed as a team.

Each member contributes to different parts of the application, including frontend development, backend development, database work, and system integration.

---

## Project Goal

The aim of ProgressBridge is not to build another complicated monitoring interface.

It is to create a practical system where important infrastructure information can be understood quickly, managed efficiently, and acted upon when something needs attention.

---

## License

This project is currently developed for academic and educational purposes.

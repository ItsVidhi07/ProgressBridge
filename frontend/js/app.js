/* =========================================================
   PROGRESSBRIDGE
   SIH 2026
   APPLICATION CONTROLLER
   ========================================================= */

const API_BASE_URL =
  "http://127.0.0.1:8000/api/v1";


/* =========================================================
   DEMO USERS
   ========================================================= */

const DEMO_USERS = {

  EXECUTIVE_ENGINEER: {
    name: "Rajesh Kumar",
    designation: "Executive Engineer",
    empId: "PB-EE-104",
    role: "EXECUTIVE_ENGINEER"
  },

  FIELD_ENGINEER: {
    name: "Priya Sharma",
    designation: "Field Engineer",
    empId: "PB-FE-218",
    role: "FIELD_ENGINEER"
  }

};


/* =========================================================
   APPLICATION STORE
   ========================================================= */

const store = {

  currentUser: null,

  selectedProjectId: "INF-MH-2026-014",

  projects: [

    {
      id: "INF-MH-2026-014",
      name: "Mumbai Water Supply Improvement",
      location: "Mumbai, Maharashtra",
      planned: 72,
      actual: 68,
      status: "On Track",
      activities: 6
    },

    {
      id: "INF-DL-2026-022",
      name: "Delhi-NCR Expressway Improvement",
      location: "Delhi-NCR",
      planned: 85,
      actual: 81,
      status: "On Track",
      activities: 5
    },

    {
      id: "INF-KA-2026-055",
      name: "Bengaluru Metro Airport Link",
      location: "Bengaluru, Karnataka",
      planned: 55,
      actual: 49,
      status: "Delayed",
      activities: 4
    }

  ],


  activities: [

    {
      id: "A-001",
      projectId: "INF-MH-2026-014",
      description: "Site preparation and survey",
      discipline: "Civil",
      start: "2026-08-01",
      end: "2026-08-07",
      progress: 100,
      status: "Completed",
      notes: "Survey completed."
    },

    {
      id: "A-002",
      projectId: "INF-MH-2026-014",
      description: "Pipeline trench excavation",
      discipline: "Civil",
      start: "2026-08-08",
      end: "2026-08-20",
      progress: 82,
      status: "On Track",
      notes: "Excavation progressing as scheduled."
    },

    {
      id: "A-003",
      projectId: "INF-MH-2026-014",
      description: "Main pipeline installation",
      discipline: "Water Supply",
      start: "2026-08-18",
      end: "2026-09-05",
      progress: 68,
      status: "On Track",
      notes: "Installation underway."
    },

    {
      id: "A-004",
      projectId: "INF-MH-2026-014",
      description: "Valve chamber construction",
      discipline: "Civil",
      start: "2026-08-25",
      end: "2026-09-12",
      progress: 52,
      status: "On Track",
      notes: "Construction in progress."
    },

    {
      id: "A-005",
      projectId: "INF-MH-2026-014",
      description: "Pressure testing",
      discipline: "Water Supply",
      start: "2026-09-10",
      end: "2026-09-18",
      progress: 20,
      status: "Upcoming",
      notes: "Awaiting installation completion."
    },

    {
      id: "A-006",
      projectId: "INF-MH-2026-014",
      description: "Final restoration",
      discipline: "Civil",
      start: "2026-09-19",
      end: "2026-09-30",
      progress: 0,
      status: "Upcoming",
      notes: "Scheduled after testing."
    },

    {
      id: "A-007",
      projectId: "INF-DL-2026-022",
      description: "Road survey",
      discipline: "Civil",
      start: "2026-07-01",
      end: "2026-07-10",
      progress: 100,
      status: "Completed",
      notes: "Survey completed."
    },

    {
      id: "A-008",
      projectId: "INF-DL-2026-022",
      description: "Drainage improvement",
      discipline: "Civil",
      start: "2026-07-12",
      end: "2026-08-02",
      progress: 92,
      status: "On Track",
      notes: "Work nearing completion."
    },

    {
      id: "A-009",
      projectId: "INF-DL-2026-022",
      description: "Road strengthening",
      discipline: "Road Works",
      start: "2026-08-01",
      end: "2026-09-15",
      progress: 81,
      status: "On Track",
      notes: "Strengthening works underway."
    },

    {
      id: "A-010",
      projectId: "INF-DL-2026-022",
      description: "Safety barrier installation",
      discipline: "Road Safety",
      start: "2026-08-20",
      end: "2026-09-20",
      progress: 62,
      status: "On Track",
      notes: "Installation progressing."
    },

    {
      id: "A-011",
      projectId: "INF-DL-2026-022",
      description: "Final inspection",
      discipline: "Inspection",
      start: "2026-09-21",
      end: "2026-09-28",
      progress: 0,
      status: "Upcoming",
      notes: "Planned after construction."
    },

    {
      id: "A-012",
      projectId: "INF-KA-2026-055",
      description: "Station site preparation",
      discipline: "Civil",
      start: "2026-06-01",
      end: "2026-06-20",
      progress: 100,
      status: "Completed",
      notes: "Site preparation completed."
    },

    {
      id: "A-013",
      projectId: "INF-KA-2026-055",
      description: "Foundation works",
      discipline: "Structural",
      start: "2026-06-21",
      end: "2026-08-05",
      progress: 72,
      status: "Delayed",
      notes: "Material delivery caused delay."
    },

    {
      id: "A-014",
      projectId: "INF-KA-2026-055",
      description: "Structural erection",
      discipline: "Structural",
      start: "2026-08-01",
      end: "2026-10-01",
      progress: 49,
      status: "Delayed",
      notes: "Progress below planned schedule."
    }

  ],


  auditTrail: []

};


/* =========================================================
   ROLE DESCRIPTIONS
   ========================================================= */

const ROLE_DESCRIPTIONS = {

  EXECUTIVE_ENGINEER:
    "Project monitoring, verification and approval workspace",

  FIELD_ENGINEER:
    "Field reporting and infrastructure progress workspace"

};


/* =========================================================
   LOGIN
   ========================================================= */

function handleLogin(event) {

  event.preventDefault();

  const roleElement =
    document.getElementById("login-role");

  const employeeElement =
    document.getElementById("login-employee");

  const passwordElement =
    document.getElementById("login-password");

  const errorElement =
    document.getElementById("login-error");


  if (
    !roleElement ||
    !employeeElement ||
    !passwordElement
  ) {
    return;
  }


  const role =
    roleElement.value;

  const employeeId =
    employeeElement.value
      .trim()
      .toUpperCase();

  const password =
    passwordElement.value;


  const demoUser =
    DEMO_USERS[role];


  if (!demoUser) {

    showLoginError(
      "Invalid role selected."
    );

    return;
  }


  if (
    employeeId !== demoUser.empId ||
    password !== "demo"
  ) {

    showLoginError(
      "Invalid Employee ID or password."
    );

    return;
  }


  store.currentUser = {
    ...demoUser
  };


  sessionStorage.setItem(
    "progressBridgeUser",
    JSON.stringify(store.currentUser)
  );


  if (errorElement) {
    errorElement.textContent = "";
  }


  showApplication();


  navigateTo("/dashboard");

}


/* =========================================================
   DEMO ACCOUNT LOGIN
   ========================================================= */

function useDemoAccount(role) {

  const user =
    DEMO_USERS[role];


  if (!user) {
    return;
  }


  const roleElement =
    document.getElementById("login-role");

  const employeeElement =
    document.getElementById("login-employee");

  const passwordElement =
    document.getElementById("login-password");


  if (roleElement) {
    roleElement.value = role;
  }

  if (employeeElement) {
    employeeElement.value =
      user.empId;
  }

  if (passwordElement) {
    passwordElement.value =
      "demo";
  }


  const loginForm =
    document.getElementById("login-form");


  if (loginForm) {
    loginForm.requestSubmit();
  }

}


/* =========================================================
   LOGIN ERROR
   ========================================================= */

function showLoginError(message) {

  const errorElement =
    document.getElementById("login-error");


  if (errorElement) {
    errorElement.textContent =
      message;
  }

}


/* =========================================================
   SESSION RESTORE
   ========================================================= */

function restoreSession() {

  const savedUser =
    sessionStorage.getItem(
      "progressBridgeUser"
    );


  if (!savedUser) {
    return false;
  }


  try {

    const user =
      JSON.parse(savedUser);


    if (
      !user ||
      !DEMO_USERS[user.role]
    ) {
      return false;
    }


    store.currentUser = user;

    return true;

  } catch (error) {

    console.error(
      "Unable to restore session:",
      error
    );

    return false;
  }

}


/* =========================================================
   SHOW APPLICATION
   ========================================================= */

function showApplication() {

  const loginScreen =
    document.getElementById("login-screen");

  const appShell =
    document.getElementById("app-shell");


  if (loginScreen) {
    loginScreen.classList.add("hidden");
  }

  if (appShell) {
    appShell.classList.remove("hidden");
  }


  updateUserInterface();

}


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLoginScreen() {

  const loginScreen =
    document.getElementById("login-screen");

  const appShell =
    document.getElementById("app-shell");


  if (loginScreen) {
    loginScreen.classList.remove("hidden");
  }

  if (appShell) {
    appShell.classList.add("hidden");
  }

}


/* =========================================================
   USER INTERFACE
   ========================================================= */

function updateUserInterface() {

  const user =
    store.currentUser;


  if (!user) {
    return;
  }


  const sidebarRole =
    document.getElementById("sidebar-role");

  const headerName =
    document.getElementById("header-user-name");

  const headerId =
    document.getElementById("header-user-id");

  const roleDescription =
    document.getElementById("role-description");


  if (sidebarRole) {
    sidebarRole.textContent =
      user.designation;
  }

  if (headerName) {
    headerName.textContent =
      user.name;
  }

  if (headerId) {
    headerId.textContent =
      user.empId;
  }

  if (roleDescription) {
    roleDescription.textContent =
      ROLE_DESCRIPTIONS[user.role] ||
      "Project monitoring workspace";
  }


  updateRoleNavigation();

}


/* =========================================================
   ROLE NAVIGATION
   ========================================================= */

function updateRoleNavigation() {

  const executiveItems =
    document.querySelectorAll(
      ".role-executive"
    );

  const fieldItems =
    document.querySelectorAll(
      ".role-field"
    );


  executiveItems.forEach(
    item => {
      item.style.display = "none";
    }
  );


  fieldItems.forEach(
    item => {
      item.style.display = "none";
    }
  );


  if (
    store.currentUser?.role ===
    "EXECUTIVE_ENGINEER"
  ) {

    executiveItems.forEach(
      item => {
        item.style.display = "";
      }
    );

  }


  if (
    store.currentUser?.role ===
    "FIELD_ENGINEER"
  ) {

    fieldItems.forEach(
      item => {
        item.style.display = "";
      }
    );

  }

}


/* =========================================================
   ROLE ACCESS CONTROL — FRONTEND
   ========================================================= */

function isRouteAllowed(path) {

  const role =
    store.currentUser?.role;


  if (!role) {
    return false;
  }


  if (path === "/dashboard") {
    return true;
  }


  if (role === "FIELD_ENGINEER") {

    return path === "/reports";

  }


  if (role === "EXECUTIVE_ENGINEER") {

    return [
      "/projects",
      "/schedule",
      "/verification",
      "/audit",
      "/ai-engine"
    ].includes(path);

  }


  return false;

}


/* =========================================================
   ROUTER
   ========================================================= */

function navigateTo(path) {

  if (!store.currentUser) {

    showLoginScreen();

    return;

  }


  if (!isRouteAllowed(path)) {

    path = "/dashboard";

  }


  window.location.hash =
    path;


  routeApplication(path);

}


/* =========================================================
   ROUTER
   ========================================================= */

function routeApplication(path) {

  const viewport =
    document.getElementById("viewport");


  if (!viewport) {
    return;
  }


  updateNavigation(path);

  updateBreadcrumb(path);


  switch (path) {

    case "/dashboard":

      if (
        typeof renderDashboard ===
        "function"
      ) {

        renderDashboard();

      } else {

        renderModulePlaceholder(
          "Dashboard"
        );

      }

      break;


    case "/projects":

      renderModulePlaceholder(
        "Projects"
      );

      break;


    case "/schedule":

      if (
        typeof renderSchedule ===
        "function"
      ) {

        renderSchedule();

      } else {

        renderModulePlaceholder(
          "Schedule of Works"
        );

      }

      break;


    case "/reports":

  if (
    typeof renderReportSubmission ===
    "function"
  ) {

    renderReportSubmission(
      viewport
    );

  } else {

    renderModulePlaceholder(
      "Field Reports"
    );

  }

  break;

    case "/verification":

      if (
        typeof renderVerification ===
        "function"
      ) {

        renderVerification();

      } else {

        renderModulePlaceholder(
          "Verification Desk"
        );

      }

      break;


    case "/audit":

      renderModulePlaceholder(
        "Audit Log"
      );

      break;


    case "/ai-engine":

      renderModulePlaceholder(
        "AI Matching Engine"
      );

      break;


    default:

      navigateTo("/dashboard");

  }

}


/* =========================================================
   NAVIGATION STATE
   ========================================================= */

function updateNavigation(path) {

  const links =
    document.querySelectorAll(
      ".nav-link, .sidebar-nav a"
    );


  links.forEach(link => {

    link.classList.remove(
      "active"
    );


    const href =
      link.getAttribute("href");


    if (
      href === `#${path}`
    ) {

      link.classList.add(
        "active"
      );

    }

  });

}


/* =========================================================
   BREADCRUMB
   ========================================================= */

function updateBreadcrumb(path) {

  const breadcrumb =
    document.getElementById(
      "breadcrumb-text"
    );


  if (!breadcrumb) {
    return;
  }


  const labels = {

    "/dashboard":
      "Dashboard",

    "/projects":
      "Projects",

    "/schedule":
      "Schedule of Works",

    "/reports":
      "Field Reports",

    "/verification":
      "Verification Desk",

    "/audit":
      "Audit Log",

    "/ai-engine":
      "AI Matching"

  };


  breadcrumb.textContent =
    labels[path] ||
    "Dashboard";

}


/* =========================================================
   STATUS BADGES
   ========================================================= */

function getStatusBadge(status) {

  const normalized =
    String(status || "")
      .trim()
      .toLowerCase();


  const statusMap = {

    "completed":
      "status-success",

    "on track":
      "status-success",

    "delayed":
      "status-warning",

    "at risk":
      "status-danger",

    "upcoming":
      "status-info",

    "approved":
      "status-success",

    "rejected":
      "status-danger",

    "pending review":
      "status-warning"

  };


  const className =
    statusMap[normalized] ||
    "status-neutral";


  return `
    <span class="status-badge ${className}">
      ${escapeHtml(status || "Unknown")}
    </span>
  `;

}


/* =========================================================
   HTML ESCAPE HELPER
   ========================================================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   MODULE PLACEHOLDER
   ========================================================= */

function renderModulePlaceholder(title) {

  const viewport =
    document.getElementById(
      "viewport"
    );


  if (!viewport) {
    return;
  }


  viewport.innerHTML = `

    <section class="page-header">

      <div>

        <h1 class="page-title">
          ${escapeHtml(title)}
        </h1>

        <p class="page-subtitle">
          This module is being integrated
          with the ProgressBridge backend.
        </p>

      </div>

    </section>


    <section class="gov-card">

      <div class="gov-card-header">

        <div>

          <h3>
            Module Ready
          </h3>

          <p>
            Frontend integration point
          </p>

        </div>

      </div>


      <p class="text-muted">

        The interface is ready for
        backend/API integration.

      </p>

    </section>

  `;

}


/* =========================================================
   SIDEBAR HELPERS
   ========================================================= */

function toggleSidebar() {

  const sidebar =
    document.getElementById(
      "sidebar"
    );


  if (!sidebar) {
    return;
  }


  sidebar.classList.toggle(
    "open"
  );

}


function closeMobileSidebar() {

  const sidebar =
    document.getElementById(
      "sidebar"
    );


  if (!sidebar) {
    return;
  }


  sidebar.classList.remove(
    "open"
  );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutOfficer() {

  const confirmed =
    window.confirm(
      "Are you sure you want to sign out?"
    );


  if (!confirmed) {
    return;
  }


  store.currentUser =
    null;


  sessionStorage.removeItem(
    "progressBridgeUser"
  );


  showLoginScreen();


  const form =
    document.getElementById(
      "login-form"
    );


  if (form) {
    form.reset();
  }


  const error =
    document.getElementById(
      "login-error"
    );


  if (error) {
    error.textContent = "";
  }


  window.location.hash =
    "";


  window.scrollTo(
    0,
    0
  );

}


/* =========================================================
   HASH ROUTING
   ========================================================= */

window.addEventListener(
  "hashchange",
  () => {

    if (!store.currentUser) {
      return;
    }


    const path =
      window.location.hash
        .replace(/^#/, "") ||
      "/dashboard";


    if (!isRouteAllowed(path)) {

      routeApplication(
        "/dashboard"
      );

      return;

    }


    routeApplication(path);

  }
);


/* =========================================================
   APPLICATION STARTUP
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const restored =
      restoreSession();


    if (restored) {

      showApplication();


      const path =
        window.location.hash
          .replace(/^#/, "") ||
        "/dashboard";


      navigateTo(path);

    } else {

      showLoginScreen();

      window.location.hash = "";

    }

  }
);

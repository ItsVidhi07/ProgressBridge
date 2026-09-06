/* =========================================================
   PROGRESSBRIDGE
   MEMBER 1 — APP SHELL, ROUTING & MOCK DATA
   ========================================================= */

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";


/* =========================================================
   APPLICATION STORE
========================================================= */

const store = {

  currentUser: null,

  selectedProjectId: "INF-MH-2026-014",

  projects: [

    {
      id: "INF-MH-2026-014",
      code: "INF-MH-2026-014",
      name: "Mumbai Water Supply Improvement",
      department: "Public Infrastructure Division",
      location: "Mumbai, Maharashtra",

      status: "Under Work",

      plannedProgress: 72,
      actualProgress: 68,

      totalActivities: 6,
      completedActivities: 1,
      delayedActivities: 2,
      atRiskActivities: 1,

      siteGeoCenter: {
        lat: 19.0760,
        lng: 72.8777,
        radiusMeters: 2500
      }
    },

    {
      id: "INF-DL-2026-022",
      code: "INF-DL-2026-022",
      name: "Delhi-NCR Expressway Improvement",
      department: "National Highways Division",
      location: "Delhi-NCR",

      status: "Under Work",

      plannedProgress: 85,
      actualProgress: 81,

      totalActivities: 6,
      completedActivities: 4,
      delayedActivities: 1,
      atRiskActivities: 0,

      siteGeoCenter: {
        lat: 28.5921,
        lng: 77.0460,
        radiusMeters: 3000
      }
    },

    {
      id: "INF-KA-2026-055",
      code: "INF-KA-2026-055",
      name: "Bengaluru Metro Airport Link",
      department: "Urban Transport Division",
      location: "Bengaluru, Karnataka",

      status: "Under Work",

      plannedProgress: 55,
      actualProgress: 49,

      totalActivities: 6,
      completedActivities: 2,
      delayedActivities: 2,
      atRiskActivities: 1,

      siteGeoCenter: {
        lat: 12.9716,
        lng: 77.5946,
        radiusMeters: 4000
      }
    }

  ],


  /* =======================================================
     PROJECT ACTIVITIES
  ======================================================= */

  activities: [

    {
      id: "A-001",
      projectId: "INF-MH-2026-014",

      code: "A-001",

      description: "Check and mark the pipeline route",
      discipline: "Survey",

      start: "01 Aug 2026",
      finish: "15 Aug 2026",

      progress: 100,
      status: "Completed",

      notes:
        "The pipeline route was checked and marked across the planned area."
    },

    {
      id: "A-002",
      projectId: "INF-MH-2026-014",

      code: "A-002",

      description: "Dig the pipeline trench in Zone 1",
      discipline: "Civil",

      start: "10 Aug 2026",
      finish: "22 Aug 2026",

      progress: 85,
      status: "On Track",

      notes:
        "Most of the trench has been completed and work is moving as planned."
    },

    {
      id: "A-003",
      projectId: "INF-MH-2026-014",

      code: "A-003",

      description: "Lay water pipes in Zone 1",
      discipline: "Water Supply",

      start: "18 Aug 2026",
      finish: "28 Aug 2026",

      progress: 72,
      status: "On Track",

      notes:
        "Around 180 metres of water pipe has been placed in Zone 1."
    },

    {
      id: "A-004",
      projectId: "INF-MH-2026-014",

      code: "A-004",

      description: "Repair the road after pipe work",
      discipline: "Civil",

      start: "24 Aug 2026",
      finish: "30 Aug 2026",

      progress: 45,
      status: "Delayed",

      notes:
        "Heavy rain has slowed down road repair work."
    },

    {
      id: "A-005",
      projectId: "INF-MH-2026-014",

      code: "A-005",

      description: "Build the valve chamber",
      discipline: "Civil",

      start: "28 Aug 2026",
      finish: "02 Sep 2026",

      progress: 30,
      status: "At Risk",

      notes:
        "Water entering the work area is slowing construction."
    },

    {
      id: "A-006",
      projectId: "INF-MH-2026-014",

      code: "A-006",

      description: "Test the pipeline and prepare it for use",
      discipline: "Mechanical",

      start: "03 Sep 2026",
      finish: "07 Sep 2026",

      progress: 0,
      status: "Upcoming",

      notes:
        "Testing will begin after the valve chamber work is completed."
    },


    /* =====================================================
       DELHI
    ===================================================== */

    {
      id: "A-007",
      projectId: "INF-DL-2026-022",

      code: "A-007",

      description: "Prepare the road work area",
      discipline: "Civil",

      start: "01 Jul 2026",
      finish: "10 Jul 2026",

      progress: 100,
      status: "Completed",

      notes:
        "The work area has been prepared."
    },

    {
      id: "A-008",
      projectId: "INF-DL-2026-022",

      code: "A-008",

      description: "Build the main road section",
      discipline: "Civil",

      start: "11 Jul 2026",
      finish: "20 Aug 2026",

      progress: 92,
      status: "On Track",

      notes:
        "The main road section is nearing completion."
    },

    {
      id: "A-009",
      projectId: "INF-DL-2026-022",

      code: "A-009",

      description: "Install road lighting",
      discipline: "Electrical",

      start: "15 Aug 2026",
      finish: "30 Aug 2026",

      progress: 78,
      status: "On Track",

      notes:
        "Most lighting units have been installed."
    },

    {
      id: "A-010",
      projectId: "INF-DL-2026-022",

      code: "A-010",

      description: "Build drainage channels",
      discipline: "Civil",

      start: "20 Aug 2026",
      finish: "10 Sep 2026",

      progress: 55,
      status: "Delayed",

      notes:
        "Drainage work is slower than planned."
    },


    /* =====================================================
       BENGALURU
    ===================================================== */

    {
      id: "A-011",
      projectId: "INF-KA-2026-055",

      code: "A-011",

      description: "Prepare the metro work area",
      discipline: "Civil",

      start: "01 Jul 2026",
      finish: "15 Jul 2026",

      progress: 100,
      status: "Completed",

      notes:
        "The work area is ready for construction."
    },

    {
      id: "A-012",
      projectId: "INF-KA-2026-055",

      code: "A-012",

      description: "Build the metro support structure",
      discipline: "Civil",

      start: "16 Jul 2026",
      finish: "30 Aug 2026",

      progress: 70,
      status: "On Track",

      notes:
        "Support structure construction is progressing."
    },

    {
      id: "A-013",
      projectId: "INF-KA-2026-055",

      code: "A-013",

      description: "Install electrical equipment",
      discipline: "Electrical",

      start: "20 Aug 2026",
      finish: "15 Sep 2026",

      progress: 38,
      status: "Delayed",

      notes:
        "Equipment delivery has affected the work."
    },

    {
      id: "A-014",
      projectId: "INF-KA-2026-055",

      code: "A-014",

      description: "Prepare airport-side station work",
      discipline: "Civil",

      start: "25 Aug 2026",
      finish: "20 Sep 2026",

      progress: 20,
      status: "At Risk",

      notes:
        "The work area needs additional preparation."
    }

  ],


  /* =======================================================
     AUDIT TRAIL
  ======================================================= */

  auditTrail: []

};


/* =========================================================
   DEMO USERS
   ---------------------------------------------------------
   These are FRONTEND DEMO accounts.

   Real JWT authentication and backend RBAC will later
   be connected by Member 5.
========================================================= */

const demoUsers = {

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
   AUTHENTICATION
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


  const role =
    roleElement
      ? roleElement.value
      : "";

  const employeeId =
    employeeElement
      ? employeeElement.value.trim()
      : "";

  const password =
    passwordElement
      ? passwordElement.value.trim()
      : "";


  if (!role || !employeeId || !password) {

    if (errorElement) {

      errorElement.textContent =
        "Please enter your role, employee ID and password.";

      errorElement.classList.remove("hidden");
    }

    return;
  }


  const demoUser =
    Object.values(demoUsers)
      .find(user =>
        user.role === role &&
        user.empId.toLowerCase() === employeeId.toLowerCase()
      );


  /*
     Demo login accepts password "demo".

     Later:
     Member 5 will replace this with real JWT login.
  */

  if (!demoUser || password !== "demo") {

    if (errorElement) {

      errorElement.textContent =
        "Invalid demo credentials. Use the demo account buttons below.";

      errorElement.classList.remove("hidden");
    }

    return;
  }


  store.currentUser = {
    name: demoUser.name,
    designation: demoUser.designation,
    empId: demoUser.empId,
    role: demoUser.role
  };


  sessionStorage.setItem(
    "progressBridgeUser",
    JSON.stringify(store.currentUser)
  );


  if (errorElement) {
    errorElement.classList.add("hidden");
  }


  showApplication();

  navigateTo("/dashboard");
}


/* =========================================================
   DEMO ACCOUNT HELPER
========================================================= */

function useDemoAccount(role) {

  const user =
    demoUsers[role];

  if (!user) {
    return;
  }


  const roleElement =
    document.getElementById("login-role");

  const employeeElement =
    document.getElementById("login-employee");

  const passwordElement =
    document.getElementById("login-password");

  const errorElement =
    document.getElementById("login-error");


  if (roleElement) {
    roleElement.value = user.role;
  }

  if (employeeElement) {
    employeeElement.value = user.empId;
  }

  if (passwordElement) {
    passwordElement.value = "demo";
  }

  if (errorElement) {
    errorElement.classList.add("hidden");
  }


  /*
     Automatically sign in after selecting
     a demo account.
  */

  const loginForm =
    document.getElementById("login-form");

  if (loginForm) {
    loginForm.requestSubmit();
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

    const parsedUser =
      JSON.parse(savedUser);


    if (
      !parsedUser ||
      !parsedUser.role ||
      !parsedUser.empId
    ) {
      return false;
    }


    const validRole =
      demoUsers[parsedUser.role];


    if (!validRole) {
      return false;
    }


    store.currentUser = parsedUser;

    showApplication();

    return true;

  } catch (error) {

    console.error(
      "Unable to restore session:",
      error
    );

    sessionStorage.removeItem(
      "progressBridgeUser"
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


  store.currentUser = null;


  sessionStorage.removeItem(
    "progressBridgeUser"
  );


  const loginScreen =
    document.getElementById("login-screen");

  const appShell =
    document.getElementById("app-shell");


  if (appShell) {
    appShell.classList.add("hidden");
  }


  if (loginScreen) {
    loginScreen.classList.remove("hidden");
  }


  const loginForm =
    document.getElementById("login-form");


  if (loginForm) {
    loginForm.reset();
  }


  const errorElement =
    document.getElementById("login-error");


  if (errorElement) {
    errorElement.classList.add("hidden");
  }


  /*
     Clear the protected route so the user
     cannot return to the previous page.
  */

  window.location.hash = "";
}


/* =========================================================
   UPDATE USER INTERFACE
========================================================= */

function updateUserInterface() {

  if (!store.currentUser) {
    return;
  }


  const user =
    store.currentUser;


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
      `${user.designation} • ${user.empId}`;
  }


  if (roleDescription) {

    if (user.role === "FIELD_ENGINEER") {

      roleDescription.textContent =
        "Submit field progress reports and update site work.";

    } else {

      roleDescription.textContent =
        "Monitor project progress, verify reports and manage infrastructure work.";
    }
  }


  updateRoleNavigation();
}


/* =========================================================
   ROLE-BASED NAVIGATION
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


  executiveItems.forEach(item => {

    item.style.display =
      "none";
  });


  fieldItems.forEach(item => {

    item.style.display =
      "none";
  });


  if (!store.currentUser) {
    return;
  }


  if (
    store.currentUser.role ===
    "EXECUTIVE_ENGINEER"
  ) {

    executiveItems.forEach(item => {

      item.style.display =
        "";
    });

  }


  if (
    store.currentUser.role ===
    "FIELD_ENGINEER"
  ) {

    fieldItems.forEach(item => {

      item.style.display =
        "";
    });
  }
}


/* =========================================================
   ROUTE ACCESS CONTROL
========================================================= */

function isRouteAllowed(path) {

  if (!store.currentUser) {
    return false;
  }


  const role =
    store.currentUser.role;


  /*
     Dashboard is available to both roles.
  */

  if (path === "/dashboard") {
    return true;
  }


  /*
     Field Engineer:
     - Dashboard
     - Field Reports
  */

  if (role === "FIELD_ENGINEER") {

    return path === "/reports";
  }


  /*
     Executive Engineer:
     - Dashboard
     - Projects
     - Schedule
     - Verification
     - Audit
     - AI Engine
  */

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

function navigateTo(route) {

  if (!store.currentUser) {
    return;
  }


  window.location.hash = route;

  closeMobileSidebar();
}


function router() {

  /*
     Do not allow protected pages before login.
  */

  if (!store.currentUser) {

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


    return;
  }


  const rawHash =
    window.location.hash.slice(1) ||
    "/dashboard";


  const parts =
    rawHash
      .split("/")
      .filter(Boolean);


  const section =
    parts[0] || "dashboard";


  const parameter =
    parts[1] || null;


  const basePath =
    `/${section}`;


  /*
     Check whether current role can access
     this route.
  */

  if (!isRouteAllowed(basePath)) {

    window.location.hash =
      "/dashboard";

    return;
  }


  const viewport =
    document.getElementById("viewport");


  if (!viewport) {
    return;
  }


  updateNavigation(section);

  updateBreadcrumb(
    section,
    parameter
  );


  switch (section) {

    /* =====================================================
       DASHBOARD
    ===================================================== */

    case "dashboard":

      if (
        typeof renderDashboard ===
        "function"
      ) {

        renderDashboard(viewport);

      } else {

        renderModulePlaceholder(
          viewport,
          "Dashboard",
          "Dashboard module is being connected."
        );
      }

      break;


    /* =====================================================
       PROJECTS
    ===================================================== */

    case "projects":

      if (parameter) {

        if (
          typeof renderProjectDetail ===
          "function"
        ) {

          renderProjectDetail(
            viewport,
            parameter
          );

        } else {

          renderModulePlaceholder(
            viewport,
            "Project Details",
            "Project detail module is being connected."
          );
        }

      } else {

        if (
          typeof renderProjectsList ===
          "function"
        ) {

          renderProjectsList(viewport);

        } else {

          renderModulePlaceholder(
            viewport,
            "Projects",
            "Project list module is being connected."
          );
        }
      }

      break;


    /* =====================================================
       SCHEDULE
    ===================================================== */

    case "schedule":

      if (parameter) {

        if (
          typeof renderTaskDetail ===
          "function"
        ) {

          renderTaskDetail(
            viewport,
            parameter
          );

        } else {

          renderModulePlaceholder(
            viewport,
            "Task Details",
            "Task detail module is being connected."
          );
        }

      } else {

        if (
          typeof renderSchedule ===
          "function"
        ) {

          renderSchedule(viewport);

        } else {

          renderModulePlaceholder(
            viewport,
            "Schedule of Works",
            "Schedule module is being connected."
          );
        }
      }

      break;


    /* =====================================================
       FIELD REPORTS
    ===================================================== */

    case "reports":

      if (
        typeof renderReportSubmission ===
        "function"
      ) {

        renderReportSubmission(
          viewport
        );

      } else {

        renderModulePlaceholder(
          viewport,
          "Field Reports",
          "The field report module will be connected by Member 2."
        );
      }

      break;


    /* =====================================================
       VERIFICATION
    ===================================================== */

    case "verification":

      if (
        typeof renderVerification ===
        "function"
      ) {

        renderVerification(
          viewport
        );

      } else {

        renderModulePlaceholder(
          viewport,
          "Verification",
          "The verification module will be connected by Member 2."
        );
      }

      break;


    /* =====================================================
       AUDIT
    ===================================================== */

    case "audit":

      if (
        typeof renderAudit ===
        "function"
      ) {

        renderAudit(
          viewport
        );

      } else {

        renderModulePlaceholder(
          viewport,
          "Activity Log",
          "The activity log will be connected to the backend audit records."
        );
      }

      break;


    /* =====================================================
       AI ENGINE
    ===================================================== */

    case "ai-engine":

      if (
        typeof renderAIEngine ===
        "function"
      ) {

        renderAIEngine(
          viewport
        );

      } else {

        renderModulePlaceholder(
          viewport,
          "AI Progress Analysis",
          "AI-based progress analysis will be connected here."
        );
      }

      break;


    /* =====================================================
       FALLBACK
    ===================================================== */

    default:

      viewport.innerHTML = `

        <section class="gov-card">

          <h2 class="page-title">
            Page not found
          </h2>

          <p class="page-subtitle">
            The page you requested does not exist.
          </p>

          <button
            class="gov-btn gov-btn-primary"
            onclick="navigateTo('/dashboard')"
          >
            Go to Dashboard
          </button>

        </section>

      `;
  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   NAVIGATION UI
========================================================= */

function updateNavigation(section) {

  document
    .querySelectorAll(
      ".nav-link, .sidebar-nav a"
    )
    .forEach(link => {

      link.classList.remove(
        "active"
      );
    });


  const active =
    document.getElementById(
      `nav-${section}`
    );


  if (active) {

    active.classList.add(
      "active"
    );
  }
}


/* =========================================================
   BREADCRUMB
========================================================= */

function updateBreadcrumb(
  section,
  parameter
) {

  const labels = {

    dashboard:
      "Dashboard",

    projects:
      parameter
        ? "Project Details"
        : "Projects",

    schedule:
      parameter
        ? "Task Details"
        : "Schedule of Works",

    reports:
      "Field Reports",

    verification:
      "Verification",

    audit:
      "Activity Log",

    "ai-engine":
      "AI Progress Analysis"

  };


  const breadcrumb =
    document.getElementById(
      "breadcrumb-text"
    );


  if (breadcrumb) {

    breadcrumb.textContent =
      labels[section] ||
      "Page";
  }
}


/* =========================================================
   STATUS HELPERS
========================================================= */

function getStatusBadge(status) {

  const statusMap = {

    Completed:
      "status-completed",

    "On Track":
      "status-on-track",

    Delayed:
      "status-delayed",

    "At Risk":
      "status-at-risk",

    Upcoming:
      "status-upcoming",

    Approved:
      "status-approved",

    Rejected:
      "status-rejected",

    "Pending Review":
      "status-pending"

  };


  return (
    statusMap[status] ||
    "status-upcoming"
  );
}


/* =========================================================
   UI HELPERS
========================================================= */

function toggleSidebar() {

  const sidebar =
    document.getElementById(
      "sidebar"
    );

  const overlay =
    document.getElementById(
      "sidebar-overlay"
    );


  if (sidebar) {

    sidebar.classList.toggle(
      "open"
    );
  }


  if (overlay) {

    overlay.classList.toggle(
      "visible"
    );
  }
}


function closeMobileSidebar() {

  const sidebar =
    document.getElementById(
      "sidebar"
    );

  const overlay =
    document.getElementById(
      "sidebar-overlay"
    );


  if (sidebar) {

    sidebar.classList.remove(
      "open"
    );
  }


  if (overlay) {

    overlay.classList.remove(
      "visible"
    );
  }
}


/* =========================================================
   USER MENU
========================================================= */

function showUserMenu() {

  if (!store.currentUser) {

    alert(
      "You are not signed in."
    );

    return;
  }


  alert(
    `Signed in as ${store.currentUser.name}\n` +
    `${store.currentUser.designation}\n` +
    `Employee ID: ${store.currentUser.empId}`
  );
}


/* =========================================================
   MODULE PLACEHOLDER
========================================================= */

function renderModulePlaceholder(
  target,
  title,
  description
) {

  target.innerHTML = `

    <div class="page-header">

      <div>

        <h2 class="page-title">
          ${title}
        </h2>

        <p class="page-subtitle">
          ${description}
        </p>

      </div>

    </div>


    <section class="gov-card">

      <div class="empty-state">

        <strong>
          Module connection point
        </strong>

        <p>
          This screen is ready for the
          corresponding team member's module.
        </p>

      </div>

    </section>

  `;
}


/* =========================================================
   START APPLICATION
========================================================= */

window.addEventListener(
  "hashchange",
  router
);


window.addEventListener(
  "load",
  () => {

    /*
       First try to restore the previous
       signed-in session.
    */

    const restored =
      restoreSession();


    if (restored) {

      /*
         If a valid session exists,
         open the saved route or dashboard.
      */

      if (window.location.hash) {

        router();

      } else {

        navigateTo(
          "/dashboard"
        );
      }

      return;
    }


    /*
       No session = show Sign In.
    */

    const loginScreen =
      document.getElementById(
        "login-screen"
      );

    const appShell =
      document.getElementById(
        "app-shell"
      );


    if (loginScreen) {

      loginScreen.classList.remove(
        "hidden"
      );
    }


    if (appShell) {

      appShell.classList.add(
        "hidden"
      );
    }


    /*
       Clear stale protected route.
    */

    if (window.location.hash) {

      window.history.replaceState(
        null,
        "",
        window.location.pathname +
        window.location.search
      );
    }

  }
);
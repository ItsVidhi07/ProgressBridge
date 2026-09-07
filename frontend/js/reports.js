/* =========================================================
   PROGRESSBRIDGE
   MEMBER 2 — FIELD REPORT SUBMISSION & TELEMETRY
   ---------------------------------------------------------
   Called by app.js's router for the "/reports" route via
   renderReportSubmission(viewport). Captures GPS location,
   simulates EXIF metadata from an uploaded photo, and runs a
   lightweight mock of Member 4's semantic matching engine so
   the Verification Desk has something real to review.
   ========================================================= */

/* Shared in-memory store for submitted field reports.
   Lives on the global `store` object (defined in app.js) so
   verification.js can read the same data. */
store.reports = store.reports || [];

/* Telemetry captured for the report currently being drafted.
   Reset after each successful submission. */
let draftTelemetry = {
  latitude: null,
  longitude: null,
  accuracy: null,
  withinGeofence: null,
  distanceMeters: null
};

let draftPhoto = null;


/* =========================================================
   MAIN VIEW
========================================================= */

function renderReportSubmission(target) {

  const project =
    store.projects.find(
      item => item.id === store.selectedProjectId
    ) || store.projects[0];

  const activities =
    store.activities.filter(
      task => task.projectId === project.id
    );

  target.innerHTML = `

    <div class="page-header">

      <div>

        <h2 class="page-title">
          Submit Field Report
        </h2>

        <p class="page-subtitle">
          Record on-site progress with a verified GPS location and photo evidence.
        </p>

      </div>

    </div>


    <section class="gov-card">

      <div class="gov-card-header">

        <div>
          <h3>Report Details</h3>
          <p>${project.code} — ${project.name}</p>
        </div>

      </div>

      <form id="report-form" onsubmit="submitFieldReport(event)">

        <div class="form-row">

          <div class="form-group">

            <label for="report-project">
              Project
            </label>

            <select
              id="report-project"
              class="form-control"
              onchange="changeReportProject(this.value)"
            >

              ${store.projects
                .map(
                  item => `
                    <option
                      value="${item.id}"
                      ${item.id === project.id ? "selected" : ""}
                    >
                      ${item.code} — ${item.name}
                    </option>
                  `
                )
                .join("")}

            </select>

          </div>


          <div class="form-group">

            <label for="report-activity">
              Activity
            </label>

            <select
              id="report-activity"
              class="form-control"
              onchange="syncDisciplineFromActivity(this.value)"
            >

              ${activities
                .map(
                  task => `
                    <option value="${task.id}">
                      ${task.code} — ${task.description}
                    </option>
                  `
                )
                .join("")}

            </select>

          </div>

        </div>


        <div class="form-row">

          <div class="form-group">

            <label for="report-discipline">
              Discipline (as observed on site)
            </label>

            <select id="report-discipline" class="form-control">

              ${["Civil", "Water Supply", "Electrical", "Mechanical", "Survey"]
                .map(
                  discipline => `
                    <option
                      value="${discipline}"
                      ${
                        activities[0] &&
                        activities[0].discipline === discipline
                          ? "selected"
                          : ""
                      }
                    >
                      ${discipline}
                    </option>
                  `
                )
                .join("")}

            </select>

          </div>


          <div class="form-group">

            <label for="report-progress">
              Claimed Progress (%)
            </label>

            <input
              id="report-progress"
              type="number"
              min="0"
              max="100"
              class="form-control"
              placeholder="e.g. 65"
              required
            >

          </div>

        </div>


        <div class="form-group">

          <label for="report-narrative">
            Field Narrative
          </label>

          <textarea
            id="report-narrative"
            class="form-control"
            placeholder="Describe the work completed on site..."
            required
          ></textarea>

        </div>


        <div class="form-group">

          <label for="report-photo">
            Site Photo
          </label>

          <input
            id="report-photo"
            type="file"
            accept="image/*"
            class="form-control"
            onchange="handlePhotoCapture(event)"
          >

          <div id="photo-status" class="report-subtitle"></div>

        </div>


        <div class="form-group">

          <label>
            Location Verification
          </label>

          <div class="geo-audit-card">

            <div id="geo-status-text">
              GPS location not yet captured.
            </div>

            <span id="geo-pill" class="geo-pill geo-fail">
              Not Verified
            </span>

          </div>

          <button
            type="button"
            class="gov-btn gov-btn-secondary gov-btn-sm"
            style="margin-top:10px;"
            onclick="captureFieldLocation()"
          >
            Capture GPS Location
          </button>

        </div>


        <div id="report-error" class="login-error"></div>

        <button type="submit" class="gov-btn gov-btn-primary">
          Submit Field Report
        </button>

      </form>

    </section>


    <section class="gov-card">

      <div class="gov-card-header">

        <div>
          <h3>My Submitted Reports</h3>
          <p>Track the verification status of reports submitted for this project.</p>
        </div>

      </div>

      ${renderMyReportsTable(project.id)}

    </section>

  `;
}


function changeReportProject(projectId) {

  store.selectedProjectId = projectId;

  draftTelemetry = {
    latitude: null,
    longitude: null,
    accuracy: null,
    withinGeofence: null,
    distanceMeters: null
  };

  draftPhoto = null;

  renderReportSubmission(
    document.getElementById("viewport")
  );
}


function syncDisciplineFromActivity(activityId) {

  const activity =
    store.activities.find(
      task => task.id === activityId
    );

  const disciplineSelect =
    document.getElementById("report-discipline");

  if (activity && disciplineSelect) {
    disciplineSelect.value = activity.discipline;
  }
}


/* =========================================================
   MY REPORTS TABLE
========================================================= */

function renderMyReportsTable(projectId) {

  const reports =
    store.reports.filter(
      report => report.projectId === projectId
    );

  if (!reports.length) {
    return `
      <div class="empty-state">
        <strong>No reports submitted yet</strong>
        <p>Field reports you submit for this project will appear here with their verification status.</p>
      </div>
    `;
  }

  return `
    <div class="table-container">

      <table class="gov-table">

        <thead>
          <tr>
            <th>Activity</th>
            <th>Claimed Progress</th>
            <th>AI Confidence</th>
            <th>Submitted</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          ${reports
            .map(
              report => `
                <tr>

                  <td>
                    <div class="task-name">${report.activityDescription}</div>
                    <div class="table-muted">${report.activityCode}</div>
                  </td>

                  <td>${report.claimedProgress}%</td>

                  <td>${report.aiMatch.confidenceScore}%</td>

                  <td>${new Date(report.submittedAt).toLocaleString()}</td>

                  <td>
                    <span class="status-badge ${getStatusBadge(report.status)}">
                      ${report.status}
                    </span>
                  </td>

                </tr>
              `
            )
            .join("")}

        </tbody>

      </table>

    </div>
  `;
}


/* =========================================================
   GPS GEOFENCE CAPTURE
   ---------------------------------------------------------
   Uses the HTML5 Geolocation API and checks the reading
   against the selected project's siteGeoCenter (Haversine
   distance vs. radiusMeters) so a report can't be falsified
   from off-site.
========================================================= */

function captureFieldLocation() {

  const projectSelect =
    document.getElementById("report-project");

  const project =
    store.projects.find(
      item => item.id === (projectSelect ? projectSelect.value : store.selectedProjectId)
    ) || store.projects[0];

  const geoPill = document.getElementById("geo-pill");
  const geoText = document.getElementById("geo-status-text");

  if (!("geolocation" in navigator)) {
    if (geoText) geoText.textContent = "Geolocation is not supported by this browser.";
    return;
  }

  if (geoText) geoText.textContent = "Requesting GPS location…";

  navigator.geolocation.getCurrentPosition(

    (position) => {

      const { latitude, longitude, accuracy } = position.coords;

      const distance = haversineMeters(
        latitude,
        longitude,
        project.siteGeoCenter.lat,
        project.siteGeoCenter.lng
      );

      const withinGeofence = distance <= project.siteGeoCenter.radiusMeters;

      draftTelemetry = {
        latitude,
        longitude,
        accuracy,
        withinGeofence,
        distanceMeters: Math.round(distance)
      };

      if (geoText) {
        geoText.textContent =
          `Captured: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} ` +
          `(±${Math.round(accuracy)}m) — ${Math.round(distance)}m from site center`;
      }

      if (geoPill) {
        geoPill.textContent = withinGeofence ? "Within Geofence" : "Outside Geofence";
        geoPill.className = `geo-pill ${withinGeofence ? "geo-pass" : "geo-fail"}`;
      }
    },

    (error) => {
      if (geoText) geoText.textContent = `GPS error: ${error.message}`;
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}


function haversineMeters(lat1, lon1, lat2, lon2) {

  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}


/* =========================================================
   MOCK EXIF PHOTO CAPTURE
   ---------------------------------------------------------
   Real EXIF parsing needs a binary-reading library; this
   simulates the same payload shape (timestamp, device
   signature) so the rest of the pipeline can be built and
   demoed without that dependency.
========================================================= */

function handlePhotoCapture(event) {

  const file = event.target.files && event.target.files[0];
  const statusEl = document.getElementById("photo-status");

  if (!file) {
    draftPhoto = null;
    if (statusEl) statusEl.textContent = "";
    return;
  }

  const devices = [
    ["Samsung", "Galaxy A54"],
    ["Xiaomi", "Redmi Note 12 Pro"],
    ["OnePlus", "Nord CE3"],
    ["Realme", "11 Pro"],
    ["Vivo", "V29"]
  ];

  const pick = devices[Math.floor(Math.random() * devices.length)];

  draftPhoto = {
    fileName: file.name,
    capturedAt: new Date(file.lastModified || Date.now()).toISOString(),
    deviceSignature: `${pick[0]} ${pick[1]}`
  };

  if (statusEl) {
    statusEl.textContent =
      `Photo attached — ${draftPhoto.fileName} ` +
      `(captured on ${draftPhoto.deviceSignature}, ${new Date(draftPhoto.capturedAt).toLocaleString()})`;
  }
}


/* =========================================================
   SUBMIT REPORT
========================================================= */

function submitFieldReport(event) {

  event.preventDefault();

  const errorEl = document.getElementById("report-error");
  if (errorEl) errorEl.textContent = "";

  const projectId = document.getElementById("report-project").value;
  const activityId = document.getElementById("report-activity").value;
  const discipline = document.getElementById("report-discipline").value;
  const progress = Number(document.getElementById("report-progress").value);
  const narrative = document.getElementById("report-narrative").value.trim();

  const project = store.projects.find(item => item.id === projectId);
  const activity = store.activities.find(task => task.id === activityId);

  if (!activity) {
    if (errorEl) errorEl.textContent = "Please select a valid activity.";
    return;
  }

  if (!narrative) {
    if (errorEl) errorEl.textContent = "Please describe the work completed on site.";
    return;
  }

  if (Number.isNaN(progress) || progress < 0 || progress > 100) {
    if (errorEl) errorEl.textContent = "Enter a valid progress percentage (0–100).";
    return;
  }

  if (draftTelemetry.latitude === null) {
    if (errorEl) errorEl.textContent = "Please capture your GPS location before submitting.";
    return;
  }

  const aiMatch = computeMockAIMatch(
    narrative,
    activity,
    progress,
    discipline,
    draftTelemetry.withinGeofence
  );

  const report = {
    id: `RPT-${Date.now()}`,
    projectId: project.id,
    projectCode: project.code,
    projectName: project.name,
    activityId: activity.id,
    activityCode: activity.code,
    activityDescription: activity.description,
    claimedDiscipline: discipline,
    claimedProgress: progress,
    narrative,
    submittedBy: store.currentUser
      ? { name: store.currentUser.name, empId: store.currentUser.empId }
      : { name: "Unknown", empId: "—" },
    submittedAt: new Date().toISOString(),
    gps: { ...draftTelemetry },
    photo: draftPhoto,
    aiMatch,
    status: "Pending Review",
    officerFeedback: null,
    decidedAt: null,
    decidedBy: null
  };

  store.reports.unshift(report);

  draftTelemetry = {
    latitude: null,
    longitude: null,
    accuracy: null,
    withinGeofence: null,
    distanceMeters: null
  };

  draftPhoto = null;

  renderReportSubmission(
    document.getElementById("viewport")
  );
}


/* =========================================================
   MOCK AI MATCHING (stand-in for Member 4's backend engine)
   ---------------------------------------------------------
   Runs at submission time and stores its result on the
   report, mirroring how the real sentence-transformer
   service (ai_engine.py) would respond. Produces a
   confidence score plus 5 explanatory heuristics.
========================================================= */

function computeMockAIMatch(narrative, activity, claimedProgress, claimedDiscipline, withinGeofence) {

  const overlap = wordOverlapRatio(narrative, activity.description);

  let score = Math.round(48 + overlap * 45 + (Math.random() * 6 - 3));

  const heuristics = [];

  heuristics.push(
    `Semantic similarity with baseline activity description: ${Math.round(overlap * 100)}%`
  );

  if (claimedDiscipline === activity.discipline) {
    heuristics.push(
      `Claimed discipline (${claimedDiscipline}) matches the baseline activity discipline`
    );
  } else {
    heuristics.push(
      `⚠ Claimed discipline (${claimedDiscipline}) differs from baseline discipline (${activity.discipline})`
    );
    score -= 8;
  }

  const today = new Date();
  const start = new Date(activity.start);
  const finish = new Date(activity.finish);

  if (
    !Number.isNaN(start.getTime()) &&
    !Number.isNaN(finish.getTime()) &&
    today >= start &&
    today <= finish
  ) {
    heuristics.push("Report date falls within the planned execution window");
  } else {
    heuristics.push("⚠ Report date falls outside the planned execution window");
    score -= 6;
  }

  if (claimedProgress >= activity.progress) {
    heuristics.push("Claimed progress is consistent with, or ahead of, the last recorded value");
  } else {
    heuristics.push(
      `⚠ Claimed progress (${claimedProgress}%) is lower than the last recorded value (${activity.progress}%) — possible anomaly`
    );
    score -= 12;
  }

  if (withinGeofence) {
    heuristics.push("Field location verified within the project geofence radius");
  } else {
    heuristics.push("⚠ Field location could not be verified within the project geofence radius");
    score -= 10;
  }

  score = Math.max(5, Math.min(99, score));

  return {
    recommendedActivityCode: activity.code,
    confidenceScore: score,
    heuristics
  };
}


function wordOverlapRatio(textA, textB) {

  const stopWords = new Set([
    "the", "a", "an", "of", "in", "on", "to", "and", "for",
    "with", "is", "was", "has", "have", "been", "near",
    "across", "around", "at"
  ]);

  const tokenize = (text) =>
    (text.toLowerCase().match(/[a-z0-9]+/g) || [])
      .filter(word => !stopWords.has(word) && word.length > 2);

  const tokensA = new Set(tokenize(textA));
  const tokensB = new Set(tokenize(textB));

  if (!tokensA.size || !tokensB.size) return 0;

  let shared = 0;
  tokensA.forEach(token => {
    if (tokensB.has(token)) shared += 1;
  });

  return shared / Math.max(tokensA.size, tokensB.size);
}

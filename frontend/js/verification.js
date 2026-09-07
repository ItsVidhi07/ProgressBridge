/* =========================================================
   PROGRESSBRIDGE
   MEMBER 2 — VERIFICATION DESK & AUDIT LEDGER ENTRY
   ---------------------------------------------------------
   Called by app.js's router for the "/verification" route
   via renderVerification(viewport). Lists field reports
   awaiting review, opens a dual-pane comparison (submitted
   report vs. AI-recommended alignment), and records the
   officer's decision as a SHA-256 chained entry in
   store.auditTrail (a lightweight stand-in for Member 5's
   backend cryptographic ledger).
   ========================================================= */


/* =========================================================
   VERIFICATION DESK — LIST VIEW
========================================================= */

function renderVerification(target) {

  const pending =
    store.reports.filter(
      report => report.status === "Pending Review"
    );

  const decided =
    store.reports.filter(
      report => report.status !== "Pending Review"
    );

  target.innerHTML = `

    <div class="page-header">

      <div>

        <h2 class="page-title">
          Verification Desk
        </h2>

        <p class="page-subtitle">
          Review field reports against AI-recommended alignment before issuing a sanction.
        </p>

      </div>

    </div>


    <section class="gov-card">

      <div class="gov-card-header">

        <div>
          <h3>Pending Verification</h3>
          <p>${pending.length} report(s) awaiting review</p>
        </div>

      </div>

      ${
        pending.length
          ? renderPendingTable(pending)
          : `
            <div class="empty-state">
              <strong>No reports awaiting verification</strong>
              <p>New field reports will appear here as they are submitted.</p>
            </div>
          `
      }

    </section>


    ${
      decided.length
        ? `
          <section class="gov-card">

            <div class="gov-card-header">

              <div>
                <h3>Recently Decided</h3>
                <p>Last ${Math.min(decided.length, 10)} verification decisions</p>
              </div>

            </div>

            ${renderDecidedTable(decided.slice(0, 10))}

          </section>
        `
        : ""
    }

  `;
}


function renderPendingTable(reports) {

  return `
    <div class="table-container">

      <table class="gov-table">

        <thead>
          <tr>
            <th>Project</th>
            <th>Activity</th>
            <th>Claimed Progress</th>
            <th>AI Confidence</th>
            <th>Submitted By</th>
            <th></th>
          </tr>
        </thead>

        <tbody>

          ${reports
            .map(
              report => `
                <tr>

                  <td>
                    <div class="task-name">${report.projectName}</div>
                    <div class="table-muted">${report.projectCode}</div>
                  </td>

                  <td>
                    <div class="task-name">${report.activityDescription}</div>
                    <div class="table-muted">${report.activityCode}</div>
                  </td>

                  <td>${report.claimedProgress}%</td>

                  <td>${report.aiMatch.confidenceScore}%</td>

                  <td>${report.submittedBy.name}</td>

                  <td>
                    <button
                      class="gov-btn gov-btn-primary gov-btn-sm"
                      onclick="openVerificationCase('${report.id}')"
                    >
                      Review
                    </button>
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


function renderDecidedTable(reports) {

  return `
    <div class="table-container">

      <table class="gov-table">

        <thead>
          <tr>
            <th>Activity</th>
            <th>Decision</th>
            <th>Decided By</th>
            <th>Decided At</th>
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

                  <td>
                    <span class="status-badge ${getStatusBadge(report.status)}">
                      ${report.status}
                    </span>
                  </td>

                  <td>${report.decidedBy || "—"}</td>

                  <td>${report.decidedAt ? new Date(report.decidedAt).toLocaleString() : "—"}</td>

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
   DUAL-PANE VERIFICATION CASE
========================================================= */

function openVerificationCase(reportId) {

  const target = document.getElementById("viewport");
  const report = store.reports.find(item => item.id === reportId);

  if (!report) {
    renderModulePlaceholder(
      target,
      "Report not found",
      "The selected field report could not be found."
    );
    return;
  }

  const confidenceClass = getConfidenceClass(report.aiMatch.confidenceScore);

  target.innerHTML = `

    <div class="page-header">

      <div>
        <h2 class="page-title">Verify Field Report</h2>
        <p class="page-subtitle">${report.projectName} — ${report.activityCode}</p>
      </div>

      <button
        class="gov-btn gov-btn-secondary"
        onclick="navigateTo('/verification')"
      >
        ← Back to Verification Desk
      </button>

    </div>


    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">

      <section class="gov-card">

        <div class="report-section-title">
          Submitted Field Report
        </div>

        <div class="audit-row">
          <span class="audit-label">Project</span>
          <span class="audit-value">${report.projectName}</span>
        </div>

        <div class="audit-row">
          <span class="audit-label">Activity</span>
          <span class="audit-value">${report.activityCode} — ${report.activityDescription}</span>
        </div>

        <div class="audit-row">
          <span class="audit-label">Claimed Discipline</span>
          <span class="audit-value">${report.claimedDiscipline}</span>
        </div>

        <div class="audit-row">
          <span class="audit-label">Claimed Progress</span>
          <span class="audit-value">${report.claimedProgress}%</span>
        </div>

        <div class="audit-row">
          <span class="audit-label">Submitted By</span>
          <span class="audit-value">${report.submittedBy.name} (${report.submittedBy.empId})</span>
        </div>

        <div class="audit-row">
          <span class="audit-label">Submitted At</span>
          <span class="audit-value">${new Date(report.submittedAt).toLocaleString()}</span>
        </div>

        <div class="form-group" style="margin-top:14px;">
          <label>Field Narrative</label>
          <p class="report-value">${report.narrative}</p>
        </div>

        <div class="geo-audit-card">

          <div>
            GPS: ${report.gps.latitude.toFixed(4)}, ${report.gps.longitude.toFixed(4)}
            (±${Math.round(report.gps.accuracy)}m, ${report.gps.distanceMeters}m from site center)
          </div>

          <span class="geo-pill ${report.gps.withinGeofence ? "geo-pass" : "geo-fail"}">
            ${report.gps.withinGeofence ? "Within Geofence" : "Outside Geofence"}
          </span>

        </div>

        ${
          report.photo
            ? `
              <div class="report-subtitle" style="margin-top:10px;">
                Photo: ${report.photo.fileName} — captured on ${report.photo.deviceSignature}
              </div>
            `
            : `
              <div class="report-subtitle" style="margin-top:10px;">
                No photo attached.
              </div>
            `
        }

      </section>


      <section class="ai-card">

        <div class="ai-card-title">
          AI Recommended Alignment
        </div>

        <div class="ai-card-description">
          Sentence-transformer similarity between the field narrative and baseline Schedule of Works activity.
        </div>

        <div class="ai-result">
          <div class="ai-result-label">Recommended Activity Code</div>
          <div class="ai-result-value">${report.aiMatch.recommendedActivityCode}</div>
        </div>

        <div class="ai-result" style="margin-top:10px;">

          <div class="ai-result-label">Confidence Score</div>

          <div class="number-highlight ${confidenceClass}">
            ${report.aiMatch.confidenceScore}%
          </div>

          <div class="progress-container" style="margin-top:8px;">
            <div
              class="progress-fill progress-${confidenceClass}"
              style="width:${report.aiMatch.confidenceScore}%;"
            ></div>
          </div>

        </div>

        <div class="ai-result" style="margin-top:10px;">

          <div class="ai-result-label">Alignment Heuristics</div>

          <ul style="margin-top:8px; padding-left:0; list-style:none; font-size:11.5px; line-height:1.8; color:var(--text-secondary);">
            ${report.aiMatch.heuristics
              .map(
                item => `<li>${item.startsWith("⚠") ? item : "✔ " + item}</li>`
              )
              .join("")}
          </ul>

        </div>

      </section>

    </div>


    <section class="gov-card" style="margin-top:16px;">

      <div class="form-group">
        <label for="officer-feedback">Officer Remarks</label>
        <textarea
          id="officer-feedback"
          class="form-control"
          placeholder="Add remarks (required for rejection)"
        ></textarea>
      </div>

      <div id="verification-error" class="login-error"></div>

      <div style="display:flex; gap:10px;">

        <button
          class="gov-btn gov-btn-primary"
          onclick="decideVerification('${report.id}', true)"
        >
          Approve &amp; Issue Sanction
        </button>

        <button
          class="gov-btn gov-btn-secondary"
          style="color:var(--danger); border-color:#f0c5c1;"
          onclick="decideVerification('${report.id}', false)"
        >
          Reject
        </button>

      </div>

    </section>
  `;
}


function getConfidenceClass(score) {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "danger";
}


/* =========================================================
   DECISION HANDLING + CRYPTOGRAPHIC AUDIT CHAIN
   ---------------------------------------------------------
   Mirrors the backend design in the project plan: each
   decision is hashed together with the previous entry's
   hash (timestamp + decision + report id + officer id +
   prevHash) using real SHA-256 via SubtleCrypto, so the
   chain is tamper-evident even in this frontend-only demo.
========================================================= */

async function decideVerification(reportId, approved) {

  const report = store.reports.find(item => item.id === reportId);
  if (!report) return;

  const feedbackEl = document.getElementById("officer-feedback");
  const feedback = feedbackEl ? feedbackEl.value.trim() : "";

  const errorEl = document.getElementById("verification-error");

  if (!approved && !feedback) {
    if (errorEl) errorEl.textContent = "Please provide a reason for rejection.";
    return;
  }

  if (errorEl) errorEl.textContent = "";

  report.status = approved ? "Approved" : "Rejected";
  report.officerFeedback = feedback;
  report.decidedAt = new Date().toISOString();
  report.decidedBy = store.currentUser ? store.currentUser.name : "Unknown Officer";

  await appendAuditEntry({
    reportId: report.id,
    activityCode: report.activityCode,
    decision: report.status,
    officerEmpId: store.currentUser ? store.currentUser.empId : "UNKNOWN"
  });

  navigateTo("/verification");
}


async function appendAuditEntry(payload) {

  store.auditTrail = store.auditTrail || [];

  const previousHash =
    store.auditTrail.length
      ? store.auditTrail[store.auditTrail.length - 1].hash
      : "0".repeat(64);

  const timestamp = new Date().toISOString();

  const combined =
    `${timestamp}|${payload.decision}|${payload.reportId}|${payload.officerEmpId}|${previousHash}`;

  const hash = await sha256Hex(combined);

  store.auditTrail.push({
    timestamp,
    reportId: payload.reportId,
    activityCode: payload.activityCode,
    decision: payload.decision,
    officerEmpId: payload.officerEmpId,
    previousHash,
    hash
  });
}


async function sha256Hex(message) {

  const data = new TextEncoder().encode(message);
  const digestBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digestBuffer))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

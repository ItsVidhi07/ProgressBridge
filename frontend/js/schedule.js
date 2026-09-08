/* =========================================================
   PROGRESSBRIDGE
   MEMBER 1 — SCHEDULE OF WORKS
   ---------------------------------------------------------
   Displays the shared activity schedule from app.js.

   Responsibilities:
   - View planned infrastructure activities
   - Filter by project, status and discipline
   - Search activities
   - Show progress and timeline
   - View activity details
   - Use the shared frontend store
   ========================================================= */

let scheduleFilters = {
  projectId: "ALL",
  status: "ALL",
  discipline: "ALL",
  search: ""
};


/* =========================================================
   MAIN RENDER
   ========================================================= */

function renderSchedule() {
  const viewport = document.getElementById("viewport");

  if (!viewport) return;

  const allActivities =
    Array.isArray(store.activities)
      ? store.activities
      : [];

  const activities =
    getFilteredScheduleActivities();

  const completed =
    allActivities.filter(
      activity => activity.status === "Completed"
    ).length;

  const onTrack =
    allActivities.filter(
      activity => activity.status === "On Track"
    ).length;

  const delayed =
    allActivities.filter(
      activity =>
        activity.status === "Delayed" ||
        activity.status === "At Risk"
    ).length;

  const disciplines = [
    ...new Set(
      allActivities
        .map(activity => activity.discipline)
        .filter(Boolean)
    )
  ].sort();

  viewport.innerHTML = `
    <div class="page-header">

      <div>
        <h2 class="page-title">
          Schedule of Works
        </h2>

        <p class="page-subtitle">
          Monitor planned infrastructure activities,
          timelines, progress and current work status.
        </p>
      </div>

    </div>


    <!-- =================================================
         KPI SECTION
         ================================================= -->

    <section class="kpi-grid">

      <article class="kpi-card">

        <div class="kpi-title">
          Total Activities
        </div>

        <div class="kpi-val">
          ${allActivities.length}
        </div>

        <small>
          Planned activities
        </small>

      </article>


      <article class="kpi-card">

        <div class="kpi-title">
          Completed
        </div>

        <div class="kpi-val">
          ${completed}
        </div>

        <small>
          Activities completed
        </small>

      </article>


      <article class="kpi-card">

        <div class="kpi-title">
          On Track
        </div>

        <div class="kpi-val">
          ${onTrack}
        </div>

        <small>
          Activities progressing normally
        </small>

      </article>


      <article class="kpi-card">

        <div class="kpi-title">
          Delayed / At Risk
        </div>

        <div class="kpi-val">
          ${delayed}
        </div>

        <small>
          Activities requiring attention
        </small>

      </article>

    </section>


    <!-- =================================================
         FILTER TOOLBAR
         ================================================= -->

    <section class="toolbar">

      <div class="toolbar-left">

        <input
          type="search"
          class="form-control"
          placeholder="Search activities..."
          value="${escapeHtml(
            scheduleFilters.search
          )}"
          oninput="handleScheduleSearch(this.value)"
        >


        <select
          class="form-control"
          onchange="handleScheduleProjectFilter(this.value)"
        >

          <option value="ALL">
            All Projects
          </option>

          ${
            Array.isArray(store.projects)
              ? store.projects
                  .map(
                    project => `
                      <option
                        value="${escapeHtml(project.id)}"
                        ${
                          scheduleFilters.projectId ===
                          project.id
                            ? "selected"
                            : ""
                        }
                      >
                        ${escapeHtml(project.id)}
                        —
                        ${escapeHtml(project.name)}
                      </option>
                    `
                  )
                  .join("")
              : ""
          }

        </select>


        <select
          class="form-control"
          onchange="handleScheduleStatusFilter(this.value)"
        >

          <option value="ALL">
            All Statuses
          </option>

          <option
            value="Completed"
            ${
              scheduleFilters.status === "Completed"
                ? "selected"
                : ""
            }
          >
            Completed
          </option>

          <option
            value="On Track"
            ${
              scheduleFilters.status === "On Track"
                ? "selected"
                : ""
            }
          >
            On Track
          </option>

          <option
            value="Upcoming"
            ${
              scheduleFilters.status === "Upcoming"
                ? "selected"
                : ""
            }
          >
            Upcoming
          </option>

          <option
            value="Delayed"
            ${
              scheduleFilters.status === "Delayed"
                ? "selected"
                : ""
            }
          >
            Delayed
          </option>

          <option
            value="At Risk"
            ${
              scheduleFilters.status === "At Risk"
                ? "selected"
                : ""
            }
          >
            At Risk
          </option>

        </select>


        <select
          class="form-control"
          onchange="handleScheduleDisciplineFilter(this.value)"
        >

          <option value="ALL">
            All Disciplines
          </option>

          ${disciplines
            .map(
              discipline => `
                <option
                  value="${escapeHtml(discipline)}"
                  ${
                    scheduleFilters.discipline ===
                    discipline
                      ? "selected"
                      : ""
                  }
                >
                  ${escapeHtml(discipline)}
                </option>
              `
            )
            .join("")}

        </select>

      </div>


      <div class="toolbar-right">

        <button
          type="button"
          class="gov-btn gov-btn-secondary gov-btn-sm"
          onclick="resetScheduleFilters()"
        >
          Clear Filters
        </button>

      </div>

    </section>


    <!-- =================================================
         ACTIVITY TABLE
         ================================================= -->

    <section class="gov-card">

      <div class="gov-card-header">

        <div>

          <h3>
            Planned Activities
          </h3>

          <p>
            ${activities.length}
            ${
              activities.length === 1
                ? "activity"
                : "activities"
            }
            shown
          </p>

        </div>

      </div>


      ${
        activities.length
          ? renderScheduleTable(activities)
          : `
            <div class="empty-state">

              <h3>
                No activities found
              </h3>

              <p>
                Try changing your search or filters.
              </p>

            </div>
          `
      }

    </section>
  `;
}


/* =========================================================
   FILTER ACTIVITIES
   ========================================================= */

function getFilteredScheduleActivities() {
  const activities =
    Array.isArray(store.activities)
      ? store.activities
      : [];

  const search =
    scheduleFilters.search
      .trim()
      .toLowerCase();

  return activities.filter(activity => {

    const projectMatch =
      scheduleFilters.projectId === "ALL" ||
      activity.projectId ===
        scheduleFilters.projectId;


    const statusMatch =
      scheduleFilters.status === "ALL" ||
      activity.status ===
        scheduleFilters.status;


    const disciplineMatch =
      scheduleFilters.discipline === "ALL" ||
      activity.discipline ===
        scheduleFilters.discipline;


    const searchMatch =
      !search ||
      [
        activity.id,
        activity.projectId,
        activity.description,
        activity.discipline,
        activity.status,
        activity.notes
      ]
        .filter(Boolean)
        .some(value =>
          String(value)
            .toLowerCase()
            .includes(search)
        );


    return (
      projectMatch &&
      statusMatch &&
      disciplineMatch &&
      searchMatch
    );
  });
}


/* =========================================================
   TABLE
   ========================================================= */

function renderScheduleTable(activities) {
  return `
    <div class="table-container">

      <table class="gov-table">

        <thead>

          <tr>
            <th>Activity</th>
            <th>Project</th>
            <th>Discipline</th>
            <th>Timeline</th>
            <th>Progress</th>
            <th>Status</th>
            <th>Action</th>
          </tr>

        </thead>


        <tbody>

          ${activities
            .map(activity =>
              renderScheduleRow(activity)
            )
            .join("")}

        </tbody>

      </table>

    </div>
  `;
}


/* =========================================================
   TABLE ROW
   ========================================================= */

function renderScheduleRow(activity) {
  const project =
    Array.isArray(store.projects)
      ? store.projects.find(
          item =>
            item.id === activity.projectId
        )
      : null;

  const progress =
    clampScheduleProgress(
      activity.progress
    );

  const statusClass =
    getScheduleStatusClass(
      activity.status
    );

  const progressClass =
    getScheduleProgressClass(
      activity.status
    );

  return `
    <tr>

      <td>

        <div class="task-name">
          ${escapeHtml(
            activity.description ||
              "Unnamed Activity"
          )}
        </div>

        <div class="table-muted">
          ${escapeHtml(
            activity.id || "—"
          )}
        </div>

      </td>


      <td>

        <div class="task-name">
          ${escapeHtml(
            project
              ? project.name
              : activity.projectId ||
                "Unknown Project"
          )}
        </div>

        <div class="table-muted">
          ${escapeHtml(
            activity.projectId || "—"
          )}
        </div>

      </td>


      <td>
        ${escapeHtml(
          activity.discipline || "—"
        )}
      </td>


      <td>

        <div>
          ${formatScheduleDate(
            activity.start
          )}
        </div>

        <div class="table-muted">
          to
          ${formatScheduleDate(
            activity.end
          )}
        </div>

      </td>


      <td>

        <strong>
          ${progress}%
        </strong>

        <div class="progress-container">

          <div
            class="progress-fill ${progressClass}"
            style="width:${progress}%"
          ></div>

        </div>

      </td>


      <td>

        <span
          class="status-badge ${statusClass}"
        >
          ${escapeHtml(
            activity.status ||
              "Unknown"
          )}
        </span>

      </td>


      <td>

        <button
          type="button"
          class="gov-btn gov-btn-secondary gov-btn-sm"
          onclick="openScheduleActivity('${escapeHtml(
            activity.id
          )}')"
        >
          View
        </button>

      </td>

    </tr>
  `;
}


/* =========================================================
   STATUS HELPERS
   ========================================================= */

function getScheduleStatusClass(status) {

  switch (status) {

    case "Completed":
      return "status-completed";

    case "On Track":
      return "status-completed";

    case "Delayed":
      return "status-delayed";

    case "At Risk":
      return "status-at-risk";

    case "Upcoming":
      return "status-upcoming";

    default:
      return "status-upcoming";
  }
}


function getScheduleProgressClass(status) {

  switch (status) {

    case "Completed":
      return "progress-success";

    case "On Track":
      return "progress-success";

    case "Delayed":
      return "progress-warning";

    case "At Risk":
      return "progress-danger";

    case "Upcoming":
      return "progress-warning";

    default:
      return "";
  }
}


/* =========================================================
   FILTER HANDLERS
   ========================================================= */

function handleScheduleSearch(value) {

  scheduleFilters.search =
    value || "";

  renderSchedule();
}


function handleScheduleProjectFilter(value) {

  scheduleFilters.projectId =
    value || "ALL";

  renderSchedule();
}


function handleScheduleStatusFilter(value) {

  scheduleFilters.status =
    value || "ALL";

  renderSchedule();
}


function handleScheduleDisciplineFilter(value) {

  scheduleFilters.discipline =
    value || "ALL";

  renderSchedule();
}


function resetScheduleFilters() {

  scheduleFilters = {
    projectId: "ALL",
    status: "ALL",
    discipline: "ALL",
    search: ""
  };

  renderSchedule();
}


/* =========================================================
   ACTIVITY DETAILS MODAL
   ========================================================= */

function openScheduleActivity(activityId) {

  const activities =
    Array.isArray(store.activities)
      ? store.activities
      : [];

  const activity =
    activities.find(
      item =>
        item.id === activityId
    );

  if (!activity) return;


  const project =
    Array.isArray(store.projects)
      ? store.projects.find(
          item =>
            item.id ===
            activity.projectId
        )
      : null;


  const existing =
    document.getElementById(
      "schedule-activity-modal"
    );

  if (existing) {
    existing.remove();
  }


  const modal =
    document.createElement("div");

  modal.id =
    "schedule-activity-modal";

  modal.className =
    "modal-overlay";


  modal.innerHTML = `
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >

      <div class="modal-header">

        <div>

          <h3 id="schedule-modal-title">
            Activity Details
          </h3>

          <div class="table-muted">
            ${escapeHtml(
              activity.id || "—"
            )}
          </div>

        </div>


        <button
          type="button"
          class="gov-btn gov-btn-secondary gov-btn-sm"
          onclick="closeScheduleActivity()"
        >
          Close
        </button>

      </div>


      <div class="modal-body">


        <!-- Activity Information -->

        <div class="info-grid">

          <div class="info-panel">

            <div class="info-panel-label">
              Activity
            </div>

            <div class="info-panel-value">
              ${escapeHtml(
                activity.description ||
                  "—"
              )}
            </div>

          </div>


          <div class="info-panel">

            <div class="info-panel-label">
              Discipline
            </div>

            <div class="info-panel-value">
              ${escapeHtml(
                activity.discipline ||
                  "—"
              )}
            </div>

          </div>


          <div class="info-panel">

            <div class="info-panel-label">
              Status
            </div>

            <div class="info-panel-value">
              ${escapeHtml(
                activity.status ||
                  "—"
              )}
            </div>

          </div>

        </div>


        <!-- Project -->

        <section class="gov-card">

          <div class="gov-card-header">

            <div>

              <h3>
                Project
              </h3>

              <p>
                ${escapeHtml(
                  project
                    ? project.name
                    : activity.projectId ||
                      "Unknown Project"
                )}
              </p>

            </div>

          </div>


          <div class="info-grid">

            <div class="info-panel">

              <div class="info-panel-label">
                Project ID
              </div>

              <div class="info-panel-value">
                ${escapeHtml(
                  activity.projectId ||
                    "—"
                )}
              </div>

            </div>


            <div class="info-panel">

              <div class="info-panel-label">
                Start Date
              </div>

              <div class="info-panel-value">
                ${formatScheduleDate(
                  activity.start
                )}
              </div>

            </div>


            <div class="info-panel">

              <div class="info-panel-label">
                End Date
              </div>

              <div class="info-panel-value">
                ${formatScheduleDate(
                  activity.end
                )}
              </div>

            </div>

          </div>

        </section>


        <!-- Progress -->

        <section class="gov-card">

          <div class="gov-card-header">

            <div>

              <h3>
                Work Progress
              </h3>

              <p>
                Current recorded progress.
              </p>

            </div>

            <strong>
              ${clampScheduleProgress(
                activity.progress
              )}%
            </strong>

          </div>


          <div class="progress-container">

            <div
              class="progress-fill ${getScheduleProgressClass(
                activity.status
              )}"
              style="width:${clampScheduleProgress(
                activity.progress
              )}%"
            ></div>

          </div>

        </section>


        <!-- Timeline -->

        <section class="gov-card">

          <div class="gov-card-header">

            <div>

              <h3>
                Schedule Timeline
              </h3>

            </div>

          </div>


          <div class="timeline">


            <div class="timeline-item">

              <div class="timeline-title">
                Planned Start
              </div>

              <div class="timeline-description">
                ${formatScheduleDate(
                  activity.start
                )}
              </div>

            </div>


            <div class="timeline-item">

              <div class="timeline-title">
                Planned Completion
              </div>

              <div class="timeline-description">
                ${formatScheduleDate(
                  activity.end
                )}
              </div>

            </div>


            <div class="timeline-item">

              <div class="timeline-title">
                Current Status
              </div>

              <div class="timeline-description">
                ${escapeHtml(
                  activity.status ||
                    "—"
                )}
              </div>

            </div>


          </div>

        </section>


        <!-- Notes -->

         <section class="gov-card">

          <div class="gov-card-header">

            <div>

              <h3>
                Notes
              </h3>

            </div>

          </div>

          <p class="text-muted">
            ${escapeHtml(
              activity.notes ||
                "No additional notes available."
            )}
          </p>

        </section>


      </div>

    </div>
  `;


  modal.addEventListener(
    "click",
    event => {

      if (event.target === modal) {
        closeScheduleActivity();
      }

    }
  );


  document.body.appendChild(modal);
}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeScheduleActivity() {

  const modal =
    document.getElementById(
      "schedule-activity-modal"
    );

  if (modal) {
    modal.remove();
  }
}


/* =========================================================
   DATE FORMATTER
   ========================================================= */

function formatScheduleDate(value) {

  if (!value) {
    return "—";
  }


  const date =
    new Date(
      `${value}T00:00:00`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return escapeHtml(
      value
    );
  }


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
}


/* =========================================================
   PROGRESS VALIDATION
   ========================================================= */

function clampScheduleProgress(value) {

  const number =
    Number(value);


  if (
    Number.isNaN(number)
  ) {
    return 0;
  }


  return Math.max(
    0,
    Math.min(
      100,
      number
    )
  );
}

        
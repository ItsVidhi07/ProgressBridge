/* =========================================================
   MEMBER 1 — DASHBOARD & PROJECT VIEWS
========================================================= */

function renderDashboard() {

  const target =
    document.getElementById("viewport");

  if (!target) return;

  const project =
    store.projects.find(
      item =>
        item.id === store.selectedProjectId
    ) || store.projects[0];

  const tasks =
    store.activities.filter(
      task =>
        task.projectId === project.id
    );

  const completedCount =
    tasks.filter(t => t.status === "Completed").length;

  const delayedCount =
    tasks.filter(t => t.status === "Delayed").length;

  const atRiskCount =
    tasks.filter(t => t.status === "At Risk").length;

  const progressGap =
    project.actual -
    project.planned;

  const gapText =
    progressGap >= 0
      ? `${Math.abs(progressGap)}% ahead`
      : `${Math.abs(progressGap)}% behind`;

  const attentionTasks =
    tasks.filter(
      task =>
        task.status === "Delayed" ||
        task.status === "At Risk"
    );

  target.innerHTML = `

    <div class="page-header">

      <div>

        <h2 class="page-title">
          Project Dashboard
        </h2>

        <p class="page-subtitle">
          See how work is progressing and quickly find tasks that need attention.
        </p>

      </div>

      <button
        class="gov-btn gov-btn-secondary"
        onclick="navigateTo('/projects/${project.id}')"
      >
        View Project
      </button>

    </div>


    <section class="kpi-grid">

      <article class="kpi-card">

        <div class="kpi-label">
          Current Progress
        </div>

        <div class="kpi-value">
          ${project.actualProgress}%
        </div>

        <div class="kpi-description">
          Work completed so far
        </div>

      </article>


      <article class="kpi-card completed">

        <div class="kpi-label">
          Completed Tasks
        </div>

        <div class="kpi-value">
          ${project.completedActivities}
        </div>

        <div class="kpi-description">
          Out of ${tasks.length} planned tasks
        </div>

      </article>


      <article class="kpi-card delayed">

        <div class="kpi-label">
          Delayed Tasks
        </div>

        <div class="kpi-value">
          ${project.delayedActivities}
        </div>

        <div class="kpi-description">
          Tasks taking longer than planned
        </div>

      </article>


      <article class="kpi-card risk">

        <div class="kpi-label">
          Needs Attention
        </div>

        <div class="kpi-value">
          ${project.atRiskActivities}
        </div>

        <div class="kpi-description">
          Tasks that may cause further delay
        </div>

      </article>

    </section>


    <section class="project-summary">

      <article class="gov-card project-main">

        <div class="project-code">
          ${project.code}
        </div>

        <h3 class="project-name">
          ${project.name}
        </h3>

        <div class="project-meta">

          <span>
            ${project.department}
          </span>

          <span>
            ${project.location}
          </span>

          <span>
            ${project.status}
          </span>

        </div>


        <div class="project-progress">

          <div class="progress-label">

            <span>
              Current progress
            </span>

            <strong>
              ${project.actualProgress}%
            </strong>

          </div>

          <div class="progress-track">

            <div
              class="progress-bar ${
                progressGap < -5
                  ? "warning"
                  : ""
              }"
              style="width:${project.actualProgress}%"
            ></div>

          </div>

          <div class="progress-gap">

            Planned: ${project.plannedProgress}%
            &nbsp; · &nbsp;
            Current: ${project.actualProgress}%
            &nbsp; · &nbsp;
            ${gapText}

          </div>

        </div>

      </article>


      <aside class="project-selector">

        <div class="form-group">

          <label for="project-select">
            SELECT PROJECT
          </label>

          <select
            id="project-select"
            class="form-control"
            onchange="changeDashboardProject(this.value)"
          >

            ${store.projects
              .map(
                item => `
                  <option
                    value="${item.id}"
                    ${
                      item.id === project.id
                        ? "selected"
                        : ""
                    }
                  >
                    ${item.code} — ${item.name}
                  </option>
                `
              )
              .join("")}

          </select>

        </div>


        <div class="info-item">

          <div class="info-label">
            Work status
          </div>

          <div class="info-value">
            ${project.status}
          </div>

        </div>

      </aside>

    </section>


    <div class="notice">

      <strong>
        Why this matters:
      </strong>

      <span>
        ProgressBridge compares planned work with actual field updates,
        so officers can focus first on work that is delayed or at risk.
      </span>

    </div>


    <section class="gov-card">

      <div class="gov-card-header">

        <h3>
          Tasks That Need Attention
        </h3>

        <button
          class="gov-btn gov-btn-secondary gov-btn-sm"
          onclick="navigateTo('/schedule')"
        >
          View Full Schedule
        </button>

      </div>


      ${
        attentionTasks.length
          ? `
            <div class="table-container">

              <table class="gov-table">

                <thead>

                  <tr>

                    <th>Task</th>
                    <th>Work Type</th>
                    <th>Progress</th>
                    <th>Finish Date</th>
                    <th>Status</th>
                    <th></th>

                  </tr>

                </thead>

                <tbody>

                  ${attentionTasks
                    .map(
                      task => `
                        <tr>

                          <td>

                            <div class="task-name">
                              ${task.description}
                            </div>

                            <div class="table-muted">
                              ${task.code}
                            </div>

                          </td>

                          <td>
                            ${task.discipline}
                          </td>

                          <td>
                            <strong>
                              ${task.progress}%
                            </strong>
                          </td>

                          <td>
                            ${task.finish}
                          </td>

                          <td>

                            <span
                              class="status-badge ${getStatusBadge(
                                task.status
                              )}"
                            >
                              ${task.status}
                            </span>

                          </td>

                          <td>

                            <button
                              class="gov-btn gov-btn-secondary gov-btn-sm"
                              onclick="navigateTo('/schedule/${task.id}')"
                            >
                              View
                            </button>

                          </td>

                        </tr>
                      `
                    )
                    .join("")}

                </tbody>

              </table>

            </div>
          `
          : `
            <div class="empty-state">

              <strong>
                No tasks need attention
              </strong>

              <p>
                All current tasks are moving as planned.
              </p>

            </div>
          `
      }

    </section>


    <section class="gov-card">

      <div class="gov-card-header">

        <h3>
          Current Work
        </h3>

        <span class="table-muted">
          ${tasks.length} tasks
        </span>

      </div>


      <div class="table-container">

        <table class="gov-table">

          <thead>

            <tr>

              <th>Task</th>
              <th>Work Type</th>
              <th>Progress</th>
              <th>Status</th>
              <th></th>

            </tr>

          </thead>

          <tbody>

            ${tasks
              .map(
                task => `

                  <tr>

                    <td>

                      <div class="task-name">
                        ${task.description}
                      </div>

                      <div class="table-muted">
                        ${task.code}
                      </div>

                    </td>

                    <td>
                      ${task.discipline}
                    </td>

                    <td>
                      ${task.progress}%
                    </td>

                    <td>

                      <span
                        class="status-badge ${getStatusBadge(
                          task.status
                        )}"
                      >
                        ${task.status}
                      </span>

                    </td>

                    <td>

                      <button
                        class="gov-btn gov-btn-secondary gov-btn-sm"
                        onclick="navigateTo('/schedule/${task.id}')"
                      >
                        Details
                      </button>

                    </td>

                  </tr>

                `
              )
              .join("")}

          </tbody>

        </table>

      </div>

    </section>
  `;
}


function changeDashboardProject(projectId) {

  store.selectedProjectId =
    projectId;

  renderDashboard(
    document.getElementById(
      "viewport"
    )
  );
}


/* =========================================================
   PROJECT LIST
========================================================= */

function renderProjectsList(target) {

  target.innerHTML = `

    <div class="page-header">

      <div>

        <h2 class="page-title">
          Projects
        </h2>

        <p class="page-subtitle">
          View all infrastructure projects being monitored through ProgressBridge.
        </p>

      </div>

    </div>


    <section class="gov-card">

      <div class="table-container">

        <table class="gov-table">

          <thead>

            <tr>

              <th>Project</th>
              <th>Department</th>
              <th>Location</th>
              <th>Progress</th>
              <th>Status</th>
              <th></th>

            </tr>

          </thead>

          <tbody>

            ${store.projects
              .map(
                project => `

                  <tr>

                    <td>

                      <div class="task-name">
                        ${project.name}
                      </div>

                      <div class="table-muted">
                        ${project.code}
                      </div>

                    </td>

                    <td>
                      ${project.department}
                    </td>

                    <td>
                      ${project.location}
                    </td>

                    <td>
                      <strong>
                        ${project.actualProgress}%
                      </strong>
                    </td>

                    <td>

                      <span class="status-badge status-on-track">
                        ${project.status}
                      </span>

                    </td>

                    <td>

                      <button
                        class="gov-btn gov-btn-primary gov-btn-sm"
                        onclick="navigateTo('/projects/${project.id}')"
                      >
                        Open
                      </button>

                    </td>

                  </tr>

                `
              )
              .join("")}

          </tbody>

        </table>

      </div>

    </section>
  `;
}


/* =========================================================
   PROJECT DETAIL
========================================================= */

function renderProjectDetail(
  target,
  projectId
) {

  const project =
    store.projects.find(
      item =>
        item.id === projectId
    );

  if (!project) {

    renderModulePlaceholder(
      target,
      "Project not found",
      "The selected project could not be found."
    );

    return;
  }

  const tasks =
    store.activities.filter(
      task =>
        task.projectId === project.id
    );

  target.innerHTML = `

    <div class="page-header">

      <div>

        <div class="project-code">
          ${project.code}
        </div>

        <h2 class="page-title">
          ${project.name}
        </h2>

        <p class="page-subtitle">
          ${project.department} · ${project.location}
        </p>

      </div>

      <button
        class="gov-btn gov-btn-secondary"
        onclick="navigateTo('/projects')"
      >
        ← All Projects
      </button>

    </div>


    <section class="gov-card">

      <div class="info-grid">

        <div class="info-item">

          <div class="info-label">
            Planned progress
          </div>

          <div class="info-value">
            ${project.plannedProgress}%
          </div>

        </div>


        <div class="info-item">

          <div class="info-label">
            Current progress
          </div>

          <div class="info-value">
            ${project.actualProgress}%
          </div>

        </div>


        <div class="info-item">

          <div class="info-label">
            Work status
          </div>

          <div class="info-value">
            ${project.status}
          </div>

        </div>

      </div>

    </section>


    <section class="gov-card">

      <div class="gov-card-header">

        <h3>
          Project Tasks
        </h3>

        <span class="table-muted">
          ${tasks.length} tasks
        </span>

      </div>


      <div class="table-container">

        <table class="gov-table">

          <thead>

            <tr>

              <th>Task</th>
              <th>Work Type</th>
              <th>Timeline</th>
              <th>Progress</th>
              <th>Status</th>
              <th></th>

            </tr>

          </thead>

          <tbody>

            ${tasks
              .map(
                task => `

                  <tr>

                    <td>

                      <div class="task-name">
                        ${task.description}
                      </div>

                      <div class="table-muted">
                        ${task.code}
                      </div>

                    </td>

                    <td>
                      ${task.discipline}
                    </td>

                    <td>
                      ${task.start}
                      →
                      ${task.finish}
                    </td>

                    <td>
                      ${task.progress}%
                    </td>

                    <td>

                      <span
                        class="status-badge ${getStatusBadge(
                          task.status
                        )}"
                      >
                        ${task.status}
                      </span>

                    </td>

                    <td>

                      <button
                        class="gov-btn gov-btn-secondary gov-btn-sm"
                        onclick="navigateTo('/schedule/${task.id}')"
                      >
                        Details
                      </button>

                    </td>

                  </tr>

                `
              )
              .join("")}

          </tbody>

        </table>

      </div>

    </section>
  `;
}

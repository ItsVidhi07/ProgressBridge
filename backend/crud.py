from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models import Project, Activity, ProgressReport


# Get all projects
async def get_projects(db: AsyncSession):
    result = await db.execute(select(Project))
    return result.scalars().all()


# Get one project
async def get_project_by_id(db: AsyncSession, project_id: int):
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    return result.scalar_one_or_none()


# Get activities of a project
async def get_project_activities(
    db: AsyncSession,
    project_id: int,
    discipline=None,
    status=None
):
    query = select(Activity).where(Activity.project_id == project_id)

    if discipline:
        query = query.where(Activity.discipline == discipline)

    if status:
        query = query.where(Activity.status == status)

    result = await db.execute(query)
    return result.scalars().all()


# Get one activity
async def get_activity(db: AsyncSession, activity_id: int):
    result = await db.execute(
        select(Activity).where(Activity.id == activity_id)
    )
    return result.scalar_one_or_none()


# Get progress reports
async def get_progress_reports(
    db: AsyncSession,
    activity_id: int
):
    result = await db.execute(
        select(ProgressReport).where(
            ProgressReport.activity_id == activity_id
        )
    )
    return result.scalars().all()

async def get_projects(db: AsyncSession):
    print(">>> Inside get_projects()")
    result = await db.execute(select(Project))
    print(">>> Query executed")
    return result.scalars().all()
import asyncio
from datetime import datetime

from backend.database import SessionLocal
from backend.models import Project, Activity, ProgressReport


async def seed_data():
    async with SessionLocal() as session:

        # Check if data already exists
        existing = await session.get(Project, 1)
        if existing:
            print("Data already exists.")
            return

        project = Project(
            project_name="Mumbai Metro Line 3",
            latitude=19.0760,
            longitude=72.8777,
            planned_progress=65,
            actual_progress=58
        )

        session.add(project)
        await session.flush()

        activity = Activity(
            project_id=project.id,
            activity_name="Tunnel Excavation",
            discipline="Civil",
            status="In Progress",
            created_at=datetime.now()
        )

        session.add(activity)
        await session.flush()

        report = ProgressReport(
            activity_id=activity.id,
            progress=58,
            report_date=datetime.now(),
            created_at=datetime.now()
        )

        session.add(report)

        await session.commit()

        print("Sample data inserted successfully!")


asyncio.run(seed_data())
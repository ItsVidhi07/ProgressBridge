from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend import crud

from backend.schemas import (
    ProjectResponse,
    ActivityResponse,
    ActivityDetailResponse,
)

app = FastAPI(
    title="ProgressBridge API",
    description="Infrastructure Project Progress Tracking API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# -------------------- Health Check --------------------

@app.get("/", tags=["Health"])
async def root():
    return {"message": "ProgressBridge API is running"}


# -------------------- Projects --------------------

@app.get(
    "/api/v1/projects",
    response_model=list[ProjectResponse],
    tags=["Projects"]
)
async def get_projects(
    db: AsyncSession = Depends(get_db)
):
    return await crud.get_projects(db)


# -------------------- Activities --------------------

@app.get(
    "/api/v1/projects/{project_id}/activities",
    response_model=list[ActivityResponse],
    tags=["Activities"]
)
async def get_project_activities(
    project_id: int,
    discipline: str | None = Query(None),
    status: str | None = Query(None),
    db: AsyncSession = Depends(get_db)
):
    return await crud.get_project_activities(
        db,
        project_id,
        discipline,
        status
    )


# -------------------- Activity Details --------------------

@app.get(
    "/api/v1/activities/{activity_id}",
    response_model=ActivityDetailResponse,
    tags=["Activities"]
)
async def get_activity_details(
    activity_id: int,
    db: AsyncSession = Depends(get_db)
):
    activity = await crud.get_activity(db, activity_id)

    if not activity:
        raise HTTPException(
            status_code=404,
            detail="Activity not found"
        )

    reports = await crud.get_progress_reports(
        db,
        activity_id
    )

    return {
        **activity.__dict__,
        "progress_reports": reports
    }
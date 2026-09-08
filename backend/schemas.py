from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_name: str
    latitude: float
    longitude: float
    planned_progress: float
    actual_progress: float

class ActivityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    project_id: int
    activity_name: str
    discipline: str
    status: str


class ProgressReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    activity_id: int
    claimed_progress: float
    report_date: datetime


class ActivityDetailResponse(ActivityResponse):
    progress_reports: list[ProgressReportResponse]

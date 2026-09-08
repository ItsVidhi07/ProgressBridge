from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    project_name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    planned_progress = Column(Float)
    actual_progress = Column(Float)


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime)
    project_id = Column(Integer, ForeignKey("projects.id"))
    activity_name = Column(String)
    discipline = Column(String)
    status = Column(String)


class ProgressReport(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime)
    activity_id = Column(Integer, ForeignKey("activities.id"))
    claimed_progress = Column(Float)
    report_date = Column(DateTime(timezone=True), nullable=True)

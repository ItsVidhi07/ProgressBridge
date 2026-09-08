"""
backend/telemetry.py
Member 5 - Security, Telemetry & Audit

Responsibilities implemented here (the "Location & Photo Validation" step
in the architecture diagram, between the field submission and the AI
matching engine):
    1. Haversine-based PostGIS-compatible geofence check - is the reported
       GPS coordinate within an acceptable radius of the project site?
    2. Photo/EXIF timestamp plausibility check - flags reports whose photo
       timestamp is suspiciously far from the report date (a cheap signal
       against replayed/stale photos).
    3. A combined `validate_field_report()` that Member 3 can call from the
       report-submission endpoint before handing the narrative to Member 4's
       AI matcher.

NOTE ON SCHEMA: the `projects` table (as seeded in schema.sql) only stores
`latitude`/`longitude`, not a geofence radius. Until Member 6 adds a
`geofence_radius_meters` column to `projects`, this module falls back to
DEFAULT_GEOFENCE_RADIUS_METERS. Suggested migration:

    ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS geofence_radius_meters DOUBLE PRECISION DEFAULT 500;

Integration (for Member 3 / main.py):

    from backend.telemetry import validate_field_report

    @app.post("/api/v1/reports", tags=["Reports"])
    async def submit_report(payload: ReportCreate, db=Depends(get_db)):
        project = await crud.get_project(db, payload.project_id)
        validation = validate_field_report(
            report={
                "latitude": payload.latitude,
                "longitude": payload.longitude,
                "photo_timestamp": payload.photo_timestamp,
                "report_date": payload.report_date,
                "device_signature": payload.device_signature,
            },
            project={
                "latitude": project.latitude,
                "longitude": project.longitude,
                "geofence_radius_meters": getattr(project, "geofence_radius_meters", None),
            },
        )
        # store validation["distance_meters"] / validation["location_verified"]
        # on the report row, then proceed to AI matching regardless (flag,
        # don't hard-block, so executive engineers can still review it).
"""

from __future__ import annotations

import math
from datetime import date, datetime, timedelta
from typing import Optional

# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------

EARTH_RADIUS_METERS = 6_371_000
DEFAULT_GEOFENCE_RADIUS_METERS = 500
MAX_PHOTO_TIMESTAMP_DRIFT_HOURS = 24


# --------------------------------------------------------------------------
# Geofencing
# --------------------------------------------------------------------------

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in meters between two lat/lon points."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(d_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return EARTH_RADIUS_METERS * c


def check_geofence(
    report_lat: float,
    report_lon: float,
    project_lat: float,
    project_lon: float,
    radius_meters: Optional[float] = None,
) -> dict:
    """Returns distance + whether the report falls inside the project geofence."""
    radius = radius_meters if radius_meters is not None else DEFAULT_GEOFENCE_RADIUS_METERS
    distance = haversine_distance(report_lat, report_lon, project_lat, project_lon)
    return {
        "distance_meters": round(distance, 2),
        "radius_meters": radius,
        "within_radius": distance <= radius,
    }


# --------------------------------------------------------------------------
# Photo / EXIF plausibility
# --------------------------------------------------------------------------

def validate_photo_timestamp(
    photo_timestamp: Optional[datetime],
    report_date: date,
    max_drift_hours: int = MAX_PHOTO_TIMESTAMP_DRIFT_HOURS,
) -> dict:
    """
    Flags a report if its photo timestamp is missing or too far (in either
    direction) from the claimed report_date. Actual EXIF extraction happens
    client-side (Member 2's telemetry.js); this just sanity-checks the value
    the backend receives.
    """
    if photo_timestamp is None:
        return {"valid": False, "reason": "No photo timestamp provided"}

    report_start = datetime.combine(report_date, datetime.min.time())
    drift = photo_timestamp - report_start
    drift_hours = abs(drift.total_seconds()) / 3600

    if drift_hours > max_drift_hours:
        return {
            "valid": False,
            "reason": f"Photo timestamp drifts {drift_hours:.1f}h from report_date "
                      f"(max allowed {max_drift_hours}h)",
            "drift_hours": round(drift_hours, 1),
        }

    return {"valid": True, "reason": None, "drift_hours": round(drift_hours, 1)}


def validate_device_signature(device_signature: Optional[str]) -> dict:
    """
    Placeholder integrity check on the device signature string emitted by
    the frontend's EXIF parser. Real device attestation (e.g. HMAC signed
    by a trusted app key) is a future-work item -- flagged here rather than
    silently assumed.
    """
    if not device_signature or not device_signature.strip():
        return {"valid": False, "reason": "Missing device signature"}
    return {"valid": True, "reason": None}


# --------------------------------------------------------------------------
# Combined report validation
# --------------------------------------------------------------------------

def validate_field_report(report: dict, project: dict) -> dict:
    """
    Runs all telemetry trust checks for one field report submission.

    report:  {latitude, longitude, photo_timestamp, report_date, device_signature}
    project: {latitude, longitude, geofence_radius_meters (optional)}

    Returns a dict with each sub-check's result plus an overall
    `location_verified` flag. This is advisory, not a hard block -- reports
    that fail should still reach the Executive Engineer's verification desk
    with the flags visible, per the "Inspects Discrepancies & Approves" step
    in the architecture diagram.
    """
    geofence = check_geofence(
        report["latitude"],
        report["longitude"],
        project["latitude"],
        project["longitude"],
        radius_meters=project.get("geofence_radius_meters"),
    )
    photo_check = validate_photo_timestamp(
        report.get("photo_timestamp"), report["report_date"]
    )
    device_check = validate_device_signature(report.get("device_signature"))

    return {
        "geofence": geofence,
        "photo_timestamp": photo_check,
        "device_signature": device_check,
        "location_verified": geofence["within_radius"] and photo_check["valid"],
    }
  

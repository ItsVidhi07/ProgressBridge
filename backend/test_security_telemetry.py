"""
backend/test_security_telemetry.py
Member 5 - Security, Telemetry & Audit

Unit tests for the pure/stateless utility functions in security.py and
telemetry.py (JWT + hashing + geofencing + photo checks). DB-backed
functions (record_audit_entry, get_latest_audit_hash, verify_audit_chain)
need a live async Postgres session and are intentionally left as
integration tests for Member 6's CI setup rather than mocked here.

Run with:
    pytest backend/test_security_telemetry.py -v
"""

from datetime import date, datetime, timedelta

import pytest

from backend.security import (
    Role,
    compute_audit_hash,
    create_access_token,
    decode_access_token,
)
from backend.telemetry import (
    check_geofence,
    haversine_distance,
    validate_device_signature,
    validate_field_report,
    validate_photo_timestamp,
)


# --------------------------------------------------------------------------
# security.py - JWT
# --------------------------------------------------------------------------

def test_create_and_decode_access_token_roundtrip():
    token = create_access_token(user_id=1, role=Role.FIELD_ENGINEER.value, employee_id="EMP001")
    payload = decode_access_token(token)

    assert payload["sub"] == "1"
    assert payload["role"] == Role.FIELD_ENGINEER.value
    assert payload["employee_id"] == "EMP001"


def test_create_access_token_rejects_unknown_role():
    with pytest.raises(ValueError):
        create_access_token(user_id=1, role="SUPER_ADMIN")


def test_decode_access_token_rejects_garbage_token():
    from fastapi import HTTPException

    with pytest.raises(HTTPException):
        decode_access_token("not-a-real-token")


def test_expired_token_is_rejected():
    from fastapi import HTTPException

    token = create_access_token(
        user_id=1,
        role=Role.EXECUTIVE_ENGINEER.value,
        expires_delta=timedelta(seconds=-1),
    )
    with pytest.raises(HTTPException):
        decode_access_token(token)


# --------------------------------------------------------------------------
# security.py - audit hash chain
# --------------------------------------------------------------------------

def test_compute_audit_hash_is_deterministic():
    h1 = compute_audit_hash("2026-01-01T00:00:00", "APPROVED", 42, "EMP001", None)
    h2 = compute_audit_hash("2026-01-01T00:00:00", "APPROVED", 42, "EMP001", None)
    assert h1 == h2
    assert len(h1) == 64  # sha256 hex digest length


def test_compute_audit_hash_changes_with_any_field():
    base = compute_audit_hash("2026-01-01T00:00:00", "APPROVED", 42, "EMP001", None)
    changed_decision = compute_audit_hash("2026-01-01T00:00:00", "REJECTED", 42, "EMP001", None)
    changed_prev = compute_audit_hash("2026-01-01T00:00:00", "APPROVED", 42, "EMP001", base)

    assert base != changed_decision
    assert base != changed_prev


# --------------------------------------------------------------------------
# telemetry.py - geofencing
# --------------------------------------------------------------------------

def test_haversine_distance_zero_for_identical_points():
    assert haversine_distance(19.0760, 72.8777, 19.0760, 72.8777) == 0.0


def test_haversine_distance_known_cities():
    # Mumbai to Delhi is roughly ~1150-1160 km
    distance_m = haversine_distance(19.0760, 72.8777, 28.6139, 77.2090)
    assert 1_100_000 < distance_m < 1_200_000


def test_check_geofence_within_radius():
    result = check_geofence(19.0760, 72.8777, 19.0761, 72.8778, radius_meters=500)
    assert result["within_radius"] is True


def test_check_geofence_outside_radius():
    result = check_geofence(19.0760, 72.8777, 28.6139, 77.2090, radius_meters=500)
    assert result["within_radius"] is False


def test_check_geofence_uses_default_radius_when_none_given():
    result = check_geofence(19.0760, 72.8777, 19.0760, 72.8777, radius_meters=None)
    assert result["radius_meters"] == 500


# --------------------------------------------------------------------------
# telemetry.py - photo / device checks
# --------------------------------------------------------------------------

def test_validate_photo_timestamp_within_drift_is_valid():
    report_date = date(2026, 1, 15)
    photo_ts = datetime(2026, 1, 15, 10, 30)
    result = validate_photo_timestamp(photo_ts, report_date)
    assert result["valid"] is True


def test_validate_photo_timestamp_too_far_is_invalid():
    report_date = date(2026, 1, 15)
    photo_ts = datetime(2026, 1, 10, 10, 30)  # 5 days earlier
    result = validate_photo_timestamp(photo_ts, report_date)
    assert result["valid"] is False


def test_validate_photo_timestamp_missing_is_invalid():
    result = validate_photo_timestamp(None, date(2026, 1, 15))
    assert result["valid"] is False


def test_validate_device_signature_missing():
    assert validate_device_signature(None)["valid"] is False
    assert validate_device_signature("   ")["valid"] is False


def test_validate_device_signature_present():
    assert validate_device_signature("device-abc-123")["valid"] is True


# --------------------------------------------------------------------------
# telemetry.py - combined validation
# --------------------------------------------------------------------------

def test_validate_field_report_all_pass():
    report = {
        "latitude": 19.0760,
        "longitude": 72.8777,
        "photo_timestamp": datetime(2026, 1, 15, 9, 0),
        "report_date": date(2026, 1, 15),
        "device_signature": "device-abc-123",
    }
    project = {"latitude": 19.0760, "longitude": 72.8777, "geofence_radius_meters": 500}

    result = validate_field_report(report, project)
    assert result["location_verified"] is True


def test_validate_field_report_fails_outside_geofence():
    report = {
        "latitude": 28.6139,
        "longitude": 77.2090,
        "photo_timestamp": datetime(2026, 1, 15, 9, 0),
        "report_date": date(2026, 1, 15),
        "device_signature": "device-abc-123",
    }
    project = {"latitude": 19.0760, "longitude": 72.8777, "geofence_radius_meters": 500}

    result = validate_field_report(report, project)
    assert result["location_verified"] is False
    assert result["geofence"]["within_radius"] is False

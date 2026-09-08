"""
backend/security.py
Member 5 - Security, Telemetry & Audit

Responsibilities implemented here:
    1. JWT issuing/verification (HS256) + role-based access control (RBAC)
       for FIELD_ENGINEER / EXECUTIVE_ENGINEER.
    2. Cryptographic tamper-evident audit ledger (SHA-256 hash chain) for
       every verification decision written to `audit_ledger`.

Spatial geofencing + photo/EXIF validation lives in `telemetry.py` (kept
separate so "security" stays about auth/audit, and "telemetry" stays about
field-data trust checks per the architecture diagram).

Integration (for Member 3 / main.py):

    from backend.security import (
        get_current_user, require_role, Role, record_audit_entry,
    )

    @app.post("/api/v1/verifications", tags=["Verification"])
    async def submit_verification(
        payload: VerificationCreate,
        db: AsyncSession = Depends(get_db),
        current_user: dict = Depends(require_role(Role.EXECUTIVE_ENGINEER)),
    ):
        ...
        audit_row = await record_audit_entry(
            db,
            report_id=payload.report_id,
            officer_emp_id=current_user["employee_id"],
            decision=payload.decision,
        )
        return audit_row

Required environment variables (add to backend/.env.example):
    JWT_SECRET=change-me-in-production
    JWT_ALGORITHM=HS256                # optional, defaults to HS256
    JWT_EXPIRE_MINUTES=480             # optional, defaults to 8 hours

Required dependency (add to backend/requirements.txt):
    pyjwt
"""

from __future__ import annotations

import hashlib
import os
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any, Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "480"))

_bearer_scheme = HTTPBearer(auto_error=False)


class Role(str, Enum):
    """Mirrors the CHECK constraint on users.role in schema.sql."""
    FIELD_ENGINEER = "FIELD_ENGINEER"
    EXECUTIVE_ENGINEER = "EXECUTIVE_ENGINEER"


# --------------------------------------------------------------------------
# JWT issuing / verification
# --------------------------------------------------------------------------

def create_access_token(
    user_id: int,
    role: str,
    employee_id: Optional[str] = None,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Issue a signed JWT for a logged-in user."""
    if role not in (Role.FIELD_ENGINEER.value, Role.EXECUTIVE_ENGINEER.value):
        raise ValueError(f"Unknown role: {role}")

    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES)
    )
    payload = {
        "sub": str(user_id),
        "role": role,
        "employee_id": employee_id,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decode + validate a JWT. Raises HTTPException(401) if invalid/expired."""
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer_scheme),
) -> dict:
    """FastAPI dependency: extracts + validates the bearer token."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_access_token(credentials.credentials)
    return {
        "user_id": int(payload["sub"]),
        "role": payload["role"],
        "employee_id": payload.get("employee_id"),
    }


def require_role(*allowed_roles: Role):
    """
    Dependency factory for RBAC.

    Usage: Depends(require_role(Role.EXECUTIVE_ENGINEER))
    """
    allowed_values = {r.value if isinstance(r, Role) else r for r in allowed_roles}

    async def _dependency(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user["role"] not in allowed_values:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{current_user['role']}' is not permitted to perform this action",
            )
        return current_user

    return _dependency


# --------------------------------------------------------------------------
# Cryptographic tamper-evident audit ledger
# --------------------------------------------------------------------------

def compute_audit_hash(
    timestamp: str,
    decision: str,
    report_id: Any,
    officer_emp_id: Optional[str],
    previous_hash: Optional[str],
) -> str:
    """
    Deterministic SHA-256 hash of one ledger entry, chained to the previous
    entry's hash. Matches the concatenation order specified in the project
    brief: timestamp + decision + report_id + officer_emp_id + prev_hash.
    """
    raw = f"{timestamp}{decision}{report_id}{officer_emp_id or ''}{previous_hash or ''}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


async def get_latest_audit_hash(db: AsyncSession) -> Optional[str]:
    """Fetch current_hash of the most recent audit_ledger row, if any."""
    result = await db.execute(
        text("SELECT current_hash FROM audit_ledger ORDER BY id DESC LIMIT 1")
    )
    row = result.first()
    return row[0] if row else None


async def record_audit_entry(
    db: AsyncSession,
    report_id: Optional[int],
    officer_emp_id: Optional[str],
    decision: str,
) -> dict:
    """
    Appends a new tamper-evident entry to audit_ledger, chaining it to the
    previous entry's hash. Commits the transaction.
    """
    if decision not in ("APPROVED", "REJECTED", "PENDING"):
        raise ValueError(f"Invalid decision: {decision}")

    previous_hash = await get_latest_audit_hash(db)
    timestamp = datetime.now(timezone.utc).isoformat()
    current_hash = compute_audit_hash(
        timestamp, decision, report_id, officer_emp_id, previous_hash
    )

    result = await db.execute(
        text(
            """
            INSERT INTO audit_ledger
                (report_id, officer_emp_id, decision, previous_hash, current_hash, timestamp)
            VALUES
                (:report_id, :officer_emp_id, :decision, :previous_hash, :current_hash, :timestamp)
            RETURNING id, report_id, officer_emp_id, decision, previous_hash, current_hash, timestamp
            """
        ),
        {
            "report_id": report_id,
            "officer_emp_id": officer_emp_id,
            "decision": decision,
            "previous_hash": previous_hash,
            "current_hash": current_hash,
            "timestamp": timestamp,
        },
    )
    await db.commit()
    row = result.mappings().first()
    return dict(row)


async def verify_audit_chain(db: AsyncSession) -> dict:
    """
    Walks the full audit_ledger in order and recomputes each hash to detect
    tampering. Returns {"valid": bool, "broken_at_id": int | None,
    "entries_checked": int}.
    """
    result = await db.execute(
        text(
            """
            SELECT id, report_id, officer_emp_id, decision, previous_hash,
                   current_hash, timestamp
            FROM audit_ledger
            ORDER BY id ASC
            """
        )
    )
    rows = result.mappings().all()

    expected_previous = None
    for row in rows:
        recomputed = compute_audit_hash(
            row["timestamp"].isoformat() if hasattr(row["timestamp"], "isoformat") else str(row["timestamp"]),
            row["decision"],
            row["report_id"],
            row["officer_emp_id"],
            row["previous_hash"],
        )
        if row["previous_hash"] != expected_previous or recomputed != row["current_hash"]:
            return {
                "valid": False,
                "broken_at_id": row["id"],
                "entries_checked": len(rows),
            }
        expected_previous = row["current_hash"]

    return {"valid": True, "broken_at_id": None, "entries_checked": len(rows)}
  

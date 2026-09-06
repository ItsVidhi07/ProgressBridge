"""
ai_engine.py
------------
ProgressBridge - AI & NLP Matching Engine (Member 4)

Matches unstructured field-engineer progress narratives against the
formal baseline Schedule of Works (WBS) activities using a sentence
embedding model, then layers explainable rule-based heuristics on top
of the raw semantic similarity score.

This module is intentionally self-contained: it exposes a single class,
`ActivitySemanticMatcher`, with one public method, `match_report(...)`,
so the Backend Lead (Member 3) can import and call it without needing
to know anything about the internals.

    from ai_engine import ActivitySemanticMatcher
    matcher = ActivitySemanticMatcher()
    result = matcher.match_report(narrative, discipline, date, progress, activities)
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Any, Dict, List, Optional, Union

from sentence_transformers import SentenceTransformer, util


# --------------------------------------------------------------------------- #
# Config
# --------------------------------------------------------------------------- #

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# Heuristic scoring weights (tunable)
DISCIPLINE_MATCH_BONUS = 10.0       # added if claimed discipline == matched activity discipline
DATE_OUT_OF_WINDOW_PENALTY = 8.0    # subtracted if report_date outside planned window
PROGRESS_ANOMALY_PENALTY = 15.0     # subtracted if claimed progress regresses

MIN_CONFIDENCE = 0
MAX_CONFIDENCE = 99


def _parse_date(value: Union[str, date, datetime, None]) -> Optional[date]:
    """Best-effort conversion of a date-like value into a `date` object."""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S", "%d-%m-%Y", "%d/%m/%Y"):
            try:
                return datetime.strptime(value, fmt).date()
            except ValueError:
                continue
    return None


@dataclass
class MatchResult:
    """Structured, explainable output of a single match_report() call."""

    top_match: Dict[str, Any]
    confidence_score: int
    justifications: List[str] = field(default_factory=list)
    anomaly_flags: List[str] = field(default_factory=list)
    all_candidates: List[Dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "top_match": self.top_match,
            "confidence_score": self.confidence_score,
            "justifications": self.justifications,
            "anomaly_flags": self.anomaly_flags,
            "all_candidates": self.all_candidates,
        }


class ActivitySemanticMatcher:
    """
    Loads the sentence-transformer model once and reuses it for every
    match_report() call. Instantiate this ONCE at application startup
    (e.g. as a module-level singleton in main.py) — do not re-instantiate
    per request, since model loading is comparatively expensive.
    """

    def __init__(self, model_name: str = MODEL_NAME, device: str = "cpu"):
        self.model_name = model_name
        self.device = device
        self._model = SentenceTransformer(model_name, device=device)

    # ------------------------------------------------------------------ #
    # Public API
    # ------------------------------------------------------------------ #

    def match_report(
        self,
        narrative: str,
        claimed_discipline: str,
        report_date: Union[str, date, datetime],
        claimed_progress: float,
        schedule_context: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Match a free-text field report against the project's baseline
        Schedule of Works activities.

        Parameters
        ----------
        narrative : str
            Free-text description written by the field engineer,
            e.g. "Poured RCC foundation for pier 4, formwork removed."
        claimed_discipline : str
            Discipline the engineer says the work belongs to
            (e.g. "Civil", "Electrical", "Mechanical", "Water Supply").
        report_date : str | date | datetime
            Date the report was filed.
        claimed_progress : float
            Progress percentage (0-100) claimed in this report.
        schedule_context : list[dict]
            Candidate baseline activities, matching the `activities`
            table schema (database/schema.sql). Each dict is expected
            to look like:
                {
                    "id": "a1b2c3d4-...-uuid",       # activities.id (UUID)
                    "activity_code": "CIV-014",       # activities.activity_code
                    "activity_name": "Pier Foundation Casting",
                    "description": "Cast RCC foundation for pier structures",
                    "discipline": "Civil",
                    "planned_start": "2026-01-10",
                    "planned_finish": "2026-02-05",
                    "planned_progress": 45.0,
                    "actual_progress": 40.0,          # used for regression check
                }
            Missing keys are tolerated and simply reduce how many
            heuristics can be applied.

        Returns
        -------
        dict
            {
                "top_match": {...activity + similarity...},
                "confidence_score": int (0-99),
                "justifications": [str, ...],
                "anomaly_flags": [str, ...],
                "all_candidates": [{...ranked list...}, ...]
            }
        """
        if not schedule_context:
            return MatchResult(
                top_match={},
                confidence_score=MIN_CONFIDENCE,
                justifications=["No schedule activities were provided to match against."],
                anomaly_flags=["NO_CANDIDATES"],
            ).to_dict()

        narrative = (narrative or "").strip()
        if not narrative:
            return MatchResult(
                top_match={},
                confidence_score=MIN_CONFIDENCE,
                justifications=["Empty narrative — nothing to match."],
                anomaly_flags=["EMPTY_NARRATIVE"],
            ).to_dict()

        descriptions = [str(a.get("description", "")) for a in schedule_context]

        narrative_embedding = self._model.encode(narrative, convert_to_tensor=True)
        activity_embeddings = self._model.encode(descriptions, convert_to_tensor=True)

        similarities = util.cos_sim(narrative_embedding, activity_embeddings)[0]

        ranked_indices = sorted(
            range(len(schedule_context)),
            key=lambda i: float(similarities[i]),
            reverse=True,
        )

        best_idx = ranked_indices[0]
        best_activity = schedule_context[best_idx]
        best_similarity = float(similarities[best_idx])

        confidence, justifications, anomaly_flags = self._score_match(
            similarity=best_similarity,
            activity=best_activity,
            claimed_discipline=claimed_discipline,
            report_date=report_date,
            claimed_progress=claimed_progress,
        )

        top_match = {
            **best_activity,
            "semantic_similarity": round(best_similarity, 4),
        }

        all_candidates = [
            {
                "id": schedule_context[i].get("id"),
                "activity_code": schedule_context[i].get("activity_code"),
                "activity_name": schedule_context[i].get("activity_name"),
                "description": schedule_context[i].get("description"),
                "similarity": round(float(similarities[i]), 4),
            }
            for i in ranked_indices[:5]  # top 5 for transparency / manual override
        ]

        return MatchResult(
            top_match=top_match,
            confidence_score=confidence,
            justifications=justifications,
            anomaly_flags=anomaly_flags,
            all_candidates=all_candidates,
        ).to_dict()

    # ------------------------------------------------------------------ #
    # Internal heuristics
    # ------------------------------------------------------------------ #

    def _score_match(
        self,
        similarity: float,
        activity: Dict[str, Any],
        claimed_discipline: str,
        report_date: Union[str, date, datetime],
        claimed_progress: float,
    ) -> tuple[int, List[str], List[str]]:
        """
        Combine raw semantic similarity with rule-based heuristics to
        produce a final confidence score (0-99) plus human-readable
        justifications and anomaly flags.
        """
        justifications: List[str] = []
        anomaly_flags: List[str] = []

        # Base score: similarity is in [-1, 1] (practically [0, 1] for
        # related sentences) — scale to a 0-99 baseline.
        score = max(0.0, similarity) * 100
        justifications.append(f"Semantic similarity to matched activity: {similarity:.2f}")

        # --- Discipline check -------------------------------------------------
        activity_discipline = str(activity.get("discipline", "")).strip().lower()
        claimed_discipline_norm = str(claimed_discipline or "").strip().lower()

        if activity_discipline and claimed_discipline_norm:
            if activity_discipline == claimed_discipline_norm:
                score += DISCIPLINE_MATCH_BONUS
                justifications.append(
                    f"Discipline match: '{claimed_discipline}' == '{activity.get('discipline')}' "
                    f"(+{DISCIPLINE_MATCH_BONUS:.0f}%)"
                )
            else:
                justifications.append(
                    f"Discipline mismatch: claimed '{claimed_discipline}' vs. activity "
                    f"'{activity.get('discipline')}' — no bonus applied"
                )
                anomaly_flags.append("DISCIPLINE_MISMATCH")
        else:
            justifications.append("Discipline could not be verified (missing data)")

        # --- Date window check --------------------------------------------------
        parsed_report_date = _parse_date(report_date)
        planned_start = _parse_date(activity.get("planned_start"))
        planned_finish = _parse_date(activity.get("planned_finish"))

        if parsed_report_date and planned_start and planned_finish:
            if planned_start <= parsed_report_date <= planned_finish:
                justifications.append("Report date falls within the activity's planned window")
            else:
                score -= DATE_OUT_OF_WINDOW_PENALTY
                justifications.append(
                    f"Report date {parsed_report_date} is outside the planned window "
                    f"({planned_start} to {planned_finish}) (-{DATE_OUT_OF_WINDOW_PENALTY:.0f}%)"
                )
                anomaly_flags.append("DATE_OUT_OF_WINDOW")
        else:
            justifications.append("Planned date window could not be verified (missing data)")

        # --- Progress regression check ------------------------------------------
        # Matches the `activities.actual_progress` column in schema.sql
        actual_progress = activity.get("actual_progress")
        if actual_progress is not None and claimed_progress is not None:
            try:
                actual_progress_f = float(actual_progress)
                claimed_progress_f = float(claimed_progress)
                if claimed_progress_f < actual_progress_f:
                    score -= PROGRESS_ANOMALY_PENALTY
                    justifications.append(
                        f"Claimed progress ({claimed_progress_f:.1f}%) is lower than recorded "
                        f"progress ({actual_progress_f:.1f}%) — possible error or falsification "
                        f"(-{PROGRESS_ANOMALY_PENALTY:.0f}%)"
                    )
                    anomaly_flags.append("PROGRESS_REGRESSION")
                else:
                    justifications.append("No progress regression detected")
            except (TypeError, ValueError):
                justifications.append("Progress values could not be compared (invalid data)")
        else:
            justifications.append("Progress history unavailable for comparison")

        confidence = int(round(min(max(score, MIN_CONFIDENCE), MAX_CONFIDENCE)))
        return confidence, justifications, anomaly_flags


# --------------------------------------------------------------------------- #
# Manual smoke test — run `python ai_engine.py` directly to sanity-check
# --------------------------------------------------------------------------- #

if __name__ == "__main__":
    # NOTE: `id` values below are placeholder strings, not real UUIDs.
    # Once Member 6's seed data is loaded into Supabase, swap these for
    # real activity rows (or fetch them via Member 3's DB session) to
    # test against actual project data.
    sample_schedule = [
        {
            "id": "11111111-1111-1111-1111-111111111111",
            "activity_code": "CIV-014",
            "activity_name": "Pier Foundation Casting",
            "description": "Cast RCC foundation for pier structures at chainage 4+200",
            "discipline": "Civil",
            "planned_start": "2026-01-10",
            "planned_finish": "2026-02-05",
            "planned_progress": 45.0,
            "actual_progress": 40.0,
        },
        {
            "id": "22222222-2222-2222-2222-222222222222",
            "activity_code": "ELEC-007",
            "activity_name": "11kV Underground Cabling",
            "description": "Install 11kV underground cabling along service road",
            "discipline": "Electrical",
            "planned_start": "2026-01-15",
            "planned_finish": "2026-03-01",
            "planned_progress": 25.0,
            "actual_progress": 20.0,
        },
        {
            "id": "33333333-3333-3333-3333-333333333333",
            "activity_code": "WS-003",
            "activity_name": "Water Supply Pipeline Laying",
            "description": "Lay 300mm DI water supply pipeline, Sector 12",
            "discipline": "Water Supply",
            "planned_start": "2026-02-01",
            "planned_finish": "2026-04-01",
            "planned_progress": 12.0,
            "actual_progress": 10.0,
        },
    ]

    matcher = ActivitySemanticMatcher()

    result = matcher.match_report(
        narrative="Completed concrete pour for the pier foundation today, formwork stripped on the north face.",
        claimed_discipline="Civil",
        report_date="2026-01-25",
        claimed_progress=55.0,
        schedule_context=sample_schedule,
    )

    import json

    print(json.dumps(result, indent=2, default=str))

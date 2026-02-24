from datetime import timezone
from zoneinfo import ZoneInfo

# ✅ Single source of truth for app timezone
APP_TIMEZONE = ZoneInfo("Africa/Nairobi")


def to_local_iso(dt):
    """
    Convert UTC datetime to Africa/Nairobi ISO string.
    Assumes dt is stored in UTC (naive or aware).
    """
    if not dt:
        return None

    # If stored as naive UTC
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    return dt.astimezone(APP_TIMEZONE).isoformat()
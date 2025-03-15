from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from constants.facility_types import FacilityTypes

class FacilitySetupMsg(BaseModel):
    facility_id: UUID
    facility_name: str
    address: str
    longitude: float
    latitude: float
    facility_type: FacilityTypes
    tracked_at: datetime = Field(default_factory=datetime.utcnow)

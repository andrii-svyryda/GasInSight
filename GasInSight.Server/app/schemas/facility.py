from pydantic import BaseModel
from datetime import datetime
from app.models.facility import FacilityType
from app.schemas.location import Location


class FacilityBase(BaseModel):
    name: str
    status: str
    type: FacilityType


class FacilityCreate(FacilityBase):
    id: str
    location_id: int


class FacilityUpdate(BaseModel):
    name: str | None = None


class Facility(FacilityBase):
    id: str
    location_id: int
    created_at: datetime
    location: Location

    class Config:
        from_attributes: bool = True

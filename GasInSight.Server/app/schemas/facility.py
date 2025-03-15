from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.facility import FacilityType
from app.schemas.location import Location, LocationCreate


class FacilityBase(BaseModel):
    name: str
    status: str
    type: FacilityType


class FacilityCreate(FacilityBase):
    id: str
    location: LocationCreate


class FacilityUpdate(BaseModel):
    name: Optional[str] = None


class Facility(FacilityBase):
    id: str
    location_id: int
    created_at: datetime
    location: Location

    class Config:
        from_attributes = True

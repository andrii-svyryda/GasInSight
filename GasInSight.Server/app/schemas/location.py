from pydantic import BaseModel
from typing import Optional


class LocationBase(BaseModel):
    address: Optional[str] = None
    longitude: float
    latitude: float


class LocationCreate(LocationBase):
    pass


class Location(LocationBase):
    id: int

    class Config:
        from_attributes = True

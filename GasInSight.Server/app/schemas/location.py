from pydantic import BaseModel


class LocationBase(BaseModel):
    address: str | None = None
    longitude: float
    latitude: float


class LocationCreate(LocationBase):
    pass


class Location(LocationBase):
    id: int

    class Config:
        from_attributes: bool = True


class LocationUpdate(LocationBase):
    pass

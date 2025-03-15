from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, Dict, Any
from app.models.models import UserRole, FacilityType, PermissionType, SensorType, SensorStatus


class TokenData(BaseModel):
    username: str
    role: UserRole


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.User


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None


class User(UserBase):
    id: int
    created_at: datetime
    last_login: Optional[datetime] = None
    role: UserRole

    class Config:
        from_attributes = True


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


class UserFacilityPermissionBase(BaseModel):
    user_id: int
    facility_id: str
    permission_type: PermissionType


class UserFacilityPermissionCreate(UserFacilityPermissionBase):
    pass


class UserFacilityPermission(UserFacilityPermissionBase):
    id: int
    granted_at: datetime

    class Config:
        from_attributes = True


class SensorBase(BaseModel):
    name: str
    status: SensorStatus
    type: SensorType


class SensorCreate(SensorBase):
    id: str
    facility_id: str
    location: LocationCreate
    installed_at: datetime


class SensorUpdate(BaseModel):
    name: Optional[str] = None


class Sensor(SensorBase):
    id: str
    facility_id: str
    location_id: int
    installed_at: datetime

    class Config:
        from_attributes = True


class SensorRecordBase(BaseModel):
    data: str


class SensorRecordCreate(SensorRecordBase):
    sensor_id: str
    tracked_at: datetime


class SensorRecord(SensorRecordBase):
    sensor_id: str
    tracked_at: datetime

    class Config:
        from_attributes = True


class SensorDataMessage(BaseModel):
    sensor_id: str
    facility_id: str
    tracked_at: datetime
    data: str


class SensorActivationMessage(BaseModel):
    sensor_id: str
    facility_id: str
    address: Optional[str] = None
    longitude: float
    latitude: float
    sensor_type: str
    tracked_at: datetime


class SensorDeactivationMessage(BaseModel):
    sensor_id: str
    facility_id: str
    tracked_at: datetime


class FacilitySetupMessage(BaseModel):
    facility_id: str
    facility_name: str
    address: Optional[str] = None
    longitude: float
    latitude: float
    facility_type: str
    tracked_at: datetime

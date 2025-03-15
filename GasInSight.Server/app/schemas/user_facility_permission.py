from pydantic import BaseModel
from datetime import datetime
from app.models.user_facility_permission import PermissionType


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

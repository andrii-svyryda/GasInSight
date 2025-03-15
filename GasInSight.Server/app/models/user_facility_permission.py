from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class PermissionType(enum.Enum):
    View = "View"
    Modify = "Modify"


class UserFacilityPermission(Base):
    __tablename__ = "user_facility_permissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    facility_id = Column(String, ForeignKey("facilities.id"))
    permission_type = Column(Enum(PermissionType))
    granted_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="permissions")
    facility = relationship("Facility", back_populates="permissions")

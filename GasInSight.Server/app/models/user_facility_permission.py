from sqlalchemy import Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy.sql import func
from datetime import datetime
import enum
from app.database import Base


class PermissionType(enum.Enum):
    View = "View"
    Modify = "Modify"


class UserFacilityPermission(Base):
    __tablename__: str = "user_facility_permissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    facility_id: Mapped[str] = mapped_column(String, ForeignKey("facilities.id"))
    permission_type: Mapped[PermissionType] = mapped_column(Enum(PermissionType))
    granted_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

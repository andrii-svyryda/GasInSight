from sqlalchemy import Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.sql import func
from datetime import datetime
import enum
from typing import TYPE_CHECKING
from app.database import Base

if TYPE_CHECKING:
    from app.models.user_facility_permission import UserFacilityPermission


class UserRole(enum.Enum):
    Admin = "Admin"
    User = "User"


class User(Base):
    __tablename__: str = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    refresh_token: Mapped[str | None] = mapped_column(String, nullable=True)
    last_login: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole))

    permissions: Mapped[list["UserFacilityPermission"]] = relationship("UserFacilityPermission", back_populates="user")

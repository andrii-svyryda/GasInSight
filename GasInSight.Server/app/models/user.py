from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class UserRole(enum.Enum):
    Admin = "Admin"
    User = "User"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=func.now())
    refresh_token = Column(String, nullable=True)
    last_login = Column(DateTime, nullable=True)
    role = Column(Enum(UserRole))

    permissions = relationship("UserFacilityPermission", back_populates="user")

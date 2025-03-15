from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from app.models.user import UserRole


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

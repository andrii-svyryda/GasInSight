from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.models.user import UserRole


class TokenData(BaseModel):
    id: int


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
    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    role: UserRole | None = None


class User(UserBase):
    id: int
    created_at: datetime
    last_login: datetime | None = None
    role: UserRole

    class Config:
        from_attributes: bool = True


class SearchedUsers(BaseModel):
    users: list[User]
    total: int

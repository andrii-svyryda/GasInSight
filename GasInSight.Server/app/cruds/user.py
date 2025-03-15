from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.cruds.base import CrudBase
from app.models.user import User
from app.schemas import UserCreate, UserUpdate
from passlib.context import CryptContext
from typing import override

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class CrudUser(CrudBase[User, UserCreate, UserUpdate]):
    async def get_by_email(self, db: AsyncSession, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        return result.scalars().first()
    
    @override
    async def create(self, db: AsyncSession, obj_in: UserCreate) -> User:
        db_obj = User(
            username=obj_in.username,
            email=obj_in.email,
            password_hash=pwd_context.hash(obj_in.password),
            role=obj_in.role
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    @override
    async def update(self, db: AsyncSession, db_obj: User, obj_in: UserUpdate) -> User:
        update_data = obj_in.model_dump(exclude_unset=True)
        password: str | None = update_data.get("password")
        if password:
            hashed_password = pwd_context.hash(password)
            del update_data["password"]
            update_data["password_hash"] = hashed_password
        return await super().update(db, db_obj, UserUpdate(**update_data))
    
    async def authenticate(self, db: AsyncSession, email: str, password: str) -> User | None:
        user = await self.get_by_email(db, email)
        if not user:
            return None
        if not pwd_context.verify(password, user.password_hash):
            return None
        return user
    
    async def update_refresh_token(self, db: AsyncSession, user_id: int, refresh_token: str | None) -> User | None:
        user = await self.get(db, user_id)
        if user:
            user.refresh_token = refresh_token
            db.add(user)
            await db.commit()
            await db.refresh(user)
            return user
        return None


user_crud = CrudUser(User)

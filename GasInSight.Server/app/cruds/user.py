from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from app.cruds.base import CrudBase
from app.models.user import User, UserRole
from app.schemas import UserCreate, UserUpdate
from passlib.context import CryptContext
from typing import override

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class CrudUser(CrudBase[User, UserCreate, UserUpdate]):
    async def get_by_email(self, db: AsyncSession, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        return result.scalars().first()
    
    async def get_all_admins(self, db: AsyncSession) -> list[User]:
        stmt = select(User).where(User.role == UserRole.Admin)
        result = await db.execute(stmt)
        return list(result.scalars().all())
    
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

    async def search(self, db: AsyncSession, search_term: str | None, skip: int = 0, limit: int = 100) -> tuple[list[User], int]:
        stmt = select(User).offset(skip).limit(limit)
        
        search_pattern = f"%{search_term}%" if search_term else None

        if search_term:
            stmt = stmt.where(
                (User.username.ilike(search_pattern)) | 
                (User.email.ilike(search_pattern))
            )
        
        count_stmt = select(func.count()).select_from(User)

        if search_term:
            count_stmt = count_stmt.where(
                (User.username.ilike(search_pattern)) | 
                (User.email.ilike(search_pattern))
            )

        count_result = await db.execute(count_stmt)
        total_count = count_result.scalar() or 0
        
        result = await db.execute(stmt)
        users = list(result.scalars().all())

        return users, total_count


user_crud = CrudUser(User)

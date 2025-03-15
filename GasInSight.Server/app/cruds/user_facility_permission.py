from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.cruds.base import CrudBase
from app.models import UserFacilityPermission
from app.schemas import UserFacilityPermissionCreate, UserFacilityPermissionBase


class CrudUserFacilityPermission(CrudBase[UserFacilityPermission, UserFacilityPermissionCreate, UserFacilityPermissionBase]):
    async def get_by_user_and_facility(self, db: AsyncSession, user_id: int, facility_id: str) -> UserFacilityPermission | None:
        stmt = select(UserFacilityPermission).where(
            UserFacilityPermission.user_id == user_id,
            UserFacilityPermission.facility_id == facility_id
        )
        result = await db.execute(stmt)
        return result.scalars().first()
    
    async def get_by_user_id(self, db: AsyncSession, user_id: int) -> list[UserFacilityPermission]:
        stmt = select(UserFacilityPermission).where(
            UserFacilityPermission.user_id == user_id
        )
        result = await db.execute(stmt)
        return list(result.scalars().all())
    
    async def get_by_facility_id(self, db: AsyncSession, facility_id: str) -> list[UserFacilityPermission]:
        stmt = select(UserFacilityPermission).where(
            UserFacilityPermission.facility_id == facility_id
        )
        result = await db.execute(stmt)
        return list(result.scalars().all())


user_facility_permission_crud = CrudUserFacilityPermission(UserFacilityPermission)

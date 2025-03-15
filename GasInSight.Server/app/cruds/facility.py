from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.cruds.base import CrudBase
from app.models.facility import Facility
from app.models.user_facility_permission import UserFacilityPermission
from app.schemas import FacilityCreate, FacilityUpdate


class CrudFacility(CrudBase[Facility, FacilityCreate, FacilityUpdate]):
    async def get_by_id(self, db: AsyncSession, id: str) -> Facility | None:
        stmt = select(Facility).where(Facility.id == id)
        result = await db.execute(stmt)
        return result.scalars().first()
    
    async def get_all_by_user_id(self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100) -> list[Facility]:
        stmt = select(Facility).join(
            UserFacilityPermission, 
            UserFacilityPermission.facility_id == Facility.id
        ).where(
            UserFacilityPermission.user_id == user_id
        ).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())


facility_crud = CrudFacility(Facility)

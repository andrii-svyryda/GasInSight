from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.cruds.base import CrudBase
from app.models import Sensor
from app.schemas import SensorCreate, SensorUpdate


class CrudSensor(CrudBase[Sensor, SensorCreate, SensorUpdate]):
    async def get_by_id(self, db: AsyncSession, id: str) -> Sensor | None:
        stmt = select(Sensor).where(Sensor.id == id)
        result = await db.execute(stmt)
        return result.scalars().first()
    
    async def get_by_facility_id(self, db: AsyncSession, facility_id: str, skip: int = 0, limit: int = 100) -> list[Sensor]:
        stmt = select(Sensor).where(Sensor.facility_id == facility_id).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())


sensor = CrudSensor(Sensor)

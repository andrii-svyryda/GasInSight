from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.cruds.base import CrudBase
from app.models import Sensor
from app.models.sensor import SensorStatus
from app.schemas import SensorCreate, SensorUpdate
from typing import override

class CrudSensor(CrudBase[Sensor, SensorCreate, SensorUpdate]):
    @override
    async def get(self, db: AsyncSession, id: str) -> Sensor | None:
        stmt = select(Sensor).options(joinedload(Sensor.location)).where(Sensor.id == id)
        result = await db.execute(stmt)
        return result.scalars().first()
    
    async def get_by_facility_id(self, db: AsyncSession, facility_id: str, skip: int = 0, limit: int = 100) -> list[Sensor]:
        stmt = select(Sensor).options(joinedload(Sensor.location)).where(Sensor.facility_id == facility_id).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())
    
    async def get_all_active(self, db: AsyncSession) -> list[Sensor]:
        stmt = select(Sensor).options(joinedload(Sensor.location)).where(Sensor.status == SensorStatus.Active)
        result = await db.execute(stmt)
        return list(result.scalars().all())


sensor_crud = CrudSensor(Sensor)

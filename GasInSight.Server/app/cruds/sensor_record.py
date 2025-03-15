from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select
from app.cruds.base import CrudBase
from app.models import SensorRecord
from app.schemas import SensorRecordCreate, SensorRecordBase
from typing import override
from datetime import datetime


class CrudSensorRecord(CrudBase[SensorRecord, SensorRecordCreate, SensorRecordBase]):
    @override
    async def create(self, db: AsyncSession, obj_in: SensorRecordCreate) -> SensorRecord:
        db_obj = SensorRecord(
            sensor_id=obj_in.sensor_id,
            tracked_at=obj_in.tracked_at,
            data=obj_in.data
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    async def get_by_sensor_id_and_date_range(
        self, db: AsyncSession, sensor_id: str, start_date: datetime, end_date: datetime | None = None
    ) -> list[SensorRecord]:
        stmt = select(SensorRecord).where(
            and_(
                SensorRecord.sensor_id == sensor_id,
                SensorRecord.tracked_at >= start_date,
                SensorRecord.tracked_at <= end_date
            ) if end_date is not None else
            and_(
                SensorRecord.sensor_id == sensor_id,
                SensorRecord.tracked_at >= start_date
            )
        )
        result = await db.execute(stmt)
        return list(result.scalars().all())


sensor_record_crud = CrudSensorRecord(SensorRecord)

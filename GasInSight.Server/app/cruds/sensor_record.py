from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select
from app.cruds.base import CrudBase
from app.models import SensorRecord
from app.schemas import SensorRecordCreate, SensorRecordBase
from typing import override
from datetime import UTC, datetime, timedelta


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
        ).order_by(SensorRecord.tracked_at.asc())
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def get_recent_by_sensor_id(
        self, db: AsyncSession, sensor_id: str, minutes: int = 120, limit: int = 10
    ) -> list[SensorRecord]:
        time_threshold = datetime.now(UTC).replace(tzinfo=None) - timedelta(minutes=minutes)
        stmt = select(SensorRecord).where(
            and_(
                SensorRecord.sensor_id == sensor_id,
                SensorRecord.tracked_at >= time_threshold
            )
        ).order_by(SensorRecord.tracked_at.desc()).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def exists(self, db: AsyncSession, sensor_id: str, tracked_at: datetime) -> bool:
        stmt = select(1).where(
            and_(
                SensorRecord.sensor_id == sensor_id,
                SensorRecord.tracked_at == tracked_at
            )
        )
        result = await db.execute(stmt)
        return result.scalar() is not None


sensor_record_crud = CrudSensorRecord(SensorRecord)

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import UTC, datetime, timedelta
from app.models.alert import Alert
from app.models.sensor import Sensor
from app.schemas.alert import AlertCreate, AlertUpdate
from app.cruds.base import CrudBase
from typing import override


class AlertCRUD(CrudBase[Alert, AlertCreate, AlertUpdate]):
    @override
    async def get(self, db: AsyncSession, id: int) -> Alert | None:
        result = await db.execute(select(Alert).where(Alert.id == id))
        return result.scalar_one_or_none()

    async def get_by_sensor_id(self, db: AsyncSession, sensor_id: str) -> list[Alert]:
        result = await db.execute(select(Alert).where(Alert.sensor_id == sensor_id))
        return list(result.scalars().all())

    async def get_recent_by_sensor_id(
        self, db: AsyncSession, sensor_id: str, minutes: int = 60
    ) -> list[Alert]:
        time_threshold = datetime.now(UTC).replace(tzinfo=None) - timedelta(minutes=minutes)
        result = await db.execute(
            select(Alert)
            .where(Alert.sensor_id == sensor_id)
            .where(Alert.created_at >= time_threshold)
        )
        return list(result.scalars().all())
        
    async def get_by_facility_id(self, db: AsyncSession, facility_id: str) -> list[Alert]:
        # Join Alert with Sensor to filter by facility_id
        stmt = select(Alert).join(Sensor, Alert.sensor_id == Sensor.id).where(Sensor.facility_id == facility_id).order_by(Alert.created_at.desc())
        result = await db.execute(stmt)
        return list(result.scalars().all())
        
    async def get_recent(self, db: AsyncSession, limit: int = 20) -> list[Alert]:
        # Get the most recent alerts across all facilities
        stmt = select(Alert).order_by(Alert.created_at.desc()).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())


alert_crud = AlertCRUD(Alert)

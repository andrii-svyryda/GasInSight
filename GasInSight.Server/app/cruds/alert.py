from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import UTC, datetime, timedelta
from app.models.alert import Alert
from app.models.sensor import Sensor
from app.models.facility import Facility
from app.schemas.alert import AlertCreate, AlertUpdate
from app.cruds.base import CrudBase
from typing import override, Any


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
        stmt = select(Alert).join(Sensor, Alert.sensor_id == Sensor.id).where(Sensor.facility_id == facility_id).order_by(Alert.created_at.desc())
        result = await db.execute(stmt)
        return list(result.scalars().all())
        
    async def get_recent(self, db: AsyncSession, limit: int = 20) -> list[Alert]:
        stmt = select(Alert).order_by(Alert.created_at.desc()).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())
        
    async def get_recent_with_details(
        self, 
        db: AsyncSession, 
        limit: int = 20, 
        facility_ids: list[str] | None = None
    ) -> list[dict[str, Any]]:
        query = (
            select(Alert, Sensor, Facility)
            .join(Sensor, Alert.sensor_id == Sensor.id)
            .join(Facility, Sensor.facility_id == Facility.id)
        )
        
        if facility_ids:
            query = query.where(Facility.id.in_(facility_ids))
            
        query = query.order_by(Alert.created_at.desc()).limit(limit)
        
        result = await db.execute(query)
        
        alerts_with_details = []
        for alert_row, sensor_row, facility_row in result:
            alert_dict = {
                "id": alert_row.id,
                "sensor_id": alert_row.sensor_id,
                "type": alert_row.type,
                "message": alert_row.message,
                "created_at": alert_row.created_at,
            }
            
            sensor_dict = {
                "id": sensor_row.id,
                "name": sensor_row.name,
                "status": sensor_row.status,
                "type": sensor_row.type,
                "facility_id": sensor_row.facility_id,
                "installed_at": sensor_row.installed_at,
                "expected_freq": sensor_row.expected_freq,
            }
            
            facility_dict = {
                "id": facility_row.id,
                "name": facility_row.name,
                "status": facility_row.status,
                "type": facility_row.type,
                "created_at": facility_row.created_at,
            }
            
            alert_dict["sensor"] = sensor_dict
            alert_dict["facility"] = facility_dict
            alerts_with_details.append(alert_dict)
            
        return alerts_with_details


alert_crud = AlertCRUD(Alert)

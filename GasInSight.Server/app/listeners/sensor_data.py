import asyncio

from sqlalchemy.ext.asyncio import AsyncSession
from app.listeners.base import ServiceBusListener
from app.schemas.service_bus_messages import SensorDataMessage
from app.cruds.sensor_record import sensor_record_crud
from app.schemas.sensor_record import SensorRecordCreate
from app.websockets.manager import manager
from typing import Any


async def handle_sensor_data(message_body: dict[str, Any], db: AsyncSession):
    sensor_message = SensorDataMessage(**message_body)
    
    record_create = SensorRecordCreate(
        sensor_id=sensor_message.sensor_id,
        tracked_at=sensor_message.tracked_at,
        data=sensor_message.data
    )
    
    if await sensor_record_crud.exists(db, sensor_message.sensor_id, sensor_message.tracked_at):
        return
    
    _ = await sensor_record_crud.create(db, record_create)
    
    asyncio.create_task(
        manager.broadcast(
            sensor_message.sensor_id,
            {
                "sensor_id": sensor_message.sensor_id,
                "facility_id": sensor_message.facility_id,
                "tracked_at": sensor_message.tracked_at.isoformat(),
                "data": sensor_message.data
            }
        )
    )


def create_sensor_data_listener():
    from app.config import settings
    
    listener = ServiceBusListener(
        queue_name=settings.SENSOR_DATA_QUEUE,
        message_handler=handle_sensor_data
    )
    
    return listener

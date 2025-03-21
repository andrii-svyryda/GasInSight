from sqlalchemy.ext.asyncio import AsyncSession
from app.listeners.base import ServiceBusListener
from app.schemas.service_bus_messages import SensorDeactivationMessage
from app.cruds.sensor import sensor_crud
from app.models.sensor import SensorStatus
from app.schemas.sensor import SensorUpdate
from typing import Any


async def handle_sensor_deactivation(message_body: dict[str, Any], db: AsyncSession):
    sensor_message = SensorDeactivationMessage(**message_body)
        
    existing_sensor = await sensor_crud.get(db, sensor_message.sensor_id)
    if not existing_sensor:
        return
    
    sensor_update = SensorUpdate(status=SensorStatus.Inactive)
    _ = await sensor_crud.update(db, existing_sensor, sensor_update)


def create_sensor_deactivation_listener():
    from app.config import settings
    
    listener = ServiceBusListener(
        queue_name=settings.SENSOR_DEACTIVATION_QUEUE,
        message_handler=handle_sensor_deactivation
    )
    
    return listener

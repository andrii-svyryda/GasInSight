from app.listeners.base import ServiceBusListener
from app.schemas.service_bus_messages import SensorActivationMessage
from app.cruds.sensor import sensor_crud
from app.schemas.sensor import SensorCreate
from app.schemas.location import LocationCreate
from app.models.sensor import SensorType, SensorStatus
from app.database import SessionLocal
from typing import Any


async def handle_sensor_activation(message_body: dict[str, Any]):
    async with SessionLocal() as db:
        try:
            sensor_message = SensorActivationMessage(**message_body)
            
            existing_sensor = await sensor_crud.get_by_id(db, sensor_message.sensor_id)
            if existing_sensor:
                return
            
            loc_create = LocationCreate(
                address=sensor_message.address,
                longitude=sensor_message.longitude,
                latitude=sensor_message.latitude
            )
            
            sensor_create = SensorCreate(
                id=sensor_message.sensor_id,
                name=f"Sensor {sensor_message.sensor_id}",
                status=SensorStatus.Active,
                type=SensorType(sensor_message.sensor_type),
                facility_id=sensor_message.facility_id,
                installed_at=sensor_message.tracked_at,
                location=loc_create
            )
            
            _ = await sensor_crud.create(db, sensor_create)
        except Exception:
            pass


def create_sensor_activation_listener():
    from app.config import settings
    
    listener = ServiceBusListener(
        queue_name=settings.SENSOR_ACTIVATION_QUEUE,
        message_handler=handle_sensor_activation
    )
    
    return listener

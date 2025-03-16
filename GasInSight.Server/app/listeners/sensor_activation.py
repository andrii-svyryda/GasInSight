from app.listeners.base import ServiceBusListener
from app.schemas.service_bus_messages import SensorActivationMessage
from app.cruds.sensor import sensor_crud
from app.cruds.location import location_crud
from app.schemas.sensor import SensorCreate
from app.schemas.location import LocationCreate
from app.models.sensor import SensorType, SensorStatus
from app.database import SessionLocal
from typing import Any


async def handle_sensor_activation(message_body: dict[str, Any]):
    async with SessionLocal() as db:
        sensor_message = SensorActivationMessage(**message_body)
        
        existing_sensor = await sensor_crud.get(db, sensor_message.sensor_id)
        if existing_sensor:
            return
        
        loc_create = LocationCreate(
            address=sensor_message.address,
            longitude=sensor_message.longitude,
            latitude=sensor_message.latitude
        )

        db_location = await location_crud.create(db, loc_create)
        
        sensor_create = SensorCreate(
            id=sensor_message.sensor_id,
            name=f"Sensor {sensor_message.sensor_id}",
            status=SensorStatus.Active,
            type=SensorType(sensor_message.sensor_type),
            facility_id=sensor_message.facility_id,
            installed_at=sensor_message.tracked_at,
            expected_freq=sensor_message.expected_freq,
            location_id=db_location.id
        )
        
        _ = await sensor_crud.create(db, sensor_create)


def create_sensor_activation_listener():
    from app.config import settings
    
    listener = ServiceBusListener(
        queue_name=settings.SENSOR_ACTIVATION_QUEUE,
        message_handler=handle_sensor_activation
    )
    
    return listener

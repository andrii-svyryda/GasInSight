from app.listeners.base import ServiceBusListener
from app.schemas.service_bus_messages import SensorActivationMessage
from app.cruds.sensor import sensor
from app.cruds.location import location
from app.schemas.sensor import SensorCreate
from app.schemas.location import LocationCreate
from app.models.sensor import SensorType, SensorStatus
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Dict, Any


async def handle_sensor_activation(message_body: Dict[str, Any], db: Session = None):
    if db is None:
        db_generator = get_db()
        db = next(db_generator)
    
    try:
        sensor_message = SensorActivationMessage(**message_body)
        
        existing_sensor = sensor.get_by_id(db, sensor_message.sensor_id)
        if existing_sensor:
            return
        
        loc = location.get_by_coordinates(db, sensor_message.longitude, sensor_message.latitude)
        if not loc:
            loc_create = LocationCreate(
                address=sensor_message.address,
                longitude=sensor_message.longitude,
                latitude=sensor_message.latitude
            )
            loc = location.create(db, loc_create)
        
        sensor_create = SensorCreate(
            id=sensor_message.sensor_id,
            name=f"Sensor {sensor_message.sensor_id}",
            status=SensorStatus.Enabled,
            type=SensorType(sensor_message.sensor_type),
            facility_id=sensor_message.facility_id,
            installed_at=sensor_message.tracked_at,
            location=LocationCreate(
                address=sensor_message.address,
                longitude=sensor_message.longitude,
                latitude=sensor_message.latitude
            )
        )
        
        sensor.create(db, sensor_create)
    finally:
        db.close()


async def create_sensor_activation_listener():
    from app.config import settings
    listener = ServiceBusListener(
        queue_name=settings.SENSOR_ACTIVATION_QUEUE,
        message_handler=handle_sensor_activation
    )
    await listener.start()
    return listener

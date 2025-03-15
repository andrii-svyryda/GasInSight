from app.listeners.base import ServiceBusListener
from app.schemas.service_bus_messages import SensorDeactivationMessage
from app.cruds.sensor import sensor
from app.models.sensor import SensorStatus
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.sensor import SensorUpdate
from typing import Dict, Any


async def handle_sensor_deactivation(message_body: Dict[str, Any], db: Session = None):
    if db is None:
        db_generator = get_db()
        db = next(db_generator)
    
    try:
        sensor_message = SensorDeactivationMessage(**message_body)
        
        existing_sensor = sensor.get_by_id(db, sensor_message.sensor_id)
        if not existing_sensor:
            return
        
        sensor_update = SensorUpdate(status=SensorStatus.Removed)
        sensor.update(db, existing_sensor, sensor_update)
    finally:
        db.close()


async def create_sensor_deactivation_listener():
    from app.config import settings
    listener = ServiceBusListener(
        queue_name=settings.SENSOR_DEACTIVATION_QUEUE,
        message_handler=handle_sensor_deactivation
    )
    await listener.start()
    return listener

from app.listeners.base import ServiceBusListener
from app.schemas.service_bus_messages import FacilitySetupMessage
from app.cruds.facility import facility
from app.cruds.location import location
from app.schemas.facility import FacilityCreate
from app.schemas.location import LocationCreate
from app.models.facility import FacilityType
from sqlalchemy.orm import Session
from app.database import get_db
from fastapi import Depends
from typing import Dict, Any


async def handle_facility_setup(message_body: Dict[str, Any], db: Session = None):
    if db is None:
        db_generator = get_db()
        db = next(db_generator)
    
    try:
        facility_message = FacilitySetupMessage(**message_body)
        
        existing_facility = facility.get_by_id(db, facility_message.facility_id)
        if existing_facility:
            return
        
        loc = location.get_by_coordinates(db, facility_message.longitude, facility_message.latitude)
        if not loc:
            loc_create = LocationCreate(
                address=facility_message.address,
                longitude=facility_message.longitude,
                latitude=facility_message.latitude
            )
            loc = location.create(db, loc_create)
        
        facility_create = FacilityCreate(
            id=facility_message.facility_id,
            name=facility_message.facility_name,
            status="Active",
            type=FacilityType(facility_message.facility_type),
            location=LocationCreate(
                address=facility_message.address,
                longitude=facility_message.longitude,
                latitude=facility_message.latitude
            )
        )
        
        facility.create(db, facility_create)
    finally:
        db.close()


async def create_facility_setup_listener():
    from app.config import settings
    listener = ServiceBusListener(
        queue_name=settings.FACILITY_SETUP_QUEUE,
        message_handler=handle_facility_setup
    )
    await listener.start()
    return listener

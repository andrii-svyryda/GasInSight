from app.listeners.base import ServiceBusListener
from app.schemas.service_bus_messages import FacilitySetupMessage
from app.cruds.facility import facility
from app.schemas.facility import FacilityCreate
from app.schemas.location import LocationCreate
from app.models.facility import FacilityType
from app.database import SessionLocal
from typing import Any


async def handle_facility_setup(message_body: dict[str, Any]) -> None:
    async with SessionLocal() as db:
        try:
            facility_message = FacilitySetupMessage(**message_body)
            
            existing_facility = await facility.get_by_id(db, facility_message.facility_id)
            if existing_facility:
                return
            
            loc_create = LocationCreate(
                address=facility_message.address,
                longitude=facility_message.longitude,
                latitude=facility_message.latitude
            )
            
            facility_create = FacilityCreate(
                id=facility_message.facility_id,
                name=facility_message.facility_name,
                status="Active",
                type=FacilityType(facility_message.facility_type),
                location=loc_create
            )
            
            _ = await facility.create(db, facility_create)
        except Exception:
            pass


async def create_facility_setup_listener():
    from app.config import settings
    
    listener = ServiceBusListener(
        queue_name=settings.FACILITY_SETUP_QUEUE,
        message_handler=handle_facility_setup
    )
    
    return listener

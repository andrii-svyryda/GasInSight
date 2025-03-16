from app.listeners.base import ServiceBusListener
from app.schemas.service_bus_messages import FacilitySetupMessage
from app.cruds.facility import facility_crud
from app.cruds.location import location_crud
from app.schemas.facility import FacilityCreate
from app.schemas.location import LocationCreate
from app.models.facility import FacilityType
from app.database import SessionLocal
from typing import Any


async def handle_facility_setup(message_body: dict[str, Any]) -> None:
    async with SessionLocal() as db:
        facility_message = FacilitySetupMessage(**message_body)
        
        existing_facility = await facility_crud.get(db, facility_message.facility_id)
        if existing_facility:
            return
        
        loc_create = LocationCreate(
            address=facility_message.address,
            longitude=facility_message.longitude,
            latitude=facility_message.latitude
        )

        db_location = await location_crud.create(db, loc_create)
        
        fac_create = FacilityCreate(
            id=facility_message.facility_id,
            name=facility_message.facility_name,
            status="Active",
            type=FacilityType(facility_message.facility_type),
            location_id=db_location.id
        )
        
        await facility_crud.create(db, fac_create)


def create_facility_setup_listener():
    from app.config import settings
    
    listener = ServiceBusListener(
        queue_name=settings.FACILITY_SETUP_QUEUE,
        message_handler=handle_facility_setup
    )
    
    return listener

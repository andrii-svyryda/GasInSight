from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.facility import Facility
from app.models.sensor import Sensor


class CrudDashboard:
    async def get_facilities(self, db: AsyncSession, user_id: int | None = None, facility_id: str | None = None) -> list[Facility]:
        facilities_query = select(Facility)
        
        if user_id:
            from app.models.user_facility_permission import UserFacilityPermission
            facilities_query = facilities_query.join(
                UserFacilityPermission,
                UserFacilityPermission.facility_id == Facility.id
            ).where(
                UserFacilityPermission.user_id == user_id
            )
        
        if facility_id:
            facilities_query = facilities_query.where(
                Facility.id == facility_id
            )
        
        result = await db.execute(facilities_query)
        return list(result.scalars().all())
    
    async def get_sensors(self, db: AsyncSession, user_id: int | None = None, facility_id: str | None = None) -> list[Sensor]:
        sensors_query = select(Sensor)

        if user_id:
            from app.models.user_facility_permission import UserFacilityPermission
            sensors_query = sensors_query.join(
                Facility,
                Sensor.facility_id == Facility.id
            ).join(
                UserFacilityPermission,
                UserFacilityPermission.facility_id == Facility.id
            ).where(
                UserFacilityPermission.user_id == user_id
            )
        
        if facility_id:
            sensors_query = sensors_query.where(
                Sensor.facility_id == facility_id
            )
        
        result = await db.execute(sensors_query)
        return list(result.scalars().all())


dashboard_crud = CrudDashboard()

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.cruds.base import CrudBase
from app.models import Location
from app.schemas import LocationCreate, LocationUpdate


class CrudLocation(CrudBase[Location, LocationCreate, LocationUpdate]):
    async def get_by_coordinates(self, db: AsyncSession, longitude: float, latitude: float) -> Location | None:
        stmt = select(Location).where(
            Location.longitude == longitude,
            Location.latitude == latitude
        )
        result = await db.execute(stmt)
        return result.scalars().first()


location = CrudLocation(Location)

from sqlalchemy.orm import Session
from app.cruds.base import CrudBase
from app.models.models import Location
from app.schemas.schemas import LocationCreate, LocationUpdate


class CrudLocation(CrudBase[Location, LocationCreate, LocationUpdate]):
    def get_by_coordinates(self, db: Session, longitude: float, latitude: float) -> Location:
        return db.query(Location).filter(
            Location.longitude == longitude,
            Location.latitude == latitude
        ).first()


location = CrudLocation(Location)

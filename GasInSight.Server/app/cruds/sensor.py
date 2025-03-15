from sqlalchemy.orm import Session
from app.cruds.base import CrudBase
from app.models.models import Sensor
from app.schemas.schemas import SensorCreate, SensorUpdate
from typing import List


class CrudSensor(CrudBase[Sensor, SensorCreate, SensorUpdate]):
    def get_by_id(self, db: Session, id: str):
        return db.query(Sensor).filter(Sensor.id == id).first()
    
    def get_by_facility_id(self, db: Session, facility_id: str, skip: int = 0, limit: int = 100) -> List[Sensor]:
        return db.query(Sensor).filter(Sensor.facility_id == facility_id).offset(skip).limit(limit).all()


sensor = CrudSensor(Sensor)

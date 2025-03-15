from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.cruds.base import CrudBase
from app.models.models import SensorRecord
from app.schemas.schemas import SensorRecordCreate, SensorRecordBase
from typing import List
from datetime import datetime


class CrudSensorRecord(CrudBase[SensorRecord, SensorRecordCreate, SensorRecordBase]):
    def create(self, db: Session, obj_in: SensorRecordCreate) -> SensorRecord:
        db_obj = SensorRecord(
            sensor_id=obj_in.sensor_id,
            tracked_at=obj_in.tracked_at,
            data=obj_in.data
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def get_by_sensor_id_and_date_range(
        self, db: Session, sensor_id: str, start_date: datetime, end_date: datetime
    ) -> List[SensorRecord]:
        return db.query(SensorRecord).filter(
            and_(
                SensorRecord.sensor_id == sensor_id,
                SensorRecord.tracked_at >= start_date,
                SensorRecord.tracked_at <= end_date
            )
        ).all()


sensor_record = CrudSensorRecord(SensorRecord)

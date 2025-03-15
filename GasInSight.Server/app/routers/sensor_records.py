from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.cruds.sensor_record import sensor_record
from app.cruds.sensor import sensor
from app.schemas.sensor_record import SensorRecord
from app.routers.dependencies import get_current_user, check_facility_permission
from app.models.user import User as UserModel
from app.models.user_facility_permission import PermissionType

router = APIRouter(
    prefix="/sensor-records",
    tags=["sensor-records"]
)


@router.get("/{sensor_id}", response_model=List[SensorRecord])
async def read_sensor_records(
    sensor_id: str,
    start_date: datetime,
    end_date: datetime,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    db_sensor = sensor.get_by_id(db, sensor_id)
    if db_sensor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor not found"
        )
    
    await check_facility_permission(db_sensor.facility_id, PermissionType.View, current_user, db)
    
    records = sensor_record.get_by_sensor_id_and_date_range(
        db, sensor_id, start_date, end_date
    )
    
    return records

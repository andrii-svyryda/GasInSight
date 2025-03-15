from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.cruds.sensor import sensor
from app.schemas.sensor import Sensor, SensorUpdate
from app.routers.dependencies import get_current_user, check_facility_permission
from app.models.user import User as UserModel
from app.models.user_facility_permission import PermissionType

router = APIRouter(
    prefix="/sensors",
    tags=["sensors"]
)


@router.get("/", response_model=list[Sensor])
async def read_sensors(
    skip: int = 0,
    limit: int = 100,
    facility_id: str = None,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if facility_id:
        await check_facility_permission(facility_id, PermissionType.View, current_user, db)
        sensors = sensor.get_by_facility_id(db, facility_id, skip=skip, limit=limit)
    else:
        sensors = sensor.get_multi(db, skip=skip, limit=limit)
    return sensors


@router.get("/{sensor_id}", response_model=Sensor)
async def read_sensor(
    sensor_id: str,
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
    
    return db_sensor


@router.put("/{sensor_id}", response_model=Sensor)
async def update_sensor(
    sensor_id: str,
    sensor_update: SensorUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    db_sensor = sensor.get_by_id(db, sensor_id)
    if db_sensor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor not found"
        )
    
    await check_facility_permission(db_sensor.facility_id, PermissionType.Modify, current_user, db)
    
    return sensor.update(db, db_sensor, sensor_update)

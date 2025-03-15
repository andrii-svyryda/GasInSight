from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from app.database import get_db
from app.cruds.sensor import sensor_crud
from app.schemas.sensor_record import SensorRecord
from app.routers.dependencies import get_current_user, check_facility_permission
from app.models.user import User as UserModel
from app.models.user_facility_permission import PermissionType
from app.services.metrics.sensor_data import get_sensor_records_with_interpolation

router = APIRouter(
    prefix="/sensor-records",
    tags=["sensor-records"],
)

@router.get("/{sensor_id}", response_model=list[SensorRecord])
async def read_sensor_records(
    sensor_id: str,
    start_date: datetime,
    end_date: datetime | None = Query(default=None),
    freq: str = Query("15T"),
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    db_sensor = await sensor_crud.get(db, sensor_id)
    if db_sensor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor not found",
        )
    
    await check_facility_permission(db_sensor.facility_id, PermissionType.View, current_user, db)
    
    return await get_sensor_records_with_interpolation(
        db, 
        sensor_id=sensor_id,
        start_date=start_date, 
        end_date=end_date, 
        request_freq=freq,
        expected_freq=db_sensor.expected_freq
    )

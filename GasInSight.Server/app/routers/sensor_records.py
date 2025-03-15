from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from app.database import get_db
from app.cruds.sensor import sensor_crud
from app.cruds.sensor_record import sensor_record_crud
from app.schemas.sensor_record import SensorRecord
from app.routers.dependencies import get_current_user, check_facility_permission
from app.models.user import User as UserModel
from app.models.user_facility_permission import PermissionType
import pandas as pd

router = APIRouter(
    prefix="/sensor-records",
    tags=["sensor-records"],
)

@router.get("/{sensor_id}", response_model=list[SensorRecord])
async def read_sensor_records(
    sensor_id: str,
    start_date: datetime,
    end_date: datetime | None = Query(default=None),
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
    
    records = await sensor_record_crud.get_by_sensor_id_and_date_range(
        db, sensor_id, start_date, end_date
    )
    
    current_time = datetime.now()
    actual_end_date = end_date if end_date is not None else current_time
    
    if start_date > actual_end_date or not records:
        return []
    
    records_data = []
    for record in records:
        records_data.append({
            "tracked_at": record.tracked_at,
            "data": record.data
        })
    
    df = pd.DataFrame(records_data)
    df["tracked_at"] = pd.to_datetime(df["tracked_at"])
    df = df.set_index("tracked_at")
    
    date_range = pd.date_range(
        start=start_date.replace(microsecond=0),
        end=actual_end_date.replace(microsecond=0),
        freq="15T"
    )

    result_df = df.reindex(date_range, method="pad")
    
    result = []
    for idx, row in result_df.iterrows():
        result.append(SensorRecord(
            sensor_id=sensor_id,
            tracked_at=idx.to_pydatetime(),
            data=str(row["data"]) if row["data"] else None
        ))
    
    return result

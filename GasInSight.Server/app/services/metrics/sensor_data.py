from datetime import datetime

from pandas._libs import NaTType
from app.schemas.sensor_record import SensorRecord
from app.cruds.sensor_record import sensor_record_crud
from sqlalchemy.ext.asyncio import AsyncSession
import pandas as pd


async def get_sensor_records_with_interpolation(
    db: AsyncSession,
    sensor_id: str,
    start_date: datetime,
    request_freq: str,
    expected_freq: str,
    end_date: datetime | None = None
) -> list[SensorRecord]:
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

    pd_request_freq = pd.Timedelta(request_freq)
    pd_expected_freq = pd.Timedelta(expected_freq)

    if isinstance(pd_request_freq, NaTType) or isinstance(pd_expected_freq, NaTType):
        return []

    df = pd.DataFrame(records_data)
    df["tracked_at"] = pd.to_datetime(df["tracked_at"])
    df = df.set_index("tracked_at")
    
    date_range = pd.date_range(
        start=start_date.replace(microsecond=0),
        end=actual_end_date.replace(microsecond=0),
        freq=pd_request_freq if pd_request_freq > pd_expected_freq else pd_request_freq
    )

    existing_data_date_range = pd.date_range(
        start=df.index.min(),
        end=df.index.max(),
        freq=pd_expected_freq
    )

    reindexed_df = df.reindex(existing_data_date_range, method="nearest", limit=1)

    if pd_request_freq < pd_expected_freq:
        reindexed_df = reindexed_df.resample(request_freq).mean()

    merged_df = pd.DataFrame(index=date_range).join(reindexed_df).rename(columns={"index": "tracked_at"})
    
    result: list[SensorRecord] = []

    for idx, row in merged_df.iterrows():
        data = str(row.get("data"))
        
        if data == "nan":
            data = None

        result.append(SensorRecord(
            sensor_id=sensor_id,
            tracked_at=idx.to_pydatetime(),
            data=data
        ))
    
    return result

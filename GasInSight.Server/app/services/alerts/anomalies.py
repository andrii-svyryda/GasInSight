from app.models.sensor import SensorType
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import SessionLocal
from app.cruds.sensor import sensor_crud
from app.cruds.sensor_record import sensor_record_crud
from app.cruds.alert import alert_crud
from app.models.alert import AlertType
from app.schemas.alert import AlertCreate
from app.websockets.notification_manager import notification_manager
import logging


def get_sensor_valid_range(sensor_type: SensorType) -> tuple[float, float]:
    match sensor_type:
        case SensorType.Temperature: 
            return 20.0, 25.0
        case SensorType.Humidity: 
            return 40.0, 60.0
        case SensorType.Pressure: 
            return 1013.0, 1015.0
        case SensorType.Flow: 
            return 200.0, 300.0
        case SensorType.Volume: 
            return 400.0, 600.0
        case SensorType.GasComposition: 
            return 95.0, 98.0
        case SensorType.LiquidComposition: 
            return 95.0, 98.0
        case SensorType.Vibration: 
            return 2.0, 5.0
        case SensorType.Noise: 
            return 60.0, 80.0
        case SensorType.Corrosion: 
            return 2.0, 4.0
        case SensorType.GasDetection: 
            return 10.0, 20.0
        case SensorType.LevelIndicator: 
            return 4.0, 6.0
        case SensorType.PowerConsumption: 
            return 400.0, 600.0
        case SensorType.WaterContent: 
            return 0.5, 2.0
        case SensorType.OxygenContent: 
            return 19.5, 20.5
        case SensorType.HydrogenSulfideContent: 
            return 1.0, 5.0
        case SensorType.CarbonDioxideContent: 
            return 350.0, 1000.0
        case SensorType.ParticulateMatter: 
            return 50.0, 150.0
        case _: 
            return 0.0, 0.0


async def check_sensor_anomalies(db: AsyncSession, sensor_id: str, facility_id: str, sensor_type: SensorType):
    min_value, max_value = get_sensor_valid_range(sensor_type)

    recent_alerts = await alert_crud.get_recent_by_sensor_id(db, sensor_id, minutes=60)
    if recent_alerts:
        return
    
    recent_records = await sensor_record_crud.get_recent_by_sensor_id(db, sensor_id)
    if not recent_records:
        return
    
    try:
        values = [float(record.data) for record in recent_records]

        if not values:
            return

        if any(value < min_value for value in values):
            alert_message = f"Problem detected: {sensor_type.value} is below minimum threshold ({min_value})"
        elif any(value > max_value for value in values):
            alert_message = f"Problem detected: {sensor_type.value} is above maximum threshold ({max_value})"
        else:
            return
        
        alert_create = AlertCreate(
            sensor_id=sensor_id,
            type=AlertType.Anomaly,
            message=alert_message
        )
        
        new_alert = await alert_crud.create(db, alert_create)
        
        await notification_manager.broadcast_facility_notification(
            facility_id,
            {
                "type": "alert",
                "alert_id": new_alert.id,
                "sensor_id": sensor_id,
                "facility_id": facility_id,
                "message": alert_message,
                "created_at": new_alert.created_at.isoformat(),
                "alert_type": AlertType.Anomaly.value
            }
        )
        
        logging.info(f"Created anomaly alert for sensor {sensor_id}: {alert_message}")
    except (ValueError, TypeError) as e:
        logging.exception(e)
        logging.error(f"Error checking anomalies for sensor {sensor_id}: {str(e)}")


async def check_all_sensors_for_anomalies():
    async with SessionLocal() as db:
        sensors = await sensor_crud.get_all_active(db)

        sensors_data = [(sensor.id, sensor.facility_id, sensor.type) for sensor in sensors]
        
        for sensor_id, facility_id, sensor_type in sensors_data:
            await check_sensor_anomalies(db, sensor_id, facility_id, sensor_type)


async def run_anomaly_detection_service():
    while True:
        try:
            await check_all_sensors_for_anomalies()
        except Exception as e:
            logging.exception(e)
        
        await asyncio.sleep(5 * 60)


def start_anomaly_detection_service():
    asyncio.create_task(run_anomaly_detection_service())

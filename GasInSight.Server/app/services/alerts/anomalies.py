from app.models.sensor import SensorType


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



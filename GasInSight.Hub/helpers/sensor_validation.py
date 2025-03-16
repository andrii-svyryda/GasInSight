from constants.sensor_types import SensorTypes
from typing import Tuple


def get_sensor_valid_label(sensor_type: SensorTypes) -> str:
    match sensor_type:
        case SensorTypes.Temperature:
            return "20-25°C (normal temperature range)"
        case SensorTypes.Humidity:
            return "40-60% (comfortable range)"
        case SensorTypes.Pressure:
            return "1013-1015 hPa (normal atmospheric pressure)"
        case SensorTypes.Flow:
            return "200-300 m³/h (typical gas flow rate)"
        case SensorTypes.Volume:
            return "400-600 m³ (standard tank capacity)"
        case SensorTypes.GasComposition:
            return "95-98% (high purity range)"
        case SensorTypes.LiquidComposition:
            return "95-98% (high purity range)"
        case SensorTypes.Vibration:
            return "2-5 mm/s (acceptable machinery vibration)"
        case SensorTypes.Noise:
            return "60-80 dB (normal industrial noise level)"
        case SensorTypes.Corrosion:
            return "2-4 mm/year (acceptable corrosion rate)"
        case SensorTypes.GasDetection:
            return "10-20 ppm (safe gas concentration)"
        case SensorTypes.LevelIndicator:
            return "4-6 m (typical tank level)"
        case SensorTypes.PowerConsumption:
            return "400-600 kW (normal operating range)"
        case SensorTypes.WaterContent:
            return "0.5-2.0% (acceptable water content)"
        case SensorTypes.OxygenContent:
            return "19.5-20.5% (normal air composition)"
        case SensorTypes.HydrogenSulfideContent:
            return "1-5 ppm (safe H2S level)"
        case SensorTypes.CarbonDioxideContent:
            return "350-1000 ppm (normal CO2 range)"
        case SensorTypes.ParticulateMatter:
            return "50-150 µg/m³ (acceptable air quality)"
        case _:
            return "Unknown"


def get_sensor_valid_range(sensor_type: SensorTypes) -> Tuple[float, float]:
    match sensor_type:
        case SensorTypes.Temperature:
            return 20.0, 25.0
        case SensorTypes.Humidity:
            return 40.0, 60.0
        case SensorTypes.Pressure:
            return 1013.0, 1015.0
        case SensorTypes.Flow:
            return 200.0, 300.0
        case SensorTypes.Volume:
            return 400.0, 600.0
        case SensorTypes.GasComposition:
            return 95.0, 98.0
        case SensorTypes.LiquidComposition:
            return 95.0, 98.0
        case SensorTypes.Vibration:
            return 2.0, 5.0
        case SensorTypes.Noise:
            return 60.0, 80.0
        case SensorTypes.Corrosion:
            return 2.0, 4.0
        case SensorTypes.GasDetection:
            return 10.0, 20.0
        case SensorTypes.LevelIndicator:
            return 4.0, 6.0
        case SensorTypes.PowerConsumption:
            return 400.0, 600.0
        case SensorTypes.WaterContent:
            return 0.5, 2.0
        case SensorTypes.OxygenContent:
            return 19.5, 20.5
        case SensorTypes.HydrogenSulfideContent:
            return 1.0, 5.0
        case SensorTypes.CarbonDioxideContent:
            return 350.0, 1000.0
        case SensorTypes.ParticulateMatter:
            return 50.0, 150.0
        case _:
            return 0.0, 0.0


def get_sensor_measurements(sensor_type: SensorTypes) -> str:
    match sensor_type:
        case SensorTypes.Temperature:
            return "°C"
        case SensorTypes.Humidity:
            return "%"
        case SensorTypes.Pressure:
            return "hPa"
        case SensorTypes.Flow:
            return "m³/h"
        case SensorTypes.Volume:
            return "m³"
        case SensorTypes.GasComposition:
            return "%"
        case SensorTypes.LiquidComposition:
            return "%"
        case SensorTypes.Vibration:
            return "mm/s"
        case SensorTypes.Noise:
            return "dB"
        case SensorTypes.Corrosion:
            return "mm/year"
        case SensorTypes.GasDetection:
            return "ppm"
        case SensorTypes.LevelIndicator:
            return "m"
        case SensorTypes.PowerConsumption:
            return "kW"
        case SensorTypes.WaterContent:
            return "%"
        case SensorTypes.OxygenContent:
            return "%"
        case SensorTypes.HydrogenSulfideContent:
            return "ppm"
        case SensorTypes.CarbonDioxideContent:
            return "ppm"
        case SensorTypes.ParticulateMatter:
            return "µg/m³"
        case _:
            return "Unknown"


def get_sensor_signal_interval(sensor_type: SensorTypes) -> int:
    match sensor_type:
        case SensorTypes.Temperature:
            return 15
        case SensorTypes.Humidity:
            return 300
        case SensorTypes.Pressure:
            return 20
        case SensorTypes.Flow:
            return 300
        case SensorTypes.Volume:
            return 40
        case SensorTypes.GasComposition:
            return 120
        case SensorTypes.LiquidComposition:
            return 300
        case SensorTypes.Vibration:
            return 45
        case SensorTypes.Noise:
            return 120
        case SensorTypes.Corrosion:
            return 40
        case SensorTypes.GasDetection:
            return 15
        case SensorTypes.LevelIndicator:
            return 300
        case SensorTypes.PowerConsumption:
            return 100
        case SensorTypes.WaterContent:
            return 25
        case SensorTypes.OxygenContent:
            return 35
        case SensorTypes.HydrogenSulfideContent:
            return 300
        case SensorTypes.CarbonDioxideContent:
            return 60
        case SensorTypes.ParticulateMatter:
            return 700
        case _:
            return 1000
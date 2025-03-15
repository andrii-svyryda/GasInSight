from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from constants.sensor_types import SensorTypes
import random

sensor_values_mapping = {
    SensorTypes.Temperature: lambda: f"{random.uniform(-20, 50):.2f}",
    SensorTypes.Humidity: lambda: f"{random.uniform(0, 100):.2f}",
    SensorTypes.Pressure: lambda: f"{random.uniform(950, 1050):.2f}",
    SensorTypes.Flow: lambda: f"{random.uniform(0, 500):.2f}",
    SensorTypes.Volume: lambda: f"{random.uniform(0, 1000):.2f}",
    SensorTypes.GasComposition: lambda: f"{random.uniform(0, 100):.2f}",
    SensorTypes.LiquidComposition: lambda: f"{random.uniform(0, 100):.2f}",
    SensorTypes.Vibration: lambda: f"{random.uniform(0, 20):.2f}",
    SensorTypes.Noise: lambda: f"{random.uniform(30, 130):.2f}",
    SensorTypes.Corrosion: lambda: f"{random.uniform(0, 10):.2f}",
    SensorTypes.GasDetection: lambda: f"{random.uniform(0, 100):.2f}",
    SensorTypes.FlameDetection: lambda: random.choice(["Detected", "NotDetected"]),
    SensorTypes.LevelIndicator: lambda: f"{random.uniform(0, 10):.2f}",
    SensorTypes.ValveStatus: lambda: random.choice(["Open", "Closed"]),
    SensorTypes.PumpStatus: lambda: random.choice(["Running", "Stopped"]),
    SensorTypes.CompressorStatus: lambda: random.choice(["Operational", "Fault"]),
    SensorTypes.PowerConsumption: lambda: f"{random.uniform(0, 1000):.2f}",
    SensorTypes.WaterContent: lambda: f"{random.uniform(0, 100):.2f}",
    SensorTypes.OxygenContent: lambda: f"{random.uniform(0, 21):.2f}",
    SensorTypes.HydrogenSulfideContent: lambda: f"{random.uniform(0, 100):.2f}",
    SensorTypes.CarbonDioxideContent: lambda: f"{random.uniform(0, 5000):.2f}",
    SensorTypes.ParticulateMatter: lambda: f"{random.uniform(0, 500):.2f}",
    SensorTypes.LeakDetection: lambda: random.choice(["Leak", "NoLeak"])
}

sensor_intervals_mapping = {
    SensorTypes.Temperature: lambda: 30,
    SensorTypes.Humidity: lambda: 30,
    SensorTypes.Pressure: lambda: 30,
    SensorTypes.Flow: lambda: 30,
    SensorTypes.Volume: lambda: 30,
    SensorTypes.GasComposition: lambda: 30,
    SensorTypes.LiquidComposition: lambda: 40,
    SensorTypes.Vibration: lambda: 60,
    SensorTypes.Noise: lambda: 60,
    SensorTypes.Corrosion: lambda: 60,
    SensorTypes.GasDetection: lambda: 60,
    SensorTypes.FlameDetection: lambda: 10000,
    SensorTypes.LevelIndicator: lambda: 120,
    SensorTypes.ValveStatus: lambda: 10000,
    SensorTypes.PumpStatus: lambda: 10000,
    SensorTypes.CompressorStatus: lambda: 10000,
    SensorTypes.PowerConsumption: lambda: 20,
    SensorTypes.WaterContent: lambda: 120,
    SensorTypes.OxygenContent: lambda: 120,
    SensorTypes.HydrogenSulfideContent: lambda: 120,
    SensorTypes.CarbonDioxideContent: lambda: 120,
    SensorTypes.ParticulateMatter: lambda: 120,
    SensorTypes.LeakDetection: lambda: 10000
}

class Sensor(BaseModel):
    sensor_id: UUID
    address: str
    longitude: float
    latitude: float
    sensor_type: SensorTypes
    data: str | None = None
    last_updated: datetime | None = None

    def get_sensor_data(self) -> str:
        self.data = sensor_values_mapping.get(self.sensor_type, lambda: "Unknown")()
        self.last_updated = datetime.now()
        return self.data

    def is_new_data_available(self) -> bool:
        if self.last_updated is None:
            self.last_updated = datetime.now()

        sensor_interval = sensor_intervals_mapping.get(self.sensor_type, lambda: 60)()
        return (datetime.now() - self.last_updated).total_seconds() > sensor_interval
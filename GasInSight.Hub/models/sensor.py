from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from constants.sensor_types import SensorTypes
from helpers.sensor_validation import get_sensor_valid_range, get_sensor_measurements
from random import random, uniform


class Sensor(BaseModel):
    sensor_id: UUID
    address: str
    longitude: float
    latitude: float
    sensor_type: SensorTypes
    data: str
    last_signal_timestamp: datetime | None = None
    signal_interval: int

    def get_signal(self) -> str:
        self.data = self.generate_next_signal()
        self.last_signal_timestamp = datetime.now()
        print(f'Sensor signal: {self.sensor_type} -> {self.data} {get_sensor_measurements(self.sensor_type)}')
        return self.data

    def is_signal_available(self) -> bool:
        if self.last_signal_timestamp is None:
            self.last_signal_timestamp = datetime.now()

        return (datetime.now() - self.last_signal_timestamp).total_seconds() > self.signal_interval

    def generate_next_signal(self) -> str:
        min_val, max_val = get_sensor_valid_range(self.sensor_type)
        current_val = float(self.data) if self.data else (min_val + max_val) / 2
        
        # 2% chance of generating out-of-range value
        if random() < 0.02:
            # Generate value either below min or above max
            if random() < 0.5:
                # Below min: go down to 10% below the min
                new_val = uniform(min_val * 0.9, min_val)
            else:
                # Above max: go up to 10% above the max
                new_val = uniform(max_val, max_val * 1.1)
        else:
            # Normal case: value within range with some fluctuation
            change = (random() * 2 - 1) * ((max_val - min_val) * 0.1)  # Random change up to ±10% of range
            new_val = current_val + change
            new_val = max(min_val, min(new_val, max_val))
        
        return f"{new_val:.2f}"
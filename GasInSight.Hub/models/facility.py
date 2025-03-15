from uuid import UUID
from pydantic import BaseModel, Field
from constants.facility_types import FacilityTypes
from models.sensor import Sensor

class Facility(BaseModel):
    facility_id: UUID
    facility_name: str
    address: str
    longitude: float
    latitude: float
    facility_type: FacilityTypes
    sensors: list = Field(default_factory=list)

    def get_sensors(self) -> list:
        return self.sensors 

    def add_sensor(self, sensor: Sensor) -> None:
        self.sensors.append(sensor)

    def remove_sensor(self, sensor: Sensor) -> None:
        self.sensors.remove(sensor)

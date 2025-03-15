from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
import enum
from app.database import Base


class SensorType(enum.Enum):
    Temperature = "Temperature"
    Humidity = "Humidity"
    Pressure = "Pressure"
    Flow = "Flow"
    Volume = "Volume"
    GasComposition = "GasComposition"
    LiquidComposition = "LiquidComposition"
    Vibration = "Vibration"
    Noise = "Noise"
    Corrosion = "Corrosion"
    GasDetection = "GasDetection"
    FlameDetection = "FlameDetection"
    LevelIndicator = "LevelIndicator"
    ValveStatus = "ValveStatus"
    PumpStatus = "PumpStatus"
    CompressorStatus = "CompressorStatus"
    PowerConsumption = "PowerConsumption"
    WaterContent = "WaterContent"
    OxygenContent = "OxygenContent"
    HydrogenSulfideContent = "HydrogenSulfideContent"
    CarbonDioxideContent = "CarbonDioxideContent"
    ParticulateMatter = "ParticulateMatter"
    LeakDetection = "LeakDetection"


class SensorStatus(enum.Enum):
    Enabled = "Enabled"
    Disabled = "Disabled"
    Removed = "Removed"


class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    facility_id = Column(String, ForeignKey("facilities.id"))
    location_id = Column(Integer, ForeignKey("locations.id"))
    status = Column(Enum(SensorStatus))
    installed_at = Column(DateTime)
    type = Column(Enum(SensorType))

    facility = relationship("Facility", back_populates="sensors")
    location = relationship("Location", back_populates="sensors")
    records = relationship("SensorRecord", back_populates="sensor")

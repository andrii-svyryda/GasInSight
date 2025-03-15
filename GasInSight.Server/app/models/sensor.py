from sqlalchemy import String, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.sql import func
from datetime import datetime
from typing import TYPE_CHECKING
import enum
from app.database import Base

if TYPE_CHECKING:
    from app.models.location import Location


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
    Active = "Active"
    Inactive = "Inactive"
    Maintenance = "Maintenance"
    Fault = "Fault"


class Sensor(Base):
    __tablename__: str = "sensors"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String)
    facility_id: Mapped[str] = mapped_column(String, ForeignKey("facilities.id"))
    location_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("locations.id"), nullable=True)
    status: Mapped[SensorStatus] = mapped_column(Enum(SensorStatus))
    installed_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    type: Mapped[SensorType] = mapped_column(Enum(SensorType))

    location: Mapped["Location | None"] = relationship("Location")

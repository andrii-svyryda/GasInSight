from sqlalchemy import String, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.sql import func
from datetime import datetime
import enum
from typing import TYPE_CHECKING
from app.database import Base

if TYPE_CHECKING:
    from app.models.location import Location
    from app.models.sensor import Sensor


class FacilityType(enum.Enum):
    DrillingRig = "DrillingRig"
    Pipelines = "Pipelines"
    TankFarm = "TankFarm"
    UndergroundStorage = "UndergroundStorage"
    ProcessingPlant = "ProcessingPlant"
    ImportTerminal = "ImportTerminal"
    ExportTerminal = "ExportTerminal"


class Facility(Base):
    __tablename__: str = "facilities"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String)
    location_id: Mapped[int] = mapped_column(Integer, ForeignKey("locations.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    status: Mapped[str] = mapped_column(String)
    type: Mapped[FacilityType] = mapped_column(Enum(FacilityType))

    location: Mapped["Location"] = relationship("Location")
    sensors: Mapped[list["Sensor"]] = relationship("Sensor")

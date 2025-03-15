from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class FacilityType(enum.Enum):
    DrillingRig = "DrillingRig"
    Pipelines = "Pipelines"
    TankFarm = "TankFarm"
    UndergroundStorage = "UndergroundStorage"
    ProcessingPlant = "ProcessingPlant"
    ImportTerminal = "ImportTerminal"
    ExportTerminal = "ExportTerminal"


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    location_id = Column(Integer, ForeignKey("locations.id"))
    created_at = Column(DateTime, default=func.now())
    status = Column(String)
    type = Column(Enum(FacilityType))

    location = relationship("Location", back_populates="facilities")
    sensors = relationship("Sensor", back_populates="facility")
    permissions = relationship("UserFacilityPermission", back_populates="facility")

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class UserRole(enum.Enum):
    Admin = "Admin"
    User = "User"


class FacilityType(enum.Enum):
    DrillingRig = "DrillingRig"
    Pipelines = "Pipelines"
    TankFarm = "TankFarm"
    UndergroundStorage = "UndergroundStorage"
    ProcessingPlant = "ProcessingPlant"
    ImportTerminal = "ImportTerminal"
    ExportTerminal = "ExportTerminal"


class PermissionType(enum.Enum):
    View = "View"
    Modify = "Modify"


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


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=func.now())
    refresh_token = Column(String, nullable=True)
    last_login = Column(DateTime, nullable=True)
    role = Column(Enum(UserRole))

    permissions = relationship("UserFacilityPermission", back_populates="user")


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=True)
    longitude = Column(Float)
    latitude = Column(Float)

    facilities = relationship("Facility", back_populates="location")
    sensors = relationship("Sensor", back_populates="location")


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


class UserFacilityPermission(Base):
    __tablename__ = "user_facility_permissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    facility_id = Column(String, ForeignKey("facilities.id"))
    permission_type = Column(Enum(PermissionType))
    granted_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="permissions")
    facility = relationship("Facility", back_populates="permissions")


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


class SensorRecord(Base):
    __tablename__ = "sensor_records"

    sensor_id = Column(String, ForeignKey("sensors.id"), primary_key=True)
    tracked_at = Column(DateTime, primary_key=True)
    data = Column(Text)

    sensor = relationship("Sensor", back_populates="records")

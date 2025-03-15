from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.database import Base


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=True)
    longitude = Column(Float)
    latitude = Column(Float)

    facilities = relationship("Facility", back_populates="location")
    sensors = relationship("Sensor", back_populates="location")

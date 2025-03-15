from sqlalchemy import Column, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.database import Base


class SensorRecord(Base):
    __tablename__ = "sensor_records"

    sensor_id = Column(String, ForeignKey("sensors.id"), primary_key=True)
    tracked_at = Column(DateTime, primary_key=True)
    data = Column(Text)

    sensor = relationship("Sensor", back_populates="records")

from sqlalchemy import String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship, mapped_column, Mapped
from datetime import datetime
from typing import TYPE_CHECKING
from app.database import Base

if TYPE_CHECKING:
    from app.models.sensor import Sensor


class SensorRecord(Base):
    __tablename__: str = "sensor_records"

    sensor_id: Mapped[str] = mapped_column(String, ForeignKey("sensors.id"), primary_key=True)
    tracked_at: Mapped[datetime] = mapped_column(DateTime, primary_key=True)
    data: Mapped[str] = mapped_column(Text)

    sensor: Mapped["Sensor"] = relationship("Sensor")

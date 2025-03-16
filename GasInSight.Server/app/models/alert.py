from sqlalchemy import String, Integer, ForeignKey, DateTime, Enum, Boolean
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy.sql import func
from datetime import datetime
import enum
from app.database import Base


class AlertType(enum.Enum):
    Anomaly = "Anomaly"
    Maintenance = "Maintenance"
    System = "System"


class Alert(Base):
    __tablename__: str = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sensor_id: Mapped[str] = mapped_column(String, ForeignKey("sensors.id"))
    type: Mapped[AlertType] = mapped_column(Enum(AlertType))
    message: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)

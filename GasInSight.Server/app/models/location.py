from sqlalchemy import Integer, String, Float
from sqlalchemy.orm import mapped_column, Mapped
from typing import TYPE_CHECKING
from app.database import Base

if TYPE_CHECKING:
    pass


class Location(Base):
    __tablename__: str = "locations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    address: Mapped[str | None] = mapped_column(String, nullable=True)
    longitude: Mapped[float] = mapped_column(Float)
    latitude: Mapped[float] = mapped_column(Float)

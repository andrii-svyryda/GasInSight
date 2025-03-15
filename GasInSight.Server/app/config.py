from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./gasinisight.db"
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10
    REFRESH_TOKEN_EXPIRE_DAYS: int = 5
    SERVICEBUS_CONNECTION_STRING: Optional[str] = None
    FACILITY_SETUP_QUEUE: str = "facility-setup"
    SENSOR_ACTIVATION_QUEUE: str = "sensor-activation"
    SENSOR_DATA_QUEUE: str = "sensor-data"
    SENSOR_DEACTIVATION_QUEUE: str = "sensor-deactivation"

    class Config:
        env_file = ".env"


settings = Settings()

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./gasinisight.db"
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 300
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    SERVICEBUS_CONNECTION_STRING: str | None = None
    FACILITY_SETUP_QUEUE: str = "facility-setup-queue"
    SENSOR_ACTIVATION_QUEUE: str = "sensor-activation-queue"
    SENSOR_DATA_QUEUE: str = "sensor-data-queue"
    SENSOR_DEACTIVATION_QUEUE: str = "sensor-deactivation-queue"

    class Config:
        env_file: str = ".env"


settings = Settings()

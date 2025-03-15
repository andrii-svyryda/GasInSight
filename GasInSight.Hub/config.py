from os import environ
from dotenv import load_dotenv

class Config:
    SERVICE_BUS_CONNECTION_STRING: str
    HUB_ACTIVITY_INTERVAL: int

    def __init__(self) -> None:
        load_dotenv()
        self.SERVICE_BUS_CONNECTION_STRING = environ.get("SERVICE_BUS_CONNECTION_STRING", "")
        self.HUB_ACTIVITY_INTERVAL = int(environ.get("HUB_ACTIVITY_INTERVAL", 30))

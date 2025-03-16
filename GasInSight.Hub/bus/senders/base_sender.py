from azure.servicebus.aio import ServiceBusClient
from config import Config

class BaseSender:
    def __init__(self, config: Config, service_bus_client: ServiceBusClient = None) -> None:
        self.config = config
        self.service_bus_client = service_bus_client or ServiceBusClient.from_connection_string(
            conn_str=self.config.SERVICE_BUS_CONNECTION_STRING,
            logging_enable=False
        )
        self.queue_name = self._get_queue_name()

    def _get_queue_name(self) -> str:
        return ""

    async def send(self, message) -> None:
        sender = self.service_bus_client.get_queue_sender(queue_name=self.queue_name)
        await sender.send_messages(message)

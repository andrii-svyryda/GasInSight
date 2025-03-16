from azure.servicebus import ServiceBusMessage
from config import Config
from bus.senders.base_sender import BaseSender
from constants.queue_names import QueueNames

class SensorDataSender(BaseSender):
    def _get_queue_name(self) -> str:
        return QueueNames.SENSOR_DATA

    async def send(self, message) -> None:
        msg = ServiceBusMessage(message.model_dump_json())
        await super().send(msg)

    async def send_batch(self, messages) -> None:
        if not messages:
            return
            
        service_bus_messages = [ServiceBusMessage(message.model_dump_json()) for message in messages]
        await self.sender.send_messages(service_bus_messages)

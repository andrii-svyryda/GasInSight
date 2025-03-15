from azure.servicebus import ServiceBusMessage
from config import Config
from bus.senders.base_sender import BaseSender
from constants.queue_names import QueueNames

class SensorDeactivationSender(BaseSender):
    def _get_queue_name(self) -> str:
        return QueueNames.SENSOR_DEACTIVATION

    async def send(self, message) -> None:
        msg = ServiceBusMessage(message.model_dump_json())
        await super().send(msg)

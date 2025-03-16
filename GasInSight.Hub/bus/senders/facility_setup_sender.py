from azure.servicebus import ServiceBusMessage
from config import Config
from bus.senders.base_sender import BaseSender
from constants.queue_names import QueueNames
from bus.messages.facility_setup import FacilitySetupMsg

class FacilitySetupSender(BaseSender):
    def _get_queue_name(self) -> str:
        return QueueNames.FACILITY_SETUP

    async def send(self, message: FacilitySetupMsg) -> None:
        msg = ServiceBusMessage(message.model_dump_json())
        await super().send(msg)

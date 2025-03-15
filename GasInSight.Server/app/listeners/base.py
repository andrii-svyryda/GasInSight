from collections.abc import Awaitable
from azure.servicebus.aio import ServiceBusClient
from azure.servicebus.exceptions import ServiceBusError
from app.config import settings
import json
import asyncio
from typing import Callable, Any


class ServiceBusListener:
    def __init__(self, queue_name: str, message_handler: Callable[[dict[str, Any]], Awaitable[None]]):
        self.queue_name = queue_name
        self.message_handler = message_handler
        self.servicebus_client = None
        self.receiver = None
        self.is_running = False

    def start(self):
        if not settings.SERVICEBUS_CONNECTION_STRING:
            return

        self.is_running = True
        self.servicebus_client = ServiceBusClient.from_connection_string(
            conn_str=settings.SERVICEBUS_CONNECTION_STRING
        )
        self.receiver = self.servicebus_client.get_queue_receiver(
            queue_name=self.queue_name
        )
        
        asyncio.create_task(self._receive_messages())

    async def _receive_messages(self):
        if not self.receiver:
            return
        while self.is_running:
            try:
                messages = await self.receiver.receive_messages(max_message_count=10, max_wait_time=5)
                for message in messages:
                    try:
                        message_body: dict[str, Any] = json.loads(str(message))
                        await self.message_handler(message_body)
                        await message.complete()
                    except Exception:
                        await message.abandon()
            except ServiceBusError:
                await asyncio.sleep(5)
            except Exception:
                await asyncio.sleep(5)

    async def stop(self):
        self.is_running = False
        if self.receiver:
            await self.receiver.close()
        if self.servicebus_client:
            await self.servicebus_client.close()

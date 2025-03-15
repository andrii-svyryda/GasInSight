from azure.servicebus.management import ServiceBusAdministrationClient
from app.config import settings
import logging


async def create_queue_if_not_exists(queue_name: str) -> bool:
    if not settings.SERVICEBUS_CONNECTION_STRING:
        return False
    
    try:
        admin_client = ServiceBusAdministrationClient.from_connection_string(
            conn_str=settings.SERVICEBUS_CONNECTION_STRING
        )
        
        try:
            admin_client.get_queue_runtime_properties(queue_name)
            return True
        except Exception:
            admin_client.create_queue(queue_name)
            return True
    except Exception as e:
        logging.error(f"Error creating queue {queue_name}: {str(e)}")
        return False


async def setup_queues() -> dict[str, bool]:
    queues = [
        settings.FACILITY_SETUP_QUEUE,
        settings.SENSOR_ACTIVATION_QUEUE,
        settings.SENSOR_DATA_QUEUE,
        settings.SENSOR_DEACTIVATION_QUEUE
    ]
    
    results: dict[str, bool] = {}
    for queue in queues:
        results[queue] = await create_queue_if_not_exists(queue)
    
    return results

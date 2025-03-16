import asyncio
import json
from uuid import UUID
from bus.msg_helpers import send_facility_setup, send_sensor_data
from config import Config
from bus.senders.facility_setup_sender import FacilitySetupSender
from bus.senders.sensor_activation_sender import SensorActivationSender
from bus.senders.sensor_data_sender import SensorDataSender
from bus.senders.sensor_deactivation_sender import SensorDeactivationSender
from models.facility import Facility
from models.sensor import Sensor
from azure.servicebus.aio import ServiceBusClient
from bus.msg_helpers import send_sensor_activation, send_sensor_deactivation

def load_facilities(file_path: str) -> list:
    with open(file_path, 'r') as f:
        facilities_data = json.load(f)

    facilities = []
    for facility_data in facilities_data:
        facility_data['facility_id'] = UUID(facility_data['facility_id'])
        sensors = facility_data.pop('sensors', [])
        
        facility = Facility(**facility_data)
        
        for sensor_data in sensors:
            sensor_data['sensor_id'] = UUID(sensor_data['sensor_id'])
            sensor = Sensor(**sensor_data)
            facility.add_sensor(sensor)
        
        facilities.append(facility)
    
    return facilities

async def start_hub(config: Config) -> None:
    # Load the facilities from the JSON file.
    # This is a mock implementation and should be replaced with actual data loading.
    facilities = load_facilities('facilities.json')

    # Initialize the service bus client and typed senders.
    service_bus_client = ServiceBusClient.from_connection_string(
        conn_str=config.SERVICE_BUS_CONNECTION_STRING,
        logging_enable=False
    )
    facility_setup_sender = FacilitySetupSender(config, service_bus_client)
    sensor_activation_sender = SensorActivationSender(config, service_bus_client)
    sensor_data_sender = SensorDataSender(config, service_bus_client)
    sensor_deactivation_sender = SensorDeactivationSender(config, service_bus_client)

    # Setup the facilities.
    for facility in facilities:
        print(f'Setup of facility: {facility.facility_name}')
        await send_facility_setup(facility_setup_sender, facility)
    
    # Wait for 15 seconds to simulate setup completion.
    await asyncio.sleep(15)

    # Setup the sensors.
    for facility in facilities:
        for sensor in facility.get_sensors():
            print(f'Setup of sensor: {sensor.address} {sensor.sensor_type}')
            await send_sensor_activation(sensor_activation_sender, facility, sensor)

    # Wait for 15 seconds to simulate setup completion.
    await asyncio.sleep(15)

    # Emulate sensors activity.
    while True:
        try:
            for facility in facilities:
                for sensor in facility.get_sensors():
                    if sensor.is_signal_available():
                        data = sensor.get_signal()
                        await send_sensor_data(sensor_data_sender, facility, sensor, data)
        except Exception as e:
            print(f'Error in sensor data simulation: {str(e)}')
                    
        await asyncio.sleep(config.HUB_ACTIVITY_INTERVAL)


def main() -> None:
    config = Config()
    asyncio.run(start_hub(config))

if __name__ == "__main__":
    main()

import asyncio
import json
from uuid import UUID
from config import Config
from bus.senders.facility_setup_sender import FacilitySetupSender
from bus.senders.sensor_activation_sender import SensorActivationSender
from bus.senders.sensor_data_sender import SensorDataSender
from bus.senders.sensor_deactivation_sender import SensorDeactivationSender
from models.facility import Facility
from models.sensor import Sensor
from azure.servicebus import ServiceBusClient

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

facilities = []

async def start_hub(config: Config) -> None:
    # Load the facilities from the JSON file.
    # This is a mock implementation and should be replaced with actual data loading.
    facilities = load_facilities('facilities.json')

    # Initialize the service bus client and typed senders.
    # service_bus_client = ServiceBusClient.from_connection_string(
    #     conn_str=config.SERVICE_BUS_CONNECTION_STRING,
    #     logging_enable=False
    # )
    # facility_setup_sender = FacilitySetupSender(config, service_bus_client)
    # sensor_activation_sender = SensorActivationSender(config, service_bus_client)
    # sensor_data_sender = SensorDataSender(config, service_bus_client)
    # sensor_deactivation_sender = SensorDeactivationSender(config, service_bus_client)

    # Setup the facilities and sensors.
    for facility in facilities:
        #await send_facility_setup(facility_setup_sender, facility)
        print(f'Facility: {facility.facility_name}')
        for sensor in facility.get_sensors():
            #await send_sensor_activation(sensor_activation_sender, facility, sensor)
            print(f'Sensor: {sensor.address} {sensor.sensor_type}')

    # Emulate sensors activity.
    while True:
        for facility in facilities:
            for sensor in facility.get_sensors():
                if sensor.is_new_data_available():
                    data = sensor.get_sensor_data()
                    print(f'{facility.facility_name}: {sensor.sensor_type} -> {data}')

        print('-----------------------------------')
        await asyncio.sleep(config.HUB_ACTIVITY_INTERVAL)


def main() -> None:
    config = Config()
    asyncio.run(start_hub(config))

if __name__ == "__main__":
    main()

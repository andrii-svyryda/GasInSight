from config import Config
from bus.messages.facility_setup import FacilitySetupMsg
from bus.messages.sensor_activation import SensorActivationMsg
from bus.messages.sensor_data import SensorDataMsg
from bus.messages.sensor_deactivation import SensorDeactivationMsg
from bus.senders.facility_setup_sender import FacilitySetupSender
from bus.senders.sensor_activation_sender import SensorActivationSender
from bus.senders.sensor_data_sender import SensorDataSender
from bus.senders.sensor_deactivation_sender import SensorDeactivationSender
from models.facility import Facility
from models.sensor import Sensor

async def send_facility_setup(facility_setup_sender: FacilitySetupSender, facility: Facility) -> None:
    msg = FacilitySetupMsg(
        facility_id=facility.facility_id,
        facility_name=facility.facility_name,
        address=facility.address,
        longitude=facility.longitude,
        latitude=facility.latitude,
        facility_type=facility.facility_type
    )
    await facility_setup_sender.send(msg)

async def send_sensor_activation(sensor_activation_sender: SensorActivationSender, facility: Facility, sensor: Sensor) -> None:
    msg = SensorActivationMsg(
        sensor_id=sensor.sensor_id,
        facility_id=facility.facility_id,
        address=sensor.address,
        longitude=sensor.longitude,
        latitude=sensor.latitude,
        sensor_type=sensor.sensor_type
    )
    await sensor_activation_sender.send(msg)

async def send_sensor_data(sensor_data_sender: SensorDataSender, facility: Facility, sensor: Sensor) -> None:
    msg = SensorDataMsg(
        sensor_id=sensor.sensor_id,
        facility_id=facility.facility_id,
        data=sensor.get_sensor_data()
    )
    await sensor_data_sender.send(msg)

async def send_sensor_deactivation(sensor_deactivation_sender: SensorDeactivationSender, facility: Facility, sensor: Sensor) -> None:
    msg = SensorDeactivationMsg(
        sensor_id=sensor.sensor_id,
        facility_id=facility.facility_id
    )
    await sensor_deactivation_sender.send(msg)

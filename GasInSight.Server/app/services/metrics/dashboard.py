from app.models.facility import Facility, FacilityType
from app.models.sensor import Sensor, SensorStatus, SensorType
from app.schemas.dashboard import DashboardMetrics, DashboardChartData, StatusMetric, TypeMetric, DashboardData
from sqlalchemy.ext.asyncio import AsyncSession
from app.cruds.dashboard import dashboard_crud
import re


async def get_facility_dashboard_data(db: AsyncSession, facility_id: str | None = None, user_id: int | None = None) -> DashboardData:
    facilities = await dashboard_crud.get_facilities(db, user_id=user_id, facility_id=facility_id)
    sensors = await dashboard_crud.get_sensors(db, user_id=user_id, facility_id=facility_id)
    
    metrics = await calculate_dashboard_metrics(facilities, sensors)
    chart_data = await calculate_dashboard_chart_data(facilities, sensors)
    
    return DashboardData(
        metrics=metrics,
        chart_data=chart_data
    )


async def calculate_dashboard_metrics(facilities: list[Facility], sensors: list[Sensor]) -> DashboardMetrics:
    active_count = sum(1 for f in facilities if f.status == "Active")
    maintenance_count = sum(1 for f in facilities if f.status == "Maintenance")
    offline_count = sum(1 for f in facilities if f.status == "Offline")
    unique_types = len(set(f.type for f in facilities))
    
    total_sensors = len(sensors)
    active_sensors = sum(1 for s in sensors if s.status == SensorStatus.Active)
    inactive_sensors = total_sensors - active_sensors
    avg_sensors_per_facility = total_sensors / len(facilities) if facilities else 0
    
    return DashboardMetrics(
        total_facilities=len(facilities),
        active_facilities=active_count,
        maintenance_facilities=maintenance_count,
        offline_facilities=offline_count,
        facility_types=unique_types,
        total_sensors=total_sensors,
        active_sensors=active_sensors,
        inactive_sensors=inactive_sensors,
        avg_sensors_per_facility=round(avg_sensors_per_facility, 2)
    )


async def calculate_dashboard_chart_data(facilities: list[Facility], sensors: list[Sensor]) -> DashboardChartData:
    status_counts = {
        "Active": 0,
        "Maintenance": 0,
        "Offline": 0
    }
    
    type_counts: dict[str, int] = {}
    
    for facility in facilities:
        if facility.status in status_counts:
            status_counts[facility.status] += 1
        
        facility_type = facility.type.value
        type_counts[facility_type] = type_counts.get(facility_type, 0) + 1
    
    status_colors = {
        "Active": "#4caf50",
        "Maintenance": "#ff9800",
        "Offline": "#f44336"
    }
    
    type_colors = {
        FacilityType.DrillingRig.value: "#1976d2",
        FacilityType.Pipelines.value: "#9c27b0",
        FacilityType.TankFarm.value: "#2196f3",
        FacilityType.UndergroundStorage.value: "#00bcd4",
        FacilityType.ProcessingPlant.value: "#009688",
        FacilityType.ImportTerminal.value: "#8bc34a",
        FacilityType.ExportTerminal.value: "#cddc39"
    }
    
    status_data = [
        StatusMetric(name=status, value=count, color=status_colors.get(status, "#757575"))
        for status, count in status_counts.items()
    ]
    
    type_data = [
        TypeMetric(
            name=re.sub(r'([A-Z])', r' \1', str(type_name)).strip(),
            value=count,
            color=type_colors.get(str(type_name), "#757575")
        )
        for type_name, count in type_counts.items()
    ]
    
    sensor_status_counts = {
        SensorStatus.Active.value: 0,
        SensorStatus.Inactive.value: 0,
        SensorStatus.Maintenance.value: 0,
        SensorStatus.Fault.value: 0
    }
    
    sensor_type_counts: dict[str, int] = {}
    
    for sensor in sensors:
        sensor_status = sensor.status.value
        if sensor_status in sensor_status_counts:
            sensor_status_counts[sensor_status] += 1
        
        sensor_type = sensor.type.value
        sensor_type_counts[sensor_type] = sensor_type_counts.get(sensor_type, 0) + 1
    
    sensor_status_colors = {
        SensorStatus.Active.value: "#4caf50",
        SensorStatus.Inactive.value: "#f44336",
        SensorStatus.Maintenance.value: "#ff9800",
        SensorStatus.Fault.value: "#d32f2f"
    }
    
    sensor_type_colors = {
        SensorType.Temperature.value: "#ff5722",
        SensorType.Humidity.value: "#2196f3",
        SensorType.Pressure.value: "#9c27b0",
        SensorType.Flow.value: "#4caf50",
        SensorType.Volume.value: "#00bcd4",
        SensorType.GasComposition.value: "#ff9800",
        SensorType.LiquidComposition.value: "#795548",
        SensorType.Vibration.value: "#607d8b",
        SensorType.Noise.value: "#9e9e9e",
        SensorType.Corrosion.value: "#8bc34a",
        SensorType.GasDetection.value: "#ffc107",
        SensorType.FlameDetection.value: "#f44336",
        SensorType.LevelIndicator.value: "#3f51b5",
        SensorType.ValveStatus.value: "#009688",
        SensorType.PumpStatus.value: "#673ab7",
        SensorType.CompressorStatus.value: "#e91e63",
        SensorType.PowerConsumption.value: "#cddc39",
        SensorType.WaterContent.value: "#03a9f4",
        SensorType.OxygenContent.value: "#ffeb3b",
        SensorType.HydrogenSulfideContent.value: "#ff5722",
        SensorType.CarbonDioxideContent.value: "#9c27b0",
        SensorType.ParticulateMatter.value: "#4caf50",
        SensorType.LeakDetection.value: "#f44336"
    }
    
    sensor_status_data = [
        StatusMetric(name=status, value=count, color=sensor_status_colors.get(status, "#757575"))
        for status, count in sensor_status_counts.items() if count > 0
    ]
    
    top_sensor_types = dict(sorted(sensor_type_counts.items(), key=lambda x: x[1], reverse=True)[:10])
    
    sensor_type_data = [
        TypeMetric(
            name=re.sub(r'([A-Z])', r' \1', str(type_name)).strip(),
            value=count,
            color=sensor_type_colors.get(str(type_name), "#757575")
        )
        for type_name, count in top_sensor_types.items()
    ]
    
    return DashboardChartData(
        status_data=status_data,
        type_data=type_data,
        sensor_status_data=sensor_status_data,
        sensor_type_data=sensor_type_data
    )
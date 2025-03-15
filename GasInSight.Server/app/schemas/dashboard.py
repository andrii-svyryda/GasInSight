from pydantic import BaseModel


class StatusMetric(BaseModel):
    name: str
    value: int
    color: str


class TypeMetric(BaseModel):
    name: str
    value: int
    color: str


class DashboardMetrics(BaseModel):
    total_facilities: int
    active_facilities: int
    maintenance_facilities: int
    offline_facilities: int
    facility_types: int
    total_sensors: int
    active_sensors: int
    inactive_sensors: int
    avg_sensors_per_facility: float


class DashboardChartData(BaseModel):
    status_data: list[StatusMetric]
    type_data: list[TypeMetric]
    sensor_status_data: list[StatusMetric]
    sensor_type_data: list[TypeMetric]


class DashboardData(BaseModel):
    metrics: DashboardMetrics
    chart_data: DashboardChartData

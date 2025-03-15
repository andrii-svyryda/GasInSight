export enum SensorType {
  Temperature = "Temperature",
  Humidity = "Humidity",
  Pressure = "Pressure",
  Flow = "Flow",
  Volume = "Volume",
  GasComposition = "GasComposition",
  LiquidComposition = "LiquidComposition",
  Vibration = "Vibration",
  Noise = "Noise",
  Corrosion = "Corrosion",
  GasDetection = "GasDetection",
  FlameDetection = "FlameDetection",
  LevelIndicator = "LevelIndicator",
  ValveStatus = "ValveStatus",
  PumpStatus = "PumpStatus",
  CompressorStatus = "CompressorStatus",
  PowerConsumption = "PowerConsumption",
  WaterContent = "WaterContent",
  OxygenContent = "OxygenContent",
  HydrogenSulfideContent = "HydrogenSulfideContent",
  CarbonDioxideContent = "CarbonDioxideContent",
  ParticulateMatter = "ParticulateMatter",
  LeakDetection = "LeakDetection"
}

export enum SensorStatus {
  Active = "Active",
  Inactive = "Inactive",
  Maintenance = "Maintenance",
  Fault = "Fault"
}

export interface Sensor {
  id: string;
  name: string;
  facilityId: string;
  locationId?: number;
  status: SensorStatus;
  installedAt: string;
  type: SensorType;
  location?: {
    id: number;
    address?: string;
    longitude: number;
    latitude: number;
  };
}

export interface SensorRecord {
  sensorId: string;
  trackedAt: string;
  data: string;
}

import { SensorType } from "../types/sensor";

export const getSensorValidLabel = (sensorType: SensorType): string => {
  switch (sensorType) {
    case SensorType.Temperature:
      return "20-25°C (normal temperature range)";
    case SensorType.Humidity:
      return "40-60% (comfortable range)";
    case SensorType.Pressure:
      return "1013-1015 hPa (normal atmospheric pressure)";
    case SensorType.Flow:
      return "200-300 m³/h (typical gas flow rate)";
    case SensorType.Volume:
      return "400-600 m³ (standard tank capacity)";
    case SensorType.GasComposition:
      return "95-98% (high purity range)";
    case SensorType.LiquidComposition:
      return "95-98% (high purity range)";
    case SensorType.Vibration:
      return "2-5 mm/s (acceptable machinery vibration)";
    case SensorType.Noise:
      return "60-80 dB (normal industrial noise level)";
    case SensorType.Corrosion:
      return "2-4 mm/year (acceptable corrosion rate)";
    case SensorType.GasDetection:
      return "10-20 ppm (safe gas concentration)";
    case SensorType.LevelIndicator:
      return "4-6 m (typical tank level)";
    case SensorType.PowerConsumption:
      return "400-600 kW (normal operating range)";
    case SensorType.WaterContent:
      return "0.5-2.0% (acceptable water content)";
    case SensorType.OxygenContent:
      return "19.5-20.5% (normal air composition)";
    case SensorType.HydrogenSulfideContent:
      return "1-5 ppm (safe H2S level)";
    case SensorType.CarbonDioxideContent:
      return "350-1000 ppm (normal CO2 range)";
    case SensorType.ParticulateMatter:
      return "50-150 µg/m³ (acceptable air quality)";
    default:
      return "Unknown";
  }
};

export const getSensorValidRange = (
  sensorType: SensorType
): [number, number] => {
  switch (sensorType) {
    case SensorType.Temperature:
      return [20.0, 25.0];
    case SensorType.Humidity:
      return [40.0, 60.0];
    case SensorType.Pressure:
      return [1013.0, 1015.0];
    case SensorType.Flow:
      return [200.0, 300.0];
    case SensorType.Volume:
      return [400.0, 600.0];
    case SensorType.GasComposition:
      return [95.0, 98.0];
    case SensorType.LiquidComposition:
      return [95.0, 98.0];
    case SensorType.Vibration:
      return [2.0, 5.0];
    case SensorType.Noise:
      return [60.0, 80.0];
    case SensorType.Corrosion:
      return [2.0, 4.0];
    case SensorType.GasDetection:
      return [10.0, 20.0];
    case SensorType.LevelIndicator:
      return [4.0, 6.0];
    case SensorType.PowerConsumption:
      return [400.0, 600.0];
    case SensorType.WaterContent:
      return [0.5, 2.0];
    case SensorType.OxygenContent:
      return [19.5, 20.5];
    case SensorType.HydrogenSulfideContent:
      return [1.0, 5.0];
    case SensorType.CarbonDioxideContent:
      return [350.0, 1000.0];
    case SensorType.ParticulateMatter:
      return [50.0, 150.0];
    default:
      return [0.0, 0.0];
  }
};

export const getSensorDisplayRange = (
  sensorType: SensorType
): [number, number] => {
  switch (sensorType) {
    case SensorType.Temperature:
      return [18.0, 27.0];
    case SensorType.Humidity:
      return [35.0, 65.0];
    case SensorType.Pressure:
      return [1010.0, 1018.0];
    case SensorType.Flow:
      return [175.0, 325.0];
    case SensorType.Volume:
      return [350.0, 650.0];
    case SensorType.GasComposition:
      return [93.0, 100.0];
    case SensorType.LiquidComposition:
      return [93.0, 100.0];
    case SensorType.Vibration:
      return [1.5, 5.5];
    case SensorType.Noise:
      return [55.0, 85.0];
    case SensorType.Corrosion:
      return [1.5, 4.5];
    case SensorType.GasDetection:
      return [8.0, 22.0];
    case SensorType.LevelIndicator:
      return [3.5, 6.5];
    case SensorType.PowerConsumption:
      return [359.0, 650.0];
    case SensorType.WaterContent:
      return [0.2, 2.3];
    case SensorType.OxygenContent:
      return [19.0, 21];
    case SensorType.HydrogenSulfideContent:
      return [0.5, 5.5];
    case SensorType.CarbonDioxideContent:
      return [300.0, 1050.0];
    case SensorType.ParticulateMatter:
      return [40.0, 160.0];
    default:
      return [0.0, 0.0];
  }
};

export const getSensorMeasurements = (sensorType: SensorType): string => {
  switch (sensorType) {
    case SensorType.Temperature:
      return "°C";
    case SensorType.Humidity:
      return "%";
    case SensorType.Pressure:
      return "hPa";
    case SensorType.Flow:
      return "m³/h";
    case SensorType.Volume:
      return "m³";
    case SensorType.GasComposition:
      return "%";
    case SensorType.LiquidComposition:
      return "%";
    case SensorType.Vibration:
      return "mm/s";
    case SensorType.Noise:
      return "dB";
    case SensorType.Corrosion:
      return "mm/year";
    case SensorType.GasDetection:
      return "ppm";
    case SensorType.LevelIndicator:
      return "m";
    case SensorType.PowerConsumption:
      return "kW";
    case SensorType.WaterContent:
      return "%";
    case SensorType.OxygenContent:
      return "%";
    case SensorType.HydrogenSulfideContent:
      return "ppm";
    case SensorType.CarbonDioxideContent:
      return "ppm";
    case SensorType.ParticulateMatter:
      return "µg/m³";
    default:
      return "Unknown";
  }
};

export const getSensorDisplayName = (type: SensorType) => {
  switch (type) {
    case SensorType.Temperature:
      return "Temperature";
    case SensorType.Humidity:
      return "Humidity";
    case SensorType.Pressure:
      return "Pressure";
    case SensorType.Flow:
      return "Flow";
    case SensorType.Volume:
      return "Volume";
    case SensorType.GasComposition:
      return "Gas Composition";
    case SensorType.LiquidComposition:
      return "Liquid Composition";
    case SensorType.Vibration:
      return "Vibration";
    case SensorType.Noise:
      return "Noise";
    case SensorType.Corrosion:
      return "Corrosion";
    case SensorType.GasDetection:
      return "Gas Detection";
    case SensorType.FlameDetection:
      return "Flame Detection";
    case SensorType.LevelIndicator:
      return "Level Indicator";
    case SensorType.ValveStatus:
      return "Valve Status";
    case SensorType.PumpStatus:
      return "Pump Status";
    case SensorType.CompressorStatus:
      return "Compressor Status";
    case SensorType.PowerConsumption:
      return "Power Consumption";
    case SensorType.WaterContent:
      return "Water Content";
    case SensorType.OxygenContent:
      return "Oxygen Content";
    case SensorType.HydrogenSulfideContent:
      return "Hydrogen Sulfide Content";
    case SensorType.CarbonDioxideContent:
      return "Carbon Dioxide Content";
    case SensorType.ParticulateMatter:
      return "Particulate Matter";
    case SensorType.LeakDetection:
      return "Leak Detection";
    default:
      return "Unknown Sensor";
  }
};

from enum import Enum

class SensorTypes(str, Enum):
    Temperature = "Temperature"
    Humidity = "Humidity"
    Pressure = "Pressure"
    Flow = "Flow"
    Volume = "Volume"
    GasComposition = "GasComposition"
    LiquidComposition = "LiquidComposition"
    Vibration = "Vibration"
    Noise = "Noise"
    Corrosion = "Corrosion"
    GasDetection = "GasDetection"
    LevelIndicator = "LevelIndicator"
    PowerConsumption = "PowerConsumption"
    WaterContent = "WaterContent"
    OxygenContent = "OxygenContent"
    HydrogenSulfideContent = "HydrogenSulfideContent"
    CarbonDioxideContent = "CarbonDioxideContent"
    ParticulateMatter = "ParticulateMatter"

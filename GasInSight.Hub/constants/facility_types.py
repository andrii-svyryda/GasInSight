from enum import Enum, auto

class FacilityTypes(str, Enum):
    DrillingRig = "DrillingRig"
    Pipelines = "Pipelines"
    TankFarm = "TankFarm"
    UndergroundStorage = "UndergroundStorage"
    ProcessingPlant = "ProcessingPlant"
    ImportTerminal = "ImportTerminal"
    ExportTerminal = "ExportTerminal"

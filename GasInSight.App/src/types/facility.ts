export enum FacilityType {
  DrillingRig = "DrillingRig",
  Pipelines = "Pipelines",
  TankFarm = "TankFarm",
  UndergroundStorage = "UndergroundStorage",
  ProcessingPlant = "ProcessingPlant",
  ImportTerminal = "ImportTerminal",
  ExportTerminal = "ExportTerminal"
}

export interface Location {
  id: number;
  address?: string;
  longitude: number;
  latitude: number;
}

export interface Facility {
  id: string;
  name: string;
  locationId: number;
  createdAt: string;
  status: string;
  type: FacilityType;
  location: Location;
}

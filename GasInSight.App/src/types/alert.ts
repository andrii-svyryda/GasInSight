export interface Alert {
  id: number;
  sensorId: string;
  facilityId: string;
  message: string;
  alertType: AlertType;
  createdAt: string;
}

export enum AlertType {
  GAS_LEAK = "GAS_LEAK",
  HIGH_PRESSURE = "HIGH_PRESSURE",
  LOW_PRESSURE = "LOW_PRESSURE",
  HIGH_TEMPERATURE = "HIGH_TEMPERATURE",
  LOW_TEMPERATURE = "LOW_TEMPERATURE",
  SYSTEM = "SYSTEM",
  OTHER = "OTHER",
}

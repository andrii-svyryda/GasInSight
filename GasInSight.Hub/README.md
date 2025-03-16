# GasInSight Hub

A service for monitoring and managing gas facility sensors, providing real-time data collection and analysis.

## Overview

GasInSight Hub is a Python-based service that simulates and manages gas facility sensors across multiple locations worldwide. It generates realistic sensor data within industry-standard ranges and sends this data to Azure Service Bus for further processing and analysis.

## Features

- **Real-time sensor data collection** from multiple simulated facilities
- **Support for various sensor types** with industry-standard ranges:
  - Temperature: 20.0-25.0°C (temperature range)
  - Humidity: 40.0-60.0% (comfortable range)
  - Pressure: 1013.0-1015.0 hPa (normal atmospheric pressure)
  - Flow: 200.0-300.0 m³/h (typical gas flow rate)
  - Volume: 400.0-600.0 m³ (standard tank capacity)
  - Gas/Liquid Composition: 95.0-98.0% (high purity range)
  - Vibration: 2.0-5.0 mm/s (acceptable machinery vibration)
  - Noise: 60.0-80.0 dB (normal industrial noise level)
  - Corrosion: 2.0-4.0 mm/year (acceptable corrosion rate)
  - Gas Detection: 10.0-20.0 ppm (safe gas concentration)
  - Level Indicator: 4.0-6.0 m (typical tank level)
  - Power Consumption: 400.0-600.0 kW (normal operating range)
  - Water Content: 0.5-2.0% (acceptable water content)
  - Oxygen Content: 19.5-20.5% (normal air composition)
  - Hydrogen Sulfide: 1.0-5.0 ppm (safe H2S level)
  - Carbon Dioxide: 350.0-1000.0 ppm (normal CO2 range)
  - Particulate Matter: 50.0-150.0 µg/m³ (acceptable air quality)
- **Automated sensor signal generation** with:
  - Configurable intervals per sensor type
  - 2% chance of out-of-range values (±10% of normal range)
  - Realistic value fluctuations
- **Azure Service Bus integration** for message handling
- **Containerized deployment** using Docker

## Architecture

The GasInSight Hub service:
1. Generates a set of simulated facilities with various sensor types
2. Sends facility setup messages to Azure Service Bus
3. Sends sensor activation messages to Azure Service Bus
4. Continuously generates and sends sensor readings at configurable intervals
5. Handles anomalies and out-of-range values

## Prerequisites

- Docker
- Python 3.12 (for local development)
- `.env` file with required environment variables:
  ```
  SERVICE_BUS_CONNECTION_STRING=your_connection_string
  HUB_ACTIVITY_INTERVAL=15
  ```

## Docker Setup

### Build the Image
```bash
docker build -t gasinsight-hub:latest .
```

### Run the Container
```bash
docker run -d --name gasinsight-hub --env-file .env gasinsight-hub:latest
```

### View Logs
```bash
docker logs -f gasinsight-hub
```

### Push to Registry
```bash
docker tag gasinsight-hub:latest your-registry/gasinsight-hub:latest
docker push your-registry/gasinsight-hub:latest
```

## Development Setup

1. Install Python 3.12
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create `.env` file with required environment variables
4. Run the application:
   ```bash
   python main.py
   ```

## Data Generation

The application generates fresh facility and sensor data each time it starts. Each facility has:
- A unique ID and name
- Random location from predefined city coordinates
- 2-10 sensors of various types

Each sensor has:
- Industry-standard measurement ranges
- Type-specific signal intervals
- Realistic value fluctuations
- Small chance (2%) of out-of-range readings

## Project Structure

- `main.py` - Entry point for the application
- `models/` - Data models for facilities and sensors
- `constants/` - Enums and constants
- `helpers/` - Utility functions
- `generate_facilities.py` - Script to generate test facility data
- `Dockerfile` - Container definition for deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request
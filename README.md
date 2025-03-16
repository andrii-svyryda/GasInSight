# GasInSight

GasInSight is a comprehensive platform for monitoring, analyzing, and managing gas facilities in real-time. The platform provides tools for facility management, sensor monitoring, anomaly detection, and real-time alerts to ensure safe and efficient operation of gas infrastructure.

## System Architecture

GasInSight consists of three main components:

1. **GasInSight.App** - Frontend application
2. **GasInSight.Server** - Backend API and processing
3. **GasInSight.Hub** - Data simulation and ingestion

## Data Flow

1. **GasInSight.Hub** simulates sensor data and sends it to Azure Service Bus
2. **GasInSight.Server** processes the data, stores it in the database, and detects anomalies
3. **GasInSight.App** displays the data to users in real-time through the web interface

## Components

### GasInSight.App (Frontend)

The frontend application provides a user interface for interacting with the GasInSight platform. It's built with React, TypeScript, and Material UI.

For detailed information about the frontend architecture, project structure, features, and setup instructions, refer to the [GasInSight.App README](./GasInSight.App/README.md).

### GasInSight.Server (Backend)

The backend server provides API endpoints, processes data, and manages the database. It's built with FastAPI, SQLAlchemy, and integrates with Azure Service Bus.

For detailed information about the backend architecture, API endpoints, data models, and setup instructions, refer to the [GasInSight.Server README](./GasInSight.Server/README.md).

### GasInSight.Hub (Data Simulator)

The data simulator generates realistic sensor data for testing and demonstration purposes. It's built with Python and integrates with Azure Service Bus.

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18.0+
- Docker (optional)
- Azure Service Bus account (or local emulator)
- PostgreSQL database

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/GasInSight.git
   cd GasInSight
   ```

2. Set up each component by following the instructions in their respective README files:
   - For frontend setup, see the [GasInSight.App Getting Started guide](./GasInSight.App/README.md#getting-started)
   - For backend setup, see the [GasInSight.Server Getting Started guide](./GasInSight.Server/README.md#getting-started)
   - For Hub setup, see the [GasInSight.Hub Getting Started guide](./GasInSight.Hub/README.md#getting-started)

## Development

Each component has its own development workflow and guidelines:

- **Frontend Development**: Refer to the [GasInSight.App Development section](./GasInSight.App/README.md#development)
- **Backend Development**: Refer to the [GasInSight.Server Development section](./GasInSight.Server/README.md#development)
- **Hub Development**: Refer to the [GasInSight.Hub Development section](./GasInSight.Hub/README.md#development)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

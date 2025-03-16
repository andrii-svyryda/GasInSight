# GasInSight.Server

GasInSight.Server is the backend component of the GasInSight platform, a comprehensive solution for monitoring and managing gas facilities. It provides real-time data processing, anomaly detection, and a robust API for the frontend application.

## Architecture

The backend is built with FastAPI and follows a clean, modular architecture:

- **API Layer**: RESTful endpoints for data access and management
- **Service Bus Listeners**: Process messages from external systems
- **WebSockets**: Enable real-time data streaming
- **Anomaly Detection**: Automated monitoring and alerting

## Project Structure

```
GasInSight.Server/
├── alembic.ini                # Database migration configuration
├── app/                       # Main application code
│   ├── main.py                # Application entry point
│   ├── config.py              # Configuration settings
│   ├── database.py            # Database connection management
│   ├── models/                # SQLAlchemy ORM models
│   ├── schemas/               # Pydantic data validation schemas
│   ├── cruds/                 # Database operations
│   ├── routers/               # API endpoints
│   ├── services/              # Business logic
│   ├── listeners/             # Service bus message processors
│   └── websockets/            # Real-time communication
├── migrations/                # Alembic database migrations
└── requirements.txt           # Python dependencies
```

## Key Features

- **Authentication & Authorization**: JWT-based with role-based access control
- **Facility Management**: Track and manage various gas facility types
- **Sensor Monitoring**: Real-time data collection from various sensor types
- **Anomaly Detection**: Automated monitoring for abnormal sensor readings
- **WebSocket Support**: Real-time data streaming to clients
- **Service Bus Integration**: Process external messages for facility setup, sensor activation/deactivation, and data collection

## Data Model

The system is built around these core entities:

- **Users**: System users with role-based permissions
- **Facilities**: Gas-related facilities (drilling rigs, pipelines, etc.)
- **Sensors**: Various monitoring devices attached to facilities
- **Sensor Records**: Time-series data from sensors
- **Alerts**: Notifications for anomalous conditions
- **Permissions**: User access rights to specific facilities

## API Endpoints

The API provides comprehensive endpoints for:

- **Authentication**: Login, token refresh, and logout
- **User Management**: CRUD operations for users
- **Facility Management**: View and update facility information
- **Sensor Management**: Monitor and configure sensors
- **Data Access**: Query historical sensor data
- **Permissions**: Manage user access to facilities
- **Alerts**: View and manage system alerts

## Real-time Features

The system provides real-time capabilities through:

- **WebSockets**: Stream sensor data to connected clients
- **Service Bus Listeners**: Process incoming messages from external systems
- **Anomaly Detection**: Continuous monitoring of sensor data for abnormal conditions

## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL database
- Azure Service Bus

### Installation

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql+asyncpg://user:password@localhost/gasinisight
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=300
   REFRESH_TOKEN_EXPIRE_DAYS=30
   SERVICEBUS_CONNECTION_STRING=your_servicebus_connection_string
   ```

### Database Setup

Run migrations to set up the database:

```
alembic upgrade head
```

### Running the Server

Start the development server:

```
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

## Development

### Adding New Migrations

When changing models, create a new migration:

```
alembic revision --autogenerate -m "Description of changes"
```

Run migrations:

```
alembic upgrade head
```

### API Documentation

When the server is running, access the auto-generated API documentation:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

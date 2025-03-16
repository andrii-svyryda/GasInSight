# GasInSight.App

GasInSight.App is the frontend component of the GasInSight platform, a comprehensive solution for monitoring and managing gas facilities. It provides an intuitive user interface for real-time data visualization, facility management, and sensor monitoring.

## Architecture

The frontend is built with React and TypeScript, following a modular component-based architecture:

- **React + TypeScript**: Core framework for building the UI
- **Redux Toolkit**: State management with RTK Query for API integration
- **Material UI**: Component library for consistent design
- **Leaflet**: Interactive mapping capabilities
- **Recharts**: Data visualization and charting
- **WebSockets**: Real-time data streaming and alerts

## Project Structure

```
GasInSight.App/
├── public/                  # Static assets
├── src/                     # Source code
│   ├── assets/              # Images and other assets
│   ├── components/          # Reusable UI components
│   │   └── layout/          # Layout components
│   ├── constants/           # Application constants
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   │   └── */               # Feature-specific pages
│   │       └── components/  # Components specific to a page
│   ├── store/               # Redux store configuration
│   │   ├── api/             # API integration with RTK Query
│   │   └── slices/          # Redux slices for state management
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── .env                     # Environment variables
└── package.json             # Project dependencies
```

## Key Features

- **Interactive Dashboard**: Overview of facilities and sensor data
- **Facility Management**: View and manage gas facilities
- **Real-time Monitoring**: Live sensor data visualization
- **Interactive Maps**: Geographical representation of facilities and sensors
- **Alert System**: Real-time notifications for anomalous sensor readings
- **User Management**: Admin interface for managing users and permissions
- **Authentication**: Secure login with JWT and automatic token refresh
- **Responsive Design**: Optimized for desktop and mobile devices

## Pages

- **Landing Page**: Introduction to the GasInSight platform
- **Login**: User authentication
- **Dashboard**: Overview of all facilities with interactive map
- **Facility Details**: Detailed view of a specific facility with its sensors
- **Sensor Details**: Real-time and historical data for a specific sensor
- **User Management**: Admin interface for managing users (admin only)

## Real-time Features

The application provides real-time capabilities through:

- **WebSockets**: Live streaming of sensor data
- **Alert Notifications**: Instant notifications for anomalous conditions
- **Live Charts**: Real-time visualization of sensor readings

## Getting Started

### Prerequisites

- Node.js 18.0+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```
3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:8000
   VITE_WS_URL=ws://localhost:8000
   ```

### Running the Application

Start the development server:

```
npm run dev
```

or

```
yarn dev
```

The application will be available at http://localhost:5173

### Building for Production

Build the application for production:

```
npm run build
```

or

```
yarn build
```

Preview the production build:

```
npm run preview
```

or

```
yarn preview
```

## Development

### Code Organization

- **Components**: Reusable UI elements
- **Pages**: Feature-specific screens
- **Store**: State management with Redux
- **Types**: TypeScript interfaces and types
- **Utils**: Helper functions and utilities

### State Management

The application uses Redux Toolkit for state management:

- **API Slices**: RTK Query for data fetching and caching
- **Auth Slice**: Authentication state management
- **Automatic Token Refresh**: Handles JWT token expiration

### API Integration

The application communicates with the backend through:

- **REST API**: For data fetching and mutations
- **WebSockets**: For real-time updates and notifications

### Type Safety

The application is fully typed with TypeScript, ensuring type safety across the codebase.

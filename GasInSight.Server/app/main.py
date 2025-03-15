from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routers import auth, users, facilities, sensors, sensor_records, permissions, websockets
from app.listeners import facility_setup, sensor_activation, sensor_deactivation, sensor_data
from app.services.servicebus import setup_queues


@asynccontextmanager
async def lifespan(app: FastAPI):
    await setup_queues()
    
    facility_listener = facility_setup.create_facility_setup_listener()
    sensor_activation_listener = sensor_activation.create_sensor_activation_listener()
    sensor_deactivation_listener = sensor_deactivation.create_sensor_deactivation_listener()
    sensor_data_listener = sensor_data.create_sensor_data_listener()
    
    for listener in [facility_listener, sensor_activation_listener, 
                    sensor_deactivation_listener, sensor_data_listener]:
        listener.start()
    
    app.state.listeners = {
        "facility_listener": facility_listener,
        "sensor_activation_listener": sensor_activation_listener,
        "sensor_deactivation_listener": sensor_deactivation_listener,
        "sensor_data_listener": sensor_data_listener
    }
    
    yield
    
    for listener in app.state.listeners.values():
        listener.stop()


app = FastAPI(title="GasInSight API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(facilities.router)
app.include_router(sensors.router)
app.include_router(sensor_records.router)
app.include_router(permissions.router)
app.include_router(websockets.router)


@app.get("/")
async def root():
    return {"message": "Welcome to GasInSight API"}

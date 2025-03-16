from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.dashboard import DashboardData
from app.routers.dependencies import get_current_user
from app.models.user import User as UserModel
from app.services.metrics.dashboard import get_facility_dashboard_data, get_sensor_type_colors, get_sensor_status_colors, get_facility_type_colors

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)


@router.get("/colors", response_model=dict[str, dict[str, str]])
async def get_colors():
    return {
        "sensorTypes": get_sensor_type_colors(),
        "sensorStatus": get_sensor_status_colors(),
        "facilityTypes": get_facility_type_colors()
    }


@router.get("", response_model=DashboardData)
async def get_dashboard_data_route(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if current_user.role.value == "Admin":
        return await get_facility_dashboard_data(db)
    else:
        return await get_facility_dashboard_data(db, user_id=current_user.id)


@router.get("/facility/{facility_id}", response_model=DashboardData)
async def get_facility_dashboard_data_route(
    facility_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if current_user.role.value == "Admin":
        return await get_facility_dashboard_data(db, facility_id=facility_id)
    else:
        return await get_facility_dashboard_data(db, facility_id=facility_id, user_id=current_user.id)

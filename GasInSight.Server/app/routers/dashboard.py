from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.cruds.dashboard import dashboard_crud
from app.schemas.dashboard import DashboardData
from app.routers.dependencies import get_current_user
from app.models.user import User as UserModel

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)


@router.get("", response_model=DashboardData)
async def get_dashboard_data(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if current_user.role.value == "Admin":
        return await dashboard_crud.get_dashboard_data(db)
    else:
        return await dashboard_crud.get_dashboard_data(db, current_user.id)


@router.get("/facility/{facility_id}", response_model=DashboardData)
async def get_facility_dashboard_data(
    facility_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if current_user.role.value == "Admin":
        return await dashboard_crud.get_facility_dashboard_data(db, facility_id)
    else:
        return await dashboard_crud.get_facility_dashboard_data(db, facility_id, current_user.id)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.cruds.alert import alert_crud
from app.schemas import Alert
from app.routers.dependencies import get_current_user, check_facility_permission
from app.models import User
from app.models.user_facility_permission import PermissionType

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/facility/{facility_id}", response_model=list[Alert])
async def get_alerts_by_facility_id(
    facility_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await check_facility_permission(facility_id, PermissionType.View, current_user, db)
    
    alerts = await alert_crud.get_by_facility_id(db, facility_id)
    return alerts


@router.get("/recent", response_model=list[Alert])
async def get_recent_alerts(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "Admin":
        raise HTTPException(
            status_code=403, detail="Only admin users can access recent alerts across all facilities"
        )
    
    alerts = await alert_crud.get_recent(db, limit)
    return alerts

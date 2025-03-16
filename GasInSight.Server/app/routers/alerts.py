from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.cruds.alert import alert_crud
from app.schemas import Alert, AlertWithDetails
from app.routers.dependencies import get_current_user, check_facility_permission
from app.models import User
from app.models.user_facility_permission import PermissionType
from app.models.user import UserRole
from app.cruds.user_facility_permission import user_facility_permission_crud

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/facility/{facility_id}", response_model=list[Alert])
async def get_alerts_by_facility(
    facility_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await check_facility_permission(facility_id, PermissionType.View, current_user, db)
    alerts = await alert_crud.get_by_facility_id(db, facility_id)
    return alerts


@router.get("/recent", response_model=list[AlertWithDetails])
async def get_recent_alerts(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == UserRole.Admin:
        alerts_with_details = await alert_crud.get_recent_with_details(db, limit)
        return alerts_with_details
    
    permissions = await user_facility_permission_crud.get_by_user_id(db, current_user.id)
    
    facility_ids = [
        permission.facility_id for permission in permissions
        if permission.permission_type in [PermissionType.View, PermissionType.Edit]
    ]
    
    if not facility_ids:
        return []
    
    alerts_with_details = await alert_crud.get_recent_with_details(db, limit, facility_ids)
    return alerts_with_details

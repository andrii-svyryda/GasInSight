from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.cruds.user_facility_permission import user_facility_permission_crud
from app.cruds.user import user_crud
from app.cruds.facility import facility_crud
from app.schemas.user_facility_permission import UserFacilityPermission, UserFacilityPermissionCreate
from app.routers.dependencies import get_current_active_admin
from app.models.user import User as UserModel

router = APIRouter(
    prefix="/permissions",
    tags=["permissions"]
)


@router.post("", response_model=UserFacilityPermission)
async def create_permission(
    permission_create: UserFacilityPermissionCreate,
    db: AsyncSession = Depends(get_db),
    _: UserModel = Depends(get_current_active_admin)
):
    db_user = await user_crud.get(db, permission_create.user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db_facility = await facility_crud.get(db, permission_create.facility_id)
    if db_facility is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facility not found"
        )
    
    existing_permission = await user_facility_permission_crud.get_by_user_and_facility(
        db, permission_create.user_id, permission_create.facility_id
    )
    
    if existing_permission:
        await user_facility_permission_crud.remove(db, existing_permission.id)
    
    return await user_facility_permission_crud.create(db, permission_create)


@router.get("", response_model=list[UserFacilityPermission])
async def read_permissions(
    user_id: int | None = Query(None),
    facility_id: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: UserModel = Depends(get_current_active_admin)
):
    if user_id:
        permissions = await user_facility_permission_crud.get_by_user_id(db, user_id)
    elif facility_id:
        permissions = await user_facility_permission_crud.get_by_facility_id(db, facility_id)
    else:
        permissions = []
    
    return permissions


@router.delete("/{permission_id}", response_model=UserFacilityPermission)
async def delete_permission(
    permission_id: int,
    db: AsyncSession = Depends(get_db),
    _: UserModel = Depends(get_current_active_admin)
):
    db_permission = await user_facility_permission_crud.get(db, permission_id)
    if db_permission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Permission not found"
        )
    
    return await user_facility_permission_crud.remove(db, permission_id)

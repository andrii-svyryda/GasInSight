from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import list
from app.database import get_db
from app.cruds.user_facility_permission import user_facility_permission
from app.cruds.user import user
from app.cruds.facility import facility
from app.schemas.user_facility_permission import UserFacilityPermission, UserFacilityPermissionCreate
from app.routers.dependencies import get_current_active_admin
from app.models.user import User as UserModel

router = APIRouter(
    prefix="/permissions",
    tags=["permissions"]
)


@router.post("/", response_model=UserFacilityPermission)
async def create_permission(
    permission_create: UserFacilityPermissionCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_admin)
):
    db_user = user.get(db, permission_create.user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db_facility = facility.get_by_id(db, permission_create.facility_id)
    if db_facility is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facility not found"
        )
    
    existing_permission = user_facility_permission.get_by_user_and_facility(
        db, permission_create.user_id, permission_create.facility_id
    )
    
    if existing_permission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Permission already exists"
        )
    
    return user_facility_permission.create(db, permission_create)


@router.get("/", response_model=list[UserFacilityPermission])
async def read_permissions(
    user_id: int = None,
    facility_id: str = None,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_admin)
):
    if user_id:
        permissions = user_facility_permission.get_by_user_id(db, user_id)
    elif facility_id:
        permissions = user_facility_permission.get_by_facility_id(db, facility_id)
    else:
        permissions = user_facility_permission.get_multi(db)
    
    return permissions


@router.delete("/{permission_id}", response_model=UserFacilityPermission)
async def delete_permission(
    permission_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_admin)
):
    db_permission = user_facility_permission.get(db, permission_id)
    if db_permission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Permission not found"
        )
    
    return user_facility_permission.remove(db, permission_id)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.cruds.facility import facility_crud
from app.schemas.facility import Facility, FacilityUpdate
from app.routers.dependencies import get_current_user, check_facility_permission
from app.models.user import User as UserModel
from app.models.user_facility_permission import PermissionType

router = APIRouter(
    prefix="/facilities",
    tags=["facilities"]
)


@router.get("", response_model=list[Facility])
async def read_facilities(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if current_user.role.value == "Admin":
        facilities = await facility_crud.get_multi(db, skip=skip, limit=limit)
    else:
        facilities = await facility_crud.get_all_by_user_id(db, current_user.id, skip=skip, limit=limit)
    return facilities


@router.get("/{facility_id}", response_model=Facility)
async def read_facility(
    facility_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    db_facility = await facility_crud.get_by_id(db, facility_id)
    if db_facility is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facility not found"
        )
    
    await check_facility_permission(facility_id, PermissionType.View, current_user, db)
    
    return db_facility


@router.put("/{facility_id}", response_model=Facility)
async def update_facility(
    facility_id: str,
    facility_update: FacilityUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    db_facility = await facility_crud.get_by_id(db, facility_id)
    if db_facility is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facility not found"
        )
    
    await check_facility_permission(facility_id, PermissionType.Edit, current_user, db)
    
    return await facility_crud.update(db, db_facility, facility_update)

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.auth import verify_token
from app.cruds.user import user_crud
from app.cruds.user_facility_permission import user_facility_permission_crud
from app.models.user import User, UserRole
from app.models.user_facility_permission import PermissionType

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = verify_token(token)
    if token_data is None:
        raise credentials_exception
    
    user_obj = await user_crud.get(db, token_data.id)
    if user_obj is None:
        raise credentials_exception
    
    return user_obj


async def get_current_active_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != UserRole.Admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user


async def check_facility_permission(
    facility_id: str,
    permission_type: PermissionType,
    current_user: User,
    db: AsyncSession,
) -> bool:
    if current_user.role == UserRole.Admin:
        return True
    
    permission = await user_facility_permission_crud.get_by_user_and_facility(
        db, current_user.id, facility_id
    )
    
    if permission is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    if permission_type == PermissionType.View:
        if permission.permission_type not in [PermissionType.View, PermissionType.Edit]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
    elif permission_type == PermissionType.Edit:
        if permission.permission_type != PermissionType.Edit:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
    
    return True

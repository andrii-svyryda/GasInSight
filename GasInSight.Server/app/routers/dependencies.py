from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth import verify_token
from app.cruds.user import user
from app.cruds.user_facility_permission import user_facility_permission
from app.models.user import User, UserRole
from app.models.user_facility_permission import PermissionType

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = verify_token(token)
    if token_data is None:
        raise credentials_exception
    
    user_obj = user.get_by_username(db, token_data.username)
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> bool:
    if current_user.role == UserRole.Admin:
        return True
    
    permission = user_facility_permission.get_by_user_and_facility(
        db, current_user.id, facility_id
    )
    
    if not permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions for this facility",
        )
    
    if permission.permission_type != permission_type and permission_type == PermissionType.Modify:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions for this facility",
        )
    
    return True

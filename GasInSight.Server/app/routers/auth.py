from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from app.database import get_db
from app.cruds.user import user_crud
from app.services.auth import create_access_token, create_refresh_token, verify_token
from app.schemas.user import Token
from app.config import settings

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    user_obj = await user_crud.authenticate(db, form_data.username, form_data.password)
    if not user_obj:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_obj.username, "id": user_obj.id},
        expires_delta=access_token_expires
    )
    
    refresh_token = create_refresh_token(
        data={"sub": user_obj.username, "id": user_obj.id}
    )
    
    _ = await user_crud.update_refresh_token(db, user_obj.id, refresh_token)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/logout")
async def logout(
    refresh_token: str,
    db: AsyncSession = Depends(get_db)
):
    token_data = verify_token(refresh_token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    await user_crud.update_refresh_token(db, token_data.id, None)
    
    return {"detail": "Successfully logged out"}



@router.post("/refresh-token", response_model=Token)
async def refresh_access_token(
    refresh_token: str, 
    db: AsyncSession = Depends(get_db)
):
    token_data = verify_token(refresh_token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_obj = await user_crud.get(db, token_data.id)
    if not user_obj or user_obj.refresh_token != refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_obj.username, "id": user_obj.id},
        expires_delta=access_token_expires
    )
    
    new_refresh_token = create_refresh_token(
        data={"sub": user_obj.username, "id": user_obj.id}
    )
    
    _ = await user_crud.update_refresh_token(db, user_obj.id, new_refresh_token)
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

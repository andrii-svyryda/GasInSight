from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.cruds.user import user_crud
from app.schemas.user import SearchedUsers, User, UserCreate, UserUpdate
from app.routers.dependencies import get_current_active_admin, get_current_user
from app.models.user import User as UserModel

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.post("", response_model=User)
async def create_user(
    user_create: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_admin)
):
    db_user = await user_crud.get_by_email(db, user_create.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    return await user_crud.create(db, user_create)


@router.get("", response_model=SearchedUsers)
async def read_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_admin)
):
    users, total = await user_crud.search(db, None, skip, limit)
    return {"users": users, "total": total}


@router.get("/me", response_model=User)
async def read_user_me(current_user: UserModel = Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", response_model=User)
async def read_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_admin)
):
    db_user = await user_crud.get(db, user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return db_user


@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_admin)
):
    db_user = await user_crud.get(db, user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user_update.email:
        existing_user = await user_crud.get_by_email(db, user_update.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    return await user_crud.update(db, db_user, user_update)


@router.delete("/{user_id}", response_model=User)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_admin)
):
    db_user = await user_crud.get(db, user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if db_user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )
    
    return await user_crud.remove(db, user_id)

from sqlalchemy.orm import Session
from app.cruds.base import CrudBase
from app.models.models import User
from app.schemas.schemas import UserCreate, UserUpdate
from typing import Optional
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class CrudUser(CrudBase[User, UserCreate, UserUpdate]):
    def get_by_username(self, db: Session, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()
    
    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()
    
    def create(self, db: Session, obj_in: UserCreate) -> User:
        db_obj = User(
            username=obj_in.username,
            email=obj_in.email,
            password_hash=pwd_context.hash(obj_in.password),
            role=obj_in.role
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(self, db: Session, db_obj: User, obj_in: UserUpdate) -> User:
        update_data = obj_in.model_dump(exclude_unset=True)
        if update_data.get("password"):
            hashed_password = pwd_context.hash(update_data["password"])
            del update_data["password"]
            update_data["password_hash"] = hashed_password
        return super().update(db, db_obj, UserUpdate(**update_data))
    
    def authenticate(self, db: Session, username: str, password: str) -> Optional[User]:
        user = self.get_by_username(db, username)
        if not user:
            return None
        if not pwd_context.verify(password, user.password_hash):
            return None
        return user
    
    def update_refresh_token(self, db: Session, user_id: int, refresh_token: Optional[str]) -> User:
        user = self.get(db, user_id)
        user.refresh_token = refresh_token
        db.add(user)
        db.commit()
        db.refresh(user)
        return user


user = CrudUser(User)

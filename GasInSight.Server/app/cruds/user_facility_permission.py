from sqlalchemy.orm import Session
from app.cruds.base import CrudBase
from app.models.models import UserFacilityPermission
from app.schemas.schemas import UserFacilityPermissionCreate, UserFacilityPermissionBase
from typing import List


class CrudUserFacilityPermission(CrudBase[UserFacilityPermission, UserFacilityPermissionCreate, UserFacilityPermissionBase]):
    def get_by_user_and_facility(self, db: Session, user_id: int, facility_id: str):
        return db.query(UserFacilityPermission).filter(
            UserFacilityPermission.user_id == user_id,
            UserFacilityPermission.facility_id == facility_id
        ).first()
    
    def get_by_user_id(self, db: Session, user_id: int) -> List[UserFacilityPermission]:
        return db.query(UserFacilityPermission).filter(
            UserFacilityPermission.user_id == user_id
        ).all()
    
    def get_by_facility_id(self, db: Session, facility_id: str) -> List[UserFacilityPermission]:
        return db.query(UserFacilityPermission).filter(
            UserFacilityPermission.facility_id == facility_id
        ).all()


user_facility_permission = CrudUserFacilityPermission(UserFacilityPermission)

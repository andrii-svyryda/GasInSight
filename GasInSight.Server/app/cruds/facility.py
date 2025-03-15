from sqlalchemy.orm import Session
from app.cruds.base import CrudBase
from app.models.models import Facility
from app.schemas.schemas import FacilityCreate, FacilityUpdate
from typing import List


class CrudFacility(CrudBase[Facility, FacilityCreate, FacilityUpdate]):
    def get_by_id(self, db: Session, id: str):
        return db.query(Facility).filter(Facility.id == id).first()
    
    def get_all_by_user_id(self, db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Facility]:
        return db.query(Facility).join(Facility.permissions).filter(
            Facility.permissions.user_id == user_id
        ).offset(skip).limit(limit).all()


facility = CrudFacility(Facility)

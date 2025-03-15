from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException, status
from app.websockets.manager import manager
from app.services.auth import verify_token
from app.cruds.sensor import sensor
from app.database import get_db
from sqlalchemy.orm import Session
from app.routers.dependencies import check_facility_permission
from app.models.user_facility_permission import PermissionType
from app.cruds.user import user

router = APIRouter(tags=["websockets"])

@router.websocket("/ws/{sensor_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    sensor_id: str,
    token: str,
    db: Session = Depends(get_db)
):
    token_data = verify_token(token)
    if not token_data:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    db_sensor = sensor.get_by_id(db, sensor_id)
    if not db_sensor:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    current_user = user.get_by_username(db, token_data.username)
    if not current_user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    try:
        await check_facility_permission(db_sensor.facility_id, PermissionType.View, current_user, db)
    except HTTPException:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    await manager.connect(websocket, sensor_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, sensor_id)

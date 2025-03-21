from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.websockets.manager import manager
from app.services.auth import verify_token
from app.cruds.sensor import sensor_crud
from app.database import get_db
from app.routers.dependencies import check_facility_permission
from app.models.user_facility_permission import PermissionType
from app.cruds.user import user_crud

router = APIRouter(prefix="/ws", tags=["websockets"])

@router.websocket("/sensor-data/{sensor_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    sensor_id: str,
    token: str,
    db: AsyncSession = Depends(get_db)
):
    token_data = verify_token(token)
    if not token_data:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    db_sensor = await sensor_crud.get(db, sensor_id)
    if not db_sensor:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    current_user = await user_crud.get(db, token_data.id)
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
            await websocket.receive()
    except WebSocketDisconnect:
        manager.disconnect(websocket, sensor_id)
    except Exception:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION) 

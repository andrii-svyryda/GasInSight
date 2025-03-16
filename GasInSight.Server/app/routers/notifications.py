from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.websockets.notification_manager import notification_manager
from app.services.auth import verify_token
from app.database import get_db
from app.cruds.user import user_crud

router = APIRouter(prefix="/ws", tags=["notifications"])

@router.websocket("/notifications")
async def notifications_websocket(
    websocket: WebSocket,
    token: str,
    db: AsyncSession = Depends(get_db)
):
    # Verify the token
    token_data = verify_token(token)
    if not token_data:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    # Get the user
    current_user = await user_crud.get(db, token_data.id)
    if not current_user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    # Connect to the notification manager
    await notification_manager.connect(websocket, current_user.id)
    
    try:
        # Keep the connection alive
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        # Handle disconnection
        notification_manager.disconnect(websocket, current_user.id)
    except Exception:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)

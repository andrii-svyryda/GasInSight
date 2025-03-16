import json
from fastapi import WebSocket
from typing import Any
from app.cruds.user_facility_permission import user_facility_permission_crud
from app.cruds.user import user_crud
from app.database import SessionLocal


class NotificationManager:
    def __init__(self):
        # Store connections by user_id
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_personal_notification(self, user_id: int, message: dict[str, Any]):
        """Send notification to a specific user"""
        if user_id in self.active_connections:
            message_str = json.dumps(message)
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(message_str)
                except Exception:
                    # Connection might be closed or invalid
                    pass

    async def broadcast_facility_notification(self, facility_id: str, message: dict[str, Any]):
        """Broadcast notification to all users with access to the facility"""
        message_str = json.dumps(message)
        
        # Get all users with access to this facility from the database
        async with SessionLocal() as db:
            permissions = await user_facility_permission_crud.get_by_facility_id(db, facility_id)
            
            # Create a set of user IDs with at least View permission
            user_ids_with_access = {
                permission.user_id for permission in permissions
            }
            
            # Get all admin users
            admin_users = await user_crud.get_all_admins(db)
            admin_user_ids = {admin.id for admin in admin_users}
            
            # Combine regular users with access and admin users
            all_user_ids = user_ids_with_access.union(admin_user_ids)
            
            # Send notification to all connected users with access
            for user_id in all_user_ids:
                if user_id in self.active_connections:
                    for connection in self.active_connections[user_id]:
                        try:
                            await connection.send_text(message_str)
                        except Exception:
                            # Connection might be closed or invalid
                            pass


# Create a singleton instance
notification_manager = NotificationManager()

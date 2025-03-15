from fastapi import WebSocket
from typing import Dict, List
import asyncio
import json


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, sensor_id: str):
        await websocket.accept()
        if sensor_id not in self.active_connections:
            self.active_connections[sensor_id] = []
        self.active_connections[sensor_id].append(websocket)

    def disconnect(self, websocket: WebSocket, sensor_id: str):
        if sensor_id in self.active_connections:
            if websocket in self.active_connections[sensor_id]:
                self.active_connections[sensor_id].remove(websocket)
            if not self.active_connections[sensor_id]:
                del self.active_connections[sensor_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, sensor_id: str, message: dict):
        if sensor_id in self.active_connections:
            message_str = json.dumps(message)
            for connection in self.active_connections[sensor_id]:
                try:
                    await connection.send_text(message_str)
                except Exception:
                    pass


manager = ConnectionManager()

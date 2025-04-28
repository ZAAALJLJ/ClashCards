from fastapi import APIRouter, WebSocket, WebSocketDisconnect

websocket_router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Just initialize the active connection list
        self.active_connections: list[WebSocket] = []
        
    async def connect(self, websocket: WebSocket):
        await websocket.accept() # waits until the websocket is accepted
        self.active_connections.append(websocket) # adds the websocket to active_websockert
        
    def disconnect(self, websocket: WebSocket): # removing from the list
        self.active_connections.remove(websocket) 
        
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
        
    async def broadcast(self, message: str): # broadcast to all
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager() # needed to use the functions

@websocket_router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote {data}", websocket)
            await manager.broadcast(f"Client {client_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client {client_id} has left")
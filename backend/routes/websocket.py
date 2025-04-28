from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from collections import defaultdict


websocket_router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Just initialize the active connection list
        self.active_connections: list[WebSocket] = []
        self.active_connections_dict = defaultdict(list)

        
    async def connect(self, websocket: WebSocket, battle_id: str):
        await websocket.accept() # waits until the websocket is accepted
        self.active_connections.append(websocket) # adds the websocket to active_websockert
        self.active_connections_dict[battle_id].append(websocket)
        print("HEEEEEEEEEEEEEEEEEELLLLLPPPPPPPP", self.active_connections_dict)
        
    def disconnect(self, websocket: WebSocket, battle_id: str): # removing from the list
        if websocket in self.active_connections_dict[battle_id]:
            self.active_connections_dict[battle_id].remove(websocket) 
        if not self.active_connections_dict[battle_id]:
            del self.active_connections_dict[battle_id]
        
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
        
    async def broadcast(self, message: str, battle_id: str): # broadcast to all
        for connections in self.active_connections_dict[battle_id]:
            await connections.send_text(f"Message from battle: {message}")

manager = ConnectionManager() # needed to use the functions

@websocket_router.websocket("/ws/{battle_id}/{client_id}")
async def websocket_endpoint(websocket: WebSocket, battle_id: str, client_id: str):
    # if same battle_id then connect, if not then dont connect and create a new one
    await manager.connect(websocket, battle_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote {data}", websocket)
            await manager.broadcast(f"Client {client_id}: {data} in {battle_id}", battle_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, battle_id)
        await manager.broadcast(f"Client {client_id} has left", battle_id)
        
        
        
# from fastapi import APIRouter, WebSocket, WebSocketDisconnect
# from collections import defaultdict

# websocket_router = APIRouter()

# class ConnectionManager:
#     def __init__(self):
#         self.active_connections = defaultdict(list)
        
#     async def connect(self, websocket: WebSocket, battle_id: str):
#         await websocket.accept() # waits until the websocket is accepted
#         self.active_connections[battle_id].append(websocket) # adds the websocket to active_websockert
        
#     def disconnect(self, websocket: WebSocket, battle_id: str): # removing from the list
#         if websocket in self.active_connections[battle_id]:
#             self.active_connections[battle_id].remove(websocket) 
#         if not self.active_connections[battle_id]:
#             del self.active_connections[battle_id]
        
#     async def send_personal_message(self, message: str, websocket: WebSocket):
#         await websocket.send_text(message)
        
#     async def broadcast(self, message: str, battle_id: str): # broadcast to all
#         for connection in self.active_connections[battle_id]:
#             await connection.send_text(message)

# manager = ConnectionManager() # needed to use the functions

# @websocket_router.websocket("/ws/{battle_id}/{client_id}")
# async def websocket_endpoint(websocket: WebSocket, battle_id: str, client_id: str):
#     await manager.connect(websocket, battle_id)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             await manager.send_personal_message(f"You wrote {data}", websocket)
#             await manager.broadcast(f"Client {client_id}: {data} in {battle_id}")
#     except WebSocketDisconnect:
#         manager.disconnect(websocket, battle_id)
#         await manager.broadcast(f"Client {client_id} has left {battle_id}", battle_id)
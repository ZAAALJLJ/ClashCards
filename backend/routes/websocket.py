from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from collections import defaultdict
import json


websocket_router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Just initialize the active connection list
        self.active_connections_dict = defaultdict(list)
        self.players_ready_dict = defaultdict(list)
        self.battle_locked_dict = defaultdict(lambda: False)

    
    async def connect(self, websocket: WebSocket, battle_id: str, client_id: str):
        # need room id
        if self.battle_locked_dict[battle_id]:
            await websocket.accept()
            await websocket.send_text(json.dumps({"error": "Battle already started"}))
            await websocket.close()
            return
        
        await websocket.accept() # waits until the websocket is accepted
        self.active_connections_dict[battle_id].append(websocket)
        self.players_ready_dict.setdefault(battle_id, {})[client_id] = False
        
        await self.send_player_count(battle_id, str(len(self.players_ready_dict[battle_id])))
        print("Length", len(self.players_ready_dict[battle_id]))
        
    def disconnect(self, websocket: WebSocket, battle_id: str): # removing from the list
        # need room id
        if websocket in self.active_connections_dict[battle_id]:
            self.active_connections_dict[battle_id].remove(websocket) 
        if not self.active_connections_dict[battle_id]:
            print(f"All players left. Resetting battle {battle_id}.")
            del self.active_connections_dict[battle_id]
            self.players_ready_dict.pop(battle_id, None)
            self.battle_locked_dict[battle_id] = False
        
    async def send_player_count(self, battle_id: str, message: str):
        # need room id
        for connections in self.active_connections_dict[battle_id]:
            player_count = {
            'player_count': message
            }
            await connections.send_text(json.dumps(player_count))
            
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
        
    async def broadcast(self, message, battle_id: str): # broadcast to all
        # need room id
    
        for connections in self.active_connections_dict[battle_id]:
            print('broadcast', message)
            await connections.send_text(message)
    
    async def broadcast_players_ready(self, message: str, battle_id: str): # broadcast to all
        # need room id
        
        for connections in self.active_connections_dict[battle_id]:
            await connections.send_text(f"{message}")
        
    async def broadcast_players_ready(self, message: str, battle_id: str): # broadcast to all
        # need room id
        
        for connections in self.active_connections_dict[battle_id]:
            await connections.send_text(f"{message}")
            
    async def broad_cast_clients(self, message, battle_id: str):
        # need room id
        
        for connections in self.active_connections_dict[battle_id]:
            print("WORKINGGGGGGGGGGGGGGGGGGGGGGGGGG")
            await connections.send_text(message)
            
    async def mark_player_ready(self, battle_id: str, client_id: str):
        # need room id
        
        print("I want cheese")
        self.players_ready_dict[battle_id][client_id] = True
        print(f"Player {client_id} is now ready in battle {battle_id}")
        await self.check_all_players_ready(battle_id)
    
    async def check_all_players_ready(self, battle_id: str):
        # need room id
        
        if all(self.players_ready_dict[battle_id].values()):
            await self.broadcast_all_players_ready(battle_id)
            
    async def broadcast_all_players_ready(self, battle_id: str):
        # need room id
        
        print(self.players_ready_dict[battle_id])
        message = "All players ready"
        
        client_ids = [
            client_id for client_id, ready in self.players_ready_dict[battle_id].items() if ready
        ]
        client_id_message = {
            'ready_clients': client_ids
        }
        self.battle_locked_dict[battle_id] = True
        await self.broadcast_players_ready(message, battle_id)

        json_message = json.dumps(client_id_message)
        await self.broad_cast_clients(json_message, battle_id)
        
manager = ConnectionManager() # needed to use the functions

@websocket_router.websocket("/ws/{battle_id}/{client_id}/{studyset_id}")
async def websocket_endpoint(websocket: WebSocket, battle_id: str, client_id: str, studyset_id: str):
        # need room id
    battle_id = f"{battle_id}:{studyset_id}"
    # if same battle_id then connect, if not then dont connect and create a new one
    await manager.connect(websocket, battle_id, client_id)
    
    try:
        while True:
            data = await websocket.receive_text() 
            
            
            # player presses READY
            if data == "ready":
                print("HEEEEEEEEEEEEEEEEEEEEEEElp")
                await manager.mark_player_ready(battle_id, client_id)
            #     await manager.send_personal_message(f"Youre now ready!", websocket)
            
            if data != "ready":
                parsed_data = json.loads(data)
                score = parsed_data.get("score")
                client_score = {
                    'name': client_id,
                    'updated_score': score
                }
            else:
                client_score = {
                    'name': client_id,
                    'updated_score': 0
                }
            
            json_client_score = json.dumps(client_score)
            await manager.broadcast(json_client_score, battle_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, battle_id)
        await manager.broadcast(f"Client {client_id} has left", battle_id)
        

 
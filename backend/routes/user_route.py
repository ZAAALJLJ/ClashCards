from fastapi import APIRouter, HTTPException, Query
from models.user import User
from config.database import user_collection
from schema.user_schemas import individual_user, list_user
from bson import ObjectId

user_router = APIRouter()

@user_router.get("/users/{id}")
async def get_user_winrate(id: str):
    user = user_collection.find_one({"_id": ObjectId(id)})
    wins = user.get("wins")
    lose = user.get("lose")
    right = user.get("right")
    wrong = user.get("wrong")
    finish = user.get("finished_battle")
    unfinish = user.get("unfinished_battle")
    average_time = user.get("average_time", [])
    consistency = user.get("consistency", [])
    
    if average_time:
        avg = sum(average_time) / len(average_time)
    else: avg = 0
    
    if consistency:
        cons = sum(consistency) / len(consistency)
    else: avg = 0
    
    return {"wins": wins, "lose": lose, "right": right, "wrong": wrong, "finish": finish, "unfinish": unfinish, "avg": avg, "consistent": cons}

@user_router.get("/users/{id}/username")
async def ger_username(id: str):
    user = user_collection.find_one({"_id": ObjectId(id)})
    username = user.get("username")
    
    return {"username": username}
    
@user_router.get("/users/")
async def get_users():
    users = list_user(user_collection.find())
    return users

@user_router.put("/users/{user_id}")
async def update_card(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"wins": 1}})
    
@user_router.put("/users/{user_id}/right")
async def update_card_right(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"right": 1}})
   
@user_router.put("/users/{user_id}/wrong")
async def update_card_wrong(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"wrong": 1}})   
   
@user_router.put("/users/{user_id}/finished_battle")
async def update_card_finished_battle(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"finished_battle": 1}})   
   
@user_router.put("/users/{user_id}/unfinished_battle")
async def update_card_unfinished_battle(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"unfinished_battle": 1}})   

@user_router.put("/users/{user_id}/average_time")
async def add_time(user_id: str, time: int = Query(...)):
    user_collection.find_one_and_update({"_id": ObjectId(user_id)}, {"$push": {"average_time": time}}, return_document=True)
  
@user_router.put("/users/{user_id}/consistency")
async def add_correct(user_id: str, correct: float = Query(...)):
    user_collection.find_one_and_update({"_id": ObjectId(user_id)}, {"$push": {"consistency": correct}}, return_document=True)
  
@user_router.get("/userss/")
async def update_users():
    target_user_id = ObjectId("6815a570c20810163171516d")

    for user in user_collection.find():
        updates = {}

        if "right" not in user:
            updates["right"] = 0
        if "wrong" not in user:
            updates["wrong"] = 0
        if "finished_battle" not in user:
            updates["finished_battle"] = 0
        if "unfinished_battle" not in user:
            updates["unfinished_battle"] = 0
        if "average_time" not in user:
            updates["average_time"] = []

        # Only overwrite consistency and average_time for specific user
        if user["_id"] == target_user_id:
            updates["consistency"] = []
            updates["average_time"] = []

        if updates:
            user_collection.update_one({"_id": user["_id"]}, {"$set": updates})

    return {"status": "Users updated"}

from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from models.user import User
from config.database import user_collection
from schema.user_schemas import individual_user, list_user
from bson import ObjectId

user_router = APIRouter()

@user_router.get("/users/{id}")
async def get_user_winrate(id: str):
    user = user_collection.find_one({"_id": ObjectId(id)})
    wins = user.get("battle-stats", {}).get("wins", 0)
    lose = user.get("battle-stats", {}).get("lose", 0)
    right = user.get("battle-stats", {}).get("right", 0)
    wrong = user.get("battle-stats", {}).get("wrong", 0)
    finish = user.get("battle-stats", {}).get("finished_battle", 0)
    unfinish = user.get("battle-stats", {}).get("unfinished_battle", 0)
    average_time = user.get("battle-stats", {}).get("average_time", [])
    consistency = user.get("battle-stats", {}).get("consistency", [])

    
    if average_time:
        avg = sum(average_time) / len(average_time)
    else: avg = 0
    
    if consistency:
        cons = sum(consistency) / len(consistency)
    else: avg = 0
    
    return {"wins": wins, "lose": lose, "right": right, "wrong": wrong, "finish": finish, "unfinish": unfinish, "avg": avg, "cons": cons}

@user_router.get("/users/{id}/username")
async def ger_username(id: str):
    user = user_collection.find_one({"_id": ObjectId(id)})
    username = user.get("credentials", {}).get("username")
    
    return {"username": username}
    
@user_router.get("/users/")
async def get_users():
    users = list_user(user_collection.find())
    return users

@user_router.put("/users/{user_id}")
async def update_card(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"battle-stats.wins": 1}})
    
@user_router.put("/users/{user_id}/right")
async def update_card_right(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"battle-stats.right": 1}})
   
@user_router.put("/users/{user_id}/wrong")
async def update_card_wrong(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"battle-stats.wrong": 1}})   
   
@user_router.put("/users/{user_id}/finished_battle")
async def update_card_finished_battle(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"battle-stats.finished_battle": 1}})   
   
@user_router.put("/users/{user_id}/unfinished_battle")
async def update_card_unfinished_battle(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"battle-stats.unfinished_battle": 1}})   

@user_router.put("/users/{user_id}/average_time")
async def add_time(user_id: str, time: int = Query(...)):
    user_collection.find_one_and_update({"_id": ObjectId(user_id)}, {"$push": {"battle-stats.average_time": time}}, return_document=True)
  
@user_router.put("/users/{user_id}/consistency")
async def add_correct(user_id: str, correct: float = Query(...)):
    user_collection.find_one_and_update({"_id": ObjectId(user_id)}, {"$push": {"battle-stats.consistency": correct}}, return_document=True)
  
@user_router.get("/userss/")
async def update_users():
    for user in user_collection.find():
        updated_count = 0


        new_doc = {
            "credentials": {
            "username": user.get("username", ""),
            "email": user.get("email", ""),
            "title": user.get("title", ""),
            "hashed_password": user.get("hashed_password", "")
            },
        
            "battle-stats" : {
                "wins": user.get("wins", 0),
                "lose": user.get("lose", 0),
                "right": user.get("right", 0),
                "wrong": user.get("wrong", 0),
                "finished_battle": user.get("finished_battle", 0),
                "unfinished_batte": user.get("unfinished_batte", 0),
                "average_time": user.get("average_time", []),
                "consistency": user.get("consistency", []),
            },
            "created_at": user.get("created_at", datetime.utcnow())
        }
        
        user_collection.update_one(
            {"_id": user["_id"]},
            {
                "$set": new_doc,
                "$unset": {
                    "username": "",
                    "email": "",
                    "password": "",
                    "hashed_password": "",
                    "wins": "",
                    "lose": "",
                    "right": "",
                    "wrong": "",
                    "finished_battle": "",
                    "unfinished_battle": "",
                    "average_time": "",
                    "consistency": ""
                }
            }
        )
        updated_count += 1
        
    return{"message": f"{updated_count} user(s) migrated successfully."}

    #     if "right" not in user:
    #         updates["right"] = 0
    #     if "wrong" not in user:
    #         updates["wrong"] = 0
    #     if "finished_battle" not in user:
    #         updates["finished_battle"] = 0
    #     if "unfinished_battle" not in user:
    #         updates["unfinished_battle"] = 0
    #     if "average_time" not in user:
    #         updates["average_time"] = []
    #     if "email" not in user:
    #         updates["email"] = "email@gmail.com"
            
    #     updates["created_at"] = datetime.utcnow().isoformat() + "Z"
    #     if "password" in user:
    #         updates["hashed_password"] = user["password"]
    #         unset_fields["password"] = ''

    #     if updates:
    #         user_collection.update_one({"_id": user["_id"]}, {"$set": updates, "$unset": unset_fields})

    # return {"status": "Users updated"}

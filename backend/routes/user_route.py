from fastapi import APIRouter, HTTPException
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
    return {"wins": wins, "lose": lose}

@user_router.get("/users/")
async def get_users():
    users = list_user(user_collection.find())
    return users

@user_router.put("/users/{user_id}")
async def update_card(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"wins": 1}})
from fastapi import APIRouter, HTTPException, Response
from models.user import User
from config.database import user_collection
from schema.user_schemas import list_user, individual_user
from bson import ObjectId
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware

signup_router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated='auto')

@signup_router.get("/signup/")
async def get_users():
    users = list_user(user_collection.find())
    return users

@signup_router.get("/signup/{id}")
async def get_users(id: str):
    user = user_collection.find_one({"_id": ObjectId(id)})
    return individual_user(user)

@signup_router.post("/signup/", status_code=201)
async def create_user(user: User, response: Response):
    # Check if username or email already exists
    if user_collection.find_one({"username": user.credentials.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    if user_collection.find_one({"email": user.credentials.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password
    user.credentials.set_password(user.credentials.password)
    
    user_data = {
        "username": user.credentials.username,
        "email": user.credentials.email,
        "hashed_password": user.credentials.hashed_password,
        "created_at": user.created_at,
        "wins": user.battle_stats.wins,
        "lose": user.battle_stats.lose,
        "right": user.battle_stats.right,
        "wrong": user.battle_stats.wrong,
        "finished_battle": user.battle_stats.finished_battle,
        "unfinished_battle": user.battle_stats.unfinished_battle,
        "average_time": user.battle_stats.average_time,
        "consistency": user.battle_stats.consistency
    }
    
    result = user_collection.insert_one(user_data)
    
    # Set CORS headers
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return {
        "message": "User created successfully",
        "user_id": str(result.inserted_id),
        "username": user.credentials.username,
        "email": user.credentials.email
    }
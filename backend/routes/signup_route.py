from fastapi import APIRouter, HTTPException
from models.user import User
from config.database import user_collection
from schema.user_schemas import list_user, individual_user
from bson import ObjectId
from passlib.context import CryptContext

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

@signup_router.post("/signup/")
async def create_user(user: User):
    # Check if username or email already exists
    if user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password
    user.set_password(user.password)
    
    user_data = {
        "username": user.username,
        "email": user.email,
        "hashed_password": user.hashed_password,
        "created_at": user.created_at,
        "wins": user.wins,
        "lose": user.lose,
        "right": user.right,
        "wrong": user.wrong,
        "finished_battle": user.finished_battle,
        "unfinished_battle": user.unfinished_battle,
        "average_time": user.average_time,
        "consistency": user.consistency
    }
    
    result = user_collection.insert_one(user_data)
    
    return {
        "message": "User created successfully",
        "user_id": str(result.inserted_id),
        "username": user.username,
        "email": user.email
    }
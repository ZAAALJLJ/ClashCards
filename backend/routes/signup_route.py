from fastapi import APIRouter, HTTPException, status
from models.user import User, UserCreate
from config.database import user_collection
from schema.user_schemas import list_user, individual_user
from bson import ObjectId
from passlib.context import CryptContext
from typing import Dict, Any

signup_router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated='auto')

@signup_router.get("/users/")
async def get_users():
    users = list_user(user_collection.find())
    return users

@signup_router.get("/users/{id}")
async def get_user(id: str):
    user = user_collection.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return individual_user(user)

@signup_router.post("/signup/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate) -> Dict[str, Any]:
    # Check if username already exists
    if user_collection.find_one({"username": user.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Check if email already exists
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = pwd_context.hash(user.password)
    
    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "wins": 0,
        "lose": 0,
        "right": 0,
        "wrong": 0,
        "finished_battle": 0,
        "unfinished_battle": 0,
        "average_time": [],
        "consistency": []
    }
    
    result = user_collection.insert_one(user_data)
    
    return {
        "id": str(result.inserted_id),
        "username": user.username,
        "email": user.email,
        "message": "User created successfully"
    }
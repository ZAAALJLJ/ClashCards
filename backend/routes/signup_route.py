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
    if user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exsits")
    
    hashed_password = pwd_context.hash(user.password)
    
    user_data = {
         "username": user.username,
         "password": hashed_password
    }
    user_collection.insert_one(user_data)
    
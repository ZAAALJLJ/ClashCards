from fastapi import APIRouter, HTTPException
from models.user import User, LoginModel
from config.database import user_collection
from schema.user_schemas import individual_user
from bson import ObjectId
import bcrypt

login_router = APIRouter()

@login_router.post("/login/")
async def login_user(data: LoginModel):
    user = user_collection.find_one({"username": data.username})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    # Verify password using bcrypt
    password_bytes = data.password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    if not bcrypt.checkpw(password_bytes, user["hashed_password"].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    return {
        "message": "Login successful",
        "username": user["username"],
        "email": user["email"],
        "user_id": str(user["_id"])
    }
from fastapi import APIRouter, HTTPException
from models.user import User, LoginModel
from config.database import user_collection
from schema.user_schemas import individual_user
from bson import ObjectId
from passlib.context import CryptContext

login_router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@login_router.post("/login")
async def login_user(data: LoginModel):
    user = user_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    if not pwd_context.verify(data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    return {
        "message": "Login successful",
        "username": user["username"],
        "email": user["email"],
        "_id": str(user["_id"])
    }
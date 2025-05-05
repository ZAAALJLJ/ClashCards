from fastapi import APIRouter, HTTPException, status
from models.user import User, LoginModel
from config.database import user_collection
from schema.user_schemas import individual_user
from bson import ObjectId
from passlib.context import CryptContext
from typing import Dict, Any

login_router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@login_router.post("/login", response_model=Dict[str, Any])
async def login_user(data: LoginModel):
    # Find user by email
    user = user_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password
    if not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "message": "Login successful",
        "username": user["username"],
        "email": user["email"],
        "_id": str(user["_id"])
    }
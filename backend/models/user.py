from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, validator
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Credentials(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr # change to 254
    password: str = Field(..., min_length=6)
    hashed_password: str = ''
    
    @validator('password')
    def validate_password(cls, password):
        if not any(char.isupper() for char in password):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.islower() for char in password):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(char.isdigit() for char in password):
            raise ValueError('Password must contain at least one number')
        return password
    
    def set_password(self, password: str):
        # Ensure password is a string and handle edge cases
        if not isinstance(password, str):
            raise ValueError(f"Password must be a string, got {type(password)}")
        if len(password.encode('utf-8')) > 72:
            raise ValueError("Password cannot be longer than 72 bytes")
        self.hashed_password = pwd_context.hash(password)
        
    def verify_password(self, password: str) -> bool:
        if not self.hashed_password:
            return False
        return pwd_context.verify(password, self.hashed_password)
    
class BattleStats(BaseModel):
    wins: int = Field(default=0, ge=0)
    lose: int = Field(default=0, ge=0)
    right: int = Field(default=0, ge=0)
    wrong: int = Field(default=0, ge=0)
    finished_battle: int = Field(default=0, ge=0)
    unfinished_battle: int = Field(default=0, ge=0)
    average_time: List[int] = Field(default_factory=list)  # ((totaltime - timeleft) / totaltime) x 100
    consistency: List[int] = Field(default_factory=list)

class User(BaseModel):
    credentials: Credentials
    battle_stats: BattleStats = Field(default_factory=BattleStats)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
class LoginModel(BaseModel):
    username: str
    password: str

# class User(BaseModel):
#     username: str = Field(..., min_length=3, max_length=50)
#     email: EmailStr
#     password: str = Field(..., min_length=6)
#     hashed_password: str = ''
#     created_at: datetime = Field(default_factory=datetime.utcnow)
#     wins: int = Field(default=0, ge=0)
#     lose: int = Field(default=0, ge=0)
#     right: int = Field(default=0, ge=0)
#     wrong: int = Field(default=0, ge=0)
#     finished_battle: int = Field(default=0, ge=0)
#     unfinished_battle: int = Field(default=0, ge=0)
#     average_time: List[int] = Field(default_factory=list)  # ((totaltime - timeleft) / totaltime) x 100
#     consistency: List[int] = Field(default_factory=list)

#     @validator('password')
#     def hash_password(cls, password):
#         if not any(char.isupper() for char in password):
#             raise ValueError('Password must contain at least one uppercase letter')
#         if not any(char.islower() for char in password):
#             raise ValueError('Password must contain at least one lowercase letter')
#         if not any(char.isdigit() for char in password):
#             raise ValueError('Password must contain at least one number')
#         return password

#     def set_password(self, password: str):
#         self.hashed_password = bcrypt.hash(password)

#     def verify_password(self, password: str) -> bool:
#         if not self.hashed_password:
#             return False
#         return bcrypt.verify(password, self.hashed_password)
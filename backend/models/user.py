from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, validator
import re

class LoginModel(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str

    @validator('username')
    def username_alphanumeric(cls, v):
        if not re.match('^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username must be alphanumeric, and may include underscores and hyphens')
        return v

    @validator('password')
    def password_strength(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str
    wins: Optional[int] = 0
    lose: Optional[int] = 0
    right: int = 0
    wrong: int = 0
    finished_battle: int = 0
    unfinished_battle: int = 0
    average_time: List[int] = [] # ((totaltime - timeleft) / totaltime) x 100
    consistency: List[int] = []
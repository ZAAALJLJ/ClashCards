from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str
    wins: Optional[int] = 0
    lose: Optional[int] = 0
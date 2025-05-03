from typing import Optional
from pydantic import BaseModel
from typing import List

class LoginModel(BaseModel):
    username: str
    password: str

class User(BaseModel):
    username: str
    password: str
    wins: Optional[int] = 0
    lose: Optional[int] = 0
    right: int = 0
    wrong: int = 0
    finished_battle: int = 0
    unfinished_battle: int = 0
    average_time: List[int] = [] # ((totaltime - timeleft) / totaltime) x 100
    consistency: List[int] = []
    
    
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
    right: int
    wrong: int
    finished_battle: int
    unfinished_battle: int
    average_time: List[int] # ((totaltime - timeleft) / totaltime) x 100
    consistency: int
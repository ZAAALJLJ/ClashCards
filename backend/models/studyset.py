from pydantic import BaseModel
from typing import List

class Winner(BaseModel):
    name: str
    wins: str
    
class StudySet(BaseModel):
    owner_ids: List[str]
    title: str
    winners: List[Winner]
from pydantic import BaseModel
from typing import List

class StudySet(BaseModel):
    owner_ids: List[str]
    title: str
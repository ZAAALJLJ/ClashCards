from pydantic import BaseModel

class Flashcard(BaseModel):
    studyset_id: str
    question: str
    answer: str
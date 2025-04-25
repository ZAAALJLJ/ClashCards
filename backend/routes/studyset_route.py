from fastapi import APIRouter
from models.studyset import StudySet
from config.database import studyset_collection
from schema.schemas import list_studyset
from bson import ObjectId

studyset_router = APIRouter()

@studyset_router.get("/studysets")
async def get_studysets():
    studyset = list_studyset(studyset_collection.find())
    return studyset

@studyset_router.post("/studysets")
async def create_studyset(studyset: StudySet):
    studyset_collection.insert_one(dict(studyset))
    
@studyset_router.delete("/studysets/{id}")
async def delete_studyset(id: str):
    studyset_collection.find_one_and_delete({"_id": ObjectId(id)})
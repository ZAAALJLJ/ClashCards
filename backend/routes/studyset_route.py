from fastapi import APIRouter, Query
from models.studyset import StudySet
from config.database import studyset_collection
from schema.schemas import list_studyset, individual_studyset
from bson import ObjectId

studyset_router = APIRouter()

@studyset_router.get("/all_studysets/{id}")
async def get_studysets(id: str):
    studyset = list_studyset(studyset_collection.find({"owner_ids": id}))
    return studyset


@studyset_router.get("/studysets/{id}")
async def get_studysets(id: str):
    studyset = studyset_collection.find_one({"_id": ObjectId(id)})
    return individual_studyset(studyset)

@studyset_router.post("/studysets/")
async def create_studyset(studyset: StudySet):
    studyset_collection.insert_one(dict(studyset))
    
@studyset_router.delete("/studysets/{id}")
async def delete_studyset(id: str):
    studyset_collection.find_one_and_delete({"_id": ObjectId(id)})
    
@studyset_router.put("/studysets/{id}")
async def add_owner(id: str, user_id: str = Query(...)):
    studyset_collection.find_one_and_update({"_id": ObjectId(id)}, {"$addToSet": {"owner_ids": user_id}})
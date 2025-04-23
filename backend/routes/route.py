from fastapi import APIRouter
from models.flashcard import Flashcard
from config.database import flashcard_collection
from schema.schemas import list_flashcard
from bson import ObjectId

router = APIRouter()

# GET Request all cards
@router.get("/")
async def get_cards():
    flashcard = list_flashcard(flashcard_collection.find())
    return flashcard

@router.post("/")
async def create_cards(cards: Flashcard):
    flashcard_collection.insert_one(dict(cards))
    
@router.put("/{id}")
async def update_card(id: str, card: Flashcard):
    flashcard_collection.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(card)})
    
@router.delete("/{id}")
async def delete_card(id: str):
    flashcard_collection.find_one_and_delete({"_id": ObjectId(id)})
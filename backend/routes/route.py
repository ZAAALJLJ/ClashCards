from fastapi import APIRouter
from models.flashcard import Flashcard
from config.database import flashcard_collection
from schema.schemas import list_flashcard, individual_flashcard
from bson import ObjectId

router = APIRouter()

@router.get("/")
def read_root():
    return {"message": "Welcome to ClashCards API!"}


# GET Request all cards
@router.get("/flashcards/{studyset_id}")
async def get_cards(studyset_id: str):
    flashcard = list_flashcard(flashcard_collection.find({"studyset_id": studyset_id}))
    return flashcard

@router.get("/flashcard/{id}")
async def get_card(id: str):
    flashcard = flashcard_collection.find_one({"_id": ObjectId(id)})
    return individual_flashcard(flashcard)

@router.post("/flashcards")
async def create_cards(cards: Flashcard):
    flashcard_collection.insert_one(dict(cards))
    
@router.put("/flashcards/{id}")
async def update_card(id: str, card: Flashcard):
    flashcard_collection.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(card)})
    
@router.delete("/flashcards/{id}")
async def delete_card(id: str):
    flashcard_collection.find_one_and_delete({"_id": ObjectId(id)})
    
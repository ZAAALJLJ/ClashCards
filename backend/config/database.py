from pymongo import MongoClient

client = MongoClient("mongodb+srv://tigersharkz314:%40ono1froo@trial.0vmqxcy.mongodb.net/?retryWrites=true&w=majority&appName=Trial")
db = client.flashcard_db

flashcard_collection = db["flashcards"]
studyset_collection = db["studyset"]
user_collection = db["users"]

from pymongo import MongoClient
import os

# Read MongoDB connection string from environment for deployment,
# falling back to the existing hardcoded URI for local development.
MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb+srv://tigersharkz314:%40ono1froo@trial.0vmqxcy.mongodb.net/?retryWrites=true&w=majority&appName=Trial",
)

client = MongoClient(MONGODB_URI)
db = client.flashcard_db

flashcard_collection = db["flashcards"]
studyset_collection = db["studyset"]
user_collection = db["users"]

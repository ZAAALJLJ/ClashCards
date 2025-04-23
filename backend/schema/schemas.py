def individual_flashcard(flashcard) -> dict: # flashcard serializer
    return {
        "id": str(flashcard["_id"]),
        "question": flashcard["question"],
        "answer": flashcard["answer"]
    }
    
def list_flashcard(flashcards) -> list:
    return[individual_flashcard(flashcard) for flashcard in flashcards]
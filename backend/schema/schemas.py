
def individual_flashcard(flashcard) -> dict: # flashcard serializer
    return {
        "id": str(flashcard["_id"]),
        "question": flashcard["question"],
        "answer": flashcard["answer"],
        "studyset_id": str(flashcard["studyset_id"]),
    }
    
def list_flashcard(flashcards) -> list:
    return[individual_flashcard(flashcard) for flashcard in flashcards]

# LIPAT paggumana
def individual_studyset(studyset) -> dict: # serializer for frontend to understand
    return {
        "id": str(studyset["_id"]),
        "title": studyset["title"],
        "owner_ids": [str(oid) for oid in studyset.get("owner_ids", [])],  # safe default to empty list
    }
    
def list_studyset(studysets) -> list:
    return[individual_studyset(studyset) for studyset in studysets]
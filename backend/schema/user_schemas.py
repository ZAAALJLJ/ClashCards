
def individual_user(user) -> dict: # flashcard serializer
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "password": user["password"],
        "wins": user["wins"],
        "lose": user["lose"],
    }
    
def list_user(users) -> list:
    return[individual_user(user) for user in users]
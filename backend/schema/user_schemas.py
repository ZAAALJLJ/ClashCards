
def individual_user(user) -> dict: # flashcard serializer
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "password": user["password"],
    }
    
def list_user(users) -> list:
    return[individual_user(user) for user in users]

def individual_user(user) -> dict: # flashcard serializer
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "password": user["password"],
        "wins": user["wins"],
        "lose": user["lose"],
        "right": user.get("right", 0),
        "wrong": user.get("wrong", 0),
        "finished_battle": user.get("finished_battle", 0),
        "unfinished_battle": user.get("unfinished_battle", 0),
        "average_time": user.get("average_time", []),
        "consistency": user.get("consistency", 0)
    }

def list_user(users) -> list:
    return[individual_user(user) for user in users]
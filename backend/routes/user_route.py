from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from models.user import User
from config.database import user_collection
from schema.user_schemas import individual_user, list_user
from bson import ObjectId

user_router = APIRouter()

@user_router.get("/users/{id}")
async def get_user_winrate(id: str):
    user = user_collection.find_one({"_id": ObjectId(id)})
    wins = user.get("battle-stats", {}).get("wins", 0)
    lose = user.get("battle-stats", {}).get("lose", 0)
    right = user.get("battle-stats", {}).get("right", 0)
    wrong = user.get("battle-stats", {}).get("wrong", 0)
    finish = user.get("battle-stats", {}).get("finished_battle", 0)
    unfinish = user.get("battle-stats", {}).get("unfinished_battle", 0)
    average_time = user.get("battle-stats", {}).get("average_time", [])
    consistency = user.get("battle-stats", {}).get("consistency", [])

    
    if average_time:
        avg = sum(average_time) / len(average_time)
    else: avg = 0
    
    if consistency:
        cons = sum(consistency) / len(consistency)
    else: cons = 0
    return {"wins": wins, "lose": lose, "right": right, "wrong": wrong, "finish": finish, "unfinish": unfinish, "avg": avg, "cons": cons}

@user_router.get("/users/{id}/username")
async def ger_username(id: str):
    try:
        user = user_collection.find_one({"_id": ObjectId(id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    username = user.get("username")
    return {"username": username}
    
@user_router.get("/users/{id}/email")
async def get_email(id: str):
    try:
        user = user_collection.find_one({"_id": ObjectId(id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    username = user.get("email")
    return {"email": username}
    
@user_router.get("/users/")
async def get_users():
    users = list_user(user_collection.find())
    return users

@user_router.put("/users/{user_id}")
async def update_card(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"battle-stats.wins": 1}})
    
@user_router.put("/users/{user_id}/lose")
async def update_lose(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"battle-stats.lose": 1}})
    
@user_router.put("/users/{user_id}/right")
async def update_card_right(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"battle-stats.right": 1}})
   
@user_router.put("/users/{user_id}/wrong")
async def update_card_wrong(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"battle-stats.wrong": 1}})   
   
@user_router.put("/users/{user_id}/finished_battle")
async def update_card_finished_battle(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"battle-stats.finished_battle": 1}})   
   
@user_router.put("/users/{user_id}/unfinished_battle")
async def update_card_unfinished_battle(user_id: str):
    user_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"battle-stats.unfinished_battle": 1}})   

@user_router.put("/users/{user_id}/average_time")
async def add_time(user_id: str, time: int = Query(...)):
    user_collection.find_one_and_update({"_id": ObjectId(user_id)}, {"$push": {"battle-stats.average_time": time}}, return_document=True)
  
@user_router.put("/users/{user_id}/consistency")
async def add_correct(user_id: str, correct: float = Query(...)):
    user_collection.find_one_and_update({"_id": ObjectId(user_id)}, {"$push": {"battle-stats.consistency": correct}})

def calculate_performance_score(wins: int, right_answers: int, consistency: list, avg_time: list) -> dict:
    """Calculate a user's overall performance score based on various metrics
    
    This utility function computes a weighted performance score that could be used
    for future features like matchmaking or leaderboards. Does not affect any
    existing functionality as it's just a calculation helper.
    
    Args:
        wins (int): Number of battle wins
        right_answers (int): Number of correct answers
        consistency (list): List of consistency scores
        avg_time (list): List of average response times
        
    Returns:
        dict: Performance metrics including:
              - 'overall_score': weighted combination of all metrics
              - 'accuracy_rating': score based on right answers
              - 'speed_rating': score based on response times
              - 'consistency_rating': score based on consistency
    """
    # Calculate component scores (all normalized to 0-100 scale)
    win_score = min(100, wins * 5)  # Cap at 100
    
    accuracy_rating = (right_answers / (right_answers + 1)) * 100  # Avoid div by 0
    
    consistency_rating = 0
    if consistency:
        consistency_rating = sum(consistency) / len(consistency)
    
    speed_rating = 0
    if avg_time:
        # Convert time scores to 0-100 scale where lower times = higher scores
        speed_scores = [max(0, 100 - (t / 10)) for t in avg_time]
        speed_rating = sum(speed_scores) / len(speed_scores)
    
    # Calculate weighted overall score
    overall_score = (
        win_score * 0.3 +          # 30% weight for wins
        accuracy_rating * 0.3 +     # 30% weight for accuracy
        consistency_rating * 0.2 +   # 20% weight for consistency
        speed_rating * 0.2          # 20% weight for speed
    )
    
    return {
        'overall_score': round(overall_score, 2),
        'accuracy_rating': round(accuracy_rating, 2),
        'speed_rating': round(speed_rating, 2),
        'consistency_rating': round(consistency_rating, 2)
    }

@user_router.get("/userss/")
async def update_users():
    for user in user_collection.find():
        updated_count = 0


        new_doc = {
            "credentials": {
            "username": user.get("username", ""),
            "email": user.get("email", ""),
            "title": user.get("title", ""),
            "hashed_password": user.get("hashed_password", "")
            },
        
            "battle-stats" : {
                "wins": user.get("wins", 0),
                "lose": user.get("lose", 0),
                "right": user.get("right", 0),
                "wrong": user.get("wrong", 0),
                "finished_battle": user.get("finished_battle", 0),
                "unfinished_batte": user.get("unfinished_batte", 0),
                "average_time": user.get("average_time", []),
                "consistency": user.get("consistency", []),
            },
            "created_at": user.get("created_at", datetime.utcnow())
        }
        
        user_collection.update_one(
            {"_id": user["_id"]},
            {
                "$set": new_doc,
                "$unset": {
                    "username": "",
                    "email": "",
                    "password": "",
                    "hashed_password": "",
                    "wins": "",
                    "lose": "",
                    "right": "",
                    "wrong": "",
                    "finished_battle": "",
                    "unfinished_battle": "",
                    "average_time": "",
                    "consistency": ""
                }
            }
        )
        updated_count += 1
        
    return{"message": f"{updated_count} user(s) migrated successfully."}

    #     if "right" not in user:
    #         updates["right"] = 0
    #     if "wrong" not in user:
    #         updates["wrong"] = 0
    #     if "finished_battle" not in user:
    #         updates["finished_battle"] = 0
    #     if "unfinished_battle" not in user:
    #         updates["unfinished_battle"] = 0
    #     if "average_time" not in user:
    #         updates["average_time"] = []
    #     if "email" not in user:
    #         updates["email"] = "email@gmail.com"
            
    #     updates["created_at"] = datetime.utcnow().isoformat() + "Z"
    #     if "password" in user:
    #         updates["hashed_password"] = user["password"]
    #         unset_fields["password"] = ''

    #     if updates:
    #         user_collection.update_one({"_id": user["_id"]}, {"$set": updates, "$unset": unset_fields})

    # return {"status": "Users updated"}

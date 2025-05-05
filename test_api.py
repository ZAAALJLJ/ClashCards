import requests
import json

def test_signup():
    url = "http://127.0.0.1:8000/signup/"
    data = {
        "username": "test_user",
        "email": "test@example.com",
        "password": "Test@123!",
        "confirm_password": "Test@123!"
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_signup()

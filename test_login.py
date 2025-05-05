import requests
import json

def test_login():
    url = "http://127.0.0.1:8000/login"
    data = {
        "email": "test@example.com",
        "password": "Test@123!"
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_login()

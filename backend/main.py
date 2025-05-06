from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.route import router
from routes.signup_route import signup_router
from routes.websocket import websocket_router
from routes.studyset_route import studyset_router
from routes.login_route import login_router
from routes.user_route import user_router

app = FastAPI()

# Root route to check if API is running
@app.get("/")
async def root():
    return {"message": "ClashCards API is running"}

# allow CORS for frontend
origins = ['*']  # Allow all origins for development

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,  # Set to False since we're using '*' for origins
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

app.include_router(websocket_router)
app.include_router(router)
app.include_router(studyset_router)
app.include_router(signup_router)
app.include_router(login_router)
app.include_router(user_router)

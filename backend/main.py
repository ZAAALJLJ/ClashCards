from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.route import router
from routes.studyset_route import studyset_router

app = FastAPI()

# allow CORS for frontend
origins = [
    'http://localhost:5173',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(router)
app.include_router(studyset_router)

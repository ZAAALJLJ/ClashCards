from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost:3000',
    'http://localhost:5173',
] # allow CORS for frontend

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

def get_db(): # Session maker para sa db
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
dp_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)


from database import Base
from sqlalchemy import Column, Integer, String

class Card(Base):
    __tablename__ = "cards"
    
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String)
    answer = Column(String)
    
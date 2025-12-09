# # from sqlalchemy import Column, Integer, String, Text
# # from .database import Base
# from backend.database import Base
# from sqlalchemy import Column, Integer, String

# class Note(Base):
#     __tablename__ = "notes"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, nullable=False)
#     content = Column(Text, nullable=True)
# from sqlalchemy import Column, Integer, String
# from database import Base

# class Note(Base):
#     __tablename__ = "notes"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     content = Column(String)
from sqlalchemy import Column, Integer, String
from database import Base

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)


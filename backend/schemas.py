from pydantic import BaseModel

class NoteBase(BaseModel):
    title: str
    content: str | None = None

class NoteCreate(NoteBase):
    pass

class NoteOut(NoteBase):
    id: int

    class Config:
        orm_mode = True

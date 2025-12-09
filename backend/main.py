from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.database import Base, engine, SessionLocal
from backend.models import Note
from backend.schemas import NoteCreate, NoteOut

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/notes", response_model=list[NoteOut])
def get_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()

@app.post("/notes", response_model=NoteOut)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    new_note = Note(title=note.title, content=note.content)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}


@app.put("/notes/{note_id}", response_model=NoteOut)
def update_note(note_id: int, updated: NoteCreate, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(404, "Note not found")

    note.title = updated.title
    note.content = updated.content

    db.commit()
    db.refresh(note)
    return note

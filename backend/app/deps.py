from fastapi import Depends
from sqlalchemy.orm import Session
from . import auth, schemas, database, models

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(db: Session = Depends(get_db)):
    return db.query(models.User).order_by(models.User.id).first()

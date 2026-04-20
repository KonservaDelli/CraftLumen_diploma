from fastapi import FastAPI, Depends, HTTPException
from passlib.context import CryptContext
import models
import schemas
from database import engine, SessionLocal
from sqlalchemy.orm import Session

#автоматичне створення таблиць при запуску
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.get("/")
def read_root():
    return {"message": "Cosplay Manager API is running"}

#Тимчасове підключення до бд для кожного запиту
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#хешування паролю
@app.post("/register", response_model=schemas.UserOut)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Введена поштова адреса вже використовується!")
    hashed = pwd_context.hash(user_data.password)
    new_user = models.User(email=user_data.email, hashed_password=hashed)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
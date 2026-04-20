from fastapi import FastAPI, Depends, HTTPException, status
import models
import schemas
import tokens
from database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()

#Тимчасове підключення до бд для кожного запиту
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Cosplay Manager API is running"}

#логіка реєстрації
@app.post("/register", response_model=schemas.UserOut)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Введена поштова адреса вже використовується!")
    hashed = tokens.get_password_hash(user_data.password)
    new_user = models.User(email=user_data.email, hashed_password=hashed)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

#логіка входу
@app.post("/login")
def login(user_credentials: schemas.UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user or not tokens.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Невірна пошта або пароль"
        )

    access_token = tokens.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
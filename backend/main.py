from fastapi import FastAPI
from passlib.context import CryptContext

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.get("/")
def read_root():
    return {"message": "Cosplay Manager API is running"}

@app.post("/register")
def register(password: str):
    # Хешування пароля - те, що вимагав керівник
    hashed = pwd_context.hash(password)
    return {"hashed_password": hashed}
from fastapi import FastAPI, Depends, HTTPException, status, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import models
import schemas
import tokens
import os
import shutil
from database import engine, SessionLocal, Base
from sqlalchemy.orm import Session
from typing import List, Optional

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

#статична папка для зображень
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

#підключення до бд
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_slug(text: str) -> str:
    ukr_to_eng = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh', 'з': 'z',
        'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
        'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ь': '', 'ю': 'yu', 'я': 'ya', ' ': '-'
    }
    cleaned = text.lower().strip()
    slug = "".join([ukr_to_eng.get(char, char) for char in cleaned])
    import re
    slug = re.sub(r'[^a-z0-9-_]', '', slug)
    return re.sub(r'-+', '-', slug)

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

#логіка проєкту
@app.post("/api/projects", response_model=schemas.ProjectOut)
async def create_project(
    title: str = Form(...),
    endDate: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    project_slug = generate_slug(title)
    
    # Перевірка на унікальність слага
    existing = db.query(models.Project).filter(models.Project.slug == project_slug).first()
    if existing:
        import time
        project_slug = f"{project_slug}-{int(time.time())}"

    image_url = None
    if image:
        file_extension = os.path.splitext(image.filename)[1]
        filename = f"{project_slug}{file_extension}"
        file_path = os.path.join("uploads", filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"http://localhost:8000/uploads/{filename}"

    new_project = models.Project(
        title=title,
        slug=project_slug,
        end_date=endDate if endDate else None,
        image_url=image_url,
        progress=0
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

# логіка отримання ісіх проєктів
@app.get("/api/projects", response_model=List[schemas.ProjectOut])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).order_by(models.Project.id.desc()).all()

# логіка отримання одного проєкту
@app.get("/api/project/{slug}", response_model=schemas.ProjectOut)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проєкт не знайдено в базі даних")
    return project

# логіка видалення проєкту
@app.delete("/api/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проєкт не знайдено в базі даних")
    
    # видалення зображення з папки
    if project.image_url:
        filename = project.image_url.split("/")[-1]
        file_path = os.path.join("uploads", filename)
        if os.path.exists(file_path):
            os.remove(file_path)

    db.delete(project)
    db.commit()
    
    return None
from fastapi import FastAPI, Depends, HTTPException, status, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import json
import re
import uuid

# Ваші локальні файли
import models
import schemas
import tokens
from database import engine, SessionLocal
from ai_module import analyze_character_image

# Створення таблиць
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Статична папка для зображень
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Налаштування CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В розробці можна залишити так
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Підключення до БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_slug(text: str) -> str:
    ukr_to_eng = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh', 'з': 'z',
        'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
        'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ь': '', 'ю': 'yu', 'я': 'ya', ' ': '-'
    }
    cleaned = text.lower().strip()
    slug = "".join([ukr_to_eng.get(char, char) for char in cleaned])
    slug = re.sub(r'[^a-z0-9-_]', '', slug)
    return re.sub(r'-+', '-', slug)

@app.get("/")
def read_root():
    return {"message": "Cosplay Manager API is running"}

# Логіка реєстрації
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

# Логіка входу
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

# Логіка проєкту (ВИПРАВЛЕНО)
@app.post("/api/projects", response_model=schemas.ProjectOut)
async def create_project(
    title: str = Form(...),
    sections: str = Form("[]"),
    endDate: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    project_slug = generate_slug(title)
    image_url = None
    ai_data = None
    # 1. ОБРОБКА ЗОБРАЖЕННЯ ТА AI
    if image:
        # Генеруємо унікальне ім'я файлу
        file_extension = os.path.splitext(image.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join("uploads", file_name)
        
        # Читаємо контент один раз
        content = await image.read()
        
        # Зберігаємо файл на диск
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        # Формуємо URL для фронтенда
        image_url = f"http://localhost:8000/uploads/{file_name}"

        # ВИКЛИК AI (передаємо вже прочитаний контент)
        try:
            ai_data = analyze_character_image(content)
        except Exception as e:
            print(f"AI Error: {e}")

    # 2. СТВОРЕННЯ ОБ'ЄКТА ПРОЄКТУ
    new_project = models.Project(
        title=title,
        slug=project_slug,
        end_date=endDate,
        image_url=image_url,
        palette=json.dumps(ai_data["palette"]) if ai_data else "[]"
    )
    db.add(new_project)
    db.flush() # Отримуємо id проєкту

    # 3. ДОДАВАННЯ РОЗДІЛІВ ВІД AI (якщо вони є)
    if ai_data:
        for s_item in ai_data.get("sections", []):
            section = models.ProjectSection(title=s_item["title"], project_id=new_project.id)
            db.add(section)
            db.flush()
            
            for t_title in s_item.get("tasks", []):
                task = models.Task(title=t_title, section_id=section.id)
                db.add(task)

    # 4. ДОДАВАННЯ РОЗДІЛІВ ВІД КОРИСТУВАЧА (якщо прийшли з форми)
    try:
        user_sections = json.loads(sections)
        for item in user_sections:
            s_name = item.get("title") if isinstance(item, dict) else str(item)
            if s_name:
                new_section = models.ProjectSection(title=s_name, project_id=new_project.id)
                db.add(new_section)
    except Exception as e:
        print(f"Error parsing user sections: {e}")

    db.commit()
    db.refresh(new_project)
    return new_project

@app.get("/api/projects", response_model=List[schemas.ProjectOut])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).order_by(models.Project.id.desc()).all()

@app.get("/api/project/{slug}", response_model=schemas.ProjectOut)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проєкт не знайдено")
    return project

@app.delete("/api/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проєкт не знайдено")
    
    if project.image_url:
        filename = project.image_url.split("/")[-1]
        file_path = os.path.join("uploads", filename)
        if os.path.exists(file_path):
            os.remove(file_path)

    db.delete(project)
    db.commit()
    return None

@app.post("/api/tasks", response_model=schemas.TaskOut)
def add_task(task_data: schemas.TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(title=task_data.title, section_id=task_data.section_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.patch("/api/tasks/{task_id}/toggle")
def toggle_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404)
    task.completed = not task.completed
    db.commit()
    return {"status": "success", "completed": task.completed}
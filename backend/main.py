from fastapi import FastAPI, Depends, HTTPException, status, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from parser import scrape_concert_ua
from sqladmin import Admin, ModelView
from database import engine
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
import json
import re
import uuid

import models
import schemas
import tokens
from database import engine, SessionLocal
from ai_module import analyze_character_image, analyze_project_timemanagement

models.Base.metadata.create_all(bind=engine)
app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Статична папка для зображень
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Налаштування CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не вдалося валідувати авторизаційні дані",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, tokens.SECRET_KEY, algorithms=[tokens.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

class ExternalEventAdmin(ModelView, model=models.ExternalEvent):
    column_list = [models.ExternalEvent.id, models.ExternalEvent.title, models.ExternalEvent.start_date]
    column_searchable_list = [models.ExternalEvent.title]
    form_columns = [
        models.ExternalEvent.title, 
        models.ExternalEvent.description, 
        models.ExternalEvent.start_date, 
        models.ExternalEvent.display_date, 
        models.ExternalEvent.image_url, 
        models.ExternalEvent.event_url
    ]
    name = "Подія"
    name_plural = "Події афіші"
    icon = "fa-solid fa-calendar-days"

class UserAdmin(ModelView, model=models.User):
    column_list = [models.User.id, models.User.email, models.User.nickname, models.User.avatar_url]
    column_searchable_list = [models.User.email, models.User.nickname]
    form_columns = [
        models.User.email, 
        models.User.nickname, 
        models.User.avatar_url
    ]
    name = "Користувач"
    name_plural = "Користувачі"
    icon = "fa-solid fa-users"

admin = Admin(app, engine)
admin.add_view(ExternalEventAdmin)
admin.add_view(UserAdmin)


@app.get("/")
def read_root():
    return {"message": "Cosplay Manager API is running"}

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

@app.get("/api/profile")
def get_user_profile(current_user: models.User = Depends(get_current_user)):
    avatar_url = getattr(current_user, 'avatar_url', '') or ''
    user_nickname = current_user.nickname if current_user.nickname else current_user.email.split("@")[0]
    return {
        "nickname": user_nickname, 
        "email": current_user.email,
        "avatarUrl": avatar_url
    }

# Ендпоінт оновлення профілю
@app.put("/api/profile")
async def update_user_profile(
    email: str = Form(...),
    nickname: str = Form(...),
    password: Optional[str] = Form(None),
    avatar: Optional[UploadFile] = File(default=None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    current_user.email = email
    current_user.nickname = nickname
    if password and password.strip() != "" and password != "••••••••":
        current_user.hashed_password = tokens.get_password_hash(password)
  
    db.commit()
        
    if avatar and avatar.filename:
        file_extension = os.path.splitext(avatar.filename)[1]
        file_name = f"avatar_{current_user.id}_{uuid.uuid4().hex[:6]}{file_extension}"
        file_path = os.path.join("uploads", file_name)
        
        content = await avatar.read()
        with open(file_path, "wb") as buffer:
            buffer.write(content)
            
        current_user.avatar_url = f"http://localhost:8000/uploads/{file_name}"
        db.commit()
        db.refresh(current_user)
        
        return {
            "status": "success", 
            "message": "Профіль оновлено з аватаром", 
            "avatarUrl": current_user.avatar_url
        }
    
    return {
        "status": "success", 
        "message": "Профіль оновлено успішно",
        "avatarUrl": current_user.avatar_url or "" 
    }

# Решта роутів проєктів та завдань
@app.post("/api/projects", response_model=schemas.ProjectOut)
async def create_project(
    title: str = Form(...),
    sections: str = Form("[]"),
    endDate: Optional[str] = Form(None),
    event: Optional[str] = Form(None),  
    image: Optional[UploadFile] = File(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project_slug = generate_slug(title)
    image_url = None
    ai_data = None

    if image:
        file_extension = os.path.splitext(image.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join("uploads", file_name)
        
        content = await image.read()
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        image_url = f"http://localhost:8000/uploads/{file_name}"

        if sections.strip() == "[]" or not sections:
            try:
                ai_data = analyze_character_image(content)
            except Exception as e:
                print(f"Критична помилка при виклику AI: {e}")

    palette_json = "[]"
    if ai_data and "palette" in ai_data:
        palette_json = json.dumps(ai_data["palette"])

    new_project = models.Project(
        title=title,
        slug=project_slug,
        end_date=endDate if endDate else None,
        event_name=event if event else None,  
        image_url=image_url,
        palette=palette_json,
        user_id=current_user.id
    )
    db.add(new_project)
    db.flush() 

    if ai_data and "sections" in ai_data:
        for s_item in ai_data["sections"]:
            section = models.ProjectSection(
                title=s_item.get("title", "Новий розділ"), 
                project_id=new_project.id
            )
            db.add(section)
            db.flush()
            
            for t_title in s_item.get("tasks", []):
                task = models.Task(title=t_title, section_id=section.id)
                db.add(task)

    else:
        try:
            user_sections = json.loads(sections)
            for item in user_sections:
                s_name = item.get("title") if isinstance(item, dict) else str(item)
                if s_name:
                    new_section = models.ProjectSection(title=s_name, project_id=new_project.id)
                    db.add(new_section)
                    db.flush()
                    
                    if isinstance(item, dict) and "tasks" in item:
                        for t_item in item.get("tasks", []):
                            t_title = t_item.get("title") if isinstance(t_item, dict) else str(t_item)
                            if t_title:
                                task = models.Task(title=t_title, section_id=new_section.id)
                                db.add(task)
        except Exception as e:
            print(f"Помилка парсингу ручних секцій: {e}")
            
    db.commit()
    db.refresh(new_project)
    return new_project

@app.get("/api/projects", response_model=List[schemas.ProjectOut])
def get_projects(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(models.Project)
        .filter(models.Project.user_id == current_user.id)
        .order_by(models.Project.id.desc())
        .all()
    )

@app.get("/api/project/{slug}", response_model=schemas.ProjectOut)
def get_project_by_slug(
    slug: str, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = (
        db.query(models.Project)
        .options(
            joinedload(models.Project.sections).joinedload(models.ProjectSection.tasks),
            joinedload(models.Project.notebook_items),
            joinedload(models.Project.url_links)
        )
        .filter(models.Project.slug == slug, models.Project.user_id == current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Проєкт не знайдено")
    return project

@app.delete("/api/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = (
        db.query(models.Project)
        .filter(models.Project.id == project_id, models.Project.user_id == current_user.id)
        .first()
    )
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
    new_task = models.Task(
        title=task_data.title, 
        section_id=task_data.section_id,
        start_date=task_data.start_date,
        end_date=task_data.end_date
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.patch("/api/tasks/{task_id}/toggle")
def toggle_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Завдання не знайдено")
    task.completed = not task.completed
    db.commit()
    db.refresh(task) 
    return {"status": "success", "completed": task.completed}

@app.post("/api/fetch-external-events")
def fetch_external_events(db: Session = Depends(get_db)):
    scrape_concert_ua(db)
    return {"status": "success", "message": "Парсинг завершено"}

@app.get("/api/external-events", response_model=List[schemas.ExternalEventOut])
def get_external_events(db: Session = Depends(get_db)):
    return db.query(models.ExternalEvent).order_by(models.ExternalEvent.id.desc()).all()


@app.post("/api/project/{project_id}/ai-schedule")
def generate_ai_schedule(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проєкт не знайдено")
        
    all_tasks = []
    
    for section in project.sections:
        for task in section.tasks:
            if not task.completed:
                all_tasks.append(task.title.strip())
                
    if not all_tasks:
        return {"status": "skipped", "message": "Немає активних завдань", "recommendations": {}}
        
    ai_dates = analyze_project_timemanagement(project.title, project.end_date, all_tasks)
    ai_dates_clean = {str(k).strip().lower(): v for k, v in ai_dates.items()}
    return {
        "status": "success", 
        "message": "Рекомендації згенеровано",
        "recommendations": ai_dates_clean
    }

@app.patch("/api/tasks/{task_id}", response_model=schemas.TaskOut)
def update_task_dates(task_id: int, task_data: schemas.TaskUpdateDates, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Завдання не знайдено")

    task.start_date = task_data.start_date
    task.end_date = task_data.end_date
    
    db.commit()
    db.refresh(task)
    return task

@app.patch("/api/project/{project_id}/event", response_model=schemas.ProjectOut)
def update_project_event(project_id: int, data: schemas.ProjectEventUpdate, db: Session = Depends(get_db)):
    project = (
        db.query(models.Project)
        .options(joinedload(models.Project.sections).joinedload(models.ProjectSection.tasks))
        .filter(models.Project.id == project_id)
        .first()
    )
    
    if not project:
        raise HTTPException(status_code=404, detail="Проєкт не знайдено")
    
    if data.event_name is None or data.event_name.strip() == "" or data.event_name == "Без події":
        project.event_name = None
    else:
        project.event_name = data.event_name
        
    db.commit()
    db.refresh(project)
    return project

#роут додавання нотатки
@app.post("/api/notebook", response_model=schemas.NotebookItemOut)
def add_notebook_item(data: schemas.NotebookItemCreate, db: Session = Depends(get_db)):
    item = models.ProjectNotebookItem(text=data.text, project_id=data.project_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@app.delete("/api/notebook/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notebook_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.ProjectNotebookItem).filter(models.ProjectNotebookItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Елемент не знайдено")
    db.delete(item)
    db.commit()
    return None

#роут додавання корисного посилання
@app.post("/api/url-links", response_model=schemas.UrlLinkOut)
def add_url_link(data: schemas.UrlLinkCreate, db: Session = Depends(get_db)):
    link = models.ProjectUrlLink(title=data.title, url=data.url, project_id=data.project_id)
    db.add(link)
    db.commit()
    db.refresh(link)
    return link

@app.delete("/api/url-links/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_url_link(link_id: int, db: Session = Depends(get_db)):
    link = db.query(models.ProjectUrlLink).filter(models.ProjectUrlLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Посилання не знайдено")
    db.delete(link)
    db.commit()
    return None

@app.delete("/api/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Завдання не знайдено")
    
    db.delete(task)
    db.commit()
    return None

#роут додавання розділу завдань
@app.post("/api/sections", response_model=schemas.SectionOut)
def create_section(data: schemas.SectionCreate, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проєкт не знайдено")
        
    new_section = models.ProjectSection(title=data.title, project_id=data.project_id)
    db.add(new_section)
    db.commit()
    db.refresh(new_section)
    new_section.tasks = []
    return new_section

@app.patch("/api/sections/{section_id}", response_model=schemas.SectionOut)
def update_section_title(section_id: int, data: schemas.ProjectEventUpdate, db: Session = Depends(get_db)):
    section = db.query(models.ProjectSection).filter(models.ProjectSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Розділ не знайдено")
    
    if data.event_name:
        section.title = data.event_name
    db.commit()
    db.refresh(section)
    return section

@app.delete("/api/sections/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_section(section_id: int, db: Session = Depends(get_db)):
    section = db.query(models.ProjectSection).filter(models.ProjectSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Розділ не знайдено")
    
    db.delete(section)
    db.commit()
    return None

def get_project_by_id(project_id: int, db: Session):
    return (
        db.query(models.Project)
        .options(joinedload(models.Project.sections).joinedload(models.ProjectSection.tasks))
        .filter(models.Project.id == project_id)
        .first()
    )

@app.patch("/api/project/{project_id}/title", response_model=schemas.ProjectOut)
def update_project_title(project_id: int, data: schemas.ProjectEventUpdate, db: Session = Depends(get_db)):
    project = get_project_by_id(project_id, db)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if data.event_name and data.event_name.strip():
        project.title = data.event_name.strip()
        project.slug = generate_slug(project.title)
    
    db.commit()
    db.refresh(project)
    return project

@app.patch("/api/project/{project_id}/end-date", response_model=schemas.ProjectOut)
def update_project_end_date(project_id: int, data: schemas.TaskUpdateDates, db: Session = Depends(get_db)):
    project = get_project_by_id(project_id, db)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if data.end_date:
        project.end_date = data.end_date
    else:
        project.end_date = None
    
    db.commit()
    db.refresh(project)
    return project

@app.patch("/api/project/{project_id}/image", response_model=schemas.ProjectOut)
async def update_project_image(
    project_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    project = get_project_by_id(project_id, db)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found") 
    if project.image_url:
        filename = project.image_url.split("/")[-1]
        file_path = os.path.join("uploads", filename)
        if os.path.exists(file_path):
            os.remove(file_path)

    file_extension = os.path.splitext(image.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join("uploads", file_name)
    
    content = await image.read()
    with open(file_path, "wb") as buffer:
        buffer.write(content)
    project.image_url = f"http://localhost:8000/uploads/{file_name}"
        
    db.commit()
    db.refresh(project)
    return project

from pydantic import BaseModel
from typing import List, Optional

class UserCreate(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    class Config:
        from_attributes = True
        
class TaskBase(BaseModel):
    title: str
    completed: bool = False

class TaskOut(TaskBase):
    id: int
    class Config:
        from_attributes = True

class SectionOut(BaseModel):
    id: int
    title: str
    tasks: List[TaskOut] = []
    class Config:
        from_attributes = True

class ProjectOut(BaseModel):
    id: int
    title: str
    slug: str
    image_url: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    progress: int
    sections: List[SectionOut] = [] # Тепер це список об'єктів

    class Config:
        from_attributes = True

# Для створення завдання
class TaskCreate(BaseModel):
    title: str
    section_id: int
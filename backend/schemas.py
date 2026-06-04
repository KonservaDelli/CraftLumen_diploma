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
    start_date: Optional[str] = None  
    end_date: Optional[str] = None    

class TaskCreate(BaseModel):
    title: str
    section_id: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class TaskOut(TaskBase):
    id: int
    class Config:
        from_attributes = True
# Додайте в schemas.py

class NotebookItemBase(BaseModel):
    text: str

class NotebookItemCreate(NotebookItemBase):
    project_id: int

class NotebookItemOut(NotebookItemBase):
    id: int
    class Config:
        from_attributes = True

class UrlLinkBase(BaseModel):
    title: str
    url: str

class UrlLinkCreate(UrlLinkBase):
    project_id: int

class UrlLinkOut(UrlLinkBase):
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
    sections: List[SectionOut] = []
    palette: Optional[str] = None
    event_name: Optional[str] = None
    notebook_items: List[NotebookItemOut] = []
    url_links: List[UrlLinkOut] = []
    class Config:
        from_attributes = True

class ExternalEventOut(BaseModel):
    id: int
    title: str
    description: str
    start_date: str
    display_date: str
    image_url: Optional[str] = None
    event_url: Optional[str] = None
    class Config:
        from_attributes = True

class TaskUpdateDates(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class ProjectEventUpdate(BaseModel):
    event_name: Optional[str] = None

class SectionCreate(BaseModel):
    title: str
    project_id: int
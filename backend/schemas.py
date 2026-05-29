from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

# Передача фронтенду даних про проєкт
class ProjectOut(BaseModel):
    id: int
    title: str
    slug: str
    image_url: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    progress: int
    sections: Optional[str] = None

    class Config:
        from_attributes = True
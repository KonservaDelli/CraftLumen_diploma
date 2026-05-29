from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    image_url = Column(String, nullable=True)
    start_date = Column(String, default=lambda: datetime.datetime.now().strftime("%d.%m.%Y"))
    end_date = Column(String, nullable=True)
    progress = Column(Integer, default=0)
    
    # Зв'язок з розділами
    sections = relationship("ProjectSection", back_populates="project", cascade="all, delete-orphan")

class ProjectSection(Base):
    __tablename__ = "project_sections"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    project_id = Column(Integer, ForeignKey("projects.id"))
    
    project = relationship("Project", back_populates="sections")
    tasks = relationship("Task", back_populates="section", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    completed = Column(Boolean, default=False)
    section_id = Column(Integer, ForeignKey("project_sections.id"))
    
    section = relationship("ProjectSection", back_populates="tasks")
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar_url = Column(String, default="")
    nickname = Column(String, default="")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user = relationship("User", back_populates="projects")
    title = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    image_url = Column(String, nullable=True)
    start_date = Column(String, default=lambda: datetime.datetime.now().strftime("%d.%m.%Y"))
    end_date = Column(String, nullable=True)
    progress = Column(Integer, default=0)
    palette = Column(String, nullable=True)
    event_name = Column(String, nullable=True)
    sections = relationship("ProjectSection", back_populates="project", cascade="all, delete-orphan")
    notebook_items = relationship("ProjectNotebookItem", back_populates="project", cascade="all, delete-orphan")
    url_links = relationship("ProjectUrlLink", back_populates="project", cascade="all, delete-orphan")

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
    start_date = Column(String, nullable=True)  
    end_date = Column(String, nullable=True)
    section_id = Column(Integer, ForeignKey("project_sections.id"))
    section = relationship("ProjectSection", back_populates="tasks")
    
class ExternalEvent(Base):
    __tablename__ = "external_events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    start_date = Column(String)  
    display_date = Column(String) 
    image_url = Column(String, nullable=True)
    event_url = Column(String, nullable=True)

class ProjectNotebookItem(Base):
    __tablename__ = "project_notebook_items"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    project = relationship("Project", back_populates="notebook_items")

class ProjectUrlLink(Base):
    __tablename__ = "project_url_links"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    project = relationship("Project", back_populates="url_links")
    
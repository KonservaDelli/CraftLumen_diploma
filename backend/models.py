from sqlalchemy import Column, Integer, String, DateTime
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
    sections = Column(String, nullable=True)
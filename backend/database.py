from sqlalchemy import create_all_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#Адреса бази
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@db:5432/cosplay_db"

#Двигун
engine = create_engine(SQLALCHEMY_DATABASE_URL)

#Створення сесії для запитів
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Базовий клас для майбутніх таблиць
Base = declarative_base()
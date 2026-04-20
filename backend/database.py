from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import time

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@db:5432/cosplay_db"
#очікування поки хост підніметься
for i in range(10):
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        engine.connect()
        print("Хост підключен")
        break
    except Exception as e:
        time.sleep(2)
else:
    raise Exception("Не можливо підключитись до хосту")
#Двигун
engine = create_engine(SQLALCHEMY_DATABASE_URL)

#Створення сесії для запитів
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Базовий клас для майбутніх таблиць
Base = declarative_base()
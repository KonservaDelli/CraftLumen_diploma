import time
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Очікування підключення до бази (особливо важливо для Docker)
for i in range(10):
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        engine.connect()
        print("Хост підключено успішно")
        break
    except Exception as e:
        print(f"Очікування бази даних... ({i+1}/10)")
        time.sleep(2)
else:
    raise Exception("Не вдалося підключитись до бази даних")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
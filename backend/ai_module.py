import google.generativeai as genai
import os
import json
import re
import datetime
from dotenv import load_dotenv
from typing import List, Optional

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_character_image(image_bytes: bytes):
    model = genai.GenerativeModel('gemini-flash-latest')
    prompt = """
    Аналізуй зображення персонажа для косплею. Твоє завдання:
    1. Розпізнай всі елементи одягу та аксесуари.
    2. Згрупуй їх у загальні РОЗДІЛИ (наприклад: "Верх", "Низ", "Взуття", "Перука та макіяж", "Аксесуари", "Зброя").
    3. Для кожного розділу напиши узагальнені ЗАВДАННЯ (наприклад: "Створити шорти", "Стилізувати перуку"). 
       Важливо: завдання мають бути загальними діями.
    4. Визнач 5 основних кольорів персонажа. Ігноруй тіні та світлові бліки, вибирай чистий локальний колір. 
       Поверни HEX та дуже коротку назву деталі (напр. "плащ", "окуляри").

    Поверни ВІДПОВІДЬ ТІЛЬКИ У ФОРМАТІ JSON без зайвих слів:
    {
      "sections": [
        {"title": "Назва розділу", "tasks": ["Завдання 1", "Завдання 2"]}
      ],
      "palette": [
        {"color": "#HEXCODE", "label": "деталь"}
      ]
    }
    """

    response = model.generate_content([
        prompt,
        {"mime_type": "image/jpeg", "data": image_bytes}
    ])
    text_response = response.text
    clean_json = re.sub(r'```json|```', '', text_response).strip()

    try:
        return json.loads(clean_json)
    except Exception as e:
        print(f"Помилка від ШІ аналізатора: {e}")
        return {"sections": [], "palette": []}


def analyze_page_with_ai(text_content: str):
    model = genai.GenerativeModel('gemini-flash-latest')
    
    prompt = f"""
    Проаналізуй витягнутий текст із сайту фестивалю чи сторінки організатора косплей-заходів в Україні. 
    Твоє завдання — знайти та структурувати головні дані про подію.

    Знайди:
    1. Офіційну назву події (title). Якщо конкретної назви немає, напиши "Косплей Фестиваль".
    2. Дуже короткий, але захопливий опис події (description) українською мовою довжиною до 150-160 символів. Обов'язково згадай, що це косплей/гік захід, аніме-фест чи ярмарок.
    3. Дату події (date). Шукай згадки дат у форматі дня та місяця (наприклад, "15 серпня", "24-25 жовтня 2026"). Якщо дати взагалі немає, поверни порожній рядок.

    Поверни ВІДПОВІДЬ ТІЛЬКИ У ФОРМАТІ JSON без будь-яких markdown-тегів чи зайвих слів:
    {{
      "title": "Назва фестивалю",
      "description": "Короткий опис події для картки афіші.",
      "date": "знайдена дата або текст"
    }}

    Текст із сайту для аналізу:
    {text_content}
    """

    try:
        response = model.generate_content(prompt)
        text_response = response.text
        clean_json = re.sub(r'```json|```', '', text_response).strip()
        data = json.loads(clean_json)
        return data
    except Exception as e:
        print(f"Помилка ШІ під час аналізу тексту сайту: {e}")
        return {
            "title": "Косплей Фестиваль",
            "description": "Тематична косплей-подія. Деталі програми та квитки дивіться на сайті організатора.",
            "date": ""
        }
    
def analyze_project_timemanagement(title: str, end_date: Optional[str], tasks: List[str]):
    if not tasks:
        return {}
        
    model = genai.GenerativeModel('gemini-flash-latest')
    current_date = datetime.datetime.now().strftime("%d.%m.%Y")
    
    # Якщо дедлайну проєкту немає, плануємо на місяць
    if not end_date or end_date.strip() == "":
        calculated_end = (datetime.datetime.now() + datetime.timedelta(days=30)).strftime("%d.%m.%Y")
        deadline_info = f"{calculated_end} (автоматично розраховано на 1 місяць, бо користувач не вказав дедлайн проєкту)"
    else:
        deadline_info = end_date

    prompt = f"""
    Ти — ШІ Експерт із тайм-менеджменту косплей-проєктів.
    Сьогоднішня дата (старт проєкту): {current_date}.
    Назва проєкту: {title}.
    Фінальний дедлайн всього проєкту: {deadline_info}.
    
    Ось список завдань, для яких тобі потрібно РЕКОМЕНДУВАТИ та РОЗПОДІЛИТИ індивідуальні дати виконання:
    {json.dumps(tasks, ensure_ascii=False)}
    
    Твоє завдання:
    1. Проаналізуй логіку виконання (наприклад, закупівля матеріалів та перуки — спочатку, крафт і пошиття — в середині, стайлінг перуки та підгонка — в кінці).
    2. Для КОЖНОГО завдання зі списку придумай реалістичну дату дедлайну (end_date).
    3. Дати мають бути в діапазоні від сьогодні ({current_date}) до фінального дедлайну ({deadline_info}). Розподіляй їх рівномірно.
    4. Поверни дати ТІЛЬКИ у форматі "DD.MM.YYYY".
    
    Поверни відповідь СУВОРО У ФОРМАТІ JSON без markdown-тегів ```json чи будь-якого тексту:
    {{
      "Назва завдання 1": "DD.MM.YYYY",
      "Назва завдання 2": "DD.MM.YYYY"
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        clean_json = re.sub(r'```json|```', '', response.text).strip()
        return json.loads(clean_json)
    except Exception as e:
        print(f"Помилка ШІ тайм-менеджера: {e}")
        fallback_schedule = {}
        start_dt = datetime.datetime.now()
        for idx, task in enumerate(tasks):
            future_date = start_dt + datetime.timedelta(days=(idx + 1) * 3)
            fallback_schedule[task] = future_date.strftime("%d.%m.%Y")
        return fallback_schedule
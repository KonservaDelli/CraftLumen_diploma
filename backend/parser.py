import datetime
import re
import json
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session
import models

try:
    from ai_module import analyze_page_with_ai  
except ImportError:
    analyze_page_with_ai = None

def parse_ukrainian_date(date_text):
    if not date_text:
        return datetime.date.today().strftime("%d.%m.%Y")
    date_text = date_text.lower().strip()
    months = {
        "січ": "01", "лют": "02", "берез": "03", "квіт": "04", "трав": "05", "черв": "06",
        "лип": "07", "серп": "08", "верес": "09", "жовт": "10", "лист": "11", "груд": "12"
    }
    try:
        day_match = re.search(r'\d+', date_text)
        if not day_match: return datetime.date.today().strftime("%d.%m.%Y")
        day = int(day_match.group())
        month_str = "01"
        for m_name, m_num in months.items():
            if m_name in date_text:
                month_str = m_num
                break
        year_match = re.search(r'202\d', date_text)
        year_str = year_match.group() if year_match else "2026"
        return f"{day:02d}.{month_str}.{year_str}"
    except Exception:
        return datetime.date.today().strftime("%d.%m.%Y")

def scrape_concert_ua(db: Session):
    """
    Нова логіка: збирає дані з власної бази сайтів організаторів косплей-руху України
    """
    print("Запуск інтелектуального парсингу за базою організаторів...")

    ORGANIZERS_SITES = [
        "https://fancon.ua/about/",
        "https://www.dicecon.fun/",
        "https://linktr.ee/hebihebi_agency",
        "https://asianwave.com.ua/about",
        "https://allmor.com.ua/",
        "https://comicwave.exclusive.ua/#about",
    ]
    print("Запуск браузера Playwright...")
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
            page = browser.new_page()
            page.set_viewport_size({"width": 1400, "height": 900})
            
            parsed_count = 0

            for url in ORGANIZERS_SITES:
                try:
                    print(f"Скануємо сайт організатора: {url}")
                    page.goto(url, wait_until="networkidle", timeout=30000)
                    page.wait_for_timeout(2000)
                    html = page.content()
                    soup = BeautifulSoup(html, "html.parser")
                    
                    for script in soup(["script", "style"]):
                        script.decompose()
                    page_text = soup.get_text(separator=" ", strip=True)
                    page_text_preview = page_text[:4000] 

                    img_url = None
                    meta_img = soup.find("meta", property="og:image")
                    if meta_img and meta_img.get("content"):
                        img_url = meta_img["content"]
                    
                    if not img_url:
                        img_el = soup.select_one("main img, header img, #banner img, [class*='banner'] img")
                        if img_el:
                            img_url = img_el.get("src") or img_el.get("data-src")

                    if img_url and img_url.startswith("/"):
                        img_url = url.rstrip('/') + img_url
                    title, description, raw_date = None, None, ""
                    
                    if analyze_page_with_ai and len(page_text_preview) > 100:
                        print("ШІ аналізує контент сайту...")
                        ai_data = analyze_page_with_ai(page_text_preview)
                        if ai_data:
                            title = ai_data.get("title")
                            description = ai_data.get("description")
                            raw_date = ai_data.get("date", "")
                    if not title:
                        title = soup.find("h1").text.strip() if soup.find("h1") else "Косплей Подія"
                    if not description:
                        description = page_text_preview[:160] + "..."
                    
                    exists = db.query(models.ExternalEvent).filter(models.ExternalEvent.event_url == url).first()
                    if exists:
                        print(f"Подія з сайту {url} вже внесена: {exists.title}")
                        continue

                    formatted_date = parse_ukrainian_date(raw_date)

                    new_event = models.ExternalEvent(
                        title=title,
                        description=description[:167] + "..." if len(description) > 170 else description,
                        start_date=formatted_date,
                        display_date=formatted_date,
                        image_url=img_url, 
                        event_url=url
                    )
                    db.add(new_event)
                    db.commit()
                    parsed_count += 1
                    print(f"Успішно додано через ШІ: {title} | Дата: {formatted_date}")

                except Exception as site_err:
                    print(f"Помилка обробки сайту {url}: {site_err}")
                    continue

            browser.close()
            print(f"Скан бази сайтів завершено! Оновлено подій: {parsed_count}")
            
    except Exception as e:
        print(f"Критична помилка Playwright: {e}")

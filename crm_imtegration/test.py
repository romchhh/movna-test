import requests
import json
from typing import List, Dict, Optional

# Конфігурація
API_KEY = "NTcwMTFlMmExZWE4M2Q3MGU5NTlhMjVmNmEzNTdiODA2NjMyY2FkMQ"
BASE_URL = "https://openapi.keycrm.app/v1"

# Заголовки для авторизації
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Accept": "application/json"
}

# Статуси, які нас цікавлять
TARGET_STATUSES = {
    295: "Проходження тесту",
    417: "Пройшли тест"
}

def get_leads_by_status(status_id: int, status_name: str) -> List[Dict]:
    """
    Отримує всі ліди для конкретного статусу з усіма полями
    
    Args:
        status_id: ID статусу
        status_name: Назва статусу
    """
    all_leads = []
    page = 1
    limit = 50
    
    print(f"\n{'=' * 80}")
    print(f"📋 ОТРИМАННЯ ЛІДІВ: {status_name} (ID статусу: {status_id})")
    print(f"{'=' * 80}\n")
    
    while True:
        url = f"{BASE_URL}/pipelines/cards"
        params = {
            "page": page,
            "limit": limit,
            "filter[status_id]": status_id,
            # Підключаємо всі можливі асоціації
            "include": "contact.client,products.offer,manager,status,payments,custom_fields"
        }
        
        try:
            response = requests.get(url, headers=headers, params=params)
            
            if response.status_code == 401:
                print("❌ Помилка авторизації. Перевірте API ключ.")
                return None
            
            if response.status_code == 400:
                error_data = response.json()
                print(f"❌ Помилка: {error_data.get('message', 'Невідома помилка')}")
                return None
            
            response.raise_for_status()
            data = response.json()
            
            leads = data.get('data', [])
            if not leads:
                break
            
            all_leads.extend(leads)
            
            # Інформація про пагінацію
            if page == 1:
                total = data.get('total', 0)
                print(f"📊 Всього лідів у статусі: {total}")
                if total > 0:
                    print(f"{'─' * 80}")
            
            if not data.get('next_page_url'):
                break
            
            page += 1
            
        except Exception as e:
            print(f"❌ Помилка: {e}")
            return None
    
    return all_leads

def print_lead_info(lead: Dict, index: int):
    """
    Виводить детальну інформацію про лід
    """
    print(f"\n{'🎯' if index == 1 else '📌'} ЛІД #{index}")
    print(f"{'─' * 80}")
    
    # Основна інформація
    print(f"   ID картки:           {lead.get('id')}")
    print(f"   Назва:               {lead.get('title', 'Без назви')}")
    print(f"   ID контакту:         {lead.get('contact_id')}")
    print(f"   ID менеджера:        {lead.get('manager_id')}")
    print(f"   ID статусу:          {lead.get('status_id')}")
    print(f"   ID джерела:          {lead.get('source_id')}")
    
    # Цільова інформація
    target_type = lead.get('target_type', '-')
    target_id = lead.get('target_id', '-')
    print(f"   Тип цілі:            {target_type}")
    print(f"   ID цілі:             {target_id}")
    
    # Коментар менеджера
    manager_comment = lead.get('manager_comment', '-')
    if manager_comment and manager_comment != '-':
        print(f"   Коментар менеджера:  {manager_comment}")
    
    # UTM мітки
    utm_fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    utm_data = {field: lead.get(field) for field in utm_fields if lead.get(field)}
    if utm_data:
        print(f"\n   📊 UTM мітки:")
        for key, value in utm_data.items():
            print(f"      {key}: {value}")
    
    # Дати
    print(f"\n   📅 Дати:")
    print(f"      Створено:              {lead.get('created_at', '-')}")
    print(f"      Оновлено:              {lead.get('updated_at', '-')}")
    print(f"      Зміна статусу:         {lead.get('status_changed_at', '-')}")
    print(f"      Комунікація:           {lead.get('communicate_at', '-')}")
    print(f"      Завершено:             {lead.get('is_finished', 'Ні')}")
    
    # Контакт
    contact = lead.get('contact')
    if contact:
        print(f"\n   👤 Контакт:")
        print(f"      ID:                    {contact.get('id')}")
        print(f"      Ім'я:                  {contact.get('full_name', '-')}")
        print(f"      Email:                 {contact.get('email', '-')}")
        print(f"      Телефон:               {contact.get('phone', '-')}")
        print(f"      Соц. мережа:           {contact.get('social_name', '-')}")
        print(f"      Соц. ID:               {contact.get('social_id', '-')}")
        
        # Клієнт
        client = contact.get('client')
        if client:
            print(f"\n   💼 Клієнт:")
            print(f"      ID:                    {client.get('id')}")
            print(f"      Ім'я:                  {client.get('full_name', '-')}")
            print(f"      Телефон:               {client.get('phone', '-')}")
            print(f"      Email:                 {client.get('email', '-')}")
            print(f"      Валюта:                {client.get('currency', '-')}")
            print(f"      Сума замовлень:        {client.get('orders_sum', '0')}")
            print(f"      Кількість замовлень:   {client.get('orders_count', '0')}")
    
    # Менеджер
    manager = lead.get('manager')
    if manager:
        print(f"\n   👨‍💼 Менеджер:")
        print(f"      ID:                    {manager.get('id')}")
        print(f"      Ім'я:                  {manager.get('full_name', '-')}")
        print(f"      Email:                 {manager.get('email', '-')}")
        print(f"      Телефон:               {manager.get('phone', '-')}")
        print(f"      Статус:                {manager.get('status', '-')}")
    
    # Статус
    status = lead.get('status')
    if status:
        print(f"\n   🏷️  Статус:")
        print(f"      ID:                    {status.get('id')}")
        print(f"      Назва:                 {status.get('name', '-')}")
        print(f"      Аліас:                 {status.get('alias', '-')}")
        print(f"      Активний:              {'Так' if status.get('is_active') else 'Ні'}")
    
    # Продукти
    products = lead.get('products', [])
    if products:
        print(f"\n   📦 Продукти ({len(products)}):")
        for idx, product in enumerate(products, 1):
            print(f"      {idx}. {product.get('name', 'Без назви')}")
            print(f"         ID:                 {product.get('id')}")
            print(f"         SKU:                {product.get('sku', '-')}")
            print(f"         Ціна:               {product.get('price', 0)}")
            print(f"         Кількість:          {product.get('quantity', 0)}")
            print(f"         Одиниця:            {product.get('unit_type', '-')}")
    
    # Платежі
    payments = lead.get('payments', [])
    if payments:
        print(f"\n   💳 Платежі ({len(payments)}):")
        for idx, payment in enumerate(payments, 1):
            print(f"      {idx}. Сума: {payment.get('amount', 0)} {payment.get('actual_currency', 'UAH')}")
            print(f"         ID:                 {payment.get('id')}")
            print(f"         Статус:             {payment.get('status', '-')}")
            print(f"         Дата:               {payment.get('payment_date', '-')}")
            print(f"         Опис:               {payment.get('description', '-')}")
    
    # Кастомні поля
    custom_fields = lead.get('custom_fields', [])
    if custom_fields:
        print(f"\n   ⚙️  Кастомні поля ({len(custom_fields)}):")
        for field in custom_fields:
            print(f"      • {field.get('name', 'Без назви')}")
            print(f"         UUID:               {field.get('uuid', '-')}")
            print(f"         Тип:                {field.get('type', '-')}")
            print(f"         Значення:           {field.get('value', '-')}")
    
    print(f"{'─' * 80}")

def save_to_json(all_data: Dict, filename: str = "leads_data.json"):
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, ensure_ascii=False, indent=2)
        print(f"\n💾 Дані збережено у файл: {filename}")
    except Exception as e:
        print(f"\n❌ Помилка при збереженні: {e}")

def main():
    all_results = {}
    total_leads = 0
    
    # Отримуємо ліди для кожного статусу
    for status_id, status_name in TARGET_STATUSES.items():
        leads = get_leads_by_status(status_id, status_name)
        
        if leads is not None:
            all_results[status_name] = {
                "status_id": status_id,
                "status_name": status_name,
                "leads_count": len(leads),
                "leads": leads
            }
            
            # Виводимо інформацію про кожен лід
            if leads:
                print(f"\n{'=' * 80}")
                print(f"📝 ДЕТАЛІ ЛІДІВ: {status_name}")
                print(f"{'=' * 80}")
                
                for idx, lead in enumerate(leads, 1):
                    print_lead_info(lead, idx)
                
                total_leads += len(leads)
            else:
                print(f"⚠️  Лідів не знайдено\n")
        else:
            print(f"❌ Не вдалося отримати ліди для статусу {status_name}\n")
    
    # Підсумок
    print(f"\n{'=' * 80}")
    print(f"✅ ПІДСУМОК")
    print(f"{'=' * 80}")
    for status_name, data in all_results.items():
        print(f"   {status_name}: {data['leads_count']} лідів")
    print(f"   Всього лідів: {total_leads}")
    print(f"{'=' * 80}\n")
    
    # Збереження у файл
    if total_leads > 0:
        save_response = input("💾 Зберегти всі ліди у JSON файл? (y/n): ").strip().lower()
        if save_response == 'y':
            save_to_json(all_results, "leads_by_statuses.json")

if __name__ == "__main__":
    main()
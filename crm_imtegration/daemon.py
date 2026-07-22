import time
from crm_client import CRMClient
from config import CRMConfig


class CRMDaemon:
    def __init__(self, client: CRMClient, config: CRMConfig):
        self.client = client
        self.config = config
    
    def check_and_generate_test_links(self) -> dict[str, int]:
        print(f"\n{'=' * 80}")
        print(f"🔍 ПЕРЕВІРКА ЛІДІВ зі статусом {self.config.status_in_progress}")
        print(f"{'=' * 80}\n")
        
        leads = self.client.get_leads_by_status(self.config.status_in_progress)
        
        if not leads:
            print(f"ℹ️  Лідів зі статусом {self.config.status_in_progress} не знайдено\n")
            return {"processed": 0, "updated": 0}
        
        print(f"📊 Знайдено {len(leads)} лідів зі статусом {self.config.status_in_progress}\n")
        
        processed_count = 0
        updated_count = 0
        
        for lead in leads:
            lead_id = lead.get('id')
            if not lead_id:
                continue
            
            processed_count += 1
            
            custom_fields = lead.get('custom_fields', [])
            test_link_field = None
            
            for field in custom_fields:
                if field.get('uuid') == self.config.test_link_uuid:
                    test_link_field = field
                    break
            
            current_value = test_link_field.get('value') if test_link_field else None
            
            if not current_value or current_value.strip() == '':
                print(f"🔗 Лід #{lead_id}: поле LD_1024 пусте, генеруємо посилання...")
                
                if self.client.update_test_link(lead_id, force_update=False):
                    updated_count += 1
                    print(f"✅ Посилання для ліда #{lead_id} успішно згенеровано\n")
                else:
                    print(f"❌ Не вдалося згенерувати посилання для ліда #{lead_id}\n")
            else:
                print(f"ℹ️  Лід #{lead_id}: посилання вже існує\n")
        
        print(f"{'=' * 80}")
        print(f"📊 ПІДСУМОК:")
        print(f"   Перевірено лідів: {processed_count}")
        print(f"   Оновлено посилань: {updated_count}")
        print(f"{'=' * 80}\n")
        
        return {"processed": processed_count, "updated": updated_count}
    
    def run(self):
        print(f"\n{'🚀' * 40}")
        print(f"🚀 ЗАПУСК ДЕМОНА ДЛЯ ПЕРЕВІРКИ ЛІДІВ")
        print(f"🚀 Інтервал перевірки: {self.config.check_interval} секунд")
        print(f"{'🚀' * 40}\n")
        
        iteration = 0
        
        try:
            while True:
                iteration += 1
                print(f"\n{'─' * 80}")
                print(f"🔄 Ітерація #{iteration} - {time.strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"{'─' * 80}")
                
                self.check_and_generate_test_links()
                
                print(f"⏳ Очікування {self.config.check_interval} секунд до наступної перевірки...\n")
                time.sleep(self.config.check_interval)
                
        except KeyboardInterrupt:
            print(f"\n\n{'🛑' * 40}")
            print(f"🛑 ДЕМОН ЗУПИНЕНО КОРИСТУВАЧЕМ")
            print(f"🛑 Всього виконано ітерацій: {iteration}")
            print(f"{'🛑' * 40}\n")
        except Exception as e:
            print(f"\n❌ КРИТИЧНА ПОМИЛКА: {e}")
            print(f"Демон зупинено\n")
            raise

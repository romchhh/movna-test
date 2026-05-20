import requests
from typing import Optional, Dict, Any, List

try:
    from .config import CRMConfig
except ImportError:
    from config import CRMConfig


class CRMClient:
    def __init__(self, config: CRMConfig):
        self.config = config
    
    def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        params: Optional[Dict] = None,
        json_data: Optional[Dict] = None
    ) -> Optional[Dict]:
        url = f"{self.config.base_url}/{endpoint.lstrip('/')}"
        
        try:
            response = requests.request(
                method=method,
                url=url,
                headers=self.config.headers,
                params=params,
                json=json_data,
                timeout=30
            )
            
            if response.status_code == 401:
                print(f"❌ Помилка авторизації при запиті до {endpoint}")
                return None
            
            if response.status_code == 404:
                print(f"❌ Ресурс не знайдено: {endpoint}")
                return None
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Помилка при запиті до {endpoint}: {e}")
            return None
    
    def get_lead_by_id(self, lead_id: int) -> Optional[Dict]:
        params = {
            "include": "contact.client,products.offer,manager,status,payments,custom_fields"
        }
        return self._make_request("GET", f"pipelines/cards/{lead_id}", params=params)
    
    def get_leads_by_status(self, status_id: int) -> List[Dict]:
        all_leads = []
        page = 1
        limit = 50
        
        while True:
            params = {
                "page": page,
                "limit": limit,
                "filter[status_id]": status_id,
                "include": "contact.client,products.offer,manager,status,payments,custom_fields"
            }
            
            data = self._make_request("GET", "pipelines/cards", params=params)
            if not data:
                break
            
            leads = data.get('data', [])
            if not leads:
                break
            
            all_leads.extend(leads)
            
            if not data.get('next_page_url'):
                break
            
            page += 1
        
        return all_leads
    
    def update_lead_field(self, lead_id: int, field_uuid: str, value: Any) -> bool:
        json_data = {
            "custom_fields": [
                {
                    "uuid": field_uuid,
                    "value": value
                }
            ]
        }
        
        result = self._make_request("PUT", f"pipelines/cards/{lead_id}", json_data=json_data)
        return result is not None
    
    def update_lead_status(self, lead_id: int, status_id: int) -> bool:
        json_data = {
            "status_id": status_id
        }
        
        result = self._make_request("PUT", f"pipelines/cards/{lead_id}", json_data=json_data)
        return result is not None
    
    def update_test_link(self, lead_id: int, force_update: bool = False) -> bool:
        lead_data = self.get_lead_by_id(lead_id)
        if not lead_data:
            return False
        
        custom_fields = lead_data.get('custom_fields', [])
        test_link_field = None
        
        for field in custom_fields:
            if field.get('uuid') == self.config.test_link_uuid:
                test_link_field = field
                break
        
        if test_link_field:
            current_value = test_link_field.get('value')
            if current_value and not force_update:
                print(f"ℹ️  Лід #{lead_id}: посилання вже існує")
                return True
        
        new_link = f"{self.config.base_test_url}/placement_test?id={lead_id}"
        print(f"🔗 Генеруємо посилання для ліда #{lead_id}: {new_link}")
        
        return self.update_lead_field(lead_id, self.config.test_link_uuid, new_link)
    
    def _get_result_text(self, score: float, outcome: str = "completed") -> str:
        """Текст результату placement (30 питань): early-exit за кроком, C1 лише від 26 балів."""
        score_int = int(score)
        if outcome == "failed_step_1":
            summary = "рекомендація: майбутні програми A1-A2"
        elif outcome in ("failed_step_2", "failed_step_3"):
            summary = "рекомендація: Level Up B1"
        elif outcome in ("failed_step_4", "failed_step_5"):
            summary = "рекомендація: Level Up B2"
        elif score_int >= 26:
            summary = "рекомендація: Level Up C1"
        else:
            summary = "рекомендація: Level Up B2"
        return f"Placement Level Up (B1/B2/C1): {score_int}/30 — {summary}"
    
    def complete_test(self, lead_id: int, test_result: float) -> Dict[str, Any]:
        result = {
            "success": False,
            "message": "",
            "details": {
                "result_updated": False,
                "status_changed": False
            }
        }
        
        try:
            # Конвертуємо бал в текстовий результат
            result_text = self._get_result_text(test_result)
            
            if self.update_lead_field(lead_id, self.config.test_result_uuid, result_text):
                result["details"]["result_updated"] = True
            else:
                result["message"] = "Не вдалося оновити результат тестування"
                return result
            
            if self.update_lead_status(lead_id, self.config.status_completed):
                result["details"]["status_changed"] = True
            else:
                result["message"] = "Результат оновлено, але не вдалося змінити статус"
                return result
            
            result["success"] = True
            result["message"] = f"Тест успішно завершено для ліда #{lead_id}. Результат: {result_text}"
            
        except Exception as e:
            result["message"] = f"Помилка при обробці завершення тесту: {str(e)}"
        
        return result

import os
from dataclasses import dataclass


@dataclass
class CRMConfig:
    api_key: str
    base_url: str = "https://openapi.keycrm.app/v1"
    test_link_uuid: str = "LD_1024"
    test_result_uuid: str = "LD_1026"
    pipeline_id: int = 29           # Level Up 8
    status_new: int = 526           # "Новий" у воронці 29
    status_in_progress: int = 536   # "Проходження тесту" у воронці 29
    status_completed: int = 537     # "Тест пройдено" у воронці 29
    base_test_url: str = "https://levelup.movna.online/"
    check_interval: int = 60

    @classmethod
    def from_env(cls) -> 'CRMConfig':
        api_key = os.getenv(
            "CRM_API_KEY", 
            "NTcwMTFlMmExZWE4M2Q3MGU5NTlhMjVmNmEzNTdiODA2NjMyY2FkMQ"
        )
        base_test_url = os.getenv("BASE_TEST_URL", "https://levelup.movna.online/")
        check_interval = int(os.getenv("CRM_CHECK_INTERVAL", "60"))
        pipeline_id = int(os.getenv("CRM_PIPELINE_ID", "29"))
        status_new = int(os.getenv("CRM_STATUS_NEW_ID", "526"))
        status_in_progress = int(os.getenv("CRM_STATUS_IN_PROGRESS_ID", "536"))
        status_completed = int(os.getenv("CRM_STATUS_COMPLETED_ID", "537"))
        
        return cls(
            api_key=api_key,
            base_test_url=base_test_url,
            check_interval=check_interval,
            pipeline_id=pipeline_id,
            status_new=status_new,
            status_in_progress=status_in_progress,
            status_completed=status_completed,
        )

    @property
    def headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

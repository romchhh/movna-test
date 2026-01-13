import os
from dataclasses import dataclass


@dataclass
class CRMConfig:
    api_key: str
    base_url: str = "https://openapi.keycrm.app/v1"
    test_link_uuid: str = "LD_1024"
    test_result_uuid: str = "LD_1026"
    status_in_progress: int = 295
    status_completed: int = 417
    base_test_url: str = "https://movna-test.vercel.app"
    check_interval: int = 60

    @classmethod
    def from_env(cls) -> 'CRMConfig':
        api_key = os.getenv(
            "CRM_API_KEY", 
            "NTcwMTFlMmExZWE4M2Q3MGU5NTlhMjVmNmEzNTdiODA2NjMyY2FkMQ"
        )
        base_test_url = os.getenv("BASE_TEST_URL", "https://movna-test.vercel.app")
        check_interval = int(os.getenv("CRM_CHECK_INTERVAL", "60"))
        
        return cls(
            api_key=api_key,
            base_test_url=base_test_url,
            check_interval=check_interval
        )

    @property
    def headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

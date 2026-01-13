"""
CRM Integration Package

Пакет для інтеграції з CRM системою KeyCRM.
"""

from .config import CRMConfig
from .crm_client import CRMClient

__all__ = ['CRMConfig', 'CRMClient']

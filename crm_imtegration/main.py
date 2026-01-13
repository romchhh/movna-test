from config import CRMConfig
from crm_client import CRMClient
from daemon import CRMDaemon


def main():
    config = CRMConfig.from_env()
    
    client = CRMClient(config)
    
    daemon = CRMDaemon(client, config)
    daemon.run()


if __name__ == "__main__":
    main()

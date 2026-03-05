import requests

API_KEY = "NTcwMTFlMmExZWE4M2Q3MGU5NTlhMjVmNmEzNTdiODA2NjMyY2FkMQ"
BASE_URL = "https://openapi.keycrm.app/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Accept": "application/json"
}

PIPELINE_ID = 26


def main():
    all_statuses = []
    page = 1

    while True:
        r = requests.get(f"{BASE_URL}/pipelines/{PIPELINE_ID}/statuses", headers=headers, params={
            "page": page,
            "limit": 50
        })
        r.raise_for_status()
        data = r.json()
        items = data.get("data", [])
        if not items:
            break
        all_statuses.extend(items)
        if not data.get("next_page_url"):
            break
        page += 1

    print(f"\n{'=' * 60}")
    print(f"  📋 Статуси воронки ID {PIPELINE_ID}  (всього: {len(all_statuses)})")
    print(f"{'=' * 60}")
    print(f"  {'ID':<8} {'Назва':<30} {'Позиція':<10} Фінальний")
    print(f"  {'─' * 55}")
    for s in sorted(all_statuses, key=lambda x: x.get("position", 0)):
        final = "🏁 Так" if s.get("is_final") else "—"
        print(f"  {str(s['id']):<8} {s.get('title', '?'):<30} {str(s.get('position', '?')):<10} {final}")
    print(f"{'=' * 60}\n")


if __name__ == "__main__":
    main()
import requests

# Lista de URLs de produtos de fones gamers na Amazon
product_urls = [
    "https://www.amazon.com.br/dp/B0BL14T82J/ref=sspa_dk_detail_0?pd_rd_i=B0BL14T82J&s=computers&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw&smid=A2HZEBBSTYFFRU",
    "https://www.amazon.com.br/dp/B0BTJDLWRN?_encoding=UTF8&psc=1&ref_=cm_sw_r_cp_ud_dp_6TKFZGB51FWK5P8X5VXW_1"
    # Adicione mais URLs conforme necessário
]

# Headers para a requisição HTTP para simular um navegador
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
}

def check_urls(urls):
    for url in urls:
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                print(f"URL válida: {url}")
            else:
                print(f"URL inválida (status code {response.status_code}): {url}")
        except requests.RequestException as e:
            print(f"Erro ao acessar URL: {url}. Erro: {e}")

if __name__ == "__main__":
    check_urls(product_urls)

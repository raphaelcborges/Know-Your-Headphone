from playwright.sync_api import sync_playwright
import json

# URLs dos produtos na Amazon
product_urls = [
    "https://www.amazon.com.br/dp/B0B1VR3JC9?_encoding=UTF8&psc=1&ref_=cm_sw_r_cp_ud_dp_92KW15KM52ATAYBA0Y4S"
]

def get_product_info(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)

        try:
            title = page.query_selector("span#productTitle").inner_text().strip()
        except AttributeError:
            title = "Título não disponível"

        try:
            price_whole = page.query_selector("span#priceblock_ourprice, span#priceblock_dealprice, span.a-price-whole").inner_text().strip()
            price_fraction = page.query_selector("span.a-price-fraction").inner_text().strip()
            price_symbol = page.query_selector("span.a-price-symbol").inner_text().strip()
            price = f"{price_symbol}{price_whole},{price_fraction}"
            price = price.replace("\n", "").replace(",,", ",")
        except AttributeError:
            price = "Preço não disponível"

        try:
            image_url = page.query_selector("img#landingImage, img.a-dynamic-image").get_attribute("src")
        except AttributeError:
            image_url = "Imagem não disponível"

        browser.close()
        return {
            "name": title,
            "price": price,
            "image_url": image_url
        }

def save_to_file(products, filename="fone_musica.json"):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(products, file, ensure_ascii=False, indent=4)

def main():
    products = []
    for url in product_urls:
        print(f"Buscando informações para a URL: {url}")
        product_info = get_product_info(url)
        if product_info:
            products.append(product_info)
        else:
            print(f"Não foi possível obter informações para a URL: {url}")

    save_to_file(products)
    print(f"Informações dos produtos salvas em {len(products)} produtos.")

if __name__ == "__main__":
    main()

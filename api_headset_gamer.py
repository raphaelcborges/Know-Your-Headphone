from playwright.sync_api import sync_playwright
import json

# URLs dos produtos na Amazon
product_urls = [
    "https://www.amazon.com.br/dp/B0BL14T82J/ref=sspa_dk_detail_0?pd_rd_i=B0BL14T82J&s=computers&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw&smid=A2HZEBBSTYFFRU",
    "https://www.amazon.com.br/dp/B0BTJDLWRN?_encoding=UTF8&psc=1&ref_=cm_sw_r_cp_ud_dp_6TKFZGB51FWK5P8X5VXW_1",
    "https://www.amazon.com.br/dp/B0C8NPR9HW?ref_=cm_sw_r_cp_ud_dp_NZ90JETXH6NNFHJ00FGK",
    "https://www.amazon.com.br/dp/B09RQ4YZSK?ref_=cm_sw_r_cp_ud_dp_7SEY5329RPW7CKY50KNX",
    "https://www.amazon.com.br/dp/B0CNKVYLF5?_encoding=UTF8&ref_=cm_sw_r_cp_ud_dp_M11WKG9Q6PJ49MF3M1VR",
    "https://www.amazon.com.br/dp/B07N78G8GB?ref_=cm_sw_r_cp_ud_dp_G5GWMVZA5EP024HDYVH2&skipTwisterOG=1"

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

def save_to_file(products, filename="headset_gamer.json"):
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

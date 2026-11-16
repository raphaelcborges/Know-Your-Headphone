import flet as ft
import json

# Carrega as informações dos produtos do arquivo JSON
def load_product_data(file_name):
    try:
        with open(file_name, "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Arquivo {file_name} não encontrado.")
        return []
    except json.JSONDecodeError:
        print("Erro ao decodificar o arquivo JSON.")
        return []

# Função para mostrar a tela inicial
def mostrar_tela_inicial(page: ft.Page, on_start_click):
    page.window.width = 360
    page.window.height = 690
    image = ft.Image(src="bg1.png", width=360, height=690)
    start_button = ft.Container(
        content=ft.ElevatedButton(text="Start", on_click=on_start_click),
        width=200,
        height=50,
        alignment=ft.Alignment(0, 0.5),
        margin=10
    )
    page.controls.clear()
    page.add(
        ft.Stack(
            [
                image,
                ft.Container(
                    content=start_button,
                    alignment=ft.Alignment(0, 0.5),
                    padding=ft.Padding(left=0, right=0, top=375, bottom=20)
                )
            ]
        )
    )
    page.update()

# Tela para selecionar a atividade desejada
def mostrar_tela_selecao_atividade(page: ft.Page):
    page.window.width = 360
    page.window.height = 690
    background_image = ft.Image(src="bg2.png", width=360, height=690)
    options_buttons = [
        ft.Container(
            content=ft.ElevatedButton(text="Jogos", on_click=lambda e: mostrar_tela_selecao_preco(page, "jogos")),
            width=300,
            height=50,
            margin=10
        ),
        ft.Container(
            content=ft.ElevatedButton(text="Música", on_click=lambda e: mostrar_tela_selecao_preco(page, "música")),
            width=300,
            height=50,
            margin=10
        ),
        ft.Container(
            content=ft.ElevatedButton(text="Filme", on_click=lambda e: mostrar_tela_selecao_preco(page, "filme")),
            width=300,
            height=50,
            margin=10
        ),
        ft.Container(
            content=ft.ElevatedButton(text="Estudo", on_click=lambda e: mostrar_tela_selecao_preco(page, "estudo")),
            width=300,
            height=50,
            margin=10
        ),
    ]
    page.controls.clear()
    page.add(
        ft.Stack(
            [
                background_image,
                ft.Container(
                    content=ft.Column(
                        options_buttons,
                        alignment=ft.MainAxisAlignment.CENTER,
                        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                        spacing=10
                    ),
                    alignment=ft.Alignment(0, 0.5),
                    padding=ft.Padding(left=0, right=0, top=200, bottom=0)
                )
            ]
        )
    )
    page.update()

# Tela para selecionar o intervalo de preço
def mostrar_tela_selecao_preco(page: ft.Page, atividade: str):
    page.window.width = 360
    page.window.height = 690
    background_image2 = ft.Image(src="bg4.png", width=360, height=690)
    price_buttons = [
        ft.Container(
            content=ft.ElevatedButton(
                text="Entre 50 e 100",
                on_click=lambda e: mostrar_tela_tipo_fone(page, atividade, "50-100")
            ),
            width=300,
            height=50,
            margin=10
        ),
        ft.Container(
            content=ft.ElevatedButton(
                text="Entre 100 e 150",
                on_click=lambda e: mostrar_tela_tipo_fone(page, atividade, "100-150")
            ),
            width=300,
            height=50,
            margin=10
        ),
        ft.Container(
            content=ft.ElevatedButton(
                text="Entre 150 e 250",
                on_click=lambda e: mostrar_tela_tipo_fone(page, atividade, "150-250")
            ),
            width=300,
            height=50,
            margin=10
        ),
        ft.Container(
            content=ft.ElevatedButton(
                text="Entre 250 e 450",
                on_click=lambda e: mostrar_tela_tipo_fone(page, atividade, "250-450")
            ),
            width=300,
            height=50,
            margin=10
        ),
        ft.Container(
            content=ft.ElevatedButton(
                text="Entre 500 e 800",
                on_click=lambda e: mostrar_tela_tipo_fone(page, atividade, "500-800")
            ),
            width=300,
            height=50,
            margin=10
        ),
        ft.Container(
            content=ft.ElevatedButton(
                text="Entre 800 e ilimitado",
                on_click=lambda e: mostrar_tela_tipo_fone(page, atividade, "800+")
            ),
            width=300,
            height=50,
            margin=10
        ),
    ]
    page.controls.clear()
    page.add(
        ft.Stack(
            [
                background_image2,
                ft.Container(
                    content=ft.Column(
                        price_buttons,
                        alignment=ft.MainAxisAlignment.CENTER,
                        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                        spacing=10
                    ),
                    alignment=ft.Alignment(0, 0.5),
                    padding=ft.Padding(left=0, right=0, top=160, bottom=0)
                )
            ]
        )
    )
    page.update()

# Tela para escolher o estilo do fone de acordo com a atividade
def mostrar_tela_tipo_fone(page: ft.Page, atividade: str, faixa_preco: str):
    page.window.width = 360
    page.window.height = 690
    background_image3 = ft.Image(src="bg5.png", width=360, height=690)

    # Para "jogos": Headset ou Fone; para os demais (música, filme, estudo): Headphone ou Fone
    if atividade == "jogos":
        type_buttons = [
            ft.Container(
                content=ft.ElevatedButton(
                    text="Headset",
                    on_click=lambda e: processar_escolha(page, atividade, faixa_preco, "headset")
                ),
                width=300,
                height=50,
                margin=10
            ),
            ft.Container(
                content=ft.ElevatedButton(
                    text="Fone",
                    on_click=lambda e: processar_escolha(page, atividade, faixa_preco, "fone")
                ),
                width=300,
                height=50,
                margin=10
            ),
        ]
    else:
        type_buttons = [
            ft.Container(
                content=ft.ElevatedButton(
                    text="Headphone",
                    on_click=lambda e: processar_escolha(page, atividade, faixa_preco, "headphone")
                ),
                width=300,
                height=50,
                margin=10
            ),
            ft.Container(
                content=ft.ElevatedButton(
                    text="Fone",
                    on_click=lambda e: processar_escolha(page, atividade, faixa_preco, "fone")
                ),
                width=300,
                height=50,
                margin=10
            ),
        ]

    page.controls.clear()
    page.add(
        ft.Stack(
            [
                background_image3,
                ft.Container(
                    content=ft.Column(
                        type_buttons,
                        alignment=ft.MainAxisAlignment.CENTER,
                        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                        spacing=10
                    ),
                    alignment=ft.Alignment(0, 0.5),
                    padding=ft.Padding(left=0, right=0, top=160, bottom=0)
                )
            ]
        )
    )
    page.update()

# Processa a escolha, carregando o arquivo JSON correto e filtrando os produtos pela faixa de preço
def processar_escolha(page: ft.Page, atividade: str, faixa_preco: str, tipo_fone: str):
    # Seleciona o arquivo JSON de acordo com a atividade e o tipo de fone escolhido
    if atividade == "jogos":
        if tipo_fone == "fone":
            file_name = "fone_gamer.json"
        else:
            file_name = "headset_gamer.json"
    elif atividade == "música":
        if tipo_fone == "fone":
            file_name = "fone_musica.json"
        else:
            file_name = "headphone_musica.json"
    elif atividade == "filme":
        if tipo_fone == "fone":
            file_name = "fone_filme.json"
        else:
            file_name = "headphone_filme.json"
    elif atividade == "estudo":
        if tipo_fone == "fone":
            file_name = "fone_estudo.json"
        else:
            file_name = "headphone_estudo.json"
    else:
        page.controls.clear()
        page.add(
            ft.Text(f"Atividade {atividade} não reconhecida.", style=ft.TextStyle(size=18, weight=ft.FontWeight.BOLD))
        )
        page.update()
        return

    products = load_product_data(file_name)

    # Converte a faixa de preço selecionada para um intervalo de valores
    preco_min, preco_max = map(int, faixa_preco.split('-')) if faixa_preco != "800+" else (800, float('inf'))

    # Filtra os produtos de acordo com a faixa de preço
    filtered_products = [
        product for product in products
        if preco_min <= float(product["price"].replace('R$', '').replace(',', '.')) <= preco_max
    ]

    if filtered_products:
        mostrar_tela_de_produtos(page, filtered_products)
    else:
        page.controls.clear()
        page.add(
            ft.Text(
                f"Não há produtos disponíveis para {atividade} com a faixa de preço {faixa_preco}.",
                style=ft.TextStyle(size=18, weight=ft.FontWeight.BOLD)
            )
        )
        page.update()

# Exibe a lista de produtos filtrados
def mostrar_tela_de_produtos(page: ft.Page, products):
    def on_product_details_click(e):
        product_index = e.control.data
        product = products[product_index]
        mostrar_detalhes_do_produto(page, product)

    def on_back_click(e):
        mostrar_tela_selecao_atividade(page)

    background_image = ft.Image(src="bg3.png", width=360, height=690)
    back_button = ft.Container(
        content=ft.ElevatedButton(text="Voltar", on_click=on_back_click),
        width=200,
        height=50,
        alignment=ft.Alignment(0, 0.5),
        margin=10
    )

    product_buttons = []
    for index, product in enumerate(products):
        product_buttons.append(
            ft.Container(
                content=ft.Column(
                    controls=[
                        ft.ElevatedButton(
                            text=product["name"],
                            on_click=on_product_details_click,
                            data=index,
                            width=300,
                            height=75
                        )
                    ],
                    alignment=ft.MainAxisAlignment.START,
                    horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                    spacing=5
                ),
                width=320,
                height=70,
                margin=5
            )
        )

    list_view = ft.ListView(
        controls=product_buttons,
        spacing=10,
        padding=ft.Padding(left=0, right=0, top=10, bottom=0)
    )

    scroll_container = ft.Container(
        content=list_view,
        width=360,
        height=600,
        alignment=ft.Alignment(0, 0),
        padding=ft.Padding(left=0, right=0, top=10, bottom=0)
    )

    page.controls.clear()
    page.add(
        ft.Stack(
            [
                background_image,
                ft.Container(
                    content=ft.Column(
                        controls=[back_button, scroll_container],
                        alignment=ft.MainAxisAlignment.CENTER,
                        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                        spacing=10
                    ),
                    alignment=ft.Alignment(0, 0),
                    padding=ft.Padding(left=0, right=0, top=10, bottom=0)
                )
            ]
        )
    )
    page.update()

# Exibe os detalhes do produto selecionado
def mostrar_detalhes_do_produto(page: ft.Page, product):
    def on_back_click(e):
        # Aqui você pode ajustar o arquivo a ser carregado para voltar à lista correta
        mostrar_tela_de_produtos(page, load_product_data("fones_gamers.json"))
    background_image = ft.Image(src="bg3.png", width=360, height=690)
    back_button = ft.Container(
        content=ft.ElevatedButton(text="Voltar", on_click=on_back_click),
        width=200,
        height=50,
        alignment=ft.Alignment(0, 0.5),
        margin=10
    )

    page.controls.clear()
    page.add(
        ft.Stack(
            [
                background_image,
                ft.Container(
                    content=ft.Column(
                        controls=[
                            ft.Image(src=product["image_url"], width=300, height=150),
                            ft.Text(product["name"], style=ft.TextStyle(size=18, weight=ft.FontWeight.BOLD)),
                            ft.Text(f"Preço: {product['price']}", style=ft.TextStyle(size=16)),
                            ft.Text(product.get("description", "Descrição não disponível"), style=ft.TextStyle(size=16)),
                            back_button
                        ],
                        alignment=ft.MainAxisAlignment.CENTER,
                        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                        spacing=10
                    ),
                    alignment=ft.Alignment(0, 0),
                    padding=ft.Padding(left=0, right=0, top=50, bottom=0)
                )
            ]
        )
    )
    page.update()

# Função principal para inicializar a aplicação
def main(page: ft.Page):
    def start_app(e):
        mostrar_tela_selecao_atividade(page)
    mostrar_tela_inicial(page, start_app)

ft.app(target=main)

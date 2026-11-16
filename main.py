import os
import flet as ft
from telas import mostrar_tela_inicial, mostrar_tela_opcoes

def main(page: ft.Page):
    page.window.width = 360
    page.window.height = 690

    def on_start_click(e):
        mostrar_tela_opcoes(page)

    mostrar_tela_inicial(page, on_start_click)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    ft.app(target=main, host="0.0.0.0", port=port, view=ft.WEB_BROWSER)


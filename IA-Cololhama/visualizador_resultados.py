import os
import cv2
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches


def criar_visualizacao_completa(input_folder="hair_results"):
    """Cria uma visualização completa dos resultados para cada imagem"""

    # Obter lista de imagens processadas
    arquivos = os.listdir(input_folder)
    imagens_base = set()

    for arquivo in arquivos:
        if arquivo.endswith(('_original.jpg', '_analoga1.jpg', '_analoga2.jpg', '_complementar.jpg')):
            nome_base = arquivo.split('_')[0]
            imagens_base.add(nome_base)

    print(f"Encontradas {len(imagens_base)} imagens processadas")

    for nome_base in imagens_base:
        try:
            print(f"\nCriando visualização para: {nome_base}")

            # Carregar todas as versões da imagem
            original_path = os.path.join(input_folder, f"{nome_base}_original.jpg")
            analoga1_path = os.path.join(input_folder, f"{nome_base}_analoga1.jpg")
            analoga2_path = os.path.join(input_folder, f"{nome_base}_analoga2.jpg")
            complementar_path = os.path.join(input_folder, f"{nome_base}_complementar.jpg")
            info_path = os.path.join(input_folder, f"{nome_base}_cores.txt")

            # Verificar se todos os arquivos existem
            if not all(
                    os.path.exists(path) for path in [original_path, analoga1_path, analoga2_path, complementar_path]):
                print(f"  ❌ Arquivos incompletos para {nome_base}")
                continue

            # Carregar imagens
            img_original = cv2.imread(original_path)
            img_analoga1 = cv2.imread(analoga1_path)
            img_analoga2 = cv2.imread(analoga2_path)
            img_complementar = cv2.imread(complementar_path)

            # Converter BGR para RGB
            img_original = cv2.cvtColor(img_original, cv2.COLOR_BGR2RGB)
            img_analoga1 = cv2.cvtColor(img_analoga1, cv2.COLOR_BGR2RGB)
            img_analoga2 = cv2.cvtColor(img_analoga2, cv2.COLOR_BGR2RGB)
            img_complementar = cv2.cvtColor(img_complementar, cv2.COLOR_BGR2RGB)

            # Ler informações das cores
            cores_info = {}
            if os.path.exists(info_path):
                with open(info_path, 'r') as f:
                    for linha in f:
                        if ':' in linha:
                            chave, valor = linha.strip().split(':', 1)
                            cores_info[chave.strip()] = valor.strip()

            # Criar visualização
            fig, axes = plt.subplots(2, 2, figsize=(15, 12))
            fig.suptitle(f'Resultados de Coloração - {nome_base}', fontsize=16, fontweight='bold')

            # Imagem original
            axes[0, 0].imshow(img_original)
            axes[0, 0].set_title(f'Original\nCor: {cores_info.get("Cor original", "N/A")}', fontweight='bold')
            axes[0, 0].axis('off')

            # Primeira cor análoga
            axes[0, 1].imshow(img_analoga1)
            axes[0, 1].set_title(f'Cor Análoga 1\nCor: {cores_info.get("Cor análoga 1", "N/A")}', fontweight='bold')
            axes[0, 1].axis('off')

            # Segunda cor análoga
            axes[1, 0].imshow(img_analoga2)
            axes[1, 0].set_title(f'Cor Análoga 2\nCor: {cores_info.get("Cor análoga 2", "N/A")}', fontweight='bold')
            axes[1, 0].axis('off')

            # Cor complementar
            axes[1, 1].imshow(img_complementar)
            axes[1, 1].set_title(f'Cor Complementar\nCor: {cores_info.get("Cor complementar", "N/A")}',
                                 fontweight='bold')
            axes[1, 1].axis('off')

            # Adicionar amostras de cores
            if cores_info:
                y_pos = 0.02
                for i, (titulo, cor) in enumerate([
                    ("Original", cores_info.get("Cor original", "#000000")),
                    ("Análoga 1", cores_info.get("Cor análoga 1", "#000000")),
                    ("Análoga 2", cores_info.get("Cor análoga 2", "#000000")),
                    ("Complementar", cores_info.get("Cor complementar", "#000000"))
                ]):
                    # Adicionar patch de cor
                    rect = patches.Rectangle((0.02 + i * 0.24, y_pos), 0.2, 0.05,
                                             linewidth=1, edgecolor='black',
                                             facecolor=cor, transform=fig.transFigure)
                    fig.patches.append(rect)

                    # Adicionar texto
                    plt.figtext(0.02 + i * 0.24, y_pos - 0.02, f"{titulo}\n{cor}",
                                fontsize=8, ha='left', va='top')

            plt.tight_layout()

            # Salvar visualização
            output_path = os.path.join(input_folder, f"{nome_base}_comparacao.png")
            plt.savefig(output_path, dpi=300, bbox_inches='tight')
            plt.close()

            print(f"  ✅ Visualização salva: {output_path}")

        except Exception as e:
            print(f"  ❌ Erro ao criar visualização para {nome_base}: {e}")
            continue


def criar_resumo_geral(input_folder="hair_results"):
    """Cria um resumo geral de todas as imagens processadas"""

    # Obter lista de imagens processadas
    arquivos = os.listdir(input_folder)
    imagens_base = set()

    for arquivo in arquivos:
        if arquivo.endswith('_original.jpg'):
            nome_base = arquivo.replace('_original.jpg', '')
            imagens_base.add(nome_base)

    if not imagens_base:
        print("Nenhuma imagem processada encontrada!")
        return

    # Criar grid de imagens
    num_imagens = len(imagens_base)
    cols = min(4, num_imagens)
    rows = (num_imagens + cols - 1) // cols

    fig, axes = plt.subplots(rows, cols, figsize=(20, 5 * rows))
    if rows == 1:
        axes = [axes] if num_imagens == 1 else axes
    else:
        axes = axes.flatten()

    fig.suptitle('Resumo Geral - Todas as Imagens Processadas', fontsize=20, fontweight='bold')

    for i, nome_base in enumerate(sorted(imagens_base)):
        try:
            # Carregar imagem original
            original_path = os.path.join(input_folder, f"{nome_base}_original.jpg")
            img = cv2.imread(original_path)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            # Carregar informações das cores
            info_path = os.path.join(input_folder, f"{nome_base}_cores.txt")
            cor_original = "#000000"
            if os.path.exists(info_path):
                with open(info_path, 'r') as f:
                    for linha in f:
                        if 'Cor original:' in linha:
                            cor_original = linha.split(':')[1].strip()
                            break

            axes[i].imshow(img)
            axes[i].set_title(f'{nome_base}\nCor: {cor_original}', fontweight='bold')
            axes[i].axis('off')

        except Exception as e:
            axes[i].text(0.5, 0.5, f'Erro: {nome_base}', ha='center', va='center', transform=axes[i].transAxes)
            axes[i].axis('off')

    # Esconder axes vazios
    for i in range(len(imagens_base), len(axes)):
        axes[i].axis('off')

    plt.tight_layout()

    # Salvar resumo
    output_path = os.path.join(input_folder, "resumo_geral.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"📊 Resumo geral salvo: {output_path}")


def main():
    input_folder = "hair_results"

    if not os.path.exists(input_folder):
        print(f"Pasta '{input_folder}' não encontrada!")
        return

    print("🎨 Criando visualizações dos resultados...")

    # Criar visualizações individuais
    criar_visualizacao_completa(input_folder)

    # Criar resumo geral
    criar_resumo_geral(input_folder)

    print("\n🎉 Visualizações criadas com sucesso!")
    print(f"Verifique a pasta '{input_folder}' para:")
    print("- Comparações individuais (*_comparacao.png)")
    print("- Resumo geral (resumo_geral.png)")


if __name__ == '__main__':
    main()

# IA-Cololhama

Sistema de colorização automática de imagens em escala de cinza utilizando técnicas de Inteligência Artificial.

## Sobre o Dataset

Este projeto utiliza parte do dataset CelebAMask-HQ, disponível exclusivamente para fins de pesquisa não-comercial. O uso está sujeito às seguintes restrições:
- Proibida a reprodução, duplicação, cópia, venda ou exploração comercial das imagens
- Proibido o uso comercial de qualquer porção dos dados derivados

## Pré-requisitos

- Python 3.11 (de preferência não usar versões superiores)
- pip (gerenciador de pacotes Python)
- PyCharm (recomendado para usuários não familiarizados com Python)

## Instalação e Configuração

### 1. Verificação do Ambiente Python

Antes de começar, verifique se possui Python e pip instalados:

```bash
python --version
pip --version
```

### 2. Configuração do Ambiente Virtual (PyCharm)

1. Abra o PyCharm e carregue a pasta `IA-Cololhama`
2. Configure o interpretador Python:
   - Pressione `Ctrl+Alt+S` para abrir Settings
   - Navegue até `Project: IA-Cololhama > Python Interpreter`
   - Clique em `Add Interpreter > New`
   - Selecione Python 3.11
3. Aguarde a configuração do ambiente virtual ser concluída

### 3. Instalação das Dependências

No terminal do PyCharm, execute:

```bash
pip install -r requirements.txt
```

### 4. Verificação da Instalação

Para garantir que todas as dependências foram instaladas corretamente:
1. Abra os arquivos `main.py` e `corzinha.py` no PyCharm
2. Verifique se não há imports destacados em vermelho
3. Se todos os imports estiverem normais, a instalação foi bem-sucedida

## Execução

Para iniciar o sistema, execute o seguinte comando no terminal (dentro da pasta do projeto):

```bash
uvicorn main:app --reload
```

### Saída Esperada

Após executar o comando, você deverá ver a seguinte mensagem indicando que o sistema foi inicializado com sucesso:

```
Lhama API inicializada com sucesso
INFO:     Application startup complete.
```

## Suporte

Para usuários não familiarizados com Python, recomenda-se o uso do PyCharm IDE para facilitar o processo de configuração e desenvolvimento.

---

*Projeto desenvolvido para Trabalho de Conclusão de Curso (TCC)*
The CelebAMask-HQ dataset is available for non-commercial research purposes only.
You agree not to reproduce, duplicate, copy, sell, trade, resell or exploit for any commercial purposes, any portion of the images and any portion of derived data.

###

uvicorn main:app --reload


## Para a Bea
 passo a passo de como fazer isso aqui rodar:
 - baixar o pycharm pra facilitar a sua vida
 - ver see vc tem python e pip instalados (normalmente o pycharm faz isso pra vc mas né)
        - python --version
        - pip --version
 - abrir a pasta IA-Cololhama no pycharm 
 - criar uma venv de python 11 (eu usei 11.9), baixa a versão do python no site oficial, não esaquece de clicar na opção de adicionar ao PATH antes de instalar 
            1. Ctrl+Alt+S (Settings)
            2. Project: IA-Cololhama > Python Interpreter
            3. Add Interpreter > New
            4. Selecione Python 3.11
- Aguarde a configuração terminar
- espera tudo ficar pronto da venv, demora um pouquinho mesamo, é normal
- ai tu coloca no terminal do pycharm msm um "pip install -r requirements.txt" e espera baixar td
- para garantir, depois de baixar tudo, abre main.py e corzinha.py no pycharm mesmo, se nenhum import estiver vermelho é pq ta tudo certo.
- no vscode ou qualquer tyerminal, entra na pasta do IA-Cololhama e coloca o comando de rodar a IA
- uvicorn main:app --reload
- espera um pouquinho, tem que aparecer o seguinte "
Lhama API inicializada com sucesso
INFO:     Application startup complete.
"

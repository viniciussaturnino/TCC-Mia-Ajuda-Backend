# TCC-Mia-Ajuda-Backend

<p align="center">
  <img src="https://i.imgur.com/5wtqEys.png" alt="Logo Mia Ajuda" width="50%"/>
</p>

## Dependencias

- Docker: [Link](https://docs.docker.com/engine/install/ubuntu/) do Guia de instalação
- Docker Compose: [Link](https://docs.docker.com/compose/install/) do Guia de instalação

## Inicialização

1. Crie um arquivo .env com o comando:

```bash
cp .env.template .env
```

2. Cole o conteúdo do `env` no arquivo gerado no passo anterior:

```.env
API_PORT=3000
NODE_ENV=development

# DB
DB_HOST=0.0.0.0
DB_PORT=27017
DB_NAME=miaajuda
DB_USER=admin
DB_PASS=admin
DATABASE_URL=mongodb://mongo/miaAjudaDB
```

3. Execute o seguinte comando na pasta principal do projeto:

```bash
sudo docker compose up --build
```

Após a execução do Passo 3 o backend estará acessível em `http://localhost:3000/`

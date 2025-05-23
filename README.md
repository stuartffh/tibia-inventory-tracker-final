# Tibia Inventory Tracker

Sistema de gerenciamento de inventário para jogadores de Tibia, com foco no controle de itens dropados da Primal Bag.

## Funcionalidades

- ✅ Interface gamer inspirada no Tibia com transições elegantes e gradientes
- ✅ Autenticação de usuário único
- ✅ Gerenciamento completo de itens da Primal Bag
- ✅ Registro de quem estava junto durante o drop
- ✅ Marcação de itens como vendidos com preço e divisão
- ✅ Relatórios por dia, semana e mês
- ✅ Confirmações para todas as ações

## Requisitos

- Node.js 14.x ou superior
- NPM 6.x ou superior
- Docker (opcional, para execução via container)

## Instalação e Execução

### Método 1: Usando NPM

```bash
# Instalar todas as dependências (backend e frontend)
npm run install-all

# Construir o frontend
npm run build-all

# Iniciar a aplicação (backend e frontend)
npm run start-all
```

### Método 2: Usando Docker

```bash
# Construir a imagem
docker build -t tibia-inventory-tracker .

# Executar o container
docker run -p 3000:3000 -p 3001:3001 tibia-inventory-tracker
```

## Acesso ao sistema

- **URL**: http://localhost:3000
- **Usuário**: admin
- **Senha**: admin123

## Estrutura do Projeto

```
tibia-inventory-tracker/
├── frontend/               # Frontend Next.js
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── services/           # Serviços de API
│   └── styles/             # Estilos globais
├── data/                   # Diretório para o banco de dados SQLite
├── server.js               # Servidor backend Express
├── package.json            # Dependências e scripts
└── Dockerfile              # Configuração para Docker
```

## Guia de Uso

### Dashboard

A página inicial mostra um resumo do seu inventário, incluindo:
- Total de itens
- Itens disponíveis
- Itens vendidos
- Valor total de vendas
- Itens recentes

### Inventário

Na seção de inventário você pode:
- Visualizar todos os itens do seu inventário
- Filtrar por itens disponíveis ou vendidos
- Adicionar novos itens ao inventário
- Marcar itens como vendidos
- Remover itens do inventário

### Relatórios

A seção de relatórios permite visualizar:
- Itens dropados por período (hoje, semana, mês, todos)
- Itens vendidos por período
- Valor total de vendas por período

## Solução de Problemas

### Erro de conexão com a API

Se encontrar erros 404 ao tentar acessar a API, verifique:
1. Se o backend está rodando na porta 3001
2. Se o arquivo `frontend/config.js` está configurado corretamente com a URL `http://localhost:3001`

### Erro ao iniciar o backend

Se o backend não iniciar corretamente:
1. Verifique se a porta 3001 não está sendo usada por outro processo
2. Certifique-se de que o diretório `data` existe e tem permissões de escrita

### Erro ao iniciar o frontend

Se o frontend não iniciar:
1. Execute `npm run build` no diretório frontend
2. Verifique se a porta 3000 não está sendo usada por outro processo

## Desenvolvimento

Para desenvolver novas funcionalidades:

```bash
# Iniciar o backend em modo de desenvolvimento
npm run dev-server

# Iniciar o frontend em modo de desenvolvimento
cd frontend && npm run dev
```

## Licença

Este projeto é para uso pessoal e não possui licença específica.

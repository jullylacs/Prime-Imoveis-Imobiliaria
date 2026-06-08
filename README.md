# Prime Imóveis

Plataforma web para gestão e divulgação de imóveis. Corretores podem cadastrar e gerenciar propriedades; clientes podem navegar pelo portfólio, ver detalhes e registrar interesse.

---

## Tecnologias

**Frontend**
- Angular 20 — componentes standalone, zoneless change detection, SSR
- Angular Router com guard de autenticação
- Angular Forms (ngModel)
- RxJS — `switchMap`, `Observable`, `signal`
- Poppins + Playfair Display (Google Fonts)
- Material Icons

**Backend**
- Node.js + Express
- Multer — upload de imagens
- UUID — geração de IDs únicos
- `db.json` como banco de dados em arquivo

---

## Estrutura do projeto

```
imobiliaria/
├── api/                  # Servidor Express (porta 3001)
│   ├── server.js
│   ├── db.json           # Banco de dados (usuários, imóveis, interesses)
│   └── uploads/          # Imagens enviadas pelos corretores
│
└── imobiliaria/          # Aplicação Angular
    └── src/
        └── app/
            ├── auth/           # Login e cadastro
            ├── core/
            │   ├── models/     # Imovel, Usuario
            │   ├── services/   # Imoveis, AuthService
            │   └── guards/     # authGuard
            ├── templates/
            │   └── components/
            │       └── card-imovel/   # Página de detalhe do imóvel
            └── views/
                ├── public/
                │   ├── home/
                │   └── busca-imoveis/
                ├── corretor/
                │   └── dashboard-imoveis/
                ├── cliente/
                │   └── meus-interesses/
                └── perfil/
```

---

## Rotas da aplicação

| Rota | Componente | Acesso |
|---|---|---|
| `/` | Home | Público |
| `/busca` | Busca de imóveis | Público |
| `/imovel/:id` | Detalhe do imóvel | Público |
| `/login` | Login | Público |
| `/registrar` | Cadastro de cliente | Público |
| `/dashboard` | Dashboard do corretor | Autenticado |
| `/perfil` | Perfil do usuário | Autenticado |
| `/meus-interesses` | Interesses do cliente | Autenticado |

---

## API — Endpoints

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Login com email e senha |
| POST | `/auth/register` | Cadastro de novo usuário |

### Imóveis
| Método | Rota | Descrição |
|---|---|---|
| GET | `/imoveis` | Lista todos (aceita `?cidade=` e `?tipo=`) |
| GET | `/imoveis/:id` | Busca por ID |
| POST | `/imoveis` | Cria novo imóvel |
| PUT | `/imoveis/:id` | Atualiza imóvel |
| DELETE | `/imoveis/:id` | Remove imóvel |

### Upload
| Método | Rota | Descrição |
|---|---|---|
| POST | `/upload` | Envia imagem (campo `imagem`, máx. 5 MB) |

Imagens ficam disponíveis em `GET /uploads/:filename`.

### Interesses
| Método | Rota | Descrição |
|---|---|---|
| GET | `/interesses` | Lista (aceita `?clienteId=`) |
| POST | `/interesses` | Registra interesse |
| DELETE | `/interesses/:id` | Remove interesse |

### Usuários
| Método | Rota | Descrição |
|---|---|---|
| PUT | `/usuarios/:id` | Atualiza nome do usuário |

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Angular CLI 20+

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd imobiliaria
```

### 2. Iniciar a API

```bash
cd api
npm install
node server.js
```

A API ficará disponível em `http://localhost:3001`.

### 3. Iniciar o frontend

```bash
cd imobiliaria
npm install
npx ng serve
```

A aplicação ficará disponível em `http://localhost:4200`.

---

## Funcionalidades

**Área pública**
- Listagem de imóveis com filtro por título, cidade e tipo
- Contador de resultados em tempo real
- Página de detalhe com descrição, preço e localização
- Botão de interesse no imóvel

**Corretor (autenticado)**
- Dashboard com total de imóveis cadastrados
- Cadastro de imóvel com upload de imagem (preview antes de salvar)
- Edição e exclusão de imóveis

**Cliente (autenticado)**
- Registro de interesse em imóveis
- Página com lista dos imóveis de interesse
- Edição de nome no perfil

# 💰 API Finance

API REST desenvolvida com **Node.js e TypeScript** com foco em organização de código, boas práticas e arquitetura em camadas.

Este projeto foi criado para praticar conceitos de backend como CRUD, integração com banco de dados e estruturação de aplicações reais.

---

## 🛠 Tecnologias

- Node.js
- TypeScript
- MySQL
- Arquitetura em camadas (Controllers, Handlers, Models, Routes)
- Middlewares
- Tratamento de erros

---

## 📂 Estrutura do projeto
```
src/
├── config/         # Configurações (database)
├── controllers/    # Lógica de negócio e handlers
├── middlewares/    # Error handling
├── models/         # Acesso ao banco de dados
├── routes/         # Roteamento HTTP
├── utils/          # Funções utilitárias
└── server.ts       # Entrada da aplicação
```

---

## ⚙️ Como rodar o projeto

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/LinsArauj0/api-finance-node-ts
cd api-finance
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do MySQL:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=finance_db
DB_PORT=3306
```

### 4️⃣ Criar o banco de dados
Execute o script SQL no MySQL Workbench:
```sql
CREATE DATABASE IF NOT EXISTS finance_db;
USE finance_db;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category_id INT NOT NULL,
  date DATE NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Dados de exemplo
INSERT INTO categories (name, type) VALUES
('Salário', 'income'),
('Freelance', 'income'),
('Alimentação', 'expense'),
('Transporte', 'expense'),
('Lazer', 'expense');
```

### 5️⃣ Rodar o servidor
```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

---

## 📚 Endpoints da API

### 📂 Categories

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/categories` | Lista todas as categorias |
| GET | `/categories/:id` | Busca categoria por ID |
| GET | `/categories/type/:type` | Filtra por tipo (income/expense) |
| POST | `/categories` | Cria nova categoria |
| PUT | `/categories/:id` | Atualiza categoria |
| DELETE | `/categories/:id` | Deleta categoria |

#### Exemplo - Criar categoria:
```json
POST /categories
{
  "name": "Investimentos",
  "type": "income"
}
```

---

### 💸 Transactions

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/transactions` | Lista todas as transações |
| GET | `/transactions/:id` | Busca transação por ID |
| GET | `/transactions/type/:type` | Filtra por tipo (income/expense) |
| GET | `/transactions/period?start=X&end=Y` | Filtra por período |
| POST | `/transactions` | Cria nova transação |
| PUT | `/transactions/:id` | Atualiza transação |
| DELETE | `/transactions/:id` | Deleta transação |

#### Exemplo - Criar transação:
```json
POST /transactions
{
  "description": "Salário de Março",
  "amount": 5500.00,
  "category_id": 1,
  "date": "2024-03-05",
  "type": "income"
}
```

#### Exemplo - Filtrar por período:
```
GET /transactions/period?start=2024-02-01&end=2024-02-28
```

---

## 🎯 Funcionalidades

- ✅ CRUD completo de categorias e transações
- ✅ Validação de dados
- ✅ Relacionamento entre tabelas (Foreign Key)
- ✅ Filtros por tipo e período
- ✅ Validação cruzada (tipo da transação vs tipo da categoria)
- ✅ Tratamento de erros centralizado
- ✅ Arquitetura em camadas
- ✅ TypeScript com tipagem forte

---

## 🧪 Testando a API

Você pode testar os endpoints usando:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- cURL

---

## 📝 Scripts disponíveis
```bash
npm run dev      # Roda em modo desenvolvimento (com watch)
npm run build    # Compila o TypeScript
npm start        # Roda a versão compilada
```

---

## 👨‍💻 Autor

Desenvolvido como projeto de estudo de Node.js e TypeScript.

---

## 📄 Licença

Este projeto está sob a licença MIT.
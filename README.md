# 🛡️ ThreatOne | Enterprise CTI Platform

**ThreatOne** é uma plataforma avançada de *Cyber Threat Intelligence* (CTI) de classe empresarial, projetada para analistas de SOC, Threat Hunters e arquitetos de segurança. A solução combina monitoramento de ativos, inteligência de ameaças em tempo real e correlação assistida por IA.

---

## 💎 Diferenciais Estratégicos

- 🧠 **AI Correlation Center**: Motor de correlação tática utilizando Google Gemini 3 Flash com Grounding (Google Search) para identificar ameaças em tempo real.
- 🕸️ **Darkweb & Insider Monitoring**: Scrapers integrados para fóruns (XSS.is, BreachForums) e canais de Telegram/Discord.
- 🔑 **StackPass™ Leak Intel**: Monitoramento de exposição de credenciais capturadas por infostealers (Redline, Vidar, Raccoon).
- 📊 **STIX 2.1 Graph**: Visualização interativa de relacionamentos entre Atores, Malware e Vulnerabilidades.
- 📋 **Automated Playbooks**: Workflows de resposta a incidentes (IR) com exportação de SOPs.

---

## 🛠️ Stack Tecnológica

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Node.js, Express, TypeScript.
- **Inteligência Artificial**: Google GenAI SDK (Gemini 3 Flash Preview).
- **Banco de Dados**: MySQL 8.0 (Relacional e Persistente).
- **Infraestrutura**: Docker & Docker Compose.

---

## 🚀 Guia de Instalação

### Pré-requisitos
- Docker & Docker Compose instalados.
- MySQL Server (opcional se rodar fora do Docker).
- Google Gemini API Key ([Obter aqui](https://aistudio.google.com/app/apikey)).

### Opção 1: Automação via Bash (Recomendado para Linux)
O script configura o `.env`, inicializa o banco de dados e sobe os containers.
```bash
chmod +x setup.sh
sudo ./setup.sh
```

### Opção 2: Automação via Python
Ideal para ambientes onde o Python 3 é a ferramenta de automação padrão.
```bash
python3 deploy.py
```

### Opção 3: Instalação Manual
1. **Configurar Variáveis**: Copie o `.env.example` para `.env` e preencha os dados.
2. **Inicializar Banco**:
   ```bash
   mysql -u root -p < init.sql
   ```
3. **Subir Containers**:
   ```bash
   docker compose up --build -d
   ```

---

## ⚙️ Variáveis de Ambiente (.env)

| Variável | Descrição |
| :--- | :--- |
| `API_KEY` | Sua chave da API Google Gemini. |
| `DB_HOST` | Endereço do MySQL (Use `127.0.0.1` ou `host.docker.internal`). |
| `DB_USER` | Usuário do banco de dados. |
| `DB_PASS` | Senha do banco de dados. |
| `DB_NAME` | Nome do schema (Padrão: `sdkcti`). |

---

## 📡 Acesso ao Sistema

Após o deploy, a plataforma estará disponível em:
- **Interface Principal**: [http://localhost:5173](http://localhost:5173)
- **API Backend**: [http://localhost:3001/api](http://localhost:3001/api)

---

## 📂 Estrutura do Projeto

```text
├── backend/            # Servidor Express & Lógica de IA
├── components/         # Componentes React (UI/UX)
├── views/              # Módulos principais da plataforma
├── init.sql            # Schema de banco de dados
├── setup.sh            # Script de deploy automatizado
├── docker-compose.yml  # Orquestração de containers
└── App.tsx             # Orquestrador de rotas e estado global
```
<img width="1587" height="806" alt="image" src="https://github.com/user-attachments/assets/722037ee-41e2-4d05-98b2-37ad6d042f9f" />

---
**Nota de Segurança**: Esta ferramenta processa dados sensíveis de inteligência. Certifique-se de restringir o acesso ao dashboard e proteger sua `API_KEY`.

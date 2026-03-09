<div align="center">

<!-- Animated title using SVG -->
<img src="https://readme-typing-svg.demolab.com?font=Special+Elite&size=42&duration=3000&pause=1000&color=B8001F&center=true&vCenter=true&width=600&lines=ASK+%C2%B7+US;Multi-Model+Intelligence;Three+AIs.+One+Query." alt="ASK · US Typing Animation" />

<br/>

<!-- Badges -->
![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring AI](https://img.shields.io/badge/Spring_AI_1.1.2-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

<br/>

![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_LLaMA_3.1-F54E00?style=for-the-badge&logo=meta&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama_Local-000000?style=for-the-badge&logo=llama&logoColor=white)
![OAuth2](https://img.shields.io/badge/Google_OAuth2-DB4437?style=for-the-badge&logo=google&logoColor=white)

<br/>

> *"This terminal provides simultaneous access to three classified analytical systems.*
> *All queries are logged and retained per Executive Order 12958."*

</div>

---

## 📸 Screenshots

<div align="center">

### 🔐 Operative Authentication
<img src="screenshot-login.png" alt="Login Page — Classified Dossier" width="80%"/>

<br/><br/>

### 🖥️ Mission Dashboard
<img src="screenshot-dashboard.png" alt="Dashboard — Operative on Duty" width="90%"/>

<br/><br/>

### ⚡ Parallel Intelligence Reports — First Intercept Received
<img src="screenshot-results.png" alt="Results — Three AI Models Racing" width="90%"/>

</div>

---

## 🕵️ What Is This?

**Ask · Us** is a full-stack web application themed as a Cold War-era intelligence dossier. Authenticated operatives (users) submit a single query and watch **three AI models race to respond in parallel** — Google Gemini, Groq (LLaMA 3.1), and a locally-running Ollama model. The UI highlights whichever model answers first with a **"FIRST INTERCEPT RECEIVED"** banner.

The design features aged paper textures, animated rubber stamps, a typewriter input field, floating paper fragments, and a live mission ticker — all built with pure React CSS-in-JS, no UI component library.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Google OAuth2 Login** | Secure authentication — users auto-registered to MongoDB on first login |
| 🤖 **3 AI Models in Parallel** | Gemini, Groq (LLaMA 3.1 8B), and Ollama fire simultaneously |
| ⚡ **First Intercept Banner** | Real-time highlight of whichever model responds first |
| 👤 **Operative Profile** | Displays user's Google name and profile photo |
| 🎨 **Classified Dossier UI** | Aged paper, stamps, typewriter fields, floating fragments, live ticker |
| 🚪 **Session Management** | Full login/logout with server-side session invalidation |
| 🌐 **CORS-Configured** | Configurable frontend URL for local dev and production |

---

## 🧰 Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 3.5.10 | Application framework |
| Java | 21 | Language |
| Spring AI | 1.1.2 | AI model abstraction layer |
| Spring Security | (Boot-managed) | Auth & route protection |
| Spring OAuth2 Client | (Boot-managed) | Google OAuth2 login |
| Spring Data MongoDB | (Boot-managed) | User persistence |
| Lombok | 1.18.38 | Boilerplate reduction |
| Maven | 3.8+ | Build tool |

### AI Providers
| Provider | Model | Integration |
|---|---|---|
| Google Gemini | Flash (GenAI) | `spring-ai-starter-model-google-genai` |
| Groq Cloud | LLaMA 3.1 8B Instant | `spring-ai-starter-model-openai` (OpenAI-compatible) |
| Ollama (Local) | LLaMA 3.2 Latest | `spring-ai-starter-model-ollama` |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework & build tooling |
| CSS-in-JS (inline) | All styling — no UI library used |
| Fetch API | HTTP with session cookies (`credentials: "include"`) |
| Google Fonts | Special Elite, Courier Prime, Oswald |

---

## 🗂️ Project Structure

```
Ask-us/
├── pom.xml                           # Maven build config (Spring AI BOM 1.1.2)
│
├── src/main/java/com/example/Ask/us/
│   ├── AiComponents/
│   │   ├── GeminiCOntroller.java     # GET /api/gemini/{message}  → Google Gemini
│   │   ├── GroqController.java       # GET /api/groq/{msg}        → Groq LLaMA 3.1
│   │   └── OllamController.java      # GET /api/ollama/{message}  → Ollama local
│   │
│   ├── Module/
│   │   └── Users.java                # MongoDB document (id, name, email, provider, role)
│   │
│   ├── Repo/
│   │   └── repo.java                 # MongoRepository — findByEmail, findByName
│   │
│   ├── Security/
│   │   ├── OAuthSuccessHandler.java  # Post-login: auto-register user → redirect to frontend
│   │   └── SecurityConfig.java       # Security chain, CORS, session, logout config
│   │
│   └── UserController/
│       └── Usercontroller.java       # GET /api/me → {name, email, picture}
│
├── src/main/resources/
│   └── application.properties        # ⚠️ Add to .gitignore — contains secrets
│
└── frontend/
    └── src/
        └── App.jsx                   # Entire React frontend (single-file)
```

---

## ⚙️ API Reference

| Method | Endpoint | Auth | Response |
|---|---|---|---|
| `GET` | `/api/me` | ✅ | `{name, email, picture}` |
| `GET` | `/api/gemini/{message}` | ✅ | AI text response |
| `GET` | `/api/groq/{msg}` | ✅ | AI text response |
| `GET` | `/api/ollama/{message}` | ✅ | AI text response |
| `GET` | `/oauth2/authorization/google` | ❌ | Redirects to Google login |
| `POST` | `/logout` | ✅ | `200 OK`, clears `JSESSIONID` |

All `/api/**` routes return `401 Unauthorized` for unauthenticated requests.

---

## 🚀 Getting Started

### Prerequisites

- ☕ Java 21+
- 📦 Maven 3.8+
- 🟢 Node.js 18+ & npm
- 🍃 MongoDB Atlas account or local MongoDB
- 🦙 [Ollama](https://ollama.com/) installed locally
- 🔑 Google Cloud OAuth2 credentials
- ⚡ [Groq Cloud](https://console.groq.com/) account (free tier available)
- 🌟 [Google AI Studio](https://aistudio.google.com/) Gemini API key (free tier available)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ask-us.git
cd ask-us
```

---

### 2. Configure the Backend

Create `src/main/resources/application.properties`:

```properties
spring.application.name=Ask-us

# ── Google Gemini ──────────────────────────────────────────────
spring.ai.google.genai.api-key=YOUR_GEMINI_API_KEY

# ── Groq — LLaMA 3.1 via OpenAI-compatible endpoint ───────────
spring.ai.openai.api-key=YOUR_GROQ_API_KEY
spring.ai.openai.base-url=https://api.groq.com/openai
spring.ai.openai.chat.options.model=llama-3.1-8b-instant
spring.ai.openai.chat.options.temperature=0.7

# ── Ollama (local) ─────────────────────────────────────────────
spring.ai.ollama.chat.model=llama3.2:latest

# ── Google OAuth2 ──────────────────────────────────────────────
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET

# ── MongoDB ────────────────────────────────────────────────────
spring.data.mongodb.uri=YOUR_MONGODB_CONNECTION_URI

# ── Frontend URL (CORS + post-login redirect) ──────────────────
frontend.url=http://localhost:5173
```

> ⚠️ **Never commit `application.properties` with real secrets.** Add it to `.gitignore`.

```bash
mvn spring-boot:run
# Backend starts at http://localhost:8080
```

---

### 3. Set Up Ollama

```bash
ollama pull llama3.2:latest
ollama serve
# Ollama runs at http://localhost:11434
```

---

### 4. Configure & Run the Frontend

```bash
cd frontend

# Create environment file
echo "VITE_BACKEND_URL=http://localhost:8080" > .env

npm install
npm run dev
# App available at http://localhost:5173
```

---

## 🔑 Google OAuth2 Setup

1. Open [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**
2. **Create Credentials → OAuth 2.0 Client ID** → Web Application
3. Add **Authorized Redirect URI**:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
4. Copy **Client ID** and **Client Secret** → paste into `application.properties`

---

## 🗃️ MongoDB — Users Collection

```json
{
  "_id":      "ObjectId (auto-generated)",
  "name":     "Latesh Shetty",
  "email":    "user@gmail.com",
  "provider": "Google",
  "Role":     "ROLE_USER"
}
```

Users are **auto-registered on first Google login** — no sign-up form needed. The `email` field has a unique index.

---

## 🌿 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `spring.ai.google.genai.api-key` | Backend | Gemini API key |
| `spring.ai.openai.api-key` | Backend | Groq Cloud API key |
| `spring.security.oauth2.client.registration.google.client-id` | Backend | Google OAuth2 client ID |
| `spring.security.oauth2.client.registration.google.client-secret` | Backend | Google OAuth2 client secret |
| `spring.data.mongodb.uri` | Backend | MongoDB connection string |
| `frontend.url` | Backend | Frontend origin for CORS & post-login redirect |
| `VITE_BACKEND_URL` | Frontend | Backend base URL consumed by React |

---

## 🔒 Security Architecture

```
Browser (React)
     │  credentials: "include"  (sends JSESSIONID cookie)
     ▼
Spring Security Filter Chain
     │  CORS: only allows configured frontend.url
     │  All /api/** → requires authenticated session
     │  /oauth2/**, /login** → public
     ▼
Google OAuth2 Login
     │  OAuthSuccessHandler: saves new user to MongoDB
     │  Redirects browser back to frontend.url
     ▼
Session stored server-side (JSESSIONID cookie)
     │  Logout: invalidates session + deletes cookie
```

---

## 📦 pom.xml — Key Dependencies

```xml
<properties>
    <java.version>21</java.version>
    <spring-ai.version>1.1.2</spring-ai.version>
</properties>

<dependencies>
    <!-- Spring AI — Gemini -->
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-starter-model-google-genai</artifactId>
    </dependency>

    <!-- Spring AI — Groq via OpenAI-compatible API -->
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-starter-model-openai</artifactId>
    </dependency>

    <!-- Spring AI — Ollama -->
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-starter-model-ollama</artifactId>
    </dependency>

    <!-- OAuth2 + Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-oauth2-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- MongoDB -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.38</version>
    </dependency>
</dependencies>

<!-- Spring AI BOM for version management -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-bom</artifactId>
            <version>${spring-ai.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

---

## 🐛 Troubleshooting

<details>
<summary><b>🦙 Ollama not responding</b></summary>

Ensure Ollama is running and the model is downloaded:
```bash
ollama pull llama3.2:latest
ollama serve
```
Ollama defaults to `http://localhost:11434`. Spring AI will connect automatically.
</details>

<details>
<summary><b>🔒 401 Unauthorized on API calls</b></summary>

All frontend `fetch()` calls must include `credentials: "include"`. Also confirm that `frontend.url` in `application.properties` exactly matches your Vite dev server origin (including port, e.g. `http://localhost:5173`).
</details>

<details>
<summary><b>🔗 Google OAuth redirect_uri_mismatch</b></summary>

The URI in Google Cloud Console must exactly match:
```
http://YOUR_BACKEND_HOST:PORT/login/oauth2/code/google
```
For production, update to your deployed backend URL.
</details>

<details>
<summary><b>🍃 MongoDB connection failure</b></summary>

If using Atlas: go to **Network Access** and whitelist your current IP (or `0.0.0.0/0` for dev). Check the connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
</details>

<details>
<summary><b>🤖 Spring AI bean qualification error</b></summary>

If you get `NoUniqueBeanDefinitionException` for `ChatModel`, the `@Qualifier` values in controllers must match Spring AI's registered bean names:

| Controller | `@Qualifier` value |
|---|---|
| `GeminiCOntroller` | `"googleGenAiChatModel"` |
| `GroqController` | `"openAiChatModel"` |
| `OllamController` | `"ollamaChatModel"` |
</details>

---

## 📄 Recommended `.gitignore`

```gitignore
# ⚠️ NEVER commit these — contain API keys and secrets
src/main/resources/application.properties
frontend/.env
frontend/.env.local

# Build output
target/
node_modules/
dist/

# IDE
.idea/
*.iml
.vscode/
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Courier+Prime&size=14&duration=4000&pause=2000&color=B8001F&center=true&vCenter=true&width=600&lines=STATION+7+%C2%B7+FEBRUARY+2026+%C2%B7+TOP+SECRET;ALL+QUERIES+LOGGED+%C2%B7+EXECUTIVE+ORDER+12958;MULTI-MODEL+INTELLIGENCE+DIVISION" alt="Footer ticker" />

**Built with ☕ Java + ⚛️ React + 🤖 Spring AI**

</div>

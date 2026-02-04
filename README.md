# Veterinary App

![Status: In Development](https://img.shields.io/badge/status-In%20Development-yellow)

A full-stack system for managing veterinary clinics, veterinarians, clients, animals, appointments, medications, and vaccines.

- **Backend**: Spring Boot (Java), MySQL, JPA, Security (JWT)
- **Frontend**: React + Vite, React Router, Axios, npm
- **Infrastructure**: Docker & Docker Compose

---

## Project Structure

```bash
App-Veterinario/
├── backend/
│   └── demo/                        # Spring Boot module
│       ├── src/main/java/com/
│       │   ├── configuration/       # Web, CORS, Security configs, mappings
│       │   ├── controller/          # REST APIs: Animal, Client, Appointment, etc.
│       │   ├── dto/                 # Input/output DTOs per domain
│       │   ├── enums/               # Types like State, Gender
│       │   ├── extras/              # Utilities and email handling
│       │   ├── model/               # JPA entities
│       │   ├── repository/          # JPA interfaces
│       │   ├── security/            # Auth, filters, services, user repository
│       │   ├── service/             # Business rules and exceptions
│       │   └── VeterinarioBackendApplication.java    # Main class
│       ├── src/main/resources/
│       │   ├── application.properties    # Application configuration
│       │   └── data.sql                  # Optional seed data
│       └── pom.xml                       # Maven dependencies and plugins
│   ├── docker-compose.yml               # Docker services
│   ├── Dockerfile                       # Backend container build
│   ├── .env.example                     # Environment variables template
│   └── imagens/                         # Image storage volume
├── frontend/
│   ├── src/
│   │   ├── assets/           # Styles and images
│   │   ├── components/       # Form components, extras, security
│   │   ├── pages/            # Navigation pages
│   │   ├── App.jsx           # Routes and layout
│   │   └── main.jsx          # Application bootstrap
│   ├── .env                  # API endpoint config
│   ├── package.json          # Scripts and dependencies
│   └── vite.config.js        # Vite configuration
├── README.md                 # This file
└── .gitignore
```

---

## Requirements

### Running with Docker (Recommended)

- Docker
- Docker Compose

### Running without Docker (Optional)

- Java 21+
- Maven
- Node.js
- MySQL

---

## Backend Setup

### 🐳 Running with Docker (Recommended)

Docker runs the backend and database automatically and avoids environment conflicts.

#### 1. Environment Variables

Inside the backend folder, create a `.env` file based on `.env.example`.

**Linux/Mac:**
```bash
cp .env.example .env
```

**Windows:**
```bash
copy .env.example .env
```

#### 2. Configure .env

Replace placeholder values inside `.env`:

```properties
DB_URL=jdbc:mysql://mysql:3306/appveterinario
DB_USER=root
DB_PASSWORD=your_password_here

JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_secret_here
JWT_RESET_SECRET=your_secret_here
JWT_VERIFICATION_SECRET=your_secret_here
JWT_VETERINARIO_SECRET=your_secret_here

MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_password

FILE_PATH=/app/imagens
```

#### 3. Build and Run Containers

From the backend directory:

```bash
docker compose up --build
```

#### 4. Access Backend API

```
http://localhost:8080
```

### 💻 Running Backend Without Docker (Optional)

#### 1. Database Configuration

Create a schema in MySQL (`appveterinario`), and update the following in `backend/demo/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/appveterinario
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

Optional: Adjust image storage path (`file.path`) and SMTP email settings.

#### 2. Build and Run

From the backend directory:

**Linux/Mac:**
```bash
./mvnw spring-boot:run
```

**Windows:**
```bash
mvnw.cmd spring-boot:run
```

API available at:
```
http://localhost:8080
```

---

## Frontend Setup

#### 1. Environment Variables

In `frontend/.env`:

```properties
VITE_API_URL=http://localhost:8080
```

#### 2. Install Dependencies

```bash
cd frontend
npm install
```

#### 3. Run Frontend

```bash
npm run dev
```

Visit:
```
http://localhost:5173
```

---

## Security

Protected pages/routes use an authentication context.

### Backend exposes:

- Login
- Registration
- Forgot/Reset password endpoints

### Frontend uses:

- Axios with `withCredentials` to handle authentication
- Refresh Tokens
- Access Tokens

---

## Main Domains

- **Client**
- **Veterinarian**
- **Clinic**
- **Animal**
- **Appointment**
- **Medication**
- **Vaccine**

### Each domain includes:

- **model** (entities)
- **repository** (persistence layer)
- **service** (business logic)
- **controller** (API endpoints)
- **dto** (input/output contracts)

---

## Important Tips

- Containers communicate using service names (ex: `mysql`)
- Avoid using `localhost` for database connection inside Docker
- Stop local MySQL to avoid port conflicts
- `.env` is not committed for security reasons. Use `.env.example` as a template.

---

## Functionalities Not Implemented

### Backend

- Tests
- Security Configuration improvements
- Some input validations

### Frontend

- Mobile design
- Improved UI and CSS
- Adaptation of the UI for certain users
- Medication and Vaccine Implementation

### General

- Deployment
- CI/CD pipeline

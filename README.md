# Veterinary App

![Status: In Development](https://img.shields.io/badge/status-In%20Development-yellow)

A full-stack system for managing veterinary clinics, veterinarians, clients, animals, appointments, medications, and vaccines.

- **Backend**:
  - Spring Boot 3
  - Java 21
  - Spring Web (REST APIs)
  - Spring Data JPA (Persistence layer)
  - Spring Security (Authentication & Authorization)
  - JWT Authentication (Auth0 java-jwt)
  - Spring Validation (Bean validation)
  - Spring Mail (Email service)
  - Spring Boot Actuator (Monitoring & health checks)
  - ModelMapper (DTO mapping)
  - Lombok (Boilerplate reduction)

- **Database**:
  - MySQL

- **Configuration**:
  - dotenv support for environment variables

- **Build & Dependency Management**:
  - Maven
  - Maven Wrapper (mvnw)

- **Testing**:
  - JUnit
  - Mockito
  - Spring Security Test

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
│       │   └── VeterinarioAplication/   # Main class
│       ├── src/main/resources/
│       │   ├── application.properties    # Application configuration
│       │   └── data.sql                  # Optional seed data
│       └── pom.xml                       # Maven dependencies and plugins
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
│   ├── Dockerfile            # Backend container build
│   ├── package.json          # Scripts and dependencies
│   └── vite.config.js        # Vite configuration
│   └── nginx.conf            # Nginx configuration
├── README.md                 # This file
├── docker-compose.yml        # Docker services
├── .env.example              # Enviromment Variables
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


## Running with Docker (Recommended)

Docker runs the backend, database and frontend automatically and avoids environment conflicts.

Make sure that these port are't occupied 3306, 8080, 5173

#### 1. Environment Variables

Inside the APP-VETERINARIO folder, create a `.env` file based on `.env.example`.

**Linux/Mac:**
```bash
cp .env.example .env
```

**Windows:**
```bash
copy .env.example .env
```

#### 2. Configure .env

Replace placeholder values inside `.envExample`:

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

APP_FRONTEND_URL= http://localhost
APP_BACKEND_URL=http://localhost/api
```

#### 3. Build and Run Containers

From the APP-VETERINARIO directory:

```bash
# Perform a clean build  
docker-compose down -v 
# start all services
docker-compose up --build
```

#### 4. Access Backend API

```
http://localhost/backend
```

#### 5. Acess Frontend

```
  http://localhost
```

---

##  Running Backend Without Docker (Optional)

#### 1. Database Configuration

Create a schema in MySQL (`appveterinario`), and update the following in `backend/demo/.env.example`:

```properties
DB_URL=jdbc:mysql://localhost:3306/appveterinario
DB_USER=root
DB_PASSWORD=change_me

JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me
JWT_RESET_SECRET=change_me
JWT_VERIFICATION_SECRET=change_me
JWT_VETERINARIO_SECRET=change_me

MAIL_USER=example@gmail.com
MAIL_PASS=change_me

APP_FRONTEND_URL=http://localhost:5173
APP_BACKEND_URL=http://localhost:8080/api
```

### Backend Setup

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

### Frontend Setup

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

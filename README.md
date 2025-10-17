# Veterinary App


![Status: In Development](https://img.shields.io/badge/status-In%20Development-yellow)


A full-stack system for managing veterinary clinics, veterinarians, clients, animals, appointments, medications, and vaccines.

- **Backend**: Spring Boot (Java), MySQL, JPA, Security (JWT)
- **Frontend**: React + Vite, React Router, Axios, npm 

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
│   ├── mvnw                              # Maven Wrapper (Linux/Mac)
│   └── mvnw.cmd                          # Maven Wrapper (Windows)
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

- Java 21+
- Maven
- Node.js
- MySQL

---

## Backend Setup

### 1. Database Configuration

Create a schema in MySQL (`appveterinario`), and update the following in  
`backend/demo/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/appveterinario
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

Optional: Adjust image storage path (file.path) and SMTP email settings.
```

2. Build and Run
From the backend directory:

Linux/Mac:
```
./mvnw spring-boot:run
```
Windows:
```
mvnw.cmd spring-boot:run
```
API available at: http://localhost:8080

## Frontend Setup
1. Environment Variables
In frontend/.env:
```
VITE_API_URL=http://localhost:8080
```

1. Install Dependencies
```
cd frontend
npm install
```

2. Run
```
npm run dev
```

Visit the URL shown http://localhost:5173

## Security

Protected pages/routes use an authentication context

Backend exposes:

Login

Registration

Forgot/Reset password endpoints

Frontend uses Axios with withCredentials to handle cookies/sessions

Refresh and Access Tokens

### Main Domains

Client

Veterinarian

Clinic

Animal

Appointment

Medication

Vaccine

### Each domain includes:

model (entities)

repository (persistence layer)

service (business logic)

controller (API endpoints)

dto (input/output contracts)

### Tip
Adjust CORS and credentials if using different domains or ports

## Functionalities Not Implemented

### Backend
- Tests
- Security Configuration
- Some input validations 

### Frontend
- Mobile design
- Improved UI and Css 
- Adaptation of the UI for certain users
- Medication and Vaccine Implementation

### General
- Deployment

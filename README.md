![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
# 🚀 TaskFlow

A full-stack task management application built with **Spring Boot**, **React**, **PostgreSQL**, and **JWT Authentication**.

TaskFlow allows users to securely manage their tasks through a modern web interface while demonstrating industry-standard backend architecture, authentication, API design, and database management practices.

---

## 📸 Overview

TaskFlow is a secure and scalable task management platform that supports:

* User Registration & Authentication
* JWT Access Tokens
* Refresh Token Authentication Flow
* Secure Logout & Token Revocation
* Task Creation, Updates & Deletion
* Search, Filtering & Pagination
* Swagger/OpenAPI Documentation
* Dockerized Backend
* Dark Mode Frontend

---

## ✨ Features

### 🔐 Authentication & Security

* User Registration
* User Login
* BCrypt Password Encryption
* JWT Access Token Authentication
* Refresh Token Mechanism
* Secure Logout
* Stateless Security Configuration
* Protected API Endpoints
* User-specific Data Access

### ✅ Task Management

* Create Tasks
* Update Tasks
* Delete Tasks
* View Task Details
* Task Priorities
* Task Status Tracking
* Due Date Management

### 🔎 Search & Filtering

* Search Tasks by Title
* Filter by Status
* Filter by Priority
* Sort by Due Date
* Sort by Creation Date
* Pagination Support

### 📚 API Documentation

* Swagger UI Integration
* OpenAPI Specification
* Interactive API Testing

### 🎨 Frontend

* React + Vite
* Tailwind CSS
* Dark Mode Support
* Responsive Design
* Axios API Integration
* Protected Routes
* Automatic Token Refresh

##Screenshots
Landing Page
<img width="3520" height="1080" alt="image" src="https://github.com/user-attachments/assets/34e93ef3-0f09-4117-8e25-a6c8a09116a7" />
Login Page
<img width="3520" height="1080" alt="image" src="https://github.com/user-attachments/assets/601553c2-268e-460a-9fad-2c89ffb208ec" />
Registration Page
<img width="3520" height="1080" alt="image" src="https://github.com/user-attachments/assets/476d76c2-ef0b-4a22-9d1f-3b80ee434068" />
Dashboard
<img width="3520" height="1080" alt="image" src="https://github.com/user-attachments/assets/6e3de858-97cc-4e95-bbb5-80e18a1ee8af" />
Add New Task
<img width="3520" height="1080" alt="image" src="https://github.com/user-attachments/assets/d563bffb-7a67-4176-a3c6-d3067d37acca" />
---

## 🛠️ Tech Stack

### Backend

* Java 21
* Spring Boot 3
* Spring Security
* Spring Data JPA
* Hibernate
* PostgreSQL
* JWT (JSON Web Tokens)
* Maven
* Swagger / OpenAPI

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* Axios
* React Router

### DevOps

* Docker
* Docker Compose

---

## 🏗️ Architecture

```text
React Frontend
       │
       ▼
Spring Boot REST API
       │
       ├── JWT Authentication
       ├── Refresh Tokens
       ├── Spring Security
       ├── Validation
       ├── Exception Handling
       ▼
PostgreSQL Database
```

---

## 🔐 Authentication Flow

### Login

```text
User Login
    ↓
Validate Credentials
    ↓
Generate Access Token
    ↓
Generate Refresh Token
    ↓
Store Refresh Token in Database
    ↓
Return Tokens
```

### Refresh Token

```text
Expired Access Token
    ↓
Refresh Endpoint
    ↓
Validate Refresh Token
    ↓
Generate New Access Token
    ↓
Return New Access Token
```

### Logout

```text
Logout Request
    ↓
Delete Refresh Token
    ↓
Invalidate Session
```

---

## 📂 Project Structure

### Backend

```text
src/main/java
├── config
├── controller
├── dto
├── entity
├── exception
├── repository
├── security
├── service
│   ├── impl
├── specification
└── util
```

### Frontend

```text
src
├── components
├── pages
├── layouts
├── routes
├── services
├── hooks
├── context
└── utils
```

---

## 📖 API Endpoints

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| POST   | /api/auth/refresh  |
| POST   | /api/auth/logout   |

### Tasks

| Method | Endpoint        |
| ------ | --------------- |
| POST   | /api/tasks      |
| GET    | /api/tasks      |
| GET    | /api/tasks/{id} |
| PUT    | /api/tasks/{id} |
| DELETE | /api/tasks/{id} |

---

## 🔍 Task Query Examples

### Pagination

```http
GET /api/tasks?page=0&size=10
```

### Search

```http
GET /api/tasks?search=spring
```

### Filter By Status

```http
GET /api/tasks?status=TODO
```

### Filter By Priority

```http
GET /api/tasks?priority=HIGH
```

### Sort By Due Date

```http
GET /api/tasks?sortBy=dueDate
```

---

## 📚 Swagger Documentation

After starting the backend:

```text
http://localhost:8080/swagger-ui/index.html
```

---

## 🐳 Docker

### Build Image

```bash
docker build -t taskflow .
```

### Run Container

```bash
docker run -p 8080:8080 taskflow
```

### Docker Compose

```bash
docker compose up --build
```

---

## ⚙️ Environment Variables

Example configuration:

```env
DB_URL=jdbc:postgresql://localhost:5432/taskflow_db
DB_USERNAME=postgres
DB_PASSWORD=postgres

JWT_SECRET=your-secret-key
```

---

## 🚀 Running Locally

### Backend

```bash
git clone <repository-url>

cd taskflow

./mvnw clean package

./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 🎯 Learning Outcomes

This project was built to gain hands-on experience with:

* Spring Security
* JWT Authentication
* Refresh Token Architecture
* REST API Design
* PostgreSQL Integration
* React Frontend Development
* Docker Containerization
* Swagger/OpenAPI Documentation
* Secure Full-Stack Application Development

---

## 👨‍💻 Author

**Sahajit Mondal**

Built as a full-stack portfolio project to explore modern backend and frontend development practices using the Spring ecosystem and React.

---

## ⭐ Future Improvements

* Email Verification
* Password Reset
* User Profile Management
* Task Categories & Tags
* File Attachments
* Real-time Notifications
* Cloud Deployment Pipeline
* CI/CD Automation
* Redis Token Caching
* Kubernetes Deployment

---

If you found this project interesting, consider giving it a ⭐ on GitHub.

# Skill-Sharing & Learning Platform

A web application for sharing and learning skills through tutorials, media, notifications, and personalized learning plans. Users can post tutorials, follow others, like/comment, attach media, and create learning goals. The backend is built with **Spring Boot** and **MySQL**, and the frontend uses **React** with **Material-UI**.

This README guides you through setting up and running the **backend** (port `8080`) and **frontend** (port `3000`).

---

## Table of Contents
- [Project Overview](#project-overview)
- [Backend (Spring Boot)](#backend-spring-boot)
  - [Features](#backend-features)
  - [Folder Structure](#backend-folder-structure)
  - [Prerequisites](#backend-prerequisites)
  - [Setup and Running](#backend-setup-and-running)
- [Frontend (React)](#frontend-react)
  - [Features](#frontend-features)
  - [Folder Structure](#frontend-folder-structure)
  - [Prerequisites](#frontend-prerequisites)
  - [Setup and Running](#frontend-setup-and-running)
- [CORS Configuration](#cors-configuration)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
The Skill-Sharing & Learning Platform lets users:
- Share tutorials (e.g., "Learn Python", "Bake a Cake").
- Add media (images/videos) to posts.
- Follow users, like/comment on posts, and get notifications.
- Create learning plans (e.g., "Master Coding in 30 Days").
- Browse posts and plans in a user-friendly interface.

The **backend** handles data storage, user management, and API endpoints. The **frontend** displays posts, profiles, and plans using a clean, card-based UI.

---

## Backend (Spring Boot)

### Backend Features
- **Users**: Register and manage user profiles.
- **Skill Posts**: Create, view, update, delete, and list tutorials (e.g., `GET /api/v1/skill-posts`).
- **Media**: Attach images/videos to posts (up to 5 per post).
- **Notifications**: Alert users about likes, comments, or follows.
- **Learning Plans**: Organize learning goals with titles and descriptions.
- **REST API**: Secure endpoints with validation and pagination.
- **CORS**: Allows frontend requests from `localhost:3000`.

### Backend Folder Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/skillshare/skillshare_platform/
│   │   │   ├── config/                 # Configuration (e.g., CorsConfig.java)
│   │   │   │   └── CorsConfig.java
│   │   │   ├── controller/             # REST API endpoints
│   │   │   │   ├── SkillPostController.java
│   │   │   │   ├── UserController.java
│   │   │   │   ├── MediaController.java
│   │   │   │   ├── NotificationController.java
│   │   │   │   └── LearningPlanController.java
│   │   │   ├── dto/                    # Data Transfer Objects
│   │   │   │   ├── SkillPostRequestDto.java
│   │   │   │   ├── SkillPostResponseDto.java
│   │   │   │   ├── MediaRequestDto.java
│   │   │   │   ├── NotificationResponseDto.java
│   │   │   │   └── LearningPlanResponseDto.java
│   │   │   ├── exception/              # Custom exceptions
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   └── ResourceConflictException.java
│   │   │   ├── model/                  # Database entities
│   │   │   │   ├── User.java
│   │   │   │   ├── SkillPost.java
│   │   │   │   ├── Media.java
│   │   │   │   ├── Notification.java
│   │   │   │   └── LearningPlan.java
│   │   │   ├── repository/             # JPA repositories
│   │   │   │   ├── SkillPostRepository.java
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── MediaRepository.java
│   │   │   │   ├── NotificationRepository.java
│   │   │   │   └── LearningPlanRepository.java
│   │   │   ├── service/                # Business logic
│   │   │   │   ├── SkillPostService.java
│   │   │   │   ├── UserService.java
│   │   │   │   ├── MediaService.java
│   │   │   │   ├── NotificationService.java
│   │   │   │   └── LearningPlanService.java
│   │   │   └── SkillsharePlatformApplication.java  # Main application
│   │   ├── resources/
│   │   │   └── application.properties  # Database and server config
│   └── test/                           # Unit tests (not implemented)
├── pom.xml                             # Maven dependencies
└── README.md                           # This file
```

### Backend Prerequisites
- **Java 17** or higher
- **Maven 3.8+**
- **MySQL 8.0+**
- **IDE** (e.g., IntelliJ, VS Code)

### Backend Setup and Running
1. **Clone the Repository**:
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Set Up MySQL**:
   - Create a database: `CREATE DATABASE skillshare_db;`
   - Update `src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/skillshare_db
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     spring.jpa.hibernate.ddl-auto=update
     server.port=8080
     ```

3. **Install Dependencies**:
   ```bash
   mvn clean install
   ```

4. **Run the Backend**:
   ```bash
   mvn spring-boot:run
   ```
   - The backend runs on `http://localhost:8080`.
   - Test with Postman: `GET http://localhost:8080/api/v1/skill-posts?page=0&size=10`

5. **Key Endpoints**:
   - `POST /api/v1/skill-posts`: Create a post.
   - `GET /api/v1/skill-posts`: List all posts (paginated).
   - `GET /api/v1/skill-posts?userId={id}`: List posts by user.
   - `GET /api/v1/learning-plans`: List learning plans.

---

## Frontend (React)

### Frontend Features
- **Post Feed**: Displays skill posts as Material-UI cards (title, username, description).
- **User Profiles**: Shows user-specific posts (e.g., Sarah’s cooking tutorials).
- **Responsive UI**: Clean, card-based design for desktops and mobiles.
- **API Integration**: Fetches posts from backend (`/api/v1/skill-posts`).

### Frontend Folder Structure
```
frontend/
├── public/
│   ├── index.html                  # Main HTML file
│   └── favicon.ico                 # App icon
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── PostFeed.js             # Displays list of posts
│   │   ├── PostCard.js             # Single post card
│   │   └── Navbar.js               # Navigation bar
│   ├── pages/                      # Page components
│   │   ├── Home.js                 # Homepage with post feed
│   │   ├── Profile.js              # User profile page
│   │   └── LearningPlans.js        # Learning plans page
│   ├── App.js                      # Main app component
│   ├── index.js                    # Entry point
│   ├── App.css                     # Global styles
│   └── index.css                   # Base styles
├── package.json                    # NPM dependencies
├── README.md                       # This file (or frontend-specific)
└── .gitignore                      # Ignored files
```

### Frontend Prerequisites
- **Node.js 16+**
- **NPM 8+**
- **Browser** (e.g., Chrome, Firefox)

### Frontend Setup and Running
1. **Navigate to Frontend**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   - Installs `axios`, `@mui/material`, `@emotion/react`, `@emotion/styled`.

3. **Run the Frontend**:
   ```bash
   npm start
   ```
   - The frontend runs on `http://localhost:3000`.
   - Opens in your browser automatically.

4. **Verify Post Feed**:
   - Ensure the backend is running (`localhost:8080`).
   - The homepage (`/`) shows a list of posts fetched from `http://localhost:8080/api/v1/skill-posts?page=0&size=10`.
   - Check browser console (F12) for errors.

---

## CORS Configuration
To allow the frontend (`localhost:3000`) to communicate with the backend (`localhost:8080`), CORS is configured in `backend/src/main/java/com/skillshare/skillshare_platform/config/CorsConfig.java`. This permits `GET`, `POST`, `PUT`, `DELETE` requests from `localhost:3000` to `/api/v1/*` endpoints.

**Note**: If you deploy the frontend to a different URL (e.g., `https://your-app.com`), update `allowedOrigins` in `CorsConfig.java`.

---

## License
MIT License. See [LICENSE](LICENSE) for details.

# PollPulse: A Real-Time Polling App (MEAN Stack + WebSockets)

PollPulse is a full-stack, real-time polling application built to demonstrate the MEAN stack (MongoDB, Express.js, Angular, Node.js) combined with WebSockets for live data synchronization.

Users can create polls, vote, and see the results update instantly on their screen without refreshing the page. The entire development environment is containerized with Docker Compose.



---

## 🚀 Technology Stack

* **Frontend:** Angular 17+
* **Backend:** Node.js (v20+), Express.js
* **Database:** MongoDB
* **Real-time:** WebSockets (Socket.io)
* **API Documentation:** Swagger (via static `swagger.json`)
* **Containerization:** Docker & Docker Compose

---

## 📦 Getting Started (1-Command Setup)

This entire development environment (frontend, backend, and database) is containerized and can be started with a single command.

### Prerequisites

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
* [Git](https://git-scm.com/) installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/viktortoman/portfolio-realtime-poll-app-node-angular.git](https://github.com/viktortoman/portfolio-realtime-poll-app-node-angular.git)
    cd portfolio-realtime-poll-app-node-angular
    ```

2.  **Create the Environment File:**
    This project uses an example file to manage environment variables. Copy it to create your local `.env` file.

    *On macOS / Linux:*
    ```bash
    cp .env.example .env
    ```
    *On Windows (Command Prompt):*
    ```bash
    copy .env.example .env
    ```
    *(The default values in this file are already configured to work with the Docker setup.)*

3.  **Build and Run the Containers:**
    ```bash
    docker-compose up -d --build
    ```

That's it! All services are now running in development mode with hot-reloading enabled.

## 🌐 Environment & Access Points

Once `docker-compose up` is complete, the environment is ready:

### 1. Frontend (Angular Client)

* **Access:** `http://localhost:4200`
* **Location:** `/frontend` directory
* **Details:** The Angular development server (`ng serve`) with hot-reloading.

### 2. Backend (Node.js API)

* **Access:** `http://localhost:3000`
* **Location:** `/backend` directory
* **Details:** The Node.js/Express server running via `nodemon` with hot-reloading.

### 3. API Documentation (Swagger)

* **Access:** `http://localhost:3000/api-docs`
* **Details:** A static, interactive Swagger UI documentation for the API.

### 4. Database (MongoDB)

* **Access (Host):** `mongodb://localhost:27017`
* **Access (Container):** The Node.js backend connects via the environment variables defined in the `.env` file (e.g., `mongodb://db:27017/pollpulse`).
* **Details:** You can connect to this database using a GUI tool like **MongoDB Compass** to view your data.
* **Persistence:** Database data is stored in a Docker volume (`mongo_data`) so it persists even when you stop or remove the containers.

---

### Useful Docker Commands

* **To stop all containers:**
    ```bash
    docker-compose down
    ```
* **To stop and remove data volumes (fresh start):**
    ```bash
    docker-compose down -v
    ```
* **To see the logs (e.g., for the 'backend' service):**
    ```bash
    docker-compose logs -f backend
    ```
* **To run a command inside a container (e.g., install a new npm package):**
    ```bash
    # For the backend:
    docker-compose exec backend npm install <package_name>
    
    # For the frontend:
    docker-compose exec frontend npm install <package_name>
    ```
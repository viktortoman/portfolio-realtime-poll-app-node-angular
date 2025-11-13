# PollPulse: A Real-Time Polling App (MEAN Stack + WebSockets)

PollPulse is a full-stack, real-time polling application built to demonstrate the MEAN stack (MongoDB, Express.js, Angular, Node.js) combined with WebSockets for live data synchronization.

Users can create polls, vote, and see the results update instantly on their screen without refreshing the page. The entire development environment is containerized with Docker Compose.

---

## 🚀 Technology Stack

* **Frontend:** Angular 17+
* **Backend:** Node.js (v20+), Express.js
* **Database:** MongoDB
* **Real-time:** WebSockets (Socket.io)
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

2.  **Build and Run the Containers:**
    ```bash
    docker-compose up -d --build
    ```

That's it! All services are now running in development mode with hot-reloading enabled.

* The `docker-compose` command automatically:
    * Builds the `backend` and `frontend` images.
    * Installs all `npm` dependencies inside the containers.
    * Starts the Node.js (`nodemon`), Angular (`ng serve`), and MongoDB services.
    * Connects all services to a shared Docker network.

## 🌐 Environment & Access Points

Once `docker-compose up` is complete, the environment is ready:

### 1. Frontend (Angular Client)

* **Access:** `http://localhost:4200`
* **Location:** `/frontend` directory
* **Details:** This is the Angular development server (`ng serve`). It features hot-reloading, so any changes you make to the Angular code will be reflected instantly in your browser.

### 2. Backend (Node.js API)

* **Access:** `http://localhost:3000`
* **Location:** `/backend` directory
* **Details:** This is the Node.js/Express server running via `nodemon`. It will automatically restart if you change any backend code.
* **Test Endpoint:** You can visit `http://localhost:3000/api/status` to see a JSON response confirming the backend is running.

### 3. Database (MongoDB)

* **Access (Host):** `mongodb://localhost:27017`
* **Access (Container):** The Node.js backend connects to it via the service name `mongodb://db:27017/pollpulse`.
* **Details:** You can connect to this database using a GUI tool like **MongoDB Compass** to view your data.
* **Persistence:** Database data is stored in a Docker volume (`mongo_data`) so it persists even when you stop or remove the containers.

---

### Useful Docker Commands

* **To stop all containers:**
    ```bash
    docker-compose down
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
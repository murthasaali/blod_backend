# Blink Backend

This is the backend part of the Blink blogging platform built using Node.js (Express) and MSSQL.

## Getting Started

Follow these steps to run the backend part of the project.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/arshadakl/Blink-Blog.git
    cd Blink-Blog/backend
    ```

2. **Create a Cloudinary account:**

    Blink uses Cloudinary to store blog images and user profile images. You need to create an account on [Cloudinary](https://cloudinary.com/).

3. **Create a `.env` file:**

    In the `backend` directory, create a `.env` file and add the following lines:

    ```env
    DB_USER=USER
    DB_PASSWORD=YOUR_PASSWORD
    DB_SERVER=YOUR.database.windows.net
    DB_DATABASE=blog
    JWT_SECRET=your_SECRET
    PORT=5000
    CLOUDINARY_NAME=CLOUDINARY
    CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
    ```

    Replace `USER`, `YOUR_PASSWORD`, `YOUR.database.windows.net`, `your_SECRET`, `CLOUDINARY`, `YOUR_CLOUDINARY_API_KEY`, and `YOUR_CLOUDINARY_API_SECRET` with your actual credentials and information.

4. **Install dependencies:**

    ```bash
    npm install
    ```

5. **Run the project:**

    ```bash
    npm start
    ```

    The server should now be running on port 5000.

## Folder Structure

- `routes`: Contains the route definitions for the API.
- `controllers`: Contains the logic for handling requests.
- `models`: Contains the database models.
- `middleware`: Contains the middleware functions.



# Nestaway

Nestaway is a full-stack web application designed for seamless property management. It includes a **backend** built with Node.js and Express.js for robust API handling and a **frontend** powered by Vite and React for an interactive user experience.

---

## Features

### Backend
- **User Authentication**: Secure login system.
- **Property Management**: CRUD operations for properties.
- **Booking System**: Handles bookings and sends email notifications.
- **Data Validation**: Ensures integrity with JSON schema.
- **Seeding and Testing**: Preloaded data and testing utilities.

### Frontend
- **Interactive UI**: Built with React and Tailwind CSS.
- **Responsive Design**: Optimized for all devices.
- **Dynamic Pages**: Real-time updates with modern React hooks.

---

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Docker
- Nodemailer (for email notifications)

### Frontend
- React.js
- Tailwind CSS
- Vite
- PostCSS

---

## Prerequisites

Before starting, ensure you have:
- **Node.js** (version 16+ recommended)
- **npm** or **yarn**
- **MongoDB** installed and running
- **Docker** (optional, for deployment)

---

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/SKele10/NestAway.git
cd nestaway
```

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the backend directory with the following:
   ```env
   DB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the frontend directory with the following:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

### Backend
```
backend/
|-- app.js          # Main application file
|-- config/         # Configuration files
|-- routes/         # API routes
|-- middlewares/    # Middleware functions
|-- validation/     # Data validation logic
|-- schema.json     # Database schema
|-- seed/           # Seed data
|-- dockerfile      # Docker configuration
|-- .env            # Environment variables
```

### Frontend
```
frontend/
|-- index.html       # Main HTML file
|-- src/             # React source code
|-- public/          # Static assets
|-- tailwind.config.js # Tailwind CSS configuration
|-- vite.config.js   # Vite configuration
|-- .env             # Environment variables
```

---

## Deployment

### Backend
1. Build the Docker image:
   ```bash
   docker build -t nestaway-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 nestaway-backend
   ```

### Frontend
1. Build the frontend for production:
   ```bash
   npm run build
   ```

2. Serve the static files using any web server (e.g., Nginx, Vercel).

---

## Contributing

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Push the branch and create a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.


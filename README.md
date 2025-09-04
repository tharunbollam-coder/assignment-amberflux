# Screen Recorder App

A full-stack web application for recording your screen, uploading recordings, and managing them in a user-friendly interface. The project consists of a React + Vite frontend and an Express + SQLite backend.

---

## Features

- 🎥 **Screen Recording**: Record your screen (with audio) directly from the browser.
- ⏱ **Timer**: Automatic stop after 3 minutes of recording.
- ⬇️ **Download**: Download your recording as a `.webm` file.
- ⬆️ **Upload**: Upload recordings to the backend for storage and later viewing.
- 📂 **Recordings List**: View, play, and manage all uploaded recordings.
- 🗑 **Delete**: Remove unwanted recordings from the server.

---

## Tech Stack

### Frontend
- **React 19** (with Hooks)
- **Vite** (for fast development and HMR)
- **CSS** (custom, responsive, modern UI)

### Backend
- **Node.js** (ES Modules)
- **Express 5** (API server)
- **better-sqlite3** (SQLite database for storing recording metadata)
- **Multer** (file uploads)
- **CORS** (cross-origin requests)

---

## Project Structure

```
assignment-amberflux/
├── backend/
│   ├── server.js         # Express API server
│   ├── database.db      # SQLite database
│   ├── uploads/         # Uploaded .webm files
│   └── package.json     # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Recorder.jsx
│   │   │   └── RecordingsList.jsx
│   │   └── ...
│   ├── public/
│   ├── App.css
│   ├── index.html
│   └── package.json     # Frontend dependencies
└── README.md            # (You are here)
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm**

### 1. Clone the repository
```bash
# Clone the project
$ git clone <repo-url>
$ cd assignment-amberflux
```

### 2. Install dependencies
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Run the application
#### Start the backend server
```bash
cd backend
npm run dev
# or
npm start
```
- The backend runs on [http://localhost:5000](http://localhost:5000)

#### Start the frontend (Vite dev server)
```bash
cd frontend
npm run dev
```
- The frontend runs on [http://localhost:5173](http://localhost:5173) by default

---

## Usage

1. Open the frontend in your browser.
2. Click **Start Recording** to begin capturing your screen.
3. Stop the recording manually or wait for the 3-minute auto-stop.
4. Download the recording or upload it to the server.
5. Uploaded recordings appear in the list below, where you can play or delete them.

---

## API Endpoints (Backend)

- `POST   /api/recordings` — Upload a new recording (multipart/form-data)
- `GET    /api/recordings` — List all recordings
- `GET    /api/recordings/:id` — Get a specific recording's metadata
- `DELETE /api/recordings/:id` — Delete a recording and its file
- `GET    /uploads/:filename` — Serve uploaded video files

---

## Environment & Deployment
- The backend and frontend are decoupled; update API URLs as needed for deployment.
- For production, build the frontend (`npm run build`) and serve the static files with your preferred method.

---



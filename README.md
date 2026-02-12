# 🎥 Camera Management & Recording System

A full-stack web application that allows administrators and users to manage cameras, view live camera previews, and record video streams using a modern web dashboard.

Built using FastAPI, OpenCV, FFmpeg, and JavaScript.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- Secure login system using JWT authentication
- Role-based access control (Admin and User)
- Protected routes and API endpoints

---

### 👨‍💼 Admin Features

Admins have full system control:

- Create new users
- Delete users
- View all users
- Add new cameras
- Delete cameras
- View all cameras
- View live preview of all cameras simultaneously
- Start recording from any camera
- Stop recording from any camera
- View all recordings
- Delete recordings

---

### 👤 User Features

Users can manage cameras and recordings:

- Add new cameras
- Delete cameras
- View live preview of all cameras
- Start recording cameras
- Stop recording cameras
- View recordings
- Playback recordings
- Delete recordings

---

### 🎥 Camera Management Features

- Add unlimited cameras
- Delete cameras
- Multi-camera live preview grid
- Dynamic camera loading
- Support for:
  - Laptop webcam
  - USB webcam
  - IP cameras
  - RTSP streams

---

### 📹 Recording Features

- Start recording from any camera
- Stop recording anytime
- Background recording using FastAPI and OpenCV
- Save recordings automatically
- Playback recorded videos
- Delete recordings
- Store recordings in MP4 format

---

### 🖥 Dashboard Features

- Admin dashboard
- User dashboard
- Live preview grid layout
- Recording playback player
- Camera management panel
- User management panel (Admin only)

---

### ⚙ System Features

- REST API architecture
- FastAPI backend
- OpenCV camera integration
- FFmpeg recording support
- SQLite database storage
- Responsive Bootstrap UI

---

### 📡 Live Preview Features

- Real-time camera preview
- Multiple cameras displayed simultaneously
- Dynamic video loading
- Per-camera live control (start/stop preview)



## 🧱 Tech Stack

### Backend
- FastAPI
- Python
- OpenCV
- FFmpeg
- SQLAlchemy
- SQLite

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript

### Server
- Uvicorn

---

## 📁 Project Structure

```
camera_system/
│
├── Backend/
│   ├── main.py                # FastAPI main server
│   ├── database.py           # Database configuration
│   ├── models.py             # Database models
│   ├── auth.py               # Authentication logic
│   ├── recordings/           # Recorded video files
│   └── utils/
│       └── recording.py      # Recording manager
│
├── Frontend/
│   ├── login.html
│   ├── admin.html
│   ├── user.html
│   │
│   └── js/
│       ├── admin.js
│       ├── user.js
│       └── login.js
│
├── requirements.txt
├── .env
├── .gitignore
└── README.md
```

---

## ⚙️ Installation Guide

### Step 1: Clone Repository

```bash
git clone https://github.com/jatinrangnani/camera-management-system.git

cd camera-management-system
```

---

### Step 2: Create Virtual Environment

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

Linux / Mac:

```bash
python -m venv venv
source venv/bin/activate
```

---

### Step 3: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

### Step 4: Install FFmpeg

Download from:

https://ffmpeg.org/download.html

Check installation:

```bash
ffmpeg -version
```

---

### Step 5: Run FastAPI Server

```bash
cd Backend

uvicorn main:app --reload
```

Server runs at:

```
http://127.0.0.1:8000
```

---

### Step 6: Open Frontend

Open in browser:

```
Frontend/login.html
```

---

## 🔐 Default Login Credentials

Admin Login:

```
Username: admin
Password: admin123
```

⚠️ Change this password after first login.

---

## 🎥 Live Camera Preview

Live preview uses browser API:

```javascript
navigator.mediaDevices.getUserMedia()
```

Supports:

- Laptop webcam
- USB webcam
- RTSP camera (via backend)
- IP cameras

---

## 📹 Recording System

Recording handled using:

- OpenCV
- FFmpeg
- FastAPI background tasks

Videos saved in:

```
Backend/recordings/
```

Format:

```
MP4
```

---

## 🌐 API Endpoints

### Authentication

```
POST /login
POST /logout
```

---

### Cameras

```
POST   /add_camera
GET    /get_cameras
DELETE /delete_camera/{id}
```

---

### Recording

```
POST /start_recording
POST /stop_recording
GET  /get_recordings
DELETE /delete_recording/{id}
```

---

### Users

```
POST /create_user
GET  /get_users
DELETE /delete_user/{id}
```

---

## 🗄 Database Schema

### Users Table

```sql
id INTEGER PRIMARY KEY
username TEXT
password TEXT
role TEXT
created_at DATETIME
```

---

### Cameras Table

```sql
id INTEGER PRIMARY KEY
name TEXT
location TEXT
source TEXT
status TEXT
created_at DATETIME
```

---

### Recordings Table

```sql
id INTEGER PRIMARY KEY
camera_id INTEGER
file_path TEXT
created_at DATETIME
```

---

## 🛡 Security Features

- JWT authentication
- Role-based access control
- Secure password storage
- Protected API endpoints

---

## 🧪 Testing Cameras

Example RTSP test stream:

```
rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov
```

---

## 🐛 Troubleshooting

### FFmpeg not found

Install FFmpeg and add to PATH.

---

### Camera not opening

Check:

- Camera connected
- RTSP URL correct
- Camera permissions enabled

---

### Port already in use

Run on different port:

```bash
uvicorn main:app --port 8001
```

---

## 🚀 Future Improvements

- Live MJPEG streaming
- Motion detection
- Email alerts
- Cloud storage integration
- Docker deployment
- Real CCTV RTSP streaming
- Camera snapshots

---

## 📦 Deployment

Production server:

```bash
pip install unicorn

gunicorn main:app -k uvicorn.workers.UvicornWorker -w 4
```

---

## 👨‍💻 Author

Jatin Rangnani  
MSc IT Student  

GitHub:  
https://github.com/jatinrangnani

---

## 📄 License

This project is for educational and academic purposes.

---

## 📌 Project Status

✔ Completed  
✔ Fully Functional  
✔ Production Ready  

---

## 🎯 Summary

This system provides:

- Multi-camera live preview
- Recording and playback
- Admin and user dashboards
- Full camera management system

Built using modern full-stack architecture.

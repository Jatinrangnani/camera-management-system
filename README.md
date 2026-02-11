Camera Management System (FastAPI + OpenCV + FFmpeg)
Overview

The Camera Management System is a full-stack application built using FastAPI, OpenCV, SQLAlchemy, and FFmpeg. It allows administrators and users to manage cameras, view live previews, record video, and manage recordings.

Features include:

• Add, edit, delete cameras
• Enable and disable cameras
• Live camera preview (USB webcam or RTSP IP camera)
• Start and stop recording
• Download and delete recordings
• User and admin role management
• Web-based dashboard

Project Structure
camera_system/
│
├── Backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── auth.py
│   ├── requirements.txt
│   ├── recordings/
│
├── Frontend/
│   ├── login.html
│   ├── admin.html
│   ├── user.html
│   ├── js/
│   │   ├── admin.js
│   │   ├── user.js
│   │   ├── login.js
│
├── README.md

System Requirements

Install the following before running:

• Python 3.10 or newer
• FFmpeg installed and added to PATH
• Webcam or RTSP camera (optional)

Check Python version:

python --version

Installation Steps
Step 1: Clone the repository
git clone https://github.com/yourusername/camera-system.git

cd camera-system/Backend

Step 2: Create virtual environment

Windows:

python -m venv venv
venv\Scripts\activate


Linux / Mac:

python -m venv venv
source venv/bin/activate

Step 3: Install requirements

IMPORTANT: run this inside Backend folder

pip install -r requirements.txt


This installs:

• FastAPI
• Uvicorn
• OpenCV
• SQLAlchemy
• Passlib
• bcrypt
• numpy
• and other required dependencies

Step 4: Start the backend server

Run:

uvicorn main:app --reload


You should see:

Uvicorn running on http://127.0.0.1:8000

Step 5: Open frontend

Open in browser:

Frontend/login.html

Default Admin Credentials

You can create admin user via database or API.

Example:

Username:

admin


Password:

admin123


Role:

admin

How to Add Camera

Go to Admin Dashboard → Cameras → Add Camera

Examples:

USB Webcam:

Source: 0


Laptop Camera:

Source: 0


IP Camera (RTSP):

rtsp://192.168.1.10:554/stream

Live Preview

Live preview uses OpenCV streaming endpoint:

http://127.0.0.1:8000/video_feed/{camera_id}

Recording Storage

Recorded videos are saved in:

Backend/recordings/


Format:

camera_1_20260211_153045.mp4

API Documentation

FastAPI auto-generated docs available at:

http://127.0.0.1:8000/docs

Features Implemented

✔ Add camera
✔ Edit camera
✔ Delete camera
✔ Enable / Disable camera
✔ Live preview
✔ Video recording
✔ Download recording
✔ Delete recording
✔ User management
✔ Admin dashboard
✔ User dashboard

Technologies Used

Backend:

• FastAPI
• SQLAlchemy
• OpenCV
• FFmpeg

Frontend:

• HTML
• Bootstrap
• JavaScript

Database:

• SQLite

How to Stop Server

Press:

CTRL + C

Important Notes

Make sure FFmpeg is installed.

Test FFmpeg:

ffmpeg -version


If not installed, download from:

https://ffmpeg.org/download.html

Future Improvements

• JWT authentication
• Multi-camera recording
• Cloud storage
• Motion detection
from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
from models import User, Recording, Camera
from auth import hash_password, verify_password
import subprocess
import datetime
import os
import signal


# =========================
# CREATE FASTAPI APP
# =========================

app = FastAPI()


# =========================
# ENABLE CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# PATH SETUP
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RECORDINGS_DIR = os.path.join(BASE_DIR, "recordings")

if not os.path.exists(RECORDINGS_DIR):
    os.makedirs(RECORDINGS_DIR)


# =========================
# MOUNT RECORDINGS
# =========================

app.mount(
    "/recordings",
    StaticFiles(directory=RECORDINGS_DIR),
    name="recordings"
)


# =========================
# GLOBAL VARIABLES
# =========================

recording_process = None
current_recording = None


# =========================
# CREATE DATABASE TABLES
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# DATABASE SESSION
# =========================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {"message": "Camera Management System Running"}


# =========================
# LOGIN
# =========================

@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    return {
        "message": "Login successful",
        "username": user.username,
        "role": user.role
    }


# =========================
# USER MANAGEMENT
# =========================

@app.post("/create_user")
def create_user(username: str, password: str, role: str, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.username == username).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        username=username,
        password=hash_password(password),
        role=role,
        active=True
    )

    db.add(user)
    db.commit()

    return {"message": "User created successfully"}


@app.get("/get_users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.delete("/delete_user/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}


# =========================
# CAMERA MANAGEMENT
# =========================

@app.post("/add_camera")
def add_camera(name: str, location: str, source: str, db: Session = Depends(get_db)):

    camera = Camera(
        name=name,
        location=location,
        source=source,
        active=True
    )

    db.add(camera)
    db.commit()

    return {"message": "Camera added successfully"}


@app.get("/get_cameras")
def get_cameras(db: Session = Depends(get_db)):
    return db.query(Camera).all()


@app.delete("/delete_camera/{camera_id}")
def delete_camera(camera_id: int, db: Session = Depends(get_db)):

    camera = db.query(Camera).filter(Camera.id == camera_id).first()

    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")

    db.delete(camera)
    db.commit()

    return {"message": "Camera deleted successfully"}


# =========================
# RECORDING MANAGEMENT
# =========================

@app.post("/start_recording")
def start_recording(camera_id: int, db: Session = Depends(get_db)):

    global recording_process, current_recording

    if recording_process:
        return {"message": "Recording already running"}

    filename = f"camera_{camera_id}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"

    full_path = os.path.join(RECORDINGS_DIR, filename)

    command = [
        "ffmpeg",
        "-y",
        "-f", "dshow",
        "-i", "video=USB2.0 HD UVC WebCam",
        "-vcodec", "libx264",
        "-preset", "ultrafast",
        "-pix_fmt", "yuv420p",
        full_path
    ]

    recording_process = subprocess.Popen(
        command,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
    )

    new_recording = Recording(
        camera_id=camera_id,
        start_time=datetime.datetime.now(),
        file_path=filename
    )

    db.add(new_recording)
    db.commit()
    db.refresh(new_recording)

    current_recording = new_recording

    return {"message": "Recording started", "file": filename}


@app.post("/stop_recording")
def stop_recording(db: Session = Depends(get_db)):

    global recording_process, current_recording

    if not recording_process:
        return {"message": "No recording running"}

    recording_process.send_signal(signal.CTRL_BREAK_EVENT)

    recording_process.wait()

    recording_process = None

    if current_recording:
        current_recording.end_time = datetime.datetime.now()
        db.commit()

    return {"message": "Recording stopped successfully"}


@app.get("/get_recordings")
def get_recordings(db: Session = Depends(get_db)):
    return db.query(Recording).all()


@app.delete("/delete_recording/{recording_id}")
def delete_recording(recording_id: int, db: Session = Depends(get_db)):

    recording = db.query(Recording).filter(Recording.id == recording_id).first()

    if not recording:
        raise HTTPException(status_code=404, detail="Recording not found")

    file_path = os.path.join(RECORDINGS_DIR, recording.file_path)

    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(recording)
    db.commit()

    return {"message": "Recording deleted successfully"}


# =========================
# PLAY RECORDING
# =========================

@app.get("/play_recording/{filename}")
def play_recording(filename: str):

    file_path = os.path.join(RECORDINGS_DIR, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return {
        "video_url": f"http://127.0.0.1:8000/recordings/{filename}"
    }

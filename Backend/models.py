from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from database import Base
import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)
    role = Column(String)  # admin or user
    active = Column(Boolean, default=True)


class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    source = Column(String)
    active = Column(Boolean, default=True)


class Recording(Base):
    __tablename__ = "recordings"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime)
    file_path = Column(String)
    file_size = Column(String)

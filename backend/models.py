from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(64), nullable=False)
    day = db.Column(db.String(10), nullable=False)  # Format: "YYYY-MM-DD"
    start_time = db.Column(db.String(5), nullable=False)  # Format: "HH:MM"
    end_time = db.Column(db.String(5), nullable=False)    # Format: "HH:MM"
    status = db.Column(db.String(10), nullable=False)       # "green", "yellow", "red"

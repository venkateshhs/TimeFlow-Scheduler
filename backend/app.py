from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Availability
import os

app = Flask(__name__)
CORS(app)
app.config.from_object('config.Config')

db.init_app(app)

# Create tables if they don't exist
with app.app_context():
    db.create_all()


# Endpoint to add/update a user's availability
@app.route('/api/availability', methods=['POST'])
def add_availability():
    data = request.get_json()
    # Expected data: { "user_id": "user1", "day": "2025-04-01", "start_time": "09:00", "end_time": "10:00", "status": "green" }
    user_id = data.get('user_id')
    day = data.get('day')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    status = data.get('status')

    if not all([user_id, day, start_time, end_time, status]):
        return jsonify({'message': 'Missing required fields'}), 400

    avail = Availability(
        user_id=user_id,
        day=day,
        start_time=start_time,
        end_time=end_time,
        status=status
    )
    db.session.add(avail)
    db.session.commit()
    return jsonify({'message': 'Availability added successfully'}), 201


# Endpoint to fetch all availabilities
@app.route('/api/availability', methods=['GET'])
def get_availabilities():
    availabilities = Availability.query.all()
    results = []
    for avail in availabilities:
        results.append({
            'id': avail.id,
            'user_id': avail.user_id,
            'day': avail.day,
            'start_time': avail.start_time,
            'end_time': avail.end_time,
            'status': avail.status
        })
    return jsonify(results)


# Naive aggregation endpoint – groups availability by day
@app.route('/api/aggregated', methods=['GET'])
def get_aggregated():
    availabilities = Availability.query.all()
    aggregated = {}
    for avail in availabilities:
        day = avail.day
        if day not in aggregated:
            aggregated[day] = []
        aggregated[day].append({
            'start_time': avail.start_time,
            'end_time': avail.end_time,
            'status': avail.status
        })
    return jsonify(aggregated)


if __name__ == '__main__':
    # For development only; use a production-ready server for deployment.
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))

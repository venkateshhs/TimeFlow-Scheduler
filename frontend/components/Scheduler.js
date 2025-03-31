import React, { useState } from 'react';
import Timeline from './Timeline';
import axios from 'axios';

const Scheduler = () => {
  const [userId, setUserId] = useState('');
  const [day, setDay] = useState('');
  const [timeRange, setTimeRange] = useState(null);
  const [status, setStatus] = useState('green');

  const handleAvailabilitySubmit = async () => {
    if (!userId || !day || !timeRange) {
      alert('Please enter all details.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/availability', {
        user_id: userId,
        day: day,
        start_time: timeRange.start,
        end_time: timeRange.end,
        status: status,
      });
      alert('Availability submitted successfully!');
    } catch (error) {
      console.error('Error submitting availability', error);
      alert('Error submitting availability');
    }
  };

  return (
    <div>
      <div>
        <label>User ID: </label>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} />
      </div>
      <div>
        <label>Date (YYYY-MM-DD): </label>
        <input
          value={day}
          onChange={(e) => setDay(e.target.value)}
          placeholder="2025-04-01"
        />
      </div>
      <div>
        <label>Status: </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="green">Available</option>
          <option value="yellow">Tentative</option>
          <option value="red">Unavailable</option>
        </select>
      </div>
      <Timeline onSelection={(range) => setTimeRange(range)} />
      <button onClick={handleAvailabilitySubmit}>Submit Availability</button>
    </div>
  );
};

export default Scheduler;

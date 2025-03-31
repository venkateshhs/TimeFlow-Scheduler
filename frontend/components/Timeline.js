import React, { useState, useRef } from 'react';

const Timeline = ({ onSelection }) => {
  const timelineRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setSelection({ start: x, end: x });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setSelection((prev) => ({ ...prev, end: x }));
  };

  const handleMouseUp = () => {
    if (!isDragging || !selection) return;
    setIsDragging(false);
    const startPx = Math.min(selection.start, selection.end);
    const endPx = Math.max(selection.start, selection.end);
    const containerWidth = timelineRef.current.clientWidth;
    const startTime = (startPx / containerWidth) * 24;
    const endTime = (endPx / containerWidth) * 24;

    const startHour = Math.floor(startTime);
    const startMin = Math.floor((startTime - startHour) * 60);
    const endHour = Math.floor(endTime);
    const endMin = Math.floor((endTime - endHour) * 60);

    const pad = (n) => (n < 10 ? '0' + n : n);

    const formattedStart = pad(startHour) + ':' + pad(startMin);
    const formattedEnd = pad(endHour) + ':' + pad(endMin);

    // Pass the selected time range to the parent component
    onSelection({ start: formattedStart, end: formattedEnd });
  };

  const renderTimeMarkers = () => {
    const markers = [];
    for (let i = 0; i <= 24; i++) {
      markers.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${(i / 24) * 100}%`,
            top: 0,
            transform: 'translateX(-50%)',
            fontSize: '10px',
          }}
        >
          {i}:00
        </div>
      );
    }
    return markers;
  };

  const selectionStyle = () => {
    if (!selection) return {};
    const left = Math.min(selection.start, selection.end);
    const width = Math.abs(selection.end - selection.start);
    return {
      position: 'absolute',
      left: left,
      top: 0,
      height: '100%',
      width: width,
      backgroundColor: 'rgba(0, 128, 0, 0.3)' // default green selection
    };
  };

  return (
    <div
      ref={timelineRef}
      style={{
        position: 'relative',
        width: '800px',
        height: '50px',
        border: '1px solid #ccc',
        margin: '20px 0',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {renderTimeMarkers()}
      {selection && <div style={selectionStyle()} />}
    </div>
  );
};

export default Timeline;

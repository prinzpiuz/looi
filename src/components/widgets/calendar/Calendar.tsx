import React from "react";
import Calendar from "react-calendar";
import "../../../assets/css/calendar.css"; // Import your custom styles for the calendar

const CalendarWidget: React.FC = () => {
  return (
    <div className="calendar-container">
      <Calendar />
    </div>
  );
};

export default CalendarWidget;

import Calendar from "react-calendar";
import Draggable from "react-draggable";
import { useRef } from "react";
import "../assets/css/calendar.css"; // Import your custom styles for the calendar

const CalendarWidget: React.FC = () => {
  const nodeRef = useRef(null);
  return (
    <Draggable nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{ position: "absolute", top: 100, left: 100, zIndex: 500 }}
      >
        <div className="calendar-container">
          <Calendar />
        </div>
      </div>
    </Draggable>
  );
};

export default CalendarWidget;

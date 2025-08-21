import { FaCalendarAlt, FaTasks } from "react-icons/fa";
import { IconProps } from "./types";
import CalendarWidget from "../components/widgets/calendar/Calendar";

export const widgetIcons: Record<string, IconProps> = {
  calendar: FaCalendarAlt,
  todo: FaTasks,
};

export const widgetRegistry: Record<string, React.FC> = {
  calendar: CalendarWidget,
  // todo: TodoWidget,
  // add more
};

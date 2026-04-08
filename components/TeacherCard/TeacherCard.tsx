import { Teacher } from "@/types/teacher";
import css from "./TeacherCard.module.css";

interface Props {
  teacher: Teacher;
  onFavoriteClick?: () => void;
  isFavorite?: boolean;
}

export const TeacherCard: React.FC<Props> = ({ teacher, onFavoriteClick, isFavorite }) => (
  <div className={"teacher-card border p-4 rounded shadow"}>
    <img src={teacher.avatar_url} alt={`${teacher.name} ${teacher.surname}`} className="w-24 h-24 rounded-full"/>
    <h3>{teacher.name} {teacher.surname}</h3>
    <p>Rating: {teacher.rating}</p>
    <p>Price: ${teacher.price_per_hour}/hr</p>
    <button
      className={`favorite-btn ${isFavorite ? "text-red-500" : "text-gray-400"}`}
      onClick={onFavoriteClick}
    >
      ❤️
    </button>
  </div>
);
import { Teacher } from "@/types/teacher";
import Link from "next/link";
import Image from "next/image";
import styles from "./TeacherCard.module.css";

interface Props {
  teacher: Teacher;
  onFavoriteClick?: () => void;
  isFavorite?: boolean;
}

export const TeacherCard: React.FC<Props> = ({ teacher, onFavoriteClick, isFavorite }) => (
  <div className={styles.card}>
    <div className={styles.avatarBox}>
      <Image
        src={teacher.avatar_url}
        alt={`${teacher.name} ${teacher.surname}`}
        width={96}
        height={96}
        className={styles.avatarImg} />
    </div>

    <div className={styles.contentBox}>
      <div className={styles.cardHeader}>
        <p className={styles.text}>Languages</p>
        <div className={styles.cardHeaderWrap}>
          <p className={styles.text}>Lessons online</p>
          <p className={styles.text}>Lessons done: {teacher.lessons_done}</p>
          <p className={styles.text}>Rating: {teacher.rating}</p>
          <p className={styles.text}>Prise / 1 hour: {teacher.price_per_hour}</p>
          <button
            className={`favorite-btn ${isFavorite ? "text-red-500" : "text-gray-400"}`}
            onClick={onFavoriteClick}
          >
            ❤️
          </button>
        </div>
      </div>
      <h2 className={styles.title}>{teacher.name} {teacher.surname}</h2>
      <p className={styles.text}>Speaks: {teacher.languages}</p>
      <p className={styles.text}>Lesson info: {teacher.lesson_info}</p>
      <p className={styles.text}>Conditions: {teacher.conditions}</p>

      <Link href={`/teachers/${teacher.id}`} className={styles.readMoreBtn}>Read more</Link>
      
      <p className={styles.levels}>{teacher.levels}</p>
    </div>
  </div>
);
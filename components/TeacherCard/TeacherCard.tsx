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
        <div className={styles.avatarInner}>
          <Image
            src={teacher.avatar_url}
            alt={`${teacher.name} ${teacher.surname}`}
            width={96}
            height={96}
            className={styles.avatarImg} />
        </div>
        <div className={styles.status}></div>
    </div>

    <div className={styles.contentBox}>
      <div className={styles.cardHeader}>
        <p className={styles.text}><span className={styles.label}>Languages</span></p>
        <div className={styles.cardHeaderWrap}>
          <span className={styles.item}>Lessons online</span>
          <span className={styles.item}>Lessons done: {teacher.lessons_done}</span>
          <span className={styles.item}>Rating: {teacher.rating}</span>
          <span className={styles.item}>
            Price / 1 hour: 
            <span className={styles.price}>{teacher.price_per_hour}$</span>
          </span>
        </div>
        <button
          className={styles.favoriteBtn}
          onClick={onFavoriteClick}
        >
          <Image
            src={
              isFavorite
                ? "/favorites/favorites.svg"
                : "/favorites/notFavorites.svg"
            }
            alt="favorite"
            width={24}
            height={24}
          />
        </button>
      </div>
      <h2 className={styles.title}>{teacher.name} {teacher.surname}</h2>
      <p className={styles.text}>
        <span className={styles.label}>Speaks: </span>
        <span className={styles.value}>
          {teacher.languages.join(", ")}
        </span>
      </p>
      <p className={styles.text}>
        <span className={styles.label}>Lesson info: </span>
        <span className={styles.value}>{teacher.lesson_info}</span></p>
      <p className={styles.text}>
        <span className={styles.label}>Conditions: </span>
        <span className={styles.value}>{teacher.conditions}</span>
      </p>

      <Link href={`/teachers/${teacher.id}`} className={styles.readMoreBtn}>Read more</Link>
      
      <div className={styles.levels}>
        {teacher.levels.map((level, index) => (
          <span
            key={level}
            className={
              index === 0
                ? `${styles.level} ${styles.active}`
                : styles.level
            }
          >
            {level}
          </span>
        ))}
      </div>
    </div>
  </div>
);
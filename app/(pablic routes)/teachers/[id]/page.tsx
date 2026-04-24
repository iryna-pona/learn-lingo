"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Teacher } from "@/types/teacher";
import { getTeacherById } from "@/lib/firebase/db";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import styles from "./TeacherDetails.module.css";

const avatarUrl = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(name)}`;

export default function TeacherDetailsPage() {
  const { id } = useParams();

  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavoritesStore();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  // 📌 load teacher
  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id) return;

      setLoading(true);
      const data = await getTeacherById(id as string);
      setTeacher(data);
      setLoading(false);
    };

    fetchTeacher();
  }, [id]);

  if (loading || !teacher) return <p>Loading...</p>;

  // 📌 favorites logic
  const isFavorite = favorites.includes(teacher.id);

  const handleFavoriteClick = () => {
    if (!user) return;
    toggleFavorite(user.uid, teacher.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* AVATAR */}
        <div className={styles.avatarBox}>
          <div className={styles.avatarInner}>
            <Image
              src={teacher.avatar_url}
              alt={`${teacher.name} ${teacher.surname}`}
              width={96}
              height={96}
            />
          </div>
          <div className={styles.status}></div>
        </div>

        <div className={styles.contentBox}>
          {/* HEADER */}
          <div className={styles.cardHeader}>
            <p className={styles.label}>Languages</p>

            <ul className={styles.cardHeaderWrap}>
              <li className={styles.item}>
                <span className={styles.iconGroup}>
                  <Image src="/icons/bookL.svg" alt="" width={9} height={14} />
                  <Image src="/icons/bookR.svg" alt="" width={9} height={14} />
                </span>
                <span>Lessons online</span>
              </li>

              <li className={styles.item}>
                Lessons done: {teacher.lessons_done}
              </li>

              <li className={styles.item}>
                <Image
                  src="/icons/star.svg"
                  alt="rating"
                  width={16}
                  height={16}
                />
                Rating: {teacher.rating}
              </li>

              <li className={styles.item}>
                Price / 1 hour:
                <span className={styles.price}>
                  {teacher.price_per_hour}$
                </span>
              </li>
            </ul>

            {/* FAVORITE */}
            <button
              className={styles.favoriteBtn}
              onClick={handleFavoriteClick}
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

          {/* INFO */}
          <h2 className={styles.title}>
            {teacher.name} {teacher.surname}
          </h2>

          <p className={styles.text}>
            <span className={styles.label}>Speaks: </span>
            <span className={styles.value}>
              {teacher.languages.join(", ")}
            </span>
          </p>
                  
          <p className={styles.text}>
            <span className={styles.label}>Lesson info: </span>
            <span className={styles.value}>{teacher.lesson_info}</span>
          </p>

          <p className={styles.text}>
            <span className={styles.label}>Conditions: </span>
            <span className={styles.value}>
              {teacher.conditions.join(", ")}
            </span>
          </p>

          <p className={styles.experience}>{teacher.experience}</p>

          {/* REVIEWS */}
          <div className={styles.reviews}>
            {teacher.reviews.map((r, i) => (
              <div key={i} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <Image
                    src={avatarUrl(r.reviewer_name)}
                    alt={r.reviewer_name}
                    width={40}
                    height={40}
                  />

                  <div>
                    <p className={styles.label}>{r.reviewer_name}</p>
                    <p className={styles.value}>
                      <Image
                        src="/icons/star.svg"
                        alt="rating"
                        width={16}
                        height={16}
                      />
                      {r.reviewer_rating}
                    </p>
                  </div>
                </div>

                <p className={styles.text}>{r.comment}</p>
              </div>
            ))}
          </div>

          {/* LEVELS */}
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
                  
          {/* BUTTON */}
          <button
            onClick={() => {}}
            className={styles.btn}
          >
            Book trial lesson
          </button>
        </div>
      </div>
    </div>
  );
}
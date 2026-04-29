"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFavoritesStore } from "@/store/favoritesStore";
import { getFavoriteTeachers } from "@/lib/api/favorites";
import { Teacher } from "@/types/teacher";
import { TeacherCard } from "@/components/TeacherCard/TeacherCard";
import styles from "./FavoritesPage.module.css";

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavoritesStore();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        setLoading(true);

        const data = await getFavoriteTeachers(user.uid);

        setTeachers(data);
      } catch (error) {
        console.error("Failed to load favorites", error);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const handleFavoriteClick = (teacherId: string) => {
    if (!user) return;

    toggleFavorite(user.uid, teacherId);

    setTeachers((prev) =>
      prev.filter((t) => t.id !== teacherId)
    );
  };

  if (user === undefined) return null;
  if (!user) return null;

  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Favorites</h1>

        {loading ? (
          <p className={styles.text}>Loading...</p>
        ) : teachers.length === 0 ? (
          <p className={styles.text}>No favorite teachers yet</p>
        ) : (
          <div className={styles.grid}>
            {teachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                isFavorite={favorites.includes(teacher.id)}
                onFavoriteClick={() =>
                  handleFavoriteClick(teacher.id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
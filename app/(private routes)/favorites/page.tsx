"use client";

import { useEffect, useState, useMemo } from "react";
import { useFavoritesStore } from "@/store/favoritesStore";
import { getTeachersByIds } from "@/lib/firebase/db";
import { Teacher } from "@/types/teacher";
import { TeacherCard } from "@/components/TeacherCard/TeacherCard";
import { useAuth } from "@/hooks/useAuth";
import styles from "./FavoritesPage.module.css";

export default function FavoritesPage() {
  const { user } = useAuth();

  const {
    favorites,
    teachersCache,
    setTeachersCache,
    toggleFavorite,
  } = useFavoritesStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);

      const missingIds = favorites.filter(
        (id) => !teachersCache[id]
      );

      if (missingIds.length > 0) {
        const data = await getTeachersByIds(missingIds);
        setTeachersCache(data);
      }

      setLoading(false);
    };

    if (user) {
      fetchFavorites();
    }
  }, [favorites, user]);

  const favoriteTeachers = useMemo(() => {
    return favorites
      .map((id) => teachersCache[id])
      .filter(Boolean) as (Teacher & { id: string })[];
  }, [favorites, teachersCache]);

  const handleFavoriteClick = (teacherId: string) => {
    if (!user) return;

    toggleFavorite(user.uid, teacherId);
  };

  if (user === undefined) return null;

  if (!user) return null;

  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Favorites</h1>

        {loading ? (
          <p>Loading...</p>
        ) : favoriteTeachers.length === 0 ? (
          <p className={styles.text}>No favorite teachers yet</p>
        ) : (
          favoriteTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              isFavorite={favorites.includes(teacher.id)}
              onFavoriteClick={() => handleFavoriteClick(teacher.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
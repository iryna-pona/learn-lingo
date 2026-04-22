"use client";

import { useEffect, useState } from "react";
import { getTeachers } from "@/lib/firebase/db";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useAuth } from "@/hooks/useAuth";
import { Teacher } from "@/types/teacher";
import { TeacherCard } from "@/components/TeacherCard/TeacherCard";
import { AuthModal } from "@/components/Modals/AuthModal";
import styles from "./TeachersPage.module.css";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<(Teacher & { id: string })[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavoritesStore();

  const perPage = 4;

  useEffect(() => {
    if (user) {
      setIsModalOpen(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchFirst = async () => {
      try {
        setLoading(true);

        const res = await getTeachers(perPage);

        setTeachers(res.data);
        setLastKey(res.lastKey);

      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading teachers");
      } finally {
        setLoading(false);
      }
    };

    fetchFirst();
  }, []);

  if (user === undefined) return null;

  const handleFavoriteClick = (id: string) => {
  if (!user) {
    setIsModalOpen(true);
    return;
  }

  toggleFavorite(user.uid, id);
};

  const loadMore = async () => {
    if (!lastKey) return;

    try {
      setLoadingMore(true);

      const res = await getTeachers(perPage, lastKey);

      setTeachers(prev => [...prev, ...res.data]);
      setLastKey(res.lastKey);

    } catch (err) {
      console.error(err);
      setError("Failed to load more teachers");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return <p className={styles.message}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.pageWrapper}>

          <div className={styles.gridBox}>
            {teachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                isFavorite={favorites.includes(teacher.id)}
                onFavoriteClick={() => handleFavoriteClick(teacher.id)}
              />
            ))}
          </div>

          {lastKey && (
            <button
              className={styles.loadMoreBtn}
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          )}

          <AuthModal
            mode="login"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}

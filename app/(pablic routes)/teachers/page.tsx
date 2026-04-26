"use client";

import { useEffect, useState } from "react";
import { getTeachers } from "@/lib/firebase/db";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/hooks/useModal";
import { Teacher } from "@/types/teacher";
import { TeacherCard } from "@/components/TeacherCard/TeacherCard";
import { Modal } from "@/components/Modal/Modal";
import { AuthForm } from "@/components/Forms/AuthForm";
import styles from "./TeachersPage.module.css";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<(Teacher & { id: string })[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const { user } = useAuth();
  const { type, open, isOpen, close, switchAuth } = useModal();
  const { favorites, toggleFavorite } = useFavoritesStore();

  const perPage = 4;

  useEffect(() => {
    if (user) {
      close();
    }
  }, [user, close]);

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
      open("login");
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

          <Modal isOpen={isOpen} onClose={close}>
            {(type === "login" || type === "register") && (
              <AuthForm
                mode={type}
                onSwitchMode={switchAuth}
                onClose={close}
              />
           )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { getTeachers } from "@/lib/api/teachers";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/hooks/useModal";
import { Teacher } from "@/types/teacher";
import { TeacherCard } from "@/components/TeacherCard/TeacherCard";
import { Modal } from "@/components/Modal/Modal";
import { AuthForm } from "@/components/Forms/AuthForm";
import styles from "./TeachersPage.module.css";

type Filters = {
  language: string;
  level: string;
  price: string;
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    language: "",
    level: "",
    price: "",
  });

  const { user } = useAuth();
  const { type, open, isOpen, close, switchAuth } = useModal();
  const { favorites, toggleFavorite } = useFavoritesStore();

  const fetchTeachers = useCallback(
    async (newPage = 1, reset = false) => {
      try {
        setLoading(true);

        const res = await getTeachers({
          page: newPage,
          language: filters.language || undefined,
          level: filters.level || undefined,
          price: filters.price || undefined,
        });

        setTeachers((prev) =>
          reset ? res.data : [...prev, ...res.data]
        );

        setHasMore(res.hasMore);
        setPage(newPage);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading teachers");
      } finally {
        setLoading(false);
      }
    },
    [filters.language, filters.level, filters.price]
  );

    useEffect(() => {
    fetchTeachers(1, true);
  }, [fetchTeachers]);

  useEffect(() => {
    if (user) {
      close();
    }
  }, [user, close]);

  const handleFavoriteClick = (id: string) => {
    if (!user) {
      open("login");
      return;
    }

    toggleFavorite(user.uid, id);
  };

  const handleLoadMore = () => {
    fetchTeachers(page + 1);
  };

  if (user === undefined) return null;

  if (loading && teachers.length === 0) {
    return <p className={styles.message}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.pageWrapper}>

          <div className={styles.filterBox}>
            <label className={styles.label}>
              Languages
              <select
                value={filters.language}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    language: e.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Mandarin Chinese">Mandarin Chinese</option>
              </select>
            </label>

            <label className={styles.label}>
              Level
              <select
                value={filters.level}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    level: e.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </label>

            <label className={styles.label}>
              Price
              <select
                value={filters.price}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="10">10$</option>
                <option value="20">20$</option>
                <option value="25">25$</option>
                <option value="30">30$</option>
                <option value="35">35$</option>
                <option value="40">40$</option>
              </select>
            </label>
          </div>

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

          {hasMore && (
            <button
              className={styles.loadMoreBtn}
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load more"}
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

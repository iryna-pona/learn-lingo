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
  const [allTeachers, setAllTeachers] = useState<(Teacher & { id: string })[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    language: "",
    level: "",
    price: "",
  });
  const [page, setPage] = useState(1);
 
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

        setAllTeachers(res.data);
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

      setAllTeachers(prev => [...prev, ...res.data]);
      setLastKey(res.lastKey);

    } catch (err) {
      console.error(err);
      setError("Failed to load more teachers");
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredTeachers = allTeachers.filter((t) => {
    if (filters.language && !t.languages.includes(filters.language)) {
      return false;
    }

    if (
      filters.level &&
      !t.levels.some((l) => l.startsWith(filters.level))
    ) {
      return false;
    }

    if (
      filters.price &&
      t.price_per_hour !== Number(filters.price)
    ) {
      return false;
    }

    return true;
  });

  const visibleTeachers = filteredTeachers.slice(0, page * perPage);

  const handleLoadMore = () => {
    if (visibleTeachers.length < filteredTeachers.length) {
      setPage(prev => prev + 1);
    } else {
      loadMore();
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
          <div className={styles.filterBox}>
            <label className={styles.label}>
              Languages
              <select
                value={filters.language}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, languages: e.target.value }))
                }
              >
                <option value="">All</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Mandarin Chinese">Mandarin Chinese</option>
                <option value="Korean">Korean</option>
                <option value="Vietnamese">Vietnamese</option>
              </select>
            </label>

            <label className={styles.label}>
              Level of knowledge
              <select
                value={filters.level}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, level: e.target.value }))
                }
              >
                <option value="">All</option>
                  <option value="A1">A1 Beginner</option>
                  <option value="A2">A2 Elementary</option>
                  <option value="B1">B1 Intermediate</option>
                  <option value="B2">B2 Upper-Intermediate</option>
                  <option value="C1">C1 Advanced</option>
                  <option value="C2">C2 Proficient</option>
              </select>
            </label>

            <label className={styles.label}>
              Price per hour
              <select
                value={filters.price}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, price: e.target.value }))
                }
              >
                <option value="">All</option>
                <option value="10">10$</option>
                <option value="20">20$</option>
                <option value="30">30$</option>
                <option value="40">40$</option>
              </select>
            </label>
          </div>

          <div className={styles.gridBox}>
            {visibleTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                isFavorite={favorites.includes(teacher.id)}
                onFavoriteClick={() => handleFavoriteClick(teacher.id)}
              />
            ))}
          </div>

          {(filteredTeachers.length > visibleTeachers.length || lastKey) && (
            <button
              className={styles.loadMoreBtn}
              onClick={handleLoadMore}
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

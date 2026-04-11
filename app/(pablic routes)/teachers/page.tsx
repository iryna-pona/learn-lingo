"use client";

import { useEffect, useState } from "react";
import { getTeachers, addFavorite, removeFavorite, getFavorites } from "@/lib/firebase/db";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { Teacher } from "@/types/teacher";
import { TeacherCard } from "@/components/TeacherCard/TeacherCard";
import styles from "./TeachersPage.module.css";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<(Teacher & { id: string })[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const perPage = 4;

  useEffect(() => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);

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

  useEffect(() => {   
    if (!user) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      const favs = await getFavorites(user.uid);
      setFavorites(favs);
    };

    fetchFavorites();
  }, [user]);

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

  const toggleFavorite = async (id: string) => {
  if (!user) {
    alert("This feature is available only for authorized users");
    return;
  }

  try {
    if (favorites.includes(id)) {
      await removeFavorite(user.uid, id);
      setFavorites(prev => prev.filter(f => f !== id));
    } else {
      await addFavorite(user.uid, id);
      setFavorites(prev => [...prev, id]);
    }
  } catch (err) {
    console.error(err);
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
                onFavoriteClick={() => toggleFavorite(teacher.id)}
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

        </div>
      </div>
    </div>
  );
}

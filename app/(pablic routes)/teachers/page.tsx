"use client";

import { useEffect, useState } from "react";
import { getTeachers } from "@/lib/firebase/db";
import { Teacher } from "@/types/teacher";
import { TeacherCard } from "@/components/TeacherCard/TeacherCard";
import styles from "./TeachersPage.module.css";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<(Teacher & { id: string })[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const perPage = 4;

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
              <TeacherCard key={teacher.id} teacher={teacher} />
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

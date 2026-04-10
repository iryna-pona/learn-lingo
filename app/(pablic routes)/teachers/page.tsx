"use client";

import { useEffect, useState } from "react";
import { getTeachers } from "@/lib/firebase/db";
import { Teacher } from "@/types/teacher";
import { TeacherCard } from "@/components/TeacherCard/TeacherCard";
import styles from "./TeachersPage.module.css";

export default function TeachersPage() {
  const [allTeachers, setAllTeachers] = useState<(Teacher & { id: string })[]>([]);
  const [visibleTeachers, setVisibleTeachers] = useState<(Teacher & { id: string })[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const perPage = 4;

  useEffect(() => {
    let isMounted = true;

    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const data = await getTeachers();

        if (!isMounted) return;

        setAllTeachers(data);
        setVisibleTeachers(data.slice(0, perPage));
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Something went wrong while loading teachers");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchTeachers();

    return () => {
      isMounted = false
    };
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setVisibleTeachers(allTeachers.slice(0, nextPage * perPage));
    setPage(nextPage);
  };

  if (loading) {
    return <p className={styles.message}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className="container">
    <div className={styles.page}>
      <div className={styles.grid}>
        {visibleTeachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
      {visibleTeachers.length < allTeachers.length && (
        <button
          className={styles.button}
          onClick={loadMore}
        >
          Load more
        </button>
      )}
      </div>
      </div>
  );
}

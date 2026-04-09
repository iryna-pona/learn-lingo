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
  const perPage = 4;

  useEffect(() => {
    const fetchTeachers = async () => {
      const data = await getTeachers();
      setAllTeachers(data);
      setVisibleTeachers(data.slice(0, perPage));
    };
    fetchTeachers();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setVisibleTeachers(allTeachers.slice(0, nextPage * perPage));
    setPage(nextPage);
  };

  return (
    <div className="teachers-page p-4">
      <h1 className="text-2xl font-bold mb-4">Teachers</h1>
      <div className="grid grid-cols-2 gap-4">
        {visibleTeachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
      {visibleTeachers.length < allTeachers.length && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={loadMore}
        >
          Load more
        </button>
      )}
    </div>
  );
}

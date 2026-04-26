"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bookingSchema } from "@/validation/bookingSchema";
import { Teacher } from "@/types/teacher";
import styles from "./BookingForm.module.css";

interface Props {
  teacher: Teacher;
  onClose?: () => void;
}

type FormData = {
  reason: string;
  fullName: string;
  email: string;
  phone: string;
};

export const BookingForm = ({ teacher }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(bookingSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: FormData) => {
    console.log({
      ...data,
      teacherId: teacher.id,
    });

    reset();
  };

  return (
    <>
      <h2 className={styles.title}>Book trial lesson</h2>

      <div className={styles.teacherBox}>
        <div className={styles.avatar}>
          <Image
            src={teacher.avatar_url}
            alt={`${teacher.name} ${teacher.surname}`}
            width={48}
            height={48}
          />
        </div>

        <div className={styles.teacherInfo}>
          <p className={styles.label}>Your teacher</p>
          <p className={styles.name}>
            {teacher.name} {teacher.surname}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

        <p className={styles.question}>
          What is your main reason for learning English?
        </p>

        <div className={styles.radioGroup}>
          {[
            "Career and business",
            "Lesson for kids",
            "Living abroad",
            "Exams and coursework",
            "Culture, travel or hobby",
          ].map((item) => (
            <label key={item} className={styles.radioItem}>
              <input
                type="radio"
                value={item}
                {...register("reason")}
                className={styles.hiddenRadio}
              />

              <span className={styles.customRadio}></span>

              <span className={styles.radioText}>{item}</span>
            </label>
          ))}
        </div>

        {errors.reason && (
          <p className={styles.error}>{errors.reason.message}</p>
        )}

        <input
          placeholder="Full Name"
          {...register("fullName")}
          className={styles.input}
        />
        {errors.fullName && (
          <p className={styles.error}>{errors.fullName.message}</p>
        )}

        <input
          placeholder="Email"
          {...register("email")}
          className={styles.input}
        />
        {errors.email && (
          <p className={styles.error}>{errors.email.message}</p>
        )}

        <input
          placeholder="Phone number"
          {...register("phone")}
          className={styles.input}
        />
        {errors.phone && (
          <p className={styles.error}>{errors.phone.message}</p>
        )}

        <button type="submit" className={styles.submitBtn}>
          Book
        </button>
      </form>
    </>
  );
};
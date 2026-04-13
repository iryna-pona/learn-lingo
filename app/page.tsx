import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.pageHome}>
      <div className={styles.infoBloсk}>
        <div className={styles.intro}>
          <h1 className={styles.title}>
            Unlock your potential with the best{" "}
            <span className={styles.titleSpan}>language</span> tutors
          </h1>
          <p className={styles.text}>
            Embark on an Exciting Language Journey with Expert Language Tutors:
            Elevate your language proficiency to new heights by connecting with
            highly qualified and experienced tutors.
          </p>
        </div>
        <Link className={styles.linkBtn} href="/teachers">
          Get started
        </Link>
      </div>
      <div className={styles.futerHome}>
        <a
          className={styles.primary}
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className={styles.logo}
            src="/vercel.svg"
            alt="Vercel logomark"
            width={16}
            height={16}
          />
          Deploy Now
        </a>
        <a
          className={styles.secondary}
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
      </div>
    </div>
  );
}

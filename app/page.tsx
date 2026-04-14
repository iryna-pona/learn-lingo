import Image from "next/image";
import styles from "./HomePage.module.css";
import Link from "next/link";

export default function HomePage() {
  const stats = [
    { value: "32,000+", label: "Experienced tutors" },
    { value: "300,000+", label: "5-star tutor reviews" },
    { value: "120+", label: "Subjects taught" },
    { value: "200+", label: "Tutor nationalities" },
  ];
  return (
    <div className={styles.conteiner}>
      <div className={styles.sectionHome}>
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
          <div className={styles.imageBloсk}>
            <Image
              src="/image/girl.png"
              alt=""
              width={339}
              height={339}
              className={styles.girl}
            />

            <Image
              src="/image/mac.png"
              alt=""
              width={360}
              height={176}
              className={styles.mac}
            />
          </div>
          <div className={styles.futerHome}>
            <ul className={styles.stats}>
              {stats.map((item, index) => (
                <li key={index} className={styles.items}>
                  <p className={styles.value}>{item.value}</p>
                  <span className={styles.label}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

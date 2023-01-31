import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Silk Touch Shop</title>
        <meta name="description" content="online-shop" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.categoriesbox}>
        <div className={styles.categorie}>
          <Link href="/about">Covers</Link>
        </div>
        <div className={styles.categorie}>
          <Link href="/about">Pillows</Link>
        </div>
      </div>
    </>
  );
}

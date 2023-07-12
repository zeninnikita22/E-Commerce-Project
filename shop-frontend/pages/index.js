import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Home.module.css";

export const getStaticProps = async () => {
  const result = await fetch("http://localhost:1337/api/categories");
  const data = await result.json();

  return {
    props: { categories: data },
  };
};

export default function Home({ categories }) {
  const categoriesArr = categories.data;
  return (
    <>
      <Head>
        <title>Silk Touch Shop</title>
        <meta name="description" content="online-shop" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.categoriesbox}>
        {categoriesArr.map((item) => {
          return (
            <Link key={item.id} href={`${item.attributes.name}`}>
              {item.attributes.name}
            </Link>
          );
        })}
        {/* <div className={styles.categorie}>
          <Link href="/about">Covers</Link>
        </div>
        <div className={styles.categorie}>
          <Link href="/about">Pillows</Link>
        </div> */}
      </div>
    </>
  );
}

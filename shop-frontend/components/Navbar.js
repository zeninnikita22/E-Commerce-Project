import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import logo from "../public/silk-touch-high-resolution-logo-color-on-transparent-background.png";
import styles from "../styles/Navbar.module.css";
import Head from "next/head";
import Link from "next/link";

function Navbar() {
  return (
    <div className={styles.navbar}>
      <Image src={logo} alt="Slik Touch Logo" width={180} height={100} />
      <div class={styles.navbaritems}>
        <div class={styles.shopdropdown}>
          <button class={styles.shopdropdown__button}>
            Shop
            <FontAwesomeIcon
              icon={faChevronDown}
              className={styles.arrowdown}
            />
          </button>
          <div class={styles.shopdropdown__content}>
            <Link href="/about" className={styles.dropdownlink}>
              Covers
            </Link>
            <Link href="/about" className={styles.dropdownlink}>
              Pillows
            </Link>
          </div>
        </div>
        <Link href="/about" className={styles.navbarlink}>
          About us
        </Link>
        <Link href="/contacts" className={styles.navbarlink}>
          Contacts
        </Link>
      </div>
    </div>
  );
}

export default Navbar;

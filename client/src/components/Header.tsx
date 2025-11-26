'use client';

import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.topBar}>
                <div className="container">
                    <div className={styles.authLinks}>
                        <Link href="/login">로그인</Link>
                        <Link href="/signup">회원가입</Link>
                        <Link href="/cart">장바구니</Link>
                    </div>
                </div>
            </div>

            <div className={styles.mainHeader}>
                <div className={`container ${styles.headerContent}`}>
                    <Link href="/" className={styles.logo}>
                        ATTRANGS
                    </Link>

                    <nav className={styles.nav}>
                        <Link href="/best">BEST</Link>
                        <Link href="/new">NEW</Link>
                        <Link href="/outer">OUTER</Link>
                        <Link href="/top">TOP</Link>
                        <Link href="/dress">DRESS</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

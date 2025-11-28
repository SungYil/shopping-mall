'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // 초기 로드 시 토큰 확인
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();

        // 로그인/로그아웃 이벤트 리스너 등록
        window.addEventListener('login', checkLoginStatus);
        window.addEventListener('logout', checkLoginStatus);

        return () => {
            window.removeEventListener('login', checkLoginStatus);
            window.removeEventListener('logout', checkLoginStatus);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('logout'));
        setIsLoggedIn(false);
        alert('로그아웃 되었습니다.');
        router.push('/');
    };

    return (
        <header className={styles.header}>
            <div className={styles.topBar}>
                <div className="container">
                    <div className={styles.authLinks}>
                        {isLoggedIn ? (
                            <>
                                <button onClick={handleLogout} className={styles.textButton}>로그아웃</button>
                                <Link href="/cart">장바구니</Link>
                                <Link href="/mypage">마이페이지</Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login">로그인</Link>
                                <Link href="/signup">회원가입</Link>
                                <Link href="/cart">장바구니</Link>
                            </>
                        )}
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

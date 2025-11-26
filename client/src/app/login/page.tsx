'use client';

import React from 'react';
import styles from './login.module.css';

export default function LoginPage() {
    const handleSocialLogin = (provider: 'google' | 'naver') => {
        // 백엔드 인증 엔드포인트로 이동
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        window.location.href = `${apiUrl}/auth/${provider}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>LOGIN</h1>
                <p className={styles.subtitle}>쇼핑몰에 오신 것을 환영합니다.</p>

                <div className={styles.buttonGroup}>
                    <button
                        className={`${styles.socialButton} ${styles.google}`}
                        onClick={() => handleSocialLogin('google')}
                    >
                        Google 계정으로 로그인
                    </button>

                    <button
                        className={`${styles.socialButton} ${styles.naver}`}
                        onClick={() => handleSocialLogin('naver')}
                    >
                        Naver 계정으로 로그인
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import styles from './CountdownTimer.module.css';

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState('');
    const [isToday, setIsToday] = useState(true);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const target = new Date();

            // 마감 시간: 오늘 오후 9시 (21:00)
            target.setHours(21, 0, 0, 0);

            // 현재 시간이 21시를 넘었으면 내일 21시로 설정
            if (now > target) {
                target.setDate(target.getDate() + 1);
                setIsToday(false);
            } else {
                setIsToday(true);
            }

            const diff = target.getTime() - now.getTime();

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        // 초기값 설정
        setTimeLeft(calculateTimeLeft());

        // 1초마다 갱신
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.badge}>
                🚀 아뜨배송
            </div>
            <div className={styles.message}>
                {isToday ? (
                    <>
                        오늘 출발까지 <span className={styles.timer}>{timeLeft}</span> 남았습니다!
                    </>
                ) : (
                    <>
                        지금 주문하면 <span className={styles.highlight}>내일 출발</span>합니다!
                    </>
                )}
            </div>
            <div className={styles.subMessage}>
                {isToday ? '내일 도착 예정' : '모레 도착 예정'}
            </div>
        </div>
    );
}
